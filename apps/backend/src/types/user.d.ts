import { Types } from "mongoose";
import { UserRole } from "./userRole";

export interface IUser {
  name: string;
  email: string;
  hash: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}