export interface User {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  _id: string;
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}