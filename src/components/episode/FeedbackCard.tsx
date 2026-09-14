import type { ReactNode } from 'react'

export default function FeedbackCard({ correct, children }: { correct: boolean; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg p-4 animate-bubble-in" style={{ background: correct ? '#E8EEE3' : '#F3DEDA', borderLeft: `4px solid ${correct ? '#69705C' : '#A84D3F'}` }}>
      <div className="font-serif font-bold text-sm" style={{ color: correct ? '#4F5B43' : '#8C3C31' }}>{correct ? '✓ CHÍNH XÁC' : 'CHƯA CHÍNH XÁC'}</div>
      <div className="font-sans text-xs leading-relaxed mt-1" style={{ color: '#4B4035' }}>{children}</div>
    </div>
  )
}

