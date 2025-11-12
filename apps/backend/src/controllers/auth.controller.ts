import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import UserService from "../services/users.service";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || 'default_secret';

class AuthController {

  // Método estático para registrar un nuevo usuario
  static async signUp(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    // Validación de campos
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    try {
      // Crear nuevo usuario usando el servicio estático
      const newUser = await AuthService.signUp(name, email, password);
      return res.status(201).json(newUser);
    } catch (error: unknown) {
      console.error(error);
      // Comprobamos si el error es una instancia de Error
      if (error instanceof Error) {
        return res.status(500).json({ message: "Error creating user", error: error.message });
      }
      return res.status(500).json({ message: "Unknown error" });
    }
  }

  // Método estático para iniciar sesión de un usuario
  static async logIn(req: Request, res: Response): Promise<Response> {
    const { name, password } = req.body;

    try {
      // Obtener usuario por nombre
      const user = await UserService.getUserByName(name); // Usamos el método estático getUserByName

      // Verificar si el usuario existe
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Verificar la contraseña
      if (user.password !== password) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      // Crear JWT
      const token = jwt.sign({ userId: user.id.toString() }, secret, { expiresIn: '1h' });

      // Devolver el token
      return res.json({ token });
    } catch (error: unknown) {
      console.error(error);
      // Comprobamos si el error es una instancia de Error
      if (error instanceof Error) {
        return res.status(500).json({ message: 'Error processing the request', error: error.message });
      }
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
}

// Exportar la clase directamente
export default AuthController;
