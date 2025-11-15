import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import UserService from "../services/users.service";
import { isValidEmail, sanitizeText } from '../utils/validation';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const secret = process.env.JWT_SECRET || "default_secret";

class AuthController {

  static async signUp(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email);

    try {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await AuthService.signUp(cleanName, cleanEmail, hashedPassword);
      return res.status(201).json(newUser);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ message: "Error creating user", error: error.message });
      }
      return res.status(500).json({ message: "Unknown error" });
    }
  }

  static async createAdmin(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email);

    try {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await AuthService.createAdmin(cleanName, cleanEmail, hashedPassword);
      return res.status(201).json(newUser);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ message: "Error creating user", error: error.message });
      }
      return res.status(500).json({ message: "Unknown error" });
    }
  }

  static async logIn(req: Request, res: Response): Promise<Response> {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    try {
      const cleanName = sanitizeText(name);
      const user = await UserService.getUserByName(cleanName);

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.hash);

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role as "admin" | "user", email: user.email },
        secret,
        { expiresIn: '1h' }
      );

      return res.json({ token });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ message: 'Error processing the request', error: error.message });
      }
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
}

export default AuthController;
