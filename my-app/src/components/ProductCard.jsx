import React from 'react';
import { useCart } from '../context/CartContext'; 

const ProductCard = ({ product, isDark }) => {
  const { addItem } = useCart();
  const { id, name, brand, price, image } = product;

  const handleAddToCart = () => {
    addItem(product);
  };

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

  return (
    <div style={{
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '16px',
      width: '250px',
      textAlign: 'center',
      backgroundColor: theme.cardBg,
      boxShadow: theme.boxShadow,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = theme.boxShadow;
    }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.button}, ${theme.price})`,
        borderRadius: '12px 12px 0 0'
      }}></div>

      {image ? (
        <div style={{
          width: '100%',
          height: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
          overflow: 'hidden',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          <img src={image} alt={name} style={{
            maxHeight: '140px',
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: '4px'
          }} />
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '160px',
          backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
        </div>
      )}

      <h3 style={{
        margin: '8px 0',
        color: theme.text,
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        {name}
      </h3>

      <p style={{
        margin: '4px 0',
        color: '#7f8c8d',
        fontSize: '14px',
        fontStyle: 'italic'
      }}>
        {brand}
      </p>

      <p style={{
        margin: '8px 0',
        color: theme.price,
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        Цена: {price} ₽
      </p>

      <button
        onClick={handleAddToCart}
        style={{
          marginTop: '12px',
          padding: '10px 16px',
          backgroundColor: theme.button,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'background 0.3s, transform 0.2s'
        }}
      >
        В корзину
      </button>
    </div>
  );
};

export default ProductCard;