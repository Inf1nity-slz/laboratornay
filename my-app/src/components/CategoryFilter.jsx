import React, { useState, useEffect } from 'react';

const CategoryFilter = ({ categories, selectedCategories, onCategoryToggle, isDark }) => {
  const [localCategories, setLocalCategories] = useState(categories);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleToggle = (categoryId) => {
    onCategoryToggle(categoryId);
  };

  const theme = isDark ? {
    asideBg: '#2d2d2d',
    border: '#444',
    text: '#ffffff',
    checkbox: '#4CAF50',
    label: '#bdc3c7'
  } : {
    asideBg: '#ffffff',
    border: '#ddd',
    text: '#2c3e50',
    checkbox: '#2196F3',
    label: '#7f8c8d'
  };

  return (
    <aside style={{
      width: '250px',
      padding: '16px',
      backgroundColor: theme.asideBg,
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
      height: 'fit-content',
      alignSelf: 'flex-start'
    }}>
      <h3 style={{ color: theme.text, marginBottom: '16px' }}>Категории</h3>
      {localCategories.length === 0 ? (
        <p style={{ color: theme.label }}>Категории не найдены</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {localCategories.map(category => (
            <li key={category.id} style={{ marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: theme.label, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleToggle(category.id)}
                  style={{ marginRight: '8px', accentColor: theme.checkbox }}
                />
                {category.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default CategoryFilter;