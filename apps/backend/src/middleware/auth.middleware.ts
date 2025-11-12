import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'default_secret';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.name = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};