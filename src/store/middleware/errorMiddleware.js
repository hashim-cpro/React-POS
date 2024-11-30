/**
 * Redux middleware for centralized error handling
 */
export const errorMiddleware = () => (next) => (action) => {
  // Check if the action is a rejected promise
  if (action.type?.endsWith("/rejected")) {
    console.error("Action Error:", action.error);
    // Here you could dispatch a global error notification action
    // or handle errors in a centralized way
  }

  return next(action);
};
