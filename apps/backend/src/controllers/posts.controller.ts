import { Request, Response } from "express";
import { Types } from "mongoose";
import PostService from "../services/posts.service";
import { sanitizeText, sanitizeMarkdown, isObjectId } from "../utils/validation";
import { MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH, MAX_SUMMARY_LENGTH } from "../config/validation";
import { IPost } from "../types/post";

class PostController {

  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    try {
      const posts = await PostService.getAllPosts({ sorted: true });
      return res.json(posts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error: getAllPosts", error: (err as Error).message });
    }
  }

  static async getPostById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid post ID" });

    try {
      const post = await PostService.getPostById(id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error: getPostById", error: (err as Error).message });
    }
  }

  static async createPost(req: Request, res: Response): Promise<Response> {
    const _id = req.user?._id;
    if (!_id || !isObjectId(_id)) return res.status(401).json({ error: "Invalid or missing post" });

    const { title, summary, content } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ error: "Title, summary and content are required" });
    }

    if (title.length > MAX_TITLE_LENGTH) return res.status(400).json({ error: `Content max ${MAX_TITLE_LENGTH} chars` });
    if (summary.length > MAX_SUMMARY_LENGTH) return res.status(400).json({ error: `Content max ${MAX_SUMMARY_LENGTH} chars` });
    if (content.length > MAX_CONTENT_LENGTH) return res.status(400).json({ error: `Content max ${MAX_CONTENT_LENGTH} chars` });

    try {
      const newPost = await PostService.createPost({
        author: new Types.ObjectId(_id),
        title: sanitizeText(title),
        summary: sanitizeText(summary),
        content: sanitizeMarkdown(content),
      });

      if (!newPost) return res.status(500).json({ error: "Failed to create post" });
      return res.status(201).json(newPost);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error: createPost", error: (err as Error).message });
    }
  }

  static async patchPostById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid post ID" });

    const body: Partial<IPost> = {};
    if (req.body.title) body.title = sanitizeText(req.body.title);
    if (req.body.summary) body.summary = sanitizeText(req.body.summary);
    if (req.body.content) body.content = sanitizeMarkdown(req.body.content);

    try {
      const updatedPost = await PostService.patchPostById(id, body);
      if (!updatedPost) return res.status(404).json({ error: "Post not found" });
      return res.json(updatedPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error: patchPostById", error: (err as Error).message });
    }
  }

  static async deletePostById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid post ID" });

    try {
      const deleted = await PostService.deletePostById(id);
      if (!deleted) return res.status(404).json({ error: "Post not found" });
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error: deletePostById", error: (err as Error).message });
    }
  }

}

export default PostController;
