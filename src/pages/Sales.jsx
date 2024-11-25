import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Barcode from "react-barcode";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import { updateProduct } from "../store/slices/inventorySlice";
import { addSale } from "../store/slices/salesSlice";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Receipt from "../components/Receipt";

function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const { products } = useSelector((state) => state.inventory);
  const { items: cartItems, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    if (product.quantity > 0) {
      dispatch(addItem(product));
      dispatch(
        updateProduct({
          ...product,
          quantity: product.quantity - 1,
        })
      );
    }
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeItem(item.id));
    const product = products.find((p) => p.id === item.id);
    if (product) {
      dispatch(
        updateProduct({
          ...product,
          quantity: product.quantity + item.quantity,
        })
      );
    }
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 0) return;

    const product = products.find((p) => p.id === item.id);
    if (!product) return;

    const quantityDiff = item.quantity - newQuantity;
    const newStockQuantity = product.quantity + quantityDiff;

    if (newStockQuantity < 0) {
      alert("Not enough stock available");
      return;
    }

    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    dispatch(
      updateProduct({
        ...product,
        quantity: newStockQuantity,
      })
    );
  };

  const handleClearCart = () => {
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        dispatch(
          updateProduct({
            ...product,
            quantity: product.quantity + item.quantity,
          })
        );
      }
    });
    dispatch(clearCart());
  };

  const handleCompleteSale = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      const sale = {
        id: Date.now().toString(),
        items: cartItems,
        total,
        date: new Date().toISOString(),
      };

      dispatch(addSale(sale));
      setCurrentSale(sale);
      dispatch(clearCart());
    } catch (error) {
      console.error("Error completing sale:", error);
      alert("Error completing sale. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            placeholder="Scan barcode or search product..."
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <div className="aspect-w-1 aspect-h-1 mb-4">
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description || "No description available"}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm ${
                      product.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Stock: {product.quantity}
                  </span>
                </div>
                <div className="mb-3">
                  <Barcode
                    value={product.sku}
                    width={1.5}
                    height={40}
                    fontSize={12}
                  />
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Current Cart</h2>
              {cartItems.length > 0 && (
                <button
                  className="btn btn-secondary text-sm"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              )}
            </div>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity - 1)
                        }
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        className="w-8 text-center"
                        onChange={(e) => {
                          handleUpdateQuantity(item, parseInt(e.target.value));
                        }}
                      />
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity + 1)
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      onClick={() => handleRemoveFromCart(item)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 && (
                <p className="text-gray-500 text-center py-4">Cart is empty</p>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-bold mb-4">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleCompleteSale}
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? "Processing..." : "Complete Sale"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentSale && (
        <Receipt sale={currentSale} onClose={() => setCurrentSale(null)} />
      )}
    </div>
  );
}

export default Sales;
