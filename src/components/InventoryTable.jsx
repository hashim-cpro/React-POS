import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

function InventoryTable({ onEdit, searchTerm }) {
  const { products } = useSelector((state) => state.inventory);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      product.sku.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      product.category.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase();
    const bValue = b[sortField]?.toString().toLowerCase();
    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });

  const handleSort = (field) => {
    setSortDirection(
      sortField === field && sortDirection === "asc" ? "desc" : "asc"
    );
    setSortField(field);
  };

  const getStockStatus = (product) => {
    const { quantity, minStockLevel = 5 } = product;
    if (quantity <= 0) return { color: "red", text: "Out of Stock" };
    if (quantity <= minStockLevel)
      return { color: "yellow", text: "Low Stock" };
    return { color: "green", text: "In Stock" };
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Details
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("sku")}
              >
                SKU
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                Stock Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            product.image || "https://via.placeholder.com/40"
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-gray-500">{product.category}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {product.sku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
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
                    {product.quantity <= product.minStockLevel && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Min: {product.minStockLevel}
                      </p>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedProducts.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;
