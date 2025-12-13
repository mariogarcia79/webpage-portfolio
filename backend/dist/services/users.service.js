"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const validation_1 = require("../utils/validation");
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
                const safeStr = (0, validation_1.sanitizeMongoInput)((0, validation_1.sanitizeText)(value));
                if (key === "email" && !(0, validation_1.isValidEmail)(safeStr))
                    continue;
                mongoFilter[key] = new RegExp((0, validation_1.escapeRegex)(safeStr), "i");
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
        return User_1.default.find(mongoFilter).sort(sortOrder);
    }
    static async getUserById(id) {
        if (!(0, validation_1.isObjectId)(id))
            return null;
        try {
            return await User_1.default.findById(id);
        }
        catch (err) {
            console.error("Error: getUserById:", err);
            return null;
        }
    }
    static async getUserByName(name) {
        const safeName = (0, validation_1.sanitizeMongoInput)((0, validation_1.sanitizeText)(name));
        try {
            return await User_1.default.findOne({ name: new RegExp(`^${(0, validation_1.escapeRegex)(safeName)}$`, "i") });
        }
        catch (err) {
            console.error("Error: getUserByName:", err);
            return null;
        }
    }
    static async patchUserById(id, partial) {
        if (!(0, validation_1.isObjectId)(id))
            return null;
        const allowedFields = ["name", "email", "hash"];
        const updateData = {};
        for (const key of allowedFields) {
            const value = partial[key];
            if (value === undefined)
                continue;
            if (typeof value === "string") {
                if (key === "email" && !(0, validation_1.isValidEmail)(value))
                    continue;
                updateData[key] = (0, validation_1.sanitizeMongoInput)((0, validation_1.sanitizeText)(value));
            }
            else {
                updateData[key] = value;
            }
        }
        try {
            return await User_1.default.findByIdAndUpdate(id, updateData, { new: true });
        }
        catch (err) {
            console.error("Error: patchUserById:", err);
            return null;
        }
    }
    static async updateUserPassword(id, currentPassword, newPassword) {
        if (!(0, validation_1.isObjectId)(id))
            return false;
        try {
            const user = await User_1.default.findById(id);
            if (!user)
                return false;
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.hash);
            if (!isMatch)
                return false;
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
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
        if (!(0, validation_1.isObjectId)(id))
            return false;
        try {
            const result = await User_1.default.deleteOne({ _id: id });
            return result.deletedCount === 1;
        }
        catch (err) {
            console.error("Error: deleteUserById:", err);
            return false;
        }
    }
}
exports.default = UserService;
