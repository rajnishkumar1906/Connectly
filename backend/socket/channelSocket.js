import ChannelMessage from "../models/ChannelMessage.js";
import Channel from "../models/Channel.js";
import ServerMember from "../models/ServerMember.js";

const channelSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinChannel", (channelId) => {
      socket.join(`channel_${channelId}`);
    });

    socket.on("leaveChannel", (channelId) => {
      socket.leave(`channel_${channelId}`);
    });

    socket.on("sendChannelMessage", async ({ channelId, sender, text }) => {
      try {
        const channel = await Channel.findById(channelId).populate("server");
        if (!channel) return;
        const member = await ServerMember.findOne({
          user: sender,
          server: channel.server._id,
        });
        if (!member || channel.type !== "text") return;

        const msg = await ChannelMessage.create({
          channel: channelId,
          sender,
          text: (text || "").trim(),
        });
        await msg.populate("sender", "username");
        const payload = msg.toObject();
        io.to(`channel_${channelId}`).emit("receiveChannelMessage", payload);
      } catch (err) {
        console.error("channelSocket sendChannelMessage", err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

export default channelSocket;
