import { useState } from 'react';
import { useSocketGame } from './useSocketGame';

interface DauTriScreenProps {
  onNavigateTab?: (tab: 'home' | 'practice' | 'dautri' | 'ai' | 'profile') => void;
  userId?: string;
  xp?: number;
  streak?: number;
  playerName?: string;
  pvpMatches?: number;
  pvpWins?: number;
  pvpStreak?: number;
  onMatchFinished?: (isWin: boolean, expEarned: number, coinsEarned: number) => void;
  onAddXP?: (amount: number) => void;
}

export default function DauTriScreen({
  onNavigateTab,
  userId,
  xp = 0,
  streak = 0,
  playerName = 'Người Khám Phá',
  pvpMatches = 0,
  pvpWins = 0,
  pvpStreak = 0,
  onMatchFinished,
  onAddXP,
}: DauTriScreenProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const userLevel = Math.max(0, Math.floor(xp / 100));
  const nextLevelXP = (userLevel + 1) * 100;
  const currentLevelProgress = xp % 100;
  const winRate = pvpMatches > 0 ? Math.round((pvpWins / pvpMatches) * 100) : 0;

  const { state, joinQueue, cancelQueue, submitAnswer, playAgain, goHome } = useSocketGame({
    initialPlayer: {
      oderId: userId,
      username: playerName,
      exp: xp,
      level: userLevel,
    },
    onGameOver: (data) => {
      const myResult = data.players?.player;
      if (myResult) {
        const isWin = data.winner === 'player';
        const expChange = myResult.expChange ?? (isWin ? 50 : -20);
        const coins = myResult.coinsEarned ?? (isWin ? 100 : 30);
        if (onMatchFinished) {
          onMatchFinished(isWin, expChange, coins);
        } else if (onAddXP && expChange > 0) {
          onAddXP(expChange);
        }
      }
    },
  });

  const handleGoHome = () => {
    goHome();
    if (onNavigateTab) {
      onNavigateTab('home');
    }
  };

  const handleForfeit = () => {
    setShowExitConfirm(false);
    goHome();
  };

  /* ── 1. Phase: IDLE (Lobby) ── */
  const renderIdle = () => (
    <div className="p-4 space-y-4">
      {/* Title & Banner */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1A1A]/10 border border-[#8B1A1A]/20 text-[#8B1A1A] font-sans font-bold text-xs uppercase tracking-wider mb-2">
          ⚔️ Đấu Trí 1v1 Realtime
        </div>
        <h1 className="text-2xl font-serif text-[#3D1A00] font-bold">TRƯỜNG ĐẤU SỬ HỌC</h1>
        <p className="text-[#7A4020] font-sans text-xs mt-1">
          So tài kiến thức lịch sử • Cạnh tranh leo rank thời gian thực
        </p>
      </div>

      {/* Player Profile Card */}
      <div className="paper-card rounded-xl p-4 border border-[#C8A882] shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#C4341A] flex items-center justify-center text-2xl shadow-md border-2 border-white/50 shrink-0">
            🎓
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#7A4020] bg-[#E8D5BA] px-2 py-0.5 rounded-full uppercase">
                Cấp {userLevel}
              </span>
              <span className="text-[11px] font-hand font-bold text-[#C4341A]">
                {userLevel === 0 ? 'Tân Thủ Nhập Môn' : userLevel < 5 ? 'Sử Gia Tập Sự' : 'Đại Sử Gia'}
              </span>
            </div>
            <div className="text-base font-serif font-bold text-[#2A1500] truncate mt-0.5">
              {playerName}
            </div>
            <div className="flex items-center justify-between text-xs text-[#7A4020] mt-1 font-sans">
              <span>{xp} EXP</span>
              <span>Mục tiêu: {nextLevelXP} EXP</span>
            </div>
            <div className="w-full bg-[#E8D5BA] h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#3A5A2A] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentLevelProgress / 100) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="paper-card rounded-xl p-3 text-center">
          <div className="text-lg font-serif font-bold text-[#2A1500]">{winRate}%</div>
          <div className="text-[10px] font-sans text-[#7A4020] uppercase font-semibold">Tỉ lệ thắng</div>
        </div>
        <div className="paper-card rounded-xl p-3 text-center">
          <div className="text-lg font-serif font-bold text-[#2A1500]">{pvpMatches}</div>
          <div className="text-[10px] font-sans text-[#7A4020] uppercase font-semibold">Trận đấu</div>
        </div>
        <div className="paper-card rounded-xl p-3 text-center">
          <div className="text-lg font-serif font-bold text-[#C4341A]">🔥 {pvpStreak}</div>
          <div className="text-[10px] font-sans text-[#7A4020] uppercase font-semibold">Chuỗi thắng</div>
        </div>
      </div>

      {/* Match Info & Rules Card */}
      <div className="paper-card rounded-xl p-3.5 space-y-2 border border-[#C8A882]/60">
        <div className="font-serif font-bold text-xs text-[#3D1A00] flex items-center gap-1.5 border-b border-[#C8A882]/30 pb-1.5">
          <span>📜</span> LUẬT THI ĐẤU & CỘNG THƯỞNG EXP
        </div>
        <div className="space-y-1.5 text-xs text-[#7A4020] font-sans leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-[#8B1A1A] font-bold">🎖️</span>
            <span>Chuyên đề <strong>10 câu hỏi Kháng chiến chống Mỹ (1954 - 1975)</strong>, đếm ngược <strong>15 giây/câu</strong>.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#3A5A2A] font-bold">⭐</span>
            <span>Mỗi câu trả lời đúng được cộng ngay <strong>+20 EXP</strong>.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#C4341A] font-bold">🔥</span>
            <span>Đạt <strong>chuỗi đúng liên tục từ 5 câu trở lên</strong>: Nhận siêu thưởng <strong>+40 EXP</strong> cho mỗi câu thắng tiếp theo!</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#8B1A1A] font-bold">🏆</span>
            <span>Toàn bộ EXP tích lũy trong trận sẽ cộng trực tiếp vào cấp độ và hồ sơ nhân vật của bạn.</span>
          </div>
        </div>
      </div>

      {/* Find Match Button */}
      <button
        onClick={joinQueue}
        className="w-full py-3.5 rounded-xl font-serif text-lg font-bold text-[#FBF4E8] shadow-lg active:scale-95 transition-all bg-gradient-to-r from-[#8B1A1A] to-[#C4341A] hover:shadow-xl hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>⚔️</span>
        <span>TÌM TRẬN ĐẤU (1V1)</span>
      </button>

      {/* Leaderboard Teaser */}
      <div className="paper-card rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#3D1A00]">
          <span>🏆 BẢNG PHONG THẦN TUẦN NÀY</span>
          <span className="text-[10px] font-sans text-[#7A4020] font-normal">Cập nhật mỗi 24h</span>
        </div>
        <div className="space-y-1.5 text-xs font-sans">
          <div className="flex items-center justify-between py-1 border-b border-[#C8A882]/20">
            <div className="flex items-center gap-2">
              <span className="w-5 text-center font-bold text-yellow-600">🥇</span>
              <span className="font-semibold text-[#2A1500]">Học Giả Phố Cổ</span>
            </div>
            <span className="font-bold text-[#7A4020]">3,450 EXP</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#C8A882]/20">
            <div className="flex items-center gap-2">
              <span className="w-5 text-center font-bold text-gray-500">🥈</span>
              <span className="font-semibold text-[#2A1500]">Sử Gia Thăng Long</span>
            </div>
            <span className="font-bold text-[#7A4020]">3,120 EXP</span>
          </div>
          <div className="flex items-center justify-between py-1 bg-[#8B1A1A]/5 rounded px-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 text-center font-bold text-amber-700">
                {xp >= 3450 ? '🥇' : xp >= 3120 ? '🥈' : xp >= 1500 ? '🥉' : '🎖️'}
              </span>
              <span className="font-bold text-[#8B1A1A]">
                Bạn ({xp >= 3450 ? 'Hạng 1' : xp >= 3120 ? 'Hạng 2' : xp >= 1500 ? 'Hạng 3' : 'Hạng 4'})
              </span>
            </div>
            <span className="font-bold text-[#8B1A1A]">{xp} EXP</span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── 2. Phase: SEARCHING ── */
  const renderSearching = () => (
    <div className="flex flex-col items-center justify-center min-h-[460px] p-6 space-y-6 text-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-dashed border-[#8B1A1A] rounded-full animate-spin opacity-50" />
        <div className="absolute inset-2 border-4 border-dotted border-[#7A4020] rounded-full animate-[spin_4s_linear_infinite_reverse] opacity-60" />
        <div className="text-4xl animate-pulse">⚔️</div>
      </div>

      <div className="space-y-1.5">
        <div className="text-xl font-serif font-bold text-[#2A1500]">Đang tìm đối thủ...</div>
        <p className="text-xs font-sans text-[#7A4020]">
          Hệ thống đang ghép cặp người chơi có thứ hạng tương đương
        </p>
        <p className="text-[11px] font-hand text-[#C4341A]">
          Tự động ghép Bot sau 10s nếu không tìm thấy người chơi
        </p>
      </div>

      <button
        onClick={cancelQueue}
        className="px-8 py-2.5 rounded-xl font-serif text-sm font-bold text-[#7A4020] bg-transparent border-2 border-[#7A4020] active:scale-95 transition-all hover:bg-[#7A4020]/10 cursor-pointer"
      >
        ✕ HỦY TÌM KIẾM
      </button>
    </div>
  );

  /* ── 3. Phase: MATCHED & COUNTDOWN ── */
  const renderMatched = () => (
    <div className="flex flex-col items-center justify-center min-h-[460px] p-4 space-y-8">
      <div className="font-serif font-bold text-sm uppercase tracking-widest text-[#8B1A1A] animate-pulse">
        ĐÃ TÌM THẤY ĐỐI THỦ!
      </div>

      <div className="flex w-full items-center justify-between gap-2 max-w-sm">
        {/* Player 1 */}
        <div className="flex-1 paper-card rounded-xl p-4 flex flex-col items-center shadow-md">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#C4341A] flex items-center justify-center text-2xl mb-2 shadow-md">
            🎓
          </div>
          <span className="text-[10px] font-bold text-[#7A4020] uppercase bg-[#E8D5BA] px-2 py-0.5 rounded-full mb-1">
            Cấp {state.player?.level}
          </span>
          <div className="text-xs font-serif font-bold text-[#2A1500] text-center line-clamp-1">
            {state.player?.username}
          </div>
          <div className="text-[10px] font-sans text-[#7A4020]">{state.player?.exp} EXP</div>
        </div>

        {/* Center VS Badge */}
        <div className="w-12 h-12 rounded-full bg-[#8B1A1A] flex items-center justify-center text-sm font-serif font-bold text-white shadow-xl border-2 border-[#F5E6D0] shrink-0 animate-bounce">
          VS
        </div>

        {/* Player 2 */}
        <div className="flex-1 paper-card rounded-xl p-4 flex flex-col items-center shadow-md">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7A4020] to-[#A0622A] flex items-center justify-center text-2xl mb-2 shadow-md">
            🏛️
          </div>
          <span className="text-[10px] font-bold text-[#7A4020] uppercase bg-[#E8D5BA] px-2 py-0.5 rounded-full mb-1">
            Cấp {state.opponent?.level || 16}
          </span>
          <div className="text-xs font-serif font-bold text-[#2A1500] text-center line-clamp-1">
            {state.opponent?.username || 'Học Giả Phố Cổ'}
          </div>
          <div className="text-[10px] font-sans text-[#7A4020]">{state.opponent?.exp || 1280} EXP</div>
        </div>
      </div>

      {state.phase === 'countdown' && (
        <div className="flex flex-col items-center">
          <div className="text-6xl font-serif font-bold text-[#8B1A1A] animate-ping">
            {state.countdown || 3}
          </div>
          <span className="text-xs font-hand text-[#7A4020] mt-2">Trận đấu bắt đầu sau giây lát...</span>
        </div>
      )}
    </div>
  );

  /* ── 4. Phase: PLAYING ── */
  const renderPlaying = () => {
    const q = state.currentQuestion;
    if (!q) return null;

    const timePercent = (state.timeLeft / q.timeLimit) * 100;
    const timeColor =
      state.timeLeft > 10
        ? 'bg-[#3A5A2A]'
        : state.timeLeft > 5
        ? 'bg-[#D4A017]'
        : 'bg-[#C4341A]';
    const isEndPhase = state.phase === 'question_end' || state.answerResult !== null;

    return (
      <div className="p-3 space-y-3">
        {/* Match Header Bar */}
        <div className="flex items-center justify-between bg-[#E8D5BA] px-3 py-1.5 rounded-lg border border-[#C8A882]/50 text-xs font-sans">
          <div className="flex items-center gap-3 font-serif font-bold text-[#2A1500]">
            <span>🔥 7 NL</span>
            <span>💰 1.2k Xu</span>
          </div>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-[11px] font-sans font-semibold text-[#8B1A1A] hover:underline cursor-pointer flex items-center gap-1"
          >
            ✕ Thoát trận
          </button>
        </div>

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="paper-card rounded-xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl">
              <div className="text-3xl">⚠️</div>
              <h3 className="font-serif font-bold text-base text-[#2A1500]">Rời khỏi trận đấu?</h3>
              <p className="text-xs text-[#7A4020] font-sans">
                Nếu thoát ngay bây giờ, bạn sẽ bị xử thua và trừ điểm EXP tương ứng!
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-[#C8A882] text-xs font-bold text-[#7A4020] cursor-pointer"
                >
                  Tiếp tục thi đấu
                </button>
                <button
                  onClick={handleForfeit}
                  className="flex-1 py-2 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold shadow cursor-pointer"
                >
                  Xác nhận thoát
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VS Bar */}
        <div className="paper-card rounded-xl p-2.5 border border-[#C8A882] shadow-sm flex items-center gap-2">
          {/* Player 1 (You) */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#C4341A] flex items-center justify-center text-base shrink-0 shadow">
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-[#7A4020] bg-[#E8D5BA] px-1 rounded uppercase">
                  LV.{state.player?.level}
                </span>
                <span className="text-[11px] font-serif font-bold text-[#2A1500] truncate">Bạn</span>
              </div>
              <div className="text-[10px] font-sans font-bold text-[#3A5A2A] mt-0.5">
                {state.myScore} điểm
              </div>
              <div className="h-1.5 bg-[#E8D5BA] rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-[#3A5A2A] transition-all duration-300"
                  style={{ width: `${Math.min(100, (state.myScore / 800) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center VS Badge */}
          <div className="flex flex-col items-center shrink-0 px-1">
            <div className="w-7 h-7 rounded-full bg-[#8B1A1A] flex items-center justify-center text-[10px] font-serif font-bold text-white shadow border border-white">
              VS
            </div>
            {state.myCombo > 1 && (
              <span className="text-[9px] font-bold text-[#C4341A] animate-pulse whitespace-nowrap mt-0.5">
                🔥 x{state.myCombo}
              </span>
            )}
          </div>

          {/* Player 2 (Opponent) */}
          <div className="flex-1 flex items-center gap-2 min-w-0 text-right flex-row-reverse">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A4020] to-[#A0622A] flex items-center justify-center text-base shrink-0 shadow">
              🏛️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[11px] font-serif font-bold text-[#2A1500] truncate">
                  {state.opponent?.username || 'Học Giả'}
                </span>
                <span className="text-[8px] font-bold text-[#7A4020] bg-[#E8D5BA] px-1 rounded uppercase">
                  LV.{state.opponent?.level || 16}
                </span>
              </div>
              <div className="text-[10px] font-sans font-bold text-[#7A4020] mt-0.5">
                {state.opponentScore} điểm
              </div>
              <div className="h-1.5 bg-[#E8D5BA] rounded-full overflow-hidden mt-0.5 flex justify-end">
                <div
                  className="h-full bg-[#7A4020] transition-all duration-300"
                  style={{ width: `${Math.min(100, (state.opponentScore / 800) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* In-Match Live EXP Accumulation Bar */}
        <div className="paper-card rounded-xl px-3 py-2 border border-[#C8A882]/70 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">⭐</span>
            <span className="text-[11px] font-serif font-bold text-[#7A4020]">EXP Trận Này:</span>
            <span className="text-xs font-serif font-black text-[#3A5A2A] bg-[#3A5A2A]/10 px-1.5 py-0.5 rounded border border-[#3A5A2A]/20">
              +{state.myExpEarned || 0} EXP
            </span>
          </div>
          <div className="text-[10px] font-sans">
            {state.myCombo >= 5 ? (
              <span className="text-[#C4341A] font-bold animate-pulse flex items-center gap-1">
                <span>🔥</span> Chuỗi x{state.myCombo} (+40 EXP/câu)
              </span>
            ) : (
              <span className="text-[#7A4020]">
                Chuỗi đúng: <strong>{state.myCombo}</strong> {state.myCombo > 0 ? `(còn ${5 - state.myCombo} câu để x2 EXP)` : '(>=5 câu x2 EXP)'}
              </span>
            )}
          </div>
        </div>

        {/* 3. Timer: KHẮC THỜI GIAN */}
        <div className="paper-card rounded-xl p-2.5 border border-[#C8A882]/70">
          <div className="flex justify-between items-center text-xs font-serif font-bold mb-1.5">
            <span className="font-hand text-sm text-[#7A4020] flex items-center gap-1">
              ⏳ KHẮC THỜI GIAN
            </span>
            <span
              className={`${
                state.timeLeft <= 5 ? 'text-[#C4341A] animate-pulse font-extrabold' : 'text-[#2A1500]'
              }`}
            >
              {state.timeLeft.toString().padStart(2, '0')}s / {q.timeLimit}s
            </span>
          </div>
          <div className="h-2 bg-[#E8D5BA] rounded-full overflow-hidden border border-[#C8A882]/40">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${timeColor} ${
                state.timeLeft <= 5 ? 'animate-pulse' : ''
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>

        {/* 4. Question Card */}
        <div className="paper-card rounded-xl p-4 border border-[#C8A882] shadow-sm text-center relative">
          <div className="text-[10px] font-sans font-bold text-[#7A4020] tracking-wider uppercase mb-1.5 flex items-center justify-center gap-1.5">
            <span>CÂU HỎI {q.questionNum.toString().padStart(2, '0')}/{q.totalQuestions}</span>
            <span>•</span>
            <span className="text-[#8B1A1A]">{q.question.era}</span>
            <span>•</span>
            <span>{q.question.eraYear}</span>
          </div>
          <h2 className="font-serif font-bold text-sm text-[#2A1500] leading-relaxed mb-2.5">
            {q.question.question}
          </h2>
          {q.question.hint && (
            <div className="font-hand italic text-xs text-[#7A4020] bg-[#E8D5BA]/40 py-1 px-2.5 rounded-lg inline-block">
              📜 "{q.question.hint}"
            </div>
          )}
        </div>

        {/* 5. Answer Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {q.question.options.map((opt, idx) => {
            const isSelected = state.selectedAnswer === idx;
            let btnStyle = 'paper-card border-[#C8A882] hover:bg-[#F2E5D0]';
            let labelStyle = 'bg-[#7A4020] text-white';
            let badge = null;

            if (isSelected && !isEndPhase) {
              btnStyle = 'bg-[#E6F0FA] border-[#1E2D5A] ring-2 ring-[#1E2D5A]';
              labelStyle = 'bg-[#1E2D5A] text-white';
            }

            if (isEndPhase) {
              const correctIdx = state.answerResult?.correctIndex ?? 0;
              if (idx === correctIdx) {
                btnStyle = 'bg-[#3A5A2A]/15 border-[#3A5A2A] ring-2 ring-[#3A5A2A]';
                labelStyle = 'bg-[#3A5A2A] text-white';
                if (isSelected && state.answerResult?.correct) {
                  const combo = state.answerResult.combo ?? 0;
                  const expBonus = combo >= 5 ? 40 : 20;
                  badge = (
                    <div className="absolute -top-3 right-2 flex items-center gap-1.5 animate-bounce z-10">
                      <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        ⚡ +{state.answerResult.scoreEarned}
                      </span>
                      <span
                        className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md ${
                          combo >= 5
                            ? 'bg-gradient-to-r from-red-600 to-orange-500 animate-pulse'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                        }`}
                      >
                        {combo >= 5 ? `🔥 CHUỖI x${combo}! +40 EXP` : `✨ +20 EXP`}
                      </span>
                    </div>
                  );
                }
              } else if (isSelected) {
                btnStyle = 'bg-[#C4341A]/15 border-[#C4341A] ring-2 ring-[#C4341A]';
                labelStyle = 'bg-[#C4341A] text-white';
              } else {
                btnStyle = 'opacity-40 border-[#C8A882]/40';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => submitAnswer(idx)}
                disabled={state.selectedAnswer !== null || isEndPhase}
                className={`relative flex items-center p-3 rounded-xl border transition-all text-left cursor-pointer ${btnStyle}`}
              >
                {badge}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-sm mr-3 shrink-0 ${labelStyle}`}
                >
                  {opt.label}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif font-bold text-xs text-[#2A1500] truncate">
                    {opt.text}
                  </div>
                  {opt.subtext && (
                    <div className="font-hand italic text-[11px] text-[#7A4020] truncate">
                      {opt.subtext}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── 5. Phase: RESULT (Game Over) ── */
  const renderResult = () => {
    if (!state.gameOver) return null;
    const isWin = state.gameOver.winner === 'player';
    const isDraw = state.gameOver.winner === 'draw';
    const myStats = state.gameOver.players?.player || {
      totalScore: state.myScore,
      correctCount: 2,
      maxCombo: 2,
      expChange: isWin ? 50 : isDraw ? 25 : -20,
      coinsEarned: isWin ? 100 : 30,
    };
    const oppStats = state.gameOver.players?.opponent || {
      username: state.opponent?.username || 'Học Giả Phố Cổ',
      totalScore: state.opponentScore,
    };

    return (
      <div className="p-4 space-y-4 text-center">
        {/* Banner */}
        <div className="pt-2">
          <div className="text-5xl mb-2 animate-bounce">
            {isWin ? '🏆' : isDraw ? '🤝' : '😔'}
          </div>
          <h1
            className={`text-2xl font-serif font-bold ${
              isWin ? 'text-[#3A5A2A]' : isDraw ? 'text-[#7A4020]' : 'text-[#C4341A]'
            }`}
          >
            {isWin ? 'CHIẾN THẮNG HUY HOÀNG!' : isDraw ? 'HÒA ĐIỂM SỐ' : 'TIẾC NUÔI THUA TRẬN'}
          </h1>
          <p className="text-xs font-sans text-[#7A4020] mt-1">
            {isWin
              ? 'Kiến thức sử học của bạn thật xuất sắc!'
              : isDraw
              ? 'Một trận so tài nghẹt thở cân tài cân sức!'
              : 'Hãy rèn luyện thêm và phục thù ở trận tới!'}
          </p>
        </div>

        {/* Score Comparison */}
        <div className="paper-card rounded-xl p-4 border border-[#C8A882] shadow-sm">
          <div className="text-xs font-serif font-bold text-[#2A1500] mb-3 uppercase tracking-wider">
            TỔNG KẾT ĐIỂM TRẬN
          </div>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-[#3A5A2A]">{myStats.totalScore}</div>
              <div className="text-xs font-bold text-[#2A1500] mt-0.5">Bạn</div>
            </div>
            <div className="text-xl font-serif font-bold text-[#C8A882]">VS</div>
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-[#7A4020]">{oppStats.totalScore}</div>
              <div className="text-xs font-bold text-[#7A4020] mt-0.5">{oppStats.username}</div>
            </div>
          </div>
        </div>

        {/* Rewards & Stats */}
        <div className="paper-card rounded-xl p-4 border border-[#C8A882] space-y-2.5 text-left text-xs font-sans">
          <div className="font-serif font-bold text-[#2A1500] border-b border-[#C8A882]/30 pb-1.5 text-center">
            PHẦN THƯỞNG & THỐNG KÊ CHIẾN TÍCH
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#C8A882]/20">
            <span className="text-[#7A4020] flex items-center gap-1">
              <span>⭐</span> Điểm kinh nghiệm (EXP):
            </span>
            <span className="font-bold text-[#3A5A2A] text-sm">
              +{myStats.expChange} EXP
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#C8A882]/20">
            <span className="text-[#7A4020] flex items-center gap-1">
              <span>🔥</span> Chuỗi đúng cao nhất:
            </span>
            <div className="text-right">
              <span className="font-bold text-[#8B1A1A]">
                {myStats.maxCombo || 0} câu liên tiếp
              </span>
              {(myStats.maxCombo || 0) >= 5 && (
                <div className="text-[10px] text-amber-700 font-medium">
                  🌟 Đạt chuỗi thưởng siêu cấp (+40 EXP/câu)
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#C8A882]/20">
            <span className="text-[#7A4020] flex items-center gap-1">
              <span>💰</span> Tiền thưởng:
            </span>
            <span className="font-bold text-amber-600">+{myStats.coinsEarned} Xu</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#7A4020] flex items-center gap-1">
              <span>🎯</span> Số câu trả lời đúng:
            </span>
            <span className="font-bold text-[#2A1500]">{myStats.correctCount}/10</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={handleGoHome}
            className="flex-1 py-3 rounded-xl font-serif font-bold text-xs text-[#7A4020] bg-[#E8D5BA] border border-[#C8A882] hover:bg-[#E8D5BA]/80 active:scale-95 transition-all cursor-pointer"
          >
            🏠 VỀ TRANG CHỦ
          </button>
          <button
            onClick={playAgain}
            className="flex-1 py-3 rounded-xl font-serif font-bold text-xs text-[#FBF4E8] bg-[#8B1A1A] hover:bg-[#7a1515] shadow-md active:scale-95 transition-all cursor-pointer"
          >
            🔄 CHƠI TIẾP
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full pb-4">
      {state.phase === 'idle' && renderIdle()}
      {state.phase === 'searching' && renderSearching()}
      {(state.phase === 'matched' || state.phase === 'countdown') && renderMatched()}
      {(state.phase === 'playing' || state.phase === 'question_end') && renderPlaying()}
      {state.phase === 'result' && renderResult()}
    </div>
  );
}
