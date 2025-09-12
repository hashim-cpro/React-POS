import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  updateDiscount,
} from "../store/slices/cartSlice";
import { updateProduct } from "../store/slices/inventorySlice";
import { addSale } from "../store/slices/salesSlice";
import Receipt from "../components/Receipt";
import ProductCard from "../components/ProductCard";
import CartItem from "../components/CartItem";
import BillTypeSelector from "../components/BillTypeSelector";
import PaymentSection from "../components/PaymentSection";
import { formatPrice } from "../utils/priceFormatters";
import { calculateDiscountedPrice } from "../utils/discountCalculator";

function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [billType, setBillType] = useState("retail");
  const [showPayment, setShowPayment] = useState(false);
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
      const price =
        billType === "wholesale" && product.wholesalePrice
          ? product.wholesalePrice
          : product.retailPrice;

      dispatch(
        addItem({
          ...product,
          price,
          discount: 0,
        })
      );

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

  const handleDiscountChange = (itemId, discount) => {
    dispatch(updateDiscount({ id: itemId, discount }));
  };

  const handleBillTypeChange = (newBillType) => {
    setBillType(newBillType);
    // Update prices in cart based on new bill type
    cartItems.forEach((item) => {
      const price =
        newBillType === "wholesale" && item.wholesalePrice
          ? item.wholesalePrice
          : item.retailPrice;
      dispatch(updateQuantity({ id: item.id, price }));
    });
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
    setShowPayment(false);
  };

  const handlePaymentComplete = (payments) => {
    const sale = {
      id: Date.now().toString(),
      items: cartItems.map((item) => ({
        ...item,
        finalPrice: calculateDiscountedPrice(item.price, item.discount),
      })),
      total,
      payments,
      billType,
      date: new Date().toISOString(),
    };

    dispatch(addSale(sale));
    setCurrentSale(sale);
    dispatch(clearCart());
    setShowPayment(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const discountedPrice = calculateDiscountedPrice(
        item.price,
        item.discount
      );
      return sum + discountedPrice * item.quantity;
    }, 0);
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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                billType={billType}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-bg-secondary rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                Current Cart
              </h2>
              {cartItems.length > 0 && (
                <button
                  className="btn btn-secondary text-sm"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              )}
            </div>

            <BillTypeSelector
              billType={billType}
              onBillTypeChange={handleBillTypeChange}
            />

            <div className="space-y-3">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  billType={billType}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveFromCart}
                  onDiscountChange={handleDiscountChange}
                />
              ))}

              {cartItems.length === 0 && (
                <p className="text-gray-500 text-center py-4">Cart is empty</p>
              )}

              {cartItems.length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-bold mb-4">
                    <p>Total</p>
                    <p>${formatPrice(calculateTotal())}</p>
                  </div>

                  {showPayment ? (
                    <PaymentSection
                      total={calculateTotal()}
                      onPaymentComplete={handlePaymentComplete}
                    />
                  ) : (
                    <button
                      className="btn btn-primary w-full"
                      onClick={() => setShowPayment(true)}
                      disabled={isProcessing || cartItems.length === 0}
                    >
                      Proceed to Payment
                    </button>
                  )}
                </div>
              )}
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
