import { databases } from "../../config/appwrite";
import { Query } from "appwrite";

const COLLECTION_IDS = {
  inventory: "inventory",
  sales: "sales",
  purchases: "purchases",
  expenses: "expenses",
};

export const localStorageMiddleware = (store) => (next) => async (action) => {
  const result = next(action);
  const state = store.getState();
  const { user } = state.auth;

  // Always save to localStorage
  localStorage.setItem("pos_inventory", JSON.stringify(state.inventory));
  localStorage.setItem("pos_sales", JSON.stringify(state.sales));
  localStorage.setItem("pos_purchases", JSON.stringify(state.purchases));
  localStorage.setItem("pos_expenses", JSON.stringify(state.expenses));

  // If user is authenticated, sync with Appwrite
  if (user) {
    try {
      const syncData = async (collectionId, data) => {
        const existingDocs = await databases.listDocuments(
          "pos_database",
          collectionId,
          [Query.equal("userId", user.id)]
        );

        if (existingDocs.documents.length > 0) {
          await databases.updateDocument(
            "pos_database",
            collectionId,
            existingDocs.documents[0].$id,
            { data: JSON.stringify(data) }
          );
        } else {
          await databases.createDocument(
            "pos_database",
            collectionId,
            "unique()",
            {
              userId: user.id,
              data: JSON.stringify(data),
            }
          );
        }
      };

      // Sync each data type
      await Promise.all([
        syncData(COLLECTION_IDS.inventory, state.inventory),
        syncData(COLLECTION_IDS.sales, state.sales),
        syncData(COLLECTION_IDS.purchases, state.purchases),
        syncData(COLLECTION_IDS.expenses, state.expenses),
      ]);
    } catch (error) {
      console.error("Error syncing with Appwrite:", error);
    }
  }

  return result;
};
