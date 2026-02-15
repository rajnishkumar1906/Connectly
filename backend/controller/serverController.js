import Server from "../models/Server.js";
import ServerMember from "../models/ServerMember.js";
import Channel from "../models/Channel.js";

const generateInviteCode = () =>
  Math.random().toString(36).slice(2, 10);

/* ===== LIST MY SERVERS ===== */
export const getMyServers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const memberships = await ServerMember.find({ user: userId })
      .populate("server")
      .sort({ createdAt: -1 });
    const servers = memberships
      .filter((m) => m.server)
      .map((m) => ({ ...m.server.toObject(), role: m.role }));
    res.json({ servers });
  } catch (err) {
    res.status(500).json({ message: "Failed to load servers" });
  }
};

/* ===== CREATE SERVER ===== */
export const createServer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description, icon, isPublic, category } = req.body;

    let inviteCode = generateInviteCode();
    let exists = await Server.findOne({ inviteCode });
    while (exists) {
      inviteCode = generateInviteCode();
      exists = await Server.findOne({ inviteCode });
    }

    const server = await Server.create({
      name: name || "My Server",
      description: description || "",
      icon: icon || "",
      isPublic: isPublic !== false,
      category: category || "General",
      owner: userId,
      inviteCode,
    });

    await ServerMember.create({ user: userId, server: server._id, role: "owner" });

    const defaultChannel = await Channel.create({
      server: server._id,
      name: "general",
      type: "text",
      order: 0,
    });

    const serverObj = server.toObject();
    serverObj.defaultChannelId = defaultChannel._id;
    res.status(201).json({ server: serverObj });
  } catch (err) {
    res.status(500).json({ message: "Failed to create server" });
  }
};

/* ===== GET SERVER BY ID ===== */
export const getServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId)
      .populate("owner", "username");
    if (!server) return res.status(404).json({ message: "Server not found" });

    const member = await ServerMember.findOne({
      user: req.user.userId,
      server: server._id,
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    res.json({ server: { ...server.toObject(), role: member.role } });
  } catch (err) {
    res.status(500).json({ message: "Failed to load server" });
  }
};

/* ===== GET SERVER BY INVITE CODE (public info for join page) ===== */
export const getServerByInviteCode = async (req, res) => {
  try {
    const server = await Server.findOne({ inviteCode: req.params.code })
      .populate("owner", "username");
    if (!server) return res.status(404).json({ message: "Invite invalid or expired" });
    res.json({ server: server.toObject() });
  } catch (err) {
    res.status(500).json({ message: "Failed to load invite" });
  }
};

/* ===== JOIN SERVER VIA INVITE ===== */
export const joinServer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const server = await Server.findOne({ inviteCode: req.params.code });
    if (!server) return res.status(404).json({ message: "Invite invalid or expired" });

    const existing = await ServerMember.findOne({ user: userId, server: server._id });
    if (existing) return res.json({ server: server.toObject(), alreadyMember: true });

    await ServerMember.create({ user: userId, server: server._id, role: "member" });
    res.json({ server: server.toObject() });
  } catch (err) {
    res.status(500).json({ message: "Failed to join server" });
  }
};

/* ===== LEAVE SERVER ===== */
export const leaveServer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const serverId = req.params.serverId;
    const member = await ServerMember.findOne({ user: userId, server: serverId });
    if (!member) return res.status(404).json({ message: "Not a member" });
    if (member.role === "owner") return res.status(400).json({ message: "Owner cannot leave; transfer or delete server first" });
    await ServerMember.deleteOne({ _id: member._id });
    res.json({ message: "Left server" });
  } catch (err) {
    res.status(500).json({ message: "Failed to leave server" });
  }
};

/* ===== UPDATE SERVER (owner/admin) ===== */
export const updateServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    if (!server) return res.status(404).json({ message: "Server not found" });
    const member = await ServerMember.findOne({ user: req.user.userId, server: server._id });
    if (!member || !["owner", "admin"].includes(member.role))
      return res.status(403).json({ message: "No permission" });

    const { name, description, icon, isPublic, category } = req.body;
    if (name != null) server.name = name;
    if (description != null) server.description = description;
    if (icon != null) server.icon = icon;
    if (typeof isPublic === "boolean") server.isPublic = isPublic;
    if (category != null) server.category = category;
    await server.save();
    res.json({ server: server.toObject() });
  } catch (err) {
    res.status(500).json({ message: "Failed to update server" });
  }
};

/* ===== LIST MEMBERS ===== */
export const getServerMembers = async (req, res) => {
  try {
    const members = await ServerMember.find({ server: req.params.serverId })
      .populate("user", "username")
      .sort({ role: 1, createdAt: 1 });
    res.json({ members });
  } catch (err) {
    res.status(500).json({ message: "Failed to load members" });
  }
};

/* ===== DISCOVER PUBLIC SERVERS ===== */
export const discoverServers = async (req, res) => {
  try {
    const category = req.query.category;
    const q = { isPublic: true };
    if (category) q.category = category;
    const servers = await Server.find(q)
      .populate("owner", "username")
      .limit(50)
      .lean();
    res.json({ servers });
  } catch (err) {
    res.status(500).json({ message: "Failed to discover servers" });
  }
};
