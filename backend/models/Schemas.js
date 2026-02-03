import mongoose from "mongoose";

const { Schema } = mongoose;

/* ---------- POST SCHEMA ---------- */
const postSchema = new Schema(
  {
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

/* ---------- FOLLOW SCHEMA ---------- */
const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

/* ---------- PROFILE SCHEMA ---------- */
const profileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNo: { type: String, required: true },
  city: String,
  state: String,
  bio: { type: String, default: "" },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

/* ---------- MODELS ---------- */
export const Post = mongoose.model("Post", postSchema);
export const Profile = mongoose.model("Profile", profileSchema);
export const Follow = mongoose.model("Follow", followSchema);
