import { m3JourneyServices } from './next/m3JourneyFixture'
import { OfflineQueue, type QueueStorage } from './offline/queue'
import { createOfflineLearningServices } from './offline/services'
import { createConfiguredLearningServices } from './supabase/client'

export function createLearningRuntime(env: Record<string, string | undefined>, storage: QueueStorage) {
  const configured = Boolean(env.VITE_SUPABASE_URL || env.VITE_SUPABASE_PUBLISHABLE_KEY)
  const base = configured ? createConfiguredLearningServices(env) : m3JourneyServices
  const runtime = createOfflineLearningServices(base, new OfflineQueue(storage))
  return { ...runtime, mode: configured ? 'supabase' as const : 'mock' as const }
}
