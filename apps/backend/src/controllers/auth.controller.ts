import { Request, Response } from "express";
import { postUser } from "../services/auth.service";
import { getUserByName } from "../services/users.service";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || 'default_secret';

export function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  const newUser = postUser( name, email, password );
  res.status(201).json(newUser);
}

export async function logIn (req: Request, res: Response) {
  const { name, password } = req.body;

  try {
    const user = await getUserByName(name);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user.id.toString() }, secret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing the request' });
  }
};