import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🟢 MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("🔴 MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDb;
