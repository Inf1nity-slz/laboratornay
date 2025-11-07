import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

const DashboardPage = () => {
  const { user, isDark } = useContext(AppContext);

  const theme = isDark ? {
    text: '#ffffff',
    cardBg: '#2d2d2d',
    border: '#444',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
    button: '#4CAF50'
  } : {
    text: '#2c3e50',
    cardBg: '#ffffff',
    border: '#ddd',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    button: '#2196F3'
  };

  return (
    <div style={{ padding: '20px', color: theme.text }}>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать, {user?.name || user?.email}!</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Ваши данные:</h3>
        <p>Email: {user?.email}</p>
        <p>Дата регистрации: 07.11.2025</p>
      </div>
    </div>
  );
};

export default DashboardPage;