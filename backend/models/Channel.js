import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["text", "voice"], default: "text" },
    topic: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", default: null },
  },
  { timestamps: true }
);

channelSchema.index({ server: 1, name: 1 }, { unique: true });

export default mongoose.model("Channel", channelSchema);
