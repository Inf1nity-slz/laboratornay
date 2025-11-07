import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

const LoginForm = ({ isLogin = true, isDark = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (email && password) {
        setUser({ email, name: email.split('@')[0] });
        alert('Успешный вход!');
        navigate('/dashboard');
      }
    } else {
      if (name && email && password) {
        setUser({ name, email });
        alert('Успешная регистрация!');
        navigate('/dashboard');
      }
    }
  };

  const theme = isDark ? {
    background: '#2d2d2d',
    text: '#ffffff',
    inputBg: '#3a3a3a',
    button: '#4CAF50'
  } : {
    background: '#ffffff',
    text: '#2c3e50',
    inputBg: '#f9f9f9',
    button: '#2196F3'
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '100px auto',
      padding: '24px',
      backgroundColor: theme.background,
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      color: theme.text
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isLogin ? 'Вход' : 'Регистрация'}
      </h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #444',
                backgroundColor: theme.inputBg,
                color: theme.text
              }}
            />
          </div>
        )}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: theme.inputBg,
              color: theme.text
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: theme.inputBg,
              color: theme.text
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: theme.button,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
        <button
          onClick={() => navigate(isLogin ? '/register' : '/login')}
          style={{
            background: 'none',
            border: 'none',
            color: theme.button,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;