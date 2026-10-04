import type { DraftView } from './catalog'

export interface StudySection {
  id: string
  title: string
  paragraphs: string[]
  sourceIds: string[]
}

export interface StudyCheck {
  id: string
  prompt: string
  choices: { id: string; text: string }[]
  answerId: string
  explanation: string
  sourceIds: string[]
}

export interface CandidateLesson {
  id: string
  version: string
  objective: string
  sections: StudySection[]
  checks: StudyCheck[]
  takeaway: string
  reflection: string
}

export type CandidateDraftLessons = Record<DraftView, CandidateLesson>
