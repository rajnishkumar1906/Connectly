import express from "express";
import {
  getChannels,
  createChannel,
  getChannelMessages,
  sendChannelMessage,
} from "../controller/channelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/server/:serverId", getChannels);
router.post("/server/:serverId", createChannel);
router.get("/:channelId/messages", getChannelMessages);
router.post("/:channelId/messages", sendChannelMessage);

export default router;
