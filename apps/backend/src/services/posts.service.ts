import PostModel, { IPostDocument } from "../models/Post.js";

export async function getAllPosts(): Promise<IPostDocument[]> {
  return await PostModel.find({ published: true }).sort({ createdAt: -1 });
}

export async function getPostById(id: string): Promise<IPostDocument | null> {
  return await PostModel.findById(id);
}

export async function patchPostById(id: string, partial: Partial<IPostDocument>): Promise<IPostDocument | null> {
  const post = await PostModel.findByIdAndUpdate(id, partial, { new: true });
  return post;
}

export async function postPost(title: string, summary: string, content: string): Promise<IPostDocument> {
  const newPost = new PostModel({
    title,
    summary,
    content,
    createdAt: new Date(),
    published: true,
  });
  return await newPost.save();
}

export async function deletePostById(id: string): Promise<boolean> {
  const post = await PostModel.findById(id);
  if (!post) return false;

  post.published = false;
  await post.save();
  return true;
}
