import { Schema, model, Document, Model } from 'mongoose';
import { IUser } from '../types/user';
import { UserRole } from "../types/userRole";

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument>(
  {
    name:   { type: String,   required: true, unique: true },
    email:  { type: String,   required: true, unique: true },
    hash:   { type: String,   required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    }
  },
  { 
    timestamps: true
  }
);

const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;