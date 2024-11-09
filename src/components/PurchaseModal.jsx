import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPurchase } from "../store/slices/purchaseSlice";
import { updateProduct } from "../store/slices/inventorySlice";
import { format } from "date-fns";

function PurchaseModal({ isOpen, onClose, product }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    quantity: "",
    costPerUnit: "",
    supplier: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = parseInt(formData.quantity);
    const costPerUnit = parseFloat(formData.costPerUnit);

    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (costPerUnit <= 0) {
      setError("Cost per unit must be greater than 0");
      return;
    }

    const purchase = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      ...formData,
      quantity: quantity,
      costPerUnit: costPerUnit,
      totalCost: quantity * costPerUnit,
      date: new Date(formData.date).toISOString(),
    };

    dispatch(addPurchase(purchase));
    dispatch(
      updateProduct({
        ...product,
        quantity: product.quantity + quantity,
      })
    );

    onClose();
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
        <div className="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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

          <h2 className="text-xl font-bold mb-6">Add Stock Purchase</h2>
          <p className="text-gray-600 mb-4">Product: {product.name}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purchase Date
              </label>
              <input
                type="date"
                className="input mt-1"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
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
                min="1"
                className="input mt-1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cost per Unit
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="input mt-1"
                value={formData.costPerUnit}
                onChange={(e) =>
                  setFormData({ ...formData, costPerUnit: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supplier
              </label>
              <input
                type="text"
                className="input mt-1"
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                className="input mt-1"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows="3"
              />
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
                Add Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PurchaseModal;
