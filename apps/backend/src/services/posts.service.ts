import PostModel, { IPostDocument } from "../models/Post";

class PostService {
  
  // Obtener todos los posts publicados, ordenados por fecha de creación (más recientes primero)
  static async getAllPosts(): Promise<IPostDocument[]> {
    return await PostModel.find({ published: true }).sort({ createdAt: -1 });
  }

  // Obtener un post por su ID
  static async getPostById(id: string): Promise<IPostDocument | null> {
    return await PostModel.findById(id);
  }

  // Actualizar un post por su ID
  static async patchPostById(id: string, partial: Partial<IPostDocument>): Promise<IPostDocument | null> {
    const post = await PostModel.findByIdAndUpdate(id, partial, { new: true });
    return post;
  }

  // Crear un nuevo post
  static async postPost(title: string, summary: string, content: string): Promise<IPostDocument> {
    const newPost = new PostModel({
      title,
      summary,
      content,
      createdAt: new Date(),
      published: true,
    });
    return await newPost.save();
  }

  // Eliminar un post por su ID (marcar como no publicado)
  static async deletePostById(id: string): Promise<boolean> {
    const post = await PostModel.findById(id);
    if (!post) return false;

    post.published = false;
    await post.save();
    return true;
  }
}

export default PostService;
