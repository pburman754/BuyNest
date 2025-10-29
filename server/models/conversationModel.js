const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    // This is the corrected 'participants' field
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;