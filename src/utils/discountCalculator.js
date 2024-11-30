export const calculateMaxDiscount = (item) => {
  const minProfit = 0.1; // 10% minimum profit margin
  const purchaseRate = item.purchaseRate || 0;
  const sellingPrice = item.price || 0;

  if (!purchaseRate || !sellingPrice) return 0;

  const maxDiscountAmount = sellingPrice - purchaseRate * (1 + minProfit);
  return Math.max(0, (maxDiscountAmount / sellingPrice) * 100);
};

export const calculateDiscountedPrice = (price, discountPercentage) => {
  if (!price || !discountPercentage) return price;
  const discount = (discountPercentage / 100) * price;
  return Math.max(0, price - discount);
};

export const calculateProfitMargin = (sellingPrice, purchaseRate) => {
  if (!sellingPrice || !purchaseRate) return 0;
  return ((sellingPrice - purchaseRate) / purchaseRate) * 100;
};
