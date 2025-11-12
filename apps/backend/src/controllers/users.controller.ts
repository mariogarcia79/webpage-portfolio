
import { Request, Response } from "express";
import * as userService from "../services/users.service";

export function getAllUsers(req: Request, res: Response) {
  const name = req.query.name as string;
  res.json(userService.getAllUsers({ sorted: true, active: true, name }));
}

export function getUserById(req: Request, res: Response) {
  const user = userService.getUserById(req.params.id);
  if (!user) 
    return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export function patchUserById(req: Request, res: Response) {
  const updated = userService.patchUserById(req.params.id, req.body);

  if (!updated)
    return res.status(404).json({ error: "User not found" });

  res.json(updated);
}

export function deleteUserById(req: Request, res: Response) {
  userService.deleteUserById(req.params.id);
}