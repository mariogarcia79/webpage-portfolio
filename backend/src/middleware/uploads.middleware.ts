import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";

const uploadDir = path.join(process.cwd(), "public/uploads");

const allowedMimeTypes = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp"
]);

const allowedExtensions = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp"
]);

const allowedFormats = ["jpeg","png","gif","webp"];

function randomString(len = 6) {
  return Array.from({length: len}, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      .charAt(Math.floor(Math.random()*62))
  ).join("");
}

function isAsciiOnly(str: string) {
  return /^[\x00-\x7F]+$/.test(str);
}

async function validateImageFile(filePath: string) {
  try {
    const { width, height, format } = await sharp(filePath).metadata();
    if (!width || !height || !format || !allowedFormats.includes(format)) return false;
    if (width > 10000 || height > 10000 || width*height > 40_000_000) return false;
    return true;
  } catch {
    return false;
  }
}

async function sanitizeAndConvertToWebp(filePath: string) {
  const { dir, name } = path.parse(filePath);
  const newPath = path.join(dir, `${name}.webp`);

  await sharp(filePath)
    .rotate()
    .webp({ quality: 82, effort: 4 })
    .toFile(newPath);

  await fs.unlink(filePath);
  return newPath;
}

const storage = multer.diskStorage({
  destination: async (_, __, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext) || !isAsciiOnly(file.originalname))
      return cb(new Error("Invalid file"), "");

    const base = file.originalname.toLowerCase().replace(ext,"").replace(/[^a-z0-9-_]/g,"-");
    const finalName = `${base}-${Date.now()}-${randomString(6)}${ext}`;
    cb(null, finalName);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(ext))
      return cb(new Error("File type not allowed"));
    if (file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\"))
      return cb(new Error("Invalid filename"));
    cb(null, true);
  },
  limits: { fileSize: 5*1024*1024, files: 1 },
});

export async function validateUploadedImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.file) return next();

  try {
    if (!(await validateImageFile(req.file.path))) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: "File is not valid or corrupted" });
    }

    const newPath = await sanitizeAndConvertToWebp(req.file.path);
    req.file.path = newPath;
    req.file.filename = path.basename(newPath);
    req.file.mimetype = "image/webp";

    next();
  } catch {
    try { await fs.unlink(req.file.path); } catch {}
    return res.status(500).json({ error: "Error processing image" });
  }
}