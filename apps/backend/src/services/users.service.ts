import UserModel, { IUserDocument } from "../models/User"

export async function getAllUsers({ sorted, active = true, name }: { sorted: boolean, active: boolean, name?: string }): Promise<IUserDocument[]> {
  return await UserModel.find({ active, name }).sort({ name: -1 });
}

export async function getUserById(id: string): Promise<IUserDocument | null> {
  return await UserModel.findById(id);
}

export async function getUserByName(name: string): Promise<IUserDocument | null> {
  return await UserModel.findOne({ name });
}

export async function patchUserById(id: string, partial: Partial<IUserDocument>): Promise<IUserDocument | null> {
  const user = await UserModel.findByIdAndUpdate(id, partial, { new: true });
  return user;
}

export async function deleteUserById(id: string): Promise<boolean> {
  const user = await UserModel.findById(id);
  if (!user) return false;

  user.active = false;
  await user.save();
  return true;
}
