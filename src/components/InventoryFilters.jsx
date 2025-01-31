import { useState } from "react";
import PropTypes from "prop-types";
import { FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";

function InventoryFilters({ onFilterChange, onSortChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    stockStatus: "all", // all, inStock, lowStock, outOfStock
    minPrice: "",
    maxPrice: "",
  });

  const [sortConfig, setSortConfig] = useState({
    field: "name",
    direction: "asc",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (field) => {
    const direction =
      sortConfig.field === field && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    const newSortConfig = { field, direction };
    setSortConfig(newSortConfig);
    onSortChange(newSortConfig);
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-2">
        <button
          className={`btn ${showFilters ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
        <button
          className={`btn ${showSortOptions ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setShowSortOptions(!showSortOptions)}
        >
          <ArrowsUpDownIcon className="h-5 w-5 mr-2" />
          Sort
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="input"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              className="input"
              value={filters.stockStatus}
              onChange={(e) =>
                handleFilterChange("stockStatus", e.target.value)
              }
            >
              <option value="all">All</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                className="input"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder="Min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                className="input"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      )}

      {showSortOptions && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Name", field: "name" },
              { label: "Price", field: "retailPrice" },
              { label: "Stock", field: "quantity" },
              { label: "Category", field: "category" },
            ].map(({ label, field }) => (
              <button
                key={field}
                className={`btn ${
                  sortConfig.field === field ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => handleSortChange(field)}
              >
                {label}
                {sortConfig.field === field && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

InventoryFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default InventoryFilters;
