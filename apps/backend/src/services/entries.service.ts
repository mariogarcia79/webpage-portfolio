import { Entry } from "../types/entry.js";

const entries: Entry[] = [
  { id: 1, title: "First Entry", summary: "First Entry's summary", content: "First Entry's content", createdAt: new Date(2025,10,11) },
  { id: 2, title: "Second Entry", summary: "Second Entry's summary", content: "Second Entry's content", createdAt: new Date(2025,10,11) }
];

export function getAllEntries(): Entry[] {
  return entries;
}

export function getEntryById(id: number): Entry | undefined {
  return entries.find(entry => entry.id === id);
}

export function patchEntryById(id: number, partial: Partial<Entry>) {
  const entry = getEntryById(id);
  if (!entry) return null;

  // Actualiza solo los campos enviados
  Object.assign(entry, partial);

  return entry;
}