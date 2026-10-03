import { Card } from "../../../components/ui/Card";
import { theme } from "../../../theme/tokens";
import type { GameState } from "../../../types/dauTri";

export function BattlePlayers({ state, expanded = false }: { state: GameState; expanded?: boolean }) {
  const players = [{ name: state.player.username, score: state.myScore, icon: "🎓", own: true },
    { name: state.opponent?.username ?? "Đối thủ", score: state.opponentScore, icon: "🏛️", own: false }];
  return <Card className={`flex items-center gap-2 ${expanded ? "py-6" : "!p-3"}`}>
    {players.map((player, index) => <div key={index} className="contents">
      {index === 1 && <span className="flex shrink-0 items-center justify-center h-9 w-9 rounded-full font-bold text-xs" style={{ background: theme.colors.primary, color: theme.colors.primaryText }}>VS</span>}
      <div className={`flex-1 min-w-0 ${expanded ? "text-center space-y-2" : index === 1 ? "text-right" : ""}`}>
        <span className={expanded ? "text-4xl" : "text-xl"} aria-hidden="true">{player.icon}</span>
        <strong className="block truncate text-sm">{player.own ? "Bạn" : player.name}</strong>
        {expanded && <p className="text-xs truncate" style={{ color: theme.colors.textSecondary }}>{player.name}</p>}
        <p className="text-sm font-bold" style={{ color: player.own ? theme.colors.correct.text : theme.colors.textSecondary }}>{player.score} điểm</p>
      </div>
    </div>)}
  </Card>;
}
