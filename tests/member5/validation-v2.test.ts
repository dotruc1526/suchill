import test from 'node:test'
import assert from 'node:assert/strict'
import {
  validateChapter,
  validateLesson,
  validateMediaAsset,
  validateQuestion,
  validateQuestionSet,
  validateStoryVersion,
} from '../../src/services/contracts/validation.ts'
import type {
  Chapter,
  Lesson,
  MediaAsset,
  MultipleChoiceQuestion,
  QuestionSet,
  StoryVersion,
} from '../../src/types/v2/content.ts'

// --- Chapter Validation Tests ---
test('validateChapter accepts valid chapter and catches order/objective errors', () => {
  const validChapter: Chapter = {
    id: 'ch-01',
    slug: 'dien-bien-phu-tren-khong-1972',
    title: 'Điện Biên Phủ trên không 1972',
    summary: 'Tập kích chiến lược đường không và cuộc đối đầu 12 ngày đêm',
    historicalPeriodLabel: 'Kháng chiến chống Mỹ',
    learningObjectiveIds: ['clo-01', 'clo-02'],
    lessonRefs: [
      { id: 'ls-01', order: 0 },
      { id: 'ls-02', order: 1 },
    ],
    estimatedMinutes: 45,
    status: 'published',
  }

  // 1. Valid case
  const lookup = { lessonIds: new Set(['ls-01', 'ls-02']) }
  assert.deepEqual(validateChapter(validChapter, lookup), [])

  // 2. Duplicate order
  const dupOrder = {
    ...validChapter,
    lessonRefs: [
      { id: 'ls-01', order: 0 },
      { id: 'ls-02', order: 0 },
    ],
  }
  const dupErrors = validateChapter(dupOrder)
  assert.ok(dupErrors.some(e => e.code === 'lesson_ref_order'))

  // 3. Negative order
  const negOrder = {
    ...validChapter,
    lessonRefs: [{ id: 'ls-01', order: -1 }],
  }
  assert.ok(validateChapter(negOrder).some(e => e.code === 'lesson_ref_order'))

  // 4. Missing lesson reference in lookup
  const missingRefErrors = validateChapter(validChapter, { lessonIds: new Set(['ls-01']) })
  assert.ok(missingRefErrors.some(e => e.code === 'missing_lesson_reference'))

  // 5. Published chapter with no lessons
  const emptyChapter = { ...validChapter, lessonRefs: [] }
  assert.ok(validateChapter(emptyChapter).some(e => e.code === 'empty_chapter'))

  // 6. Published chapter with no objectives
  const noObjChapter = { ...validChapter, learningObjectiveIds: [] }
  assert.ok(validateChapter(noObjChapter).some(e => e.code === 'missing_objective'))
})

// --- Lesson Validation Tests ---
test('validateLesson checks block integrity, order, and references', () => {
  const validLesson: Lesson = {
    id: 'ls-02',
    chapterId: 'ch-01',
    slug: 'sam-2-vach-nhieu-tim-thu',
    title: 'Kíp chiến đấu SAM-2',
    summary: 'Visual Novel mô phỏng kíp chiến đấu tên lửa',
    format: 'visual_novel',
    estimatedMinutes: 15,
    learningObjectiveIds: ['clo-02'],
    prerequisites: [],
    status: 'published',
    blocks: [
      { id: 'blk-01', order: 0, required: true, kind: 'visual_novel', storyVersionId: 'sv-sam2-v1' },
      { id: 'blk-02', order: 1, required: true, kind: 'quiz', questionSetId: 'qs-sam2' },
    ],
  }

  const lookup = {
    storyVersionIds: new Set(['sv-sam2-v1']),
    questionSetIds: new Set(['qs-sam2']),
  }
  assert.deepEqual(validateLesson(validLesson, lookup), [])

  // Duplicate block order
  const dupBlockOrder = {
    ...validLesson,
    blocks: [
      { id: 'blk-01', order: 0, required: true, kind: 'text' as const, documentId: 'doc-1' },
      { id: 'blk-02', order: 0, required: true, kind: 'text' as const, documentId: 'doc-2' },
    ],
  }
  assert.ok(validateLesson(dupBlockOrder).some(e => e.code === 'block_order'))

  // Missing reference
  const missingRef = validateLesson(validLesson, { storyVersionIds: new Set(['sv-sam2-v1']), questionSetIds: new Set() })
  assert.ok(missingRef.some(e => e.code === 'missing_reference' && e.path === 'blocks[1]'))

  // Required video with optional completion policy
  const invalidVideo: Lesson = {
    ...validLesson,
    blocks: [
      {
        id: 'blk-03',
        order: 0,
        required: true,
        kind: 'video',
        mediaAssetId: 'med-01',
        completionPolicy: 'optional',
      },
    ],
  }
  assert.ok(validateLesson(invalidVideo, { mediaAssetIds: new Set(['med-01']) }).some(e => e.code === 'completion_policy'))
})

// --- StoryVersion Graph Validation Tests ---
test('validateStoryVersion verifies graph reachability and choice semantics', () => {
  const validStory: StoryVersion = {
    id: 'sv-sam2-v1',
    storyId: 'story-sam2',
    versionNumber: 1,
    status: 'published',
    startSceneId: 'sc-intro',
    learningObjectiveIds: ['clo-02'],
    sourceIds: ['src-01'],
    createdAt: '2026-09-28T00:00:00Z',
    publishedAt: '2026-09-29T00:00:00Z',
    scenes: [
      {
        id: 'sc-intro',
        kind: 'narration',
        text: 'Báo động phòng không...',
        sourceIds: [],
        claimIds: [],
        nextSceneId: 'sc-choice',
      },
      {
        id: 'sc-choice',
        kind: 'choice',
        prompt: 'Lựa chọn phương án xử lý nhiễu:',
        policy: 'continue_after_feedback',
        sourceIds: [],
        claimIds: [],
        choices: [
          {
            id: 'opt-kc-1',
            kind: 'knowledge_check',
            label: 'Đổi góc tà và bám sát dải nhiễu',
            isCorrect: true,
            explanation: 'Đúng theo quy tắc vạch nhiễu tìm thù.',
            nextSceneId: 'sc-end',
          },
          {
            id: 'opt-kc-2',
            kind: 'knowledge_check',
            label: 'Tắt đài radar ngay lập tức',
            isCorrect: false,
            explanation: 'Tắt radar sẽ mất dấu mục tiêu hoàn toàn.',
            nextSceneId: 'sc-end',
          },
        ],
      },
      {
        id: 'sc-end',
        kind: 'end',
        summary: 'Hoàn thành bài tập kíp chiến đấu.',
        sourceIds: [],
        claimIds: [],
      },
    ],
  }

  // 1. Valid case
  assert.deepEqual(validateStoryVersion(validStory), [])

  // 2. Start scene missing
  const missingStart = { ...validStory, startSceneId: 'sc-nonexistent' }
  assert.ok(validateStoryVersion(missingStart).some(e => e.code === 'start_scene'))

  // 3. Broken transition
  const brokenTrans = structuredClone(validStory)
  brokenTrans.scenes[0].nextSceneId = 'sc-missing'
  assert.ok(validateStoryVersion(brokenTrans).some(e => e.code === 'broken_transition'))

  // 4. Narrative choice carries isCorrect (Invariance violation)
  const invalidNarrative = structuredClone(validStory)
  const choiceScene = invalidNarrative.scenes[1]
  if (choiceScene.kind === 'choice') {
    choiceScene.choices = [
      {
        id: 'opt-narrative',
        kind: 'narrative',
        label: 'Quan sát trắc thủ',
        nextSceneId: 'sc-end',
        // @ts-expect-error Invariance test
        isCorrect: true,
      },
    ]
  }
  assert.ok(validateStoryVersion(invalidNarrative).some(e => e.code === 'narrative_correctness'))

  // 5. Knowledge check choice without correct answer
  const noCorrectKc = structuredClone(validStory)
  const kcScene = noCorrectKc.scenes[1]
  if (kcScene.kind === 'choice') {
    kcScene.choices[0].isCorrect = false
  }
  assert.ok(validateStoryVersion(noCorrectKc).some(e => e.code === 'answer_key'))

  // 6. Knowledge check missing explanation
  const noExplKc = structuredClone(validStory)
  const kcScene2 = noExplKc.scenes[1]
  if (kcScene2.kind === 'choice') {
    kcScene2.choices[0].explanation = '   '
  }
  assert.ok(validateStoryVersion(noExplKc).some(e => e.code === 'explanation'))

  // 7. Unreachable scene (orphan)
  const withOrphan = structuredClone(validStory)
  withOrphan.scenes.push({
    id: 'sc-orphan',
    kind: 'narration',
    text: 'Cảnh không ai tới được',
    sourceIds: [],
    claimIds: [],
    nextSceneId: 'sc-end',
  })
  assert.ok(validateStoryVersion(withOrphan).some(e => e.code === 'unreachable_scene'))

  // 8. No reachable end scene (e.g. infinite loop)
  const infiniteLoop = structuredClone(validStory)
  infiniteLoop.scenes = [
    {
      id: 'sc-intro',
      kind: 'narration',
      text: 'Vòng lặp 1',
      sourceIds: [],
      claimIds: [],
      nextSceneId: 'sc-loop2',
    },
    {
      id: 'sc-loop2',
      kind: 'narration',
      text: 'Vòng lặp 2',
      sourceIds: [],
      claimIds: [],
      nextSceneId: 'sc-intro',
    },
  ]
  assert.ok(validateStoryVersion(infiniteLoop).some(e => e.code === 'no_reachable_end'))
})

// --- MediaAsset Validation Tests ---
test('validateMediaAsset enforces accessibility and provenance for published assets', () => {
  const publishedImage: MediaAsset = {
    id: 'med-img-01',
    kind: 'image',
    title: 'Đài điều khiển tên lửa SAM-2',
    storageRef: 'storage://images/sam2-radar.jpg',
    sourceIds: ['src-01'],
    license: 'Public Domain',
    attribution: 'Bảo tàng PK-KQ',
    altText: 'Hình ảnh đài điều khiển tên lửa SAM-2 tại trận địa',
    reviewStatus: 'published',
  }
  assert.deepEqual(validateMediaAsset(publishedImage), [])

  // Missing altText for published image
  const noAlt = { ...publishedImage, altText: '' }
  assert.ok(validateMediaAsset(noAlt).some(e => e.code === 'media_accessibility'))

  // Missing attribution/source
  const noSource = { ...publishedImage, sourceIds: [] }
  assert.ok(validateMediaAsset(noSource).some(e => e.code === 'media_provenance'))

  // Video missing captions / transcript
  const invalidVideo: MediaAsset = {
    id: 'med-vid-01',
    kind: 'video',
    title: 'Phim tư liệu 1972',
    storageRef: 'storage://videos/1972.mp4',
    sourceIds: ['src-01'],
    license: 'CC-BY',
    attribution: 'VTV',
    reviewStatus: 'published',
    // Missing poster, transcript, captions
  }
  const videoErrors = validateMediaAsset(invalidVideo)
  assert.ok(videoErrors.some(e => e.code === 'media_accessibility'))
})

// --- Question and QuestionSet Validation Tests ---
test('validateQuestion and validateQuestionSet verify assessment contracts', () => {
  const validQuestion: MultipleChoiceQuestion = {
    id: 'q-01',
    prompt: 'Tên lửa SAM-2 được biên chế cho lực lượng nào?',
    optionIds: ['opt-a', 'opt-b', 'opt-c', 'opt-d'],
    explanation: 'SAM-2 là vũ khí phòng không chủ lực bảo vệ vùng trời.',
    sourceIds: ['src-01'],
    difficulty: 'standard',
    status: 'published',
  }

  assert.deepEqual(validateQuestion(validQuestion), [])

  // < 2 options
  const singleOpt = { ...validQuestion, optionIds: ['opt-a'] }
  assert.ok(validateQuestion(singleOpt).some(e => e.code === 'question_options'))

  // Empty explanation
  const noExpl = { ...validQuestion, explanation: '' }
  assert.ok(validateQuestion(noExpl).some(e => e.code === 'question_explanation'))

  // QuestionSet
  const validSet: QuestionSet = {
    id: 'qs-01',
    title: 'Kiểm tra kiến thức Kíp SAM-2',
    questionIds: ['q-01'],
    learningObjectiveIds: ['clo-02'],
    mode: 'scored',
  }

  const lookup = { questionIds: new Set(['q-01']) }
  assert.deepEqual(validateQuestionSet(validSet, lookup), [])

  // Missing question reference in lookup
  const missingQ = validateQuestionSet(validSet, { questionIds: new Set(['q-other']) })
  assert.ok(missingQ.some(e => e.code === 'missing_question_reference'))

  // Empty question set
  const emptySet = { ...validSet, questionIds: [] }
  assert.ok(validateQuestionSet(emptySet).some(e => e.code === 'empty_question_set'))
})
