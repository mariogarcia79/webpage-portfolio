"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const comments_service_1 = __importDefault(require("../services/comments.service"));
const validation_1 = require("../config/validation");
const validation_2 = require("../utils/validation");
class CommentController {
    static async getAllComments(req, res) {
        const postId = req.params.postId;
        if (!(0, validation_2.isObjectId)(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            const comments = await comments_service_1.default.getAllComments({
                sorted: true,
                filter: { post: new mongoose_1.Types.ObjectId(postId) }
            });
            return res.json(comments);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: getAllComments",
                error: err.message
            });
        }
    }
    static async getCommentById(req, res) {
        const { postId, id } = req.params;
        if (!(0, validation_2.isObjectId)(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        if (!(0, validation_2.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: "Invalid comment ID" });
        }
        try {
            const comment = await comments_service_1.default.getCommentById(id);
            if (!comment || comment.post.toString() !== postId) {
                return res
                    .status(404)
                    .json({ error: "Comment not found in this post" });
            }
            return res.json(comment);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: getCommentById",
                error: err.message
            });
        }
    }
    static async createComment(req, res) {
        const userId = req.user?._id;
        const postId = req.params.postId;
        const { content } = req.body;
        if (!(0, validation_2.isObjectId)(userId)) {
            return res
                .status(401)
                .json({ error: "Invalid or missing author" });
        }
        if (!(0, validation_2.isObjectId)(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid or missing post" });
        }
        try {
            const cleanContent = (0, validation_2.validateInput)(content, false, validation_1.MAX_COMMENT_LENGTH);
            const newComment = await comments_service_1.default.createComment({
                author: new mongoose_1.Types.ObjectId(userId),
                post: new mongoose_1.Types.ObjectId(postId),
                content: cleanContent,
            });
            if (!newComment) {
                return res
                    .status(500)
                    .json({ error: "Failed to create comment" });
            }
            return res
                .status(201)
                .json(newComment);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: createComment",
                error: err.message
            });
        }
    }
    static async patchCommentById(req, res) {
        const { postId, id } = req.params;
        const body = {};
        if (!(0, validation_2.isObjectId)(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        if (!(0, validation_2.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: "Invalid comment ID" });
        }
        if (req.body.content !== undefined) {
            try {
                body.content = (0, validation_2.validateInput)(req.body.content, false, validation_1.MAX_COMMENT_LENGTH);
            }
            catch (err) {
                return res
                    .status(400)
                    .json({ error: err.message });
            }
        }
        try {
            const comment = await comments_service_1.default.getCommentById(id);
            if (!comment || comment.post.toString() !== postId) {
                return res
                    .status(404)
                    .json({ error: "Comment not found in this post" });
            }
            const updatedComment = await comments_service_1.default.patchCommentById(id, body);
            return res.json(updatedComment);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: patchCommentById",
                error: err.message
            });
        }
    }
    static async deleteCommentById(req, res) {
        const { postId, id } = req.params;
        if (!(0, validation_2.isObjectId)(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        if (!(0, validation_2.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: "Invalid comment ID" });
        }
        try {
            const comment = await comments_service_1.default.getCommentById(id);
            if (!comment || comment.post.toString() !== postId) {
                return res
                    .status(404)
                    .json({ error: "Comment not found in this post" });
            }
            await comments_service_1.default.deleteCommentById(id);
            return res
                .status(204)
                .send();
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: deleteCommentById",
                error: err.message
            });
        }
    }
}
exports.default = CommentController;
