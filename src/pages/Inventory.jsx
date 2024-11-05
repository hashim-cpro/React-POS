import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductModal from '../components/ProductModal';
import InventoryTable from '../components/InventoryTable';

function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
          <input
            type="text"
            placeholder="Search products..."
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : (
            <InventoryTable 
              onEdit={handleEdit}
              searchTerm={searchTerm}
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
    </div>
  );
}

export default Inventory;