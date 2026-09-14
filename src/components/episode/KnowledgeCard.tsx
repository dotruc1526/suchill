import type { ReactNode } from 'react'

export default function KnowledgeCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-4" style={{ background: '#FFF9EC', border: '1px solid rgba(48,40,32,0.14)', boxShadow: '1px 2px 0 rgba(48,40,32,0.06)' }}>
      <div className="flex gap-3">
        <div className="font-serif font-bold text-lg" style={{ color: '#A84D3F' }}>{number}</div>
        <div>
          <div className="font-serif font-bold text-sm" style={{ color: '#35495B' }}>{title}</div>
          <div className="font-sans text-xs leading-relaxed mt-1.5" style={{ color: '#4B4035' }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

