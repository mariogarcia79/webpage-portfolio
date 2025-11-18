import UserModel, { IUserDocument } from "../models/User";
import { IUser } from "../types/user";
import { UserRole } from "../types/userRole";

import {
  sanitizeText,
  sanitizeMongoInput,
  isValidEmail
} from "../utils/validation";

class AuthService {

  // Signup unprivileged user
  static async signUp(data: Partial<IUser>): Promise<IUserDocument | null> {
    return this._signUp({
      ...data,
      role: UserRole.USER
    });
  }

  // Signup administrator
  static async signUpAdmin(data: Partial<IUser>): Promise<IUserDocument | null> {
    return this._signUp({
      ...data,
      role: UserRole.ADMIN
    });
  }

  // Private signup helper
  private static async _signUp(data: Partial<IUser>): Promise<IUserDocument | null> {
    try {
      if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
        console.error("Signup error: invalid name");
        return null;
      }
      const safeName = sanitizeMongoInput(sanitizeText(data.name));

      if (!data.email || typeof data.email !== "string" || !isValidEmail(data.email)) {
        console.error("Signup error: invalid email");
        return null;
      }
      const safeEmail = sanitizeMongoInput(data.email);

      if (!data.hash || typeof data.hash !== "string") {
        console.error("Signup error: missing password hash");
        return null;
      }

      if (data.role !== UserRole.USER && data.role !== UserRole.ADMIN) {
        console.error("Signup error: invalid role");
        return null;
      }

      const exists = await UserModel.findOne({ email: safeEmail });
      if (exists) {
        console.error("Signup error: email already registered");
        return null;
      }

      const newUser = new UserModel({
        name: safeName,
        email: safeEmail,
        hash: data.hash,
        role: data.role,
        active: data.active ?? true
      });

      return await newUser.save();

    } catch (err) {
      console.error("Error: _signUp:", err);
      return null;
    }
  }
}

export default AuthService;