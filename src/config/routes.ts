export type Tab = "home" | "practice" | "dautri" | "ai" | "profile"

export type View =
  | { type: "home" }
  | { type: "chapter"; chapterId: number }
  | { type: "lesson"; chapterId: number; lessonIdx: number }
  | { type: "lesson-done"; chapterId: number; lessonIdx: number }
  | { type: "quiz"; chapterId: number }
  | { type: "quiz-result"; score: number; total: number; chapterId: number }
