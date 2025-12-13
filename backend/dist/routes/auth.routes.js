"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.default.signUp);
router.post("/login", auth_controller_1.default.logIn);
router.post("/logout", auth_controller_1.default.logout);
router.post("/signup-admin", auth_middleware_1.authenticate, (0, auth_middleware_1.checkRole)("admin"), auth_controller_1.default.signUpAdmin);
router.get("/user", auth_middleware_1.authenticate, auth_controller_1.default.getUserInfo);
exports.default = router;
