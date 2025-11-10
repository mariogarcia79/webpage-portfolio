import { Request, Response } from "express";
import * as postService from "../services/posts.service.js";

export function getAllPosts(req: Request, res: Response) {
  res.json(postService.getAllPosts());
}

export function getPostById(req: Request, res: Response) {
  const post = postService.getPostById(Number(req.params.id));
  if (!post) 
    return res.status(404).json({ error: "Post not found" });
  res.json(post);
}