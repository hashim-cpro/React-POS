import React from "react";
import Barcode from "react-barcode";
import { format } from "date-fns";
import { STORE_INFO } from "../utils/constants";

const ReceiptTemplate = React.forwardRef(({ sale, paymentMethod }, ref) => {
  return (
    <div
      ref={ref}
      className="p-4 max-w-[80mm] mx-auto bg-white text-black text-sm"
    >
      {/* Store Information */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{STORE_INFO.name}</h1>
        <p>{STORE_INFO.address}</p>
        <p>Tel: {STORE_INFO.phone}</p>
        <p>{STORE_INFO.email}</p>
      </div>

      {/* Receipt Details */}
      <div className="mb-4">
        <p>Date: {format(new Date(sale.date), "MMM dd, yyyy HH:mm:ss")}</p>
        <p>Receipt #: {sale.id}</p>
        <div className="my-2">
          <Barcode value={sale.id} width={1} height={30} fontSize={8} />
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4">
        <thead>
          <tr className="border-t border-b border-black">
            <th className="text-left py-1">Item</th>
            <th className="text-right py-1">Qty</th>
            <th className="text-right py-1">Price</th>
            <th className="text-right py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item) => (
            <tr key={item.id}>
              <td className="text-left py-1">{item.name}</td>
              <td className="text-right py-1">{item.quantity}</td>
              <td className="text-right py-1">${item.price.toFixed(2)}</td>
              <td className="text-right py-1">
                ${(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t border-black pt-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${sale.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${sale.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>Payment Method:</span>
          <span>{paymentMethod}</span>
        </div>
      </div>

      {/* Return Policy */}
      <div className="text-center text-xs mb-4">
        <p className="font-bold mb-1">Return Policy</p>
        <p>{STORE_INFO.returnPolicy}</p>
      </div>

      {/* Thank You Message */}
      <div className="text-center border-t border-black pt-2">
        <p className="font-bold">Thank you for your purchase!</p>
        <p className="text-xs">{STORE_INFO.website}</p>
      </div>
    </div>
  );
});

ReceiptTemplate.displayName = "ReceiptTemplate";

export default ReceiptTemplate;
