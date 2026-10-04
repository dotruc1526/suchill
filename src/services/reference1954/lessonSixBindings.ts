export interface LessonSixBinding {
  sceneId: string
  boundary: 'fictional_narrative' | 'mixed_fiction_and_claims' | 'educational_explanation'
  claimsRequired: boolean
  claimIds: string[]
  sourceIds: string[]
  reviewStatus: 'needs_historical_review'
  note: string
}

const declaration = 'SRC-1954-GENEVA-DECL'
const ceasefire = 'SRC-1954-GENEVA-CEASE'
// Exact claim-register candidates; dates and temporary-line/election scope remain unaccepted.
const claimSources: Readonly<Record<string, readonly string[]>> = {
  'CLM-1954-06-002': [ceasefire, declaration],
  'CLM-1954-06-003': [declaration],
  'CLM-1954-06-004': [declaration],
}
const expectedClaims: Readonly<Record<string, readonly string[]>> = {
  arrival: [], 'map-17': ['CLM-1954-06-003'], letter: [],
  summary: ['CLM-1954-06-002', 'CLM-1954-06-003', 'CLM-1954-06-004'],
  dawn: ['CLM-1954-06-002', 'CLM-1954-06-004'], end: [],
}
export const lessonSixBindings: LessonSixBinding[] = [
  { sceneId: 'arrival', boundary: 'fictional_narrative', claimsRequired: false, claimIds: [], sourceIds: [], reviewStatus: 'needs_historical_review',
    note: 'Minh, thư ký và hành lang im lặng là tình huống hư cấu; không xác nhận cuộc họp cụ thể đêm20/7.' },
  { sceneId: 'map-17', boundary: 'mixed_fiction_and_claims', claimsRequired: true, claimIds: ['CLM-1954-06-003'], sourceIds: [declaration], reviewStatus: 'needs_historical_review',
    note: 'Đoạn6 xác nhận giới tuyến tạm thời. Hội thoại trưởng đoàn là hư cấu; chi tiết địa lý vĩ tuyến17/sôngBếnHải cần binding riêng trước canonical approval.' },
  { sceneId: 'letter', boundary: 'fictional_narrative', claimsRequired: false, claimIds: [], sourceIds: [], reviewStatus: 'needs_historical_review',
    note: 'Người mẹ, lá thư và phản ứng là hư cấu; không gắn claim07-004 về quyền chuyển vùng như bằng chứng cho trải nghiệm này.' },
  { sceneId: 'summary', boundary: 'mixed_fiction_and_claims', claimsRequired: true, claimIds: ['CLM-1954-06-002', 'CLM-1954-06-003', 'CLM-1954-06-004'], sourceIds: [ceasefire, declaration], reviewStatus: 'needs_historical_review',
    note: 'Header/footerhai văn kiện; Đoạn6/7. Lời nói và đóng dấu hư cấu. Tác động của chiến thắng lên đàm phán vẫn là review riêng, không được coi đã xác nhận nhờ claim06-006.' },
  { sceneId: 'dawn', boundary: 'educational_explanation', claimsRequired: true, claimIds: ['CLM-1954-06-002', 'CLM-1954-06-004'], sourceIds: [ceasefire, declaration], reviewStatus: 'needs_historical_review',
    note: 'Văn kiện đình chỉ chiến sự/tập kết và kế hoạch tổng tuyển cử; không khẳng định kết quả thực hiện. Hành động khép sổ là lời dẫn hư cấu.' },
  { sceneId: 'end', boundary: 'educational_explanation', claimsRequired: false, claimIds: [], sourceIds: [], reviewStatus: 'needs_historical_review',
    note: 'Recap kỹ năng đọc tên/ngày văn kiện; không bổ sung fact mới.' },
]

export function resolveLessonSixBindings(sceneIds: string[], knownSources: ReadonlySet<string>, bindings = lessonSixBindings) {
  const byId = new Map<string, LessonSixBinding>()
  for (const binding of bindings) {
    if (!sceneIds.includes(binding.sceneId)) throw new Error(`Unknown scene binding ${binding.sceneId}`)
    if (byId.has(binding.sceneId)) throw new Error(`Duplicate scene binding ${binding.sceneId}`)
    if (binding.reviewStatus !== 'needs_historical_review') throw new Error(`Unaccepted review boundary ${binding.sceneId}`)
    if (!['fictional_narrative', 'mixed_fiction_and_claims', 'educational_explanation'].includes(binding.boundary)) throw new Error(`Unknown truth boundary ${binding.sceneId}`)
    if (binding.claimsRequired !== ['map-17', 'summary', 'dawn'].includes(binding.sceneId)) throw new Error(`Invalid claim requirement ${binding.sceneId}`)
    if (new Set(binding.claimIds).size !== binding.claimIds.length || new Set(binding.sourceIds).size !== binding.sourceIds.length) throw new Error(`Duplicate scene references ${binding.sceneId}`)
    if (binding.boundary === 'fictional_narrative' && (binding.claimIds.length || binding.sourceIds.length)) throw new Error(`Fiction presented as sourced fact ${binding.sceneId}`)
    if (binding.claimsRequired && !binding.claimIds.length) throw new Error(`Missing factual claims ${binding.sceneId}`)
    if (binding.sourceIds.some(id => !knownSources.has(id))) throw new Error(`Unknown scene source ${binding.sceneId}`)
    for (const claimId of binding.claimIds) {
      if (!claimSources[claimId]) throw new Error(`Unknown scene claim ${claimId}`)
      if (claimSources[claimId].some(id => !binding.sourceIds.includes(id))) throw new Error(`Missing claim source ${claimId}`)
    }
    const exactClaims = expectedClaims[binding.sceneId]
    const exactSources = new Set(exactClaims.flatMap(id => claimSources[id]))
    if (binding.claimIds.length !== exactClaims.length || binding.claimIds.some(id => !exactClaims.includes(id))) throw new Error(`Claim does not match scene ${binding.sceneId}`)
    if (binding.sourceIds.length !== exactSources.size || binding.sourceIds.some(id => !exactSources.has(id))) throw new Error(`Source does not match scene ${binding.sceneId}`)
    byId.set(binding.sceneId, binding)
  }
  for (const id of sceneIds) if (!byId.has(id)) throw new Error(`Missing scene binding ${id}`)
  return byId
}
