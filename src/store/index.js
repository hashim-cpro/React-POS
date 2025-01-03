import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import inventoryReducer from "./slices/inventorySlice";
import salesReducer from "./slices/salesSlice";
import purchaseReducer from "./slices/purchaseSlice";
import expenseReducer from "./slices/expenseSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";
import { getDocuments } from "../config/appwrite";

const loadState = async () => {
  console.log(
    getDocuments(
      import.meta.env.VITE_INVENTORY_COLLECTION,
      "6777c0f72d1703f39e47"
    )
  );
  try {
    // const inventory = sessionStorage.getItem("pos_inventory");
    // const response = await getDocuments(
    //   import.meta.env.VITE_INVENTORY_COLLECTION,
    //   "6777c0f72d1703f39e47"
    // );
    // const inventory = await response[response.length - 1].document[0].data;
    const inventory = sessionStorage.getItem("pos_inventory");
    const sales = sessionStorage.getItem("pos_sales");
    const purchases = sessionStorage.getItem("pos_purchases");
    const expenses = sessionStorage.getItem("pos_expenses");
    const userdata = sessionStorage.getItem("pos_user");

    return {
      inventory: inventory ? JSON.parse(inventory) : undefined,
      sales: sales ? JSON.parse(sales) : undefined,
      purchases: purchases ? JSON.parse(purchases) : undefined,
      expenses: expenses ? JSON.parse(expenses) : undefined,
      userdata: userdata ? JSON.parse(userdata) : undefined,
    };
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    purchases: purchaseReducer,
    expenses: expenseReducer,
    auth: authReducer,
    userdata: userReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
//
