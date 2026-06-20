import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$'
};

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    if (user?.currency) {
      setCurrency(user.currency);
    }
  }, [user]);

  const currencySymbol = currencySymbols[currency] || '₹';

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
