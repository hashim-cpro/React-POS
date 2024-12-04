import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  fileType: "image/jpeg",
  quality: 0.3,
};

export const compressImage = async (file) => {
  try {
    const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
    console.log("compressedFile", compressedFile);
    return compressedFile;
  } catch (error) {
    throw new Error("Failed to compress image: " + error.message);
  }
};
