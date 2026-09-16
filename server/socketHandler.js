import { v4 as uuidv4 } from 'uuid';
import { getRandomQuestions } from './questionsData.js';

const matchQueue = [];
const gameSessions = {};
const playerSessions = {};

const botNames = ["Học Giả Phố Cổ", "Sử Gia Đại Việt", "Tiến Sĩ Văn Miếu", "Trạng Nguyên Thăng Long", "Cống Sinh Quốc Tử Giám"];

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_queue', (data) => {
      const { userId, username, exp, level } = data;
      
      const existingIdx = matchQueue.findIndex(p => p.userId === userId);
      if (existingIdx !== -1) {
        matchQueue.splice(existingIdx, 1);
      }
      
      const newPlayer = { socketId: socket.id, userId, username, exp, level, joinedAt: Date.now(), botTimeout: null };
      
      let matchIdx = -1;
      for (let i = 0; i < matchQueue.length; i++) {
        if (Math.abs(matchQueue[i].exp - exp) <= 500) {
          matchIdx = i;
          break;
        }
      }
      
      if (matchIdx === -1 && matchQueue.length > 0) {
        matchIdx = 0;
      }
      
      if (matchIdx !== -1) {
        const opponent = matchQueue.splice(matchIdx, 1)[0];
        if (opponent.botTimeout) clearTimeout(opponent.botTimeout);
        createMatch(newPlayer, opponent);
      } else {
        matchQueue.push(newPlayer);
        
        newPlayer.botTimeout = setTimeout(() => {
          const idx = matchQueue.findIndex(p => p.socketId === socket.id);
          if (idx !== -1) {
            matchQueue.splice(idx, 1);
            const bot = {
              socketId: 'bot_' + uuidv4(),
              userId: 'bot_' + uuidv4(),
              username: botNames[Math.floor(Math.random() * botNames.length)],
              exp: exp + Math.floor(Math.random() * 200 - 100),
              level: level,
              isBot: true
            };
            createMatch(newPlayer, bot);
          }
        }, 10000);
        
        socket.emit('searching');
      }
    });

    socket.on('ready', (data) => {
      const roomId = playerSessions[socket.id];
      if (!roomId || !gameSessions[roomId]) return;
      
      const session = gameSessions[roomId];
      session.players[socket.id].ready = true;
      
      let allReady = true;
      for (const pId in session.players) {
        if (!session.players[pId].ready && !session.players[pId].isBot) {
          allReady = false;
        }
      }
      
      if (allReady && !session.started) {
        session.started = true;
        let countdownVal = 3;
        for (const pId in session.players) {
          if (!session.players[pId].isBot) {
            io.to(pId).emit('countdown', countdownVal);
          }
        }
        const countTimer = setInterval(() => {
          countdownVal -= 1;
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
        }, 1000);
      }
    });

    socket.on('submit_answer', (data) => {
      const { roomId, answerIndex } = data;
      const session = gameSessions[roomId];
      if (!session || !session.players[socket.id]) return;
      
      const playerState = session.players[socket.id];
      if (playerState.answeredCurrent) return;
      
      const question = session.questions[session.currentQ];
      const timeLeft = session.timerExpiresAt ? Math.max(0, Math.floor((session.timerExpiresAt - Date.now()) / 1000)) : 0;
      const timeTaken = 15 - timeLeft;
      
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
        correctIndex: question.correctIndex,
        scoreEarned,
        totalScore: playerState.totalScore,
        combo: playerState.combo,
        expEarned,
        totalExpEarned: playerState.totalExpEarned || 0,
        timeLeft
      };
      
      socket.emit('answer_result', playerState.lastAnswerInfo);
      
      const opponentId = Object.keys(session.players).find(id => id !== socket.id);
      if (opponentId && !session.players[opponentId].isBot) {
        io.to(opponentId).emit('opponent_answered', { hasAnswered: true });
      }
      
      checkAllAnswered(roomId);
    });

    socket.on('cancel_queue', () => {
      const idx = matchQueue.findIndex(p => p.socketId === socket.id);
      if (idx !== -1) {
        const p = matchQueue[idx];
        if (p.botTimeout) clearTimeout(p.botTimeout);
        matchQueue.splice(idx, 1);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      const idx = matchQueue.findIndex(p => p.socketId === socket.id);
      if (idx !== -1) {
        const p = matchQueue[idx];
        if (p.botTimeout) clearTimeout(p.botTimeout);
        matchQueue.splice(idx, 1);
      }
      
      const roomId = playerSessions[socket.id];
      if (roomId && gameSessions[roomId]) {
        const session = gameSessions[roomId];
        const opponentId = Object.keys(session.players).find(id => id !== socket.id);
        if (opponentId && !session.players[opponentId].isBot) {
           io.to(opponentId).emit('opponent_disconnected');
           setTimeout(() => {
             if (gameSessions[roomId]) {
                endGame(roomId, opponentId);
             }
           }, 30000);
        }
      }
    });

    function createMatch(player1, player2) {
      const roomId = uuidv4();
      const questions = getRandomQuestions(10);
      
      gameSessions[roomId] = {
        roomId,
        players: {
          [player1.socketId]: { ...player1, ready: false, totalScore: 0, combo: 0, maxCombo: 0, correctCount: 0, totalExpEarned: 0, answeredCurrent: false },
          [player2.socketId]: { ...player2, ready: player2.isBot, totalScore: 0, combo: 0, maxCombo: 0, correctCount: 0, totalExpEarned: 0, answeredCurrent: false }
        },
        questions,
        currentQ: -1,
        timer: null,
        started: false
      };
      
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
      
      session.currentQ += 1;
      
      if (session.currentQ >= 10) {
        return endGame(roomId);
      }
      
      Object.values(session.players).forEach(p => {
        p.answeredCurrent = false;
        p.lastAnswerInfo = null;
      });
      
      const q = session.questions[session.currentQ];
      const qToSend = { ...q };
      delete qToSend.correctIndex;
      
      const eventData = {
        questionNum: session.currentQ + 1,
        totalQuestions: 10,
        question: qToSend,
        timeLimit: 15
      };
      
      for (const pId in session.players) {
        if (!session.players[pId].isBot) {
          io.to(pId).emit('question_start', eventData);
        }
      }
      
      session.timerExpiresAt = Date.now() + 15000;
      session.timer = setTimeout(() => {
        handleQuestionTimeout(roomId);
      }, 15000);
      
      handleBotAnswers(roomId);
    }
    
    function handleBotAnswers(roomId) {
      const session = gameSessions[roomId];
      if (!session) return;
      
      const botId = Object.keys(session.players).find(id => session.players[id].isBot);
      if (botId) {
        const timeToAnswer = Math.random() * 10000 + 2000; 
        setTimeout(() => {
           if (!gameSessions[roomId] || gameSessions[roomId].currentQ !== session.currentQ) return;
           
           const bot = session.players[botId];
           if (bot.answeredCurrent) return;
           
           const isCorrect = Math.random() > 0.3; 
           const q = session.questions[session.currentQ];
           
           let answerIndex;
           if (isCorrect) {
             answerIndex = q.correctIndex;
           } else {
             const wrongs = [0, 1, 2, 3].filter(i => i !== q.correctIndex);
             answerIndex = wrongs[Math.floor(Math.random() * wrongs.length)];
           }
           
           const timeLeft = session.timerExpiresAt ? Math.max(0, Math.floor((session.timerExpiresAt - Date.now()) / 1000)) : 0;
           
           let scoreEarned = 0;
           let expEarned = 0;
           if (isCorrect) {
             scoreEarned = 100 + (timeLeft * 10) + (bot.combo * 20);
             bot.combo += 1;
             bot.correctCount += 1;
             if (bot.combo > bot.maxCombo) {
               bot.maxCombo = bot.combo;
             }
             expEarned = bot.combo >= 5 ? 40 : 20;
             bot.totalExpEarned = (bot.totalExpEarned || 0) + expEarned;
           } else {
             bot.combo = 0;
           }
           
           bot.totalScore += scoreEarned;
           bot.answeredCurrent = true;
           bot.lastAnswerInfo = {
             correct: isCorrect,
             scoreEarned,
             combo: bot.combo,
             expEarned,
             totalExpEarned: bot.totalExpEarned || 0
           };
           
           const opponentId = Object.keys(session.players).find(id => !session.players[id].isBot);
           if (opponentId) {
             io.to(opponentId).emit('opponent_answered', { hasAnswered: true });
           }
           
           checkAllAnswered(roomId);
           
        }, timeToAnswer);
      }
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
      if (!session) return;
      
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
        correctIndex: q.correctIndex,
        scores,
        playerResults
      };
      
      for (const pId in session.players) {
        if (!session.players[pId].isBot) {
          io.to(pId).emit('question_end', endData);
        }
      }
      
      setTimeout(() => {
        startNextQuestion(roomId);
      }, 3000);
    }
    
    function endGame(roomId, defaultWinnerId = null) {
      const session = gameSessions[roomId];
      if (!session) return;
      
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
          username: p.username,
          totalScore: p.totalScore,
          correctCount: p.correctCount,
          maxCombo: p.maxCombo,
          expChange,
          coinsEarned,
          newExp
        };
      });
      
      const gameOverData = {
        winner,
        scores,
        players
      };
      
      for (const pId of pIds) {
        if (!session.players[pId].isBot) {
          io.to(pId).emit('game_over', gameOverData);
          delete playerSessions[pId];
        }
      }
      
      delete gameSessions[roomId];
    }
  });
}
