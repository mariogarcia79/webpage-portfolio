"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const userRole_1 = require("../types/userRole");
class AuthService {
    static async signUp(data) {
        return this._signUp({
            ...data,
            role: userRole_1.UserRole.USER
        });
    }
    static async signUpAdmin(data) {
        return this._signUp({
            ...data,
            role: userRole_1.UserRole.ADMIN
        });
    }
    static async _signUp(data) {
        try {
            const exists = await User_1.default.findOne({ email: data.email });
            if (exists) {
                console.error("email already registered");
                return null;
            }
            const newUser = new User_1.default({
                name: data.name,
                email: data.email,
                hash: data.hash,
                role: data.role
            });
            return await newUser.save();
        }
        catch (err) {
            console.error("Error: _signUp:", err);
            return null;
        }
    }
}
exports.default = AuthService;
