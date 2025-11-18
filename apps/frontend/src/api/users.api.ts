import { API_BASE_URL } from "../constants/constants";
import { User, UserUpdate } from "../types/user";

export class UsersAPI {
  static async getUserById(_id: string, token: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error fetching user");
    return res.json();
  }

  static async updateUserById(data: Partial<UserUpdate>, token: string): Promise<User> {
    const _id = data._id;
    const res = await fetch(`${API_BASE_URL}/users/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error updating user");
    return res.json();
  }

  static async updateUserPassword(data: Partial<UserUpdate>, token: string): Promise<User> {
    const _id = data._id;
    const res = await fetch(`${API_BASE_URL}/users/pwd/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error changing password");
    return res.json();
  }

  static async deactivateUserById(_id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/${_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error deleting user");
  }
}

export default UsersAPI;