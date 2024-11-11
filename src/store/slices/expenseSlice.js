import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  categories: [
    "Rent",
    "Salaries",
    "Utilities",
    "Supplies",
    "Marketing",
    "Insurance",
    "Maintenance",
    "Other",
  ],
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.unshift({
        ...action.payload,
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      });
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
    addCategory: (state, action) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
  },
});

export const { addExpense, updateExpense, deleteExpense, addCategory } =
  expenseSlice.actions;
export default expenseSlice.reducer;
