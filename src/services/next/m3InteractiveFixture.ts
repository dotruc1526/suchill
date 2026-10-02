import type { LearningDocument, Lesson, MediaAsset } from '../../types/v2/content.ts'
import type { MockQuizFixture } from './mockQuiz.ts'
import type { MockMediaResource } from './mockMedia.ts'

/** Explicit technical fixtures for interaction QA. No canonical historical facts or media. */
const questionContent = [
  ['Bản thử nghiệm này sử dụng loại nội dung nào?', 'Fixture kỹ thuật để kiểm thử ứng dụng', 'Nội dung lịch sử canonical đã được nghiệm thu', 'Nội dung ở đây chỉ kiểm thử luồng ứng dụng, không phải lesson lịch sử phát hành.'],
  ['XP được ghi nhận ở bước nào?', 'Sau khi dịch vụ xác nhận hoạt động hợp lệ', 'Ngay khi mở một màn hình', 'Receipt từ dịch vụ xác nhận XP; mở màn hình không tự trao thưởng.'],
  ['Khi video gặp lỗi, bạn có thể học tiếp bằng cách nào?', 'Đọc nội dung thay thế và hoàn thành phần ôn tập', 'Chỉ tua tới cuối video', 'Nội dung thay thế được chuẩn bị cùng phần ôn tập để kiểm thử route media fallback.'],
]
const questions: MockQuizFixture['questions'] = questionContent.map(([prompt, correct, wrong, explanation], index) => {
  const id = `fixture.question.interaction.${index + 1}`
  return { id, prompt, explanation, status: 'published', difficulty: 'intro', sourceIds: [],
    optionIds: [`${id}.a`, `${id}.b`], options: [{ id: `${id}.a`, label: correct }, { id: `${id}.b`, label: wrong }] }
})
function assessment(id: string, title: string, mode: 'practice' | 'scored'): MockQuizFixture {
  return { status: 'published', set: { id, title, mode, questionIds: questions.map(item => item.id), learningObjectiveIds: [] }, questions,
    grade: input => {
      const feedback = questions.map(question => {
        const selected = input.answers.find(answer => answer.questionId === question.id)?.selectedOptionIds
        const correct = selected?.length === 1 && selected[0] === `${question.id}.a`
        return { questionId: question.id, outcome: correct ? 'correct' as const : 'incorrect' as const, explanation: question.explanation }
      })
      const score = feedback.filter(item => item.outcome === 'correct').length
      return { attemptId: `fixture.attempt:${id}:${input.operationId}`, score, total: questions.length, passed: score / questions.length >= 0.7, feedback }
    },
  }
}
export const interactiveQuizzes = [
  assessment('fixture.assessment.interaction.scored', 'Kiểm tra kỹ thuật · 3 câu', 'scored'),
  assessment('fixture.assessment.interaction.practice', 'Ôn tập hằng ngày · fixture kỹ thuật', 'practice'),
]
export const interactiveDocuments: LearningDocument[] = [{
  id: 'fixture.document.video-fallback', title: 'Ôn tập nội dung thay thế · fixture', locale: 'vi-VN', sourceIds: [], status: 'published',
  sections: [{ id: 'fixture.section.video-fallback', kind: 'key_points', items: [
    'Video này là fixture mô phỏng lỗi phát để kiểm thử nội dung thay thế.',
    'Mở và đọc bản chép lời, xác nhận phần ôn tập rồi chọn cách hoàn thành bằng nội dung thay thế.',
    'Dịch vụ kiểm tra điều kiện trước khi xác nhận hoàn thành; không có dữ kiện lịch sử canonical trong fixture.',
  ] }],
}]
export const interactiveLessons: Lesson[] = [
  { id: 'fixture.lesson.interaction.quiz', chapterId: 'fixture.chapter.1972', slug: 'fixture-quiz', title: 'Kiểm tra kỹ thuật · 3 câu',
    summary: 'Fixture chấm điểm, feedback, retry và thưởng một lần. Không phải bài lịch sử phát hành.',
    format: 'quiz', estimatedMinutes: 3, learningObjectiveIds: [], prerequisites: [], status: 'published',
    blocks: [{ id: 'fixture.block.interaction.quiz', order: 0, required: true, kind: 'quiz', questionSetId: interactiveQuizzes[0].set.id, assessmentMode: 'scored' }] },
  { id: 'fixture.lesson.interaction.practice', chapterId: 'fixture.chapter.1972', slug: 'fixture-daily-review', title: 'Ôn tập hằng ngày · fixture kỹ thuật',
    summary: 'Fixture practice 3 câu để kiểm thử xác nhận daily review theo tài khoản.',
    format: 'quiz', estimatedMinutes: 3, learningObjectiveIds: [], prerequisites: [], status: 'published',
    blocks: [{ id: 'fixture.block.interaction.practice', order: 0, required: true, kind: 'quiz', questionSetId: interactiveQuizzes[1].set.id, assessmentMode: 'practice' }] },
  { id: 'fixture.lesson.interaction.video', chapterId: 'fixture.chapter.1972', slug: 'fixture-video-fallback', title: 'Video và nội dung thay thế · fixture kỹ thuật',
    summary: 'Mô phỏng video lỗi, bản chép lời, ôn tập và accessible/media fallback. Không có media lịch sử canonical.',
    format: 'video', estimatedMinutes: 3, learningObjectiveIds: [], prerequisites: [], status: 'published',
    blocks: [
      { id: 'fixture.block.interaction.video', order: 0, required: true, kind: 'video', mediaAssetId: 'fixture.media.video-fallback', completionPolicy: 'watch_threshold' },
      { id: 'fixture.block.interaction.video-recap', order: 1, required: true, kind: 'recap', documentId: interactiveDocuments[0].id },
    ] },
]
export const interactiveMedia: MediaAsset[] = [
  { id: 'fixture.media.video-poster', kind: 'illustration', title: 'Poster trừu tượng · fixture kỹ thuật',
    storageRef: 'technical-fixtures/fallback-poster.svg', altText: 'Hình học trừu tượng ghi rõ video kỹ thuật mô phỏng lỗi phát.',
    sourceIds: [], attribution: 'Sử Chill · hình SVG tự tạo để kiểm thử kỹ thuật', license: 'CC0-1.0', reviewStatus: 'published' },
  { id: 'fixture.media.video-fallback', kind: 'video', title: 'Video kỹ thuật · mô phỏng lỗi phát',
    storageRef: 'technical-fixtures/intentionally-unavailable.mp4', posterMediaId: 'fixture.media.video-poster', durationSeconds: 60,
    transcriptRef: 'fixture.media.video-transcript', captionTrackRefs: ['fixture.media.video-captions'],
    caption: 'Fixture kỹ thuật: video được mô phỏng không khả dụng để kiểm thử nội dung thay thế.',
    sourceIds: [], attribution: 'Sử Chill · fixture tự tạo, không phải tư liệu lịch sử', license: 'CC0-1.0', reviewStatus: 'published' },
]
export const interactiveMediaResources: MockMediaResource[] = [
  { id: 'fixture.media.video-transcript', kind: 'transcript', storageRef: 'technical-fixtures/fallback-transcript.txt', locale: 'vi-VN', label: 'Bản chép lời fixture kỹ thuật', reviewStatus: 'published' },
  { id: 'fixture.media.video-captions', kind: 'caption', storageRef: 'technical-fixtures/fallback-captions.vtt', locale: 'vi-VN', label: 'Tiếng Việt · fixture kỹ thuật', reviewStatus: 'published' },
]
export const interactiveMediaUrls = {
  'technical-fixtures/fallback-poster.svg': '/technical-fixtures/fallback-poster.svg',
  'technical-fixtures/fallback-transcript.txt': '/technical-fixtures/fallback-transcript.txt',
  'technical-fixtures/fallback-captions.vtt': '/technical-fixtures/fallback-captions.vtt',
}
