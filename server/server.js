const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const Message = require("./models/messageModel");
const Conversation = require("./models/conversationModel");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("MarketGram API is running..."));

app.use("/api/users", userRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/conversations", conversationRoutes);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let activeUsers = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("setup", (userId) => {
    activeUsers[userId] = socket.id;
    console.log("User setup:", userId, "is", socket.id);
    io.emit("get-active-users", Object.keys(activeUsers));
  });

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room: ${conversationId}`);
  });

  socket.on("sendMessage", async ({ conversationId, senderId, body }) => {
    try {
      const newMessage = await Message.create({ conversationId, sender: senderId, body });
      const message = await newMessage.populate("sender", "name email");
      const conversation = await Conversation.findById(conversationId);
      const receiverId = conversation.participants.find(
        (p) => p.toString() !== senderId
      );

      const receiverSocketId = activeUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);
        socket.emit("receiverMessage", message);
      }
    } catch (error) {
      console.error("Error handling sendMessage:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    for (const userId in activeUsers) {
      if (activeUsers[userId] === socket.id) {
        delete activeUsers[userId];
        break;
      }
    }
    io.emit("get-active-users", Object.keys(activeUsers));
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
