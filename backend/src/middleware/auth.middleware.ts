import { Request, Response, NextFunction } from "express";
import UserService from "../services/users.service";
import jwt from "jsonwebtoken";
import { ERRORS, sendError } from "../config/errors";

const secret = process.env.JWT_SECRET || "default_secret";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const token = req.cookies.jwt;

  if (!token) {
    if (req.path.includes("/auth/user"))
      return res.json(null);
    return sendError(res, 'MISSING_AUTH_TOKEN');
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      _id: string;
      role: "admin" | "user";
      email: string;
    };

    const user = await UserService.getUserById(decoded._id);
    if (!user) {
      return sendError(res, 'USER_NOT_FOUND');
    }

    req.user = {
      _id: user.id.toString(),
      role: user.role,
      email: user.email,
    };
    
    next();
  } catch (err) {
    return sendError(res, 'INVALID_TOKEN');
  }
};

export const checkRole = (...allowedRoles: ("admin" | "user")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'FORBIDDEN');
    }

    next();
  };
};

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (!req.user) {
    return sendError(res, 'UNAUTHORIZED');
  }

  const routeUserId = req.params.id;

  if (req.user.role === "admin" ||
    req.user._id === routeUserId) {
    return next();
  }

  return sendError(res, 'FORBIDDEN');
};
