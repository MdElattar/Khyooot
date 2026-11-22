import path from "node:path";
import multer from "multer";
import { ValidationError } from "../utils/validation.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname || "").toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(extension)) {
    return callback(new ValidationError("Only supported image files are allowed"));
  }
  return callback(null, true);
};

// Keep uploads in memory: no attacker-chosen filenames or temp-file leftovers.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 4, parts: 30, fieldSize: 1024 * 1024 },
});

export const validateImageBuffer = (file) => {
  if (!file?.buffer) throw new ValidationError("Missing image file");
  const bytes = file.buffer;

  const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isGif = bytes.length > 6 && bytes.subarray(0, 6).toString("ascii").startsWith("GIF8");
  const isWebp = bytes.length > 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";

  if (!(isJpeg || isPng || isGif || isWebp)) throw new ValidationError("Invalid image content");
  return true;
};

export const uploadProductImages = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

const receiptUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 1, parts: 20, fieldSize: 1024 * 1024 },
});

export const uploadReceipt = receiptUpload.single("receipt");

export default upload;
