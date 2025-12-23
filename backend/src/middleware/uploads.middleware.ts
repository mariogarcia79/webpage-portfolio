import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";

//__dirname
const uploadDir = path.join(process.cwd(), "public/uploads");

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const allowedExtensions = new Set([
  ".jpg", 
  ".jpeg", 
  ".png", 
  ".gif", 
  ".webp"
]);

const allowedFormats = [
  "jpeg", 
  "png", 
  "gif", 
  "webp"
];

function isAsciiOnly(str: string): boolean {
  return /^[\x00-\x7F]*$/.test(str);
}

function sanitizeFilename(filename: string): string {
  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 200);
  return sanitized;
}

async function validateImageFile(filePath: string): Promise<boolean> {
  try {
    const metadata = await sharp(filePath).metadata();
    
    if (!metadata.width || !metadata.height) {
      return false;
    }

    if (!metadata.format || !allowedFormats.includes(metadata.format)) {
      return false;
    }

    const maxDimension = 10000;
    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating image:", error);
    return false;
  }
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    try {
      const originalName = file.originalname;
      
      if (!isAsciiOnly(originalName)) {
        return cb(new Error("Filename must contain only ASCII characters"), "");
      }
      
      if (originalName.startsWith(".")) {
        return cb(new Error("Filename cannot start with a dot"), "");
      }

      const ext = path.extname(originalName).toLowerCase();
      if (!allowedExtensions.has(ext)) {
        return cb(new Error("File extension not allowed"), "");
      }

      const sanitized = sanitizeFilename(originalName);
      const finalExt = path.extname(sanitized).toLowerCase();
      
      if (!allowedExtensions.has(finalExt)) {
        return cb(new Error("Invalid filename after sanitization"), "");
      }

      cb(null, sanitized);
    } catch (error) {
      cb(error as Error, "");
    }
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("File type not allowed"));
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      return cb(new Error("File extension not allowed"));
    }

    if (file.originalname.includes("..") || 
        file.originalname.includes("/") || 
        file.originalname.includes("\\")) {
      return cb(new Error("Invalid filename"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export async function validateUploadedImage(
  req: any,
  res: any,
  next: any
) {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;

  try {
    const isValid = await validateImageFile(filePath);

    if (!isValid) {
      await fs.unlink(filePath);
      return res.status(400).json({ 
        error: "File is not a valid image or is corrupted" 
      });
    }

    next();
  } catch (error) {
    try {
      await fs.unlink(filePath);
    } catch {}
    
    return res.status(500).json({ 
      error: "Error validating image" 
    });
  }
}