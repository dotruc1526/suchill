import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../../../src/index.css'
import { Button } from '../../../src/components/ui'
import { IntegratedLessonRenderer } from '../../../src/features/learning/journey/IntegratedLessonRenderer'
import { createMockLearningServices } from '../../../src/services/next/mock'
import { failure } from '../../../src/services/next/contracts'
import { soundService } from '../../../src/services/soundService'
import { playbackCatalog } from '../../member5/playback-fixtures'

const catalog = playbackCatalog()
const longText = 'Đây là nội dung kiểm thử kỹ thuật bằng tiếng Việt có dấu, kiểm tra cách xuống dòng khi người học sử dụng màn hình hẹp và phóng to nội dung.'
catalog.lessons[0].title = longText
catalog.lessons[0].summary = longText
catalog.lessons[0].blocks = ['practice', 'scored'].map((mode, order) => ({ kind: 'quiz' as const, id: mode, questionSetId: mode, assessmentMode: mode as 'practice' | 'scored', order, required: true }))
catalog.quizzes = (['practice', 'scored'] as const).map(mode => ({ status: 'published' as const,
  set: { id: mode, title: `${mode}: ${longText}`, mode, questionIds: [mode], learningObjectiveIds: [] },
  questions: [{ id: mode, prompt: longText, optionIds: ['a', 'b'], options: [{ id: 'a', label: longText }, { id: 'b', label: 'Phương án còn lại' }], explanation: longText, sourceIds: [], difficulty: 'intro' as const, status: 'published' as const }],
  grade: input => ({ attemptId: input.operationId, score: 1, total: 1, passed: true, feedback: [{ questionId: mode, outcome: 'correct' as const, explanation: longText }] }),
}))
const services = createMockLearningServices(catalog, { userId: 'qa-loop' })
const readLesson = services.lessons.getById
let release: (() => void) | undefined
let offline = false
services.lessons.getById = async id => {
  await new Promise<void>(resolve => { release = resolve })
  return offline ? failure('offline') : readLesson(id)
}
const practice = services.quiz.submitPracticeAttempt
let failPractice = true
services.quiz.submitPracticeAttempt = async input => {
  if (failPractice) { failPractice = false; return failure('offline') }
  return practice(input)
}
Object.assign(window, { loopFixture: {
  release: () => release?.(),
  offline: (value: boolean) => { offline = value },
  empty: () => { catalog.lessons[0].blocks = [] },
} })
function Fixture() {
  const [muted, setMuted] = useState(soundService.isMuted())
  return <div className="p-4 space-y-4 max-w-md mx-auto">
    <p>Technical fixture — no canonical content.</p>
    <Button data-testid="mute" aria-pressed={muted} onClick={() => setMuted(soundService.toggleMute())}>{muted ? 'BẬT ÂM THANH' : 'TẮT ÂM THANH'}</Button>
    <IntegratedLessonRenderer lessonId="lesson" services={services} headingRef={null} />
  </div>
}
createRoot(document.getElementById('root')!).render(<Fixture />)
