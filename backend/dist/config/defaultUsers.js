"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultAdmin = createDefaultAdmin;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
async function createDefaultAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminName = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const existingAdmin = await User_1.default.findOne({ email: adminEmail });
    if (existingAdmin) {
        console.log(`Admin user already exists with email: ${adminEmail}`);
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
    await User_1.default.create({
        name: adminName,
        email: adminEmail,
        hash: hashedPassword,
        role: "admin"
    });
    console.log(`Admin user created:
  - Name: ${adminName}
  - Email: ${adminEmail}
  - Password: ${adminPassword}`);
}
