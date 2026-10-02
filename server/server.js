import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import socketHandler from './socketHandler.js';
import { createSessionStore } from './sessionStore.js';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { deploymentOrigins } from './deploymentOrigins.js';

export function createGameServer(options = {}) {
const app = express();
const origins = options.origins || deploymentOrigins();
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('Production requires SESSION_SECRET');
}
if (process.env.NODE_ENV === 'production' && process.env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must have at least 32 characters');
const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (Number.isInteger(proxyHops) && proxyHops > 0) app.set('trust proxy', proxyHops);
const allowed = origin => !origin || origins.includes(origin);
app.use(cors({ origin: (origin, done) => done(null, allowed(origin)) }));
app.use(express.json({ limit: '2kb' }));
const sessions = createSessionStore(options.secret || process.env.SESSION_SECRET);
const requests = new Map();
app.post('/session', (req, res) => {
  if (!allowed(req.headers.origin)) return res.status(403).json({ error: 'Origin denied' });
  const now = Date.now();
  for (const [key, value] of requests) if (now - value.start > 60000) requests.delete(key);
  const key = req.ip;
  const value = requests.get(key) || { start: now, count: 0 };
  requests.set(key, value);
  if (++value.count > 20 || requests.size > 10000) return res.status(429).json({ error: 'Too many sessions' });
  if (typeof req.body?.username !== 'string' || !req.body.username.trim()) return res.status(400).json({ error: 'Username required' });
  res.setHeader('Cache-Control', 'no-store');
  res.json(sessions.issue(req.body.username));
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const staticDir = options.staticDir || process.env.STATIC_DIR;
if (staticDir) {
  const directory = resolve(staticDir);
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    next();
  });
  app.get('/', (_req, res) => { res.setHeader('Cache-Control', 'no-store'); res.sendFile(resolve(directory, 'index-pvp.html')); });
  app.use(express.static(directory, { index: false, dotfiles: 'deny' }));
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  maxHttpBufferSize: 4096,
  allowRequest: (req, done) => done(null, allowed(req.headers.origin)),
  cors: {
    origin: origins,
    methods: ['GET', 'POST']
  }
});

const active = new Map();
io.use((socket, next) => {
  const player = sessions.verify(socket.handshake.auth?.token);
  if (!player) return next(new Error('Invalid player session'));
  if (active.has(player.userId)) return next(new Error('Player session already connected'));
  socket.data.player = player;
  active.set(player.userId, socket.id);
  socket.once('disconnect', () => active.delete(player.userId));
  next();
});
const dispose = socketHandler(io, options.game);
return { app, io, httpServer, close: () => { dispose(); return new Promise(resolve => io.close(resolve)); } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
const { httpServer, close } = createGameServer();
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await close(); process.exit(0); });
}
