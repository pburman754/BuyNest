const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

const startConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "name email",
    });

    const userConversations = conversations.map((convo) => {
      const otherParticipant = convo.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      return {
        _id: convo._id,
        participant: otherParticipant,
        createdAt: convo.createdAt,
        updatedAt: convo.updatedAt,
      };
    });

    res.status(200).json(userConversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const messages = await Message.find({
      conversationId: conversationId,
    }).populate("sender", "name email");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { startConversation, getConversations, getMessages };
