import { createPost } from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";

// Create a post
userRouter.post("/create-post",authMiddleware,createPost)

