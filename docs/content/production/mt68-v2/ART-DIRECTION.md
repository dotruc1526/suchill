# Mậu Thân v2 — audio-first collage animation

## Brief và phạm vi

Trúc yêu cầu native vertical 9:16, cinematic historical collage, 2D cut-out, vintage Vietnamese scrapbook; hình chiếm phần lớn khung hình, keyword ngắn, subtitle nhỏ; SỬu nhất quán, motion nhỏ mỗi 1.5–3 giây. Warm cream/parchment/dark brown/faded red/olive/muted gold kết hợp dusty teal/blue/amber. Audio đã duyệt là timeline cố định.

9 MP3 nguyên bản được decode rồi nối sample theo thứ tự: không padding chờ hình, không atempo, không normalize, không sửa lời. Tổng 63.059592s. Lịch 110s của bản v1 được thay cho bản dựng v2 theo yêu cầu trực tiếp này; authoring snapshot không bị sửa. Subtitle ngắn được căn theo pause và nội suy âm tiết; cần nghe review bản cuối.

## Sequences

| Khoảng dự kiến | Mạch hình | Chuyển động / thay đổi |
|---|---|---|
| 0–6.23s | Phố thị, Mậu Thân 1968 | Push-in vào phố; keyword, SỬu chào/chỉ dẫn |
| 6.23–12.46s | Đọc tư liệu và chuẩn bị | Sổ tư liệu cut-out vào hình; pan và reaction |
| 12.46–19.77s | Hậu cần | Không gian storage minh họa; crate slide-in/parallax |
| 19.77–27.09s | Nhận vũ khí; đọc ảnh hiện trạng | Thêm crate, chuyển focus sang sổ; keyword phân biệt |
| 27.09–33.89s | Ba tên mục tiêu đầu | Icon biểu tượng xuất hiện lần lượt theo lời; mascot góc dưới, không che tên mục tiêu |
| 33.89–40.70s | Hai mục tiêu còn lại; giới hạn kết quả | Icon command/navy, keyword phân biệt tiến công/chiếm giữ |
| 40.70–48.67s | Khuôn viên và tòa nhà | Sơ đồ biểu tượng fence/office; vòng highlight, SỬu suy nghĩ |
| 48.67–55.90s | Bộc phá không nổ | Gate cut-out, keyword kết quả; camera tracking nhẹ |
| 55.90–63.06s | Hook sang Bài hai | SỬu chỉ dẫn, sổ nguồn, câu hỏi ngắn Kết quả ra sao? |

Camera và foreground chuyển độc lập để tạo parallax. Không bản đồ: nội dung đang liệt kê mục tiêu, không giải thích đường đi/tọa độ. Icon không phải mô hình kiến trúc thực tế. Minh họa và SỬu được gắn nhãn MINH HỌA HƯ CẤU; không đóng vai nhân chứng. Không nhạc/SFX mới.

## Prompt set / built-in imagegen

Prompt tạo plate gốc: INITIAL-PROMPTS.json. Sau inspect, redraw từng plate để giảm photorealism:

> Style-transfer edit. Use the attached image as composition reference. REDRAW the entire picture as an unmistakably flat 2D HAND-CUT PAPER COLLAGE for a youthful Vietnamese history animated short. Preserve the key objects, portrait 9:16 composition and color relationships, but simplify everything into LARGE CLEAN SCISSOR-CUT SILHOUETTES, layered colored paper pieces, only 3-4 flat tones per object, fine subtle paper grain, slight shadows only at paper layer edges. Visible overlapping paper edges, charming editorial animation production artwork, no photorealistic material, no 3D rendering, no realistic perspective details, no photographic lighting, no tiny ornate textural detail. Strong dusty teal, olive, cream, faded red and warm amber palette. Dramatic graceful shapes filling the frame, ample separation between foreground/midground/background for parallax. No words or letters, no cards, no boxes, no border. Make it look like handmade historical collage animation, NOT a photograph or a realistic painting. Keep exact vertical composition and high resolution.

Logistics redraw bổ sung: symbolic educational storage room, không tái dựng căn hầm thật; giữ crates/trần gỗ/đèn/doorway teal; no people/weapons/text.

SỬu dùng reference docs/engineering/m3-ux/assets/suu.png. Cheer dùng chính asset gốc. Hai pose thinking/pointing được built-in imagegen tạo nền transparent theo prompt:

> Identity-preserve edit for SỬu, the same cute Vietnamese buffalo mascot in the reference. Create a single isolated waist-up cut-out animation sprite on TRUE TRANSPARENT background, no white rectangle. Keep exact warm red and cream color palette, same buffalo muzzle and eye shape, same conical Vietnamese hat, same ornate circular Đông Sơn drum halo behind head, same friendly rounded silhouette, same flat 2D paper texture. Change ONLY the expression and arms pose. Maintain clean sharp alpha edges, high resolution, no extra characters, no text, no speech balloon, no symbols, no cast background shadow. Character is a fictional host, not a historical participant. Preserve every distinctive brand identity detail; complete head/hat/drum and arms within canvas.

- Thinking pose: thoughtful and curious, one hand under chin, other holding small closed book, mouth closed friendly smile, eyes open.
- Pointing pose: smart enthusiastic friend explaining something, one arm pointing clearly toward the upper right, other holding small closed book, both eyes open, friendly smile.

Final assets: assets/*-cutout.png, assets/suu-cheer.png, assets/suu-thinking.png, assets/suu-pointing.png. Mỗi output đã xem, alpha/identity ghi trong manifest. Dùng built-in imagegen; không CLI/API key. Original generated outputs giữ trong Codex generated_images; bản được dùng đã copy vào project.

## Review/publication

Source 07 chỉ xác nhận năm tên mục tiêu; source 02 sách vẫn candidate. Nguồn 01/03/04/05 theo source verdict hiện hành. Generated illustration không bổ sung chứng cứ/fact. Final historical/illustration/media/voice ID account/caption/device acceptance và service publication vẫn cần reviewer; package in_review, không published.
