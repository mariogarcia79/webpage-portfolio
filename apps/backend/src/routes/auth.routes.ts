import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup",  AuthController.signUp);
router.post("/login",   AuthController.logIn);

router.post("/signup-admin", authenticate, checkRole("admin"), AuthController.signUpAdmin);

router.get("/user", authenticate, AuthController.getUserInfo);

export default router;