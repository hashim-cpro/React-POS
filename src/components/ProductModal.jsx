import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../store/slices/inventorySlice";

function ProductModal({ isOpen, onClose, product: editingProduct }) {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.inventory);
  const [error, setError] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const dropdownRef = useRef(null);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    sku: "",
    quantity: "",
    minStockLevel: "",
    category: "",
    description: "",
    image: "",
  });

  // Get unique categories from existing products
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
        price: editingProduct.price.toString(),
        quantity: editingProduct.quantity.toString(),
        minStockLevel: editingProduct.minStockLevel?.toString() || "5",
      });
    } else {
      setProduct({
        name: "",
        price: "",
        sku: "",
        quantity: "",
        minStockLevel: "5",
        category: "",
        description: "",
        image: "",
      });
    }
    setError("");
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

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateProduct()) return;

    const processedProduct = {
      ...product,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
      minStockLevel: parseInt(product.minStockLevel),
    };

    if (editingProduct) {
      dispatch(updateProduct({ ...processedProduct, id: editingProduct.id }));
    } else {
      dispatch(addProduct({ ...processedProduct, id: Date.now().toString() }));
    }
    onClose();
  };

  const handleCategorySelect = (category) => {
    setProduct({ ...product, category });
    setShowCategoryDropdown(false);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      setProduct({ ...product, category: newCategory.trim() });
      setNewCategory("");
      setShowCategoryDropdown(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:max-w-lg md:max-w-xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input mt-1"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  value={product.sku}
                  onChange={(e) =>
                    setProduct({ ...product, sku: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
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
                  Minimum Stock Level
                  <span className="ml-1 text-xs text-gray-500">
                    (Alert Threshold)
                  </span>
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
                            onClick={() => handleCategorySelect(category)}
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
                        {product.category && (
                          <button
                            type="button"
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                            onClick={() =>
                              handleCategorySelect(product.category)
                            }
                          >
                            Add "{product.category}" as new category
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
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

            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
              >
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
