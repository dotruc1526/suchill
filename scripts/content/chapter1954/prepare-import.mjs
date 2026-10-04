import { readFile } from 'node:fs/promises'
import { rowCollector } from './identity.mjs'
import { addContentRows } from './content-rows.mjs'
import { addStoryMediaRows } from './story-media-rows.mjs'
import { withMediaSources } from './media-source-metadata.mjs'

export const insertOrder = Object.freeze([
  'public.learning_objectives','public.historical_sources','public.historical_claims','public.claim_sources',
  'public.learning_documents','public.document_sections','public.document_sources','public.media_assets',
  'public.media_sources','public.caption_tracks','public.transcripts','public.visual_novel_stories','public.story_versions',
  'public.scenes','public.scene_choices','private.scene_answer_keys','public.scene_sources','public.scene_claims',
  'public.story_objectives','public.story_sources','public.questions','public.question_options','private.question_answer_keys',
  'public.question_sources','public.question_sets','public.question_set_items','public.question_set_objectives',
  'public.chapters','public.chapter_objectives','public.lessons','public.lesson_objectives','public.lesson_prerequisites','public.lesson_blocks',
])

export async function loadImportInputs() {
  const read = async name => JSON.parse(await readFile(new URL(`../../../docs/content/${name}`, import.meta.url), 'utf8'))
  return { candidate: await read('chapter1954/CANONICAL-IMPORT-CANDIDATE.json'),
    sources: await read('chapter1954/SOURCE-REGISTER.json'), claims: await read('chapter1954/CLAIM-REGISTER.json'),
    media: await read('candidate1954-v2/manifest.json') }
}

export function prepareImport({ candidate, sources, claims, media }) {
  if (candidate.publicationAllowed !== false || [candidate.chapter, candidate.story, ...candidate.lessons,
    ...candidate.documents, ...candidate.questions].some(item => item.status !== 'in_review')) throw new Error('Only pending-review candidate preparation is allowed')
  if (candidate.lessons.length !== 7 || candidate.documents.length !== 14 || candidate.questions.length !== 20) throw new Error('Incomplete current seven-lesson candidate')
  const collector = rowCollector()
  const mediaSources = withMediaSources(sources)
  const references = addContentRows(candidate, mediaSources.register, claims, collector)
  const pendingBindings = addStoryMediaRows(candidate, media, collector, references)
  const rows = Object.fromEntries(insertOrder.map(table => [table, collector.tables.get(table) ?? []]))
  if ([...collector.tables.keys()].some(table => !insertOrder.includes(table))) throw new Error('Unknown normalized table')
  return { version: 'chapter1954-offline-import-v1', publicationAllowed: false, rows,
    identities: Object.fromEntries([...collector.identities].map(([uuid, domain]) => [domain, uuid])), pendingBindings,
    mediaSourceBindings: mediaSources.bindings }
}
