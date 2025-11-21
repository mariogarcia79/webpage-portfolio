import { Router }   from "express";
import authRoutes   from "./auth.routes";
import postsRoutes  from "./posts.routes";
import userRoutes   from "./users.routes";
import commentsRoutes from "./comments.routes";
import uploadsRoutes from "./uploads.routes";

const router = Router();

router.use( "/auth",  authRoutes);
router.use( "/posts", postsRoutes);
router.use( "/users", userRoutes);
router.use( "/comments", commentsRoutes);
router.use( "/uploads", uploadsRoutes);

export default router;