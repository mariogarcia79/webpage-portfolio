import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();


router.post("/signup-admin", AuthController.createAdmin);

//TODO: Get self information
//TODO: Post about me

export default router;