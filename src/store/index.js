import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import inventoryReducer from "./slices/inventorySlice";
import salesReducer from "./slices/salesSlice";
import purchaseReducer from "./slices/purchaseSlice";
import expenseReducer from "./slices/expenseSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    purchases: purchaseReducer,
    expenses: expenseReducer,
    auth: authReducer,
    userdata: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export { store };
