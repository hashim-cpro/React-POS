import { databases } from "../config/appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTIONS = {
  users: import.meta.env.VITE_USERS_COLLECTION,
  inventory: import.meta.env.VITE_INVENTORY_COLLECTION,
  sales: import.meta.env.VITE_SALES_COLLECTION,
  purchases: import.meta.env.VITE_PURCHASES_COLLECTION,
  expenses: import.meta.env.VITE_EXPENSES_COLLECTION,
};

class UserDataService {
  static async initializeUserData(userId, userData) {
    try {
      const collections = Object.values(COLLECTIONS);
      const existingDocs = await Promise.all(
        collections.map((collectionId) =>
          this.checkExistingDocument(collectionId, userId)
        )
      );

      const createPromises = collections.map((collectionId, index) => {
        if (!existingDocs[index]) {
          return this.createInitialDocument(collectionId, userId, {
            userData: collectionId === COLLECTIONS.users ? userData : {},
            lastSync: new Date().toISOString(),
          });
        }
        return Promise.resolve();
      });

      await Promise.all(createPromises);

      return { success: true };
    } catch (error) {
      console.error("Failed to initialize user data:", error);
      return { success: false, error: error.message };
    }
  }

  static async checkExistingDocument(collectionId, userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [Query.equal("userId", userId)]
      );
      return response.documents.length > 0;
    } catch (error) {
      console.error(`Error checking document in ${collectionId}:`, error);
      return false;
    }
  }

  static async createInitialDocument(collectionId, userId, data) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        collectionId,
        ID.unique(),
        {
          userId,
          data: JSON.stringify(data),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error(`Error creating document in ${collectionId}:`, error);
      throw error;
    }
  }

  static async updateUserData(collectionId, userId, data, options = {}) {
    try {
      const { upsert = true } = options;
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [Query.equal("userId", userId)]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        return await databases.updateDocument(
          DATABASE_ID,
          collectionId,
          doc.$id,
          {
            data: JSON.stringify(data),
            updatedAt: new Date().toISOString(),
          }
        );
      } else if (upsert) {
        return await this.createInitialDocument(collectionId, userId, data);
      }

      throw new Error("Document not found and upsert is disabled");
    } catch (error) {
      console.error(`Error updating document in ${collectionId}:`, error);
      throw error;
    }
  }

  static async getUserData(collectionId, userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [Query.equal("userId", userId)]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        return {
          success: true,
          data: JSON.parse(doc.data),
          metadata: {
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          },
        };
      }

      return { success: false, error: "Document not found" };
    } catch (error) {
      console.error(`Error fetching document from ${collectionId}:`, error);
      return { success: false, error: error.message };
    }
  }

  static async syncUserData(userId, collectionId, data) {
    try {
      const currentData = await this.getUserData(collectionId, userId);

      if (!currentData.success) {
        return await this.createInitialDocument(collectionId, userId, data);
      }

      // Merge existing data with new data
      const mergedData = {
        ...currentData.data,
        ...data,
        lastSync: new Date().toISOString(),
      };

      return await this.updateUserData(collectionId, userId, mergedData);
    } catch (error) {
      console.error(`Error syncing data in ${collectionId}:`, error);
      throw error;
    }
  }
}

export default UserDataService;
