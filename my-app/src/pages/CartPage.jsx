import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

const CartPage = () => {
  const { cart, setCart, isDark } = useContext(AppContext);

  const theme = isDark ? {
    text: '#ffffff',
    cardBg: '#2d2d2d',
    border: '#444',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
    price: '#e74c3c',
    button: '#4CAF50'
  } : {
    text: '#2c3e50',
    cardBg: '#ffffff',
    border: '#ddd',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    price: '#e74c3c',
    button: '#2196F3'
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: '20px', color: theme.text }}>
      <h1>Корзина</h1>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cart.map(item => (
            <li key={item.id} style={{
              padding: '16px',
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              marginBottom: '12px',
              boxShadow: theme.boxShadow,
              transition: 'transform 0.2s ease'
            }}>
              <span style={{ fontWeight: 'bold' }}>{item.name}</span>
              <div style={{ color: theme.price, fontSize: '14px' }}>Цена: {item.price} ₽ × {item.quantity}</div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: '20px', fontWeight: 'bold', color: theme.text, fontSize: '18px' }}>
        Итого: {totalPrice} ₽
      </div>
      <button
        onClick={() => alert('Заказ оформлен!')}
        disabled={cart.length === 0}
        style={{
          marginTop: '10px',
          padding: '12px 24px',
          backgroundColor: theme.button,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background 0.3s'
        }}
      >
        Оформить заказ
      </button>
    </div>
  );
};

export default CartPage;