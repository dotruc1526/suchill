const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (email) res.json({ token: 'mock-jwt-token-12345' });
  else res.status(400).json({ error: 'Email required' });
});
app.get('/api/items', (req, res) => res.json([{ id: 1, name: 'Item 1' }]));
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Mock backend on http://0.0.0.0:${PORT}`));