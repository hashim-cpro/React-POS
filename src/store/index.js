import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import inventoryReducer from "./slices/inventorySlice";
import salesReducer from "./slices/salesSlice";
import purchaseReducer from "./slices/purchaseSlice";
import expenseReducer from "./slices/expenseSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";

const loadState = () => {
  try {
    const inventory = localStorage.getItem("pos_inventory");
    const sales = localStorage.getItem("pos_sales");
    const purchases = localStorage.getItem("pos_purchases");
    const expenses = localStorage.getItem("pos_expenses");
    const userdata = localStorage.getItem("pos_user");

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
