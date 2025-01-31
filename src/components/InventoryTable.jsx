import PropTypes from "prop-types";
import {
  Table,
  HeaderRow,
  Row,
  Header,
  Body,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";

import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "../utils/priceFormatters";

function InventoryTable({ onEdit = () => {}, products }) {
  const data = { nodes: products };

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 30% 15% 10% 5% 10% 10% 10% 10%;

    `,
    HeaderRow: `
      background-color: #f9fafb;
      font-weight: bold;
      
    `,
    HeaderCell: `
      border-right: 2px solid #d1d5db;
      padding: 0.75rem;
    `,
    Row: `
      &:hover {
        background-color: #f3f4f6;
        cursor: pointer;
      }
    `,
    Cell: `
      padding: 0.75rem;
          border-bottom: 2px solid #d1d5db;

    `,
  });
  const resize = {
    resizerHighlight: "#d1d5db",
  };
  const sort = useSort(
    data,
    {
      onChange: () => {},
    },

    {
      sortIcon: {
        margin: "0px",
        iconDefault: <ArrowsUpDownIcon className="h-4 w-4" />,
        iconUp: <p>↑</p>,
        iconDown: <p>↓</p>,
      },
      sortFns: {
        NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        CATEGORY: (array) =>
          array.sort((a, b) => a.category.localeCompare(b.category)),
        SKU: (array) => {
          return array.sort((a, b) => {
            const regex = /^([A-Za-z]+)(\d+)$/;
            const matchA = a.sku.match(regex);
            const matchB = b.sku.match(regex);

            if (matchA && matchB) {
              const prefixA = matchA[1];
              const prefixB = matchB[1];
              const numA = parseInt(matchA[2], 10);
              const numB = parseInt(matchB[2], 10);

              return prefixA === prefixB
                ? numA - numB
                : prefixA.localeCompare(prefixB);
            }
            return a.sku.localeCompare(b.sku);
          });
        },
        QUANTITY: (array) => array.sort((a, b) => a.quantity - b.quantity),
        LOCATION: (array) =>
          array.sort((a, b) =>
            (a.location || "").localeCompare(b.location || "")
          ),
        PURCHASE: (array) =>
          array.sort((a, b) => a.purchaseRate - b.purchaseRate),
        WHOLESALE: (array) =>
          array.sort((a, b) => a.wholesalePrice - b.wholesalePrice),
        RETAIL: (array) => array.sort((a, b) => a.retailPrice - b.retailPrice),
      },
    }
  );

  return (
    <div
      className="overflow-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg"
      style={{ height: "700px" }}
    >
      <Table
        data={data}
        theme={theme}
        layout={{
          custom: true,
          horizontalScroll: true,
          fixedHeader: false,
        }}
        sort={sort}
      >
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSort resize={resize} sortKey="NAME">
                  Name
                </HeaderCellSort>
                <HeaderCellSort resize={resize} sortKey="CATEGORY">
                  Category
                </HeaderCellSort>
                <HeaderCellSort resize={resize} sortKey="SKU">
                  SKU
                </HeaderCellSort>
                <HeaderCellSort resize={resize} sortKey="QUANTITY">
                  Stock
                </HeaderCellSort>
                <HeaderCellSort resize={resize} sortKey="LOCATION">
                  Location
                </HeaderCellSort>
                <HeaderCellSort resize={resize} sortKey="PURCHASE">
                  Purchase Price
                </HeaderCellSort>
                <HeaderCellSort resize={resize} sortKey="WHOLESALE">
                  Wholesale Price
                </HeaderCellSort>
                <HeaderCellSort sortKey="RETAIL">Retail Price</HeaderCellSort>
              </HeaderRow>
            </Header>

            <Body>
              <>
                {(tableList.length === 0 ||
                  tableList === undefined ||
                  tableList === null) && (
                  <Row>
                    <Cell colSpan={8}>
                      <span className="text-center py-4 text-gray-500">
                        No products found
                      </span>
                    </Cell>
                  </Row>
                )}
                {tableList.map((product) => (
                  <Row
                    key={product.id}
                    item={product}
                    onClick={() => onEdit(product)}
                  >
                    <Cell>
                      <span className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-sm object-cover mr-2"
                          src={product.image || placeholderImg}
                          alt={product.name}
                        />
                        <span>
                          <span className="font-medium">{product.name}</span>
                          {/* <span className="text-gray-500 text-sm">
                            {product.description}
                          </span> */}
                        </span>
                      </span>
                    </Cell>
                    <Cell>{product.category}</Cell>
                    <Cell>{product.sku}</Cell>
                    <Cell>
                      <span
                        className={`${
                          product.quantity <= (product.minStockLevel || 5)
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </Cell>
                    <Cell>{product.location}</Cell>
                    <Cell>${formatPrice(product.purchaseRate)}</Cell>
                    <Cell>${formatPrice(product.wholesalePrice)}</Cell>
                    <Cell>${formatPrice(product.retailPrice)}</Cell>
                  </Row>
                ))}
              </>
            </Body>
          </>
        )}
      </Table>
    </div>
  );
}

InventoryTable.propTypes = {
  onEdit: PropTypes.func,
  products: PropTypes.array.isRequired,
};

export default InventoryTable;
