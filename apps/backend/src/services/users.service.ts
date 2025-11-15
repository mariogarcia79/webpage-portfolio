import UserModel, { IUserDocument } from "../models/User";

class UserService {

  static async getAllUsers({ sorted, active = true, name }: { sorted: boolean, active: boolean, name?: string | RegExp }): Promise<IUserDocument[]> {
    const filter: any = { active };
    if (name) filter.name = name;
    return await UserModel.find(filter).sort({ name: sorted ? 1 : -1 });
  }

  static async getUserById(id: string): Promise<IUserDocument | null> {
    try {
      return await UserModel.findById(id);
    } catch (err) {
      return null;
    }
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
