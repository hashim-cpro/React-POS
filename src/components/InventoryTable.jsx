import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
// import { ActiveTable } from "active-table-react";

function InventoryTable({ onEdit = () => {}, searchTerm = "" }) {
  const { products } = useSelector((state) => state.inventory);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  // const data = [
  //   [{ header: "Name", type: "Text", editable: false }],
  //   ["Earth", 12756, "E123", 100, "Warehouse A", 5000, 5500, 6000],
  //   ["Mars", 6792, "M456", 50, "Warehouse B", 3000, 3300, 3600],
  //   // Additional rows...
  // ];
  const [columnWidths, setColumnWidths] = useState({
    product: 150,
    details: 250,
    sku: 120,
    prices: 200,
    stock: 180,
    actions: 100,
  });

  const handleMouseDown = (e, colKey) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[colKey];

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + moveEvent.clientX - startX;
      setColumnWidths((prev) => ({
        ...prev,
        [colKey]: Math.max(newWidth, 80),
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

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

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div
        className="overflow-x-auto w-full"
        role="region"
        aria-label="Inventory table"
      >
        <table className="min-w-full table-fixed border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                style={{ width: columnWidths.product }}
                className="py-3.5 pl-4 pr-2 text-left text-sm font-semibold text-gray-900 relative border border-gray-200"
              >
                Product
                <span
                  onMouseDown={(e) => handleMouseDown(e, "product")}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
                  role="separator"
                  aria-orientation="vertical"
                />
              </th>
              <th
                scope="col"
                style={{ width: columnWidths.details }}
                className="py-3.5 pl-4 pr-2 text-left text-sm font-semibold text-gray-900 relative border border-gray-200"
              >
                Details
                <span
                  onMouseDown={(e) => handleMouseDown(e, "details")}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
                  role="separator"
                  aria-orientation="vertical"
                />
              </th>
              <th
                scope="col"
                style={{ width: columnWidths.sku }}
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hidden md:table-cell relative border border-gray-200"
                onClick={() => handleSort("sku")}
              >
                SKU
                <span
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, "sku");
                  }}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
                  role="separator"
                  aria-orientation="vertical"
                />
              </th>
              <th
                scope="col"
                style={{ width: columnWidths.prices }}
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer relative border border-gray-200"
                onClick={() => handleSort("retailPrice")}
              >
                Prices
                <span
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, "prices");
                  }}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
                  role="separator"
                  aria-orientation="vertical"
                />
              </th>
              <th
                scope="col"
                style={{ width: columnWidths.stock }}
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer relative border border-gray-200"
                onClick={() => handleSort("quantity")}
              >
                Stock Status
                <span
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, "stock");
                  }}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
                  role="separator"
                  aria-orientation="vertical"
                />
              </th>
              <th
                scope="col"
                style={{ width: columnWidths.actions }}
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-sm font-semibold text-gray-900 border border-gray-200"
              >
                <span className="sr-only">Actions</span>
                <span
                  onMouseDown={(e) => handleMouseDown(e, "actions")}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
                  role="separator"
                  aria-orientation="vertical"
                />
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
                    <div>Retail: ${formatPrice(product.retailPrice)}</div>
                    <div>Wholesale: ${formatPrice(product.wholesalePrice)}</div>
                    <div>Purchase: ${formatPrice(product.purchaseRate)}</div>
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
      {/* <ActiveTable
        isCellTextEditable={false}
        displayAddNewRow={false}
        displayAddNewColumn={false}
        columnDropdown={{
          displaySettings: {
            isAvailable: true,
            openMethod: { cellClick: true },
          },
          isSortAvailable: true,
          isDeleteAvailable: false,
          isInsertLeftAvailable: false,
          isInsertRightAvailable: false,
          isMoveAvailable: true,
        }}
        rowDropdown={{
          displaySettings: {
            isAvailable: true,
            openMethod: { cellClick: true },
          },
          isInsertUpAvailable: false,
          isInsertDownAvailable: false,
          isMoveAvailable: true,
          isDeleteAvailable: false,
          canEditHeaderRow: false,
        }}
        // columns={//doesn't support a fixed header}
        data={data}
        headerStyles={{ default: { backgroundColor: "#d6d6d630" } }}
      />
       */}
    </div>
  );
}
InventoryTable.propTypes = {
  onEdit: PropTypes.func,
  searchTerm: PropTypes.string,
};

export default InventoryTable;
