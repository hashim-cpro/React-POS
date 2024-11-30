import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { formatPrice, calculateItemTotal } from "../utils/priceFormatters";
import DiscountSection from "./DiscountSection";
import {
  calculateDiscountedPrice,
  calculateProfitMargin,
} from "../utils/discountCalculator";

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onDiscountChange,
  billType,
}) {
  const price =
    billType === "wholesale" && item.wholesalePrice
      ? item.wholesalePrice
      : item.retailPrice;
  const discountedPrice = calculateDiscountedPrice(price, item.discount);
  const profitMargin = calculateProfitMargin(
    discountedPrice,
    item.purchaseRate
  );

  return (
    <div className="p-3 border rounded">
      <div className="flex justify-between mb-2">
        <div className="flex-1">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-600">
            ${formatPrice(price)} x {item.quantity}
          </p>
          {item.discount > 0 && (
            <p className="text-sm text-green-600">
              Discount: {item.discount}% ($
              {formatPrice(price - discountedPrice)})
            </p>
          )}
          <p className="text-xs text-gray-500">
            Profit Margin: {formatPrice(profitMargin)}%
          </p>
        </div>
        <div className="flex items-start space-x-2">
          <div className="flex items-center space-x-1">
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => onUpdateQuantity(item, item.quantity - 1)}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={item.quantity}
              className="w-12 text-center input"
              onChange={(e) => onUpdateQuantity(item, parseInt(e.target.value))}
              min="1"
            />
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => onUpdateQuantity(item, item.quantity + 1)}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <button
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            onClick={() => onRemove(item)}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <DiscountSection
          item={item}
          discount={item.discount}
          onDiscountChange={(discount) => onDiscountChange(item.id, discount)}
        />
      </div>
    </div>
  );
}

export default CartItem;
