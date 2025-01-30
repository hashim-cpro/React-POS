// import { useState } from "react";
// import PropTypes from "prop-types";
// import { useSelector } from "react-redux";
// // import { ActiveTable } from "active-table-react";
// import placeholderImg from "../assets/placeholder-img.svg";

// function InventoryTable({ onEdit = () => {}, searchTerm = "" }) {
//   const { products } = useSelector((state) => state.inventory);
//   const [sortField, setSortField] = useState("name");
//   const [sortDirection, setSortDirection] = useState("asc");
//   // const data = [
//   //   [{ header: "Name", type: "Text", editable: false }],
//   //   ["Earth", 12756, "E123", 100, "Warehouse A", 5000, 5500, 6000],
//   //   ["Mars", 6792, "M456", 50, "Warehouse B", 3000, 3300, 3600],
//   //   // Additional rows...
//   // ];
//   // eslint-disable-next-line no-unused-vars
//   const [columnWidths, setColumnWidths] = useState({
//     name: "30%",
//     category: "5%",
//     sku: "10%",
//     stock: "15%",
//     location: "7%",
//     purchase: "10%",
//     Retailprice: "10%",
//     WholeSalePrice: "10%",
//     actions: "3%",
//   });
//   // const handleMouseDown = (e, colKey) => {
//   //   e.preventDefault();
//   //   const startX = e.clientX;
//   //   // const startWidth = columnWidths[colKey];
//   //   const startWidth = parseFloat(columnWidths[colKey]); // Convert "30%" to 30

//   //   // const onMouseMove = (moveEvent) => {
//   //   //   const newWidth = startWidth + moveEvent.clientX - startX;
//   //   //   setColumnWidths((prev) => ({
//   //   //     ...prev,
//   //   //     [colKey]: Math.max(newWidth, 80),
//   //   //   }));
//   //   // };
//   //   const onMouseMove = (moveEvent) => {
//   //     const totalTableWidth = document.querySelector("table").offsetWidth;
//   //     const newWidth =
//   //       ((startWidth + moveEvent.clientX - startX) / totalTableWidth) * 100;
//   //     setColumnWidths((prev) => ({
//   //       ...prev,
//   //       [colKey]: `${Math.max(newWidth, 3)}%`, // Minimum width of 10%
//   //     }));
//   //   };
//   //   const onMouseUp = () => {
//   //     document.removeEventListener("mousemove", onMouseMove);
//   //     document.removeEventListener("mouseup", onMouseUp);
//   //   };

//   //   document.addEventListener("mousemove", onMouseMove);
//   //   document.addEventListener("mouseup", onMouseUp);
//   // };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
//       product.sku.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
//       product.category.toLowerCase().includes(searchTerm?.toLowerCase() || "")
//   );

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     let valA = a[sortField];
//     let valB = b[sortField];

//     const cleanedValA = String(valA).replace(/[^0-9.-]+/g, "");
//     const cleanedValB = String(valB).replace(/[^0-9.-]+/g, "");

//     const numA = parseFloat(cleanedValA);
//     const numB = parseFloat(cleanedValB);

//     if (!isNaN(numA) && !isNaN(numB)) {
//       // Numeric comparison
//       valA = numA;
//       valB = numB;
//     } else {
//       // String comparison
//       valA = String(valA).toLowerCase();
//       valB = String(valB).toLowerCase();
//     }

//     if (sortField === "sku") {
//       const regex = /^([A-Za-z]+)(\d+)$/;
//       const matchA = a.sku.match(regex);
//       const matchB = b.sku.match(regex);

//       if (matchA && matchB) {
//         const prefixA = matchA[1];
//         const numA = parseInt(matchA[2], 10);
//         const prefixB = matchB[1];
//         const numB = parseInt(matchB[2], 10);

//         if (prefixA !== prefixB) {
//           return sortDirection === "asc"
//             ? prefixA.localeCompare(prefixB)
//             : prefixB.localeCompare(prefixA);
//         }
//         return sortDirection === "asc" ? numA - numB : numB - numA;
//       }
//     }

//     if (valA < valB) return sortDirection === "asc" ? -1 : 1;
//     if (valA > valB) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   });
//   //I have no idea how this sort works
//   const handleSort = (field) => {
//     setSortDirection(
//       sortField === field && sortDirection === "asc" ? "desc" : "asc"
//     );
//     setSortField(field);
//   };

//   const getStockStatus = (product) => {
//     const { quantity, minStockLevel = 5 } = product;
//     if (quantity <= 0) return { color: "red", text: "Out of Stock" };
//     if (quantity <= minStockLevel)
//       return { color: "yellow", text: "Low Stock" };
//     return { color: "green", text: "In Stock" };
//   };

//   const formatPrice = (price) => {
//     return typeof price === "number" ? price.toFixed(2) : "0.00";
//   };

//   return (
//     <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
//       <div
//         className="overflow-x-auto w-full"
//         role="region"
//         aria-label="Inventory table"
//       >
//         <table className="min-w-full table-fixed border-collapse">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 style={{ width: columnWidths.name }}
//                 className="py-3.5 pl-4 pr-2 text-left text-sm font-semibold text-gray-900 relative border border-gray-200"
//                 onClick={() => handleSort("name")}
//               >
//                 Name
//                 {/* <span
//                   onMouseDown={(e) => handleMouseDown(e, "name")}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>

//               <th
//                 scope="col"
//                 style={{ width: columnWidths.category }}
//                 className="py-3.5 pl-4 pr-2 text-left text-sm font-semibold text-gray-900 relative border border-gray-200"
//                 onClick={() => handleSort("category")}
//               >
//                 Category
//                 {/* <span
//                   onMouseDown={(e) => handleMouseDown(e, "category")}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>
//               <th
//                 scope="col"
//                 style={{ width: columnWidths.sku }}
//                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hidden md:table-cell relative border border-gray-200"
//                 onClick={() => handleSort("sku")}
//               >
//                 SKU
//                 {/* <span
//                   onMouseDown={(e) => {
//                     e.stopPropagation();
//                     handleMouseDown(e, "sku");
//                   }}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>
//               <th
//                 scope="col"
//                 style={{ width: columnWidths.stock }}
//                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer relative border border-gray-200"
//                 onClick={() => handleSort("quantity")}
//               >
//                 Stock
//                 {/* <span
//                   onMouseDown={(e) => {
//                     e.stopPropagation();
//                     handleMouseDown(e, "stock");
//                   }}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>
//               <th
//                 scope="col"
//                 style={{ width: columnWidths.location }}
//                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer relative border border-gray-200"
//                 onClick={() => handleSort("location")}
//               >
//                 location
//                 {/* <span
//                   onMouseDown={(e) => {
//                     e.stopPropagation();
//                     handleMouseDown(e, "location");
//                   }}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>

//               <th
//                 scope="col"
//                 style={{ width: columnWidths.purchase }}
//                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer relative border border-gray-200"
//                 onClick={() => handleSort("purchaseRate")}
//               >
//                 purchase
//                 {/* <span
//                   onMouseDown={(e) => {
//                     e.stopPropagation();
//                     handleMouseDown(e, "purchase");
//                   }}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>

//               <th
//                 scope="col"
//                 style={{ width: columnWidths.WholeSalePrice }}
//                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer relative border border-gray-200"
//                 onClick={() => handleSort("wholesalePrice")}
//               >
//                 WholeSalePrice
//                 {/* <span
//                   onMouseDown={(e) => {
//                     e.stopPropagation();
//                     handleMouseDown(e, "WholeSalePrice");
//                   }}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>
//               <th
//                 scope="col"
//                 style={{ width: columnWidths.Retailprice }}
//                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer relative border border-gray-200"
//                 onClick={() => handleSort("retailPrice")}
//               >
//                 Retailprice
//                 {/* <span
//                   onMouseDown={(e) => {
//                     e.stopPropagation();
//                     handleMouseDown(e, "Retailprice");
//                   }}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>
//               <th
//                 scope="col"
//                 style={{ width: columnWidths.actions }}
//                 className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-sm font-semibold text-gray-900 border border-gray-200"
//               >
//                 <span className="sr-only">Actions</span>
//                 {/* <span
//                   onMouseDown={(e) => handleMouseDown(e, "actions")}
//                   className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
//                   role="separator"
//                   aria-orientation="vertical"
//                 /> */}
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {sortedProducts.map((product) => {
//               const stockStatus = getStockStatus(product);
//               return (
//                 <tr key={product.id} className="hover:bg-gray-50">
//                   <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm overflow-hidden">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0 flex items-center flex-row">
//                         <img
//                           className="h-10 w-10 rounded-sm aspect-square object-cover"
//                           src={product.image || placeholderImg}
//                           alt=""
//                         />
//                         {product.name}
//                         <br />
//                         {product.description}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 overflow-hidden">
//                     <div className="text-gray-500">{product.category}</div>
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
//                     {product.sku}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-4 text-sm">
//                     <span
//                       className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
//                         stockStatus.color === "green"
//                           ? "bg-green-100 text-green-800"
//                           : stockStatus.color === "yellow"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {product.quantity}
//                     </span>
//                     {product.quantity <= product.minStockLevel && (
//                       <p className="text-xs text-yellow-600 mt-1">
//                         Min: {product.minStockLevel}
//                       </p>
//                     )}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
//                     {product.location}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                     {formatPrice(product.purchaseRate)}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
//                     {formatPrice(product.wholesalePrice)}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
//                     {formatPrice(product.retailPrice)}
//                   </td>
//                   <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
//                     <button
//                       onClick={() => onEdit(product)}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       ^^
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//             {sortedProducts.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="px-6 py-4 text-center text-sm text-gray-500"
//                 >
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* <ActiveTable
//         isCellTextEditable={false}
//         displayAddNewRow={false}
//         displayAddNewColumn={false}
//         columnDropdown={{
//           displaySettings: {
//             isAvailable: true,
//             openMethod: { cellClick: true },
//           },
//           isSortAvailable: true,
//           isDeleteAvailable: false,
//           isInsertLeftAvailable: false,
//           isInsertRightAvailable: false,
//           isMoveAvailable: true,
//         }}
//         rowDropdown={{
//           displaySettings: {
//             isAvailable: true,
//             openMethod: { cellClick: true },
//           },
//           isInsertUpAvailable: false,
//           isInsertDownAvailable: false,
//           isMoveAvailable: true,
//           isDeleteAvailable: false,
//           canEditHeaderRow: false,
//         }}
//         // columns={//doesn't support a fixed header}
//         data={data}
//         headerStyles={{ default: { backgroundColor: "#d6d6d630" } }}
//       />
//        */}
//     </div>
//   );
// }
// InventoryTable.propTypes = {
//   onEdit: PropTypes.func,
//   searchTerm: PropTypes.string,
// };

// export default InventoryTable;

//===============DeepSeeK=============================

// import { useState, useMemo } from "react";
// import PropTypes from "prop-types";
// import { useSelector } from "react-redux";
// import {
//   Table,
//   Header,
//   HeaderRow,
//   HeaderCell,
//   Body,
//   Row,
//   Cell,
//   useSort,
// } from "@table-library/react-table-library/table";
// import { getTheme } from "@table-library/react-table-library/baseline";

// import placeholderImg from "../assets/placeholder-img.svg";

// function InventoryTable({ onEdit = () => {}, searchTerm = "" }) {
//   const { products } = useSelector((state) => state.inventory);
//   const [sort, setSort] = useState({ sortKey: "NAME", reverse: false });

//   const filteredProducts = useMemo(
//     () =>
//       products.filter(
//         (product) =>
//           product.name
//             .toLowerCase()
//             .includes(searchTerm?.toLowerCase() || "") ||
//           product.sku.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
//           product.category
//             .toLowerCase()
//             .includes(searchTerm?.toLowerCase() || "")
//       ),
//     [products, searchTerm]
//   );

//   const getStockStatus = (product) => {
//     const { quantity, minStockLevel = 5 } = product;
//     if (quantity <= 0) return { color: "red", text: "Out of Stock" };
//     if (quantity <= minStockLevel)
//       return { color: "yellow", text: "Low Stock" };
//     return { color: "green", text: "In Stock" };
//   };

//   const formatPrice = (price) => {
//     return typeof price === "number" ? price.toFixed(2) : "0.00";
//   };

//   const sortComparator = (a, b) => {
//     const reverse = sort.reverse ? -1 : 1;

//     switch (sort.sortKey) {
//       case "NAME":
//         return reverse * a.name.localeCompare(b.name);
//       case "CATEGORY":
//         return reverse * a.category.localeCompare(b.category);
//       case "SKU": {
//         const regex = /^([A-Za-z]+)(\d+)$/;
//         const matchA = a.sku.match(regex);
//         const matchB = b.sku.match(regex);

//         if (matchA && matchB) {
//           const prefixCompare = matchA[1].localeCompare(matchB[1]);
//           if (prefixCompare !== 0) return reverse * prefixCompare;
//           return reverse * (parseInt(matchA[2]) - parseInt(matchB[2]));
//         }
//         return reverse * a.sku.localeCompare(b.sku);
//       }
//       case "QUANTITY":
//         return reverse * (a.quantity - b.quantity);
//       case "LOCATION":
//         return reverse * a.location.localeCompare(b.location);
//       case "PURCHASE_RATE":
//         return reverse * (a.purchaseRate - b.purchaseRate);
//       case "WHOLESALE":
//         return reverse * (a.wholesalePrice - b.wholesalePrice);
//       case "RETAIL":
//         return reverse * (a.retailPrice - b.retailPrice);
//       default:
//         return 0;
//     }
//   };

//   const tableData = {
//     nodes: filteredProducts.sort(sortComparator),
//   };

//   const resize = useResizeLayout(tableData, {
//     onChange: () => {},
//   });

//   const tableSort = useSort(
//     tableData,
//     {
//       onChange: (action, state) => {
//         setSort({ sortKey: state.sortKey, reverse: !state.reverse });
//       },
//     },
//     {
//       sortFns: {
//         NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
//         CATEGORY: (array) =>
//           array.sort((a, b) => a.category.localeCompare(b.category)),
//         SKU: (array) => array,
//         QUANTITY: (array) => array.sort((a, b) => a.quantity - b.quantity),
//         LOCATION: (array) =>
//           array.sort((a, b) => a.location.localeCompare(b.location)),
//         PURCHASE_RATE: (array) =>
//           array.sort((a, b) => a.purchaseRate - b.purchaseRate),
//         WHOLESALE: (array) =>
//           array.sort((a, b) => a.wholesalePrice - b.wholesalePrice),
//         RETAIL: (array) => array.sort((a, b) => a.retailPrice - b.retailPrice),
//       },
//     }
//   );

//   const theme = getTheme({
//     Table: `
//       --data-table-library_grid-template-columns: 30% 5% 10% 15% 7% 10% 10% 10% 3%;
//     `,
//     BaseCell: `
//       padding: 8px 16px;
//       border: 1px solid #e5e7eb;
//     `,
//     HeaderCell: `
//       background-color: #f9fafb;
//       font-weight: 600;
//       &:hover {
//         background-color: #f3f4f6;
//       }
//     `,
//     Row: `
//       &:hover {
//         background-color: #f9fafb;
//       }
//     `,
//   });

//   return (
//     <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
//       <Table
//         data={tableData}
//         theme={theme}
//         sort={tableSort}
//         layout={{ custom: true, horizontalScroll: true }}
//         resize={resize}
//       >
//         {(tableList) => (
//           <>
//             <Header>
//               <HeaderRow>
//                 <HeaderCell
//                   resize={resize}
//                   sort={{ sortKey: "NAME" }}
//                   className="py-3.5"
//                 >
//                   Name
//                 </HeaderCell>
//                 <HeaderCell
//                   resize={resize}
//                   sort={{ sortKey: "CATEGORY" }}
//                   className="py-3.5"
//                 >
//                   Category
//                 </HeaderCell>
//                 <HeaderCell
//                   resize={resize}
//                   sort={{ sortKey: "SKU" }}
//                   className="hidden md:table-cell"
//                 >
//                   SKU
//                 </HeaderCell>
//                 <HeaderCell resize={resize} sort={{ sortKey: "QUANTITY" }}>
//                   Stock
//                 </HeaderCell>
//                 <HeaderCell resize={resize} sort={{ sortKey: "LOCATION" }}>
//                   Location
//                 </HeaderCell>
//                 <HeaderCell resize={resize} sort={{ sortKey: "PURCHASE_RATE" }}>
//                   Purchase
//                 </HeaderCell>
//                 <HeaderCell resize={resize} sort={{ sortKey: "WHOLESALE" }}>
//                   Wholesale
//                 </HeaderCell>
//                 <HeaderCell resize={resize} sort={{ sortKey: "RETAIL" }}>
//                   Retail
//                 </HeaderCell>
//                 <HeaderCell resize={resize}>Actions</HeaderCell>
//               </HeaderRow>
//             </Header>

//             <Body>
//               {tableList.map((product) => {
//                 const stockStatus = getStockStatus(product);
//                 return (
//                   <Row key={product.id} item={product}>
//                     <Cell className="py-4">
//                       <div className="flex items-center">
//                         <img
//                           className="h-10 w-10 rounded-sm object-cover mr-2"
//                           src={product.image || placeholderImg}
//                           alt={product.name}
//                         />
//                         <div>
//                           <div className="font-medium">{product.name}</div>
//                           <div className="text-gray-500 text-sm">
//                             {product.description}
//                           </div>
//                         </div>
//                       </div>
//                     </Cell>
//                     <Cell className="text-gray-500">{product.category}</Cell>
//                     <Cell className="hidden md:table-cell">{product.sku}</Cell>
//                     <Cell>
//                       <span
//                         className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
//                           stockStatus.color === "green"
//                             ? "bg-green-100 text-green-800"
//                             : stockStatus.color === "yellow"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {product.quantity}
//                       </span>
//                       {product.quantity <= product.minStockLevel && (
//                         <p className="text-xs text-yellow-600 mt-1">
//                           Min: {product.minStockLevel}
//                         </p>
//                       )}
//                     </Cell>
//                     <Cell className="text-gray-500">{product.location}</Cell>
//                     <Cell>${formatPrice(product.purchaseRate)}</Cell>
//                     <Cell>${formatPrice(product.wholesalePrice)}</Cell>
//                     <Cell>${formatPrice(product.retailPrice)}</Cell>
//                     <Cell>
//                       <button
//                         onClick={() => onEdit(product)}
//                         className="text-indigo-600 hover:text-indigo-900"
//                       >
//                         ^^
//                       </button>
//                     </Cell>
//                   </Row>
//                 );
//               })}
//             </Body>
//           </>
//         )}
//       </Table>

//       {filteredProducts.length === 0 && (
//         <div className="px-6 py-4 text-center text-sm text-gray-500">
//           No products found
//         </div>
//       )}
//     </div>
//   );
// }

// InventoryTable.propTypes = {
//   onEdit: PropTypes.func,
//   searchTerm: PropTypes.string,
// };

// export default InventoryTable;

//===============ChatGPT=============================
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import placeholderImg from "../assets/placeholder-img.svg";

function InventoryTable({ onEdit = () => {}, searchTerm = "" }) {
  const { products } = useSelector((state) => state.inventory);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const data = { nodes: filteredProducts };

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 30% 15% 10% 5% 10% 10% 10% 10%;
    `,
  });

  const sort = useSort(
    data,
    {
      onChange: onEdit,
    },
    {
      sortFns: {
        NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        category: (array) =>
          array.sort((a, b) => a.category.localeCompare(b.category)),
        sku: (array) => array.sort((a, b) => a.sku.localeCompare(b.sku)),
        quantity: (array) => array.sort((a, b) => a.quantity - b.quantity),
        location: (array) =>
          array.sort((a, b) => a.location.localeCompare(b.location)),
        purchaseRate: (array) =>
          array.sort((a, b) => a.purchaseRate - b.purchaseRate),
        wholesalePrice: (array) =>
          array.sort((a, b) => a.wholesalePrice - b.wholesalePrice),
        retailPrice: (array) =>
          array.sort((a, b) => a.retailPrice - b.retailPrice),
      },
    }
  );

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <Table
        data={data}
        theme={theme}
        layout={{ custom: true, horizontalScroll: false }}
        sort={sort}
      >
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell resize sortKey="NAME">
                  Name
                </HeaderCell>
                <HeaderCell resize sortKey="category">
                  Category
                </HeaderCell>
                <HeaderCell resize sortKey="sku">
                  SKU
                </HeaderCell>
                <HeaderCell resize sortKey="quantity">
                  Stock
                </HeaderCell>
                <HeaderCell resize sortKey="location">
                  Location
                </HeaderCell>
                <HeaderCell resize sortKey="purchaseRate">
                  Purchase Price
                </HeaderCell>
                <HeaderCell resize sortKey="wholesalePrice">
                  Wholesale Price
                </HeaderCell>
                <HeaderCell resize sortKey="retailPrice">
                  Retail Price
                </HeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((product) => (
                <Row key={product.id} item={product}>
                  <Cell>
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-sm object-cover mr-2"
                        src={product.image || placeholderImg}
                        alt={product.name}
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-gray-500 text-sm">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </Cell>
                  <Cell>{product.category}</Cell>
                  <Cell>{product.sku}</Cell>
                  <Cell>{product.quantity}</Cell>
                  <Cell>{product.location}</Cell>
                  <Cell>{product.purchaseRate}</Cell>
                  <Cell>{product.wholesalePrice}</Cell>
                  <Cell>{product.retailPrice}</Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
}

InventoryTable.propTypes = {
  onEdit: PropTypes.func,
  searchTerm: PropTypes.string,
};

export default InventoryTable;
