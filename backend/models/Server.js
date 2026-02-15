import mongoose from "mongoose";

const serverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    icon: { type: String, default: "" },
    banner: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isPublic: { type: Boolean, default: true },
    category: { type: String, default: "General", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Server", serverSchema);
