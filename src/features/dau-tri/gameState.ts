import type { GameOverData, GameSnapshot, GameState, PlayerInfo } from "../../types/dauTri";

export function initialGameState(player: PlayerInfo): GameState {
  return {
    phase: "idle", roomId: null, player, opponent: null, currentQuestion: null, timeLeft: 0,
    myScore: 0, opponentScore: 0, myCombo: 0, myExpEarned: 0, selectedAnswer: null, answerResult: null,
    opponentAnswered: false, opponentConnected: true, gameOver: null, countdown: 0, error: null, connected: false, roomCode: null,
  };
}
export type GameAction =
  | { type: "patch"; value: Partial<GameState> }
  | { type: "snapshot"; value: GameSnapshot }
  | { type: "result"; value: GameOverData }
  | { type: "idle" };
export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "patch") return { ...state, ...action.value };
  if (action.type === "snapshot") return { ...state, ...action.value, roomCode: null, gameOver: null };
  if (action.type === "result") return { ...state, phase: "result", gameOver: action.value, myScore: action.value.myScore, opponentScore: action.value.opponentScore };
  return { ...initialGameState(state.player), connected: state.connected };
}
