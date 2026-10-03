import { randomUUID } from 'node:crypto';
import { takeRandomPair } from './matchmaking.js';
import { getRandomQuestions } from './questionsData.js';
import { gameSnapshot, publicQuestion } from './gameSnapshot.js';
import { attachPrivateRooms } from './privateRooms.js';
import { createTrialStandings } from './trialStandings.js';





export default function socketHandler(io, config = {}) {
  const matchQueue = [];
  const gameSessions = {};
  const playerSessions = {};
  const completed = new Map();
  const privateRooms = new Map();
  const standings = createTrialStandings();
  const questionMs = config.questionMs ?? 15000;
  const transitionMs = config.transitionMs ?? 3000;
  const countdownMs = config.countdownMs ?? 1000;
  const reconnectMs = config.reconnectMs ?? 30000;
  let disposed = false;
  const tick = setInterval(() => {
    while (matchQueue.length >= 2 && Object.keys(gameSessions).length < 500) {
      const [first, second] = takeRandomPair(matchQueue);
      createMatch(first, second);
    }
    for (const session of Object.values(gameSessions)) {
      for (const id of Object.keys(session.players)) if (!session.players[id].isBot) io.to(id).emit('game_snapshot', gameSnapshot(session, id));
    }
    for (const [id, value] of completed) if (value.expiresAt < Date.now()) completed.delete(id);
  }, 250);
  tick.unref();
  io.on('connection', (socket) => {
    const playerId = socket.data.player.userId;
    socket.join(playerId);
    const previous = gameSessions[playerSessions[playerId]];
    if (previous) {
      const player = previous.players[playerId];
      player.connected = true;
      clearTimeout(player.disconnectTimer);
      socket.emit('game_snapshot', gameSnapshot(previous, playerId));
      if (!previous.started) socket.emit('match_found', { roomId: previous.roomId, ...gameSnapshot(previous, playerId) });
    } else if (completed.has(playerId)) socket.emit('game_over', completed.get(playerId).data);
    else socket.emit('idle');
    let eventWindow = Date.now(), eventCount = 0;
    socket.use((_packet, next) => {
      if (Date.now() - eventWindow > 1000) { eventWindow = Date.now(); eventCount = 0; }
      if (++eventCount > 30) return next(new Error('Too many events'));
      next();
    });
    socket.on('get_standings', () => socket.emit('pvp_standings', standings.snapshot(socket.data.player)));
    const removeQueue = () => {
      const index = matchQueue.findIndex(p => p.userId === playerId);
      if (index !== -1) matchQueue.splice(index, 1);
    };
    const leavePrivate = attachPrivateRooms(socket, {
      io, player: { ...socket.data.player, socketId: playerId },
      available: () => !playerSessions[playerId], removeQueue,
      createMatch: (a, b) => { completed.delete(a.userId); completed.delete(b.userId); createMatch(a, b); },
    }, privateRooms);

    socket.on('join_queue', () => {
      if (Object.keys(gameSessions).length >= 500) return socket.emit('error', 'Máy chủ đang đầy. Hãy thử lại sau.');
      if (matchQueue.length >= 1000) return socket.emit('error', 'Hàng chờ đang đầy. Hãy thử lại sau.');
      if (playerSessions[playerId]) return socket.emit('error', 'Bạn đang ở trong một trận.');
      leavePrivate();
      completed.delete(playerId);
      const { userId, username, exp, level } = socket.data.player;

      const existingIdx = matchQueue.findIndex(p => p.userId === userId);
      if (existingIdx !== -1) {
        matchQueue.splice(existingIdx, 1);
      }

      const newPlayer = { socketId: playerId, userId, username, exp, level, joinedAt: Date.now(), botTimeout: null };

      matchQueue.push(newPlayer);
      socket.emit('searching');
    });

    socket.on('ready', (data) => {
      const roomId = playerSessions[playerId];
      if (!roomId || !gameSessions[roomId]) return;

      const session = gameSessions[roomId];
      if (data?.roomId !== roomId) return;
      session.players[playerId].ready = true;

      let allReady = true;
      for (const pId in session.players) {
        if (!session.players[pId].ready || !session.players[pId].connected) {
          allReady = false;
        }
      }

      if (allReady && !session.started) {
        clearTimeout(session.readyTimer);
        session.started = true;
        session.phase = 'countdown';
        session.countdown = 3;
        let countdownVal = 3;
        for (const pId in session.players) {
          if (!session.players[pId].isBot) {
            io.to(pId).emit('countdown', countdownVal);
          }
        }
        const countTimer = session.countTimer = setInterval(() => {
          if (!gameSessions[roomId]) return clearInterval(countTimer);
          countdownVal -= 1;
          session.countdown = countdownVal;
          if (countdownVal > 0) {
            for (const pId in session.players) {
              if (!session.players[pId].isBot) {
                io.to(pId).emit('countdown', countdownVal);
              }
            }
          } else {
            clearInterval(countTimer);
            startNextQuestion(roomId);
          }
        }, countdownMs);
      }
    });

    socket.on('submit_answer', (data) => {
      const { roomId, answerIndex, questionId } = data || {};
      const session = gameSessions[roomId];
      if (!session || playerSessions[playerId] !== roomId || !session.players[playerId]) return;
      if (session.phase !== 'playing' || Date.now() >= session.timerExpiresAt) return;
      if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3 || questionId !== session.questions[session.currentQ]?.id) return;

      const playerState = session.players[playerId];
      if (playerState.answeredCurrent) return;

      const question = session.questions[session.currentQ];
      const timeLeft = session.timerExpiresAt ? Math.max(0, Math.floor((session.timerExpiresAt - Date.now()) / 1000)) : 0;
      playerState.selectedAnswer = answerIndex;

      const isCorrect = answerIndex === question.correctIndex;
      let scoreEarned = 0;

      let expEarned = 0;
      if (isCorrect) {
        scoreEarned = 100 + (timeLeft * 10) + (playerState.combo * 20);
        playerState.combo += 1;
        playerState.correctCount += 1;
        if (playerState.combo > playerState.maxCombo) {
          playerState.maxCombo = playerState.combo;
        }
        // Đúng mỗi câu +20 EXP, chuỗi >= 5 câu +40 EXP mỗi câu tiếp theo
        expEarned = playerState.combo >= 5 ? 40 : 20;
        playerState.totalExpEarned = (playerState.totalExpEarned || 0) + expEarned;
      } else {
        playerState.combo = 0;
      }

      playerState.totalScore += scoreEarned;
      playerState.answeredCurrent = true;
      playerState.lastAnswerInfo = {
        correct: isCorrect,
        scoreEarned,
        totalScore: playerState.totalScore,
        combo: playerState.combo,
        expEarned,
        totalExpEarned: playerState.totalExpEarned || 0,
        timeLeft
      };

      socket.emit('answer_locked', { questionId, answerIndex });

      const opponentId = Object.keys(session.players).find(id => id !== playerId);
      if (opponentId && !session.players[opponentId].isBot) {
        io.to(opponentId).emit('opponent_answered', {
          hasAnswered: true,
          score: playerState.totalScore,
          userId: playerState.userId
        });
      }

      checkAllAnswered(roomId);
    });

    socket.on('forfeit', (data) => {
      const roomId = data?.roomId || playerSessions[playerId];
      if (!roomId || playerSessions[playerId] !== roomId || !gameSessions[roomId]?.players[playerId]) return;

      const session = gameSessions[roomId];
      const opponentId = Object.keys(session.players).find(id => id !== playerId);

      if (session.timer) clearTimeout(session.timer);

      // End game with opponent as default winner and playerId user as forfeited
      endGame(roomId, opponentId, session.players[playerId]?.userId);
    });

    socket.on('cancel_queue', () => {
      if (playerSessions[playerId]) return;
      const idx = matchQueue.findIndex(p => p.socketId === playerId);
      if (idx !== -1) {
        const p = matchQueue[idx];
        if (p.botTimeout) clearTimeout(p.botTimeout);
        matchQueue.splice(idx, 1);
      }
      socket.emit('idle');
    });

    socket.on('disconnect', () => {
      if (disposed) return;


      const idx = matchQueue.findIndex(p => p.socketId === playerId);
      if (idx !== -1) {
        const p = matchQueue[idx];
        if (p.botTimeout) clearTimeout(p.botTimeout);
        matchQueue.splice(idx, 1);
      }

      const roomId = playerSessions[playerId];
      if (roomId && gameSessions[roomId]) {
        const session = gameSessions[roomId];
        session.players[playerId].connected = false;
        const opponentId = Object.keys(session.players).find(id => id !== playerId);
        if (opponentId && !session.players[opponentId].isBot) {
           io.to(opponentId).emit('opponent_disconnected');
           session.players[playerId].disconnectTimer = setTimeout(() => {
             if (gameSessions[roomId] && !session.players[playerId].connected) {
                if (session.players[opponentId].connected) endGame(roomId, opponentId, playerId);
                else { for (const id of Object.keys(session.players)) delete playerSessions[id]; clearTimeout(session.timer); clearTimeout(session.readyTimer); clearTimeout(session.transitionTimer); clearInterval(session.countTimer); delete gameSessions[roomId]; }
             }
           }, reconnectMs);
        }
      }
    });

  });

    function createMatch(player1, player2) {
      const roomId = randomUUID();
      const questions = getRandomQuestions(config.questionCount ?? 10);

      gameSessions[roomId] = {
        roomId,
        players: {
          [player1.socketId]: { ...player1, connected: true, ready: false, totalScore: 0, combo: 0, maxCombo: 0, correctCount: 0, totalExpEarned: 0, answeredCurrent: false },
          [player2.socketId]: { ...player2, connected: true, ready: player2.isBot, totalScore: 0, combo: 0, maxCombo: 0, correctCount: 0, totalExpEarned: 0, answeredCurrent: false }
        },
        questions,
        currentQ: -1, phase: 'matched', questionMs,
        timer: null,
        started: false
      };

      const readyTimeout = config.readyMs ?? 30000;
      gameSessions[roomId].readyTimer = setTimeout(() => {
        if (!gameSessions[roomId]?.started) {
          for (const id of Object.keys(gameSessions[roomId]?.players || {})) {
            delete playerSessions[id]; io.to(id).emit('error', 'Đối thủ chưa sẵn sàng. Hãy tìm trận lại.'); io.to(id).emit('idle');
          }
          delete gameSessions[roomId];
        }
      }, readyTimeout);
      playerSessions[player1.socketId] = roomId;
      if (!player2.isBot) {
        playerSessions[player2.socketId] = roomId;
      }

      io.to(player1.socketId).emit('match_found', {
        roomId,
        opponent: { userId: player2.userId, username: player2.username, exp: player2.exp, level: player2.level, isBot: player2.isBot },
        player: { userId: player1.userId, username: player1.username, exp: player1.exp, level: player1.level }
      });

      if (!player2.isBot) {
         io.to(player2.socketId).emit('match_found', {
          roomId,
          opponent: { userId: player1.userId, username: player1.username, exp: player1.exp, level: player1.level, isBot: player1.isBot },
          player: { userId: player2.userId, username: player2.username, exp: player2.exp, level: player2.level }
        });
      }
    }

    function startNextQuestion(roomId) {
      const session = gameSessions[roomId];
      if (!session) return;
      if (Object.values(session.players).some(p => !p.connected)) {
        session.transitionTimer = setTimeout(() => startNextQuestion(roomId), 250);
        return;
      }
      session.currentQ += 1;
      session.phase = 'playing';

      if (session.currentQ >= session.questions.length) {
        return endGame(roomId);
      }

      Object.values(session.players).forEach(p => {
        p.answeredCurrent = false;
        p.lastAnswerInfo = null;
        p.selectedAnswer = null;
      });

      const q = session.questions[session.currentQ];
      const qToSend = publicQuestion(q);
      session.timerExpiresAt = Date.now() + questionMs;

      const eventData = {
        questionNum: session.currentQ + 1,
        totalQuestions: session.questions.length,
        question: qToSend,
        timeLimit: questionMs / 1000, questionId: q.id, deadlineAt: session.timerExpiresAt, serverNow: Date.now()
      };

      for (const pId in session.players) {
        if (!session.players[pId].isBot) {
          io.to(pId).emit('question_start', eventData);
        }
      }

      session.timer = setTimeout(() => {
        handleQuestionTimeout(roomId);
      }, questionMs);


    }

    function handleQuestionTimeout(roomId) {
      const session = gameSessions[roomId];
      if (!session) return;

      for (const pId in session.players) {
        const p = session.players[pId];
        if (!p.answeredCurrent) {
          p.answeredCurrent = true;
          p.combo = 0;
          p.lastAnswerInfo = {
            correct: false,
            scoreEarned: 0,
            combo: 0
          };
          if (!p.isBot) {
            io.to(pId).emit('answer_result', {
              correct: false,
              correctIndex: session.questions[session.currentQ].correctIndex,
              scoreEarned: 0,
              totalScore: p.totalScore,
              combo: 0,
              timeLeft: 0
            });
          }
        }
      }

      emitQuestionEnd(roomId);
    }

    function checkAllAnswered(roomId) {
      const session = gameSessions[roomId];
      if (!session) return;

      let allAnswered = true;
      for (const pId in session.players) {
        if (!session.players[pId].answeredCurrent) {
          allAnswered = false;
          break;
        }
      }

      if (allAnswered) {
        if (session.timer) clearTimeout(session.timer);
        emitQuestionEnd(roomId);
      }
    }

    function emitQuestionEnd(roomId) {
      const session = gameSessions[roomId];
      if (!session || session.phase !== 'playing') return;
      session.phase = 'question_end';
      const q = session.questions[session.currentQ];
      const scores = {};
      const playerResults = {};

      for (const pId in session.players) {
        const p = session.players[pId];
        scores[p.userId] = p.totalScore;
        if (p.lastAnswerInfo) {
          playerResults[p.userId] = {
            correct: p.lastAnswerInfo.correct,
            scoreEarned: p.lastAnswerInfo.scoreEarned,
            combo: p.lastAnswerInfo.combo
          };
        }
      }

      const endData = {
        correctIndex: q.correctIndex, explanation: q.explanation,
        scores,
        playerResults
      };

      for (const pId in session.players) {
        if (!session.players[pId].isBot) {
          const currentPlayer = session.players[pId];
          io.to(pId).emit('answer_result', { ...currentPlayer.lastAnswerInfo, totalScore: currentPlayer.totalScore, totalExpEarned: currentPlayer.totalExpEarned, timeLeft: 0, correctIndex: q.correctIndex });
          const oppId = Object.keys(session.players).find(id => id !== pId);
          const opponentPlayer = oppId ? session.players[oppId] : null;
          io.to(pId).emit('question_end', {
            ...endData,
            myScore: currentPlayer.totalScore,
            opponentScore: opponentPlayer ? opponentPlayer.totalScore : 0
          });
        }
      }

      session.transitionTimer = setTimeout(() => {
        startNextQuestion(roomId);
      }, transitionMs);
    }

    function endGame(roomId, defaultWinnerId = null, forfeitUserId = null) {
      const session = gameSessions[roomId];
      if (!session) return;

      clearTimeout(session.readyTimer);
      clearTimeout(session.timer);
      clearTimeout(session.transitionTimer);
      clearInterval(session.countTimer);
      for (const player of Object.values(session.players)) clearTimeout(player.disconnectTimer);
      const pIds = Object.keys(session.players);
      const p1 = session.players[pIds[0]];
      const p2 = session.players[pIds[1]];

      let winner = 'draw';
      if (defaultWinnerId) {
        winner = session.players[defaultWinnerId].userId;
      } else if (p1.totalScore > p2.totalScore) {
        winner = p1.userId;
      } else if (p2.totalScore > p1.totalScore) {
        winner = p2.userId;
      }

      const scores = {
        [p1.userId]: p1.totalScore,
        [p2.userId]: p2.totalScore
      };
      standings.record(roomId, [p1, p2], winner);

      const players = {};

      [p1, p2].forEach(p => {
        let expChange = p.totalExpEarned || 0;
        let coinsEarned = 0;

        if (winner === 'draw') {
          coinsEarned = 50;
        } else if (winner === p.userId) {
          coinsEarned = 100;
        } else {
          coinsEarned = 30;
        }

        const newExp = Math.max(0, p.exp + expChange);

        players[p.userId] = {
          userId: p.userId,
          username: p.username,
          totalScore: p.totalScore,
          correctCount: p.correctCount,
          maxCombo: p.maxCombo,
          expChange,
          coinsEarned,
          newExp
        };
      });

      for (const pId of pIds) {
        if (!session.players[pId].isBot) {
          const currentPlayer = session.players[pId];
          const oppId = pIds.find(id => id !== pId);
          const opponentPlayer = oppId ? session.players[oppId] : null;

          const isWin = winner === currentPlayer.userId;
          const isDraw = winner === 'draw';

          const gameOverData = {
            roomId, rewardsPersisted: false, mode: 'online-guest',
            winner,
            isWin,
            isDraw,
            forfeitedBy: forfeitUserId,
            scores,
            myScore: currentPlayer.totalScore,
            opponentScore: opponentPlayer ? opponentPlayer.totalScore : 0,
            players: {
              ...players,
              player: players[currentPlayer.userId],
              opponent: opponentPlayer ? players[opponentPlayer.userId] : null
            }
          };

          completed.set(pId, { data: gameOverData, expiresAt: Date.now() + 60000 });
          io.to(pId).emit('game_over', gameOverData);
          io.to(pId).emit('pvp_standings', standings.snapshot(currentPlayer));
          delete playerSessions[pId];
        }
      }

      delete gameSessions[roomId];
    }
  return () => {
    disposed = true;
    clearInterval(tick);
    for (const room of privateRooms.values()) clearTimeout(room.timer);
    for (const session of Object.values(gameSessions)) {
      clearTimeout(session.readyTimer); clearTimeout(session.timer); clearTimeout(session.transitionTimer); clearInterval(session.countTimer);
      for (const player of Object.values(session.players)) clearTimeout(player.disconnectTimer);
    }
  };
}
