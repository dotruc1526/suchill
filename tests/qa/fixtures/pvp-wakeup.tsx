import { createRoot } from "react-dom/client";
import DauTriScreen from "../../../src/features/dau-tri/DauTriScreen";
import "../../../src/index.css";

declare global { interface Window { pvpAwake: boolean; pvpSessions: number } }
window.pvpAwake = false; window.pvpSessions = 0;
const original = window.fetch.bind(window);
window.fetch = (input, init) => {
  const url = String(input);
  if (url.endsWith("/health") && !window.pvpAwake) return Promise.resolve(new Response("{}", { status: 503 }));
  if (url.endsWith("/session")) window.pvpSessions++;
  return original(input, init);
};
createRoot(document.getElementById("root")!).render(<DauTriScreen userId="wakeup" playerName="Người chờ" />);
