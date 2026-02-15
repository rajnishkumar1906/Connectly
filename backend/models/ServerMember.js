import mongoose from "mongoose";

const serverMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "moderator", "member"],
      default: "member",
    },
    nickname: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

serverMemberSchema.index({ user: 1, server: 1 }, { unique: true });

export default mongoose.model("ServerMember", serverMemberSchema);
