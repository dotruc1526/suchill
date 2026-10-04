import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { NovelStage } from '../../../src/features/learning/preview1954/NovelStage'
import type { VisualNovelStory } from '../../../src/features/visual-novel/types'

const story: VisualNovelStory = { id: 'qa.linear.navigation', title: 'QA', scenes: [
  { id: 'first', title: 'Cảnh đầu', text: 'Nội dung đầu.', backdrop: 'dawn', emotion: 'happy' },
  { id: 'final', title: 'Cảnh cuối', text: 'Nội dung cuối.', backdrop: 'dawn', emotion: 'happy' },
] }
function Fixture() {
  const [count, setCount] = useState(0)
  return <main><output data-testid="completion-count">{count}</output><NovelStage story={story} onBack={() => {}} onComplete={() => setCount(value => value + 1)} /></main>
}
createRoot(document.getElementById('root')!).render(<Fixture />)
