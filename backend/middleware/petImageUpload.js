import crypto from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const backendMiddlewareDir = dirname(fileURLToPath(import.meta.url));
const uploadDirectory = resolve(
  backendMiddlewareDir,
  "../../frontend/src/uploads"
);
const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${allowedImageTypes.get(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(new Error("Upload a JPG, PNG, or WebP image."));
      return;
    }

    callback(null, true);
  },
});

export const uploadPetImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "The image must be 5 MB or smaller."
        : error.message || "Unable to upload the image.";

    res.status(400).json({ success: false, message });
  });
};
