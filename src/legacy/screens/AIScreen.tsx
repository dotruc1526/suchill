import { useEffect, useRef, useState } from 'react'
import Mascot from '../Mascot'
import { aiSuggestions, initialAIConversation } from '../data'
import type { AIMessage } from '../types'

export default function AIScreen() {
  const [messages, setMessages] = useState<AIMessage[]>(initialAIConversation)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' })
  }, [messages])

  const aiResponses: Record<string, string> = {
    '1954': 'Năm 1954 là bước ngoặt khi Chiến thắng Điện Biên Phủ (7/5/1954) buộc Pháp ký Hiệp định Genève, chấm dứt chiến tranh và tạm thời chia đôi Việt Nam tại vĩ tuyến 17.',
    'điện biên phủ': 'Chiến dịch Điện Biên Phủ (13/3–7/5/1954) do Đại tướng Võ Nguyên Giáp chỉ huy. Sau 56 ngày đêm chiến đấu, ta tiêu diệt hoàn toàn tập đoàn cứ điểm của Pháp — chiến thắng quân sự vĩ đại nhất thế kỷ XX!',
    'võ nguyên giáp': 'Đại tướng Võ Nguyên Giáp (1911–2013) là Tổng Tư lệnh Quân đội Nhân dân Việt Nam. Ông được coi là một trong những thiên tài quân sự lớn nhất thế kỷ XX, nổi tiếng với nghệ thuật chiến tranh nhân dân.',
    'genève': 'Hiệp định Genève ký ngày 21/7/1954 gồm các điểm chính: đình chỉ chiến sự, lập vĩ tuyến 17 làm ranh giới tạm thời, và tổ chức tổng tuyển cử thống nhất vào năm 1956.',
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: AIMessage = { role: 'user', text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setThinking(true)

    setTimeout(() => {
      const key = Object.keys(aiResponses).find(k => text.toLowerCase().includes(k))
      const reply = key
        ? aiResponses[key]
        : 'Đây là một câu hỏi thú vị! Mình đang tìm kiếm trong nguồn tư liệu lịch sử. Bạn có thể hỏi cụ thể hơn về một sự kiện, nhân vật hay giai đoạn lịch sử không? 📚'
      setMessages(m => [...m, { role: 'ai', text: reply }])
      setThinking(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <Mascot emotion="happy" size={48} />
          <div>
            <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>NGƯỜI DẪN CHUYỆN</div>
            <div className="font-sans text-xs" style={{ color: '#7A4020' }}>Hỏi mình bất cứ điều gì về lịch sử Việt Nam</div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-4 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {aiSuggestions.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="shrink-0 px-3 py-1.5 rounded-full font-sans text-xs whitespace-nowrap"
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && <Mascot emotion="happy" size={40} className="shrink-0" />}
            <div
              className="max-w-[78%] rounded-2xl px-4 py-3 font-sans text-sm leading-relaxed"
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
          <div className="flex items-end gap-2">
            <Mascot emotion="thinking" size={40} animate />
            <div
              className="px-4 py-3 rounded-2xl font-sans text-sm"
              style={{
                background: '#FBF4E8',
                border: '1.5px solid rgba(61,26,0,0.15)',
                borderRadius: '18px 18px 18px 4px',
                color: '#A0622A',
              }}
            >
              Đang tra cứu tư liệu...
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 shrink-0">
        <div className="font-hand text-xs text-center" style={{ color: '#A0622A' }}>
          Thông tin dựa trên nguồn tư liệu lịch sử đã kiểm chứng
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 pb-4 pt-2 shrink-0 flex items-center gap-2"
        style={{ borderTop: '1.5px solid rgba(61,26,0,0.12)' }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Hỏi về lịch sử Việt Nam..."
          className="flex-1 px-4 py-2.5 rounded-full font-sans text-sm outline-none"
          style={{
            background: '#FBF4E8',
            border: '1.5px solid rgba(61,26,0,0.2)',
            color: '#3D1A00',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#8B1A1A' }}
        >
          <span className="text-sm" style={{ color: '#F5E6D0' }}>›</span>
        </button>
      </div>
    </div>
  )
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
