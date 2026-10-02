export const uuid = n => `70000000-0000-4000-8000-${String(n).padStart(12, '0')}`
export const ids = Object.freeze({
  chapter: uuid(10), draftChapter: uuid(11), lesson: uuid(20), vnLesson: uuid(21), videoLesson: uuid(22),
  quizLesson: uuid(23), mixedLesson: uuid(24), draftLesson: uuid(25),
  textBlock: uuid(30), vnBlock: uuid(31), videoBlock: uuid(32), quizBlock: uuid(33), recapBlock: uuid(34),
  mixedVideoBlock: uuid(35), draftBlock: uuid(36), document: uuid(40), recapDocument: uuid(41), draftDocument: uuid(42),
  story: uuid(50), version: uuid(51), start: uuid(52), check: uuid(53), end: uuid(54), wrong: uuid(55), correct: uuid(56),
  video: uuid(60), poster: uuid(61), caption: uuid(62), transcript: uuid(63), draftMedia: uuid(64),
  quiz: uuid(70), practice: uuid(71), unflaggedPractice: uuid(72), question1: uuid(73), question2: uuid(74), question3: uuid(75),
  correct1: uuid(76), wrong1: uuid(77), correct2: uuid(78), wrong2: uuid(79), correct3: uuid(80), wrong3: uuid(81),
})
export const mediaPrefix = 'hosted-technical/v1/'
export function quizAnswers(correct = true) {
  return [[ids.question1, ids.correct1, ids.wrong1], [ids.question2, ids.correct2, ids.wrong2],
    [ids.question3, ids.correct3, ids.wrong3]].map(([questionId, right, wrong]) => ({ questionId, selectedOptionIds: [correct ? right : wrong] }))
}
