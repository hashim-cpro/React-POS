import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../store/slices/inventorySlice";
import { generateSKU } from "../utils/skuGenerator";
import { calculatePrices, validatePrices } from "../utils/priceCalculator";

function ProductModal({ isOpen, onClose, product: editingProduct }) {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.inventory);
  const [error, setError] = useState("");
  const [priceErrors, setPriceErrors] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [minRetailPrice, setminRetailPrice] = useState(0);
  const [suggestedWholesalePrice, setsuggestedWholesalePrice] = useState(0);
  const [product, setProduct] = useState({
    name: "",
    retailPrice: "",
    wholesalePrice: "",
    purchaseRate: "",
    minWholesaleQty: "0",
    sku: "",
    quantity: "",
    minStockLevel: "",
    category: "",
    description: "",
    image: "",
  });

  const existingCategories = [
    ...new Set(products.map((p) => p.category)),
  ].filter(Boolean);
  const filteredCategories = existingCategories.filter((category) =>
    category.toLowerCase().includes(product.category.toLowerCase())
  );

  useEffect(() => {
    if (editingProduct) {
      setProduct({
        ...editingProduct,
        retailPrice: editingProduct.retailPrice.toString(),
        wholesalePrice: editingProduct.wholesalePrice.toString(),
        purchaseRate: editingProduct.purchaseRate.toString(),
        quantity: editingProduct.quantity.toString(),
        minStockLevel: editingProduct.minStockLevel.toString() || "5",
        minWholesaleQty: editingProduct.minWholesaleQty.toString() || "10",
      });
    } else {
      setProduct({
        name: "",
        retailPrice: "",
        wholesalePrice: "",
        purchaseRate: "",
        minWholesaleQty: "10",
        sku: "",
        quantity: "",
        minStockLevel: "5",
        category: "",
        description: "",
        image: "",
      });
    }
    setError("");
    setPriceErrors([]);
  }, [editingProduct]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePurchaseRateChange = (value) => {
    const purchaseRate = parseFloat(value);
    if (!isNaN(purchaseRate)) {
      const response = calculatePrices(purchaseRate);
      setminRetailPrice(Math.floor(response.minRetailPrice));
      setsuggestedWholesalePrice(Math.floor(response.suggestedWholesalePrice));

      setProduct((prev) => ({
        ...prev,
        purchaseRate: value,
        retailPrice: prev.retailPrice,
        wholesalePrice: prev.wholesalePrice,
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        purchaseRate: value,
      }));
    }
  };

  const validateProduct = () => {
    const existingProduct = products.find(
      (p) =>
        p.name.toLowerCase() === product.name.toLowerCase() &&
        p.category.toLowerCase() === product.category.toLowerCase() &&
        p.id !== editingProduct?.id
    );

    if (existingProduct) {
      setError(
        `A product named "${product.name}" already exists in the "${product.category}" category`
      );
      return false;
    }

    const errors = validatePrices(
      parseFloat(product.purchaseRate),
      parseFloat(product.retailPrice),
      parseFloat(product.wholesalePrice)
    );

    if (errors.length > 0) {
      setPriceErrors(errors);
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateProduct()) return;

    const processedProduct = {
      ...product,
      retailPrice: parseFloat(product.retailPrice),
      wholesalePrice: parseFloat(product.wholesalePrice),
      purchaseRate: parseFloat(product.purchaseRate),
      quantity: parseInt(product.quantity),
      minStockLevel: parseInt(product.minStockLevel),
      minWholesaleQty: parseInt(product.minWholesaleQty),
    };

    if (!editingProduct) {
      processedProduct.sku = generateSKU(product.category, products);
    }

    if (editingProduct) {
      dispatch(updateProduct({ ...processedProduct, id: editingProduct.id }));
    } else {
      dispatch(addProduct({ ...processedProduct, id: Date.now().toString() }));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-bold mb-6">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {priceErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {priceErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  value={product.name}
                  onChange={(e) => {
                    setProduct({ ...product, name: e.target.value });
                    setError("");
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Rate
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="input mt-1"
                  value={product.purchaseRate}
                  onChange={(e) => handlePurchaseRateChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Retail Price
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="input mt-1"
                  value={product.retailPrice}
                  placeholder={">=" + minRetailPrice}
                  onChange={(e) =>
                    setProduct({ ...product, retailPrice: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wholesale Price
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="input mt-1"
                  value={product.wholesalePrice}
                  placeholder={">=" + suggestedWholesalePrice}
                  onChange={(e) =>
                    setProduct({ ...product, wholesalePrice: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Min. Wholesale Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="input mt-1"
                  value={product.minWholesaleQty}
                  onChange={(e) =>
                    setProduct({ ...product, minWholesaleQty: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Stock
                </label>
                <input
                  type="number"
                  min="0"
                  className="input mt-1"
                  value={product.quantity}
                  onChange={(e) =>
                    setProduct({ ...product, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Min. Stock Level
                </label>
                <input
                  type="number"
                  min="0"
                  className="input mt-1"
                  value={product.minStockLevel}
                  onChange={(e) =>
                    setProduct({ ...product, minStockLevel: e.target.value })
                  }
                  required
                />
              </div>

              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  value={product.category}
                  onChange={(e) => {
                    setProduct({ ...product, category: e.target.value });
                    setShowCategoryDropdown(true);
                    setError("");
                  }}
                  onFocus={() => setShowCategoryDropdown(true)}
                  required
                />
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {filteredCategories.length > 0 ? (
                      <ul className="max-h-48 overflow-auto">
                        {filteredCategories.map((category) => (
                          <li
                            key={category}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setProduct({ ...product, category });
                              setShowCategoryDropdown(false);
                            }}
                          >
                            {category}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4">
                        <p className="text-sm text-gray-500">
                          No matching categories
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingProduct && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    className="input mt-1 bg-gray-100"
                    value={product.sku}
                    disabled
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="input mt-1"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  className="input mt-1"
                  value={product.image}
                  onChange={(e) =>
                    setProduct({ ...product, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    retailPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    wholesalePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchaseRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minWholesaleQty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sku: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minStockLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default ProductModal;
