import mongoose from 'mongoose';

export function isObjectId(id: unknown): boolean {
  if (typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id);
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  // simple safe email regex
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export function sanitizeText(input: unknown): string {
  if (input == null) return '';
  const s = String(input);
  // remove script tags to avoid trivial XSS payloads stored in DB
  return s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
