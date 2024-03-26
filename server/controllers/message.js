const Message = require("../models/message");
const Conversation = require("../models/conversation");
const pusherServer = require("../services/pusher");

const handleNewMessage = async (req, res) => {
  const { conversationId, sender, message, image } = req.body;
  try {
    let newMessage = await Message.create({
      conversationId,
      sender,
      body: message,
      image,
    });

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: newMessage._id },
        lastMessageAt: new Date(),
      },
      { new: true }
    )
      .populate("messages")
      .populate("userIds");

    const populatedMessage = await Message.findById(newMessage?._id)
      .populate("conversationId")
      .populate("sender")
      .populate("seen");

    // console.log(updatedConversation);

    await pusherServer.trigger(
      conversationId,
      "messages:new",
      populatedMessage
    );

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    // await pusherServer.trigger(conversationId, "message:last", lastMessage);

    updatedConversation.userIds.map((user) => {
      pusherServer.trigger(user.email, "conversation:update", {
        _id: conversationId,
        messages: [lastMessage],
      });
    });

    res.status(200).json(populatedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleAllMessagesForConversation = async (req, res) => {
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
};

module.exports = { handleNewMessage, handleAllMessagesForConversation };
