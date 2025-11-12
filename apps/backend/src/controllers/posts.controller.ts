import { Request, Response } from "express";
import * as postService from "../services/posts.service";

export function getAllPosts(req: Request, res: Response) {
  res.json(postService.getAllPosts());
}

export function getPostById(req: Request, res: Response) {
  const post = postService.getPostById(req.params.id);
  if (!post) 
    return res.status(404).json({ error: "Post not found" });
  res.json(post);
}

export function postPost(req: Request, res: Response) {
  const { title, summary, content } = req.body;

  if (!title || !summary || !content) {
    return res.status(400).json({ error: "Title, summary and content are required" });
  }

  const newPost = postService.postPost( title, summary, content );
  res.status(201).json(newPost);
}

export function patchPostById(req: Request, res: Response) {
  const updated = postService.patchPostById(req.params.id, req.body);

  if (!updated)
    return res.status(404).json({ error: "Post not found" });

  res.json(updated);
}

export function deletePostById(req: Request, res: Response) {
  postService.deletePostById(req.params.id);
}