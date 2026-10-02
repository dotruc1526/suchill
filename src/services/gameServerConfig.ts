export function resolveGameServerUrl(configured: string | undefined, location: { protocol: string; hostname: string }) {
  if (configured?.trim()) {
    const url = new URL(configured.trim());
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("URL máy chủ không hợp lệ.");
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("Địa chỉ máy chủ cần là origin, không chứa đường dẫn hoặc thông tin đăng nhập.");
    if (location.protocol === "https:" && url.protocol !== "https:") throw new Error("Máy chủ Đấu Trí cần HTTPS.");
    return url.origin;
  }
  if (["localhost", "127.0.0.1"].includes(location.hostname)) return "http://localhost:3001";
  if (location.protocol === 'http:' && /^(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)$/.test(location.hostname)) return `http://${location.hostname}:3001`;
  throw new Error("Chưa cấu hình địa chỉ máy chủ Đấu Trí (VITE_GAME_SERVER_URL).");
}
