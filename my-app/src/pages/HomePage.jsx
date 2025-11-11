import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AppContext from '../context/AppContext';

const HomePage = () => {
  const navigate = useNavigate(); 
  const { isDark } = useContext(AppContext);

  const theme = isDark ? {
    background: 'linear-gradient(135deg, #2c2c2c, #1e1e1e)',
    text: '#ffffff',
    button: '#4CAF50'
  } : {
    background: 'linear-gradient(135deg, #f5f7fa, #e4e7f4)',
    text: '#2c3e50',
    button: '#2196F3'
  };

  return (
    <div style={{
      padding: '40px 20px',
      textAlign: 'center',
      color: theme.text,
      maxWidth: '800px',
      margin: '0 auto',
      background: theme.background,
      borderRadius: '16px',
      boxShadow: isDark ? '0 6px 16px rgba(0,0,0,0.3)' : '0 6px 16px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <h1 style={{
        fontSize: '36px',
        marginBottom: '20px',
        color: theme.text,
        textShadow: isDark ? '0 0 10px rgba(255,255,255,0.2)' : '0 0 10px rgba(0,0,0,0.1)',
        fontWeight: 'bold'
      }}>
        Добро пожаловать в Магазин Автозапчастей!
      </h1>
      <p style={{
        fontSize: '18px',
        lineHeight: '1.6',
        marginBottom: '30px',
        color: theme.text
      }}>
        У нас вы найдете только качественные и надёжные автозапчасти по выгодным ценам.  
        Широкий ассортимент, быстрая доставка и отличный сервис — всё для вашего автомобиля.
      </p>
      <button
        onClick={() => navigate('/catalog')} 
        style={{
          padding: '14px 28px',
          fontSize: '18px',
          backgroundColor: theme.button,
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        Перейти в каталог
      </button>
    </div>
  );
};

export default HomePage;