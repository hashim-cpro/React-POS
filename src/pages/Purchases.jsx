import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import PurchaseModal from "../components/PurchaseModal";

function Purchases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { purchases } = useSelector((state) => state.purchases);
  const { products } = useSelector((state) => state.inventory);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePurchase = (product) => {
    setSelectedProduct(product);
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search products..."
                className="input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image || "https://via.placeholder.com/100"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </p>
                        <p className="text-sm text-gray-500">
                          Current Stock: {product.quantity}
                        </p>
                        <button
                          onClick={() => handlePurchase(product)}
                          className="btn btn-primary mt-2"
                        >
                          Purchase Stock
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-4 text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Recent Purchases</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {purchases.slice(0, 5).map((purchase) => (
                  <div
                    key={purchase.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{purchase.productName}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(purchase.date), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${purchase.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Quantity: {purchase.quantity} @ $
                      {purchase.costPerUnit.toFixed(2)}/unit
                    </div>
                    {purchase.supplier && (
                      <div className="mt-1 text-sm text-gray-500">
                        Supplier: {purchase.supplier}
                      </div>
                    )}
                  </div>
                ))}
                {purchases.length === 0 && (
                  <p className="text-center text-gray-500">
                    No recent purchases
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Purchase History</h2>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(purchase.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {purchase.productName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          ${purchase.totalCost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default Purchases;
