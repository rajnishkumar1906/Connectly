import { ChatRoom } from "../models/Schemas.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", async ({ chatId, sender, text }) => {
      try {
        const message = {
          sender,
          text,
          createdAt: new Date(),
        };

        const [user1, user2] = chatId.split("_");

        await ChatRoom.findOneAndUpdate(
          { chatId },
          { 
            $push: { messages: message },
            $setOnInsert: { users: [user1, user2] }
          },
          { upsert: true }
        );

        io.to(chatId).emit("receiveMessage", message);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};

export default chatSocket;
