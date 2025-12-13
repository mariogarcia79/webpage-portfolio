import bcrypt from "bcryptjs";
import User from "../models/User";

export async function createDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminName = process.env.ADMIN_NAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`Admin user already exists with email: ${adminEmail}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
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