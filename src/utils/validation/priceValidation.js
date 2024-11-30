/**
 * Validates price-related inputs for products
 * @param {number} purchaseRate - The purchase cost of the product
 * @param {number} retailPrice - The retail selling price
 * @param {number} wholesalePrice - The wholesale price
 * @param {number} minProfitMargin - Minimum required profit margin (decimal)
 * @returns {string[]} Array of validation error messages
 */
export const validatePrices = (
  purchaseRate,
  retailPrice,
  wholesalePrice,
  minProfitMargin = 0.2
) => {
  const errors = [];

  if (!purchaseRate || purchaseRate <= 0) {
    errors.push("Purchase rate must be greater than 0");
  }

  if (!retailPrice || retailPrice <= 0) {
    errors.push("Retail price must be greater than 0");
  }

  if (!wholesalePrice || wholesalePrice <= 0) {
    errors.push("Wholesale price must be greater than 0");
  }

  if (retailPrice && purchaseRate) {
    const minRetailPrice = purchaseRate * (1 + minProfitMargin);
    if (retailPrice < minRetailPrice) {
      errors.push(
        `Retail price must be at least $${minRetailPrice.toFixed(
          2
        )} to maintain ${minProfitMargin * 100}% profit margin`
      );
    }
  }

  if (wholesalePrice && purchaseRate && wholesalePrice <= purchaseRate) {
    errors.push("Wholesale price must be greater than purchase rate");
  }

  if (wholesalePrice && retailPrice && wholesalePrice >= retailPrice) {
    errors.push("Wholesale price must be less than retail price");
  }

  return errors;
};
