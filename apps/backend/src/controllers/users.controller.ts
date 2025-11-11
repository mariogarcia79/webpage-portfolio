
import { Request, Response } from "express";
import * as userService from "../services/users.service.js";

export function getAllUsers(req: Request, res: Response) {
  res.json(userService.getAllUsers());
}

export function getUserById(req: Request, res: Response) {
  const user = userService.getUserById(req.params.id);
  if (!user) 
    return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export function getUserByName(req: Request, res: Response) {
  const user = userService.getUserByName(req.params.name);
  if (!user) 
    return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export function postUser(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  const newUser = userService.postUser( name, email, password );
  res.status(201).json(newUser);
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