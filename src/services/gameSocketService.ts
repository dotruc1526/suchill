import { io } from "socket.io-client";
import { resolveGameServerUrl } from "./gameServerConfig";
import { waitForGameServer } from "./gameServerReadiness";

export interface GameCredentials { token: string; player: { userId: string; username: string; exp: number; level: number; expiresAt: number } }
export interface GameConnectionOptions {
  username: string; scope: string; signal: AbortSignal;
  credentials?: GameCredentials;
  onStatus?: (message: string) => void;
}

export function gameServerUrl() {
  return resolveGameServerUrl(import.meta.env.VITE_GAME_SERVER_URL, window.location);
}

export async function openGameConnection(options: GameConnectionOptions) {
  const url = gameServerUrl();
  await waitForGameServer(url, { signal: options.signal, onStatus: options.onStatus });
  const key = `suchill.dautri.session:${url}:${options.scope}`;
  let credential = options.credentials;
  if (!credential) {
    try { credential = JSON.parse(sessionStorage.getItem(key) || "null") as GameCredentials | undefined; } catch { /* unavailable storage */ }
    if (!credential?.token || !credential.player || !Number.isFinite(credential.player.expiresAt) || credential.player.expiresAt <= Date.now()) {
      const response = await fetch(`${url}/session`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: options.username }), signal: options.signal, cache: "no-store", credentials: "omit",
      });
      if (!response.ok) throw new Error("Không thể cấp phiên chơi. Hãy thử lại sau.");
      credential = await response.json() as GameCredentials;
      try { sessionStorage.setItem(key, JSON.stringify(credential)); } catch { /* connection still usable */ }
    }
  }
  options.signal.throwIfAborted();
  const socket = io(url, { auth: { token: credential.token }, forceNew: true, autoConnect: false, timeout: 10000, reconnectionAttempts: 10, reconnectionDelay: 1000 });
  return {
    socket, player: credential.player,
    forget: () => { try { sessionStorage.removeItem(key); } catch { /* optional storage */ } },
  };
}
