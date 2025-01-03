import { databases } from "../../config/appwrite";
import { Query } from "appwrite";
import { setProducts } from "../slices/inventorySlice";
import { loadSales } from "../slices/salesSlice";
import { setPurchases } from "../slices/purchaseSlice";
import { setExpenses } from "../slices/expenseSlice";
import { updateProfilePictureUrl } from "../slices/userSlice";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_IDS = {
  inventory: import.meta.env.VITE_INVENTORY_COLLECTION,
  sales: import.meta.env.VITE_SALES_COLLECTION,
  purchases: import.meta.env.VITE_PURCHASES_COLLECTION,
  expenses: import.meta.env.VITE_EXPENSES_COLLECTION,
  user: import.meta.env.VITE_USERS_COLLECTION,
};

const SYNC_DEBOUNCE_TIME = 2000;
let syncTimeout = null;
let isSyncing = false;
let hasInitialDataLoaded = false;

// Default state structures
const DEFAULT_STATES = {
  inventory: { products: [] },
  sales: { sales: [], todayTotal: 0 },
  purchases: { purchases: [] },
  expenses: {
    expenses: [],
    categories: [
      "Rent",
      "Salaries",
      "Utilities",
      "Supplies",
      "Marketing",
      "Insurance",
      "Maintenance",
      "Other",
    ],
  },
  user: { profilePictureUrl: "" },
};

const fetchInitialData = async (userId, store) => {
  if (!userId || hasInitialDataLoaded) return;

  try {
    const responses = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.inventory, [
        Query.equal("userId", userId),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.sales, [
        Query.equal("userId", userId),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.purchases, [
        Query.equal("userId", userId),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.expenses, [
        Query.equal("userId", userId),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.user, [
        Query.equal("userId", userId),
      ]),
    ]);

    responses.forEach((response, index) => {
      try {
        let data = DEFAULT_STATES[Object.keys(COLLECTION_IDS)[index]];

        if (response.documents.length > 0) {
          const parsedData = JSON.parse(response.documents[0].data);
          data = { ...data, ...parsedData };
        }

        switch (index) {
          case 0: // inventory
            store.dispatch(setProducts(data.products || []));
            break;
          case 1: // sales
            store.dispatch(loadSales(data.sales || []));
            break;
          case 2: // purchases
            store.dispatch(setPurchases(data.purchases || []));
            break;
          case 3: // expenses
            store.dispatch(setExpenses(data));
            break;
          case 4: // user
            store.dispatch(
              updateProfilePictureUrl(data.profilePictureUrl || "")
            );
            break;
        }
      } catch (error) {
        console.error(`Error processing data for collection ${index}:`, error);
        // Use default state if parsing fails
        const defaultData = DEFAULT_STATES[Object.keys(COLLECTION_IDS)[index]];
        switch (index) {
          case 0:
            store.dispatch(setProducts(defaultData.products));
            break;
          case 1:
            store.dispatch(loadSales(defaultData.sales));
            break;
          case 2:
            store.dispatch(setPurchases(defaultData.purchases));
            break;
          case 3:
            store.dispatch(setExpenses(defaultData));
            break;
          case 4:
            store.dispatch(
              updateProfilePictureUrl(defaultData.profilePictureUrl)
            );
            break;
        }
      }
    });

    hasInitialDataLoaded = true;
  } catch (error) {
    console.error("Error fetching initial data:", error);
    // Initialize with default states if fetch fails
    Object.values(DEFAULT_STATES).forEach((defaultState, index) => {
      switch (index) {
        case 0:
          store.dispatch(setProducts(defaultState.products));
          break;
        case 1:
          store.dispatch(loadSales(defaultState.sales));
          break;
        case 2:
          store.dispatch(setPurchases(defaultState.purchases));
          break;
        case 3:
          store.dispatch(setExpenses(defaultState));
          break;
        case 4:
          store.dispatch(
            updateProfilePictureUrl(defaultState.profilePictureUrl)
          );
          break;
      }
    });
  }
};

const syncWithAppwrite = async (userId, collectionId, data) => {
  if (!userId || !collectionId || !hasInitialDataLoaded) return;

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
    throw error;
  }
};

const performSync = async (userId, state) => {
  if (isSyncing || !userId || !hasInitialDataLoaded) return;

  try {
    isSyncing = true;

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

  // Fetch initial data when user logs in
  if (user?.id && !hasInitialDataLoaded) {
    fetchInitialData(user.id, store);
  }

  // Debounce sync with Appwrite for subsequent changes
  if (user?.id && hasInitialDataLoaded) {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(() => {
      performSync(user.id, state);
    }, SYNC_DEBOUNCE_TIME);
  }

  return result;
};
