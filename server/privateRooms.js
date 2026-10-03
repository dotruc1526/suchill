import { randomBytes } from 'node:crypto';

export function attachPrivateRooms(socket, { io, player, available, removeQueue, createMatch, ttl = 300000 }, rooms) {
  function leave() {
    for (const [code, room] of rooms) if (room.player.userId === player.userId) {
      clearTimeout(room.timer);
      rooms.delete(code);
    }
  }
  socket.on('create_room', () => {
    if (!available()) return socket.emit('error', 'Bạn đang ở trong trận đấu.');
    if (rooms.size >= 500) return socket.emit('error', 'Máy chủ đang đầy phòng chờ. Hãy thử lại sau.');
    leave(); removeQueue();
    let code;
    do { code = randomBytes(4).toString('hex').slice(0, 6).toUpperCase(); } while (rooms.has(code));
    const timer = setTimeout(() => {
      rooms.delete(code);
      io.to(player.userId).emit('error', 'Phòng đã hết hạn. Hãy tạo phòng mới.');
      io.to(player.userId).emit('idle');
    }, ttl);
    rooms.set(code, { player, timer });
    socket.emit('room_created', { code, expiresAt: Date.now() + ttl });
  });
  socket.on('join_room', data => {
    if (!available()) return socket.emit('error', 'Bạn đang ở trong trận đấu.');
    const code = String(data?.code || '').trim().toUpperCase();
    const room = rooms.get(code);
    if (!room || room.player.userId === player.userId) return socket.emit('error', 'Mã phòng không hợp lệ hoặc là phòng của bạn.');
    if (!io.sockets.adapter.rooms.has(room.player.userId)) return socket.emit('error', 'Chủ phòng đã mất kết nối.');
    leave(); removeQueue(); clearTimeout(room.timer); rooms.delete(code);
    createMatch(player, room.player);
  });
  socket.on('leave_room', () => { if (!available()) return; leave(); socket.emit('idle'); });
  socket.on('disconnect', leave);
  return leave;
}
