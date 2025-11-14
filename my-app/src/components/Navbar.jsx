import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const { isDark, setIsDark, user, setUser } = useContext(AppContext);
  const { totalItems } = useCart(); 
  const navigate = useNavigate();

  const theme = isDark ? {
    navBg: 'linear-gradient(135deg, #3a3a3a, #2c2c2c)',
    activeLink: '#4CAF50',
    inactiveLink: '#bdc3c7',
    button: '#4CAF50',
    border: '#444',
    text: '#ffffff'
  } : {
    navBg: 'linear-gradient(135deg, #e0e0e0, #d0d0d0)',
    activeLink: '#2196F3',
    inactiveLink: '#7f8c8d',
    button: '#2196F3',
    border: '#ddd',
    text: '#2c3e50'
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <nav style={{
      padding: '16px 24px',
      background: theme.navBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: theme.text }}>🚗</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text }}>АвтоЗапчасти</span>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { name: 'Главная', path: '/', icon: '🏠' },
          { name: 'Каталог', path: '/catalog', icon: '📦' },
          { name: 'Корзина', path: '/cart', icon: '🛒', badge: totalItems > 0 ? totalItems : null } 
        ].map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: window.location.pathname === item.path ? theme.activeLink : 'transparent',
              color: window.location.pathname === item.path ? 'white' : theme.inactiveLink,
              border: `1px solid ${theme.border}`,
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (window.location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (window.location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span>{item.icon}</span>
            {item.name}
            {item.badge && (
              <span style={{
                marginLeft: '4px',
                fontSize: '12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
        {user ? (
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: window.location.pathname === '/dashboard' ? theme.activeLink : 'transparent',
              color: window.location.pathname === '/dashboard' ? 'white' : theme.inactiveLink,
              border: `1px solid ${theme.border}`,
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Личный кабинет
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              color: theme.inactiveLink,
              border: `1px solid ${theme.border}`,
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Войти
          </button>
        )}

        {user && user.role_id === 1 && (
          <button
            onClick={() => navigate('/admin')}
            style={{
              background: window.location.pathname === '/admin' ? theme.activeLink : 'transparent',
              color: window.location.pathname === '/admin' ? 'white' : theme.inactiveLink,
              border: `1px solid ${theme.border}`,
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Админ-панель
          </button>
        )}
      </div>
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          padding: '10px 20px',
          backgroundColor: theme.button,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'transform 0.3s, background 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isDark ? '☀️ Светлая' : '🌙 Тёмная'}
      </button>
      {user && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: '10px',
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Выйти
        </button>
      )}
    </nav>
  );
};

export default Navbar;