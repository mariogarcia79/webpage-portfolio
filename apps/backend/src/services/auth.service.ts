import UserModel, { IUserDocument } from "../models/User";

class AuthService {
  
  static async signUp(name: string, email: string, hash: string): Promise<IUserDocument> {
    const newUser = new UserModel({
      name,
      email,
      hash
    });
    
    return await newUser.save();
  }
}

export default AuthService;
