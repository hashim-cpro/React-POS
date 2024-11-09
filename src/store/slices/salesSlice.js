import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sales: [],
  todayTotal: 0,
};

const calculateTodayTotal = (sales) => {
  const today = new Date().toDateString();
  return sales
    .filter((sale) => new Date(sale.date).toDateString() === today)
    .reduce((sum, sale) => sum + sale.total, 0);
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    addSale: (state, action) => {
      const newSale = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.sales.push(newSale);
      state.todayTotal = calculateTodayTotal(state.sales);
    },
    clearSales: (state) => {
      state.sales = [];
      state.todayTotal = 0;
    },
    // Add this reducer to handle initial state loading
    loadSales: (state, action) => {
      state.sales = action.payload;
      state.todayTotal = calculateTodayTotal(action.payload);
    },
  },
});

export const { addSale, clearSales, loadSales } = salesSlice.actions;
export default salesSlice.reducer;
