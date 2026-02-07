import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
} from "../controller/notificationController.js";

const router = Router();

// GET /api/notifications
router.get("/", authMiddleware, getNotifications);

// PATCH /api/notifications/:notificationId/read
router.patch("/:notificationId/read", authMiddleware, markAsRead);

export default router;
