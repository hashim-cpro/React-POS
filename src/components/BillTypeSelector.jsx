import React from "react";

function BillTypeSelector({ billType, onBillTypeChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bill Type
      </label>
      <select
        value={billType}
        onChange={(e) => onBillTypeChange(e.target.value)}
        className="input"
      >
        <option value="retail">Retail</option>
        <option value="wholesale">Wholesale</option>
      </select>
    </div>
  );
}

export default BillTypeSelector;
