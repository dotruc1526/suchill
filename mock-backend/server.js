const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const body = req.body || {};
  const email = body.email;
  if (email) res.json({ token: 'mock-jwt-token-12345' });
  else res.status(400).json({ error: 'Email required' });
});

app.get('/api/items', (req, res) => {
  // Giả lập mạng chậm 1 giây
  setTimeout(() => {
    res.json([
      { id: '1', title: 'Learn React Native', description: 'Hiểu về Components, Hooks và vòng đời ứng dụng.' },
      { id: '2', title: 'Master Expo & Router', description: 'Sử dụng Expo Router để điều hướng đa màn hình.' },
      { id: '3', title: 'Client-Server Auth', description: 'Lưu trữ JWT Token an toàn với SecureStore.' },
      { id: '4', title: 'Styling with Restyle', description: 'Xây dựng Design System chuyên nghiệp, Type-safe.' },
      { id: '5', title: 'Agile & QA Testing', description: 'Quy trình lặp lại: Code, Test, Refactor liên tục.' }
    ]);
  }, 1000);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Mock backend on http://0.0.0.0:${PORT}`));
