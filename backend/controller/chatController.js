import { ChatRoom } from "../models/Schemas.js";

/* FETCH CHAT HISTORY */
export const getChatMessages = async (req, res) => {
  try {
    const chat = await ChatRoom.findOne({ chatId: req.params.chatId });
    res.json({ messages: chat?.messages || [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat" });
  }
};

/* SEND MESSAGE (REST fallback) */
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const sender = req.user.userId;

    const chatId =
      sender < receiverId
        ? `${sender}_${receiverId}`
        : `${receiverId}_${sender}`;

    const message = { sender, text };

    await ChatRoom.findOneAndUpdate(
      { chatId },
      { 
        $push: { messages: message },
        $setOnInsert: { users: [sender, receiverId] }
      },
      { upsert: true }
    );

    res.json({ message });
  } catch (err) {
    res.status(500).json({ message: "Send failed" });
  }
};
