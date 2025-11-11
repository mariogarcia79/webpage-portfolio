import { Router } from "express";
import { getAllPosts, getPostById, postPost, patchPostById, deletePostById } from "../controllers/posts.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/posts/", postPost);
router.patch("/posts/:id", patchPostById);
router.delete("/posts/:id", deletePostById);

export default router;