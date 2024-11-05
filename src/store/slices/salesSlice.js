import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sales: [],
  todayTotal: 0,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addSale: (state, action) => {
      state.sales.push(action.payload);
      // Update today's total
      const today = new Date().toDateString();
      state.todayTotal = state.sales
        .filter(sale => new Date(sale.date).toDateString() === today)
        .reduce((sum, sale) => sum + sale.total, 0);
    },
    clearSales: (state) => {
      state.sales = [];
      state.todayTotal = 0;
    },
  },
});

export const { addSale, clearSales } = salesSlice.actions;
export default salesSlice.reducer;