import Sidebar from '../components/Sidebar';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { currencySymbol } = useCurrency();
  const [incomeSummary, setIncomeSummary] = useState({ total: 0, count: 0 });
  const [expenseSummary, setExpenseSummary] = useState({ total: 0, count: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
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

      // Fetch recent transactions
      const [incomeList, expenseList] = await Promise.all([
        api.get('/income'),
        api.get('/expenses')
      ]);

      const allTransactions = [
        ...incomeList.data.income.map(item => ({ ...item, type: 'income' })),
        ...expenseList.data.expenses.map(item => ({ ...item, type: 'expense' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setRecentTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const netSavings = incomeSummary.total - expenseSummary.total;
  const totalTransactions = incomeSummary.count + expenseSummary.count;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">Overview of your financial activity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                Income
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{incomeSummary.total.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Total Income</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                <ArrowDownRight className="w-4 h-4" />
                Expenses
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currencySymbol}{expenseSummary.total.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Total Expenses</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`${netSavings >= 0 ? 'text-green-600' : 'text-red-600'} text-sm font-medium flex items-center gap-1`}>
                {netSavings >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                Savings
              </span>
            </div>
            <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-gray-900' : 'text-red-600'}`}>{currencySymbol}{netSavings.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Net Savings</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-gray-500 text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalTransactions}</div>
            <div className="text-gray-500 text-sm">Transactions</div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View all
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No transactions yet. Add your first income or expense!</div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.type === 'income' ? transaction.source : transaction.title}</div>
                      <div className="text-sm text-gray-500">{transaction.category}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
