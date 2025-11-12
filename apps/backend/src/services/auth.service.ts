import UserModel, { IUserDocument } from "../models/User";

class AuthService {
  
  static async signUp(name: string, email: string, hash: string, active=true): Promise<IUserDocument> {
    const newUser = new UserModel({
      name,
      email,
      hash,
      active
    });
    
    return await newUser.save();
  }
}

export default AuthService;
