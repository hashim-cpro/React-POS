import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
// import { utils, writeFile } from 'xlsx'; //slsx has some severe security vulnerabilities reported!sx
import { deleteExpense } from "../store/slices/expenseSlice";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseChart from "../components/ExpenseChart";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

function Expenses() {
  const dispatch = useDispatch();
  const { expenses, categories } = useSelector((state) => state.expenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState(format(new Date(), "yyyy-MM"));

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      !filterCategory || expense.category === filterCategory;
    const expenseDate = parseISO(expense.date);
    const filterStart = startOfMonth(parseISO(filterMonth));
    const filterEnd = endOfMonth(parseISO(filterMonth));
    const matchesMonth = expenseDate >= filterStart && expenseDate <= filterEnd;
    return matchesCategory && matchesMonth;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "date":
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      default:
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const monthlyTotal = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // const exportToExcel = () => {
  //   const data = sortedExpenses.map(expense => ({
  //     Date: format(parseISO(expense.date), 'MMM dd, yyyy'),
  //     Category: expense.category,
  //     Amount: expense.amount.toFixed(2),
  //     Description: expense.description
  //   }));

  //   const ws = utils.json_to_sheet(data);
  //   const wb = utils.book_new();
  //   utils.book_append_sheet(wb, ws, 'Expenses');
  //   writeFile(wb, `expenses_${filterMonth}.xlsx`);
  // };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedExpense(null);
            setIsModalOpen(true);
          }}
        >
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Total</h3>
          <p className="text-3xl font-bold">${monthlyTotal.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([category, total]) => (
              <div key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ExpenseChart expenses={filteredExpenses} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="flex items-end">
              <button
                onClick={exportToExcel}
                className="btn btn-secondary"
                title="Export to Excel"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Export
              </button>
            </div> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === "category" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === "amount" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(expense.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedExpense(expense);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteExpense(expense.id))}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sortedExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </div>
  );
}

export default Expenses;
