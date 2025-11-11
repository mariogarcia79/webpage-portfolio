import { Router } from "express";
import authRoutes from "./auth.routes.js";
import postsRoutes from "./posts.routes.js";
import userRoutes from "./users.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ route: "/" });
});

/*
router.use("/admin", (req, res) => {
  
});
*/

router.get("/auth",  authRoutes);
router.use("/posts", postsRoutes);
router.use("/users", userRoutes);

export default router;