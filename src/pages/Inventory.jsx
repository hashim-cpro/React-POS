import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Bars4Icon, Squares2X2Icon } from "@heroicons/react/24/outline";
import ProductModal from "../components/ProductModal";
import InventoryTable from "../components/InventoryTable";
import InventoryCardView from "../components/InventoryCardView";

function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const { loading } = useSelector((state) => state.inventory);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
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

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
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
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : viewMode === "table" ? (
            <InventoryTable onEdit={handleEdit} searchTerm={searchTerm} />
          ) : (
            <InventoryCardView onEdit={handleEdit} searchTerm={searchTerm} />
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
    </div>
  );
}

export default Inventory;
