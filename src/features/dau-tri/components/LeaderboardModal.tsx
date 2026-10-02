import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { theme } from "../../../theme/tokens";
import type { TrialStandings } from "../../../types/dauTri";
import { trialRank } from "../rankPresentation";
import { BattleModal } from "./BattleModal";

export function LeaderboardModal({ standings, connected, onRefresh, onClose }: { standings: TrialStandings | null; connected: boolean; onRefresh: () => void; onClose: () => void }) {
  const [findMe, setFindMe] = useState(false);
  const entries = findMe ? standings?.profile.matches ? [standings.profile] : [] : standings?.entries ?? [];
  return <BattleModal title="BẢNG XẾP HẠNG" onClose={onClose}>
    <p className="text-xs mb-3" style={{ color: theme.colors.textSecondary }}>Hạng thử nghiệm trong phiên máy chủ hiện tại. Chỉ gồm người đã đấu trận thật.</p>
    <div className="flex gap-2 mb-4"><Button variant={findMe ? "outline" : "primary"} onClick={() => setFindMe(false)}>Top 20</Button><Button variant={findMe ? "primary" : "outline"} onClick={() => setFindMe(true)}>Tìm tôi</Button></div>
    {!connected ? <p role="status">Chưa kết nối máy chủ. Hãy kết nối để tải bảng hạng.</p> : !standings ? <p role="status">Đang tải bảng hạng…</p> : !entries.length ? <p role="status">{findMe ? "Bạn chưa hoàn thành trận đấu nào." : "Chưa có trận hoàn thành. Hãy là người đầu tiên so tài!"}</p> :
      <ol className="space-y-2" aria-label="Người chơi đã thi đấu">{entries.map(entry => <li key={entry.userId} className="flex items-center gap-3 p-3 rounded-lg text-sm" style={{ background: entry.userId === standings?.profile.userId ? theme.colors.primarySoft : theme.colors.appBg }}>
        <strong>#{entry.position}</strong><div className="flex-1 min-w-0"><strong className="block truncate">{entry.username}</strong><span className="text-xs">{trialRank(entry.rp).name} • {entry.matches} trận</span></div><strong>{entry.rp} RP</strong>
      </li>)}</ol>}
    <Button variant="outline" className="w-full mt-4" onClick={onRefresh}>{connected ? "LÀM MỚI" : "KẾT NỐI LẠI"}</Button>
  </BattleModal>;
}
