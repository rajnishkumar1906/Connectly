import express from "express";
import { getChatMessages, sendMessage } from "../controller/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:chatId", getChatMessages);
router.post("/send", sendMessage);

export default router;
