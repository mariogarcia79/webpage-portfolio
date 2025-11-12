import { Router } from "express";
import { 
  getAllUsers, getUserById,
  patchUserById, deleteUserById 
} from "../controllers/users.controller"

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", patchUserById);
router.delete("/:id", deleteUserById);

export default router;