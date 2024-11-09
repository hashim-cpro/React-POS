export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  
  localStorage.setItem('pos_inventory', JSON.stringify(state.inventory));
  localStorage.setItem('pos_sales', JSON.stringify(state.sales));
  localStorage.setItem('pos_purchases', JSON.stringify(state.purchases));
  localStorage.setItem('pos_expenses', JSON.stringify(state.expenses));
  
  return result;
};