import React, { useState, useContext } from 'react';
import AppContext from '../context/AppContext';
import { addCategory, addProductDiscount, addUserDiscount, addUserProductDiscount } from '../utils/api';

const AdminPanel = () => {
  const { user, isDark } = useContext(AppContext); 

  console.log('User in AdminPanel:', user);

  if (!user || user.role_id !== 1) {
    console.log('Access denied in AdminPanel:', { user: user, roleCheck: user?.role_id === 1 }); 
    return <div style={{ padding: '20px', color: '#e74c3c', fontSize: '18px', fontWeight: 'bold' }}>Доступ запрещён</div>;
  }
  console.log('Access granted in AdminPanel'); 

  const [newCategory, setNewCategory] = useState('');
  const [autopartId, setAutopartId] = useState('');
  const [percent, setPercent] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [targetUserIdForProductDiscount, setTargetUserIdForProductDiscount] = useState(''); 
  const [autopartIdForUserDiscount, setAutopartIdForUserDiscount] = useState(''); 
  const [message, setMessage] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory, user.id);
      setMessage('Категория добавлена');
      setNewCategory(''); 
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddProductDiscount = async (e) => {
    e.preventDefault();
    if (!autopartId || !percent) return;
    try {
      await addProductDiscount(parseInt(autopartId), parseFloat(percent), user.id);
      setMessage('Скидка на товар добавлена');
      setAutopartId('');
      setPercent('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddUserDiscount = async (e) => {
    e.preventDefault();
    if (!targetUserId || !percent) return;
    try {
      await addUserDiscount(parseInt(targetUserId), parseFloat(percent), user.id);
      setMessage('Персональная скидка (на все товары) добавлена');
      setTargetUserId('');
      setPercent('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddUserProductDiscount = async (e) => {
    e.preventDefault();
    if (!targetUserIdForProductDiscount || !autopartIdForUserDiscount || !percent) return;
    try {
      await addUserProductDiscount(parseInt(targetUserIdForProductDiscount), parseInt(autopartIdForUserDiscount), parseFloat(percent), user.id);
      setMessage('Персональная скидка на товар добавлена');
      setTargetUserIdForProductDiscount('');
      setAutopartIdForUserDiscount('');
      setPercent('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const theme = isDark ? {
    background: '#2d2d2d',
    text: '#ffffff',
    cardBg: '#3a3a3a',
    border: '#444',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
    button: '#4CAF50',
    inputBg: '#444',
    inputText: '#ffffff',
    messageBg: '#d4edda',
    messageText: '#155724',
    errorBg: '#f8d7da',
    errorText: '#721c24'
  } : {
    background: '#ffffff',
    text: '#2c3e50',
    cardBg: '#ffffff',
    border: '#ddd',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    button: '#2196F3',
    inputBg: '#f9f9f9',
    inputText: '#2c3e50',
    messageBg: '#d4edda',
    messageText: '#155724',
    errorBg: '#f8d7da',
    errorText: '#721c24'
  };

  const formStyle = {
    marginBottom: '30px',
    padding: '20px',
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    backgroundColor: theme.cardBg,
    boxShadow: theme.boxShadow
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: `1px solid ${theme.border}`,
    fontSize: '14px',
    backgroundColor: theme.inputBg,
    color: theme.inputText
  };

  const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: theme.button,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background 0.3s'
  };

  const messageStyle = {
    padding: '12px',
    margin: '10px 0',
    backgroundColor: theme.messageBg,
    color: theme.messageText,
    borderRadius: '6px',
    border: `1px solid ${theme.messageBg}`
  };

  const errorStyle = {
    ...messageStyle,
    backgroundColor: theme.errorBg,
    color: theme.errorText,
    border: `1px solid ${theme.errorBg}`
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: theme.background,
      color: theme.text
    }}>
      <h2 style={{
        color: theme.text,
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Панель администратора
      </h2>
      {message && <div style={message.includes('ошибка') ? errorStyle : messageStyle}>{message}</div>}

      <form onSubmit={handleAddCategory} style={formStyle}>
        <h3 style={{
          color: theme.text,
          marginBottom: '15px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Добавить категорию
        </h3>
        <input
          type="text"
          placeholder="Название категории"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Добавить</button>
      </form>

      <form onSubmit={handleAddProductDiscount} style={formStyle}>
        <h3 style={{
          color: theme.text,
          marginBottom: '15px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Добавить скидку на товар (всем пользователям)
        </h3>
        <input
          type="number"
          placeholder="ID товара"
          value={autopartId}
          onChange={(e) => setAutopartId(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Процент скидки (0-100)"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Добавить скидку</button>
      </form>

      <form onSubmit={handleAddUserDiscount} style={formStyle}>
        <h3 style={{
          color: theme.text,
          marginBottom: '15px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Добавить персональную скидку пользователю (на все товары)
        </h3>
        <input
          type="number"
          placeholder="ID пользователя"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Процент скидки (0-100)"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Добавить скидку</button>
      </form>

      <form onSubmit={handleAddUserProductDiscount} style={formStyle}>
        <h3 style={{
          color: theme.text,
          marginBottom: '15px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Добавить персональную скидку пользователю на конкретный товар
        </h3>
        <input
          type="number"
          placeholder="ID пользователя"
          value={targetUserIdForProductDiscount}
          onChange={(e) => setTargetUserIdForProductDiscount(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="ID товара"
          value={autopartIdForUserDiscount}
          onChange={(e) => setAutopartIdForUserDiscount(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Процент скидки (0-100)"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Добавить скидку</button>
      </form>
    </div>
  );
};

export default AdminPanel;