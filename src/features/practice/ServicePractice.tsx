import { useEffect, useState } from 'react'
import { Button, EmptyState, ErrorState, LoadingState } from '../../components/ui'
import type { LearningServices } from '../../services/next/backendContracts'
import { PracticeAssessment } from './PracticeAssessment'

export function ServicePractice({ services, onAccountChange }: { services: LearningServices; onAccountChange?: () => void }) {
  const [sets, setSets] = useState<Array<{ id: string; title: string }>>()
  const [selected, setSelected] = useState<string>()
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    setSets(undefined); setError(false)
    void (async () => {
      const chapters = await services.chapters.listPublished()
      if (!chapters.ok) { if (active) setError(true); return }
      const found = new Map<string, string>()
      for (const chapter of chapters.value) for (const ref of chapter.lessonRefs) {
        const lesson = await services.lessons.getById(ref.id)
        if (!lesson.ok) { if (active) setError(true); return }
        for (const block of lesson.value.blocks) if (block.kind === 'quiz') found.set(block.questionSetId, lesson.value.title)
      }
      if (active) setSets([...found].map(([id, title]) => ({ id, title })))
    })().catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [services, retry])
  if (error) return <ErrorState message="Chưa tải được bài ôn tập." onRetry={() => setRetry(value => value + 1)} />
  if (!sets) return <LoadingState message="Đang tải bài ôn tập..." />
  if (selected) return <section className="space-y-4 p-4"><Button variant="outline" onClick={() => { setSelected(undefined); onAccountChange?.() }}>VỀ ÔN TẬP</Button><PracticeAssessment services={services} questionSetId={selected} onAccountChange={onAccountChange} /></section>
  return <section className="space-y-4 p-4"><h1 className="text-xl font-bold">ÔN TẬP</h1>{sets.length === 0
    ? <EmptyState title="Chưa có bài ôn tập" message="Bài kiểm tra sẽ xuất hiện sau khi nội dung được duyệt." />
    : sets.map(set => <Button key={set.id} variant="secondary" onClick={() => setSelected(set.id)}>{set.title}</Button>)}</section>
}
