import { Router } from "express";
import { getAllEntries, getEntryById, patchEntryById } from "../controllers/admin.controller.js";

const router = Router();

router.get("/", getAllEntries);
router.get("/:id", getEntryById);

router.patch("/:id", patchEntryById);

export default router;