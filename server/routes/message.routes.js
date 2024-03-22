const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Conversation = require("../models/conversation");

router
  .post("/", async (req, res) => {
    const { conversationId, sender, message, image } = req.body;
    try {
      let newMessage = await Message.create({
        conversationId,
        sender,
        body: message,
        image,
      });

      // console.log("New Message 1", newMessage);

      const populatedMessage = await Message.findById(newMessage?._id).populate(
        "conversationId"
      );

      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $push: { messages: newMessage._id } },
        { new: true }
      );

      // console.log("New Message 2", populatedMessage);

      res.status(200).json(populatedMessage);
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
        .populate("conversationId")
        .sort({ createdAt: 1 });
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

module.exports = router;
