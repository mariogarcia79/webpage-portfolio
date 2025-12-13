"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const comments_controller_1 = __importDefault(require("../controllers/comments.controller"));
const router = (0, express_1.Router)();
router.get("/:postId", comments_controller_1.default.getAllComments);
router.get("/:postId/:id", comments_controller_1.default.getCommentById);
router.post("/:postId", auth_middleware_1.authenticate, comments_controller_1.default.createComment);
router.patch("/:postId/:id", auth_middleware_1.authenticate, auth_middleware_1.validateUserId, comments_controller_1.default.patchCommentById);
router.delete("/:postId/:id", auth_middleware_1.authenticate, auth_middleware_1.validateUserId, comments_controller_1.default.deleteCommentById);
exports.default = router;
