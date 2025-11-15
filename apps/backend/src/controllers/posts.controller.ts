import { Request, Response } from "express";
import PostService from "../services/posts.service";
import { sanitizeText, isObjectId } from '../utils/validation';
import { MAX_TITLE_LENGTH, MAX_SUMMARY_LENGTH, MAX_CONTENT_LENGTH } from '../config/validation';

class PostController {

  // Método estático para obtener todos los posts
  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    try {
      const posts = await PostService.getAllPosts(); // Usar el método del servicio para obtener los posts
      return res.json(posts);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({ message: "Error fetching posts", error: error.message });
      } else {
        console.error('Unknown error', error);
        return res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  // Método estático para obtener un post por su ID
  static async getPostById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!isObjectId(id)) return res.status(400).json({ error: 'Invalid post id' });

      const post = await PostService.getPostById(id); // Usar el servicio para obtener el post por ID
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json(post);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({ message: "Error fetching post", error: error.message });
      } else {
        console.error('Unknown error', error);
        return res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  // Método estático para crear un nuevo post
  static async postPost(req: Request, res: Response): Promise<Response> {
    const { title, summary, content } = req.body;

    // Basic validation
    if (!title || !summary || !content) {
      return res.status(400).json({ error: "Title, summary, and content are required" });
    }

  if (typeof title !== 'string' || title.length > MAX_TITLE_LENGTH) return res.status(400).json({ error: 'Invalid title' });
  if (typeof summary !== 'string' || summary.length > MAX_SUMMARY_LENGTH) return res.status(400).json({ error: 'Invalid summary' });
  if (typeof content !== 'string' || content.length > MAX_CONTENT_LENGTH) return res.status(400).json({ error: 'Invalid content' });

    const cleanTitle = sanitizeText(title);
    const cleanSummary = sanitizeText(summary);
    const cleanContent = sanitizeText(content);

    try {
      // Llamada al servicio para crear el post
  const newPost = await PostService.postPost(cleanTitle, cleanSummary, cleanContent); // Usar el servicio para crear el post
      return res.status(201).json(newPost);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({ message: "Error creating post", error: error.message });
      } else {
        console.error('Unknown error', error);
        return res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  // Método estático para actualizar un post por su ID
  static async patchPostById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!isObjectId(id)) return res.status(400).json({ error: 'Invalid post id' });

      // sanitize allowed fields
  const body: any = {};
  if (req.body.title) body.title = sanitizeText(req.body.title);
  if (req.body.summary) body.summary = sanitizeText(req.body.summary);
  if (req.body.content) body.content = sanitizeText(req.body.content);

      const updatedPost = await PostService.patchPostById(id, body); // Usar el servicio para actualizar el post
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json(updatedPost);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({ message: "Error updating post", error: error.message });
      } else {
        console.error('Unknown error', error);
        return res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  // Método estático para eliminar un post por su ID
  static async deletePostById(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await PostService.deletePostById(req.params.id); // Usar el servicio para eliminar el post
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(204).send(); // Responde con un status 204 No Content para indicar éxito
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({ message: "Error deleting post", error: error.message });
      } else {
        console.error('Unknown error', error);
        return res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }
}

// Exportar la clase PostController
export default PostController;
