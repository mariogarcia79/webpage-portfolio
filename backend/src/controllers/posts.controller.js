import { Types } from "mongoose";
import PostService from "../services/posts.service";
import { validateInput, isObjectId } from "../utils/validation";
import { MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH, MAX_SUMMARY_LENGTH } from "../config/validation";
class PostController {
    static async getAllPosts(req, res) {
        try {
            const posts = await PostService.getAllPosts({ sorted: true });
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
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            const post = await PostService.getPostById(id);
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
        if (!isObjectId(_id)) {
            return res
                .status(401)
                .json({ error: "Invalid or missing post" });
        }
        try {
            const cleanTitle = validateInput(title, false, MAX_TITLE_LENGTH);
            const cleanSummary = validateInput(summary, false, MAX_SUMMARY_LENGTH);
            const cleanContent = validateInput(content, true, MAX_CONTENT_LENGTH);
            const newPost = await PostService.createPost({
                author: new Types.ObjectId(_id),
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
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            const cleanTitle = validateInput(req.body.title, false, MAX_TITLE_LENGTH);
            const cleanSummary = validateInput(req.body.summary, false, MAX_SUMMARY_LENGTH);
            const cleanContent = validateInput(req.body.content, true, MAX_CONTENT_LENGTH);
            const updatedPost = await PostService.patchPostById(id, body);
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
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            const deleted = await PostService.deletePostById(id);
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
export default PostController;
