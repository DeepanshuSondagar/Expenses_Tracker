import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function RedirectToLastPage() {
  const { loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      const lastPage = localStorage.getItem('lastPage');
      if (lastPage && lastPage !== '/login' && lastPage !== '/signup') {
        localStorage.removeItem('lastPage');
        window.location.href = lastPage;
      }
    }
  }, [loading]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <RedirectToLastPage />
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
