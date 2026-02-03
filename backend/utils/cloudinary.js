import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw new Error("Image upload failed"); // 🔥 propagate error
  }
};
