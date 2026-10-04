import { Backdrop } from '../../visual-novel/VisualNovelPlayer'
import type { SceneBackdrop } from '../../visual-novel/types'
import hall from '../../../assets/vn-preview/geneva-hall-v1.png'
import { theme } from '../../../theme/tokens'

export function NovelBackdrop({ type }: { type: SceneBackdrop }) {
  if (type === 'map') return <div className="px-3 pb-8"><Backdrop type="map" /></div>
  return <div className="relative h-64 sm:h-80 overflow-hidden">
    <img src={hall} alt="Tranh minh họa hư cấu: hành lang hội nghị, bàn viết và ánh sáng bên hồ." className="h-full w-full object-cover"
      style={{ objectPosition: type === 'table' ? 'left center' : 'center', filter: type === 'dawn' ? 'brightness(1.12)' : undefined }} />
    <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs" style={{ background: theme.colors.overlay, color: theme.colors.primaryText }}>MINH HỌA · KHÔNG PHẢI TƯ LIỆU</span>
  </div>
}
