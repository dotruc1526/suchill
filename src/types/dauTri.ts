export type GamePhase = "idle" | "searching" | "waiting_room" | "matched" | "countdown" | "playing" | "question_end" | "result";
export type PlayerInfo = { userId?: string; oderId?: string; username: string; exp: number; level: number; isBot?: boolean };
export type QuestionData = {
  questionNum: number; totalQuestions: number; questionId: number; deadlineAt: number; timeLimit: number;
  question: { id: number; era: string; eraYear: string; question: string; hint: string; options: { label: string; text: string; subtext: string }[] };
};
export type AnswerResult = { correct: boolean; correctIndex: number; scoreEarned: number; totalScore: number; combo: number; expEarned?: number; totalExpEarned?: number; timeLeft: number; explanation?: string };
export type MatchStats = { userId?: string; username: string; totalScore: number; correctCount: number; maxCombo: number; expChange: number; coinsEarned: number; newExp: number };
export type GameOverData = {
  roomId: string; winner: string; isWin: boolean; isDraw: boolean; forfeitedBy?: string;
  scores: Record<string, number>; myScore: number; opponentScore: number;
  players: Record<string, MatchStats>; rewardsPersisted: false; mode: "online-guest";
};
export type GameState = {
  phase: GamePhase; roomId: string | null; player: PlayerInfo; opponent: PlayerInfo | null;
  currentQuestion: QuestionData | null; timeLeft: number; myScore: number; opponentScore: number;
  myCombo: number; myExpEarned: number; selectedAnswer: number | null; answerResult: AnswerResult | null;
  opponentAnswered: boolean; opponentConnected: boolean; gameOver: GameOverData | null; countdown: number;
  error: string | null; connected: boolean; roomCode: string | null;
};
export type GameSnapshot = Omit<GameState, "gameOver" | "error" | "connected" | "roomCode"> & { serverNow: number };
export type DauTriScreenProps = {
  userId?: string; playerName?: string;
  onNavigateTab?: (tab: "home" | "practice" | "dautri" | "ai" | "profile") => void;
  onMatchActiveChange?: (active: boolean) => void;
};
export type TrialProfile = { userId: string; username: string; rp: number; matches: number; wins: number; streak: number; position: number | null };
export type TrialStandings = { profile: TrialProfile; entries: TrialProfile[]; totalPlayers: number; mode: "trial" };
