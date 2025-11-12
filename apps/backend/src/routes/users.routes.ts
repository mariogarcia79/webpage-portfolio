import { Router } from "express";
import UserController from "../controllers/users.controller";

const router = Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.patch("/:id", UserController.patchUserById);
router.delete("/:id", UserController.deleteUserById);

export default router;
