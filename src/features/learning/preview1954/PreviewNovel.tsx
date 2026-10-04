import { NovelStage } from './NovelStage'
import { lessonSixStory } from '../../../services/reference1954/lessonSixStory'

export default function PreviewNovel({ onBack, onComplete = onBack }: { onBack: () => void; onComplete?: () => void }) {
  return <div>
    <p className="mb-3 text-xs">Kịch bản demo có nhân vật hư cấu · Không tính XP.</p>
    <NovelStage story={lessonSixStory} onBack={onBack} onComplete={onComplete} />
  </div>
}
