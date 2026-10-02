import type { SupabaseClient } from '@supabase/supabase-js'
import type { PublicSupabaseConfig } from '../next/clientConfig.ts'
import type { LearningServices } from '../next/contracts.ts'
import { failure } from '../next/contracts.ts'
import { createSupabaseAuth } from './auth.ts'
import { createSupabaseMedia, publishedStoragePath } from './media.ts'
import { createLearningRpc } from './rpc.ts'

/** Adapter DTOs are projected in SQL; React sees only domain service contracts. */
export function createSupabaseLearningServices(client: SupabaseClient, config: PublicSupabaseConfig): LearningServices {
  const rpc = createLearningRpc((name, input) => client.rpc(name, input))
  async function command<T>(kind: string, input: object) {
    try {
      const session = await client.auth.getSession()
      if (session.error) return failure<T>('unauthorized')
      const expected = 'expectedSubject' in input ? input.expectedSubject : session.data.session?.user.id
      return rpc.command<T>(kind, { ...input, expectedSubject: expected ?? null })
    } catch { return failure<T>('server_error') }
  }
  return {
    chapters: { listPublished: () => rpc.read('chapters'), getById: id => rpc.read('chapter', id) },
    lessons: { getById: id => rpc.read('lesson', id) },
    documents: { getById: id => rpc.read('document', id) },
    stories: { getVersion: id => rpc.read('story', id) },
    media: createSupabaseMedia(rpc, async ref => {
      const { bucket, path } = publishedStoragePath(ref)
      const { data, error } = await client.storage.from(bucket).createSignedUrl(path, 3600)
      if (error || !data?.signedUrl) throw new Error('Media unavailable')
      return data.signedUrl
    }),
    users: { getCurrentProfile: () => rpc.read('profile') },
    progress: {
      getLessonProgress: id => rpc.read('lesson_progress', id),
      saveCheckpoint: input => command('save_lesson_checkpoint', input),
      getEpisodeProgress: id => rpc.read('episode_progress', id),
      saveEpisodeCheckpoint: input => command('save_episode_checkpoint', input),
      recordChoice: input => command('record_choice', input),
      getVideoProgress: (id, blockId) => rpc.read('video_progress', id, blockId),
      saveVideoPosition: input => command('save_video_position', input),
      getResumePoint: id => rpc.read('resume', id),
    },
    quiz: {
      getQuestionSet: id => rpc.read('quiz', id),
      submitPracticeAttempt: input => command('submit_practice', input),
      submitScoredAttempt: input => command('submit_scored', input),
    },
    completion: {
      completeBlock: input => command('complete_block', input),
      completeLesson: input => command('complete_lesson', input),
      completeDailyReview: input => command('complete_daily_review', input),
    },
    account: {
      getSummary: () => rpc.read('account'),
      getSettings: () => rpc.read('settings'),
      updateSettings: input => command('update_settings', input),
    },
    auth: createSupabaseAuth(client),
    analytics: { async track(event) { try { await command('track', event) } catch { /* optional telemetry */ } } },
  }
}
