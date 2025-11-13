import bcrypt from "bcryptjs";
import UserService from "../services/users.service";
import AuthService from "../services/auth.service";

export async function createDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminName = process.env.ADMIN_NAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await AuthService.signUp(adminName, adminEmail, hashedPassword);

  console.log(`Admin user created:
  - Name: ${adminName}
  - Email: ${adminEmail}
  - Password: ${adminPassword}`);
}
