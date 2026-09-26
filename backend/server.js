const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';
let db;

(async function initDB() {
  db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, xp INTEGER DEFAULT 0, current_streak INTEGER DEFAULT 0, last_active_date TEXT);
    CREATE TABLE IF NOT EXISTS user_progress (user_id INTEGER, lesson_id INTEGER, completed BOOLEAN, PRIMARY KEY(user_id, lesson_id));
  `);
})();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run('INSERT INTO users (username, password, last_active_date) VALUES (?, ?, date(\'now\'))', [username, hashedPassword]);
    res.json({id: result.lastID, username});
  } catch (e) {
    res.status(400).json({ error: 'Username may already exist' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword && password !== user.password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token, id: user.id, username: user.username, xp: user.xp });
});

app.post('/api/lessons/:id/complete', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  await db.run('INSERT OR REPLACE INTO user_progress (user_id, lesson_id, completed) VALUES (?, ?, true)', [userId, req.params.id]);
  const xpGain = 10;
  await db.run('UPDATE users SET xp = xp + ? WHERE id = ?', [xpGain, userId]);
  res.json({ success: true, xpEarned: xpGain });
});

app.listen(3001, () => console.log('V2 API running on 3001 with Auth'));
