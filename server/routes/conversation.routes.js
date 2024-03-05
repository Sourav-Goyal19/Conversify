const express = require("express");
const Conversation = require("../models/conversation");
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
      const conversations = await Conversation.find({ userIds: userId }).sort({
        lastMessageAt: -1,
      });

      return res.status(200).json(conversations);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  });

module.exports = router;
