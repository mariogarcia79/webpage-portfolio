import { Post } from "../types/post.js";

const posts: Post[] = [
  { id: 1, title: "First Post", summary: "First Post's summary", content: "First Post's content", createdAt: "Date" },
  { id: 2, title: "Second Post", summary: "Second Post's summary", content: "Second Post's content", createdAt: "Date" }
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostById(id: number): Post | undefined {
  return posts.find(post => post.id === id);
}