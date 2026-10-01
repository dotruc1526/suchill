import type { Chapter, LearningDocument, Lesson } from '../../types/v2/content.ts'
import { createMockLearningServices } from './mock.ts'

const documents: LearningDocument[] = [
  {
    id: 'fixture.document.1972.context', title: 'Bối cảnh tháng 12 năm 1972', locale: 'vi-VN',
    sections: [{ id: 'fixture.section.1972.context.1', kind: 'paragraph', text: 'Nội dung kỹ thuật dùng để kiểm thử hành trình học trên mock service.' }],
    sourceIds: [], status: 'published',
  },
  {
    id: 'fixture.document.1972.recap', title: 'Điểm cần nhớ', locale: 'vi-VN',
    sections: [{ id: 'fixture.section.1972.recap.1', kind: 'key_points', items: ['Đọc nguồn', 'Phân biệt dữ kiện và diễn giải'] }],
    sourceIds: [], status: 'published',
  },
]

const lessons: Lesson[] = [
  {
    id: 'fixture.lesson.1972.context', chapterId: 'fixture.chapter.1972', slug: 'boi-canh-1972',
    title: 'Bối cảnh tháng 12 năm 1972', summary: 'Bài đọc kỹ thuật để kiểm thử điều hướng và resume.',
    format: 'standard', estimatedMinutes: 6, learningObjectiveIds: [], prerequisites: [], status: 'published',
    blocks: [{ id: 'fixture.block.1972.context.text', order: 0, required: true, kind: 'text', documentId: documents[0].id }],
  },
  {
    id: 'fixture.lesson.1972.recap', chapterId: 'fixture.chapter.1972', slug: 'on-tap-1972',
    title: 'Ôn tập nguồn và dữ kiện', summary: 'Bài recap kỹ thuật; renderer chi tiết thuộc M3-02.',
    format: 'standard', estimatedMinutes: 4, learningObjectiveIds: [], prerequisites: [], status: 'published',
    blocks: [{ id: 'fixture.block.1972.recap.text', order: 0, required: true, kind: 'recap', documentId: documents[1].id }],
  },
]

const chapters: Chapter[] = [{
  id: 'fixture.chapter.1972', slug: 'fixture-1972', title: 'Hành trình 1972',
  subtitle: 'Technical fixture — không phải nội dung canonical',
  summary: 'Chapter kỹ thuật dùng để phát triển luồng Home → Chapter → Lesson trên mock services.',
  historicalPeriodLabel: '1972', learningObjectiveIds: [], estimatedMinutes: 10, status: 'published',
  lessonRefs: lessons.map((lesson, order) => ({ id: lesson.id, order })),
}]

export const m3JourneyServices = createMockLearningServices(
  { chapters, lessons, documents, storyVersions: [], mediaAssets: [] },
  { userId: 'fixture.user.duong', locale: 'vi-VN' },
)
