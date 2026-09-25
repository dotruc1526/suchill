const fs = require('fs');

let c = fs.readFileSync('backend/server.js', 'utf8');

if (!c.includes('CREATE TABLE IF NOT EXISTS notes')) {
  c = c.replace(
    'CREATE TABLE IF NOT EXISTS user_progress',
    'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, lesson_id INTEGER, text TEXT);\n    CREATE TABLE IF NOT EXISTS user_progress'
  );
}

if (!c.includes('/api/users/:id/push-token')) {
  const newApis = `
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
`;
  c = c.replace('app.listen(3001', newApis + '\napp.listen(3001');
}

fs.writeFileSync('backend/server.js', c);
console.log('Backend patched');
