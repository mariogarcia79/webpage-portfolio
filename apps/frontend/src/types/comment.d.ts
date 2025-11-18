export interface Comment {
  _id: string;
  author: User;
  post: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentUpdate {
  content?: string;
}
