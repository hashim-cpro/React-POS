import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  CurrencyDollarIcon,
  CubeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

function Dashboard() {
  const { products } = useSelector((state) => state.inventory);
  const { todayTotal } = useSelector((state) => state.sales);
  const { sales } = useSelector((state) => state.sales);
  // const { purchases } = useSelector((state) => state.purchases);

  const lowStockItems = products.filter(
    (p) => p.quantity <= (p.minStockLevel || 5)
  ).length;
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

  const lowStockProducts = products
    .filter((p) => p.quantity <= (p.minStockLevel || 5))
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's Sales"
          value={`$${todayTotal.toFixed(2)}`}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
        />
        <DashboardCard
          title="Items in Stock"
          value={totalItems}
          icon={<CubeIcon className="h-6 w-6" />}
        />
        <DashboardCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={<ExclamationCircleIcon className="h-6 w-6" />}
          alert={lowStockItems > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Recent Sales</h2>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sales.slice(0, 5).map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(sale.date), "MMM dd, yyyy HH:mm")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{sale.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${sale.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No sales recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Current: {product.quantity} / Min:{" "}
                        {product.minStockLevel || 5}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        product.quantity === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    All stock levels are healthy
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function DashboardCard({ title, value, icon, alert }) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        alert ? "ring-2 ring-yellow-400" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${alert ? "text-yellow-400" : "text-gray-400"}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
