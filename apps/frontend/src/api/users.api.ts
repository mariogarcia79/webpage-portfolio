import { API_BASE_URL } from "../constants/constants";

export interface User {
  userId: string;
  name: string;
  email: string;
  password?: string;
  role?: 'user' | 'admin';
}

export const getUserById = async (userId: string, token: string): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error fetching user");
  return res.json();
};

export const patchUserById = async (userId: string, data: Partial<User>, token: string): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error updating user");
  return res.json();
};

export const deleteUserById = async (userId: string, token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error deleting user");
};
