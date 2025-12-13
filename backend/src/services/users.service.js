import bcrypt from "bcryptjs";
import UserModel from "../models/User";
import { isObjectId, sanitizeText, sanitizeMongoInput, escapeRegex, isValidEmail } from "../utils/validation";
class UserService {
    static buildFilter(filter) {
        const mongoFilter = {};
        if (!filter)
            return mongoFilter;
        const allowedFields = ["name", "email", "role"];
        for (const key of allowedFields) {
            const value = filter[key];
            if (value == null)
                continue;
            if (typeof value === "boolean") {
                mongoFilter[key] = value;
                continue;
            }
            if (typeof value === "string") {
                const safeStr = sanitizeMongoInput(sanitizeText(value));
                if (key === "email" && !isValidEmail(safeStr))
                    continue;
                mongoFilter[key] = new RegExp(escapeRegex(safeStr), "i");
                continue;
            }
            if (value instanceof RegExp) {
                mongoFilter[key] = value;
            }
        }
        return mongoFilter;
    }
    static async getAllUsers({ sorted = true, filter }) {
        const mongoFilter = this.buildFilter(filter);
        const sortOrder = {
            name: sorted ? "asc" : "desc"
        };
        return UserModel.find(mongoFilter).sort(sortOrder);
    }
    static async getUserById(id) {
        if (!isObjectId(id))
            return null;
        try {
            return await UserModel.findById(id);
        }
        catch (err) {
            console.error("Error: getUserById:", err);
            return null;
        }
    }
    static async getUserByName(name) {
        const safeName = sanitizeMongoInput(sanitizeText(name));
        try {
            return await UserModel.findOne({ name: new RegExp(`^${escapeRegex(safeName)}$`, "i") });
        }
        catch (err) {
            console.error("Error: getUserByName:", err);
            return null;
        }
    }
    static async patchUserById(id, partial) {
        if (!isObjectId(id))
            return null;
        const allowedFields = ["name", "email", "hash"];
        const updateData = {};
        for (const key of allowedFields) {
            const value = partial[key];
            if (value === undefined)
                continue;
            if (typeof value === "string") {
                if (key === "email" && !isValidEmail(value))
                    continue;
                updateData[key] = sanitizeMongoInput(sanitizeText(value));
            }
            else {
                updateData[key] = value;
            }
        }
        try {
            return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
        }
        catch (err) {
            console.error("Error: patchUserById:", err);
            return null;
        }
    }
    static async updateUserPassword(id, currentPassword, newPassword) {
        if (!isObjectId(id))
            return false;
        try {
            const user = await UserModel.findById(id);
            if (!user)
                return false;
            const isMatch = await bcrypt.compare(currentPassword, user.hash);
            if (!isMatch)
                return false;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.hash = hashedPassword;
            await user.save();
            return true;
        }
        catch (err) {
            console.error("Error: updateUserPassword:", err);
            return false;
        }
    }
    static async deleteUserById(id) {
        if (!isObjectId(id))
            return false;
        try {
            const result = await UserModel.deleteOne({ _id: id });
            return result.deletedCount === 1;
        }
        catch (err) {
            console.error("Error: deleteUserById:", err);
            return false;
        }
    }
}
export default UserService;
