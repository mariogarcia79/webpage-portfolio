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
    const adminName = process.env.ADMIN_NAME || process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const existingByEmail = await User_1.default.findOne({ email: adminEmail });
    const anyAdmin = await User_1.default.findOne({ role: "admin" });
    if (existingByEmail) {
        console.log(`Admin user already exists with email: ${adminEmail}`);
        if (process.env.ADMIN_FORCE_UPDATE === 'true') {
            const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
            existingByEmail.name = adminName;
            existingByEmail.hash = hashedPassword;
            await existingByEmail.save();
            console.log(`Admin user with email ${adminEmail} updated from .env (name updated).`);
        }
        return;
    }
    if (anyAdmin) {
        console.log(`An admin account already exists (id=${anyAdmin._id}).`);
        if (process.env.ADMIN_FORCE_UPDATE === 'true') {
            const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
            anyAdmin.name = adminName;
            anyAdmin.email = adminEmail;
            anyAdmin.hash = hashedPassword;
            await anyAdmin.save();
            console.log(`Existing admin updated to match .env (email/name).`);
        }
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
    await User_1.default.create({
        name: adminName,
        email: adminEmail,
        hash: hashedPassword,
        role: "admin"
    });
    console.log(`Admin user created: name=${adminName}, email=${adminEmail}`);
}
