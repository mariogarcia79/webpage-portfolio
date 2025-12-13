"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../services/users.service"));
const validation_1 = require("../utils/validation");
const userRole_1 = require("../types/userRole");
class UserController {
    static async getAllUsers(req, res) {
        const queryName = req.query.name;
        const queryRole = req.query.role;
        const filter = {};
        try {
            if (queryName) {
                const cleanName = (0, validation_1.validateName)(queryName);
                filter.name = {
                    $regex: new RegExp((0, validation_1.escapeRegex)(cleanName), 'i')
                };
            }
            if (queryRole && ![userRole_1.UserRole.ADMIN, userRole_1.UserRole.USER]
                .includes(queryRole)) {
                return res
                    .status(400)
                    .json({ error: "Invalid role filter" });
            }
            if (queryRole) {
                filter.role = queryRole;
            }
            const users = await users_service_1.default.getAllUsers({ sorted: true, filter });
            return res.json(users);
        }
        catch (error) {
            console.error(error instanceof Error ? error : "Unknown error");
            return res
                .status(500)
                .json({
                message: "Error: getAllUsers:",
                error: error?.message
            });
        }
    }
    static async getUserById(req, res) {
        const id = req.params.id;
        if (!(0, validation_1.isObjectId)(id))
            return res.status(400).json({ error: 'Invalid user ID' });
        try {
            const user = await users_service_1.default.getUserById(id);
            if (!user) {
                return res
                    .status(404)
                    .json({ error: "User not found" });
            }
            return res.json(user);
        }
        catch (error) {
            console.error(error instanceof Error ? error : "Unknown error");
            return res.status(500).json({
                message: "Error: getUserById:",
                error: error?.message
            });
        }
    }
    static async patchUserById(req, res) {
        const id = req.params.id;
        const body = {};
        if (!(0, validation_1.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid user ID' });
        }
        if (req.body.role && ![userRole_1.UserRole.ADMIN, userRole_1.UserRole.USER]
            .includes(req.body.role)) {
            return res
                .status(400)
                .json({ error: "Invalid role" });
        }
        try {
            const cleanName = req.body.name ?
                (0, validation_1.validateName)(req.body.name) :
                undefined;
            const cleanEmail = req.body.email ?
                (0, validation_1.validateEmail)(req.body.email) :
                undefined;
            const cleanRole = req.body.role ?
                req.body.role :
                undefined;
            body.name = cleanName || undefined;
            body.email = cleanEmail || undefined;
            body.role = cleanRole || undefined;
            const updatedUser = await users_service_1.default.patchUserById(id, body);
            if (!updatedUser) {
                return res
                    .status(404)
                    .json({ error: "User not found" });
            }
            return res.json(updatedUser);
        }
        catch (error) {
            console.error(error instanceof Error ? error : "Unknown error");
            return res
                .status(500)
                .json({
                message: "Error: patchUserById:",
                error: error?.message
            });
        }
    }
    static async updateUserPassword(req, res) {
        const id = req.params.id;
        const { currentPassword, newPassword } = req.body;
        if (!(0, validation_1.isObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        try {
            const cleanPassword = (0, validation_1.validatePassword)(newPassword);
            const isUpdated = await users_service_1.default
                .updateUserPassword(id, currentPassword, cleanPassword);
            if (!isUpdated) {
                return res
                    .status(400)
                    .json({ error: 'Invalid current password or user not found' });
            }
            return res.json({ message: 'Password updated successfully' });
        }
        catch (error) {
            console.error(error instanceof Error ? error : "Unknown error");
            return res
                .status(500)
                .json({
                message: 'Error: updateUserPassword',
                error: error?.message
            });
        }
    }
    static async deleteUserById(req, res) {
        const id = req.params.id;
        if (!(0, validation_1.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid user ID' });
        }
        try {
            const isDeleted = await users_service_1.default.deleteUserById(id);
            if (!isDeleted) {
                return res
                    .status(404)
                    .json({ error: "User not found" });
            }
            return res
                .status(204)
                .send();
        }
        catch (error) {
            console.error(error instanceof Error ? error : "Unknown error");
            return res
                .status(500)
                .json({
                message: "Error: deleteUserById:",
                error: error?.message
            });
        }
    }
}
exports.default = UserController;
