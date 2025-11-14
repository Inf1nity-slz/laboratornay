import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { loginUser, registerUser, saveUser } from '../utils/api';

const LoginForm = ({ isLogin = true, isDark = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Email и пароль обязательны');
        return;
      }
      try {
        const response = await loginUser(email, password);
        const userData = response.user;
        setUser(userData);
        saveUser(userData);
        alert('Успешный вход!');
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      }
    } else {
      if (!name || !email || !password) {
        setError('Имя, email и пароль обязательны');
        return;
      }
      try {
        await registerUser({ name, email, password, address, number });
        alert('Успешная регистрация! Пожалуйста, войдите.');
        navigate('/login');
      } catch (err) {
        setError(err.message);
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
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#e74c3c',
          color: 'white',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}
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
        {!isLogin && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Адрес"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                type="text"
                placeholder="Телефон"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
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
          </>
        )}
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