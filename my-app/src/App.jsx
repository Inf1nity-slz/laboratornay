import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContext from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import DashboardPage from './pages/DashboardPage';
import LoginForm from './components/LoginForm';
import AdminPanel from './components/AdminPanel'; 
import { CartProvider } from './context/CartContext';
import { getUser } from './utils/api';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const contextValue = {
    isDark,
    setIsDark,
    user,
    setUser
  };

  return (
    <AppContext.Provider value={contextValue}>
      <CartProvider>
        <Router>
          <div style={{
            backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            transition: 'background 0.5s ease'
          }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginForm isLogin={true} isDark={isDark} />} />
              <Route path="/register" element={<LoginForm isLogin={false} isDark={isDark} />} />
              <Route path="/admin" element={<AdminPanel />} /> 
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AppContext.Provider>
  );
}

export default App;