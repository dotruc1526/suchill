import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import socketHandler from './socketHandler.js';

const app = express();
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

socketHandler(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
