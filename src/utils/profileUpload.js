import { storage, databases } from "../config/appwrite";
import { ID, Query } from "appwrite";
import { store } from "../store";
import { updateProfilePictureUrl } from "../store/slices/userSlice";

const BUCKET_ID = import.meta.env.VITE_PROFILE_PICTURES_BUCKET_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION = import.meta.env.VITE_USERS_COLLECTION;

export const uploadProfilePicture = async (file, userId, currentImageId) => {
  try {
    if (currentImageId) {
      try {
        await storage.deleteFile(BUCKET_ID, currentImageId);
      } catch (error) {
        console.error(
          `Failed to delete previous profile picture: ${error.message}`
        );
      }
    }

    const fileId = ID.unique();
    await storage.createFile(BUCKET_ID, fileId, file);

    // Updated preview parameters with correct border radius
    const fileUrl = storage.getFilePreview(
      BUCKET_ID,
      fileId,
      400, // width
      400, // height
      "center", // gravity
      100, // quality
      1, // border radius (0-4000)
      "ffffff", // background color
      "400" // border radius
    ).href;

    store.dispatch(updateProfilePictureUrl(fileUrl));

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION,
        [Query.equal("userId", userId)]
      );

      const userData = {
        data: JSON.stringify({ profilePictureUrl: fileUrl }),
        userId,
      };

      if (response.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION,
          response.documents[0].$id,
          userData
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          USERS_COLLECTION,
          ID.unique(),
          userData
        );
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }

    return { fileId, fileUrl };
  } catch (error) {
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }
};
