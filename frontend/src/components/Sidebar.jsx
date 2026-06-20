import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3, Target, Settings, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/income', icon: TrendingUp, label: 'Income' },
    { path: '/expenses', icon: TrendingDown, label: 'Expenses' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-primary-900 to-primary-800 min-h-screen text-white p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold">SpendSmart</span>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? 'bg-primary-600 text-white' : 'text-primary-200 hover:bg-primary-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-200 hover:bg-primary-700 transition-all mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
