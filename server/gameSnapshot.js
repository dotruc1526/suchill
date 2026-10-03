export function publicQuestion(question) {
  const { correctIndex, explanation, ...safe } = question;
  return safe;
}

export function gameSnapshot(session, playerId) {
  const player = session.players[playerId];
  const opponentId = Object.keys(session.players).find(id => id !== playerId);
  const opponent = session.players[opponentId];
  const question = session.questions[session.currentQ];
  const ended = session.phase === 'question_end';
  return {
    roomId: session.roomId, phase: session.phase,
    player: { userId: player.userId, username: player.username, exp: player.exp, level: player.level },
    opponent: { userId: opponent.userId, username: opponent.username, exp: opponent.exp, level: opponent.level, isBot: !!opponent.isBot },
    currentQuestion: question ? {
      questionNum: session.currentQ + 1, totalQuestions: session.questions.length,
      question: publicQuestion(question), timeLimit: session.questionMs / 1000,
      questionId: question.id, deadlineAt: session.timerExpiresAt,
    } : null,
    timeLeft: Math.max(0, Math.ceil((session.timerExpiresAt - Date.now()) / 1000) || 0),
    myScore: player.totalScore, opponentScore: opponent.totalScore,
    myCombo: player.combo, myExpEarned: player.totalExpEarned,
    selectedAnswer: player.selectedAnswer ?? null,
    answerResult: ended ? { ...player.lastAnswerInfo, correctIndex: question.correctIndex, explanation: question.explanation } : null,
    opponentAnswered: opponent.answeredCurrent, opponentConnected: opponent.connected !== false,
    countdown: session.countdown || 0, serverNow: Date.now(),
  };
}
