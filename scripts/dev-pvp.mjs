import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import { createGameServer } from "../server/server.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const origins = ["http://localhost:8450", "http://127.0.0.1:8450"];
const game = createGameServer({ origins });
let vite;
try {
  await new Promise((resolve, reject) => {
    game.httpServer.once("error", reject);
    game.httpServer.listen(0, "127.0.0.1", resolve);
  });
  const backend = `http://127.0.0.1:${game.httpServer.address().port}`;
  vite = await createServer({ root, cacheDir: "node_modules/.vite-pvp-preview", optimizeDeps: { entries: ["index.html"] }, define: { "import.meta.env.VITE_GAME_SERVER_URL": JSON.stringify(backend) },
    server: { port: 8450, host: "127.0.0.1", strictPort: true } });
  await vite.listen();
  console.log("PvP LOCAL preview: http://127.0.0.1:8450 — open two tabs to match real players.");
  console.log("This preview is local. Internet play requires the public backend deployment.");
} catch (error) {
  await vite?.close(); await game.close(); throw error;
}
let closing = false;
async function close() {
  if (closing) return; closing = true;
  await vite.close(); await game.close(); process.exit(0);
}
process.once("SIGINT", close); process.once("SIGTERM", close);
