import mongoose from 'mongoose';
import { 
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MIN_EMAIL_LENGTH,
  MAX_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
} from '../config/validation';

export function validateName (name: string): string {
  if (!name) throw new Error("Name is required");
  if (typeof name !== 'string') throw new Error("Name must be a string");

  let cleanName = name.trim();
  
  if (cleanName.length < MIN_NAME_LENGTH) 
    throw new Error(`Name must be at least ${MIN_NAME_LENGTH} characters long`);
  if (cleanName.length > MAX_NAME_LENGTH) 
    throw new Error(`Name must be at most ${MAX_NAME_LENGTH} characters long`);
  
  cleanName = sanitizeText(cleanName);
  cleanName = sanitizeMongoInput(cleanName);
  
  return cleanName;
}

export function validateEmail(email: string): string {
  if (!email) throw new Error("Email is required");
  if (typeof email !== 'string') throw new Error("Email must be a string");

  let cleanEmail = email.trim().toLowerCase();
  
  if (cleanEmail.length < MIN_EMAIL_LENGTH) 
    throw new Error(`Email must be at least ${MIN_EMAIL_LENGTH} characters long`);
  if (cleanEmail.length > MAX_EMAIL_LENGTH) 
    throw new Error(`Email must be at most ${MAX_EMAIL_LENGTH} characters long`);

  if (!isValidEmail(cleanEmail)) 
    throw new Error("Invalid email format");
  
  cleanEmail = sanitizeText(cleanEmail);
  cleanEmail = sanitizeMongoInput(cleanEmail);
  return cleanEmail;
}

export function validatePassword(password: string): string {
  if (!password) throw new Error("Password is required");
  if (typeof password !== 'string') throw new Error("Password must be a string");

  if (password.length < MIN_PASSWORD_LENGTH)
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  if (password.length > MAX_PASSWORD_LENGTH)
    throw new Error(`Password must be at most ${MAX_PASSWORD_LENGTH} characters long`);
  
  return password;
}

export function validateInput(content: string | undefined, isMd: boolean, maxLen: number): string {
  if (!content) throw new Error("Comment content is required");
  if (typeof content !== 'string') throw new Error("Comment content must be a string");

  let cleanContent = content.trim();
  if (cleanContent.length === 0) 
    throw new Error("Comment content cannot be empty");
  if (cleanContent.length > maxLen)
    throw new Error(`Comment content must be at most ${maxLen} characters long`);

  cleanContent = sanitizeText(cleanContent);
  cleanContent = sanitizeMongoInput(cleanContent);
  if (isMd) cleanContent = sanitizeMarkdown(cleanContent);
  return cleanContent;
}

export function isObjectId(id: unknown): boolean {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id);
}

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export function sanitizeText(input: unknown): string {
  if (input == null) return '';
  let text = String(input);

  // Remove all HTML tags
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  // Remove control characters and non-printable characters
  text = text.replace(/[\x00-\x1F\x7F]/g, '');
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

// Dummy function, inline HTML is disabled in the frontend markdown renderer,
// so arbitrary code hosted there should be unharmful.
export function sanitizeMarkdown(input: unknown): string {
  return String(input);
}

export function sanitizeMongoInput(str: string): string {
  if (!str) return '';
  // remove leading $ to prevent operator injection
  return str.replace(/^\$/, '');
}