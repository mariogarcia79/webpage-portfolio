import { Request, Response } from "express";
import * as postService from "../services/posts.service.js";
import * as adminService from "../services/admin.service.js";
import * as aboutService from "../services/about.service.js";

export async function getAdminDashboard(req: Request, res: Response) {
  const [admin, about] = await Promise.all([
    adminService.getAdminInfo(),
    aboutService.getAboutInfo()
  ]);

  res.json({ admin, about });
}

export function getAllPosts(req: Request, res: Response) {
  res.json(postService.getAllPosts());
}

export function getPostById(req: Request, res: Response) {
  const post = postService.getPostById(Number(req.params.id));
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
  const id = Number(req.params.id);
  const updated = postService.patchPostById(id, req.body);

  if (!updated)
    return res.status(404).json({ error: "Post not found" });

  res.json(updated);
}

export function deletePostById(req: Request, res: Response) {
  const id = Number(req.params.id);
  postService.deletePostById(id);
}