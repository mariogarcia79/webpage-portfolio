import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      name?: { userId: string }; // O cualquier tipo que desees
    }
  }
}