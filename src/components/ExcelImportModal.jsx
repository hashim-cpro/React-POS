import { useState } from "react";
import { read, utils, writeFile } from "xlsx-js-style";
import { useDispatch } from "react-redux";
import { addProduct } from "../store/slices/inventorySlice";

// eslint-disable-next-line react/prop-types
function ExcelImportModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [successCount, setSuccessCount] = useState(0);

  const validateRow = (row) => {
    const required = [
      "name",
      "description",
      "category",
      "quantity",
      "minStockLevel",
      "location",
      "sku",
      "purchase",
      "retailPrice",
      "wholesalePrice",
      "image",
    ];
    const missing = required.filter((field) => !row[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    if (isNaN(parseFloat(row.retailPrice)) || parseFloat(row.retailPrice) < 0) {
      throw new Error("Invalid price value");
    }

    if (isNaN(parseInt(row.quantity)) || parseInt(row.quantity) < 0) {
      throw new Error("Invalid quantity value");
    }

    return {
      ...row,
      purchaseRate: parseFloat(row.purchase),
      retailPrice: parseFloat(row.retailPrice),
      wholesalePrice: parseFloat(row.wholesalePrice),
      quantity: parseInt(row.quantity),
      minStockLevel: parseInt(row.minStockLevel) || 5,
    };
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = utils.sheet_to_json(worksheet);

      let successfulImports = 0;
      let errors = [];

      rows.forEach((row, index) => {
        try {
          const validatedProduct = validateRow(row);
          console.log(validatedProduct);
          dispatch(addProduct(validatedProduct));
          successfulImports++;
        } catch (err) {
          errors.push(`Row ${index + 2}: ${err.message}`);
          console.error(err);
        }
      });

      if (errors.length > 0) {
        setError(`Import completed with errors:\n${errors.join("\n")}`);
      }
      setSuccessCount(successfulImports);
    } catch (err) {
      setError("Failed to parse Excel file. Please check the format.\n", err);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Cats",
        description: "meow",
        category: "animals",
        quantity: "100",
        minStockLevel: "5",
        location: "basement",
        sku: "SKU123",
        purchase: "20",
        retailPrice: "59.99",
        wholesalePrice: "39.99",
        image: "https://example.com/image.jpg",
      },
    ];

    const ws = utils.json_to_sheet(template);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Template");

    // Style the header row
    const range = utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const address = utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } },
      };
    }

    writeFile(wb, "inventory_template.xlsx");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div className="relative bg-white rounded-lg p-8 max-w-lg w-full">
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

          <h2 className="text-xl font-bold mb-6">
            Import Inventory from Excel
          </h2>

          <div className="space-y-4">
            <div>
              <button
                onClick={downloadTemplate}
                className="btn btn-secondary w-full"
              >
                Download Template
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Use this template for the correct data format
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload your Excel file (.xlsx or .xls)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md whitespace-pre-line">
                {error}
              </div>
            )}

            {successCount > 0 && (
              <div className="bg-green-50 text-green-700 p-4 rounded-md">
                Successfully imported {successCount} products
              </div>
            )}

            <div className="flex justify-end">
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

export default ExcelImportModal;
