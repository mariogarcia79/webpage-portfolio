import { Router } from "express";
import { 
  getAllUsers, getUserById, getUserByName,
  patchUserById, deleteUserById 
} from "../controllers/users.controller.js"

const router = Router();

router.get("/", getAllUsers);
router.get("/id/:id", getUserById);
router.get("/name/:name", getUserByName);
router.patch("/:id", patchUserById);
router.delete("/:id", deleteUserById);

export default router;