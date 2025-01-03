import { databases } from "../../config/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_IDS = {
  inventory: import.meta.env.VITE_INVENTORY_COLLECTION,
  sales: import.meta.env.VITE_SALES_COLLECTION,
  purchases: import.meta.env.VITE_PURCHASES_COLLECTION,
  expenses: import.meta.env.VITE_EXPENSES_COLLECTION,
  user: import.meta.env.VITE_USERS_COLLECTION,
};

const SYNC_DEBOUNCE_TIME = 2000; // 2 seconds
let syncTimeout = null;
let isSyncing = false;
// let hasInitialDataLoaded = false;

const syncWithAppwrite = async (userId, collectionId, data) => {
  if (!userId || !collectionId) return;

  try {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.equal("userId", userId),
    ]);
    console.log(response);
    // Don't sync empty data if we already have data in Appwrite
    // if (Object.keys(data).length === 0 && response.documents.length > 0) {
    //   return;
    // }

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
    throw error;
  }
};

const performSync = async (userId, state) => {
  if (isSyncing || !userId) return;

  try {
    isSyncing = true;
    //This is the function doing all the syncing function, I have to make a logic here that first fetch the data from the documents and set the them as the initial state and then sync the data with the appwrite if the data is changed

    // If initial data hasn't been loaded and this is not a data loading action, skip sync
    // if (
    //   !hasInitialDataLoaded &&
    //   !action.type?.includes("setProducts") &&
    //   !action.type?.includes("loadSales") &&
    //   !action.type?.includes("setPurchases") &&
    //   !action.type?.includes("setExpenses") &&
    //   !action.type?.includes("updateProfilePictureUrl")
    // ) {
    //   return;
    // }

    // If this is a data loading action, mark initial data as loaded
    // if (
    //   action.type?.includes("setProducts") ||
    //   action.type?.includes("loadSales") ||
    //   action.type?.includes("setPurchases") ||
    //   action.type?.includes("setExpenses") ||
    //   action.type?.includes("updateProfilePictureUrl")
    // ) {
    //   hasInitialDataLoaded = true;
    // }

    await Promise.allSettled([
      syncWithAppwrite(userId, COLLECTION_IDS.inventory, state.inventory),
      syncWithAppwrite(userId, COLLECTION_IDS.sales, state.sales),
      syncWithAppwrite(userId, COLLECTION_IDS.purchases, state.purchases),
      syncWithAppwrite(userId, COLLECTION_IDS.expenses, state.expenses),
      syncWithAppwrite(userId, COLLECTION_IDS.user, state.userdata),
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
    sessionStorage.setItem("pos_user", JSON.stringify(state.userdata));
  } catch (error) {
    console.error("Session storage error:", error);
  }

  // Debounce sync with Appwrite
  if (user?.id) {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(() => {
      performSync(user.id, state, action);
    }, SYNC_DEBOUNCE_TIME);
  }

  return result;
};
