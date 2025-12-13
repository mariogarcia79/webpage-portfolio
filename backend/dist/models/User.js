"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userRole_1 = require("../types/userRole");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(userRole_1.UserRole),
        default: userRole_1.UserRole.USER,
    }
}, {
    timestamps: true
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
