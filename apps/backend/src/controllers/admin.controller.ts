import { Request, Response } from "express";
import * as adminService from "../services/admin.service.js";
import * as aboutService from "../services/about.service.js";

export async function getAdminDashboard(req: Request, res: Response) {
  const [admin, about] = await Promise.all([
    adminService.getAdminInfo(),
    aboutService.getAboutInfo()
  ]);

  res.json({ admin, about });
}