const express = require("express");
const router = express.Router();
const {
  startConversation,
  getConversations,
  getMessages,
} = require("../controllers/conversationControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, startConversation);
router.get("/", protect, getConversations);
router.get("/:id/messages", protect, getMessages);
module.exports = router;
