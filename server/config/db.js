const mongoose=require("mongoose");
const connectDB=async () =>{
    try{
        // Use a fallback MongoDB URI if environment variable is not set
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/marketgram";
        const conn= await mongoose.connect(mongoUri);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }catch(error){
        console.error(`MongoDB connection error: ${error.message}`);
        console.log("Starting server without database connection...");
        // Don't exit the process, let the server start without DB
    }
}
module.exports=connectDB;