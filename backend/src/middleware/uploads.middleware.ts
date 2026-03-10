import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";

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

function randomString(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function validateImageFile(filePath: string): Promise<boolean> {
  try {
    const metadata = await sharp(filePath).metadata();

    if (!metadata.width || !metadata.height) return false;
    if (!metadata.format || !allowedFormats.includes(metadata.format)) return false;

    const maxDimension = 10000;
    if (metadata.width > maxDimension || metadata.height > maxDimension) return false;

    // protección contra image bombs
    const maxPixels = 40_000_000;
    if ((metadata.width * metadata.height) > maxPixels) return false;

    return true;

  } catch (error) {
    console.error("Error validating image:", error);
    return false;
  }
}

async function sanitizeAndConvertToWebp(filePath: string): Promise<string> {
  const parsed = path.parse(filePath);
  const newPath = path.join(parsed.dir, `${parsed.name}.webp`);

  await sharp(filePath)
    .rotate() // respeta orientación pero elimina EXIF
    .webp({
      quality: 82,
      effort: 4
    })
    .toFile(newPath);

  if (newPath !== filePath) {
    await fs.unlink(filePath);
  }

  return newPath;
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

      const ext = path.extname(file.originalname).toLowerCase();

      if (!allowedExtensions.has(ext)) {
        return cb(new Error("File extension not allowed"), "");
      }

      if (!isAsciiOnly(file.originalname)) {
        return cb(new Error("Filename must contain only ASCII characters"), "");
      }

      const baseName = file.originalname
        .toLowerCase()
        .replace(ext, "")
        .replace(/[^a-z0-9-_]/g, "-");

      const timestamp = Date.now();
      const randomStr = randomString(6);

      const finalName = `${baseName}-${timestamp}-${randomStr}${ext}`;

      cb(null, finalName);

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

    if (
      file.originalname.includes("..") ||
      file.originalname.includes("/") ||
      file.originalname.includes("\\")
    ) {
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

  if (!req.file) return next();

  let filePath = req.file.path;

  try {

    const isValid = await validateImageFile(filePath);

    if (!isValid) {

      await fs.unlink(filePath);

      return res.status(400).json({
        error: "File is not a valid image or is corrupted"
      });

    }

    // sanitizar y convertir a webp
    const newPath = await sanitizeAndConvertToWebp(filePath);

    req.file.path = newPath;
    req.file.filename = path.basename(newPath);
    req.file.mimetype = "image/webp";

    next();

  } catch (error) {

    try {
      await fs.unlink(filePath);
    } catch {}

    return res.status(500).json({
      error: "Error processing image"
    });

  }

}