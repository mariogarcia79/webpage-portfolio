import { Router } from "express";
import authRoutes from "./auth.routes";
import postsRoutes from "./posts.routes";
import userRoutes from "./users.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({ route: "/" });
});

router.use("/auth",  authRoutes);
router.use("/posts", postsRoutes);
router.use("/users", userRoutes);

export default router;