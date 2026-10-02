import type { LearningServices, ScoredQuizSubmission } from '../../src/services/next/contracts.ts'
import type { MockCatalog } from '../../src/services/next/mock.ts'

export function accountCatalog(): MockCatalog {
  const questionIds = Array.from({ length: 10 }, (_, index) => `q${index}`)
  return {
    chapters: [],
    documents: ['document', 'recap'].map(id => ({ id, title: id, locale: 'vi-VN', sections: [
      { id: `${id}.section`, kind: 'paragraph', text: 'Technical fixture only.' },
    ], sourceIds: [], status: 'published' })),
    lessons: [
      { id: 'standard', chapterId: 'chapter', slug: 'standard', title: 'Standard', summary: '', format: 'standard',
        estimatedMinutes: 1, learningObjectiveIds: [], prerequisites: [], status: 'published',
        blocks: [{ id: 'text', kind: 'text', order: 0, required: true, documentId: 'document' }] },
      { id: 'mixed', chapterId: 'chapter', slug: 'mixed', title: 'Mixed', summary: '', format: 'mixed',
        estimatedMinutes: 1, learningObjectiveIds: [], prerequisites: [], status: 'published', blocks: [
          { id: 'vn', kind: 'visual_novel', order: 0, required: true, storyVersionId: 'story.v1' },
          { id: 'video', kind: 'video', order: 1, required: true, mediaAssetId: 'media', completionPolicy: 'watch_threshold' },
          { id: 'recap', kind: 'recap', order: 2, required: true, documentId: 'recap' },
        ] },
      { id: 'assessment', chapterId: 'chapter', slug: 'assessment', title: 'Assessment', summary: '', format: 'quiz',
        estimatedMinutes: 1, learningObjectiveIds: [], prerequisites: [], status: 'published',
        blocks: [{ id: 'quiz', kind: 'quiz', order: 0, required: true, questionSetId: 'set', assessmentMode: 'scored' }] },
    ],
    storyVersions: [{ id: 'story.v1', storyId: 'story', versionNumber: 1, status: 'published', startSceneId: 'start',
      learningObjectiveIds: [], sourceIds: [], createdAt: '2026-10-01T00:00:00Z', scenes: [
        { id: 'start', kind: 'narration', text: 'Fixture', nextSceneId: 'check', sourceIds: [], claimIds: [] },
        { id: 'check', kind: 'choice', prompt: 'Fixture', policy: 'continue_after_feedback', sourceIds: [], claimIds: [], choices: [
          { id: 'right', kind: 'knowledge_check', label: 'A', isCorrect: true, explanation: 'Feedback A', nextSceneId: 'end' },
          { id: 'wrong', kind: 'knowledge_check', label: 'B', isCorrect: false, explanation: 'Feedback B', nextSceneId: 'end' },
        ] },
        { id: 'end', kind: 'end', summary: 'End', sourceIds: [], claimIds: [] },
      ] }],
    mediaAssets: [{ id: 'media', kind: 'video', title: 'Fixture', storageRef: 'video.mp4', durationSeconds: 100,
      transcriptRef: 'transcript', sourceIds: [], reviewStatus: 'published' }],
    mediaResources: [{ id: 'transcript', kind: 'transcript', storageRef: 'transcript.html', label: 'Transcript', locale: 'vi-VN', reviewStatus: 'published' }],
    quizzes: [{ status: 'published', set: { id: 'set', title: 'Fixture', questionIds, learningObjectiveIds: [], mode: 'scored' },
      questions: questionIds.map(id => ({ id, prompt: id, optionIds: ['right', 'wrong'], options: [
        { id: 'right', label: 'A' }, { id: 'wrong', label: 'B' },
      ], explanation: 'Trusted explanation', sourceIds: [], difficulty: 'intro', status: 'published' })),
      grade(input) {
        const score = input.answers.filter(answer => answer.selectedOptionIds.length === 1 && answer.selectedOptionIds[0] === 'right').length
        return { attemptId: `attempt.${input.operationId}`, score, total: 10, passed: score >= 7,
          feedback: input.answers.map(answer => ({ questionId: answer.questionId,
            outcome: answer.selectedOptionIds[0] === 'right' ? 'correct' : 'incorrect', explanation: 'Trusted explanation' })) }
      },
    }],
  }
}
export const assessmentInput = (operationId: string, correct: number): ScoredQuizSubmission => ({ operationId, questionSetId: 'set',
  answers: Array.from({ length: 10 }, (_, index) => ({ questionId: `q${index}`, selectedOptionIds: [index < correct ? 'right' : 'wrong'] })),
})
export async function finishEpisode(services: LearningServices, suffix = '') {
  const context = { lessonId: 'mixed', blockId: 'vn', storyVersionId: 'story.v1' }
  await services.progress.saveEpisodeCheckpoint({ ...context, operationId: `advance${suffix}`, currentSceneId: 'check', visitedSceneIds: ['start'] })
  return services.progress.recordChoice({ ...context, operationId: `choice${suffix}`, sceneId: 'check', choiceId: 'right' })
}
