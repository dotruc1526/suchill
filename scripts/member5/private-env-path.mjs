/** Reject tracked env files at any depth without reading their contents. */
export function isPrivateTrackedEnvPath(path) {
  return path !== '.env.example' && path.split('/').some(segment => /^\.env(?:\.|$)/.test(segment))
}
