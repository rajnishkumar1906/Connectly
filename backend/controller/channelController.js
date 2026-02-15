import Channel from "../models/Channel.js";
import ChannelMessage from "../models/ChannelMessage.js";
import Server from "../models/Server.js";
import ServerMember from "../models/ServerMember.js";

/* ===== LIST CHANNELS IN A SERVER ===== */
export const getChannels = async (req, res) => {
  try {
    const { serverId } = req.params;
    const member = await ServerMember.findOne({
      user: req.user.userId,
      server: serverId,
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const channels = await Channel.find({ server: serverId }).sort({ order: 1, createdAt: 1 });
    res.json({ channels });
  } catch (err) {
    res.status(500).json({ message: "Failed to load channels" });
  }
};

/* ===== CREATE CHANNEL (admin/owner) ===== */
export const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { name, topic, type } = req.body;

    const member = await ServerMember.findOne({
      user: req.user.userId,
      server: serverId,
    });
    if (!member || !["owner", "admin"].includes(member.role))
      return res.status(403).json({ message: "No permission to create channel" });

    const count = await Channel.countDocuments({ server: serverId });
    const channel = await Channel.create({
      server: serverId,
      name: (name || "new-channel").trim().toLowerCase().replace(/\s+/g, "-"),
      type: type === "voice" ? "voice" : "text",
      topic: topic || "",
      order: count,
    });
    res.status(201).json({ channel });
  } catch (err) {
    res.status(500).json({ message: "Failed to create channel" });
  }
};

/* ===== GET CHANNEL MESSAGES (paginated) ===== */
export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate("server");
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const member = await ServerMember.findOne({
      user: req.user.userId,
      server: channel.server._id,
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const messages = await ChannelMessage.find({ channel: channelId })
      .populate("sender", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
};

/* ===== SEND CHANNEL MESSAGE (REST fallback; real-time via socket) ===== */
export const sendChannelMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { text } = req.body;
    const channel = await Channel.findById(channelId).populate("server");
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const member = await ServerMember.findOne({
      user: req.user.userId,
      server: channel.server._id,
    });
    if (!member) return res.status(403).json({ message: "Not a member" });
    if (channel.type !== "text") return res.status(400).json({ message: "Cannot send text to voice channel" });

    const msg = await ChannelMessage.create({
      channel: channelId,
      sender: req.user.userId,
      text: (text || "").trim(),
    });
    await msg.populate("sender", "username");
    res.status(201).json({ message: msg.toObject() });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

