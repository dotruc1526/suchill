import { icon, paperArt } from './icons.js'

const button = (id, label, primary = false, disabled = false, symbol) => `<button id="${id}" class="${primary ? 'primary' : 'secondary'}" ${disabled ? 'disabled' : ''}>${symbol ? icon(symbol) : ''}<span>${label}</span>${primary ? icon('arrow', 'button-arrow') : ''}</button>`
const progress = (step, label) => `<div class="progress"><div class="row"><small>${label}</small><small class="step-count">${step}<span> / 4</span></small></div><progress max="4" value="${step}" aria-label="Bước ${step} trên 4 của bài học"></progress></div>`
const intro = (step, format, title) => `<div class="screen-heading"><span class="eyebrow"><span>${String(step).padStart(2, '0')}</span>${format}</span><h1>${title}</h1></div>`
const choices = (options, selected, locked, feedback) => options.map(([id, label], i) => {
  const chosen = selected === id
  const outcome = feedback && chosen ? ` ${feedback}` : ''
  return `<button class="choice${chosen ? ' selected' : ''}${outcome}" data-choice="${id}" aria-pressed="${chosen}" ${locked ? 'disabled' : ''}><span class="choice-index" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span class="choice-label">${label}</span><span class="choice-mark" aria-hidden="true">${chosen ? icon(feedback === 'incorrect' ? 'cross' : 'check') : ''}</span></button>`
}).join('')
export const reflection = [['observe', 'Quan sát tư liệu trước, rồi đọc lời giải thích'], ['context', 'Đọc bối cảnh trước, rồi trở lại tư liệu']]
export const questions = [
  { id: 'source', title: 'Khi đọc một tư liệu, bạn cần xem gì để hiểu bối cảnh?', options: [['author', 'Người tạo, thời điểm và mục đích của tư liệu'], ['color', 'Chỉ màu sắc của tư liệu']] },
  { id: 'label', title: 'Đâu là cách trình bày rõ ràng khi có lời thoại hư cấu?', options: [['hide', 'Để người đọc tự đoán'], ['show', 'Gắn nhãn hư cấu và tách khỏi dữ kiện có nguồn']] },
]
export function chapter(s) {
  const steps = [['document', 'Đọc tư liệu', 'Đặt câu hỏi trước khi kết luận'], ['eye', 'Chọn góc nhìn', 'Tìm cách tiếp cận của riêng bạn'], ['play', 'Xem & đọc', 'Có phụ đề và bản chép lời'], ['quiz', 'Tự kiểm tra', 'Thử lại để hiểu rõ hơn']]
  return `<span class="eyebrow mascot-greeting">Hello, SỬu đây!</span><div class="chapter-hero"><h1>Theo dấu<br>một tư liệu</h1><div class="chapter-mascot"><img src="assets/suu.png" width="140" height="120" alt="SỬu, linh vật trâu đỏ của Sử Chill, đội nón lá, cầm sách và giơ ngón cái." decoding="async" fetchpriority="high"></div></div><p class="lead">Cùng SỬu học chậm, hiểu sâu.<br>Mỗi tư liệu mở ra một góc nhìn.</p>
    <div class="chapter-meta"><span>${icon('book')}Bài học đa định dạng</span><span>${icon('quiz')}4 hoạt động</span></div>
    <section class="card journey"><div class="section-title"><h2>Hôm nay bạn sẽ</h2><span class="label">Từng bước một</span></div><ol>${steps.map(([symbol, title, copy], i) => `<li><span class="journey-icon">${icon(symbol)}</span><div><h3>${title}</h3><small>${copy}</small></div><span class="journey-number">0${i + 1}</span></li>`).join('')}</ol></section>
    <div class="action-bar">${button('start', s.started ? 'Tiếp tục bài học' : 'Bắt đầu bài học', true)}<p class="action-hint">${icon('clock')}Tiến độ được giữ khi bạn rời bài.</p></div>`
}
export function lesson() {
  return `${intro(1, 'Đọc tư liệu', 'Bắt đầu bằng<br>một câu hỏi')}${progress(1, 'Đọc & suy ngẫm')}
    <article class="card reading-card"><div class="reading-title">${icon('document')}<span>Ghi chú từ bài học</span></div><h2>Tư liệu kể cho ta điều gì?</h2><p>Một tư liệu có thể mở ra nhiều câu hỏi. Trước khi kết luận, hãy nhìn kỹ người tạo, thời điểm và mục đích của nó.</p><p>Hãy thử phân biệt điều bạn trực tiếp quan sát được với điều bạn đang suy đoán.</p><div class="source">Dữ kiện có nguồn, diễn giải và lời thoại hư cấu cần được trình bày rõ ràng.</div></article>
    <details class="disclosure"><summary>${icon('book')}Nguồn và ghi chú${icon('chevron', 'disclosure-arrow')}</summary><p>Danh sách nguồn của bài học sẽ xuất hiện ở đây sau khi được duyệt.</p></details>
    <div class="action-bar">${button('next-vn', 'Tiếp tục · Chọn góc nhìn', true)}${button('exit', 'Tạm dừng và về chương', false, false, 'back')}</div>`
}
export function vn(s) {
  return `${intro(2, 'Visual Novel', 'Một tư liệu,<br>nhiều góc nhìn')}${progress(2, 'Chọn cách tiếp cận')}
    <div class="reflection-intro"><div class="reflection-art">${paperArt()}</div><p>Bạn muốn quan sát trước,<br>hay tìm hiểu bối cảnh trước?</p></div>
    <section class="card choice-card"><span class="label">Suy ngẫm · Không có đúng/sai</span><h2>Bắt đầu từ cách của bạn</h2><p class="muted">Chọn một cách tiếp cận để tiếp tục.</p><div class="stack">${choices(reflection, s.reflection, s.locked)}</div>
    ${s.locked ? `<div class="feedback neutral" role="status">${icon('check')}<div><strong>Đã ghi nhận lựa chọn</strong><p>${s.reflection === 'observe' ? 'Bạn sẽ quan sát tư liệu trước.' : 'Bạn sẽ đọc bối cảnh trước.'}</p></div></div>` : ''}</section>
    <div class="action-bar">${button(s.locked ? 'next-video' : 'lock', s.locked ? 'Tiếp tục · Video' : 'Ghi nhận lựa chọn', true, !s.reflection)}<div class="secondary-actions">${button('review-lesson', 'Xem lại', false, false, 'back')}${button('restart', 'Bắt đầu lại', false, false, 'restart')}</div></div>`
}
export const formatTime = value => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
export function video(s) {
  return `${intro(3, 'Xem & đọc', 'Quan sát<br>và lắng nghe')}${progress(3, 'Video & bản chép lời')}
    <section class="media-card"><div class="poster" role="img" aria-label="Khung poster video minh họa, chưa chứa media lịch sử"><div class="poster-art">${paperArt()}</div><div class="poster-caption"><span>THEO DẤU MỘT TƯ LIỆU</span><strong>Từ quan sát<br>đến bối cảnh</strong></div><span class="poster-play">${icon('play')}</span></div>
    <div class="media-controls"><div class="row"><small>Video minh họa</small><span id="time" class="timecode" aria-live="off">${formatTime(s.position)} / 1:00</span></div><label class="sr-only" for="seek">Vị trí phát</label><input id="seek" type="range" min="0" max="60" value="${s.position}" aria-valuetext="${formatTime(s.position)}">
    <div class="controls">${button('play', s.playing ? 'Tạm dừng' : 'Phát', false, false, s.playing ? 'pause' : 'play')}<button id="captions" aria-pressed="${s.captions}" class="${s.captions ? 'control-active' : ''}">${icon('captions')}Phụ đề</button></div>
    <label class="volume-row" for="volume">${icon('sound')}<span>Âm lượng</span><input id="volume" type="range" min="0" max="100" value="${s.volume}"></label></div></section>
    ${s.captions ? '<p class="caption">Quan sát tư liệu và ghi lại<br>điều bạn nhận thấy.</p>' : ''}
    <details id="transcript" class="disclosure"><summary>${icon('document')}Bản chép lời & mô tả hình${icon('chevron', 'disclosure-arrow')}</summary><p>Quan sát tư liệu. Ghi lại điều bạn nhìn thấy, rồi đối chiếu với bối cảnh và nguồn.</p><p>Mô tả hình: tư liệu kèm chú thích và thông tin nguồn đã duyệt.</p></details>
    <details class="disclosure"><summary>${icon('book')}Nguồn và quyền sử dụng${icon('chevron', 'disclosure-arrow')}</summary><p>Media phát hành cần nguồn, license và attribution. Khung minh họa chưa chứa media lịch sử.</p></details>
    <div class="action-bar">${button('next-quiz', 'Tiếp tục · Tự kiểm tra', true)}${button('exit', 'Tạm dừng và về chương', false, false, 'back')}</div>`
}
export function quiz(s) {
  const answered = questions.filter(q => s.answers[q.id]).length
  const ready = answered === questions.length
  return `${intro(4, 'Tự kiểm tra', 'Điều bạn<br>mang theo')}${progress(4, 'Luyện tập · Không phạt khi sai')}
    ${questions.map((q, i) => {
      const correct = s.answers[q.id] === ['author', 'show'][i]
      return `<section class="card question-card"><span class="question-number">CÂU ${i + 1}<span> / 2</span></span><h2>${q.title}</h2><div class="stack" data-question="${q.id}">${choices(q.options, s.answers[q.id], s.submitted, s.submitted ? (correct ? 'correct' : 'incorrect') : null)}</div>
      ${s.submitted ? `<div class="feedback ${correct ? 'correct' : 'incorrect'}" role="status">${icon(correct ? 'check' : 'cross')}<div><strong>${correct ? 'Đúng rồi' : 'Chưa đúng, thử lại nhé'}</strong><p>${i === 0 ? 'Người tạo, thời điểm và mục đích giúp hiểu bối cảnh tư liệu.' : 'Nhãn hư cấu giúp phân biệt lời thoại với dữ kiện có nguồn.'}</p></div></div>` : ''}</section>`
    }).join('')}
    <div class="action-bar">${s.submitted ? `${button('next-complete', 'Xem tổng kết bài học', true)}${button('retry-quiz', 'Làm lại để hiểu rõ hơn', false, false, 'restart')}` : `${button('submit', 'Nộp bài luyện tập', true, !ready)}<p class="action-hint">Đã trả lời ${answered}/2 câu${ready ? ' · Sẵn sàng nộp bài' : ' · Hãy chọn đủ 2 câu'}</p>`}</div>`
}
export function complete(s) {
  const confirmed = s.state === 'confirmed'
  return `<div class="completion-hero"><div class="completion-seal">${icon('book')}</div><span class="eyebrow">Tổng kết bài học</span><h1>Một góc nhìn mới.<br>Một bước tiến nhỏ.</h1><p class="muted">Giữ lại điều đã hiểu.<br>Trở lại khi bạn muốn khám phá thêm.</p></div>
    <section class="card recap"><h2>Điều bạn mang theo</h2><ul>${['Quan sát trước khi kết luận.', 'Đặt tư liệu trong bối cảnh.', 'Phân biệt dữ kiện và hư cấu.'].map(text => `<li>${icon('check')}<span>${text}</span></li>`).join('')}</ul></section>
    <div class="feedback confirmation" role="status">${icon(confirmed ? 'check' : 'clock')}<div><strong>${confirmed ? 'Kết quả đã được xác nhận' : 'Đang chờ xác nhận kết quả'}</strong><p>${confirmed ? 'Tiến độ đã được xác nhận trong mẫu giao diện này.' : 'XP và streak sẽ cập nhật sau khi hệ thống xác nhận.'}</p></div></div>
    <div class="action-bar">${button('exit', 'Về chương', true)}${button('review-lesson', 'Xem lại nội dung', false, false, 'book')}</div>`
}
export function stateView(state, screen) {
  const data = {
    loading: ['loading', 'Đang tải bài học', 'Đợi một chút nhé. Bạn có thể quay về chương trong lúc chờ.', 'Hủy và về chương'],
    error: ['warning', 'Chưa tải được nội dung', 'Tiến độ đã lưu vẫn được giữ. Hãy thử lại.', 'Thử lại'],
    offline: ['offline', 'Bạn đang ngoại tuyến', 'Tiếp tục với nội dung đã lưu hoặc bản đọc thay thế có sẵn.', 'Mở nội dung đã lưu'],
    empty: ['document', 'Nội dung chưa sẵn sàng', 'Bạn có thể quay về chương và chọn một bài học khác.', 'Về chương'],
  }[state]
  return `<section class="card state-card"><div class="state-icon${state === 'loading' ? ' busy' : ''}">${icon(data[0])}</div><span class="eyebrow">Cùng tiếp tục hành trình</span><h1>${data[1]}</h1><p role="status">${data[2]}</p>${button('state-action', data[3], true)}</section>${screen === 'video' && state === 'error' ? '<div class="poster fallback-poster" role="img" aria-label="Poster thay thế khi video lỗi">Video chưa tải được</div>' : ''}${state === 'offline' || (screen === 'video' && state === 'error') ? `<details open class="disclosure"><summary>${icon('document')}Bản đọc thay thế đã lưu${icon('chevron', 'disclosure-arrow')}</summary><p>Quan sát tư liệu, ghi lại điều bạn nhìn thấy và đối chiếu nguồn.</p><p>Mô tả hình: nội dung trực quan quan trọng được trình bày bằng chữ tại đây.</p></details>` : ''}`
}
