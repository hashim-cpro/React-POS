import { databases } from "../../config/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_IDS = {
  inventory: import.meta.env.VITE_INVENTORY_COLLECTION,
  sales: import.meta.env.VITE_SALES_COLLECTION,
  purchases: import.meta.env.VITE_PURCHASES_COLLECTION,
  expenses: import.meta.env.VITE_EXPENSES_COLLECTION,
};

const SYNC_DEBOUNCE_TIME = 2000; // 2 seconds
let syncTimeout = null;
let isSyncing = false;

const syncWithAppwrite = async (userId, collectionId, data) => {
  if (!userId || !collectionId) return;

  try {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.equal("userId", userId),
    ]);

    const documentData = { data: JSON.stringify(data) };

    if (response.documents.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        collectionId,
        response.documents[0].$id,
        documentData
      );
    } else {
      await databases.createDocument(DATABASE_ID, collectionId, "unique()", {
        ...documentData,
        userId,
      });
    }
  } catch (error) {
    console.error(`Sync error for ${collectionId}:`, error);
  }
};

const performSync = async (userId, state) => {
  if (isSyncing || !userId) return;

  try {
    isSyncing = true;

    await Promise.allSettled([
      syncWithAppwrite(userId, COLLECTION_IDS.inventory, state.inventory),
      syncWithAppwrite(userId, COLLECTION_IDS.sales, state.sales),
      syncWithAppwrite(userId, COLLECTION_IDS.purchases, state.purchases),
      syncWithAppwrite(userId, COLLECTION_IDS.expenses, state.expenses),
    ]);
  } catch (error) {
    console.error("Sync error:", error);
  } finally {
    isSyncing = false;
  }
};

export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  const { user } = state.auth;

  // Save to sessionStorage for temporary persistence
  try {
    sessionStorage.setItem("pos_inventory", JSON.stringify(state.inventory));
    sessionStorage.setItem("pos_sales", JSON.stringify(state.sales));
    sessionStorage.setItem("pos_purchases", JSON.stringify(state.purchases));
    sessionStorage.setItem("pos_expenses", JSON.stringify(state.expenses));
  } catch (error) {
    console.error("Session storage error:", error);
  }

  // Debounce sync with Appwrite
  if (user?.id) {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(() => {
      performSync(user.id, state);
    }, SYNC_DEBOUNCE_TIME);
  }

  return result;
};
