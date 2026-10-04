const evidence = 'docs/content/preview1954-v1/SOURCE-NOTES.md; docs/content/M7-1954-SOURCE-REVIEW.md (official URLs/locators checked 2026-10-03; no historical acceptance)'
const navarreUrl = 'https://baotanglichsu.vn/vi/Articles/3097/13850/ke-hoach-na-va-va-chien-cuc-djong-xuan-1953-1954.html'

/** Import-only legacy identities; original research register and media manifest stay unchanged. */
export function withMediaSources(register) {
  const chapterSource = register.sources.find(source => source.id === 'SRC-1954-VNMH-NAVARRE-2013')
  if (!chapterSource || chapterSource.url !== navarreUrl) throw new Error('Legacy source alias evidence no longer matches chapter source')
  const legacySources = [
    { ...chapterSource, id: 'SRC-DBP54-01', citationText: `${chapterSource.title}; ${chapterSource.publisher}; ${navarreUrl}; same URL as ${chapterSource.id}; ${evidence}` },
    { id: 'SRC-DBP54-02', title: 'Thất bại kế hoạch Navarre và sự ra đời tập đoàn cứ điểm',
      publisher: 'Bảo tàng Chiến thắng LS ĐBP', author: 'Hồng Nhung', publishedDate: '2014-03-09', sourceType: 'curated_educational',
      url: 'https://svhttdl.dienbien.gov.vn/ditich/pages/2014/That-bai-cua-Ke-hoach-Navarre-va-su-ra-doi-cua-Tap-9937.aspx', accessedDate: '2026-10-03',
      citationText: `Hồng Nhung; Bảo tàng Chiến thắng LS ĐBP; 09-03-2014; strategic-decision paragraphs; ${evidence}` },
    { id: 'SRC-DBP54-03', title: 'FRUS 1952–1954, vol XIII part 1, document 395 — Annex A',
      publisher: 'U.S. Department of State, Office of the Historian', sourceType: 'primary',
      url: 'https://history.state.gov/historicaldocuments/frus1952-54v13p1/d395', accessedDate: '2026-10-03',
      citationText: `French Government memorandum, Paris 1 September 1953 (translation), Annex A pp770–773 and Annex4 pp775–776; parent State Department memorandum undated; ${evidence}` },
  ]
  if (legacySources.some(source => register.sources.some(existing => existing.id === source.id))) throw new Error('Duplicate legacy source identity')
  return { register: { ...register, sources: [...register.sources, ...legacySources] },
    bindings: legacySources.map(source => ({ id: source.id, url: source.url, evidence,
      ...(source.id === 'SRC-DBP54-01' ? { equivalentSourceId: chapterSource.id } : {}) })) }
}
