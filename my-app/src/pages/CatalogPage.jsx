import React, { useState, useEffect, useContext } from 'react';
import { fetchProducts, fetchCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import AppContext from '../context/AppContext';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { isDark, user } = useContext(AppContext); 

  useEffect(() => {
    const loadProductsAndCategories = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(user?.id), 
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProductsAndCategories();
  }, [user?.id]); 

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const filteredProducts = selectedCategories.length === 0
    ? products
    : products.filter(product => selectedCategories.includes(product.category_id));

  if (loading) return <div style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Загрузка товаров...</div>;
  if (error) return <div style={{ color: isDark ? '#e74c3c' : '#e74c3c' }}>Ошибка: {error}</div>;

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '24px' }}>
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        isDark={isDark}
      />
      <div style={{ flex: 1 }}>
        <h1 style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Каталог автозапчастей</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
          {filteredProducts.length === 0 ? (
            <p style={{ color: isDark ? '#bdc3c7' : '#7f8c8d' }}>Нет товаров в выбранных категориях</p>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} isDark={isDark} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;