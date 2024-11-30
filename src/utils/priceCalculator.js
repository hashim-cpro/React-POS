export const calculatePrices = (purchaseRate, minProfitMargin = 0.2) => {
  // Calculate minimum retail price with profit margin
  const minRetailPrice = purchaseRate * (1 + minProfitMargin);

  // Calculate suggested wholesale price (15% less than retail)
  const suggestedWholesalePrice = minRetailPrice * 0.85;

  return {
    minRetailPrice,
    suggestedWholesalePrice,
  };
};

export const validatePrices = (
  purchaseRate,
  retailPrice,
  wholesalePrice,
  minProfitMargin = 0.2
) => {
  const { minRetailPrice } = calculatePrices(purchaseRate, minProfitMargin);

  const errors = [];

  if (retailPrice < minRetailPrice) {
    errors.push(
      `Retail price must be at least $${minRetailPrice.toFixed(
        2
      )} to maintain ${minProfitMargin * 100}% profit margin`
    );
  }

  if (wholesalePrice <= purchaseRate) {
    errors.push("Wholesale price must be greater than purchase rate");
  }

  if (wholesalePrice >= retailPrice) {
    errors.push("Wholesale price must be less than retail price");
  }

  return errors;
};
