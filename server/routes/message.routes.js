const express = require("express");
const {
  handleNewMessage,
  handleAllMessagesForConversation,
} = require("../controllers/message");
const router = express.Router();

router
  .post("/", handleNewMessage)
  .get("/:conversationId", handleAllMessagesForConversation);

module.exports = router;
