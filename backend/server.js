import express from "express";
import dotenv from "dotenv";
// import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDb from "./config/db.js";
import userRouter from "./router/userRouter.js";
import feedRouter from "./router/feedRouter.js";
import cloudConfig from "./config/cloud_config.js";
// import initSocket from "./socket/index.js";

dotenv.config();

cloudConfig();
connectDb();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// const server = http.createServer(app);
// initSocket(server);


app.use("/api/users", userRouter);
app.use("/api/feed", feedRouter);

const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
