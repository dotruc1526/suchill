import { useState } from 'react'
import Mascot from '../../Mascot'
import type { SceneBackdrop, SceneChoice, VisualNovelStory } from './types'

/**
 * Reusable Backdrop component for rendering scene imagery or SVG historical maps
 */
export function Backdrop({ type, image }: { type: SceneBackdrop; image?: string }) {
  if (image) {
    return (
      <div className="relative h-44 w-full overflow-hidden rounded-xl border-2 shadow-sm" style={{ borderColor: 'rgba(61,26,0,0.25)' }}>
        <img
          src={image}
          alt="Hình ảnh lịch sử Hiệp định Genève 1954"
          className="h-full w-full object-cover"
          style={{ filter: 'sepia(0.25) contrast(1.02) brightness(0.95)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(61,26,0,0.45))' }}
        />
      </div>
    )
  }

  if (type === 'map') {
    return (
      <div
        className="relative h-44 overflow-hidden rounded-xl border-2 shadow-sm"
        style={{ background: '#F5E6D0', borderColor: 'rgba(61,26,0,0.25)' }}
      >
        <div className="absolute left-4 top-3 font-hand text-xs font-bold" style={{ color: '#7A4020' }}>
          BẢN ĐỒ VIỆT NAM · VĨ TUYẾN 17 (1954)
        </div>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 180" aria-label="Bản đồ minh họa vĩ tuyến 17">
          <path
            d="M177 20 C151 36 165 49 153 62 C146 73 157 83 151 93 C142 108 157 116 149 128 C145 139 159 150 171 163 C178 171 194 166 194 155 C196 144 183 136 189 123 C195 109 180 101 188 89 C198 75 181 66 191 54 C203 40 195 26 177 20Z"
            fill="#D6BF9E"
            stroke="#7A4020"
            strokeWidth="2.5"
          />
          <path d="M104 90 L260 90" stroke="#C4341A" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="177" cy="90" r="6" fill="#C4341A" />
          <text x="265" y="94" fill="#C4341A" fontSize="11" fontWeight="700">
            VĨ TUYẾN 17
          </text>
          <text x="120" y="62" fill="#3D1A00" fontSize="11" fontWeight="700">
            MIỀN BẮC
          </text>
          <text x="119" y="123" fill="#3D1A00" fontSize="11" fontWeight="700">
            MIỀN NAM
          </text>
        </svg>
        <div
          className="absolute bottom-2 left-3 rounded-sm px-2 py-0.5 font-hand text-xs"
          style={{ background: 'rgba(251,244,238,0.9)', color: '#7A4020', border: '1px solid rgba(61,26,0,0.15)' }}
        >
          Đường đỏ: Giới tuyến quân sự tạm thời (Sông Bến Hải)
        </div>
      </div>
    )
  }

  const labels = {
    hall: 'HÀNH LANG HỘI NGHỊ GENÈVE',
    people: 'LÁ THƯ BÊN NGOÀI PHÒNG HỌP',
    table: 'BÀN ĐÀM PHÁN CUỐI ĐÊM',
    dawn: 'BÌNH MINH 21.07.1954',
    map: '',
  }
  const gradients = {
    hall: 'linear-gradient(135deg, #3D1A00 0%, #7A4020 100%)',
    people: 'linear-gradient(135deg, #7A4020 0%, #A0622A 100%)',
    table: 'linear-gradient(135deg, #2A1500 0%, #5A2A10 100%)',
    dawn: 'linear-gradient(135deg, #A0622A 0%, #E8D5BA 100%)',
    map: 'linear-gradient(135deg, #F5E6D0 0%, #E8D5BA 100%)',
  }
  const icon = type === 'people' ? '✉️' : type === 'dawn' ? '☀️' : '📜'

  return (
    <div
      className="relative h-44 overflow-hidden rounded-xl border-2 shadow-sm flex flex-col justify-between p-4"
      style={{ background: gradients[type], borderColor: 'rgba(61,26,0,0.2)' }}
    >
      <div className="font-hand text-sm font-bold tracking-wide" style={{ color: '#FBF4E8' }}>
        {labels[type]}
      </div>
      <div className="self-end text-5xl opacity-80">{icon}</div>
    </div>
  )
}

/**
 * Reusable Choice List Component with Color Highlighting (Green for correct/selected, Red for incorrect)
 */
export function ChoiceList({
  choices,
  selectedChoice,
  onSelect,
}: {
  choices: SceneChoice[]
  selectedChoice: SceneChoice | null
  onSelect: (choice: SceneChoice) => void
}) {
  return (
    <div className="space-y-2 pt-1">
      {choices.map(choice => {
        let bg = '#FBF4E8'
        let border = 'rgba(61,26,0,0.2)'
        let textColor = '#3D1A00'
        let opacity = 1
        const isSelected = selectedChoice === choice

        if (selectedChoice) {
          if (isSelected) {
            if (choice.correct === false) {
              bg = '#FDE8E4'
              border = '#C4341A'
              textColor = '#C4341A'
            } else {
              bg = '#E8F5E2'
              border = '#3A5A2A'
              textColor = '#3A5A2A'
            }
          } else {
            opacity = 0.5
            bg = '#EDD9B8'
          }
        }

        return (
          <button
            key={choice.label}
            onClick={() => onSelect(choice)}
            disabled={selectedChoice !== null}
            className="w-full rounded-sm p-3.5 text-left font-sans text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              background: bg,
              color: textColor,
              border: `1.5px solid ${border}`,
              boxShadow: isSelected ? '0 0 0 2px rgba(61,26,0,0.1)' : '1px 2px 0 rgba(61,26,0,0.06)',
              opacity,
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="leading-snug">{choice.label}</span>
              {isSelected && choice.correct === false && (
                <span className="font-bold text-base shrink-0" style={{ color: '#C4341A' }}>✗</span>
              )}
              {isSelected && choice.correct !== false && (
                <span className="font-bold text-base shrink-0" style={{ color: '#3A5A2A' }}>✓</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Reusable Visual Novel Player Component
 */
export default function VisualNovelPlayer({
  story,
  onBack,
  onComplete,
}: {
  story: VisualNovelStory
  onBack: () => void
  onComplete: () => void
}) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [feedback, setFeedback] = useState<SceneChoice | null>(null)
  const scene = story.scenes[sceneIndex]
  const isFactCheck = scene.choices?.some(choice => choice.correct !== undefined)

  const continueFromFeedback = () => {
    if (feedback?.correct === false) {
      setFeedback(null)
    } else {
      setFeedback(null)
      setSceneIndex(index => index + 1)
    }
  }

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{ background: '#F5E6D0' }}
    >
      {/* Top Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: '#8B1A1A' }}
      >
        <button
          onClick={onBack}
          className="font-sans text-sm font-bold"
          style={{ color: '#FBF4E8' }}
          aria-label="Quay lại"
        >
          ✕
        </button>
        <div
          className="h-2 flex-1 overflow-hidden rounded-full"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((sceneIndex + 1) / story.scenes.length) * 100}%`,
              background: '#F5E6D0',
            }}
          />
        </div>
        <span className="font-hand text-xs" style={{ color: 'rgba(245,230,208,0.9)' }}>
          {sceneIndex + 1} / {story.scenes.length}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Title */}
        <div
          className="text-center font-serif font-bold text-sm tracking-wider uppercase"
          style={{ color: '#8B1A1A' }}
        >
          {scene.title}
        </div>

        {/* Image / Backdrop */}
        <Backdrop type={scene.backdrop} image={scene.image} />

        {/* Mascot Dialogue */}
        <div className="flex items-end gap-3 animate-bubble-in">
          <Mascot emotion={scene.emotion} size={82} animate />
          <div
            className="flex-1 rounded-2xl rounded-bl-none p-4"
            style={{
              background: '#FBF4E8',
              border: '1.5px solid rgba(61,26,0,0.2)',
              boxShadow: '2px 3px 0 rgba(61,26,0,0.07)',
            }}
          >
            <div className="mb-1 font-hand text-xs font-bold" style={{ color: '#8B1A1A' }}>
              Sử Chill
            </div>
            <p className="font-sans text-sm leading-relaxed" style={{ color: '#3D1A00' }}>
              {scene.text}
            </p>
          </div>
        </div>

        {/* Choice Options with Color Highlighting */}
        {scene.choices && (
          <ChoiceList
            choices={scene.choices}
            selectedChoice={feedback}
            onSelect={setFeedback}
          />
        )}

        {/* End of Story Button */}
        {!scene.choices && (
          <button
            onClick={onComplete}
            className="w-full rounded-sm py-3.5 font-sans font-bold text-sm transition-transform active:scale-[0.97]"
            style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.08em' }}
          >
            KHÉP SỔ HÀNH TRÌNH ›
          </button>
        )}

        {/* Fact check note */}
        {isFactCheck && !feedback && (
          <div className="text-center font-hand text-xs" style={{ color: '#A0622A' }}>
            Hãy chọn đúng để biên bản được đi tiếp.
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div
            className="rounded-lg p-3.5 font-sans text-xs leading-relaxed animate-bubble-in paper-card"
            style={{
              background: feedback.correct === false ? '#FDE8E4' : '#E8F5E2',
              borderColor: feedback.correct === false ? '#C4341A' : '#3A5A2A',
              borderLeftWidth: '4px',
            }}
          >
            <div
              className="font-serif font-bold text-sm mb-1"
              style={{ color: feedback.correct === false ? '#C4341A' : '#3A5A2A' }}
            >
              {feedback.response}
            </div>
            {feedback.note && <div className="mt-1" style={{ color: '#3D1A00' }}>{feedback.note}</div>}
            <button
              onClick={continueFromFeedback}
              className="mt-3 w-full rounded-sm py-2.5 font-sans text-xs font-bold transition-transform active:scale-[0.98]"
              style={{
                background: feedback.correct === false ? '#C4341A' : '#3A5A2A',
                color: '#fff',
              }}
            >
              {feedback.correct === false ? 'ĐỌC LẠI VÀ CHỌN LẠI' : 'TIẾP TỤC ›'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
