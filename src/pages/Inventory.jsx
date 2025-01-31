import { useState } from "react";
import { useSelector } from "react-redux";
import { utils, writeFile } from "xlsx-js-style";
import { Bars4Icon, Squares2X2Icon } from "@heroicons/react/24/outline";
import ProductModal from "../components/ProductModal";
import ExcelImportModal from "../components/ExcelImportModal";
import InventoryTable from "../components/InventoryTable";
import InventoryCardView from "../components/InventoryCardView";
import InventoryFilters from "../components/InventoryFilters";

function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [filters, setFilters] = useState({
    category: "",
    stockStatus: "all",
    minPrice: "",
    maxPrice: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "name",
    direction: "asc",
  });
  const { loading, products } = useSelector((state) => state.inventory);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filterProducts = (products) => {
    return products.filter((product) => {
      // Search term filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        !filters.category || product.category === filters.category;

      // Stock status filter
      let matchesStockStatus = true;
      if (filters.stockStatus !== "all") {
        const minStock = product.minStockLevel || 5;
        switch (filters.stockStatus) {
          case "inStock":
            matchesStockStatus = product.quantity > minStock;
            break;
          case "lowStock":
            matchesStockStatus =
              product.quantity > 0 && product.quantity <= minStock;
            break;
          case "outOfStock":
            matchesStockStatus = product.quantity === 0;
            break;
        }
      }

      // Price range filter
      const matchesPrice =
        (!filters.minPrice ||
          product.retailPrice >= Number(filters.minPrice)) &&
        (!filters.maxPrice || product.retailPrice <= Number(filters.maxPrice));

      return (
        matchesSearch && matchesCategory && matchesStockStatus && matchesPrice
      );
    });
  };

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "retailPrice":
          comparison = a.retailPrice - b.retailPrice;
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  };

  const filteredAndSortedProducts = sortProducts(filterProducts(products));

  const exportToExcel = () => {
    const data = products.map((product) => ({
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      minStockLevel: product.minStockLevel,
      location: product.location,
      sku: product.sku,
      Purchase: product.purchaseRate,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      image: product.image,
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Inventory");

    // Style header row
    const range = utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const address = utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } },
      };
    }

    writeFile(wb, "inventory_export.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setIsImportModalOpen(true)}
          >
            Import Excel
          </button>
          <button className="btn btn-secondary" onClick={exportToExcel}>
            Export Excel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search products..."
                className="input flex-grow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className={`btn ${
                    viewMode === "table" ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setViewMode("table")}
                  title="Table view"
                >
                  <Bars4Icon className="h-5 w-5" />
                </button>
                <button
                  className={`btn ${
                    viewMode === "card" ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setViewMode("card")}
                  title="Card view"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <InventoryFilters
              onFilterChange={setFilters}
              onSortChange={setSortConfig}
            />
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : viewMode === "table" ? (
            <InventoryTable
              onEdit={handleEdit}
              searchTerm={searchTerm}
              products={filteredAndSortedProducts}
            />
          ) : (
            <InventoryCardView
              onEdit={handleEdit}
              searchTerm={searchTerm}
              products={filteredAndSortedProducts}
            />
          )}
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}

export default Inventory;
