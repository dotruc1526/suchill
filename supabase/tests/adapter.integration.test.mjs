import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createSupabaseLearningServices } from '../../src/services/supabase/services.ts'
import { loadVisualNovel, advanceVisualNovel, chooseVisualNovel } from '../../src/features/visual-novel/v2/visualNovelModel.ts'
import { createTestDatabase, ids, read, command, quizAnswers } from './harness.mjs'

let db
before(async () => { db = await createTestDatabase() })
after(async () => { await db?.close() })

function adapter(initialUser = ids.userA) {
  let userId = initialUser
  const port = {
    rpc: async (name, args) => {
      try {
        const data = name === 'learning_read'
          ? await read(db, args.p_kind, args.p_id, args.p_secondary_id, userId)
          : await command(db, args.p_kind, args.p_input, userId)
        return { data, error: null }
      } catch (error) { return { data: null, error: { code: error.code, message: error.message } } }
    },
    auth: {
      getSession: async () => ({ data: { session: userId ? { user: { id: userId, user_metadata: {} } } : null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    storage: { from: bucket => ({ createSignedUrl: async path => ({ data: { signedUrl: `https://fixture.supabase.co/storage/v1/object/sign/${bucket}/${path}?token=technical` }, error: null }) }) },
  }
  return { services: createSupabaseLearningServices(port, { url: 'https://fixture.supabase.co', publishableKey: 'sb_publishable_fixture' }),
    switchUser: id => { userId = id } }
}

test('actual adapter consumes normalized SQL catalog and media DTOs without exposing answer keys', async () => {
  const { services } = adapter()
  const chapters = await services.chapters.listPublished()
  assert.ok(chapters.ok)
  assert.equal(chapters.value.length, 1)
  assert.ok(chapters.value[0].lessonRefs.every(ref => ref.id !== ids.draftLesson))
  const lesson = await services.lessons.getById(ids.lesson)
  assert.ok(lesson.ok)
  assert.equal(lesson.value.blocks[0].documentId, ids.document)
  assert.ok((await services.documents.getById(ids.document)).ok)
  const story = await services.stories.getVersion(ids.version)
  assert.ok(story.ok)
  const check = story.value.scenes.find(scene => scene.id === ids.check)
  assert.equal('isCorrect' in check.choices[0], false)
  assert.equal('explanation' in check.choices[0], false)
  const quiz = await services.quiz.getQuestionSet(ids.quiz)
  assert.ok(quiz.ok)
  assert.equal('explanation' in quiz.value.questions[0], false)
  const media = await services.media.getResolvedAsset(ids.video)
  assert.ok(media.ok)
  assert.match(media.value.url, /\/object\/sign\/published-media\//)
  assert.equal('storageRef' in media.value, false)
  assert.equal(media.value.captionTracks[0].locale, 'vi-VN')
  assert.equal(media.value.fallback.kind, 'transcript')
})

test('actual adapter completes explicit text policy and exact retry receives same confirmed receipt', async () => {
  const { services } = adapter()
  assert.deepEqual(await services.completion.completeLesson({ lessonId: ids.lesson, operationId: 'adapter-premature' }), { ok: false, error: 'validation' })
  const block = await services.completion.completeBlock({ lessonId: ids.lesson, blockId: ids.textBlock, operationId: 'adapter-read' })
  assert.ok(block.ok)
  const input = { lessonId: ids.lesson, operationId: 'adapter-finish' }
  const completed = await services.completion.completeLesson(input)
  assert.ok(completed.ok)
  assert.equal(completed.value.xpGranted, 10)
  assert.deepEqual(await services.completion.completeLesson(input), completed)
  const progress = await services.progress.getLessonProgress(ids.lesson)
  assert.ok(progress.ok)
  assert.equal(progress.value.status, 'completed')
  assert.deepEqual(progress.value.confirmedCompletedBlockIds, [ids.textBlock])
  const snapshot = await services.account.getSummary()
  assert.equal(snapshot.ok && snapshot.value.totalXp, 10)
})

test('actual VN model initializes and traverses trusted SQL feedback; adapter grades authored quiz', async () => {
  const { services } = adapter()
  const context = { lessonId: ids.vnLesson, blockId: ids.vnBlock, storyVersionId: ids.version }
  const start = await loadVisualNovel(services, context)
  assert.ok(start.ok)
  assert.equal(start.value.currentSceneId, ids.start)
  assert.equal(start.value.revision, 1)
  const advance = await advanceVisualNovel(services, context, start.value, 'adapter-vn-advance')
  assert.ok(advance.ok)
  const choice = await chooseVisualNovel(services, context, advance.value, ids.correct, 'adapter-vn-choice')
  assert.ok(choice.ok)
  assert.equal(choice.value.feedback.outcome, 'correct')
  assert.equal(choice.value.pendingSceneId, ids.end)
  const episode = await services.completion.completeBlock({ lessonId: ids.vnLesson, blockId: ids.vnBlock, operationId: 'adapter-vn-complete' })
  assert.ok(episode.ok)
  assert.equal(episode.value.xpGranted, 20)
  const graded = await services.quiz.submitScoredAttempt({ questionSetId: ids.quiz, operationId: 'adapter-quiz-pass', answers: quizAnswers() })
  assert.ok(graded.ok)
  assert.equal(graded.value.passed, true)
  assert.equal(graded.value.score, 3)
})

test('queued expected subject mismatch rejects before any other-user write or reward', async () => {
  const { services, switchUser } = adapter()
  switchUser(ids.userB)
  const receipt = await services.completion.completeBlock({ lessonId: ids.lesson, blockId: ids.textBlock, operationId: 'adapter-owner-race', expectedSubject: ids.userA })
  assert.deepEqual(receipt, { ok: false, error: 'unauthorized' })
  assert.equal(await read(db, 'lesson_progress', ids.lesson, null, ids.userB), null)
  const summary = await read(db, 'account', null, null, ids.userB)
  assert.equal(summary.totalXp, 0)
})
