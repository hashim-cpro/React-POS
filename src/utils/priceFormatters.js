export const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "0.00";
  }
  return price.toFixed(2);
};

export const calculateItemTotal = (price, quantity) => {
  if (typeof price !== "number" || typeof quantity !== "number") {
    return 0;
  }
  return price * quantity;
};
