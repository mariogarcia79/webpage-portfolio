import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: "admin" | "user";
        email: string;
      };
    }
  }
}