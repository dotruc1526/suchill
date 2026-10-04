import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { networkInterfaces } from 'node:os';
import { createGameServer } from '../server/server.js';
import { smokeOnline } from '../server/scripts/smoke-online.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const cloudflaredPath = resolve(root, 'tmp/cloudflared.exe');

if (!existsSync(cloudflaredPath)) {
  console.error('Không tìm thấy cloudflared.exe tại tmp/cloudflared.exe');
  process.exit(1);
}

function getLocalIp() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return '127.0.0.1';
}

function startTunnel(port) {
  return new Promise((resolvePromise, rejectPromise) => {
    const proc = spawn(cloudflaredPath, ['tunnel', '--url', `http://127.0.0.1:${port}`], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        proc.kill();
        rejectPromise(new Error(`Timeout khi khởi tạo Cloudflare Tunnel cho port ${port}`));
      }
    }, 25000);

    const checkOutput = (data) => {
      const text = data.toString();
      const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (match && !resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolvePromise({ url: match[0], proc });
      }
    };

    proc.stdout.on('data', checkOutput);
    proc.stderr.on('data', checkOutput);
    proc.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        rejectPromise(err);
      }
    });
  });
}

console.log('------------------------------------------------------------');
console.log('🚀 ĐANG KHỞI CHẠY HỆ THỐNG SỬ CHILL (CÁCH B - 4G & WI-FI)');
console.log('   Nền tảng: PR109 (1954 MVP) + Đấu Trí Online + AI SỬu');
console.log('------------------------------------------------------------');

const allowedOrigins = [
  'http://localhost:8443',
  'http://127.0.0.1:8443',
  `http://${getLocalIp()}:8443`,
];

// 1. Khởi động Backend Socket.IO & AI server (Port 3001)
console.log('1. Khởi động Backend (Socket.IO, AI Chat Gemini)...');
const game = createGameServer({ origins: allowedOrigins });
await new Promise((res, rej) => {
  game.httpServer.once('error', rej);
  game.httpServer.listen(3001, '0.0.0.0', res);
});
console.log('   ✓ Backend đang chạy tại http://0.0.0.0:3001');

// 2. Mở Cloudflare Tunnel cho Backend
console.log('2. Mở Cloudflare Tunnel cho Backend...');
const backendTunnel = await startTunnel(3001);
const backendUrl = backendTunnel.url;
console.log(`   ✓ Backend Public URL (HTTPS): ${backendUrl}`);

// 3. Khởi động Frontend Vite với VITE_GAME_SERVER_URL trỏ vào backend tunnel
console.log('3. Khởi động Frontend Vite (Port 8443)...');
const vite = await createServer({
  root,
  server: { port: 8443, host: '0.0.0.0', strictPort: true, allowedHosts: true },
  optimizeDeps: { entries: ['index.html'] },
  define: {
    'import.meta.env.VITE_GAME_SERVER_URL': JSON.stringify(backendUrl),
  },
});
await vite.listen();
console.log('   ✓ Frontend đang chạy tại http://0.0.0.0:8443');

// 4. Mở Cloudflare Tunnel cho Frontend
console.log('4. Mở Cloudflare Tunnel cho Frontend...');
const frontendTunnel = await startTunnel(8443);
const frontendUrl = frontendTunnel.url;
console.log(`   ✓ Frontend Public URL (HTTPS): ${frontendUrl}`);

// 5. Cập nhật CORS cho Backend nhận Frontend tunnel
allowedOrigins.push(frontendUrl);

// 6. Chạy Smoke Test kiểm tra kết nối Internet thực tế
console.log('5. Chạy Smoke Test kiểm tra kết nối qua Internet (PR109 probe)...');
try {
  const smoke = await smokeOnline(backendUrl, frontendUrl);
  console.log('   ✓ Smoke test PASS:', JSON.stringify(smoke));
} catch (err) {
  console.warn('   ⚠ Smoke test cảnh báo (kiểm tra lại kết nối mạng):', err.message);
}

const localIp = getLocalIp();

console.log('\n============================================================');
console.log('🎉 HỆ THỐNG ĐÃ SẴN SÀNG ĐỂ MỌI NGƯỜI TRUY CẬP (4G & WI-FI)!');
console.log('============================================================');
console.log(`📱 LINK CÔNG KHAI CHO MỌI NGƯỜI (DÙNG 4G HOẶC WI-FI):`);
console.log(`   👉 ${frontendUrl}`);
console.log('------------------------------------------------------------');
console.log(`🏠 Link nội bộ cùng Wi-Fi:`);
console.log(`   👉 http://${localIp}:8443`);
console.log('------------------------------------------------------------');
console.log('💡 HƯỚNG DẪN CÀI ĐẶT APP (PWA):');
console.log('   - Trên điện thoại mở link công khai HTTPS ở trên.');
console.log('   - Chrome: Nhấn menu (⋮) > Chọn "Cài đặt ứng dụng" / "Thêm vào MH chính".');
console.log('   - Safari: Nhấn nút Chia sẻ (Share) > Chọn "Thêm vào MH chính".');
console.log('   - App sẽ xuất hiện trên màn hình chính và mở như App native!');
console.log('------------------------------------------------------------');
console.log('🎮 CÁC TÍNH NĂNG ĐÃ KÍCH HOẠT ĐẦY ĐỦ:');
console.log('   [x] Hành trình học lịch sử 1954 (Visual Novel, Video, Quiz)');
console.log('   [x] Trợ lý AI Sửu Ca (Hỏi đáp kiến thức lịch sử qua Gemini)');
console.log('   [x] Đấu Trí Online 1v1 (Ghép ngẫu nhiên & Phòng bạn bè)');
console.log('   [x] Đồng bộ tài khoản, XP, Streak qua Supabase Cloud');
console.log('============================================================');
console.log('Nhấn Ctrl+C để dừng hệ thống.\n');

let isExiting = false;
async function cleanup() {
  if (isExiting) return;
  isExiting = true;
  console.log('\nĐang dừng các dịch vụ...');
  try { backendTunnel.proc.kill(); } catch {}
  try { frontendTunnel.proc.kill(); } catch {}
  try { await vite.close(); } catch {}
  try { await game.close(); } catch {}
  console.log('Đã dừng toàn bộ dịch vụ.');
  process.exit(0);
}

process.once('SIGINT', cleanup);
process.once('SIGTERM', cleanup);
