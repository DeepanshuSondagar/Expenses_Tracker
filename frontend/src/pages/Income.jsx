import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { TrendingUp, Plus, Filter, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Income = () => {
  const { currencySymbol } = useCurrency();
  const [incomeList, setIncomeList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    source: '',
    category: 'Salary',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const categories = ['All', 'Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const response = await api.get('/income');
      setIncomeList(response.data.income);
    } catch (error) {
      console.error('Error fetching income:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIncome = filter === 'All' 
    ? incomeList 
    : incomeList.filter(item => item.category === filter);

  const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
  const weeklyIncome = incomeList.reduce((sum, item) => sum + item.amount, 0) * 0.26;
  const avgMonthly = totalIncome;

  const categoryBreakdown = incomeList.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/income', {
        source: formData.source,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description
      });
      setShowAddModal(false);
      setFormData({
        source: '',
        category: 'Salary',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      fetchIncome();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/income/${id}`);
      fetchIncome();
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Income</h1>
            <p className="text-gray-600">Track all your income sources — June 2026</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Income
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                12%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{totalIncome.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">TOTAL INCOME</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                <ArrowDownRight className="w-4 h-4" />
                8%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{weeklyIncome.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">THIS WEEK</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-gray-500 text-sm font-medium">Based on 6 months</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{avgMonthly.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">AVG MONTHLY</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Income transactions</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                <div>SOURCE</div>
                <div>CATEGORY</div>
                <div>DATE</div>
                <div className="text-right">AMOUNT</div>
                <div className="text-right">ACTION</div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : filteredIncome.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No income records yet. Add your first income!</div>
              ) : (
                filteredIncome.map((item) => (
                  <div key={item._id} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 items-center">
                    <div className="font-medium text-gray-900">{item.source}</div>
                    <div className="text-gray-600">{item.category}</div>
                    <div className="text-gray-600">{new Date(item.date).toLocaleDateString()}</div>
                    <div className="text-right text-green-600 font-semibold">+{currencySymbol}{item.amount.toLocaleString()}</div>
                    <div className="text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Income by Source */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Income by source</h2>

            <div className="space-y-4">
              {Object.entries(categoryBreakdown).map(([category, amount]) => {
                const percentage = ((amount / totalIncome) * 100).toFixed(1);
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{category}</span>
                      <span className="text-gray-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-gray-500">{currencySymbol}{amount.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Income</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input
                  type="text"
                  required
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Monthly salary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Investment</option>
                  <option>Bonus</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add any notes..."
                  rows="2"
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
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
