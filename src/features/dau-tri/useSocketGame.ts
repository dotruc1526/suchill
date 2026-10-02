import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { openGameConnection, type GameCredentials } from "../../services/gameSocketService";
import type { GameOverData, GameSnapshot, PlayerInfo } from "../../types/dauTri";
import { gameReducer, initialGameState } from "./gameState";

export function useSocketGame(options: {
  initialPlayer?: Partial<PlayerInfo>; onGameOver?: (data: GameOverData) => void; credentials?: GameCredentials;
} = {}) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState({ username: options.initialPlayer?.username || "Người chơi", exp: 0, level: 0 }));
  const [attempt, setAttempt] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const latest = useRef(options); latest.current = options;
  const username = options.initialPlayer?.username || "Người chơi";
  const scope = options.initialPlayer?.userId || options.initialPlayer?.oderId || "guest";
  const seenResult = useRef<string | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    let alive = true;
    dispatch({ type: "idle" });
    dispatch({ type: "patch", value: { connected: false, error: null } });
    void openGameConnection({ username, scope, signal: abort.signal, credentials: latest.current.credentials }).then(connection => {
      if (!alive) { connection.socket.disconnect(); return; }
      const socket = connection.socket; socketRef.current = socket;
      dispatch({ type: "patch", value: { player: connection.player } });
      socket.on("connect", () => dispatch({ type: "patch", value: { connected: true, error: null } }));
      socket.on("disconnect", () => dispatch({ type: "patch", value: { connected: false, error: "Mất kết nối. Đang kết nối lại; trận do server quản lý." } }));
      socket.on("connect_error", error => {
        if (error.message.includes("Invalid player session")) connection.forget();
        dispatch({ type: "patch", value: { connected: false, error: "Không kết nối được máy chủ hoặc phiên không hợp lệ. Hãy kết nối lại." } });
      });
      socket.on("error", (error: string) => dispatch({ type: "patch", value: { error } }));
      socket.on("idle", () => dispatch({ type: "idle" }));
      socket.on("searching", () => dispatch({ type: "patch", value: { phase: "searching", error: null } }));
      socket.on("room_created", ({ code }: { code: string }) => dispatch({ type: "patch", value: { phase: "waiting_room", roomCode: code, error: null } }));
      socket.on("match_found", ({ roomId }: { roomId: string }) => socket.emit("ready", { roomId }));
      socket.on("game_snapshot", (snapshot: GameSnapshot) => dispatch({ type: "snapshot", value: snapshot }));
      socket.on("game_over", (data: GameOverData) => {
        dispatch({ type: "result", value: data });
        if (seenResult.current !== data.roomId) { seenResult.current = data.roomId; latest.current.onGameOver?.(data); }
      });
      socket.connect();
    }).catch(() => { if (alive) dispatch({ type: "patch", value: { error: "Không thể mở phiên chơi. Kiểm tra địa chỉ máy chủ và kết nối Internet." } }); });
    return () => { alive = false; abort.abort(); socketRef.current?.disconnect(); socketRef.current = null; };
  }, [scope, username, attempt]);

  const send = useCallback((event: string, payload?: unknown) => {
    if (!socketRef.current?.connected) { dispatch({ type: "patch", value: { error: "Cần kết nối máy chủ trước khi chơi." } }); return; }
    dispatch({ type: "patch", value: { error: null } });
    socketRef.current.emit(event, payload);
  }, []);
  return {
    state, retryConnection: () => setAttempt(value => value + 1),
    joinQueue: () => send("join_queue"), cancelQueue: () => send("cancel_queue"),
    createRoom: () => send("create_room"), joinRoom: (code: string) => send("join_room", { code }),
    leaveRoom: () => send("leave_room"),
    submitAnswer: (answerIndex: number) => {
      if (state.phase === "playing" && state.selectedAnswer === null && state.currentQuestion) send("submit_answer", { roomId: state.roomId, questionId: state.currentQuestion.questionId, answerIndex });
    },
    forfeit: () => send("forfeit", { roomId: state.roomId }),
    playAgain: () => send("join_queue"),
    goHome: () => { if (state.phase === "searching") send("cancel_queue"); else if (state.phase === "waiting_room") send("leave_room"); else if (state.roomId && state.phase !== "result") send("forfeit", { roomId: state.roomId }); dispatch({ type: "idle" }); },
  };
}
