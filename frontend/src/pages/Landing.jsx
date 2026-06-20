import { Link } from 'react-router-dom';
import { Wallet, BarChart3, Target, Lock, ArrowRight, Play } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl   mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">SpendSmart</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-white hover:text-primary-200 transition-colors">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-primary-700 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary-700/50 text-primary-200 px-4 py-2 rounded-full mb-6">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Smart expense tracking</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Take control of your <span className="text-primary-300">finances</span> today
          </h1>
          <p className="text-xl text-primary-200 mb-8 leading-relaxed">
            Track expenses, visualize spending patterns, and hit your savings goals — all in one beautiful dashboard.
          </p>
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50k+</div>
            <div className="text-primary-200">Active users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">₹2Cr+</div>
            <div className="text-primary-200">Tracked monthly</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">15+</div>
            <div className="text-primary-200">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">4.9★</div>
            <div className="text-primary-200">User rating</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-white mb-4">Everything you need to save more</h2>
        <p className="text-xl text-primary-200 mb-12">Powerful features built for modern money management</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-primary-800/50 p-8 rounded-2xl border border-primary-700">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time analytics</h3>
            <p className="text-primary-200">Beautiful charts updated as you spend.</p>
          </div>

          <div className="bg-primary-800/50 p-8 rounded-2xl border border-primary-700">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart budget alerts</h3>
            <p className="text-primary-200">Get notified before you overspend.</p>
          </div>

          <div className="bg-primary-800/50 p-8 rounded-2xl border border-primary-700">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & private</h3>
            <p className="text-primary-200">Your data is encrypted end-to-end.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
