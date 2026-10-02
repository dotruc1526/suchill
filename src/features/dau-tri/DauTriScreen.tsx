import { useEffect, useState } from "react";
import { theme } from "../../theme/tokens";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { DauTriScreenProps } from "../../types/dauTri";
import { useSocketGame } from "./useSocketGame";
import { BattleLobby } from "./components/BattleLobby";
import { BattleQuestion } from "./components/BattleQuestion";
import { DauTriIcon } from "./components/DauTriIcon";
import { BattleRules } from "./components/BattleRules";
import { LeaderboardModal } from "./components/LeaderboardModal";
import { BattlePlayers } from "./components/BattlePlayers";
import { BattleResult } from "./components/BattleResult";
import { BattleModal } from "./components/BattleModal";

export default function DauTriScreen({ userId, playerName = "Người chơi", onNavigateTab, onMatchActiveChange }: DauTriScreenProps) {
  const game = useSocketGame({ initialPlayer: { userId, username: playerName } });
  const { state } = game;
  const [confirmExit, setConfirmExit] = useState(false);
  const [showRules, setShowRules] = useState(false), [showLeaderboard, setShowLeaderboard] = useState(false);
  const active = ["matched", "countdown", "playing", "question_end"].includes(state.phase);
  const busy = game.pendingAction || !["idle", "result"].includes(state.phase);
  useEffect(() => { onMatchActiveChange?.(busy); return () => onMatchActiveChange?.(false); }, [busy, onMatchActiveChange]);
  useEffect(() => {
    if (!active) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [active]);
  const home = () => { game.goHome(); onNavigateTab?.("home"); };
  const leaderboard = () => { setShowLeaderboard(true); game.refreshStandings(); };
  return <section className="p-4 space-y-4" aria-label="Đấu trí lịch sử" style={{ color: theme.colors.textPrimary }}>
    <header className="space-y-2 text-center">
      <div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold" style={{ background: theme.colors.primarySoft, color: theme.colors.primary }}><DauTriIcon aria-hidden="true" /> Đấu Trí 1v1 Realtime</span><Button variant="outline" size="sm" onClick={() => setShowRules(true)}>📜 Luật thi đấu</Button></div>
      <h1 className="text-2xl font-bold">TRƯỜNG ĐẤU SỬ HỌC</h1>
      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>So tài kiến thức lịch sử • Cùng học, cùng thi đấu</p>
      <p role="status" className="text-xs" style={{ color: state.connected ? theme.colors.correct.text : theme.colors.textSecondary }}>{state.connected ? "Đã kết nối máy chủ • PvP hai người" : game.connecting ? "Đang kết nối máy chủ…" : "Chưa kết nối máy chủ"}</p>
    </header>
    {game.connectionMessage && <p role="status" className="text-sm">{game.connectionMessage}</p>}
    {state.error && <Card><p role="alert" className="text-sm">{state.error}</p><Button className="min-h-11 mt-2" onClick={game.retryConnection}>KẾT NỐI LẠI</Button></Card>}
    {game.pendingAction && <Card className="text-center space-y-3"><p role="status">Đang kết nối để vào trường đấu…</p><Button variant="outline" className="w-full" onClick={game.cancelPending}>HỦY KẾT NỐI</Button></Card>}
    {state.phase === "idle" && <BattleLobby pending={game.pendingAction} playerName={playerName} profile={game.standings?.profile} onFind={game.joinQueue} onCreate={game.createRoom} onJoin={game.joinRoom} onLeaderboard={leaderboard} />}
    {state.phase === "searching" && <Card className="text-center space-y-5 py-8">
      <div className="mx-auto flex items-center justify-center rounded-full w-24 h-24 border-2 border-dashed" style={{ borderColor: theme.colors.primary }}><DauTriIcon width={40} height={40} aria-hidden="true" /></div>
      <h2 className="font-bold text-xl">Đang chờ người chơi online…</h2><p className="text-sm">Đang tìm đối thủ ngẫu nhiên cùng so tài. Bạn có thể rủ một người khác mở ứng dụng và tìm trận.</p>
      <p className="text-xs" style={{ color: theme.colors.textMuted }}>Chưa có đối thủ thì tiếp tục chờ. Hai bạn có thể dùng mạng khác nhau.</p>
      <Button className="w-full" variant="outline" onClick={game.cancelQueue}>HỦY TÌM TRẬN</Button></Card>}
    {state.phase === "waiting_room" && <Card><h2 className="font-bold">Phòng bạn bè</h2><p className="my-3">Gửi mã này cho người thứ hai:</p><p className="text-2xl font-bold tracking-widest" aria-label={`Mã phòng ${state.roomCode}`}>{state.roomCode}</p><p className="text-sm my-3">Phòng chờ có hiệu lực 5 phút. Hai thiết bị cần kết nối cùng máy chủ.</p><Button className="min-h-11" variant="outline" onClick={game.leaveRoom}>ĐÓNG PHÒNG</Button></Card>}
    {active && <>
      <BattlePlayers state={state} expanded={state.phase === "matched" || state.phase === "countdown"} />
      {!state.opponentConnected && <p role="status" className="text-sm">Đối thủ mất kết nối. Chờ tối đa 30 giây để quay lại.</p>}
      {(state.phase === "matched" || state.phase === "countdown") && <div className="text-center py-6 space-y-3"><h2 className="font-bold">ĐÃ TÌM THẤY ĐỐI THỦ!</h2><p role="status" className="text-xl" style={{ color: theme.colors.primary }}>{state.phase === "matched" ? "Chờ hai người sẵn sàng…" : `Bắt đầu sau ${state.countdown}…`}</p></div>}
      {(state.phase === "playing" || state.phase === "question_end") && <BattleQuestion state={state} onAnswer={game.submitAnswer} />}
      <Button variant="outline" className="min-h-11" onClick={() => setConfirmExit(true)}>BỎ CUỘC</Button>
    </>}
    {state.phase === "result" && <BattleResult state={state} pending={game.pendingAction} onAgain={game.playAgain} onHome={home} onLeaderboard={leaderboard} />}
    {confirmExit && <BattleModal title="Xác nhận đầu hàng?" onClose={() => setConfirmExit(false)}><p className="text-sm mb-4">Bỏ cuộc sẽ kết thúc trận và đối thủ thắng.</p><div className="flex gap-2"><Button onClick={() => { game.forfeit(); setConfirmExit(false); }}>XÁC NHẬN BỎ CUỘC</Button><Button variant="outline" onClick={() => setConfirmExit(false)}>Ở LẠI TRẬN</Button></div></BattleModal>}
    {showRules && <BattleRules onClose={() => setShowRules(false)} />}
    {showLeaderboard && <LeaderboardModal standings={game.standings} connected={state.connected} onRefresh={game.refreshStandings} onClose={() => setShowLeaderboard(false)} />}
  </section>;
}
