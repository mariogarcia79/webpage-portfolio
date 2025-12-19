import multer from "multer";
import path from "path";
import crypto from "crypto";

// In CommonJS builds __dirname is available; use it to resolve the uploads directory
const uploadDir = path.join(__dirname, "../../public/uploads");

const allowedMimeTypes = new Set([
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // generate a safe random filename and preserve a valid extension when possible
    // const ext = path.extname(file.originalname).toLowerCase();
    // const safeExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext) ? ext : "";
    // const random = crypto.randomBytes(8).toString("hex");
    // const name = `${Date.now()}-${random}${safeExt}`;
    const name = file.originalname;
    cb(null, name);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) return cb(null, true);
    cb(null, false);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});