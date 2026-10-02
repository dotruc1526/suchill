import React, { useEffect, useRef } from 'react'
import { theme } from '../../theme/tokens'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const getFocusable = () => Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )

    const focusables = getFocusable()
    ;(focusables[0] ?? dialogRef.current)?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (e.key !== 'Tab') return

      const currentFocusables = getFocusable()
      if (currentFocusables.length === 0) {
        e.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = currentFocusables[0]
      const last = currentFocusables[currentFocusables.length - 1]

      const focusIsOutside = !dialogRef.current?.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || focusIsOutside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || focusIsOutside)) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
      ref={dialogRef}
      tabIndex={-1}
      onClick={onClose}
      style={{ background: theme.colors.overlay }}
    >
      <div
        className="w-full max-w-sm rounded-lg p-5 paper-card shadow-xl relative animate-scale-up"
        style={{
          background: theme.colors.cardBg,
          border: `1.5px solid ${theme.colors.borderDark}`,
          boxShadow: theme.shadows.modal,
        }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div
            className="flex items-center justify-between pb-3 mb-3 border-b"
            style={{ borderBottomColor: theme.colors.borderLight }}
          >
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
