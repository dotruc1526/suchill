export type ValidationIssue = { code: string; path: string; message: string }
export type ContentLookup = {
  chapterIds?: ReadonlySet<string>
  lessonIds?: ReadonlySet<string>
  approvedLessonIds?: ReadonlySet<string>
  documentIds?: ReadonlySet<string>
  approvedDocumentIds?: ReadonlySet<string>
  storyVersionIds?: ReadonlySet<string>
  approvedStoryVersionIds?: ReadonlySet<string>
  mediaAssetIds?: ReadonlySet<string>
  approvedMediaAssetIds?: ReadonlySet<string>
  questionSetIds?: ReadonlySet<string>
  approvedQuestionSetIds?: ReadonlySet<string>
  sourceIds?: ReadonlySet<string>
  approvedSourceIds?: ReadonlySet<string>
  claimIds?: ReadonlySet<string>
  approvedClaimIds?: ReadonlySet<string>
}

const publishStatuses = new Set(['draft', 'in_review', 'approved', 'published', 'archived'])

export function issue(code: string, path: string, message: string): ValidationIssue {
  return { code, path, message }
}

export function requireUnique(values: string[], path: string, code: string): ValidationIssue[] {
  const seen = new Set<string>()
  const errors: ValidationIssue[] = []
  for (const value of values) {
    if (!value.trim() || seen.has(value)) errors.push(issue(code, path, `Missing or duplicate identity: ${value || '<empty>'}`))
    seen.add(value)
  }
  return errors
}

export function requireStatus(status: string, path: string): ValidationIssue[] {
  return publishStatuses.has(status) ? [] : [issue('invalid_status', path, `Unknown publication status: ${status}`)]
}

export function checkReferences(
  values: string[],
  known: ReadonlySet<string> | undefined,
  path: string,
  code: string,
): ValidationIssue[] {
  return values.flatMap((value, index) => !value.trim() || (known && !known.has(value))
    ? [issue(code, `${path}[${index}]`, `Missing or unknown reference: ${value || '<empty>'}`)] : [])
}

export function requireLookup(lookup: ContentLookup, key: keyof ContentLookup, path: string): ValidationIssue[] {
  return lookup[key] ? [] : [issue('lookup_required', path, `A ${key} lookup is required to validate published content`)]
}
