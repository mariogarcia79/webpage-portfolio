import { Post } from "../types/post.js";

const posts: Post[] = [
  { id: 1, title: "First Post", summary: "First Post's summary", content: "First Post's content", createdAt: new Date(2025,10,11) },
  { id: 2, title: "Second Post", summary: "Second Post's summary", content: "Second Post's content", createdAt: new Date(2025,10,11) }
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostById(id: number): Post | undefined {
  return posts.find(post => post.id === id);
}

export function patchPostById(id: number, partial: Partial<Post>) {
  const post = getPostById(id);
  if (!post) return null;

  // Actualiza solo los campos enviados
  Object.assign(post, partial);

  return post;
}