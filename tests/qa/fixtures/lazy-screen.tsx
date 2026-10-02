import { useState } from 'react'
export default function LazyScreen({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(false)
  return <section aria-label="Màn hình tải sau" className="space-y-3">
    <h1>Màn hình đã tải</h1>
    <button id="selected" onClick={() => setSelected(value => !value)} aria-pressed={selected}>Chọn nội dung</button>
    <button id="close-loaded" onClick={onClose}>Đóng màn hình</button>
  </section>
}
