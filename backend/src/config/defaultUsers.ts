import bcrypt from "bcryptjs";
import User from "../models/User";

export async function createDefaultAdmin() {
  // Support both ADMIN_NAME and ADMIN_USERNAME env var names (some setups use
  // ADMIN_USERNAME). Also prefer ADMIN_EMAIL and ADMIN_PASSWORD from env.
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminName = process.env.ADMIN_NAME || process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  // Find any existing admin by email or any user with role 'admin'
  const existingByEmail = await User.findOne({ email: adminEmail });
  const anyAdmin = await User.findOne({ role: "admin" });

  // If an admin exists with this email, optionally update it
  if (existingByEmail) {
    console.log(`Admin user already exists with email: ${adminEmail}`);
    if (process.env.ADMIN_FORCE_UPDATE === 'true') {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingByEmail.name = adminName;
      existingByEmail.hash = hashedPassword;
      await existingByEmail.save();
      console.log(`Admin user with email ${adminEmail} updated from .env (name updated).`);
    }
    return;
  }

  // If any admin exists but with a different email, do not create another
  // unless ADMIN_FORCE_UPDATE is set, in which case update that admin's email/name.
  if (anyAdmin) {
    console.log(`An admin account already exists (id=${anyAdmin._id}).`);
    if (process.env.ADMIN_FORCE_UPDATE === 'true') {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      anyAdmin.name = adminName;
      anyAdmin.email = adminEmail;
      anyAdmin.hash = hashedPassword;
      await anyAdmin.save();
      console.log(`Existing admin updated to match .env (email/name).`);
    }
    return;
  }

  // No admin exists, create one
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: adminName,
    email: adminEmail,
    hash: hashedPassword,
    role: "admin"
  });

  console.log(`Admin user created: name=${adminName}, email=${adminEmail}`);
}