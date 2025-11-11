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

export function patchEntryById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = entryService.patchEntryById(id, req.body);

  if (!updated)
    return res.status(404).json({ error: "Entry not found" });

  res.json(updated);
}