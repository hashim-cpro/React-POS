import React, { useState } from "react";
import { formatPrice } from "../utils/priceFormatters";

function PaymentSection({ total, onPaymentComplete }) {
  const [payments, setPayments] = useState([{ method: "cash", amount: total }]);
  const [currentAmount, setCurrentAmount] = useState("");

  const paymentMethods = [
    { id: "cash", label: "Cash" },
    { id: "card", label: "Credit/Debit Card" },
    { id: "mobile", label: "Mobile Payment" },
    { id: "bank", label: "Bank Transfer" },
  ];

  const remainingAmount =
    total - payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const handleAddPayment = () => {
    if (!currentAmount || parseFloat(currentAmount) <= 0) return;

    const newPayment = {
      method: document.getElementById("paymentMethod").value,
      amount: parseFloat(currentAmount),
    };

    if (
      payments.reduce((sum, p) => sum + parseFloat(p.amount), 0) +
        parseFloat(currentAmount) >
      total
    ) {
      alert("Total payments cannot exceed bill amount");
      return;
    }

    setPayments([...payments, newPayment]);
    setCurrentAmount("");
  };

  const handleComplete = () => {
    const totalPaid = payments.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    if (Math.abs(totalPaid - total) > 0.01) {
      alert("Please complete the full payment amount");
      return;
    }
    onPaymentComplete(payments);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Payment Details</h3>

      <div className="space-y-2">
        {payments.map((payment, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 p-2 rounded"
          >
            <span>
              {paymentMethods.find((m) => m.id === payment.method)?.label}
            </span>
            <span>${formatPrice(payment.amount)}</span>
          </div>
        ))}
      </div>

      {remainingAmount > 0 && (
        <div className="flex gap-2">
          <select id="paymentMethod" className="input flex-1">
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="Amount"
            className="input flex-1"
            step="0.01"
            min="0"
            max={remainingAmount}
          />
          <button onClick={handleAddPayment} className="btn btn-secondary">
            Add
          </button>
        </div>
      )}

      <div className="flex justify-between font-semibold">
        <span>Remaining:</span>
        <span>${formatPrice(remainingAmount)}</span>
      </div>

      <button
        onClick={handleComplete}
        disabled={remainingAmount > 0}
        className="btn btn-primary w-full"
      >
        Complete Payment
      </button>
    </div>
  );
}

export default PaymentSection;
