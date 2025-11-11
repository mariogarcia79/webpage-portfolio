import { Router } from "express";
import postsRoutes from "./posts.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ route: "/" });
});

router.use("/posts", postsRoutes);

router.use("/admin", adminRoutes);

export default router;