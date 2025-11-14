const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err);
  } else {
    console.log('Подключено к PostgreSQL');
  }
});

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('../public'));

const requireAdminRole = async (req, res, next) => {
  const adminUserId = req.body.adminUserId || req.params.userId;
  if (!adminUserId) {
    return res.status(400).json({ error: 'ID пользователя администратора обязателен' });
  }
  try {
    const userResult = await pool.query('SELECT role_ID FROM users WHERE ID_user = $1', [adminUserId]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Пользователь-администратор не найден' });
    }
    const userRoleId = userResult.rows[0].role_id; 
    if (userRoleId !== 1) { 
      return res.status(403).json({ error: 'Доступ запрещён: требуется роль администратора' });
    }
    next();
  } catch (err) {
    console.error('Ошибка проверки роли администратора:', err);
    res.status(500).json({ error: 'Ошибка сервера при проверке роли' });
  }
};

app.get('/api/products', async (req, res) => {
  try {
    const userId = req.query.userId || null;

    let query = `
      SELECT 
        a.ID_autopart as id,
        a.title as name,
        a.description,
        b.title as brand,
        a.price,
        a.image_path as image,
        c.ID_category as category_id,
        c.title as category,
        pd.percent as product_discount_percent,
        (a.price - (a.price * COALESCE(pd.percent, 0) / 100))::DECIMAL(10,2) as discounted_price
    `;

    let params = [];
    let paramIndex = 1;

    if (userId) {
      query += `,
        d.percent as user_discount_percent,
        upd.percent as user_product_discount_percent,
        -- Рассчитываем итоговую цену с учетом всех скидок
        (a.price - (a.price * COALESCE(pd.percent, 0) / 100) - (a.price * COALESCE(d.percent, 0) / 100) - (a.price * COALESCE(upd.percent, 0) / 100))::DECIMAL(10,2) as final_price
      `;
      query += ` FROM autopart a
        JOIN brand b ON a.brand_ID = b.ID_brand
        JOIN category c ON a.category_ID = c.ID_category
        LEFT JOIN product_discounts pd ON a.ID_autopart = pd.autopart_ID
        LEFT JOIN discounts d ON d.user_ID = $${paramIndex} -- Присоединяем скидку пользователя
        LEFT JOIN user_product_discounts upd ON upd.autopart_ID = a.ID_autopart AND upd.user_ID = $${paramIndex} -- Присоединяем персональную скидку на товар
        ORDER BY a.ID_autopart`;
      params = [userId];
    } else {
      query += `
        FROM autopart a
        JOIN brand b ON a.brand_ID = b.ID_brand
        JOIN category c ON a.category_ID = c.ID_category
        LEFT JOIN product_discounts pd ON a.ID_autopart = pd.autopart_ID
        ORDER BY a.ID_autopart`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT ID_category as id, title FROM category ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
});

app.get('/api/user-discounts/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT percent FROM discounts WHERE user_ID = $1', [userId]);
    const discount = result.rows.length > 0 ? result.rows[0].percent : 0;
    res.json({ discount_percent: discount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения скидки пользователя' });
  }
});

app.get('/api/product-discounts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.ID_autopart as autopart_id, pd.percent
      FROM autopart a
      JOIN product_discounts pd ON a.ID_autopart = pd.autopart_ID
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения скидок на товары' });
  }
});

app.post('/api/categories', requireAdminRole, async (req, res) => {
  const { title, adminUserId } = req.body; 
  if (!title) {
    return res.status(400).json({ error: 'Название категории обязательно' });
  }
  try {
    const result = await pool.query('INSERT INTO category (title) VALUES ($1) RETURNING ID_category, title', [title]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка добавления категории' });
  }
});

app.post('/api/product-discounts', requireAdminRole, async (req, res) => {
  const { autopartId, percent, adminUserId } = req.body; 
  if (!autopartId || percent === undefined || percent < 0 || percent > 100) {
    return res.status(400).json({ error: 'ID товара и процент скидки (0-100) обязательны' });
  }
  try {
    const existing = await pool.query('SELECT ID_product_discount FROM product_discounts WHERE autopart_ID = $1', [autopartId]);
    if (existing.rows.length > 0) {
      await pool.query('UPDATE product_discounts SET percent = $1 WHERE autopart_ID = $2', [percent, autopartId]);
    } else {
      await pool.query('INSERT INTO product_discounts (autopart_ID, percent) VALUES ($1, $2)', [autopartId, percent]);
    }
    res.status(201).json({ message: 'Скидка на товар успешно добавлена/обновлена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка добавления/обновления скидки на товар' });
  }
});

app.post('/api/user-discounts', requireAdminRole, async (req, res) => {
  const { userId, percent, adminUserId } = req.body; 
  if (!userId || percent === undefined || percent < 0 || percent > 100) {
    return res.status(400).json({ error: 'ID пользователя и процент скидки (0-100) обязательны' });
  }
  try {
    const existing = await pool.query('SELECT ID_discount FROM discounts WHERE user_ID = $1', [userId]);
    if (existing.rows.length > 0) {
      await pool.query('UPDATE discounts SET percent = $1 WHERE user_ID = $2', [percent, userId]);
    } else {
      await pool.query('INSERT INTO discounts (user_ID, percent) VALUES ($1, $2)', [userId, percent]);
    }
    res.status(201).json({ message: 'Персональная скидка успешно добавлена/обновлена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка добавления/обновления персональной скидки' });
  }
});

app.post('/api/user-product-discounts', requireAdminRole, async (req, res) => {
  const { userId, autopartId, percent, adminUserId } = req.body; 
  if (!userId || !autopartId || percent === undefined || percent < 0 || percent > 100) {
    return res.status(400).json({ error: 'ID пользователя, ID товара и процент скидки (0-100) обязательны' });
  }
  try {
    const existing = await pool.query('SELECT ID_user_product_discount FROM user_product_discounts WHERE user_ID = $1 AND autopart_ID = $2', [userId, autopartId]);
    if (existing.rows.length > 0) {
      await pool.query('UPDATE user_product_discounts SET percent = $1 WHERE user_ID = $2 AND autopart_ID = $3', [percent, userId, autopartId]);
    } else {
      await pool.query('INSERT INTO user_product_discounts (user_ID, autopart_ID, percent) VALUES ($1, $2, $3)', [userId, autopartId, percent]);
    }
    res.status(201).json({ message: 'Персональная скидка на товар успешно добавлена/обновлена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка добавления/обновления персональной скидки на товар' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  try {
    const result = await pool.query(
      'SELECT ID_user as id, name, email, role_ID as role_id FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const user = result.rows[0];
    const discountResult = await pool.query('SELECT percent FROM discounts WHERE user_ID = $1', [user.id]);
    const userDiscount = discountResult.rows.length > 0 ? discountResult.rows[0].percent : 0;
    user.discount = userDiscount; 
    res.json({ user }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка авторизации' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, address, number } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Имя, email и пароль обязательны' });
  }
  try {
    const existingUser = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    await pool.query(
      'INSERT INTO users (name, email, password, address, number, role_ID) VALUES ($1, $2, $3, $4, $5, 2)',
      [name, email, password, address || '', number || ''] 
    );
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});