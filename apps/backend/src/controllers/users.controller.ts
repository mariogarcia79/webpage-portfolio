import { Request, Response } from "express";
import UserService from "../services/users.service";

class UserController {

  // Obtener todos los usuarios con parámetros de filtro
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    const name = req.query.name as string;
    
    try {
      const users = await UserService.getAllUsers({ sorted: true, active: true, name });
      return res.json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching users", error: error.message });
      }
      // Si el error no es una instancia de Error, puedes retornar un mensaje genérico
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }

  // Obtener un usuario por su ID
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const user = await UserService.getUserById(req.params.id);
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

  // Actualizar un usuario por su ID
  static async patchUserById(req: Request, res: Response): Promise<Response> {
    try {
      const updatedUser = await UserService.patchUserById(req.params.id, req.body);
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

  // Eliminar un usuario por su ID (marcar como inactivo)
  static async deleteUserById(req: Request, res: Response): Promise<Response> {
    try {
      const isDeleted = await UserService.deleteUserById(req.params.id);
      if (!isDeleted) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(204).send();  // No content response
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
