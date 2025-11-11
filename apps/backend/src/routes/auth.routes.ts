import { Router } from "express";
import { postUser } from "../controllers/users.controller.js";

const router = Router();

router.post("/signup", postUser);
//router.post("/login", login);