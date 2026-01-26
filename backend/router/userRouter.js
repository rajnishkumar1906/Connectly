import { Router } from "express";
import {
  signUp,
  login,
  logout,
  showUsers,
  deleteUser
} from "../controller/userAuth.js";

import { retrieveProfileData, updateProfile } from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = Router();

// PUBLIC ROUTES
userRouter.post("/signup", signUp);
userRouter.post("/login", login);

// PROTECTED ROUTES
userRouter.post("/logout", authMiddleware, logout);
userRouter.get("/show-users", authMiddleware, showUsers);
userRouter.delete("/delete-user", authMiddleware, deleteUser);

// User profile data
userRouter.patch("/update-profile",authMiddleware,updateProfile);
userRouter.get("/retrieve-profile",authMiddleware,retrieveProfileData);

export default userRouter;