import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import UserService from "../services/users.service";
import { isValidEmail, sanitizeText } from '../utils/validation';
import { MIN_PASSWORD_LENGTH, MIN_NAME_LENGTH } from '../config/validation';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const secret = process.env.JWT_SECRET || "default_secret";

class AuthController {
  
  static async signUp(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length < MIN_NAME_LENGTH) {
      return res.status(400).json({ error: `Name is required and must be at least ${MIN_NAME_LENGTH} characters` });
    }
    
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    
    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email);
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await AuthService.signUp({
        name: cleanName,
        email: cleanEmail,
        hash: hashedPassword
      });
      
      if (!newUser) {
        return res.status(400).json({ error: "User could not be created (email might already exist)" });
      }
      
      return res.status(201).json(newUser);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: "Unknown error" });
    }
  }
  
  static async signUpAdmin(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length < MIN_NAME_LENGTH) {
      return res.status(400).json({ error: `Name is required and must be at least ${MIN_NAME_LENGTH} characters` });
    }
    
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    
    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email);
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await AuthService.signUpAdmin({
        name: cleanName,
        email: cleanEmail,
        hash: hashedPassword
      });
      
      if (!newUser) {
        return res.status(400).json({ error: "Admin user could not be created" });
      }
      
      return res.status(201).json(newUser);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: "Unknown error" });
    }
  }
  
  static async logIn(req: Request, res: Response): Promise<Response> {
    const { name, password } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length < MIN_NAME_LENGTH) {
      return res.status(400).json({ error: `Name is required and must be at least ${MIN_NAME_LENGTH} characters` });
    }
    
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: "Password is required" });
    }
    
    try {
      const cleanName = sanitizeText(name);
      const user = await UserService.getUserByName(cleanName);
      
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      
      if (!user.active) {
        return res.status(403).json({ error: "User account is inactive" });
      }
      
      const isMatch = await bcrypt.compare(password, user.hash);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }
      
      const token = jwt.sign(
        { 
          _id: user._id,
          role: user.role,
          email: user.email
        },
        secret,
        { expiresIn: "1h" }
      );
      
      return res.json({ token });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: "Unknown error" });
    }
  }
}

export default AuthController;
