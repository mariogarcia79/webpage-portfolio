"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const posts_service_1 = __importDefault(require("../services/posts.service"));
const validation_1 = require("../utils/validation");
const validation_2 = require("../config/validation");
class PostController {
    static async getAllPosts(req, res) {
        try {
            const posts = await posts_service_1.default.getAllPosts({ sorted: true });
            return res.json(posts);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: getAllPosts",
                error: err.message
            });
        }
    }
    static async getPostById(req, res) {
        const id = req.params.id;
        if (!(0, validation_1.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            const post = await posts_service_1.default.getPostById(id);
            if (!post) {
                return res
                    .status(404)
                    .json({ error: "Post not found" });
            }
            return res.json(post);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: getPostById",
                error: err.message
            });
        }
    }
    static async createPost(req, res) {
        const _id = req.user?._id;
        const { title, summary, content } = req.body;
        if (!(0, validation_1.isObjectId)(_id)) {
            return res
                .status(401)
                .json({ error: "Invalid or missing post" });
        }
        try {
            const cleanTitle = (0, validation_1.validateInput)(title, false, validation_2.MAX_TITLE_LENGTH);
            const cleanSummary = (0, validation_1.validateInput)(summary, false, validation_2.MAX_SUMMARY_LENGTH);
            const cleanContent = (0, validation_1.validateInput)(content, true, validation_2.MAX_CONTENT_LENGTH);
            const newPost = await posts_service_1.default.createPost({
                author: new mongoose_1.Types.ObjectId(_id),
                title: cleanTitle,
                summary: cleanSummary,
                content: cleanContent
            });
            if (!newPost) {
                return res
                    .status(500)
                    .json({ error: "Failed to create post" });
            }
            return res
                .status(201)
                .json(newPost);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: createPost",
                error: err.message
            });
        }
    }
    static async patchPostById(req, res) {
        const id = req.params.id;
        const body = {};
        if (!(0, validation_1.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            if (req.body.title !== undefined) {
                body.title = (0, validation_1.validateInput)(req.body.title, false, validation_2.MAX_TITLE_LENGTH);
            }
            if (req.body.summary !== undefined) {
                body.summary = (0, validation_1.validateInput)(req.body.summary, false, validation_2.MAX_SUMMARY_LENGTH);
            }
            if (req.body.content !== undefined) {
                body.content = (0, validation_1.validateInput)(req.body.content, true, validation_2.MAX_CONTENT_LENGTH);
            }
            const updatedPost = await posts_service_1.default.patchPostById(id, body);
            if (!updatedPost)
                return res.status(404).json({ error: "Post not found" });
            return res.json(updatedPost);
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: patchPostById",
                error: err.message
            });
        }
    }
    static async deletePostById(req, res) {
        const id = req.params.id;
        if (!(0, validation_1.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            const deleted = await posts_service_1.default.deletePostById(id);
            if (!deleted) {
                return res
                    .status(404)
                    .json({ error: "Post not found" });
            }
            return res
                .status(204)
                .send();
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                message: "Error: deletePostById",
                error: err.message
            });
        }
    }
}
exports.default = PostController;
