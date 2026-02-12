import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDb from "./config/db.js";
import cloudConfig from "./config/cloud_config.js";

import userRouter from "./router/userRouter.js";
import feedRouter from "./router/feedRouter.js";
import friendsRouter from "./router/friendsRouter.js";
import notificationRouter from "./router/notificationRouter.js";
import chatRouter from "./router/chatRouter.js";

import chatSocket from "./socket/chatSocket.js";

dotenv.config();

/* ================= INIT CONFIG ================= */
cloudConfig();
connectDb();

const app = express();

/* ================= MIDDLEWARE ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://frontend:3000", // Docker frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ✅ ADD THIS (required for avatar/cover) */
app.use("/temp", express.static("temp"));

/* ================= ROUTES ================= */
app.use("/api/users", userRouter);
app.use("/api/feed", feedRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/chat", chatRouter);

/* ================= SOCKET ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

chatSocket(io);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
