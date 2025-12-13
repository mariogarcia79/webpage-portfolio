import express, { Router } from "express";
import path from "path";
import { authenticate, checkRole } from "../middleware/auth.middleware";
import UploadController from "../controllers/uploads.controller";
import { upload } from "../middleware/uploads.middleware";

const router = Router();

router.use(   "/",      express.static(path.join(__dirname, "../../public/uploads")));
router.post(  "/",      authenticate, checkRole("admin"), upload.single("file"), UploadController.uploadFile);
router.delete("/:url",  authenticate, checkRole("admin"), UploadController.deleteUpload);

export default router;