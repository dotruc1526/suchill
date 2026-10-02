# Phase 5 — Dữ liệu của app được gọi tên như thế nào?

**Status:** ĐÃ DUYỆT — 2026-09-22

## Phase này giải quyết điều gì?

Phase 5 tạo một bộ từ vựng chung cho Figma/frontend, backend, content writer và AI.

Ví dụ, nếu không có bộ quy tắc chung:

- Frontend gọi một phần là `story`.
- Backend gọi nó là `episode`.
- Người viết nội dung gọi nó là `lesson`.
- Progress chỉ lưu số thứ tự scene nên hỏng khi biên kịch chèn scene mới.

Phase 5 quy định rõ một chapter, lesson, story version, scene, choice, video và progress cần những thông tin nào.

## Cấu trúc dễ hình dung

```text
Chapter — Chương học
└── Lesson — Bài học
    ├── Text block
    ├── Visual Novel block → Story version → Scene → Choice
    ├── Video block
    └── Quiz block
```

Một lesson có thể chỉ có một loại nội dung hoặc phối hợp nhiều block.

## Những quyết định được đề xuất

### 1. ID ổn định

Mỗi chapter, lesson, scene, choice và media có ID dạng chuỗi ổn định. Không dùng vị trí trong mảng làm danh tính vì chèn một scene mới sẽ làm sai progress cũ.

### 2. Nội dung đã xuất bản không bị sửa trực tiếp

Story được xuất bản theo version:

```text
Story “Tên sự kiện”
├── Version 1 — đã xuất bản
└── Version 2 — đang chỉnh sửa
```

Người đang học Version 1 không bị chuyển giữa chừng sang bản nháp mới.

### 3. Scene có loại rõ ràng

- `narration`: lời dẫn.
- `dialogue`: lời thoại.
- `choice`: người học lựa chọn.
- `media`: ảnh/video/tư liệu.
- `debrief`: giải thích sau trải nghiệm.
- `end`: kết thúc episode.

### 4. Choice không phải lúc nào cũng đúng/sai

- Narrative: lựa chọn cách hành động/kể chuyện.
- Reflection: lựa chọn suy nghĩ.
- Branching: chuyển sang nhánh scene khác.
- Knowledge check: mới có đáp án đúng/sai và giải thích.

Nhờ vậy app không biến mọi quyết định đạo đức/lịch sử thành một đáp án “đúng tuyệt đối”.

### 5. Progress tách khỏi nội dung

Nội dung nói “episode có gì”; progress nói “tài khoản đã học đến đâu”. Hai phần không trộn vào nhau.

## Ví dụ

```text
Lesson: Bối cảnh trước sự kiện
├── Block 1: lời giới thiệu
├── Block 2: video 60 giây, bắt buộc
├── Block 3: Visual Novel version 1
│   ├── Scene mở đầu
│   ├── Scene lựa chọn góc nhìn
│   └── Debrief
└── Block 4: knowledge check
```

Mỗi block có ID riêng nên người dùng có thể thoát và tiếp tục đúng vị trí.

## Chưa làm trong Phase 5

- Chưa tạo bảng Supabase — thuộc Phase 6.
- Chưa quyết định chính xác API/RLS — thuộc Phase 6.
- Chưa chốt công thức XP, streak và analytics — thuộc Phase 7.
- Chưa sửa TypeScript source hiện tại.

## Bạn đang duyệt điều gì?

- Dùng Chapter → Lesson → Block làm cấu trúc học tập.
- Visual Novel dùng Story → immutable Version → Scene.
- Scene và choice dùng loại rõ ràng.
- Progress tham chiếu bằng ID ổn định.
- Media/source là dữ liệu dùng chung, không nhét URL và nguồn tùy ý trong từng component.

Nếu đồng ý, bạn trả lời:

> **Duyệt Phase 5 theo đề xuất.**

Nếu muốn đổi, chỉ cần nói phần nào chưa đúng với cách nhóm biên soạn nội dung.
