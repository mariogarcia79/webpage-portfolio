import { Request, Response } from "express";
import PostService from "../services/posts.service";

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
      const post = await PostService.getPostById(req.params.id); // Usar el servicio para obtener el post por ID
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

    // Validación de los parámetros
    if (!title || !summary || !content) {
      return res.status(400).json({ error: "Title, summary, and content are required" });
    }

    try {
      // Llamada al servicio para crear el post
      const newPost = await PostService.postPost(title, summary, content); // Usar el servicio para crear el post
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
      const updatedPost = await PostService.patchPostById(req.params.id, req.body); // Usar el servicio para actualizar el post
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
