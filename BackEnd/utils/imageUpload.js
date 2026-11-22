import { v2 as cloudinary } from "cloudinary";
import { validateImageBuffer } from "../middleware/multer.js";

export const uploadImageBuffer = async (file, folder) => {
  validateImageBuffer(file);
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    { resource_type: "image", folder }
  );
  return { url: result.secure_url, publicId: result.public_id };
};
