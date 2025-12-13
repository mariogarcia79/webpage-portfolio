"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
// In CommonJS builds __dirname is available; use it to resolve the uploads directory
const uploadDir = path_1.default.join(__dirname, "../../public/uploads");
const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
]);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // generate a safe random filename and preserve a valid extension when possible
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const safeExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext) ? ext : "";
        const random = crypto_1.default.randomBytes(8).toString("hex");
        const name = `${Date.now()}-${random}${safeExt}`;
        cb(null, name);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.has(file.mimetype))
            return cb(null, true);
        cb(null, false);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
