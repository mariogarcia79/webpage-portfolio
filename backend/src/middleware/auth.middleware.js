import UserService from "../services/users.service";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "default_secret";
export const authenticate = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res
            .status(401)
            .json({ error: "Missing authentication token" });
    }
    try {
        const decoded = jwt.verify(token, secret);
        const user = await UserService.getUserById(decoded._id);
        if (!user) {
            return res
                .status(401)
                .json({ error: "Unauthorized: user not found" });
        }
        req.user = {
            _id: user.id.toString(),
            role: user.role,
            email: user.email,
        };
        next();
    }
    catch (err) {
        return res
            .status(401)
            .json({ error: "Invalid or expired token" });
    }
};
export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res
                .status(401)
                .json({ error: "Unauthorized" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ error: "Forbidden: insufficient permissions" });
        }
        next();
    };
};
export const validateUserId = (req, res, next) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ error: "Unauthorized" });
    }
    const routeUserId = req.params.id;
    if (req.user.role === "admin" ||
        req.user._id === routeUserId) {
        return next();
    }
    return res
        .status(403)
        .json({ error: "Forbidden: you cannot access this resource" });
};
