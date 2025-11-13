import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "default_secret";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: "admin" | "user";
      email: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};

export function checkRole(...allowedRoles: ("admin" | "user")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.redirect("/login");
    }

    const role = req.user.role as "admin" | "user";

    if (!allowedRoles.includes(role)) {
      return res.status(403).send("No tienes permisos suficientes");
    }

    next();
  };
}
