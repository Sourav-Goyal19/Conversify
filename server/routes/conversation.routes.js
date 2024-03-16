const express = require("express");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const router = express.Router();

router
  .post("/", async (req, res) => {
    const { mainUserId, userId, isGroup, members, name } = req.body;
    if (!mainUserId) {
      return res.status(401).json({ msg: "Unauthorized User" });
    }

    if (isGroup && (!members || members.length < 0)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    // if (isGroup) {
    //   const newConversation = await Conversation.create({
    //     name,
    //     isGroup,
    //     userIds: [mainUserId, ...members.map((member) => {

    //     })],
    //   })
    // }

    try {
      const existingConversation = await Conversation.find({
        userIds: { $all: [mainUserId, userId] },
      });
      const singleConversation = existingConversation[0];
      if (singleConversation) {
        return res.status(200).json({
          msg: "Successfully Fetched",
          conversation: singleConversation,
        });
      }

      const newConversation = await Conversation.create({
        userIds: [mainUserId, userId],
      });
      return res.status(200).json({
        msg: "Conversation Created Successfully",
        conversation: newConversation,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .get("/all", async (req, res) => {
    const { userId } = req.query;
    try {
      const conversations = await Conversation.find({
        userIds: userId,
      })
        .populate("messages")
        .populate("userIds")
        .sort({ lastMessageAt: -1 });

      return res.status(200).json(conversations);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const conversation = await Conversation.findById(id)
        .populate("messages")
        .populate("userIds");
      return res.status(200).json(conversation);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .post("/:conversationId/seen", async (req, res) => {
    const { conversationId } = req.params;
    const { currentUserId } = req.body;
    if (!conversationId || !currentUserId)
      return res.status(400).json({ msg: "Invalid Data" });
    try {
      const conversation = await Conversation.findById(conversationId)
        .populate("messages")
        .populate("userIds");
      console.log("Conversation:", conversation);

      if (!conversation) return res.status(400).json({ msg: "Invalid Id" });

      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      console.log("Last Message: ", lastMessage);

      if (!lastMessage) return res.status(400).json({ msg: "No Messages" });

      if (lastMessage.seen.includes(currentUserId))
        return res.status(200).json(lastMessage);

      const updatedMessage = await Message.findByIdAndUpdate(
        lastMessage?._id,
        { $push: { seen: currentUserId } },
        { new: true }
      );
      console.log("Updated Message: ", updatedMessage);

      return res.status(200).json(updatedMessage);
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .delete("/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    try {
      const conversation = await Conversation.findByIdAndDelete(conversationId);
      return res.status(200).json(conversation);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Something Went Wrong" });
    }
  });

module.exports = router;
