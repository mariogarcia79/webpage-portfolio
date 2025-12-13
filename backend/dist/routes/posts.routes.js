"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const posts_controller_1 = __importDefault(require("../controllers/posts.controller"));
const router = (0, express_1.Router)();
router.get("/", posts_controller_1.default.getAllPosts);
router.get("/:id", posts_controller_1.default.getPostById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.checkRole)("admin"), posts_controller_1.default.createPost);
router.patch("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.checkRole)("admin"), posts_controller_1.default.patchPostById);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.checkRole)("admin"), posts_controller_1.default.deletePostById);
exports.default = router;
