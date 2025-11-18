import { Request, Response } from "express";
import { Types } from "mongoose";
import CommentService from "../services/comments.service";
import { sanitizeMarkdown, isObjectId } from "../utils/validation";
import { MAX_COMMENT_LENGTH } from "../config/validation";
import { IComment } from "../types/comment";

class CommentController {

  static async getAllComments(req: Request, res: Response): Promise<Response> {
    const postId = req.params.postId;

    if (!isObjectId(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    try {
      const comments = await CommentService.getAllComments({
        sorted: true,
        filter: { post: new Types.ObjectId(postId) }
      });

      return res.json(comments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error: getAllComments",
        error: (err as Error).message
      });
    }
  }

  static async getCommentById(req: Request, res: Response): Promise<Response> {
    const { postId, id } = req.params;

    if (!isObjectId(postId)) return res.status(400).json({ error: "Invalid post ID" });
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid comment ID" });

    try {
      const comment = await CommentService.getCommentById(id);

      if (!comment || comment.post.toString() !== postId) {
        return res.status(404).json({ error: "Comment not found in this post" });
      }

      return res.json(comment);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error: getCommentById",
        error: (err as Error).message
      });
    }
  }

  static async createComment(req: Request, res: Response): Promise<Response> {
    const userId = req.user?._id;
    const postId = req.params.postId;

    if (!userId || !isObjectId(userId)) {
      return res.status(401).json({ error: "Invalid or missing author" });
    }

    if (!postId || !isObjectId(postId)) {
      return res.status(400).json({ error: "Invalid or missing post" });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (content.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({
        error: `Content max ${MAX_COMMENT_LENGTH} chars`
      });
    }

    try {
      const newComment = await CommentService.createComment({
        author: new Types.ObjectId(userId),
        post: new Types.ObjectId(postId),
        content: sanitizeMarkdown(content),
      });

      if (!newComment) {
        return res.status(500).json({ error: "Failed to create comment" });
      }

      return res.status(201).json(newComment);

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error: createComment",
        error: (err as Error).message
      });
    }
  }

  static async patchCommentById(req: Request, res: Response): Promise<Response> {
    const { postId, id } = req.params;

    if (!isObjectId(postId)) return res.status(400).json({ error: "Invalid post ID" });
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid comment ID" });

    const body: Partial<IComment> = {};
    if (req.body.content) {
      body.content = sanitizeMarkdown(req.body.content);
    }

    try {
      const comment = await CommentService.getCommentById(id);

      if (!comment || comment.post.toString() !== postId) {
        return res.status(404).json({ error: "Comment not found in this post" });
      }

      const updatedComment = await CommentService.patchCommentById(id, body);
      return res.json(updatedComment);

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error: patchCommentById",
        error: (err as Error).message
      });
    }
  }

  static async deleteCommentById(req: Request, res: Response): Promise<Response> {
    const { postId, id } = req.params;

    if (!isObjectId(postId)) return res.status(400).json({ error: "Invalid post ID" });
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid comment ID" });

    try {
      const comment = await CommentService.getCommentById(id);

      if (!comment || comment.post.toString() !== postId) {
        return res.status(404).json({ error: "Comment not found in this post" });
      }

      await CommentService.deleteCommentById(id);
      return res.status(204).send();

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error: deleteCommentById",
        error: (err as Error).message
      });
    }
  }
}

export default CommentController;
