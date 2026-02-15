import mongoose from "mongoose";

const channelMessageSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: { type: String, required: true, trim: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("ChannelMessage", channelMessageSchema);
