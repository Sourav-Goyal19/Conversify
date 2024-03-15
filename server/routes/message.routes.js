const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Conversation = require("../models/conversation");

router
  .post("/", async (req, res) => {
    const { conversationId, sender, message, image } = req.body;
    try {
      const newMessage = await Message.create({
        conversationId,
        sender,
        body: message,
        image,
      });
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $push: { messages: newMessage._id } },
        { new: true }
      );
      res.status(200).json(newMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .get("/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    try {
      const messages = await Message.find({ conversationId })
        .populate("seen")
        .populate("sender")
        .sort({ createdAt: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json(error);
    }
  });

module.exports = router;
