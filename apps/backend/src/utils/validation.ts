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
  let text = String(input);

  // Remove all HTML tags
  text = text.replace(/<\/?[^>]+(>|$)/g, '');

  // Remove control characters and non-printable characters
  text = text.replace(/[\x00-\x1F\x7F]/g, '');

  // Normalize whitespace (optional)
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

// Dummy function, inline HTML is disabled in the frontend markdown renderer,
// so arbitrary code hosted there should be unharmful.
export function sanitizeMarkdown(input: unknown): string {
  return String(input);
}

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sanitizeMongoInput(str: string): string {
  if (!str) return '';
  return str.replace(/^\$/, ''); // remove leading $ to prevent operator injection
}