import { Types } from "mongoose";
import CommentService from "../services/comments.service";
import { MAX_COMMENT_LENGTH } from "../config/validation";
import { validateInput, isObjectId } from "../utils/validation";
class CommentController {
    static async getAllComments(req, res) {
        const postId = req.params.postId;
        if (!isObjectId(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        try {
            const comments = await CommentService.getAllComments({
                sorted: true,
                filter: { post: new Types.ObjectId(postId) }
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
        if (!isObjectId(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: "Invalid comment ID" });
        }
        try {
            const comment = await CommentService.getCommentById(id);
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
        if (!isObjectId(userId)) {
            return res
                .status(401)
                .json({ error: "Invalid or missing author" });
        }
        if (!isObjectId(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid or missing post" });
        }
        try {
            const cleanContent = validateInput(content, false, MAX_COMMENT_LENGTH);
            const newComment = await CommentService.createComment({
                author: new Types.ObjectId(userId),
                post: new Types.ObjectId(postId),
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
        if (!isObjectId(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: "Invalid comment ID" });
        }
        if (req.body.content !== undefined) {
            try {
                body.content = validateInput(req.body.content, false, MAX_COMMENT_LENGTH);
            }
            catch (err) {
                return res
                    .status(400)
                    .json({ error: err.message });
            }
        }
        try {
            const comment = await CommentService.getCommentById(id);
            if (!comment || comment.post.toString() !== postId) {
                return res
                    .status(404)
                    .json({ error: "Comment not found in this post" });
            }
            const updatedComment = await CommentService.patchCommentById(id, body);
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
        if (!isObjectId(postId)) {
            return res
                .status(400)
                .json({ error: "Invalid post ID" });
        }
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: "Invalid comment ID" });
        }
        try {
            const comment = await CommentService.getCommentById(id);
            if (!comment || comment.post.toString() !== postId) {
                return res
                    .status(404)
                    .json({ error: "Comment not found in this post" });
            }
            await CommentService.deleteCommentById(id);
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
export default CommentController;
