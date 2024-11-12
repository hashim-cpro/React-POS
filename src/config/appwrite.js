import { Client, Account, Databases } from "appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
} from "./Api";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Authentication functions
export const login = async (email, password) => {
  try {
    await account.createEmailSession(email, password);
    const user = await account.get();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const register = async (email, password, name) => {
  try {
    const user = await account.create("unique()", email, password, name);
    if (user) {
      const session = await login(email, password);
      return { success: true, data: { user, session: session.data } };
    }
    return { success: false, error: "Registration failed" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Database helper functions
export const createCollection = async (collectionId, data, userId) => {
  try {
    return await databases.createDocument(
      APPWRITE_DATABASE_ID,
      collectionId,
      "unique()",
      {
        userId,
        data: JSON.stringify(data),
      }
    );
  } catch (error) {
    console.error(`Error creating ${collectionId}:`, error);
    throw error;
  }
};

export const updateCollection = async (collectionId, documentId, data) => {
  try {
    return await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      collectionId,
      documentId,
      {
        data: JSON.stringify(data),
      }
    );
  } catch (error) {
    console.error(`Error updating ${collectionId}:`, error);
    throw error;
  }
};
