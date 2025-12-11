import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import {
  validateEmail,
  validateName,
  validatePassword
} from '../utils/validation';

import AuthService from "../services/auth.service";
import UserService from "../services/users.service";


const secret = process.env.JWT_SECRET || "default_secret";


class AuthController {

  static async signUp(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    
    try {
      const cleanName = validateName(name);
      const cleanEmail = validateEmail(email);
      const cleanPassword = validatePassword(password);

      const hashedPassword = await bcrypt.hash(cleanPassword, 10);
      const newUser = await AuthService.signUp({
        name: cleanName,
        email: cleanEmail,
        hash: hashedPassword
      });

      if (!newUser) {
        return res
          .status(400)
          .json( { error: "User could not be created" });
      }

      return res
        .status(201)
        .json(newUser);

    } catch (err: unknown) {
      if (err instanceof Error)
        return res.status(400).json({ error: err.message });
      return res.status(400).json({ error: "Unknown signup error" });
    }
  }

  static async signUpAdmin(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    
    try {
      const cleanName = validateName(name);
      const cleanEmail = validateEmail(email);
      const cleanPassword = validatePassword(password);

      const hashedPassword = await bcrypt.hash(cleanPassword, 10);
      const newUser = await AuthService.signUpAdmin({
        name: cleanName,
        email: cleanEmail,
        hash: hashedPassword
      });

      if (!newUser) {
        return res
          .status(400)
          .json( { error: "User could not be created" });
      }

      return res
        .status(201)
        .json(newUser);

    } catch (err: unknown) {
      if (err instanceof Error)
        return res.status(400).json({ error: err.message });
      return res.status(400).json({ error: "Unknown signup error" });
    }
  }
  
  static async logIn(req: Request, res: Response): Promise<Response> {
    const { name, password } = req.body;
    
    try {
      const cleanName = validateName(name);
      const cleanPassword = validatePassword(password);

      const user = await UserService.getUserByName(cleanName);
      
      if (!user) {
        return res
          .status(400)
          .json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(cleanPassword, user.hash);

      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Incorrect password" });
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
      
      res.cookie("jwt", { token }, 
        {
          maxAge: 1000 * 60 * 5,
          secure: false,            // CHANGE THIS BEFORE DEPLOY
          httpOnly: true,
          sameSite: "strict"
        })

      return res.json({ message: "set cookie" });

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: "Unknown error" });
    }
  }

  static async getUserInfo(req: Request, res: Response): Promise<Response> {
    const user = res.cookie.arguments;
    console.log(user);
    return res.json(user);
  }
}

export default AuthController;
