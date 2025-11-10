import { Router } from "express";
import postsRoutes from "./posts.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "root" });
});

router.use("/posts", postsRoutes);

export default router;