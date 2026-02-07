import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getFriends,
  checkFriend,
} from "../controller/connectionController.js";

const router = Router();

// GET /api/friends
router.get("/", authMiddleware, getFriends);

// GET /api/friends/check/:userId
router.get("/check/:userId", authMiddleware, checkFriend);

export default router;
