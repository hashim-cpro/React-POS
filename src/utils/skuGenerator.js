export const generateSKU = (category, existingProducts) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const categoryPrefix = category.slice(0, 2).toUpperCase();

  // Get existing SKUs for this category
  const existingSKUs = existingProducts
    .filter((p) => p.sku.startsWith(categoryPrefix))
    .map((p) => parseInt(p.sku.slice(2, 6)));

  // Find the next available number
  let sequentialNumber = 1;
  if (existingSKUs.length > 0) {
    sequentialNumber = Math.max(...existingSKUs) + 1;
  }

  // Format the sequential number to 4 digits
  const formattedNumber = sequentialNumber.toString().padStart(4, "0");

  return `${categoryPrefix}${formattedNumber}${year}`;
};
