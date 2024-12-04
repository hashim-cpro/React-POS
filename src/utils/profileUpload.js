import { storage } from "../config/appwrite";
import { ID } from "appwrite";

const BUCKET_ID = import.meta.env.VITE_PROFILE_PICTURES_BUCKET_ID;

export const uploadProfilePicture = async (file, userId, currentImageId) => {
  try {
    // Delete old profile picture if it exists
    if (currentImageId) {
      try {
        await storage.deleteFile(BUCKET_ID, currentImageId);
      } catch (error) {
        console.error("Failed to delete old profile picture:", error);
      }
    }

    // Upload new file
    const fileId = ID.unique();
    console.log("File:", file, "fileid", fileId);
    const response = await storage.createFile(BUCKET_ID, fileId, file);

    // Get file URL
    const fileUrl = storage.getFileView(BUCKET_ID, fileId);

    return { fileId: response.$id, fileUrl };
  } catch (error) {
    console.log("Failed to upload profile picture:", error);
    throw new Error("Failed to upload profile picture: " + error.message);
  }
};
