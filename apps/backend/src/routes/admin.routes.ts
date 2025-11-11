import { Router } from "express";
import { getAdminDashboard } from "../controllers/admin.controller.js";
import postsRoutes from "./posts.routes.js"

const router = Router();

router.get("/", getAdminDashboard);
router.get("/posts", postsRoutes);

export default router;