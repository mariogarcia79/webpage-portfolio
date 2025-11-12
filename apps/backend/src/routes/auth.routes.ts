import { Router } from "express";
import AuthController from "../controllers/auth.controller"; // Importa la clase con métodos estáticos

const router = Router();

// Asigna los métodos estáticos de AuthController directamente a las rutas
router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.logIn);

export default router;