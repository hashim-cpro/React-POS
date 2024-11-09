import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  purchases: [],
  loading: false,
  error: null,
};

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    addPurchase: (state, action) => {
      const newPurchase = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.purchases.unshift(newPurchase);
    },
    setPurchases: (state, action) => {
      state.purchases = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addPurchase, setPurchases, setLoading, setError } = purchaseSlice.actions;
export default purchaseSlice.reducer;