import { Router } from "express";
import UserController from "../controllers/users.controller";
import { authenticate, checkRole, validateUserId } from "../middleware/auth.middleware";

const router = Router();

router.get(   "/",    authenticate, checkRole("admin"), UserController.getAllUsers);

router.get(   "/:id", authenticate, validateUserId, UserController.getUserById);
router.patch( "/:id", authenticate, validateUserId, UserController.patchUserById);
router.delete("/:id", authenticate, validateUserId, UserController.deactivateUserById);

router.patch( "/pwd/:id", authenticate, validateUserId, UserController.updateUserPassword);

export default router;
