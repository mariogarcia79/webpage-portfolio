import { Router } from "express";
import { getAllPosts, getPostById, postPost, patchPostById, deletePostById } from "../controllers/posts.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", postPost);
router.patch("/:id", patchPostById);
router.delete("/:id", deletePostById);

export default router;