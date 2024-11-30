import Barcode from "react-barcode";
import { formatPrice } from "../utils/priceFormatters";

function ProductCard({ product, onAddToCart }) {
  const { name, description, image, price, quantity, sku } = product;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="aspect-w-1 aspect-h-1 mb-4">
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={name}
          className="object-cover rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600 text-sm mb-2">
        {description || "No description available"}
      </p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold">${formatPrice(price)}</span>
        <span
          className={`text-sm ${
            quantity > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          Stock: {quantity}
        </span>
      </div>
      <div className="mb-3">
        <Barcode value={sku} width={1.5} height={40} fontSize={12} />
      </div>
      <button
        className="btn btn-primary w-full"
        onClick={() => onAddToCart(product)}
        disabled={quantity === 0}
      >
        {quantity === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
