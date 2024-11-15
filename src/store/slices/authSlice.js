import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases } from "../../config/appwrite";
import { Query } from "appwrite";
import { setProducts } from "./inventorySlice";
import { setPurchases } from "./purchaseSlice";
import { loadSales } from "./salesSlice";
import { setExpenses } from "./expenseSlice";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_IDS = {
  inventory: import.meta.env.VITE_INVENTORY_COLLECTION,
  sales: import.meta.env.VITE_SALES_COLLECTION,
  purchases: import.meta.env.VITE_PURCHASES_COLLECTION,
  expenses: import.meta.env.VITE_EXPENSES_COLLECTION,
};

const fetchCollectionData = async (collectionId, userId) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.equal("userId", userId),
    ]);

    if (response.documents.length > 0) {
      return JSON.parse(response.documents[0].data);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${collectionId}:`, error);
    return null;
  }
};

export const syncUserData = createAsyncThunk(
  "auth/syncUserData",
  async (userId, { dispatch }) => {
    if (!userId) return false;

    try {
      const [inventory, sales, purchases, expenses] = await Promise.all([
        fetchCollectionData(COLLECTION_IDS.inventory, userId),
        fetchCollectionData(COLLECTION_IDS.sales, userId),
        fetchCollectionData(COLLECTION_IDS.purchases, userId),
        fetchCollectionData(COLLECTION_IDS.expenses, userId),
      ]);

      if (inventory?.products) {
        dispatch(setProducts(inventory.products));
      }
      if (sales?.sales) {
        dispatch(loadSales(sales.sales));
      }
      if (purchases?.purchases) {
        dispatch(setPurchases(purchases.purchases));
      }
      if (expenses) {
        dispatch(setExpenses(expenses));
      }

      return true;
    } catch (error) {
      console.error("Error syncing user data:", error);
      return false;
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  syncing: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;
      state.user = {
        id: userData.id || userData.$id,
        email: userData.email,
        name: userData.name,
        createdAt: userData.$createdAt || userData.createdAt,
      };
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      sessionStorage.clear();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncUserData.pending, (state) => {
        state.syncing = true;
      })
      .addCase(syncUserData.fulfilled, (state) => {
        state.syncing = false;
      })
      .addCase(syncUserData.rejected, (state) => {
        state.syncing = false;
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
//lkahklfklk ,khk
