import { Router } from "express";
import UserController from "../controllers/users.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = Router();

router.get(   "/",    authenticate, checkRole("admin"), UserController.getAllUsers);

//TODO: Verify only THE user and admin can do these operations
router.get(   "/:id", authenticate, UserController.getUserById);
router.patch( "/:id", authenticate, UserController.patchUserById);
router.delete("/:id", authenticate, UserController.deleteUserById);

export default router;
