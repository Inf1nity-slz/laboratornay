const API_BASE_URL = 'http://localhost:5000/api';

const normalizeUser = (user) => {
  if (!user) return user;
  if (user.hasOwnProperty('role_ID') && !user.hasOwnProperty('role_id')) {
    return { ...user, role_id: user.role_ID, role_ID: undefined };
  }
  if (user.hasOwnProperty('role_id')) {
    return user;
  }
  return { ...user, role_id: user.role_id || user.role_ID || null };
};

export const fetchProducts = async (userId = null) => {
  const url = userId ? `${API_BASE_URL}/products?userId=${userId}` : `${API_BASE_URL}/products`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Ошибка загрузки товаров');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Ошибка загрузки категорий');
  return response.json();
};

export const fetchUserDiscount = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user-discounts/${userId}`);
  if (!response.ok) throw new Error('Ошибка загрузки скидки пользователя');
  return response.json();
};

export const fetchProductDiscounts = async () => {
  const response = await fetch(`${API_BASE_URL}/product-discounts`);
  if (!response.ok) throw new Error('Ошибка загрузки скидок на товары');
  return response.json();
};

export const addCategory = async (title, adminUserId) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, adminUserId }) 
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка добавления категории');
  }
  return response.json();
};

export const addProductDiscount = async (autopartId, percent, adminUserId) => {
  const response = await fetch(`${API_BASE_URL}/product-discounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ autopartId, percent, adminUserId }) 
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка добавления скидки на товар');
  }
  return response.json();
};

export const addUserDiscount = async (userId, percent, adminUserId) => {
  const response = await fetch(`${API_BASE_URL}/user-discounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, percent, adminUserId }) 
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка добавления персональной скидки');
  }
  return response.json();
};

export const addUserProductDiscount = async (userId, autopartId, percent, adminUserId) => {
  const response = await fetch(`${API_BASE_URL}/user-product-discounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, autopartId, percent, adminUserId }) 
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка добавления персональной скидки на товар');
  }
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка входа');
  }
  const data = await response.json();
  data.user = normalizeUser(data.user);
  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка регистрации');
  }
  return response.json();
};

export const saveUser = (user) => {
  const normalizedUser = normalizeUser(user);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return normalizeUser(parsedUser);
    } catch (e) {
      console.error("Ошибка при парсинге пользователя из localStorage:", e);
      return null;
    }
  }
  return null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};