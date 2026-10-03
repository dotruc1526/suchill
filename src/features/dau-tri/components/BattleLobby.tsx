import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { theme } from "../../../theme/tokens";
import type { TrialProfile } from "../../../types/dauTri";
import { RankProgressCard } from "./RankProgressCard";

export function BattleLobby({ pending, playerName, profile, onFind, onCreate, onJoin, onLeaderboard }: {
  pending: boolean; playerName: string; profile?: TrialProfile;
  onFind: () => void; onCreate: () => void; onJoin: (code: string) => void; onLeaderboard: () => void;
}) {
  const [code, setCode] = useState(""), [invalid, setInvalid] = useState(false);
  return <div className="space-y-4">
    <RankProgressCard profile={profile} playerName={playerName} onLeaderboard={onLeaderboard} />
    <Card className="space-y-3 text-center" accentColor={theme.colors.primary} accentPosition="top">
      <h2 className="font-bold">⚔️ Sẵn sàng vào trường đấu?</h2>
      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>10 câu hỏi • 15 giây/câu • Hai người chơi thật</p>
      <Button className="w-full" size="lg" disabled={pending} onClick={onFind}>TÌM ĐỐI THỦ ONLINE</Button>
      <p className="text-xs" style={{ color: theme.colors.textMuted }}>Ghép ngẫu nhiên. Khác Wi-Fi hay mạng di động vẫn có thể cùng đấu.</p>
    </Card>
    <Card className="space-y-3">
      <h2 className="font-bold text-sm">🤝 Đấu cùng bạn bè</h2>
      <Button className="w-full" variant="outline" disabled={pending} onClick={onCreate}>TẠO PHÒNG</Button>
      <form className="space-y-2" onSubmit={event => { event.preventDefault(); const valid = /^[A-F0-9]{6}$/.test(code.trim()); setInvalid(!valid); if (valid) onJoin(code.trim()); }}>
        <label htmlFor="battle-room-code" className="text-xs">Nhập mã phòng 6 ký tự của bạn bè</label>
        <div className="flex gap-2"><input id="battle-room-code" aria-invalid={invalid} aria-describedby={invalid ? "battle-code-error" : undefined} autoComplete="off" maxLength={6} placeholder="VD: A1B2C3" value={code}
          onChange={event => { setCode(event.target.value.toUpperCase()); setInvalid(false); }}
          className="flex-1 min-w-0 min-h-11 rounded-lg px-3 text-sm tracking-widest" style={{ background: theme.colors.appBg, color: theme.colors.textPrimary, border: `1px solid ${invalid ? theme.colors.incorrect.border : theme.colors.borderMedium}` }} />
          <Button type="submit" disabled={pending}>VÀO PHÒNG</Button></div>
        {invalid && <p id="battle-code-error" role="alert" className="text-xs" style={{ color: theme.colors.incorrect.text }}>Mã phòng gồm 6 ký tự A–F và 0–9. Hãy kiểm tra mã bạn nhận được.</p>}
      </form>
    </Card>
  </div>;
}
