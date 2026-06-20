import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Target, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      console.log('Login successful:', result);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });

    // Real-time email validation
    if (e.target.name === 'email' && value) {
      if (!validateEmail(value)) {
        setError('Please enter a valid email address (e.g., user@example.com)');
      } else {
        setError('');
      }
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-br from-primary-900 to-primary-800 p-12 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">SpendSmart</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back to smarter spending
          </h1>
          <p className="text-xl text-primary-200 mb-12">
            Your finances are waiting. See how your spending has changed since your last visit.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-800/50 p-6 rounded-xl border border-primary-700">
              <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-white">₹42K</div>
              <div className="text-primary-200 text-sm">Saved this month</div>
            </div>

            <div className="bg-primary-800/50 p-6 rounded-xl border border-primary-700">
              <Target className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">87%</div>
              <div className="text-primary-200 text-sm">Budget on track</div>
            </div>

            <div className="bg-primary-800/50 p-6 rounded-xl border border-primary-700">
              <Calendar className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">23</div>
              <div className="text-primary-200 text-sm">Transactions logged</div>
            </div>

            <div className="bg-primary-800/50 p-6 rounded-xl border border-primary-700">
              <ArrowRight className="w-8 h-8 text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-white">4 days</div>
              <div className="text-primary-200 text-sm">Login streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-white p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WELCOME BACK</h1>
          <p className="text-gray-600 mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
             
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-gray-600">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Sign in
            </button>


            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
