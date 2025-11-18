import { Request, Response, NextFunction } from "express";
import UserService from "../services/users.service";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "default_secret";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: string;
      role: "admin" | "user";
      email: string;
    };
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      _id: string;
      role: "admin" | "user";
      email: string;
    };

    // Fetch user from database
    const user = await UserService.getUserById(decoded._id);
    if (!user) return res.status(401).json({ error: "Unauthorized: user not found" });

    // Check if the user is active
    if (!user.active) {
      return res.status(403).json({ error: "Unauthorized: user is inactive" });
    }

    req.user = {
      _id: user.id.toString(),
      role: user.role,
      email: user.email,
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const checkRole = (...allowedRoles: ("admin" | "user")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }

    next();
  };
};

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const routeUserId = req.params.id;

  if (req.user.role === "admin" || req.user._id === routeUserId) {
    return next();
  }

  return res.status(403).json({ error: "Forbidden: you cannot access this resource" });
};
