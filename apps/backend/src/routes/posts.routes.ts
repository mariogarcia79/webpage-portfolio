import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import PostController from "../controllers/posts.controller";

const router = Router();

router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.post("/", authenticate, PostController.postPost);
router.patch("/:id", authenticate, PostController.patchPostById);
router.delete("/:id", authenticate, PostController.deletePostById);

export default router;
