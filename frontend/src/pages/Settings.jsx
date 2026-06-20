import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Bell, Shield, DollarSign, Palette, Download, Trash2, Camera, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    budgetAlerts: true,
    weeklySummary: true,
    largeTransactions: false,
    monthlyReport: true
  });

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setCurrency(user.currency || 'INR');
    }
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/user/profile', formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
  };

  const handleCurrencyChange = async (newCurrency) => {
    try {
      await api.put('/user/currency', { currency: newCurrency });
      setCurrency(newCurrency);
      alert('Currency updated successfully!');
    } catch (error) {
      console.error('Error updating currency:', error);
      alert('Failed to update currency');
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'currency', icon: DollarSign, label: 'Currency' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'export', icon: Download, label: 'Export data' },
    { id: 'delete', icon: Trash2, label: 'Delete account' },
  ];

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account, preferences and notifications</p>
        </div>

        <div className="flex gap-8">
          {/* Settings Navigation */}
          <div className="w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile information</h2>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {formData.firstName[0]}{formData.lastName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {formData.firstName} {formData.lastName}
                    </div>
                    <div className="text-gray-500">{formData.email}</div>
                    <button className="mt-2 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Change photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">FIRST NAME</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LAST NAME</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EMAIL</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PHONE</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Budget alerts</div>
                      <div className="text-sm text-gray-500">Notify when you hit 80% of any budget</div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('budgetAlerts')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.budgetAlerts ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.budgetAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Weekly summary</div>
                      <div className="text-sm text-gray-500">Get a weekly spending report via email</div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('weeklySummary')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.weeklySummary ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.weeklySummary ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Large transactions</div>
                      <div className="text-sm text-gray-500">Alert for expenses above ₹5,000</div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('largeTransactions')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.largeTransactions ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.largeTransactions ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Monthly report</div>
                      <div className="text-sm text-gray-500">Receive a detailed monthly financial report</div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('monthlyReport')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.monthlyReport ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.monthlyReport ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'currency' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Currency</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Current currency: <span className="font-semibold">{currencies.find(c => c.code === currency)?.symbol}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    All amounts will be displayed in this currency
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleThemeToggle('light')}
                      className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                        theme === 'light' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                        <span className="text-sm font-medium">Light</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleThemeToggle('dark')}
                      className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                        theme === 'dark' ? 'border-primary-600 bg-primary-900' : 'border-gray-200 bg-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <Moon className="w-8 h-8 mx-auto mb-2 text-white" />
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`}>Dark</span>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Current theme: <span className="font-semibold capitalize">{theme}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Theme preference will be saved and applied automatically
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Export data</h2>
                <p className="text-gray-600 mb-6">Download your financial data in various formats.</p>
                <div className="flex gap-4">
                  <button className="flex-1 border border-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Export as CSV
                  </button>
                  <button className="flex-1 border border-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Export as PDF
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'delete' && (
              <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Delete account</h2>
                <p className="text-gray-600 mb-6">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Delete my account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
