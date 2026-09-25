const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PGlite } = require('@electric-sql/pglite');

const app = express();
app.use(cors());
app.use(express.json());

const USER_ID = 1;
let db;

(async function initDB() {
  console.log('Initializing PostgreSQL (PGlite embedded)...');
  db = new PGlite('./database_data');
  try {
    const check = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    const hasUsers = check.rows.some(r => r.table_name === 'users');
    if (!hasUsers) {
      console.log('Db empty. Running schema and seed...');
      const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema_simple.sql'), 'utf8');
      const seedSql = fs.readFileSync(path.join(__dirname, '..', 'database', 'seed_simple.sql'), 'utf8');
      for(let q of schemaSql.split(';')) { if(q.trim()) await db.query(q); }
      for(let q of seedSql.split(';')) { if(q.trim()) await db.query(q); }
      console.log('Database seeded successfully!');
    } else {
      console.log('Database already exists, skipping seed.');
    }
  } catch(err) {
    console.error('DBInitError:', err);
  }
})();


app.get('/api/lessons', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT lessons.*, events.name as event_name FROM lessons JOIN events ON lessons.event_id = events.id ORDER BY lessons.id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT lessons.*, events.name as event_name FROM lessons JOIN events ON lessons.event_id = events.id WHERE lessons.id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Lesson not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lessons/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM questions WHERE lesson_id = $1 ORDER BY id', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lessons/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      'INSERT INTO user_progress (user_id, lesson_id, completed) VALUES ($1, $2, true) ON CONFLICT (user_id, lesson_id) DO UPDATE SYT completed = true',
      [USER_ID, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('V1 API Server running on port ' + PORT);
});