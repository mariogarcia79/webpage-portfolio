export interface IUser {
  name:       string;
  email:      string;
  hash:       string;
  role?:      "admin" | "user";
  active:     boolean;
  createdAt:  Date;
  updatedAt:  Date;
}