import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import inventoryReducer from './slices/inventorySlice';
import salesReducer from './slices/salesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
  },
});