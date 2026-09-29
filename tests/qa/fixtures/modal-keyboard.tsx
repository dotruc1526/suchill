import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Modal } from '../../../src/components/ui/Modal'
import '../../../src/index.css'

function Fixture() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  return <>
    <button id="trigger" onClick={() => setOpen(true)}>Mở hộp thoại</button>
    <button id="outside">Ngoài hộp thoại</button>
    <Modal isOpen={open} onClose={() => setOpen(false)} title="Kiểm tra bàn phím">
      <label htmlFor="answer">Nội dung tiếng Việt</label>
      <input id="answer" />
      <button id="rerender" onClick={() => setCount(count + 1)}>Cập nhật {count}</button>
      <button id="last" onClick={() => setOpen(false)}>Hoàn tất</button>
    </Modal>
  </>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture /></React.StrictMode>)
