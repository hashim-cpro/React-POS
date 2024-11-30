import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ReceiptTemplate from "./ReceiptTemplate";

function ReceiptPreview({ sale, paymentMethod, onClose }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: 80mm 297mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  const handleSaveAsPDF = () => {
    const printOptions = {
      ...handlePrint,
      print: window.print,
    };
    printOptions();
  };

  if (!sale) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
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

          <h2 className="text-xl font-bold mb-4">Receipt Preview</h2>

          <div className="border rounded-lg p-4 mb-4 overflow-auto max-h-[60vh]">
            <ReceiptTemplate
              ref={componentRef}
              sale={sale}
              paymentMethod={paymentMethod}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button onClick={handleSaveAsPDF} className="btn btn-secondary">
              Save as PDF
            </button>
            <button onClick={handlePrint} className="btn btn-primary">
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPreview;
