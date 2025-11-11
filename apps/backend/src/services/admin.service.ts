import { Admin } from "../types/admin.js";

const admin: Admin = {
  name: "Mario",
  surnames: undefined,
  username: "admin",
  contact: undefined,
  password: "password",
  twofactor: false,
  verified: false
};

export function getAdminInfo() {
  return admin;
}