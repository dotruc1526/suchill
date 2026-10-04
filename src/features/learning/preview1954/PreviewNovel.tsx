import { NovelStage } from './NovelStage'
import { geneva1954Story } from '../../visual-novel/stories/geneva-1954'

// Preserve the existing technical script; do not load its unreviewed remote images.
const demo = { ...geneva1954Story, title: 'DEMO · Genève 1954',
  scenes: geneva1954Story.scenes.map(({ image: _image, ...scene }) => scene) }

export default function PreviewNovel({ onBack, onComplete = onBack }: { onBack: () => void; onComplete?: () => void }) {
  return <div>
    <p className="mb-3 text-xs">Kịch bản demo có nhân vật hư cấu · Không tính XP.</p>
    <NovelStage story={demo} onBack={onBack} onComplete={onComplete} />
  </div>
}
