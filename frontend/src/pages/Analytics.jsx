import Sidebar from '../components/Sidebar';
import { BarChart3, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Analytics = () => {
  const { currencySymbol } = useCurrency();
  const [incomeSummary, setIncomeSummary] = useState({ total: 0, count: 0, byCategory: {} });
  const [expenseSummary, setExpenseSummary] = useState({ total: 0, count: 0, byCategory: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([
        api.get('/income/summary'),
        api.get('/expenses/summary')
      ]);
      setIncomeSummary(incomeRes.data);
      setExpenseSummary(expenseRes.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const savings = incomeSummary.total - expenseSummary.total;
  const savingsRate = incomeSummary.total > 0 ? ((savings / incomeSummary.total) * 100).toFixed(1) : 0;

  const expenseCategories = Object.entries(expenseSummary.byCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: expenseSummary.total > 0 ? ((amount / expenseSummary.total) * 100).toFixed(1) : 0,
    color: ['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-red-500'][Object.keys(expenseSummary.byCategory).indexOf(category) % 6]
  }));

  const highestCategory = expenseCategories.length > 0 ? expenseCategories.reduce((a, b) => a.amount > b.amount ? a : b) : null;
  const avgDailySpending = expenseSummary.total > 0 ? (expenseSummary.total / 30).toFixed(0) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Visualize your spending patterns and trends</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-500 text-sm">Income</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{incomeSummary.total.toLocaleString()}</div>
            <div className="text-green-600 text-sm">{incomeSummary.count} transactions</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-gray-500 text-sm">Expenses</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{expenseSummary.total.toLocaleString()}</div>
            <div className="text-red-600 text-sm">{expenseSummary.count} transactions</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-500 text-sm">Savings</span>
            </div>
            <div className={`text-2xl font-bold ${savings >= 0 ? 'text-gray-900' : 'text-red-600'}`}>{currencySymbol}{savings.toLocaleString()}</div>
            <div className={`${savings >= 0 ? 'text-green-600' : 'text-red-600'} text-sm`}>{savings >= 0 ? 'Positive' : 'Negative'}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-500 text-sm">Savings Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{savingsRate}%</div>
            <div className={`${parseFloat(savingsRate) >= 20 ? 'text-green-600' : 'text-red-600'} text-sm`}>{parseFloat(savingsRate) >= 20 ? 'Good' : 'Needs improvement'}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Overview</h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="h-64 flex items-end justify-center gap-2 px-4">
                <div className="w-full flex gap-1 items-end h-48">
                  <div
                    className="flex-1 bg-green-500 rounded-t transition-all"
                    style={{ height: incomeSummary.total > 0 ? `${Math.min((incomeSummary.total / (incomeSummary.total + expenseSummary.total)) * 100, 100)}%` : '0%' }}
                  />
                  <div
                    className="flex-1 bg-red-500 rounded-t transition-all"
                    style={{ height: expenseSummary.total > 0 ? `${Math.min((expenseSummary.total / (incomeSummary.total + expenseSummary.total)) * 100, 100)}%` : '0%' }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Expense Categories</h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : expenseCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No expense data yet</div>
            ) : (
              <div className="space-y-4">
                {expenseCategories.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{item.category}</span>
                      <span className="text-gray-600">{currencySymbol}{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${item.color} h-3 rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spending Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending Trends</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Highest spending category</div>
                <div className="text-lg font-semibold text-gray-900">{highestCategory ? highestCategory.category : 'N/A'}</div>
                <div className="text-red-600 text-sm">{highestCategory ? `${currencySymbol}${highestCategory.amount.toLocaleString()} total` : 'No data'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Average daily spending</div>
                <div className="text-lg font-semibold text-gray-900">{currencySymbol}{avgDailySpending.toLocaleString()}</div>
                <div className="text-gray-600 text-sm">This month</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total transactions</div>
                <div className="text-lg font-semibold text-gray-900">{incomeSummary.count + expenseSummary.count}</div>
                <div className="text-gray-600 text-sm">All time</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
