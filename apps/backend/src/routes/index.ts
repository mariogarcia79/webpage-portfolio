import { Router }   from "express";
import authRoutes   from "./auth.routes";
import postsRoutes  from "./posts.routes";
import userRoutes   from "./users.routes";
import adminRoutes  from "./admin.routes";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = Router();

router.use( "/auth",  authRoutes);
router.use( "/posts", postsRoutes);
router.use( "/users", userRoutes);

router.use("/admin", authenticate, checkRole("admin"), adminRoutes);

export default router;