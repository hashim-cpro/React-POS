import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense, addCategory } from '../store/slices/expenseSlice';

function ExpenseModal({ isOpen, onClose, expense }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.expenses);
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    description: '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date.split('T')[0],
        category: expense.category,
        amount: expense.amount.toString(),
        description: expense.description,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        amount: '',
        description: '',
      });
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    };

    if (expense) {
      dispatch(updateExpense({ ...expenseData, id: expense.id }));
    } else {
      dispatch(addExpense(expenseData));
    }
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      dispatch(addCategory(newCategory.trim()));
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-bold mb-6">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="input mt-1"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              {!showNewCategory ? (
                <div className="flex gap-2">
                  <select
                    className="input mt-1 flex-1"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="btn btn-secondary mt-1"
                  >
                    New
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    className="input flex-1"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input mt-1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="input mt-1"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {expense ? 'Save Changes' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExpenseModal;