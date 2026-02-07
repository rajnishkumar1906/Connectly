import mongoose from "mongoose";

const { Schema } = mongoose;

/* =========================================================
   POST SCHEMA
========================================================= */
const postSchema = new Schema(
  {
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/* =========================================================
   FOLLOW SCHEMA
========================================================= */
const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate follow
followSchema.index({ follower: 1, following: 1 }, { unique: true });

/* =========================================================
   PROFILE SCHEMA
========================================================= */
const profileSchema = new Schema(
  {
    profilePicture: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    bio: { type: String, default: "" },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* =========================================================
   FRIENDSHIP SCHEMA
========================================================= */
const friendShipsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

/* =========================================================
   CHAT ROOM SCHEMA (LIVE CHAT READY)
========================================================= */
const chatRoomSchema = new Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
        },

        seen: {
          type: Boolean,
          default: false,
        },

        delivered: {
          type: Boolean,
          default: false,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/* =========================================================
   EXPORT MODELS
========================================================= */

export const Post = mongoose.model("Post", postSchema);
export const Profile = mongoose.model("Profile", profileSchema);
export const Follow = mongoose.model("Follow", followSchema);
export const FriendShips = mongoose.model("FriendShips", friendShipsSchema);
export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
