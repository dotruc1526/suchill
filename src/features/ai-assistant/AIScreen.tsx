import { useState, useRef, useEffect } from 'react'
import Mascot from '../../Mascot'
import { aiSuggestions, initialAIConversation } from '../../data'
import type { AIMessage } from '../../types'
import { theme } from '../../theme/tokens'
import { askHistoryAssistant } from '../../services/aiChatService'

export function AIScreen() {
  const [messages, setMessages] = useState<AIMessage[]>(initialAIConversation)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' })
  }, [messages, thinking])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    const userMsg: AIMessage = { role: 'user', text: trimmed }
    setMessages(m => [...m, userMsg])
    setInput('')
    setThinking(true)

    try {
      const [reply] = await Promise.all([
        askHistoryAssistant(trimmed),
        new Promise(resolve => setTimeout(resolve, 800)),
      ])
      setMessages(m => [...m, { role: 'ai', text: reply }])
    } catch {
      setMessages(m => [
        ...m,
        {
          role: 'ai',
          text: 'SỬu gặp chút trục trặc khi tra cứu kho sách, bạn hỏi lại nhé! 🐮',
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <Mascot decorative emotion="happy" size={48} />
          <div>
            <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>
              NGƯỜI DẪN CHUYỆN SỬU
            </div>
            <div className="font-sans text-xs" style={{ color: '#7A4020' }}>
              Hỏi SỬu bất cứ điều gì về lịch sử Việt Nam
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-4 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {aiSuggestions.map(s => (
            <button
              key={s}
              type="button"
              disabled={thinking}
              onClick={() => void sendMessage(s)}
              className="shrink-0 px-3 py-1.5 rounded-full font-sans text-xs whitespace-nowrap transition-transform active:scale-95 disabled:opacity-50"
              style={{
                border: '1.5px solid rgba(61,26,0,0.25)',
                background: '#FBF4E8',
                color: '#5A3010',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        role="log"
        tabIndex={0}
        aria-label="Hội thoại với SỬu"
        aria-live="polite"
        aria-relevant="additions text"
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && <Mascot decorative emotion="happy" size={40} className="shrink-0" />}
            <div
              className="max-w-[82%] rounded-2xl px-4 py-3 font-sans text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: msg.role === 'ai' ? '#FBF4E8' : '#8B1A1A',
                color: msg.role === 'ai' ? '#3D1A00' : '#F5E6D0',
                border: msg.role === 'ai' ? '1.5px solid rgba(61,26,0,0.15)' : 'none',
                borderRadius: msg.role === 'ai' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div role="status" className="flex items-end gap-2">
            <Mascot decorative emotion="thinking" size={40} animate />
            <div
              className="px-4 py-3 rounded-2xl font-sans text-sm animate-pulse"
              style={{
                background: '#FBF4E8',
                border: '1.5px solid rgba(61,26,0,0.15)',
                borderRadius: '18px 18px 18px 4px',
                color: theme.colors.textMuted,
              }}
            >
              Đang tra cứu kho tư liệu lịch sử... 📚
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 shrink-0">
        <div className="font-hand text-xs text-center" style={{ color: theme.colors.textMuted }}>
          Câu trả lời do AI tạo, có thể sai và chưa kèm nguồn trích dẫn. Hãy đối chiếu với tài liệu chính thống.
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 pb-4 pt-2 shrink-0 flex items-center gap-2"
        style={{ borderTop: '1.5px solid rgba(61,26,0,0.12)' }}
      >
        <input
          aria-label="Câu hỏi lịch sử"
          value={input}
          disabled={thinking}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && void sendMessage(input)}
          placeholder="Hỏi SỬu về lịch sử Việt Nam..."
          className="flex-1 px-4 py-2.5 rounded-full font-sans text-sm outline-none disabled:opacity-60"
          style={{
            background: '#FBF4E8',
            border: '1.5px solid rgba(61,26,0,0.2)',
            color: '#3D1A00',
          }}
        />
        <button
          aria-label="Gửi câu hỏi"
          type="button"
          disabled={thinking || !input.trim()}
          onClick={() => void sendMessage(input)}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-40"
          style={{ background: '#8B1A1A' }}
        >
          <span className="text-sm font-bold" style={{ color: '#F5E6D0' }}>
            ›
          </span>
        </button>
      </div>
    </div>
  )
}
