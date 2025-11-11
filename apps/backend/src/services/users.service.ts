import UserModel, { IUserDocument } from "../models/User.js"

export async function getAllUsers(): Promise<IUserDocument[]> {
  return await UserModel.find().sort({ name: -1 });
}

export async function getUserById(id: string): Promise<IUserDocument | null> {
  return await UserModel.findById(id);
}

export async function getUserByName(name: string): Promise<IUserDocument | null> {
  return await UserModel.findOne({ name: name });
}

export async function patchUserById(id: string, partial: Partial<IUserDocument>): Promise<IUserDocument | null> {
  const user = await UserModel.findByIdAndUpdate(id, partial, { new: true });
  return user;
}

export async function postUser(name: string, email: string, password: string): Promise<IUserDocument> {
  const newPost = new UserModel({
    name,
    email,
    password
  });
  return await newPost.save();
}

export async function deleteUserById(id: string): Promise<boolean> {
  const user = await UserModel.findById(id);
  if (!user) return false;

  user.active = false;
  await user.save();
  return true;
}
