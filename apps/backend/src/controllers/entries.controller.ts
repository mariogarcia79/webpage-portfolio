import { Request, Response } from "express";
import * as entryService from "../services/entries.service.js";

export function getAllEntries(req: Request, res: Response) {
  res.json(entryService.getAllEntries());
}

export function getEntryById(req: Request, res: Response) {
  const entry = entryService.getEntryById(Number(req.params.id));
  if (!entry) 
    return res.status(404).json({ error: "Entry not found" });
  res.json(entry);
}