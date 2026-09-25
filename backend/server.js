const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;

(async function initDB() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, xp INTEGER DEFAULT 0, current_streak INTEGER DEFAULT 0, last_active_date TEXT);
    CREATE TABLE IF NOT EXISTS periods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, period_id INTEGER, name TEXT, year TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER, title TEXT, content TEXT);
    CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id INTEGER, question TEXT, option_a TEXT, option_b TEXT, option_c TEXT, option_d TEXT, correct_answer TEXT);
    CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, lesson_id INTEGER, text TEXT);
    CREATE TABLE IF NOT EXISTS user_progress (user_id INTEGER, lesson_id INTEGER, completed BOOLEAN, PRIMARY KEY(user_id, lesson_id));
  `);

  const users = await db.all('SELECT * FROM users');
  if (users.length === 0) {
    await db.exec(`
      INSERT INTO periods (name, description) VALUES ('1954-1960', 'Đấu tranh chính trị và phong trào Đồng khởi');
      INSERT INTO events (period_id, name, year, description) VALUES (1, 'Kù kết Hiệp định Genève', '1954', 'Kết thúc chiến tranh Đông Dương');
      INSERT INTO users (username, password, xp, current_streak, last_active_date) VALUES ('demo_user', 'password123', 0, 1, date('now'));
      INSERT INTO lessons (event_id, title, content) VALUES (1, 'Chiến dịch Điện Biên Phủ', 'Bối canh: Qu�n Pháp xây dựng cứ điểm Điện Biên Phủ thành pháo đài b�t khả xâm phạm.\n\nDiễn biến: Sau 56 ngày đêm chiến đấu, quân dân ta đã tiêu diệt hoàn toàn cứ điểm.');
      INSERT INTO questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (1, 'Chiến dịch Điện Biên Phủ kéo dài bao nhiêu ngày đêm?', '45 ngày đêm', '56 ngày đêm', '60 ngày đêm', '72 ngày đêm', 'B');
    `);
  }
})();

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const result = await db.run('INSERT INTO users (username, password, last_active_date) VALUES (?, ?, date(\'now\'))', [username, password]);
    const user = await db.get('SELECT id, username, xp, current_streak, last_active_date FROM users WHERE id = ?', [result.lastID]);
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: 'Username may already exist' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const today = new Date().toISOString().split('T')[0];
  if (user.last_active_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const isStreak = user.last_active_date === yStr;
    await db.run('UPDATE users SET last_active_date = ?, current_streak = ? WHERE id = ?', [today, isStreak ? user.current_streak + 1 : 1, user.id]);
    user.current_streak = isStreak ? user.current_streak + 1 : 1;
  }
  res.json({ id: user.id, username: user.username, xp: user.xp, current_streak: user.current_streak });
});

app.get('/api/lessons/:id', async (req, res) => {
  const l = await db.get('SELECT lessons.*, events.name as event_name, events.year FROM lessons JOIN events ON lessons.event_id = events.id WHERE lessons.id = ?', [req.params.id]);
  if (!l) return res.status(404).json({error: 'Not found'});
  res.json({ ...l, subtitle: l.event_name, description: l.content });
});

app.get('/api/lessons', async (req, res) => {
  const rows = await db.all('SELECT lessons.*, events.name as event_name FROM lessons JOIN events ON lessons.event_id = events.id ORDER BY lessons.id');
  res.json(rows);
});

app.get('/api/lessons/:id/questions', async (req, res) => {
  const rows = await db.all('SELECT * FROM questions WHERE lesson_id = ? ORDER BY id', [req.params.id]);
  res.json(rows);
});

app.post('/api/lessons/:id/complete', async (req, res) => {
  const { userId, score, maxScore } = req.body;
  await db.run('INSERT OR REPLACE INTO user_progress (user_id, lesson_id, completed) VALUES (?, ?, true)', [userId, req.params.id]);
  const xpGain = maxScore ? Math.round((score / maxScore) * 10) : 10;
  await db.run('UPDATE users SET xp = xp + ? WHERE id = ?', [xpGain, userId]);
  res.json({ success: true, xpEarned: xpGain });
});

app.get('/api/users/:id/progress', async (req, res) => {
  const rows = await db.all('SELECT lesson_id FROM user_progress WHERE user_id = ? AND completed = true', [req.params.id]);
  res.json(rows.map(r => r.lesson_id));
});


app.post('/api/users/:id/push-token', async (req, res) => {
  try {
    await db.run('ALTER TABLE users ADD COLUMN push_token TEXT').catch(e=>{});
    await db.run('UPDATE users SET push_token = ? WHERE id = ?', [req.body.token, req.params.id]);
    res.json({success:true});
  } catch(e){ res.status(500).json({error:e.message}); }
});

app.post('/api/lessons/:id/notes', async (req, res) => {
  try {
    await db.run('INSERT INTO notes (user_id, lesson_id, text) VALUES (?, ?, ?)', [req.body.userId, req.params.id, req.body.text]);
    res.json({success:true});
  } catch(e){ res.status(500).json({error:e.message}); }
});

app.post("/api/push-token", (req, res) => { console.log("Received Push Token:", req.body.token); res.json({success:true}); });
app.listen(3001, () => console.log('V2 API running on 3001'));