import { createRoot } from "react-dom/client";
import { useState } from "react";
import DauTriScreen from "../DauTriScreen";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { theme } from "../../../theme/tokens";
import { loadTrialPlayer, saveTrialPlayer, type TrialPlayer } from "../../../services/trialPlayerService";
import "../../../index.css";

function TrialApp() {
  const [player, setPlayer] = useState<TrialPlayer | null>(loadTrialPlayer);
  const [name, setName] = useState(""), [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return <main className="min-h-dvh p-3 sm:p-6" style={{ background: theme.colors.pageBg, color: theme.colors.textPrimary }}>
    <div className="mx-auto w-full max-w-[430px] min-h-[calc(100dvh-1.5rem)] rounded-xl overflow-hidden" style={{ background: theme.colors.appBg }}>
      <header className="flex items-center justify-between gap-3 p-3 text-xs border-b" style={{ borderColor: theme.colors.borderMedium }}>
        <strong>Sử Chill • Bản thử online</strong>
        {player && <Button variant="outline" size="sm" disabled={busy} onClick={() => { setName(player.username); setPlayer(null); }}>Đổi tên</Button>}
      </header>
      {player ? <DauTriScreen key={player.userId} userId={player.userId} playerName={player.username} serverOrigin={window.location.origin}
        onMatchActiveChange={setBusy} onNavigateTab={() => { setName(player.username); setPlayer(null); }} /> :
        <div className="p-4 space-y-4"><div className="text-center space-y-3 py-6"><span className="text-5xl" aria-hidden="true">⚔️</span><h1 className="text-2xl font-bold">TRƯỜNG ĐẤU SỬ HỌC</h1><p className="text-sm">Rủ bạn cùng so tài hoặc tìm đối thủ ngẫu nhiên.</p></div>
          <Card><form className="space-y-3" onSubmit={event => { event.preventDefault(); try { setPlayer(saveTrialPlayer(name)); setError(""); } catch (cause) { setError((cause as Error).message); } }}>
            <label htmlFor="trial-name" className="text-sm font-bold">Tên hiển thị của bạn</label>
            <input id="trial-name" value={name} autoComplete="nickname" maxLength={30} onChange={event => { setName(event.target.value); setError(""); }}
              className="w-full min-h-11 rounded-lg p-3 text-sm" style={{ background: theme.colors.appBg, border: `1px solid ${theme.colors.borderMedium}` }} placeholder="Nhập tên hoặc biệt danh"/>
            {error && <p role="alert" className="text-sm" style={{ color: theme.colors.incorrect.text }}>{error}</p>}
            <Button type="submit" className="w-full">VÀO TRƯỜNG ĐẤU</Button>
          </form></Card>
          <p className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>Hai người mở cùng link này, nhập tên riêng và bấm tìm đối thủ. Bạn bè có thể vào bằng mã phòng. Wi-Fi và mạng di động khác nhau vẫn đấu được.</p>
          <p className="text-xs" style={{ color: theme.colors.textMuted }}>Bản thử dùng câu hỏi có sẵn. Điểm và hạng thử nghiệm chưa ghi vào hồ sơ học tập. Máy chủ khởi động lại có thể mất trận và thống kê.</p>
        </div>}
    </div>
  </main>;
}
createRoot(document.getElementById("root")!).render(<TrialApp />);
