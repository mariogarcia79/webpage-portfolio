import UserModel, { IUserDocument } from "../models/User";

class UserService {

  static async getAllUsers({ sorted, active = true, name }: { sorted: boolean, active: boolean, name?: string }): Promise<IUserDocument[]> {
    return await UserModel.find({ active, name }).sort({ name: sorted ? 1 : -1 });
  }

  static async getUserById(id: string): Promise<IUserDocument | null> {
    return await UserModel.findById(id);
  }

  static async getUserByName(name: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ name });
  }

  static async patchUserById(id: string, partial: Partial<IUserDocument>): Promise<IUserDocument | null> {
    const user = await UserModel.findByIdAndUpdate(id, partial, { new: true });
    return user;
  }

  static async deleteUserById(id: string): Promise<boolean> {
    const user = await UserModel.findById(id);
    if (!user) return false;

    user.active = false;
    await user.save();
    return true;
  }
}

export default UserService;
