"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validation_1 = require("../utils/validation");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const users_service_1 = __importDefault(require("../services/users.service"));
const secret = process.env.JWT_SECRET || "default_secret";
class AuthController {
    static async signUp(req, res) {
        const { name, email, password } = req.body;
        try {
            const cleanName = (0, validation_1.validateName)(name);
            const cleanEmail = (0, validation_1.validateEmail)(email);
            const cleanPassword = (0, validation_1.validatePassword)(password);
            const hashedPassword = await bcryptjs_1.default.hash(cleanPassword, 10);
            const newUser = await auth_service_1.default.signUp({
                name: cleanName,
                email: cleanEmail,
                hash: hashedPassword
            });
            if (!newUser) {
                return res
                    .status(400)
                    .json({ error: "User could not be created" });
            }
            return res
                .status(201)
                .json(newUser);
        }
        catch (err) {
            if (err instanceof Error)
                return res.status(400).json({ error: err.message });
            return res.status(400).json({ error: "Unknown signup error" });
        }
    }
    static async signUpAdmin(req, res) {
        const { name, email, password } = req.body;
        try {
            const cleanName = (0, validation_1.validateName)(name);
            const cleanEmail = (0, validation_1.validateEmail)(email);
            const cleanPassword = (0, validation_1.validatePassword)(password);
            const hashedPassword = await bcryptjs_1.default.hash(cleanPassword, 10);
            const newUser = await auth_service_1.default.signUpAdmin({
                name: cleanName,
                email: cleanEmail,
                hash: hashedPassword
            });
            if (!newUser) {
                return res
                    .status(400)
                    .json({ error: "User could not be created" });
            }
            return res
                .status(201)
                .json(newUser);
        }
        catch (err) {
            if (err instanceof Error)
                return res.status(400).json({ error: err.message });
            return res.status(400).json({ error: "Unknown signup error" });
        }
    }
    static async logIn(req, res) {
        const { name, password } = req.body;
        try {
            const cleanName = (0, validation_1.validateName)(name);
            const cleanPassword = (0, validation_1.validatePassword)(password);
            const user = await users_service_1.default.getUserByName(cleanName);
            if (!user) {
                return res
                    .status(400)
                    .json({ error: "User not found" });
            }
            const isMatch = await bcryptjs_1.default.compare(cleanPassword, user.hash);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ error: "Incorrect password" });
            }
            const token = jsonwebtoken_1.default.sign({
                _id: user._id,
                role: user.role,
                email: user.email
            }, secret, { expiresIn: "1h" });
            res.cookie("jwt", token, {
                maxAge: 1000 * 60 * 60, // 1 hour
                secure: process.env.NODE_ENV === "production", // require HTTPS in prod
                httpOnly: true,
                sameSite: "strict",
            });
            return res.json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        catch (err) {
            console.error(err);
            if (err instanceof Error) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
    static async getUserInfo(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const user = await users_service_1.default.getUserById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(500).json({ error: "Unknown error" });
        }
    }
    static async logout(req, res) {
        res.clearCookie("jwt");
        return res.json({ message: "Logged out successfully" });
    }
}
exports.default = AuthController;
