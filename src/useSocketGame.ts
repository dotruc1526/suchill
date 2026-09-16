import { useEffect, useReducer, useRef } from 'react';

const SOCKET_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:3001`
  : 'http://localhost:3001';

type Socket = {
  on: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  disconnect: () => void;
  connected: boolean;
  id?: string;
};

const MOCK_QUESTIONS = [
  {
    id: 1,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1960",
    question: "Phong trào Đồng khởi (1959 - 1960) nổ ra tiêu biểu và giành thắng lợi vang dội nhất tại tỉnh nào ở miền Nam?",
    hint: "Vùng đất xứ dừa với Đội quân tóc dài huyền thoại của nữ tướng Nguyễn Thị Định.",
    options: [
      { label: "A", text: "Bến Tre", subtext: "Ba xã Định Thủy, Phước Hiệp, Bình Khánh" },
      { label: "B", text: "Tây Ninh", subtext: "Căn cứ Trung ương Cục miền Nam" },
      { label: "C", text: "Quảng Nam", subtext: "Chiến trường Khu 5 ác liệt" },
      { label: "D", text: "Bình Định", subtext: "Vùng đồng bằng duyên hải Trung Bộ" }
    ],
    correctIndex: 0
  },
  {
    id: 2,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1963",
    question: "Chiến thắng Ấp Bắc (02/01/1963) tại Tiền Giang đã đánh bại bước đầu hai chiến thuật tác chiến nào của Mỹ?",
    hint: "Chiến thuật đổ quân bằng trực thăng và xe bọc thép M113 tối tân thời bấy giờ.",
    options: [
      { label: "A", text: "Tìm diệt và Bình định", subtext: "Chiến lược Chiến tranh cục bộ" },
      { label: "B", text: "Trực thăng vận và Thiết xa vận", subtext: "Chiến lược Chiến tranh đặc biệt" },
      { label: "C", text: "Tràn ngập lãnh thổ", subtext: "Giai đoạn sau Hiệp định Paris" },
      { label: "D", text: "Bao vây và Khóa biên", subtext: "Kế hoạch lập phòng tuyến quân sự" }
    ],
    correctIndex: 1
  },
  {
    id: 3,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1965",
    question: "Chiến thắng Vạn Tường (Quảng Ngãi, 8/1965) được mệnh danh là bước ngoặt gì trong cuộc đụng đầu trực tiếp với quân viễn chinh Mỹ?",
    hint: "Trận đánh được coi như 'Điện Biên Phủ' chống quân viễn chinh Mỹ trên chiến trường miền Nam.",
    options: [
      { label: "A", text: "Chiến thắng mở đầu chống Chiến tranh cục bộ", subtext: "Đánh bại cuộc hành quân Ánh sáng sao của Thủy quân lục chiến Mỹ" },
      { label: "B", text: "Trận đánh mở đường vận tải biển bí mật", subtext: "Đoàn tàu Không số cập bến an toàn" },
      { label: "C", text: "Cuộc tập kích đường không đầu tiên vào cơ quan chỉ huy Mỹ", subtext: "Đặc công đánh sân bay quân sự" },
      { label: "D", text: "Trận giải phóng hoàn toàn vùng duyên hải miền Trung", subtext: "Phá vỡ hệ thống ấp chiến lược" }
    ],
    correctIndex: 0
  },
  {
    id: 4,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1959",
    question: "Tuyến chi viện chiến lược Trường Sơn (Đường Hồ Chí Minh) lịch sử được thành lập vào ngày tháng năm nào?",
    hint: "Trùng đúng vào ngày kỷ niệm sinh nhật Bác Hồ kính yêu.",
    options: [
      { label: "A", text: "19/05/1959", subtext: "Đoàn 559 được thành lập soi đường mở tuyến" },
      { label: "B", text: "02/09/1960", subtext: "Đại hội đại biểu toàn quốc lần thứ III" },
      { label: "C", text: "22/12/1959", subtext: "Ngày thành lập Quân đội Nhân dân" },
      { label: "D", text: "30/04/1961", subtext: "Hợp nhất các lực lượng vũ trang giải phóng" }
    ],
    correctIndex: 0
  },
  {
    id: 5,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1968",
    question: "Cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 đã buộc Tổng thống Mỹ Lyndon Johnson phải tuyên bố điều gì?",
    hint: "Buộc Mỹ phải xuống thang chiến tranh, ngừng ném bom miền Bắc và chấp nhận đàm phán.",
    options: [
      { label: "A", text: "Rút toàn bộ quân đội ngay trong năm 1968", subtext: "Chấm dứt hoàn toàn sự can thiệp quân sự" },
      { label: "B", text: "Ngừng ném bom miền Bắc và ngồi vào đàm phán Paris", subtext: "Thừa nhận sự phá sản của Chiến tranh cục bộ" },
      { label: "C", text: "Ký ngay hiệp định đình chiến vô điều kiện", subtext: "Bàn giao quyền kiểm soát cho chính quyền Sài Gòn" },
      { label: "D", text: "Mở rộng cuộc chiến tranh xâm lược sang toàn Đông Dương", subtext: "Đưa thêm 20 vạn lính viễn chinh sang" }
    ],
    correctIndex: 1
  },
  {
    id: 6,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1972",
    question: "Chiến dịch 12 ngày đêm cuối năm 1972 bắn rơi 34 pháo đài bay B-52 của Mỹ trên bầu trời Hà Nội - Hải Phòng được ngợi ca là gì?",
    hint: "Một chiến thắng mang tên địa danh lịch sử lừng lẫy năm châu nhưng diễn ra trên không trung.",
    options: [
      { label: "A", text: "Chiến dịch Sấm Rền", subtext: "Tên chiến dịch không kích của không quân Mỹ" },
      { label: "B", text: "Trận Điện Biên Phủ trên không", subtext: "Bản hùng ca đập tan chiến dịch Linebacker II" },
      { label: "C", text: "Chiến dịch Ánh Sáng Mùa Đông", subtext: "Kế hoạch tác chiến phối hợp binh chủng" },
      { label: "D", text: "Chiến dịch Đường 9 - Khe Sanh", subtext: "Mặt trận nghi binh chiến lược" }
    ],
    correctIndex: 1
  },
  {
    id: 7,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1973",
    question: "Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được chính thức ký kết vào ngày nào?",
    hint: "Hiện thực hóa mục tiêu chiến lược 'Đánh cho Mỹ cút' của Chủ tịch Hồ Chí Minh.",
    options: [
      { label: "A", text: "27/01/1973", subtext: "Tại Trung tâm Hội nghị quốc tế phố Kléber (Paris)" },
      { label: "B", text: "30/04/1973", subtext: "Thời điểm hoàn tất rút quân viễn chinh Mỹ" },
      { label: "C", text: "21/07/1973", subtext: "Kỷ niệm ngày ký Hiệp định Genève 1954" },
      { label: "D", text: "19/12/1972", subtext: "Ngày bắt đầu chiến dịch phòng không Hà Nội" }
    ],
    correctIndex: 0
  },
  {
    id: 8,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1975",
    question: "Trận đánh then chốt, táo bạo mở màn cho Đại thắng mùa Xuân 1975 trong Chiến dịch Tây Nguyên diễn ra tại thị xã nào?",
    hint: "Thủ phủ cà phê Tây Nguyên, nơi địch bị đòn bất ngờ không kịp trở tay vào ngày 10/03/1975.",
    options: [
      { label: "A", text: "Pleiku", subtext: "Sở chỉ huy Quân đoàn II ngụy quyền" },
      { label: "B", text: "Buôn Ma Thuột", subtext: "Đòn điểm huyệt chiến lược ngày 10/03/1975" },
      { label: "C", text: "Kon Tum", subtext: "Căn cứ tiền tiêu phía bắc Tây Nguyên" },
      { label: "D", text: "Đà Lạt", subtext: "Vùng cao nguyên phía nam Trung Bộ" }
    ],
    correctIndex: 1
  },
  {
    id: 9,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1975",
    question: "Bức điện mật lịch sử ngày 07/04/1975 của Đại tướng Tổng Tư lệnh Võ Nguyên Giáp có câu khẩu lệnh truyền lửa nào?",
    hint: "Khẩu lệnh hối hả, thôi thúc các cánh quân tiến công thần tốc giải phóng Sài Gòn.",
    options: [
      { label: "A", text: "Không có gì quý hơn độc lập tự do", subtext: "Lời kêu gọi chống Mỹ cứu nước năm 1966" },
      { label: "B", text: "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa", subtext: "Tranh thủ từng giờ, từng phút xốc tới mặt trận" },
      { label: "C", text: "Nhằm thẳng quân thù mà bắn", subtext: "Lời hô bất tử của Anh hùng Nguyễn Viết Xuân" },
      { label: "D", text: "Quyết tử để Tổ quốc quyết sinh", subtext: "Lời thề cảm tử quân Thủ đô mùa đông 1946" }
    ],
    correctIndex: 1
  },
  {
    id: 10,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1975",
    question: "Chiếc xe tăng mang số hiệu nào của Quân đội nhân dân Việt Nam đã húc đổ cổng chính Dinh Độc Lập trưa ngày 30/04/1975?",
    hint: "Xe tăng T-59 thuộc Lữ đoàn Tăng - Thiết giáp 203 do Trung úy Vũ Đăng Toàn chỉ huy.",
    options: [
      { label: "A", text: "Xe tăng 390", subtext: "Húc tung cánh cổng chính Dinh Độc Lập lúc 11h30" },
      { label: "B", text: "Xe tăng 843", subtext: "Húc cổng phụ, do Trung úy Bùi Quang Thận chỉ huy" },
      { label: "C", text: "Xe tăng 380", subtext: "Chiếc xe tăng tiến vào chi viện đội hình" },
      { label: "D", text: "Xe tăng 985", subtext: "Xe tăng thọc sâu thuộc mũi tiến công hướng đông" }
    ],
    correctIndex: 0
  }
];

function loadSocketIO(): Promise<(url: string) => Socket> {
  return new Promise((resolve) => {
    if ((window as any).io) {
      resolve((window as any).io);
      return;
    }
    const script = document.createElement('script');
    script.src = `${SOCKET_URL}/socket.io/socket.io.js`;

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn("Socket.io script load timeout, using local mock socket engine.");
        resolve(() => createMockSocket());
      }
    }, 3000);

    script.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve((window as any).io);
      }
    };

    script.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.warn("Could not reach backend socket server at " + SOCKET_URL + ", falling back to offline simulation.");
        resolve(() => createMockSocket());
      }
    };

    document.head.appendChild(script);
  });
}

function createMockSocket(): Socket {
  const listeners: Record<string, Function[]> = {};
  let currentQIndex = 0;
  let playerScore = 0;
  let oppScore = 0;
  let playerCombo = 0;
  let oppCombo = 0;
  let playerExpEarned = 0;
  let playerCorrectCount = 0;
  let playerMaxCombo = 0;
  let botTimer: any = null;
  let questionTimer: any = null;

  return {
    on: (event, callback) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },
    emit: (event, ...args) => {
      console.log(`[MockSocket] Emit: ${event}`, args);

      if (event === "join_queue") {
        currentQIndex = 0;
        playerScore = 0;
        oppScore = 0;
        playerCombo = 0;
        oppCombo = 0;
        playerExpEarned = 0;
        playerCorrectCount = 0;
        playerMaxCombo = 0;

        setTimeout(() => {
          listeners["match_found"]?.forEach(cb => cb({
            roomId: "mock_room_" + Date.now(),
            opponent: {
              oderId: "bot_hocgia",
              username: "Học Giả Phố Cổ",
              exp: 1280,
              level: 16,
              isBot: true
            }
          }));

          let countdownVal = 3;
          listeners["countdown"]?.forEach(cb => cb(countdownVal));
          const countTimer = setInterval(() => {
            countdownVal -= 1;
            if (countdownVal > 0) {
              listeners["countdown"]?.forEach(cb => cb(countdownVal));
            } else {
              clearInterval(countTimer);
              sendQuestion(0);
            }
          }, 800);
        }, 1200);
      } else if (event === "cancel_queue") {
        if (botTimer) clearTimeout(botTimer);
        if (questionTimer) clearTimeout(questionTimer);
      } else if (event === "submit_answer") {
        const payload = args[0];
        const answerIdx = typeof payload === 'object' && payload !== null
          ? payload.answerIndex
          : (typeof args[1] === 'number' ? args[1] : 0);

        const currentQ = MOCK_QUESTIONS[currentQIndex % MOCK_QUESTIONS.length];
        const isCorrect = answerIdx === currentQ.correctIndex;
        const timeLeft = Math.floor(Math.random() * 5) + 8; // Simulated 8-12s
        const scoreEarned = isCorrect ? 100 + (timeLeft * 10) + (playerCombo * 20) : 0;
        let expEarned = 0;

        if (isCorrect) {
          playerCombo += 1;
          playerCorrectCount += 1;
          if (playerCombo > playerMaxCombo) {
            playerMaxCombo = playerCombo;
          }
          // Cơ chế thưởng EXP: Đúng bình thường +20 EXP, chuỗi liên tục từ 5 câu trở lên +40 EXP mỗi câu tiếp theo
          expEarned = playerCombo >= 5 ? 40 : 20;
          playerExpEarned += expEarned;
          playerScore += scoreEarned;
        } else {
          playerCombo = 0;
          expEarned = 0;
        }

        listeners["answer_result"]?.forEach(cb => cb({
          correct: isCorrect,
          correctIndex: currentQ.correctIndex,
          scoreEarned,
          totalScore: playerScore,
          combo: playerCombo,
          expEarned,
          totalExpEarned: playerExpEarned,
          timeLeft
        }));

        // Opponent answers shortly after
        setTimeout(() => {
          const oppCorrect = Math.random() > 0.35;
          if (oppCorrect) {
            oppCombo += 1;
            oppScore += 100 + Math.floor(Math.random() * 80);
          } else {
            oppCombo = 0;
          }
          listeners["opponent_answered"]?.forEach(cb => cb({ hasAnswered: true }));

          // Transition to next question or end after 1.8s
          setTimeout(() => {
            listeners["question_end"]?.forEach(cb => cb({
              correctIndex: currentQ.correctIndex,
              scores: { player: playerScore, opponent: oppScore },
              playerResults: {}
            }));

            setTimeout(() => {
              currentQIndex += 1;
              if (currentQIndex < 10) {
                sendQuestion(currentQIndex);
              } else {
                // Game over sau đủ 10 câu hỏi
                const winner = playerScore >= oppScore ? 'player' : 'opponent';
                const isDraw = playerScore === oppScore;
                listeners["game_over"]?.forEach(cb => cb({
                  winner: isDraw ? 'draw' : winner,
                  scores: { player: playerScore, opponent: oppScore },
                  players: {
                    player: {
                      username: "Bạn",
                      totalScore: playerScore,
                      correctCount: playerCorrectCount,
                      maxCombo: playerMaxCombo,
                      expChange: playerExpEarned,
                      coinsEarned: winner === 'player' ? 100 : 30,
                      newExp: playerExpEarned
                    },
                    opponent: {
                      username: "Học Giả Phố Cổ",
                      totalScore: oppScore,
                      correctCount: 6,
                      maxCombo: 3,
                      expChange: winner === 'opponent' ? 120 : 60,
                      coinsEarned: 30,
                      newExp: 1280
                    }
                  }
                }));
              }
            }, 1200);
          }, 800);
        }, 400);
      }
    },
    off: (event, callback) => {
      if (callback && listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      } else {
        listeners[event] = [];
      }
    },
    disconnect: () => {
      if (botTimer) clearTimeout(botTimer);
      if (questionTimer) clearTimeout(questionTimer);
    },
    connected: true,
    id: 'mock_socket_id'
  };

  function sendQuestion(idx: number) {
    const q = MOCK_QUESTIONS[idx % MOCK_QUESTIONS.length];
    listeners["question_start"]?.forEach(cb => cb({
      questionNum: idx + 1,
      totalQuestions: 10,
      question: {
        id: q.id,
        era: q.era,
        eraYear: q.eraYear,
        question: q.question,
        hint: q.hint,
        options: q.options
      },
      timeLimit: 15
    }));
  }
}

export type GamePhase = 'idle' | 'searching' | 'matched' | 'countdown' | 'playing' | 'question_end' | 'result';

export type PlayerInfo = {
  oderId: string;
  username: string;
  exp: number;
  level: number;
  isBot?: boolean;
};

export type QuestionData = {
  questionNum: number;
  totalQuestions: number;
  question: {
    id: number;
    era: string;
    eraYear: string;
    question: string;
    hint: string;
    options: { label: string; text: string; subtext: string }[];
  };
  timeLimit: number;
};

export type AnswerResult = {
  correct: boolean;
  correctIndex: number;
  scoreEarned: number;
  totalScore: number;
  combo: number;
  expEarned?: number;
  totalExpEarned?: number;
  timeLeft: number;
};

export type GameOverData = {
  winner: string;
  scores: Record<string, number>;
  players: Record<string, {
    username: string;
    totalScore: number;
    correctCount: number;
    maxCombo: number;
    expChange: number;
    coinsEarned: number;
    newExp: number;
  }>;
};

export type GameState = {
  phase: GamePhase;
  roomId: string | null;
  player: PlayerInfo;
  opponent: PlayerInfo | null;
  currentQuestion: QuestionData | null;
  timeLeft: number;
  myScore: number;
  opponentScore: number;
  myCombo: number;
  myExpEarned: number;
  selectedAnswer: number | null;
  answerResult: AnswerResult | null;
  opponentAnswered: boolean;
  gameOver: GameOverData | null;
  streak: number;
  countdown: number;
  error: string | null;
};

type Action =
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'MATCH_FOUND'; roomId: string; opponent: PlayerInfo }
  | { type: 'COUNTDOWN'; count: number }
  | { type: 'QUESTION_START'; data: QuestionData }
  | { type: 'SUBMIT_ANSWER'; index: number }
  | { type: 'ANSWER_RESULT'; result: AnswerResult }
  | { type: 'OPPONENT_ANSWERED' }
  | { type: 'QUESTION_END' }
  | { type: 'GAME_OVER'; data: GameOverData }
  | { type: 'SET_TIME_LEFT'; time: number }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_PLAYER'; player: PlayerInfo }
  | { type: 'RESET'; player: PlayerInfo };

const DEFAULT_PLAYER: PlayerInfo = {
  oderId: 'player_' + Math.random().toString(36).slice(2, 8),
  username: 'Sử Gia Tập Sự',
  exp: 0,
  level: 0
};

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player: action.player };
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'MATCH_FOUND':
      return { ...state, phase: 'matched', roomId: action.roomId, opponent: action.opponent, myExpEarned: 0 };
    case 'COUNTDOWN':
      return { ...state, phase: 'countdown', countdown: action.count };
    case 'QUESTION_START':
      return {
        ...state,
        phase: 'playing',
        currentQuestion: action.data,
        timeLeft: action.data.timeLimit,
        selectedAnswer: null,
        answerResult: null,
        opponentAnswered: false
      };
    case 'SUBMIT_ANSWER':
      return { ...state, selectedAnswer: action.index };
    case 'ANSWER_RESULT':
      return {
        ...state,
        answerResult: action.result,
        myScore: action.result.totalScore,
        myCombo: action.result.combo,
        myExpEarned: (state.myExpEarned || 0) + (action.result.expEarned || 0)
      };
    case 'OPPONENT_ANSWERED':
      return { ...state, opponentAnswered: true };
    case 'QUESTION_END':
      return { ...state, phase: 'question_end' };
    case 'GAME_OVER':
      return { ...state, phase: 'result', gameOver: action.data };
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.time };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET':
      return {
        phase: 'idle',
        roomId: null,
        player: action.player,
        opponent: null,
        currentQuestion: null,
        timeLeft: 0,
        myScore: 0,
        opponentScore: 0,
        myCombo: 0,
        myExpEarned: 0,
        selectedAnswer: null,
        answerResult: null,
        opponentAnswered: false,
        gameOver: null,
        streak: state.streak,
        countdown: 0,
        error: null
      };
    default:
      return state;
  }
}

export function useSocketGame(options?: {
  initialPlayer?: Partial<PlayerInfo>;
  onGameOver?: (data: GameOverData) => void;
}) {
  const initialPlayer: PlayerInfo = {
    ...DEFAULT_PLAYER,
    ...options?.initialPlayer
  };

  const initialState: GameState = {
    phase: 'idle',
    roomId: null,
    player: initialPlayer,
    opponent: null,
    currentQuestion: null,
    timeLeft: 0,
    myScore: 0,
    opponentScore: 0,
    myCombo: 0,
    myExpEarned: 0,
    selectedAnswer: null,
    answerResult: null,
    opponentAnswered: false,
    gameOver: null,
    streak: 0,
    countdown: 0,
    error: null
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);
  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (options?.initialPlayer) {
      dispatch({
        type: 'SET_PLAYER',
        player: {
          ...DEFAULT_PLAYER,
          ...options.initialPlayer
        }
      });
    }
  }, [options?.initialPlayer?.exp, options?.initialPlayer?.level, options?.initialPlayer?.username]);

  useEffect(() => {
    let mounted = true;

    async function initSocket() {
      try {
        const io = await loadSocketIO();
        if (!mounted) return;

        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Connected to game server');
          socket.emit('register_player', state.player);
        });

        socket.on('match_found', (data: { roomId: string; opponent: PlayerInfo }) => {
          dispatch({ type: 'MATCH_FOUND', roomId: data.roomId, opponent: data.opponent });
          setTimeout(() => {
            socket.emit('ready', { roomId: data.roomId });
          }, 500);
        });

        socket.on('countdown', (count: number) => {
          dispatch({ type: 'COUNTDOWN', count });
        });

        socket.on('question_start', (data: QuestionData) => {
          dispatch({ type: 'QUESTION_START', data });
        });

        socket.on('answer_result', (result: AnswerResult) => {
          dispatch({ type: 'ANSWER_RESULT', result });
        });

        socket.on('opponent_answered', () => {
          dispatch({ type: 'OPPONENT_ANSWERED' });
        });

        socket.on('question_end', () => {
          dispatch({ type: 'QUESTION_END' });
        });

        socket.on('game_over', (data: GameOverData) => {
          dispatch({ type: 'GAME_OVER', data });
          options?.onGameOver?.(data);
        });

        socket.on('error', (error: string) => {
          dispatch({ type: 'SET_ERROR', error });
        });

      } catch (err) {
        console.error('Failed to init socket', err);
        dispatch({ type: 'SET_ERROR', error: 'Không thể kết nối đến máy chủ.' });
      }
    }

    initSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Client-side timer
  useEffect(() => {
    if (state.phase === 'playing' && state.timeLeft > 0 && !state.answerResult) {
      timerRef.current = window.setInterval(() => {
        dispatch({ type: 'SET_TIME_LEFT', time: state.timeLeft - 1 });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase, state.timeLeft, state.answerResult]);

  const joinQueue = () => {
    dispatch({ type: 'SET_PHASE', phase: 'searching' });
    if (socketRef.current && state.player) {
      socketRef.current.emit('join_queue', {
        userId: state.player.oderId,
        username: state.player.username,
        exp: state.player.exp,
        level: state.player.level
      });
    }
  };

  const cancelQueue = () => {
    dispatch({ type: 'SET_PHASE', phase: 'idle' });
    if (socketRef.current) {
      socketRef.current.emit('cancel_queue');
    }
  };

  const submitAnswer = (index: number) => {
    if (state.phase !== 'playing' || state.selectedAnswer !== null) return;
    dispatch({ type: 'SUBMIT_ANSWER', index });
    if (socketRef.current && state.roomId) {
      socketRef.current.emit('submit_answer', { roomId: state.roomId, answerIndex: index });
    }
  };

  const playAgain = () => {
    dispatch({ type: 'RESET', player: state.player });
    joinQueue();
  };

  const goHome = () => {
    dispatch({ type: 'RESET', player: state.player });
  };

  return {
    state,
    joinQueue,
    cancelQueue,
    submitAnswer,
    playAgain,
    goHome
  };
}
