const PROGRESS_STORAGE_KEY = "su-chill-progress"

type StoredProgress = {
  xp: number
}

export function loadProgress(defaultXp: number): StoredProgress {
  try {
    const rawProgress = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!rawProgress) return { xp: defaultXp }

    const progress = JSON.parse(rawProgress) as Partial<StoredProgress>
    return { xp: typeof progress.xp === "number" ? progress.xp : defaultXp }
  } catch {
    return { xp: defaultXp }
  }
}

export function saveProgress(progress: StoredProgress): void {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  } catch {}
}
