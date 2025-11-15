import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();


router.post("/create-admin", AuthController.createAdmin);
//TODO: Get logs
//TODO: Settings

export default router;