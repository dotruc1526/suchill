import type { EntityId, Locale, PublishStatus } from './content.ts'

/** Ordered authored sections use stable IDs; array position is never their identity. */
export type DocumentSection =
  | { id: EntityId; kind: 'paragraph'; text: string }
  | { id: EntityId; kind: 'heading'; text: string; level: 2 | 3 }
  | { id: EntityId; kind: 'key_points'; items: string[] }

/** Plain text is a paragraph section; richer layouts retain the same document ID. */
export type LearningDocument = {
  id: EntityId
  title: string
  locale: Locale
  sections: DocumentSection[]
  sourceIds: EntityId[]
  status: PublishStatus
}
