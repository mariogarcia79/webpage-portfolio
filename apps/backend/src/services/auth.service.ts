import UserModel, { IUserDocument } from "../models/User";

class AuthService {

  // Método estático para crear un nuevo usuario
  static async signUp(name: string, email: string, password: string): Promise<IUserDocument> {
    const newUser = new UserModel({
      name,
      email,
      password
    });
    
    // Guardamos y retornamos el nuevo usuario
    return await newUser.save();
  }
}

export default AuthService;
