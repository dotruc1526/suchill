import type { CurrentUserProfile, UserService } from '../../services/next/contracts'

export function formatHomeGreeting(profile: CurrentUserProfile | null): string {
  const name = profile?.displayName.trim()
  return name ? `XIN CHÀO, ${name}` : 'XIN CHÀO'
}

export async function loadHomeGreeting(users: UserService): Promise<string> {
  try {
    const result = await users.getCurrentProfile()
    return formatHomeGreeting(result.ok ? result.value : null)
  } catch {
    return 'XIN CHÀO'
  }
}
