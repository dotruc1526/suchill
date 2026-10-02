import { type EpisodeStage, episodeQuestions } from "../models/episode"

const stageProgress: Record<EpisodeStage, number> = {
  intro: 0,
  video: 0,
  knowledge: 1,
  map: 2,
  quiz: 3,
  reward: 4,
}

export function getEpisodeProgress(stage: EpisodeStage): number {
  return stageProgress[stage]
}

export function isCorrectEpisodeAnswer(questionIndex: number, answerIndex: number): boolean {
  return episodeQuestions[questionIndex]?.correct === answerIndex
}

export function isFinalEpisodeQuestion(questionIndex: number): boolean {
  return questionIndex === episodeQuestions.length - 1
}
