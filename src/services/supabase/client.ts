import { createClient } from '@supabase/supabase-js'
import { readPublicSupabaseConfig } from '../next/clientConfig'
import { createSupabaseLearningServices } from './services'

export function createConfiguredLearningServices(env: Record<string, string | undefined>) {
  const config = readPublicSupabaseConfig(env)
  const client = createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  return createSupabaseLearningServices(client, config)
}
