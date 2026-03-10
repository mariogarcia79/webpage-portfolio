import multer from "multer";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";

const uploadDir = path.join(process.cwd(), "public/uploads");

const allowedMimeTypes = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
]);

function isAsciiOnly(str: string) {
  return /^[\x00-\x7F]+$/.test(str);
}

function randomString(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) return cb(new Error("Invalid file type"));
    if (!isAsciiOnly(file.originalname)) return cb(new Error("Filename must be ASCII"));
    if (file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\")) {
      return cb(new Error("Invalid filename"));
    }
    cb(null, true);
  },
}).single("file");

export async function validateAndSaveWebp(req: Request, res: Response, next: NextFunction) {
  if (!req.file) return next();

  try {
    const metadata = await sharp(req.file.buffer).metadata();
    if (!metadata.width || !metadata.height || !metadata.format) {
      return res.status(400).json({ error: "Invalid image" });
    }
    if (metadata.width * metadata.height > 40_000_000) {
      return res.status(400).json({ error: "Image too large" });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const baseName = req.file.originalname
      .toLowerCase()
      .replace(path.extname(req.file.originalname), "")
      .replace(/[^a-z0-9-_]/g, "-");

    const filename = `${baseName}-${Date.now()}-${randomString(6)}.webp`;
    const filePath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .rotate()
      .webp({ quality: 82, effort: 4 })
      .toFile(filePath);

    req.file.path = filePath;
    req.file.filename = filename;
    req.file.mimetype = "image/webp";

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error processing image" });
  }
}