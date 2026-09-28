import React, { useEffect } from 'react'
import { theme } from '../../theme/tokens'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg p-5 paper-card shadow-xl relative animate-scale-up"
        style={{
          background: theme.colors.cardBg,
          border: `1.5px solid ${theme.colors.borderDark}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(61,26,0,0.12)]">
            <h3 id="modal-title" className="font-serif font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-sm font-bold opacity-60 hover:opacity-100"
              style={{ color: theme.colors.textPrimary }}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  )
}
