import { Post } from "../types/post.js";

const posts: Post[] = [
  { id: 1, title: "First Post", summary: "First Post's summary", content: "First Post's content", createdAt: new Date(2025,6,7), published: true },
  { id: 2, title: "Second Post", summary: "Second Post's summary", content: "Second Post's content", createdAt: new Date(2025,10,11), published: true }
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
  Object.assign(post, partial);
  return post;
}

export function postPost(title: string, summary: string, content: string) {
  const newPost: Post = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    title: title,
    summary: summary,
    content: content,
    createdAt: new Date(),
    published: true
  };
  posts.push(newPost);
  return newPost;
}

export function deletePostById(id: number) {
    const post = getPostById(id);
  if (!post) return false;

  post.published = false;
  return true;
}