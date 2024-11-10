import { format } from "date-fns";

function Receipt({ sale, onClose }) {
  if (!sale) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="receipt-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">Sale Receipt</h2>
            <p className="text-gray-500 text-sm">
              {format(new Date(sale.date), "MMM dd, yyyy HH:mm:ss")}
            </p>
            <p className="text-gray-500 text-sm">Receipt #{sale.id}</p>
          </div>

          <div className="space-y-4">
            <div className="border-t border-b py-4">
              {sale.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-b pb-4">
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${sale.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Thank you for your purchase!</p>
              <p>Please keep this receipt for your records.</p>
            </div>

            <div className="mt-6 flex justify-center">
              <button onClick={onClose} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
