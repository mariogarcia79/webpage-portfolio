import { Router } from "express";
import { getAllEntries, getEntryById } from "../controllers/entries.controller.js";

const router = Router();

router.get("/", getAllEntries);
router.get("/:id", getEntryById);

export default router;