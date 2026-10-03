import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { theme } from "../../../theme/tokens";
import type { GameState } from "../../../types/dauTri";

export function BattleResult({ state, pending, onAgain, onHome, onLeaderboard }: { state: GameState; pending: boolean; onAgain: () => void; onHome: () => void; onLeaderboard: () => void }) {
  const result = state.gameOver;
  if (!result) return null;
  const mine = result.players.player;
  return <div className="space-y-4">
    <div className="text-center space-y-2 py-3"><span aria-hidden="true" className="text-5xl">{result.isDraw ? "🤝" : result.isWin ? "🏆" : "📜"}</span>
      <h2 role="status" className="text-2xl font-bold" style={{ color: theme.colors.primary }}>{result.isDraw ? "HÒA" : result.isWin ? "BẠN THẮNG" : "BẠN THUA"}</h2>
      <p className="text-sm">{result.isWin ? "Kiến thức của bạn đã tỏa sáng!" : result.isDraw ? "Hai học giả ngang tài ngang sức." : "Mỗi trận đấu là một lần học thêm."}</p>
    </div>
    <Card className="text-center space-y-4">
      <div className="grid grid-cols-2 gap-3"><div><p className="text-sm">Bạn</p><strong className="text-3xl" style={{ color: theme.colors.primary }}>{result.myScore}</strong></div><div><p className="text-sm truncate">{state.opponent?.username ?? "Đối thủ"}</p><strong className="text-3xl">{result.opponentScore}</strong></div></div>
      <div className="grid grid-cols-2 gap-2 text-sm"><p>Đúng <strong>{mine.correctCount}/{state.currentQuestion?.totalQuestions || 10}</strong> câu</p><p>Combo cao nhất <strong>×{mine.maxCombo}</strong></p></div>
      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>EXP tính trong trận: {mine.expChange}. Chưa ghi vào XP, xu hoặc rank tài khoản.</p>
      {result.forfeitedBy && <p className="text-sm">Trận kết thúc do bỏ cuộc hoặc mất kết nối quá hạn.</p>}
    </Card>
    <Button className="w-full" size="lg" disabled={pending} onClick={onAgain}>TÌM TRẬN MỚI</Button>
    <div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={onLeaderboard}>BẢNG XẾP HẠNG</Button><Button variant="outline" onClick={onHome}>VỀ TRANG CHỦ</Button></div>
  </div>;
}
