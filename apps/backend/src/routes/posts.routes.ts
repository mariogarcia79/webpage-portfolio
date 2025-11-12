import { Router } from "express";
import PostController from "../controllers/posts.controller"; // Importamos la clase PostController con métodos estáticos

const router = Router();

// Asignamos los métodos estáticos de PostController directamente a las rutas
router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.post("/", PostController.postPost);
router.patch("/:id", PostController.patchPostById);
router.delete("/:id", PostController.deletePostById);

export default router;
