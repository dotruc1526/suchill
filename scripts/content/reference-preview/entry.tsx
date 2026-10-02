/// <reference path="./preview-env.d.ts" />
import React from 'react'
import { createRoot } from 'react-dom/client'
import { VideoLessonPlayer } from '../../../src/features/learning/video/VideoLessonPlayer'
import { theme } from '../../../src/theme/tokens'
import './preview.css'
import metadata from 'virtual:reference1954-package'
import { createReferencePreviewServices, previewContext } from './services'

const services = createReferencePreviewServices(metadata, window.localStorage)
function Preview() {
  return <main id="main-content" tabIndex={-1} style={{ maxWidth: 480, margin: '0 auto', padding: theme.spacing.lg,
    color: theme.colors.textPrimary, background: theme.colors.appBg, minHeight: '100vh', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
    <header className="space-y-2" style={{ marginBottom: theme.spacing.lg }}>
      <p style={{ color: theme.colors.primary, fontWeight: 700 }}>SỬ CHILL</p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.35 }}>Xem thử nội bộ · Trước cơn bão</h1>
      <p>Tiến độ xem thử được lưu trên máy này.</p>
    </header>
    <VideoLessonPlayer services={services} context={previewContext} />
    <p style={{ marginTop: theme.spacing.base, color: theme.colors.textSecondary, fontSize: '.875rem' }}>
      Video có phụ đề trong hình. Nếu thấy phụ đề trùng nhau, bạn có thể tắt phụ đề bổ sung trong trình phát.
    </p>
  </main>
}
document.body.style.background = theme.colors.pageBg
createRoot(document.getElementById('root')!).render(<React.StrictMode><Preview /></React.StrictMode>)
