import UserService from "../services/users.service";
import { escapeRegex, isObjectId, validateName, validateEmail, validatePassword } from '../utils/validation';
import { UserRole } from "../types/userRole";
class UserController {
    static async getAllUsers(req, res) {
        const queryName = req.query.name;
        const queryRole = req.query.role;
        const filter = {};
        try {
            if (queryName) {
                const cleanName = validateName(queryName);
                filter.name = {
                    $regex: new RegExp(escapeRegex(cleanName), 'i')
                };
            }
            if (queryRole && ![UserRole.ADMIN, UserRole.USER]
                .includes(queryRole)) {
                return res
                    .status(400)
                    .json({ error: "Invalid role filter" });
            }
            if (queryRole) {
                filter.role = queryRole;
            }
            const users = await UserService.getAllUsers({ sorted: true, filter });
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
        if (!isObjectId(id))
            return res.status(400).json({ error: 'Invalid user ID' });
        try {
            const user = await UserService.getUserById(id);
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
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid user ID' });
        }
        if (req.body.role && ![UserRole.ADMIN, UserRole.USER]
            .includes(req.body.role)) {
            return res
                .status(400)
                .json({ error: "Invalid role" });
        }
        try {
            const cleanName = req.body.name ?
                validateName(req.body.name) :
                undefined;
            const cleanEmail = req.body.email ?
                validateEmail(req.body.email) :
                undefined;
            const cleanRole = req.body.role ?
                req.body.role :
                undefined;
            body.name = cleanName || undefined;
            body.email = cleanEmail || undefined;
            body.role = cleanRole || undefined;
            const updatedUser = await UserService.patchUserById(id, body);
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
        if (!isObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        try {
            const cleanPassword = validatePassword(newPassword);
            const isUpdated = await UserService
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
        if (!isObjectId(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid user ID' });
        }
        try {
            const isDeleted = await UserService.deleteUserById(id);
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
export default UserController;
