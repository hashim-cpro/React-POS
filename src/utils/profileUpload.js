import { storage } from "../config/appwrite";
import { ID } from "appwrite";

const BUCKET_ID = import.meta.env.VITE_PROFILE_PICTURES_BUCKET_ID;

export const uploadProfilePicture = async (file, userId, currentImageId) => {
  try {
    if (currentImageId) {
      try {
        await storage.deleteFile(BUCKET_ID, currentImageId);
      } catch (error) {
        // Continue even if delete fails
        console.error(
          `Failed to delete previous profile picture: ${error.message}`
        );
      }
    }

    const fileId = ID.unique();
    await storage.createFile(BUCKET_ID, fileId, file);

    // Get the file URL using the preview endpoint
    const fileUrl = storage.getFilePreview(
      BUCKET_ID,
      fileId,
      400, // width
      400, // height
      "center", // gravity
      100, // quality
      1, // border
      "ffffff", // background color
      "jpg" // output format
    ).href;
    console.log("Uploaf file function", fileId, fileUrl);
    return { fileId, fileUrl };
  } catch (error) {
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }
};
