import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Target, Plus, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Budgets = () => {
  const { currencySymbol } = useCurrency();
  const [budgets, setBudgets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: ''
  });

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other'];
  const categoryColors = {
    'Food': 'bg-orange-500',
    'Transport': 'bg-blue-500',
    'Shopping': 'bg-purple-500',
    'Entertainment': 'bg-pink-500',
    'Bills': 'bg-green-500',
    'Healthcare': 'bg-red-500',
    'Education': 'bg-yellow-500',
    'Travel': 'bg-indigo-500',
    'Other': 'bg-gray-500'
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/budgets');
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter(b => b.spent > b.amount).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', {
        category: formData.category,
        amount: parseFloat(formData.amount)
      });
      setShowAddModal(false);
      setFormData({
        category: 'Food',
        amount: ''
      });
      fetchBudgets();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-600">Set and track your spending limits</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Budget
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-500 text-sm">Total Budget</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{totalBudget.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Monthly allocation</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-500 text-sm">Remaining</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{(totalBudget - totalSpent).toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Available to spend</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-gray-500 text-sm">Over Budget</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overBudgetCount}</div>
            <div className="text-red-600 text-sm">Category exceeded</div>
          </div>
        </div>

        {/* Budget List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Categories</h2>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : budgets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No budgets set yet. Add your first budget!</div>
            ) : (
              budgets.map((budget) => {
                const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                const isOverBudget = percentage > 100;
                const isNearLimit = percentage > 80 && percentage <= 100;
                const color = categoryColors[budget.category] || 'bg-gray-500';

                return (
                  <div key={budget._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${color} rounded-full`} />
                        <span className="font-semibold text-gray-900">{budget.category}</span>
                        {isOverBudget && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Over budget
                          </span>
                        )}
                        {isNearLimit && !isOverBudget && (
                          <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Near limit
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{currencySymbol}{budget.spent.toLocaleString()} / {currencySymbol}{budget.amount.toLocaleString()}</div>
                          <div className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-500'}`}>
                            {percentage.toFixed(0)}% used
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(budget._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : color} h-3 rounded-full transition-all`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Budget</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={`${currencySymbol}0`}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Add Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
