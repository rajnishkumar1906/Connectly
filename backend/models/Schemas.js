import mongoose from "mongoose";

/* ---------- POST SCHEMA ---------- */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    text: {
      type: String,
      trim: true,
      required: true
    },
    img: {
      type: Buffer,
      contentType: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

/* ---------- PROFILE SCHEMA ---------- */
const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  city: String,
  state: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true  
  }
});

/* ---------- MODELS ---------- */
export const Post = mongoose.model("Post", postSchema);
export const Profile = mongoose.model("Profile", profileSchema);
