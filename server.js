import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initDb } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'coffee-secret-key-123';

// ---------------- MIDDLEWARE ----------------
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// ---------------- DB INIT ----------------
let db;
try {
  db = await initDb();
  console.log('✅ Database connected');
} catch (err) {
  console.error('❌ DB connection failed:', err);
}

// ---------------- AUTH MIDDLEWARE ----------------
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

// ---------------- AUTH ROUTES ----------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({
      id: result.lastID,
      name,
      email,
    });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------- PRODUCTS ----------------

// GET all
app.get('/api/products', async (req, res) => {
  const products = await db.all('SELECT * FROM products');
  res.json(products);
});

// GET single
app.get('/api/products/:id', async (req, res) => {
  const product = await db.get(
    'SELECT * FROM products WHERE id = ?',
    [req.params.id]
  );

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

// CREATE
app.post('/api/products', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, category, price, image, description } = req.body;

  try {
    const result = await db.run(
      'INSERT INTO products (name, category, price, image, description) VALUES (?, ?, ?, ?, ?)',
      [name, category, price, image, description]
    );

    res.status(201).json({
      id: result.lastID,
      name,
      category,
      price,
      image,
      description,
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE
app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, category, price, image, description } = req.body;

  try {
    await db.run(
      'UPDATE products SET name=?, category=?, price=?, image=?, description=? WHERE id=?',
      [name, category, price, image, description, req.params.id]
    );

    res.json({ message: 'Product updated' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE
app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await db.run('DELETE FROM products WHERE id=?', [req.params.id]);
  res.json({ message: 'Product deleted' });
});

// ---------------- ORDERS ----------------
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { total_price, items } = req.body;

  try {
    await db.run('BEGIN TRANSACTION');

    const orderResult = await db.run(
      'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
      [req.user.id, total_price]
    );

    const orderId = orderResult.lastID;

    for (const item of items) {
      await db.run(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.product_id, item.quantity]
      );
    }

    await db.run('COMMIT');

    res.status(201).json({ orderId, message: 'Order placed successfully' });
  } catch {
    await db.run('ROLLBACK');
    res.status(500).json({ message: 'Order failed' });
  }
});

// ---------------- FRONTEND ----------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);
}

// ---------------- START ----------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});