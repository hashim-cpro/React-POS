import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1, discount: 0 });
      }
      state.total = state.items.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity, price } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        if (price !== undefined) {
          item.price = price;
        }
      }
      state.total = state.items.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);
    },
    updateDiscount: (state, action) => {
      const { id, discount } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.discount = discount;
      }
      state.total = state.items.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  updateDiscount,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
