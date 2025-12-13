"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.checkRole)("admin"), users_controller_1.default.getAllUsers);
router.get("/:id", auth_middleware_1.authenticate, auth_middleware_1.validateUserId, users_controller_1.default.getUserById);
router.patch("/:id", auth_middleware_1.authenticate, auth_middleware_1.validateUserId, users_controller_1.default.patchUserById);
router.delete("/:id", auth_middleware_1.authenticate, auth_middleware_1.validateUserId, users_controller_1.default.deleteUserById);
router.patch("/pwd/:id", auth_middleware_1.authenticate, auth_middleware_1.validateUserId, users_controller_1.default.updateUserPassword);
exports.default = router;
