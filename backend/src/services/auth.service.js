import UserModel from "../models/User";
import { UserRole } from "../types/userRole";
class AuthService {
    static async signUp(data) {
        return this._signUp({
            ...data,
            role: UserRole.USER
        });
    }
    static async signUpAdmin(data) {
        return this._signUp({
            ...data,
            role: UserRole.ADMIN
        });
    }
    static async _signUp(data) {
        try {
            const exists = await UserModel.findOne({ email: data.email });
            if (exists) {
                console.error("email already registered");
                return null;
            }
            const newUser = new UserModel({
                name: data.name,
                email: data.email,
                hash: data.hash,
                role: data.role
            });
            return await newUser.save();
        }
        catch (err) {
            console.error("Error: _signUp:", err);
            return null;
        }
    }
}
export default AuthService;
