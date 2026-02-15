import express from "express";
import {
  getMyServers,
  createServer,
  getServer,
  getServerByInviteCode,
  joinServer,
  leaveServer,
  updateServer,
  getServerMembers,
  discoverServers,
} from "../controller/serverController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public: get server info by invite code (for join page) */
router.get("/invite/:code", getServerByInviteCode);

/* Protected */
router.use(authMiddleware);
router.get("/", getMyServers);
router.get("/discover", discoverServers);
router.post("/", createServer);
router.get("/:serverId", getServer);
router.patch("/:serverId", updateServer);
router.get("/:serverId/members", getServerMembers);
router.post("/join/:code", joinServer);
router.post("/:serverId/leave", leaveServer);

export default router;
