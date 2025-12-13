"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = exports.checkRole = exports.authenticate = void 0;
const users_service_1 = __importDefault(require("../services/users.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "default_secret";
const authenticate = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res
            .status(401)
            .json({ error: "Missing authentication token" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await users_service_1.default.getUserById(decoded._id);
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
exports.authenticate = authenticate;
const checkRole = (...allowedRoles) => {
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
exports.checkRole = checkRole;
const validateUserId = (req, res, next) => {
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
exports.validateUserId = validateUserId;
