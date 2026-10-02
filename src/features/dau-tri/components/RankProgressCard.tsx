import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { theme } from "../../../theme/tokens";
import type { TrialProfile } from "../../../types/dauTri";
import { trialRank } from "../rankPresentation";

export function RankProgressCard({ profile, playerName, onLeaderboard }: { profile?: TrialProfile; playerName: string; onLeaderboard: () => void }) {
  const rank = profile ? trialRank(profile.rp) : null;
  return <Card className="space-y-3 !p-3" style={{ border: `1px solid ${theme.colors.borderMedium}`, borderRadius: theme.radius.md }}>
    <div className="text-center space-y-1"><span aria-hidden="true" className="text-4xl">🥉</span>
      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>{playerName}</p>
      <h2 className="text-lg font-bold">{rank?.name ?? "Sẵn sàng so tài"}</h2><p className="text-sm">{profile ? `${profile.rp.toLocaleString("vi-VN")} RP` : "Kết nối để xem hạng"}</p>
    </div>
    <div className="h-3 rounded-full overflow-hidden" role="progressbar" aria-label="Tiến độ hạng thử nghiệm" aria-valuemin={0} aria-valuemax={100} aria-valuenow={rank?.progress ?? 0} style={{ background: theme.colors.progressTrack }}>
      <div className="h-full rounded-full" style={{ width: `${rank?.progress ?? 0}%`, background: theme.colors.primary }} />
    </div>
    <p className="text-xs text-center" style={{ color: theme.colors.textSecondary }}>{rank ? rank.remaining ? `Còn ${rank.remaining} RP để thăng ${rank.next}` : "Tiếp tục tích lũy điểm" : "Hạng được cập nhật sau mỗi trận đấu"}</p>
    <div className="grid grid-cols-3 text-center text-xs" style={{ color: theme.colors.textSecondary }}>
      {[[profile ? `${profile.matches ? Math.round(profile.wins / profile.matches * 100) : 0}%` : "—", "Tỉ lệ thắng"], [profile?.matches ?? "—", "Trận đấu"], [profile?.streak ?? "—", "Chuỗi thắng"]].map(([value, label]) => <div key={label}><strong className="block text-sm" style={{ color: theme.colors.textPrimary }}>{value}</strong><span>{label}</span></div>)}
    </div>
    <Button variant="outline" className="w-full" onClick={onLeaderboard}>🏆 Bảng Xếp Hạng</Button>
    <p className="text-xs text-center" style={{ color: theme.colors.textMuted }}>Hạng thử nghiệm • Tính từ trận đấu thật</p>
  </Card>;
}
