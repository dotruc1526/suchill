import { createMockLearningServices, type MockQuizFixture } from './mock.ts'

export const practiceDemoSetId = 'demo.practice.sources.v1'
const items = [
  { id: 'demo.source', prompt: 'Khi đọc thông tin lịch sử, bạn nên kiểm tra điều gì?', labels: ['Nguồn và thời điểm của tài liệu', 'Chỉ số lượt thích', 'Chỉ tiêu đề'], explanation: 'Nguồn và thời điểm giúp đánh giá thông tin trong bối cảnh của tài liệu.' },
  { id: 'demo.compare', prompt: 'Khi hai tài liệu mô tả khác nhau về một sự kiện, bạn nên làm gì?', labels: ['Đối chiếu nguồn, bối cảnh và góc nhìn', 'Chọn tài liệu ngắn hơn', 'Bỏ qua mọi tài liệu'], explanation: 'Đối chiếu nguồn, bối cảnh và góc nhìn giúp hiểu vì sao các mô tả khác nhau.' },
  { id: 'demo.fiction', prompt: 'Đoạn hội thoại hư cấu trong bài học nên được trình bày thế nào?', labels: ['Ghi rõ là hư cấu minh họa', 'Coi là trích dẫn lịch sử', 'Không cần phân biệt'], explanation: 'Hư cấu minh họa cần được phân biệt rõ với tư liệu và trích dẫn lịch sử.' },
]

/** Isolated technical demo; never connected to account completion or rewards. */
export function createPracticeDemoServices() {
  const fixture: MockQuizFixture = {
    status: 'published',
    set: { id: practiceDemoSetId, title: 'Đọc hiểu tư liệu lịch sử', mode: 'practice', questionIds: items.map(item => item.id), learningObjectiveIds: [] },
    questions: items.map(item => ({ id: item.id, prompt: item.prompt,
      optionIds: item.labels.map((_, index) => `${item.id}.${index}`),
      options: item.labels.map((label, index) => ({ id: `${item.id}.${index}`, label })),
      explanation: item.explanation, sourceIds: [], difficulty: 'intro', status: 'published' })),
    grade: input => {
      const feedback = items.map(item => {
        const answer = input.answers.find(answer => answer.questionId === item.id)
        const correct = answer?.selectedOptionIds.length === 1 && answer.selectedOptionIds[0] === `${item.id}.0`
        return { questionId: item.id, outcome: correct ? 'correct' as const : 'incorrect' as const, explanation: item.explanation }
      })
      return { attemptId: `demo.${input.operationId}`, score: feedback.filter(item => item.outcome === 'correct').length, total: items.length, feedback }
    },
  }
  const { quiz } = createMockLearningServices({ chapters: [], lessons: [], storyVersions: [], mediaAssets: [], quizzes: [fixture] }, { userId: 'demo.practice' })
  return { quiz }
}
