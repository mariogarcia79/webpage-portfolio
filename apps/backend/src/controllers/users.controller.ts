import { Request, Response } from "express";
import UserService from "../services/users.service";
import { escapeRegex, sanitizeText, isObjectId } from '../utils/validation';

class UserController {

  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    const name = req.query.name as string | undefined;

    try {
      let nameFilter: RegExp | undefined;
      if (name && typeof name === 'string') {
        const cleaned = sanitizeText(name);
        nameFilter = new RegExp(`^${escapeRegex(cleaned)}$`, 'i');
      }

      const users = await UserService.getAllUsers({ sorted: true, active: true, name: nameFilter as any });
      return res.json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching users", error: error.message });
      }
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!isObjectId(id)) return res.status(400).json({ error: 'Invalid user id' });

      const user = await UserService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching user", error: error.message });
      }
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }

  static async patchUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!isObjectId(id)) return res.status(400).json({ error: 'Invalid user id' });

      const body: any = {};
      if (req.body.name) body.name = sanitizeText(req.body.name);
      if (req.body.email) body.email = sanitizeText(req.body.email);
      if (req.body.role) body.role = sanitizeText(req.body.role);

      const updatedUser = await UserService.patchUserById(id, body);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(updatedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating user", error: error.message });
      }
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }

  static async deleteUserById(req: Request, res: Response): Promise<Response> {
    try {
      const isDeleted = await UserService.deleteUserById(req.params.id);
      if (!isDeleted) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user", error: error.message });
      }
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }
}

export default UserController;
