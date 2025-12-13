"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateName = validateName;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateInput = validateInput;
exports.isObjectId = isObjectId;
exports.escapeRegex = escapeRegex;
exports.isValidEmail = isValidEmail;
exports.sanitizeText = sanitizeText;
exports.sanitizeMarkdown = sanitizeMarkdown;
exports.sanitizeMongoInput = sanitizeMongoInput;
const mongoose_1 = __importDefault(require("mongoose"));
const validation_1 = require("../config/validation");
function validateName(name) {
    if (!name)
        throw new Error("Name is required");
    if (typeof name !== 'string')
        throw new Error("Name must be a string");
    let cleanName = name.trim();
    if (cleanName.length < validation_1.MIN_NAME_LENGTH)
        throw new Error(`Name must be at least ${validation_1.MIN_NAME_LENGTH} characters long`);
    if (cleanName.length > validation_1.MAX_NAME_LENGTH)
        throw new Error(`Name must be at most ${validation_1.MAX_NAME_LENGTH} characters long`);
    cleanName = sanitizeText(cleanName);
    cleanName = sanitizeMongoInput(cleanName);
    return cleanName;
}
function validateEmail(email) {
    if (!email)
        throw new Error("Email is required");
    if (typeof email !== 'string')
        throw new Error("Email must be a string");
    let cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length < validation_1.MIN_EMAIL_LENGTH)
        throw new Error(`Email must be at least ${validation_1.MIN_EMAIL_LENGTH} characters long`);
    if (cleanEmail.length > validation_1.MAX_EMAIL_LENGTH)
        throw new Error(`Email must be at most ${validation_1.MAX_EMAIL_LENGTH} characters long`);
    if (!isValidEmail(cleanEmail))
        throw new Error("Invalid email format");
    cleanEmail = sanitizeText(cleanEmail);
    cleanEmail = sanitizeMongoInput(cleanEmail);
    return cleanEmail;
}
function validatePassword(password) {
    if (!password)
        throw new Error("Password is required");
    if (typeof password !== 'string')
        throw new Error("Password must be a string");
    if (password.length < validation_1.MIN_PASSWORD_LENGTH)
        throw new Error(`Password must be at least ${validation_1.MIN_PASSWORD_LENGTH} characters long`);
    if (password.length > validation_1.MAX_PASSWORD_LENGTH)
        throw new Error(`Password must be at most ${validation_1.MAX_PASSWORD_LENGTH} characters long`);
    return password;
}
function validateInput(content, isMd, maxLen) {
    if (!content)
        throw new Error("Comment content is required");
    if (typeof content !== 'string')
        throw new Error("Comment content must be a string");
    let cleanContent = content.trim();
    if (cleanContent.length === 0)
        throw new Error("Comment content cannot be empty");
    if (cleanContent.length > maxLen)
        throw new Error(`Comment content must be at most ${maxLen} characters long`);
    // For markdown content we want to preserve Markdown syntax and any
    // intentional inline HTML. Avoid stripping HTML tags here — leave
    // presentation sanitization to the frontend renderer (or a dedicated
    // sanitizer) and only neutralize characters that could affect MongoDB.
    if (isMd) {
        cleanContent = sanitizeMongoInput(cleanContent);
        cleanContent = sanitizeMarkdown(cleanContent);
    }
    else {
        cleanContent = sanitizeText(cleanContent);
        cleanContent = sanitizeMongoInput(cleanContent);
    }
    return cleanContent;
}
function isObjectId(id) {
    if (!id || typeof id !== 'string')
        return false;
    return mongoose_1.default.Types.ObjectId.isValid(id);
}
function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function isValidEmail(email) {
    if (typeof email !== 'string')
        return false;
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function sanitizeText(input) {
    if (input == null)
        return '';
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
function sanitizeMarkdown(input) {
    return String(input);
}
function sanitizeMongoInput(str) {
    if (!str)
        return '';
    // remove leading $ to prevent operator injection
    return str.replace(/^\$/, '');
}
