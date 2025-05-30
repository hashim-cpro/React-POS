import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { formatPrice } from "../utils/priceFormatters";

function InventoryCardView({ onEdit = () => {}, products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product);
        const retailPrice = product.retailPrice || 0;
        const wholesalePrice = product.wholesalePrice || 0;
        const purchaseRate = product.purchaseRate || 0;

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
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Retail:</span>
                  <span className="font-medium">
                    ${formatPrice(retailPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wholesale:</span>
                  <span className="font-medium">
                    ${formatPrice(wholesalePrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Purchase:</span>
                  <span className="font-medium">
                    ${formatPrice(purchaseRate)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
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
              {product.quantity <= (product.minStockLevel || 5) && (
                <p className="text-sm text-yellow-600 mt-1">
                  Below minimum stock level ({product.minStockLevel || 5})
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
      {products.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
}

const getStockStatus = (product) => {
  const { quantity, minStockLevel = 5 } = product;
  if (quantity <= 0) return { color: "red", text: "Out of Stock" };
  if (quantity <= minStockLevel) return { color: "yellow", text: "Low Stock" };
  return { color: "green", text: "In Stock" };
};

InventoryCardView.propTypes = {
  onEdit: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default InventoryCardView;
