import React, { useContext } from 'react';
import ProductCard from '../components/ProductCard';
import AppContext from '../context/AppContext';

const CatalogPage = () => {
  const { isDark } = useContext(AppContext);

  const products = [
    { id: 1, name: "Фильтр масляный", brand: "Mann", price: 450, image: "/1.png" },
    { id: 2, name: "Свечи зажигания", brand: "NGK", price: 650, image: "/2.png" },
    { id: 3, name: "Тормозные колодки", brand: "Brembo", price: 3200, image: "/3.png" },
    { id: 4, name: "Аккумулятор", brand: "Varta", price: 4800, image: "/4.png" },
    { id: 5, name: "Щётки стеклоочистителя", brand: "Valeo", price: 750, image: "/5.png" },
    { id: 6, name: "Ремень ГРМ", brand: "Contitech", price: 2200, image: "/6.png" },
    { id: 7, name: "Помпа охлаждения", brand: "Thermotec", price: 3800, image: "/7.png" },
    { id: 8, name: "Лампочка фары", brand: "Osram", price: 1200, image: "/8.png" },
    { id: 9, name: "Масло моторное 5W-40", brand: "Shell", price: 850, image: "/9.png" },
    { id: 10, name: "Радиатор охлаждения", brand: "Nissens", price: 8500, image: "/10.png" },
    { id: 11, name: "Сцепление в сборе", brand: "Luk", price: 15000, image: "/11.png" },
    { id: 12, name: "Топливный насос", brand: "Bosch", price: 6500, image: "/12.png" },
    { id: 13, name: "Амортизатор передний", brand: "Koni", price: 7200, image: "/13.png" },
    { id: 14, name: "Катушка зажигания", brand: "Bosch", price: 2100, image: "/14.png" },
    { id: 15, name: "Топливный фильтр", brand: "Mann", price: 550, image: "/15.png" },
  ];

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
    <div style={{ padding: '20px' }}>
      <h1 style={{
        color: theme.text,
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '28px',
        fontWeight: 'bold',
        textShadow: isDark ? '0 0 8px rgba(255,255,255,0.1)' : '0 0 8px rgba(0,0,0,0.1)'
      }}>
        Каталог автозапчастей
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;