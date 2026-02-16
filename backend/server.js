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
import serverRouter from "./router/serverRouter.js";
import channelRouter from "./router/channelRouter.js";

import chatSocket from "./socket/chatSocket.js";
import channelSocket from "./socket/channelSocket.js";

dotenv.config();

/* ================= INIT CONFIG ================= */
cloudConfig();
connectDb();

const app = express();

/* ✅ REQUIRED FOR DEPLOY (cookies + proxy) */
app.set("trust proxy", 1);

/* ================= MIDDLEWARE ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ✅ ONLY USE TEMP IN DEV */
if (process.env.NODE_ENV !== "production") {
  app.use("/temp", express.static("temp"));
}

/* ================= ROUTES ================= */
app.use("/api/users", userRouter);
app.use("/api/feed", feedRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/chat", chatRouter);
app.use("/api/servers", serverRouter);
app.use("/api/channels", channelRouter);

/* ================= HEALTH CHECK (REQUIRED) ================= */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ================= SOCKET ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

chatSocket(io);
channelSocket(io);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
