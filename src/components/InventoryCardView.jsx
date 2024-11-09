import React from "react";
import { useSelector } from "react-redux";

function InventoryCardView({ onEdit, searchTerm }) {
  const { products } = useSelector((state) => state.inventory);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      product.sku.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      product.category.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  const getStockStatus = (product) => {
    const { quantity, minStockLevel = 5 } = product;
    if (quantity <= 0) return { color: "red", text: "Out of Stock" };
    if (quantity <= minStockLevel)
      return { color: "yellow", text: "Low Stock" };
    return { color: "green", text: "In Stock" };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredProducts.map((product) => {
        const stockStatus = getStockStatus(product);
        return (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="aspect-w-3 aspect-h-2">
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    stockStatus.color === "green"
                      ? "bg-green-100 text-green-800"
                      : stockStatus.color === "yellow"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stockStatus.text} ({product.quantity})
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
              {product.quantity <= product.minStockLevel && (
                <p className="text-sm text-yellow-600 mt-1">
                  Below minimum stock level ({product.minStockLevel})
                </p>
              )}
              <div className="mt-4">
                <button
                  onClick={() => onEdit(product)}
                  className="btn btn-secondary w-full"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
}

export default InventoryCardView;
