import React from "react";
import { formatPrice } from "../utils/priceFormatters";
import { calculateMaxDiscount } from "../utils/discountCalculator";

function DiscountSection({ item, discount, onDiscountChange }) {
  const maxDiscount = calculateMaxDiscount(item);
  const currentDiscount = discount || 0;

  const handleDiscountChange = (value) => {
    const newDiscount = parseFloat(value);
    if (isNaN(newDiscount) || newDiscount < 0) {
      onDiscountChange(0);
      return;
    }
    if (newDiscount > maxDiscount) {
      alert(`Maximum allowed discount is ${formatPrice(maxDiscount)}%`);
      onDiscountChange(maxDiscount);
      return;
    }
    onDiscountChange(newDiscount);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        value={currentDiscount}
        onChange={(e) => handleDiscountChange(e.target.value)}
        className="input w-20"
        min="0"
        max={maxDiscount}
        step="0.1"
      />
      <span className="text-sm text-gray-500">
        Max: {formatPrice(maxDiscount)}%
      </span>
    </div>
  );
}

export default DiscountSection;
