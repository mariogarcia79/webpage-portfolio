import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();


router.post("/create-admin", AuthController.signUpAdmin);
//TODO: Get logs
//TODO: Settings

export default router;