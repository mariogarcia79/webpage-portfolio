import { Request, Response } from "express";
import UserService from "../services/users.service";
import { escapeRegex, sanitizeText, isObjectId, isValidEmail } from '../utils/validation';
import { UserRole } from "../types/userRole";
import { IUser } from "../types/user";
import { FilterQuery } from "mongoose";

class UserController {
  
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const queryName = req.query.name as string | undefined;
      const queryRole = req.query.role as string | undefined;
      
      const filter: FilterQuery<IUser> = { };
      
      if (queryName) {
        const safeName = sanitizeText(queryName);
        filter.name = new RegExp(`^${escapeRegex(safeName)}$`, "i");
      }
      
      if (queryRole && (queryRole === UserRole.USER || queryRole === UserRole.ADMIN)) {
        filter.role = queryRole;
      }
      
      const users = await UserService.getAllUsers({ sorted: true, filter });
      return res.json(users);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error : "Error: getAllUsers: Unknown error");
      return res.status(500).json({ message: "Error: getAllUsers:", error: (error as Error)?.message || "Error: getAllUsers: Unknown error" });
    }
  }
  
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!isObjectId(id)) return res.status(400).json({ error: 'Invalid user ID' });
      
      const user = await UserService.getUserById(id);
      if (!user) return res.status(404).json({ error: "User not found" });
      
      return res.json(user);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error : "Error: getUserById: Unknown error");
      return res.status(500).json({ message: "Error: getUserById:", error: (error as Error)?.message || "Error: getUserById: Unknown error" });
    }
  }
  
  static async patchUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!isObjectId(id)) return res.status(400).json({ error: 'Error: patchUserById: Invalid user ID' });
      
      const body: Partial<IUser> = {};
      
      if (req.body.name) body.name = sanitizeText(req.body.name);
      if (req.body.email && isValidEmail(req.body.email)) body.email = sanitizeText(req.body.email);
      if (req.body.role && (req.body.role === UserRole.USER || req.body.role === UserRole.ADMIN)) {
        body.role = req.body.role;
      }
      
      const updatedUser = await UserService.patchUserById(id, body);
      if (!updatedUser) return res.status(404).json({ error: "Error: patchUserById: User not found" });
      
      return res.json(updatedUser);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error : "Error: patchUserById: Unknown error");
      return res.status(500).json({ message: "Error: patchUserById:", error: (error as Error)?.message || "Error: patchUserById: Unknown error" });
    }
  }
  
  static async updateUserPassword(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const { currentPassword, newPassword } = req.body;
      
      if (!isObjectId(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json({ error: 'currentPassword and newPassword are required and must be strings' });
      }
      
      const isUpdated = await UserService.updateUserPassword(id, currentPassword, newPassword);
      
      if (!isUpdated) {
        return res.status(400).json({ error: 'Failed to update password: invalid current password or user not found' });
      }
      
      return res.json({ message: 'Password updated successfully' });
    } catch (error: unknown) {
      console.error(error instanceof Error ? error : 'Error: updateUserPassword: Unknown error');
      return res.status(500).json({ message: 'Error: updateUserPassword', error: (error as Error)?.message || 'Unknown error' });
    }
  }
  
  static async deleteUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!isObjectId(id)) return res.status(400).json({ error: 'Error: deleteUserById: Invalid user ID' });
      
      const isDeleted = await UserService.deleteUserById(id);
      if (!isDeleted) return res.status(404).json({ error: "Error: deleteUserById: User not found" });
      
      return res.status(204).send();
    } catch (error: unknown) {
      console.error(error instanceof Error ? error : "Unknown error");
      return res.status(500).json({ message: "Error: deleteUserById:", error: (error as Error)?.message || "Error: deleteUserById: Unknown error" });
    }
  }
}

export default UserController;
