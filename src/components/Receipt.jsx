import { useState } from "react";
import ReceiptPreview from "./ReceiptPreview";

function Receipt({ sale, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  if (!sale) return null;

  return (
    <ReceiptPreview
      sale={sale}
      paymentMethod={paymentMethod}
      onClose={onClose}
    />
  );
}

export default Receipt;
