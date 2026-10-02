export type TrialPlayer = { userId: string; username: string };
const key = "suchill.dautri.trial-player";

export function loadTrialPlayer(): TrialPlayer | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || "null");
    if (typeof value?.userId === "string" && typeof value.username === "string" && value.username.trim()) return value;
  } catch { /* storage can be unavailable */ }
  return null;
}
export function saveTrialPlayer(name: string): TrialPlayer {
  const username = name.trim().slice(0, 30);
  if (!username) throw new Error("Nhập tên để vào trường đấu.");
  const previous = loadTrialPlayer();
  const player = previous?.username === username ? previous : { userId: crypto.randomUUID(), username };
  try { sessionStorage.setItem(key, JSON.stringify(player)); } catch { /* current play still works */ }
  return player;
}
