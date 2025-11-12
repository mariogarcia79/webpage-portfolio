import UserModel, { IUserDocument } from "../models/User"

export async function postUser(name: string, email: string, password: string): Promise<IUserDocument> {
  const newPost = new UserModel({
    name,
    email,
    password
  });
  return await newPost.save();
}