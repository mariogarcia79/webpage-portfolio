import { Router } from "express";
import entriesRoutes from "./entries.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "/" });
});

router.use("/entries", entriesRoutes);

router.use("/admin", adminRoutes);

export default router;