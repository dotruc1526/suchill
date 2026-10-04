import { useEffect, useRef, useState } from 'react'
import { Button, Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import { lazyFeature } from '../../../app/LazyFeature'
import { StudyCompanion } from './StudyCompanion'
import { lessonSixCandidate } from '../../../services/reference1954/candidateLessons'

const PreviewNovel = lazyFeature(() => import('./PreviewNovel'))
export default function PreviewLessonSix() {
  const [step, setStep] = useState<'intro' | 'story' | 'debrief'>('intro')
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => { title.current?.focus() }, [step])
  return <div className="space-y-4" data-testid="preview1954-lesson-six">
    <p className="rounded-xl border p-3 text-sm" style={{ borderColor: theme.colors.primaryBorder, background: theme.colors.cardBg }}>Bài học mẫu đang xây dựng · Kịch bản demo có nhân vật hư cấu, chưa được duyệt thành bài học chính thức. Không tính XP.</p>
    <ol aria-label="Các phần của bài học" className="flex flex-wrap gap-2 text-xs">{['Giới thiệu', 'Visual Novel', 'Nhìn lại'].map((label, index) => <li key={label} className="rounded-full border px-3 py-2" aria-current={index === ['intro', 'story', 'debrief'].indexOf(step) ? 'step' : undefined} style={{ borderColor: theme.colors.borderMedium, fontWeight: index === ['intro', 'story', 'debrief'].indexOf(step) ? 'bold' : 'normal' }}>{index + 1}. {label}</li>)}</ol>
    {step === 'intro' && <Card className="space-y-4">
      <h2 ref={title} tabIndex={-1} className="text-lg font-bold outline-none">Từ chiến trường đến bàn đàm phán</h2>
      <p className="text-sm leading-7">Trong bản mẫu này, bạn sẽ đọc một câu chuyện minh họa về Genève, chọn lời đáp và xem phần giải thích. Nhân vật Minh và các lời thoại được dựng để thử cách học qua truyện.</p>
      <p className="text-sm leading-7">Hãy chú ý cách câu chuyện phân biệt giới tuyến quân sự tạm thời với biên giới quốc gia. Kịch bản và các diễn giải vẫn chờ review nội dung.</p>
      <Button className="w-full" onClick={() => setStep('story')}>BẮT ĐẦU VISUAL NOVEL</Button>
    </Card>}
    {step === 'story' && <PreviewNovel onBack={() => setStep('intro')} onComplete={() => setStep('debrief')} />}
    {step === 'debrief' && <Card className="space-y-4">
      <h2 ref={title} tabIndex={-1} className="text-lg font-bold outline-none">Nhìn lại câu chuyện</h2>
      <p className="text-sm leading-7">Bạn đã đi qua 5 cảnh và các lựa chọn của bản mẫu. Hãy thử kể lại bằng lời của mình: câu chuyện nói gì về tính tạm thời của giới tuyến, và vì sao những thỏa thuận cũng ảnh hưởng đến đời sống con người?</p>
      <p className="text-sm">Tiếp tục đọc phần giải thích và tự kiểm tra bên dưới. Lượt đọc này không ghi hoàn thành bài học hoặc cấp XP.</p>
      <Button variant="outline" className="w-full" onClick={() => setStep('story')}>ĐỌC LẠI CÂU CHUYỆN</Button>
    </Card>}
    {step !== 'story' && <StudyCompanion lesson={lessonSixCandidate} />}
  </div>
}
