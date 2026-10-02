import { useEffect, useState } from "react";
import { theme } from "../../theme/tokens";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { DauTriScreenProps } from "../../types/dauTri";
import { useSocketGame } from "./useSocketGame";
import { BattleLobby } from "./components/BattleLobby";
import { BattleQuestion } from "./components/BattleQuestion";
import { DauTriIcon } from "./components/DauTriIcon";

export default function DauTriScreen({ userId, playerName = "Người chơi", onNavigateTab, onMatchActiveChange }: DauTriScreenProps) {
  const game = useSocketGame({ initialPlayer: { userId, username: playerName } });
  const { state } = game;
  const [confirmExit, setConfirmExit] = useState(false);
  const active = ["matched", "countdown", "playing", "question_end"].includes(state.phase);
  const busy = !["idle", "result"].includes(state.phase);
  useEffect(() => { onMatchActiveChange?.(busy); return () => onMatchActiveChange?.(false); }, [busy, onMatchActiveChange]);
  useEffect(() => {
    if (!active) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [active]);
  const home = () => { game.goHome(); onNavigateTab?.("home"); };
  const result = state.gameOver;
  return <section className="p-4 space-y-4" aria-label="Đấu trí lịch sử" style={{ color: theme.colors.textPrimary }}>
    <header className="space-y-1">
      <h1 className="flex items-center gap-2 text-xl font-bold"><DauTriIcon aria-hidden="true" /> ĐẤU TRÍ LỊCH SỬ</h1>
      <p role="status" className="text-sm" style={{ color: state.connected ? theme.colors.correct.text : theme.colors.textSecondary }}>{state.connected ? "Đã kết nối máy chủ • PvP hai người" : "Chưa kết nối máy chủ"}</p>
    </header>
    {game.connectionMessage && <p role="status" className="text-sm">{game.connectionMessage}</p>}
    {state.error && <Card><p role="alert" className="text-sm">{state.error}</p><Button className="min-h-11 mt-2" onClick={game.retryConnection}>KẾT NỐI LẠI</Button></Card>}
    {state.phase === "idle" && <BattleLobby connected={state.connected} onFind={game.joinQueue} onCreate={game.createRoom} onJoin={game.joinRoom} />}
    {state.phase === "searching" && <Card><h2 className="font-bold">Đang chờ người chơi online…</h2><p className="text-sm my-3">Không tự ghép bot. Bạn có thể hủy hoặc rủ bạn bè vào cùng máy chủ.</p><Button className="min-h-11" variant="outline" onClick={game.cancelQueue}>HỦY TÌM TRẬN</Button></Card>}
    {state.phase === "waiting_room" && <Card><h2 className="font-bold">Phòng bạn bè</h2><p className="my-3">Gửi mã này cho người thứ hai:</p><p className="text-2xl font-bold tracking-widest" aria-label={`Mã phòng ${state.roomCode}`}>{state.roomCode}</p><p className="text-sm my-3">Phòng chờ có hiệu lực 5 phút. Hai thiết bị cần kết nối cùng máy chủ.</p><Button className="min-h-11" variant="outline" onClick={game.leaveRoom}>ĐÓNG PHÒNG</Button></Card>}
    {active && <>
      <Card><div className="flex justify-between gap-2 text-sm"><span>Bạn: <strong>{state.myScore}</strong></span><span>{state.opponent?.username}: <strong>{state.opponentScore}</strong></span></div>
        {!state.opponentConnected && <p role="status" className="text-sm mt-2">Đối thủ mất kết nối. Server chờ tối đa 30 giây để quay lại.</p>}
      </Card>
      {(state.phase === "matched" || state.phase === "countdown") && <p role="status">{state.phase === "matched" ? "Chờ hai người sẵn sàng…" : `Bắt đầu sau ${state.countdown}…`}</p>}
      {(state.phase === "playing" || state.phase === "question_end") && <BattleQuestion state={state} onAnswer={game.submitAnswer} />}
      <Button variant="outline" className="min-h-11" onClick={() => setConfirmExit(true)}>BỎ CUỘC</Button>
    </>}
    {result && state.phase === "result" && <Card>
      <h2 className="font-bold text-xl" role="status">{result.isDraw ? "HÒA" : result.isWin ? "BẠN THẮNG" : "BẠN THUA"}</h2>
      <p className="my-3">Điểm: {result.myScore} — {result.opponentScore}</p>
      <p className="text-sm">Đúng {result.players.player.correctCount}/{state.currentQuestion?.totalQuestions || 10} câu • Combo cao nhất {result.players.player.maxCombo}</p>
      <p className="text-sm my-3">EXP tính trong trận: {result.players.player.expChange}. Chưa ghi vào XP, xu hoặc rank tài khoản.</p>
      {result.forfeitedBy && <p className="text-sm mb-3">Trận kết thúc do bỏ cuộc hoặc mất kết nối quá hạn.</p>}
      <div className="flex gap-2"><Button className="min-h-11" onClick={game.playAgain} disabled={!state.connected}>TÌM TRẬN MỚI</Button><Button className="min-h-11" variant="outline" onClick={home}>VỀ TRANG CHỦ</Button></div>
    </Card>}
    {confirmExit && <Card role="alert" className="space-y-3"><p>Bỏ cuộc sẽ kết thúc trận và đối thủ thắng. Bạn muốn tiếp tục?</p><div className="flex gap-2"><Button className="min-h-11" onClick={() => { game.forfeit(); setConfirmExit(false); }}>XÁC NHẬN BỎ CUỘC</Button><Button className="min-h-11" variant="outline" onClick={() => setConfirmExit(false)}>Ở LẠI TRẬN</Button></div></Card>}
  </section>;
}
