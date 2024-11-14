import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases } from "../../config/appwrite";
import { Query } from "appwrite";
import { setProducts } from "./inventorySlice";
import { setPurchases } from "./purchaseSlice";
import { loadSales } from "./salesSlice";
import { setExpenses } from "./expenseSlice";

const COLLECTION_IDS = {
  inventory: import.meta.env.VITE_INVENTORY,
  sales: import.meta.env.VITE_SALES,
  purchases: import.meta.env.VITE_PURCHASES,
  expenses: import.meta.env.VITE_EXPENSES,
};

export const syncUserData = createAsyncThunk(
  "auth/syncUserData",
  async (userId, { dispatch }) => {
    try {
      const fetchData = async (collectionId) => {
        const response = await databases.listDocuments(
          "pos_database",
          collectionId,
          [Query.equal("userId", userId)]
        );
        return response.documents[0]?.data
          ? JSON.parse(response.documents[0].data)
          : null;
      };

      const [inventory, sales, purchases, expenses] = await Promise.all([
        fetchData(COLLECTION_IDS.inventory),
        fetchData(COLLECTION_IDS.sales),
        fetchData(COLLECTION_IDS.purchases),
        fetchData(COLLECTION_IDS.expenses),
      ]);

      if (inventory) dispatch(setProducts(inventory.products));
      if (sales) dispatch(loadSales(sales.sales));
      if (purchases) dispatch(setPurchases(purchases.purchases));
      if (expenses) dispatch(setExpenses(expenses));

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
        id: userData.$id,
        email: userData.email,
        name: userData.name,
        createdAt: userData.$createdAt,
      };
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
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
