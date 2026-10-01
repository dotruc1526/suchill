const button = (id, label, primary = false, disabled = false) => `<button id="${id}" class="${primary ? 'primary' : ''}" ${disabled ? 'disabled' : ''}>${label}</button>`
const progress = (step, label) => `<div class="progress"><div class="row"><small>${label}</small><small>${step}/4</small></div><progress max="4" value="${step}" aria-label="Tiến độ bài học"></progress></div>`
const choices = (options, selected, locked, feedback) => options.map(([id, label]) => {
  const chosen = selected === id
  const outcome = feedback && chosen ? ` ${feedback}` : ''
  return `<button class="choice${chosen ? ' selected' : ''}${outcome}" data-choice="${id}" aria-pressed="${chosen}" ${locked ? 'disabled' : ''}><span>${label}</span>${chosen ? `<span aria-hidden="true">${feedback === 'incorrect' ? '✗' : '✓'}</span>` : ''}</button>`
}).join('')
export const reflection = [['observe', 'Quan sát tư liệu trước, rồi đọc lời giải thích'], ['context', 'Đọc bối cảnh trước, rồi trở lại tư liệu']]
export const questions = [
  { id: 'source', title: 'Khi đọc một tư liệu, bạn cần xem gì để hiểu bối cảnh?', options: [['author', 'Người tạo, thời điểm và mục đích của tư liệu'], ['color', 'Chỉ màu sắc của tư liệu']] },
  { id: 'label', title: 'Đâu là cách trình bày rõ ràng khi có lời thoại hư cấu?', options: [['hide', 'Để người đọc tự đoán'], ['show', 'Gắn nhãn hư cấu và tách khỏi dữ kiện có nguồn']] },
]
export function chapter(s) {
  return `<span class="eyebrow">Hành trình học · 4 hoạt động</span><h1>Theo dấu<br>một tư liệu</h1><p class="muted">Đọc, quan sát và tự kiểm tra cách bạn tiếp cận một câu chuyện lịch sử.</p>
    <div class="art" aria-hidden="true"><div class="paper"><strong>TƯ LIỆU</strong><span></span><span></span><span></span></div></div>
    <div class="card"><span class="label">Bài học đa định dạng</span><h2>Từ quan sát đến góc nhìn</h2><p>Học từng bước. Bạn có thể rời bài và tiếp tục ở vị trí đang đọc.</p><ol><li>Đọc tư liệu</li><li>Chọn cách tiếp cận</li><li>Xem và đọc bản chép lời</li><li>Tự kiểm tra</li></ol></div>
    <div class="action-bar">${button('start', s.started ? 'Tiếp tục bài học' : 'Bắt đầu bài học', true)}</div>`
}
export function lesson() {
  return `<span class="eyebrow">01 / Đọc tư liệu</span><h1>Bắt đầu bằng<br>một câu hỏi</h1>${progress(1, 'Bài học đa định dạng')}
    <article class="card"><span class="label">Đọc & suy ngẫm</span><h2>Tư liệu kể cho ta điều gì?</h2><p>Một tư liệu có thể mở ra nhiều câu hỏi. Trước khi kết luận, hãy nhìn kỹ người tạo, thời điểm và mục đích của nó.</p><p>Hãy thử phân biệt điều bạn trực tiếp quan sát được với điều bạn đang suy đoán.</p><div class="source">Ghi chú đọc: dữ kiện có nguồn, diễn giải và lời thoại hư cấu cần được trình bày rõ ràng.</div></article>
    <details><summary>Nguồn và ghi chú</summary><p>Trong bài học phát hành, danh sách nguồn và nhãn nội dung xuất hiện tại đây.</p></details>
    <div class="action-bar">${button('next-vn', 'Tiếp tục · Chọn góc nhìn', true)}${button('exit', 'Tạm dừng và về chương')}</div>`
}
export function vn(s) {
  return `<span class="eyebrow">02 / Visual Novel</span><h1>Bạn muốn bắt đầu<br>từ đâu?</h1>${progress(2, 'Lựa chọn góc nhìn')}
    <div class="art" aria-hidden="true"><div class="paper"><strong>GÓC NHÌN</strong><span></span><span></span></div></div>
    <div class="card"><span class="label">Suy ngẫm · Không có đúng/sai</span><h2>Chọn cách tiếp cận của bạn</h2><p>Mỗi cách giúp bạn nhìn tư liệu theo một trình tự khác nhau.</p><div class="stack">${choices(reflection, s.reflection, s.locked)}</div>
    ${s.locked ? `<div class="feedback" role="status">Đã ghi nhận lựa chọn. ${s.reflection === 'observe' ? 'Bạn sẽ quan sát tư liệu trước.' : 'Bạn sẽ đọc bối cảnh trước.'} Khi quay lại, bạn có thể xem lựa chọn đã ghi nhận.</div>` : ''}</div>
    <div class="action-bar">${button(s.locked ? 'next-video' : 'lock', s.locked ? 'Tiếp tục · Video' : 'Ghi nhận lựa chọn', true, !s.reflection)}${button('review-lesson', 'Xem lại đoạn đọc')}${button('restart', 'Bắt đầu lại câu chuyện')}</div>`
}
export function video(s) {
  return `<span class="eyebrow">03 / Xem & đọc</span><h1>Quan sát<br>và lắng nghe</h1>${progress(3, 'Video & bản chép lời')}
    <div class="poster" role="img" aria-label="Khung poster video, hình tư liệu sẽ được chọn sau review"><div><b aria-hidden="true">▷</b><span>Khung video</span><br><small>Poster có mô tả thay thế</small></div></div>
    <div class="row"><span id="time" aria-live="off">${s.position}s / 60s</span><small>Vị trí đã lưu trong bản thiết kế</small></div>
    <label for="seek">Vị trí phát</label><input id="seek" type="range" min="0" max="60" value="${s.position}">
    <div class="controls">${button('play', s.playing ? 'Tạm dừng' : 'Phát (mô phỏng)')}${button('captions', s.captions ? 'Tắt phụ đề' : 'Bật phụ đề')}<label for="volume">Âm lượng <input id="volume" type="range" min="0" max="100" value="${s.volume}"></label></div>
    ${s.captions ? '<p class="caption">[Phụ đề mẫu] Quan sát tư liệu và ghi lại điều bạn nhận thấy.</p>' : ''}
    <details id="transcript"><summary>Đọc bản chép lời & mô tả hình</summary><p>Quan sát tư liệu. Ghi lại điều bạn nhìn thấy, rồi đối chiếu với bối cảnh và nguồn.</p><p>Mô tả hình: vùng video sẽ có tư liệu kèm chú thích và thông tin nguồn đã duyệt.</p></details>
    <details><summary>Nguồn và quyền sử dụng</summary><p>Media phát hành cần nguồn, license, attribution và reviewer. Khung này chưa chứa media lịch sử.</p></details>
    <div class="action-bar">${button('next-quiz', 'Tiếp tục · Tự kiểm tra', true)}${button('exit', 'Tạm dừng và về chương')}</div>`
}
export function quiz(s) {
  const ready = questions.every(q => s.answers[q.id])
  return `<span class="eyebrow">04 / Tự kiểm tra</span><h1>Điều bạn<br>mang theo</h1>${progress(4, 'Luyện tập · Không phạt khi sai')}
    ${questions.map((q, i) => `<section class="card"><span class="label">Câu ${i + 1} / 2</span><h2>${q.title}</h2><div class="stack" data-question="${q.id}">${choices(q.options, s.answers[q.id], s.submitted, s.submitted ? (s.answers[q.id] === ['author', 'show'][i] ? 'correct' : 'incorrect') : null)}</div>
    ${s.submitted ? `<p class="feedback ${s.answers[q.id] === ['author', 'show'][i] ? 'correct' : 'incorrect'}" role="status">${s.answers[q.id] === ['author', 'show'][i] ? '✓ Đúng' : '✗ Chưa đúng'}. ${i === 0 ? 'Người tạo, thời điểm và mục đích giúp hiểu bối cảnh tư liệu.' : 'Nhãn hư cấu giúp phân biệt lời thoại với dữ kiện có nguồn.'}</p>` : ''}</section>`).join('')}
    <div class="action-bar">${s.submitted ? `${button('retry-quiz', 'Làm lại để hiểu rõ hơn')}${button('next-complete', 'Xem tổng kết bài học', true)}` : `${button('submit', 'Nộp bài luyện tập', true, !ready)}<small>Trả lời cả 2 câu trước khi nộp.</small>`}</div>`
}
export function complete(s) {
  const confirmed = s.state === 'confirmed'
  return `<span class="eyebrow">Tổng kết bài học</span><h1>Một góc nhìn mới,<br>một bước tiến nhỏ.</h1><div class="card"><span class="label">Đã đi qua các hoạt động</span><h2>Bạn đã học được gì?</h2><ul><li>Quan sát trước khi kết luận.</li><li>Đặt tư liệu trong bối cảnh.</li><li>Phân biệt dữ kiện và hư cấu.</li></ul></div>
    <div class="feedback" role="status"><strong>${confirmed ? '✓ Kết quả đã được xác nhận' : '◷ Đang chờ xác nhận kết quả'}</strong><p>${confirmed ? 'Tiến độ đã được xác nhận trong mẫu giao diện này.' : 'Kết quả học đang chờ đồng bộ. XP và streak sẽ cập nhật sau khi hệ thống xác nhận.'}</p></div>
    <div class="action-bar">${button('exit', 'Về chương', true)}${button('review-lesson', 'Xem lại nội dung')}</div>`
}
export function stateView(state, screen) {
  const data = {
    loading: ['◌', 'Đang tải bài học', 'Bạn có thể quay về chương trong lúc chờ.', 'Hủy và về chương'],
    error: ['!', 'Chưa tải được nội dung', 'Tiến độ đã lưu vẫn được giữ. Hãy thử lại.', 'Thử lại'],
    offline: ['↯', 'Bạn đang ngoại tuyến', 'Chỉ mở được nội dung đã lưu hoặc bản đọc thay thế có sẵn.', 'Mở nội dung đã lưu'],
    empty: ['—', 'Nội dung chưa sẵn sàng', 'Bài học này chưa có nội dung để mở. Bạn có thể quay về chương.', 'Về chương'],
  }[state]
  return `<div class="card"><div class="state-icon${state === 'loading' ? ' busy' : ''}" aria-hidden="true">${data[0]}</div><h1>${data[1]}</h1><p role="status">${data[2]}</p>${button('state-action', data[3], true)}</div>${screen === 'video' && state === 'error' ? '<div class="poster" role="img" aria-label="Poster thay thế khi video lỗi">Video chưa tải được</div>' : ''}${state === 'offline' || (screen === 'video' && state === 'error') ? '<details open><summary>Bản đọc thay thế đã lưu</summary><p>Quan sát tư liệu, ghi lại điều bạn nhìn thấy và đối chiếu nguồn.</p><p>Mô tả hình: nội dung trực quan quan trọng được trình bày bằng chữ tại đây.</p></details>' : ''}`
}
