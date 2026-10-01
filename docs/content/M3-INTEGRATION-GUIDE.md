# TÀI LIỆU HƯỚNG DẪN TÍCH HỢP NỘI DUNG CHO MILESTONE 3 (M3 INTEGRATION GUIDE)
> **Dành cho:** Dương (Member 4 — Frontend Learning) & Hưng (Member 3 — Frontend Architecture)\
> **Người biên soạn:** Thọ (Member 1 — Content Lead)\
> **Mục đích:** Hướng dẫn ánh xạ tài liệu tác giả (authoring assets) Chapter 1972 sang mock adapter / domain fixtures, tuân thủ đúng ranh giới kiến trúc `UI -> Service -> Mock Adapter`\
> **Chuẩn kiến trúc:** Phase 5 Domain Contracts (`src/services/next/contracts.ts`) & Phase 7 Reward / Progress Spec\
> **Ngày cập nhật:** 01/10/2026

---

## 1. NGUYÊN TẮC RANH GIỚI KIẾN TRÚC (ARCHITECTURE BOUNDARIES)

Để đảm bảo tính toàn vẹn của hệ thống, frontend UI tuyệt đối **không** import trực tiếp các tệp JSON hay Markdown từ thư mục `docs/content`. Luồng dữ liệu chuẩn hóa gồm 3 tầng:

$$\text{Authoring Asset (docs/content)} \xrightarrow{\text{Adapter Mapping}} \text{Domain Fixture / Mock Store} \xrightarrow{\text{LearningServices}} \text{UI Component}$$

1. **Ranh giới dịch vụ (`LearningServices`):**
   - Mọi tương tác của UI (`HomeScreen`, `StandardLessonScreen`, `VisualNovelPlayer`, `QuizScreen`) đều đi qua các interfaces đã được nghiệm thu trong `src/services/next/contracts.ts` (`ChapterService`, `LessonService`, `DocumentService`, `VisualNovelService`, `QuizService`, `ProgressService`, `UserService`).
2. **Ranh giới thẩm quyền phần thưởng & kết quả (Trusted Receipt):**
   - UI **không tự tính điểm, không tự xác định `passed`, không tự cộng XP hay tự trao huy hiệu**.
   - Kết quả đánh giá bài thi do `QuizService` trả về qua **`ScoredQuizReceipt`** gồm các trường: `{ attemptId, score, total, passed, feedback }`.
   - Tỷ lệ phần trăm có thể được UI tính cho mục đích hiển thị từ `Math.round((score / total) * 100)`.
   - Phần thưởng điểm kinh nghiệm (XP) và chuỗi học tập (Streak) được xử lý thông qua service tiến độ/người dùng (`ProgressService` / `UserService`), tách biệt khỏi receipt trắc nghiệm.
3. **Trạng thái tài liệu:**
   - Các tệp trong `docs/content/` là sản phẩm của Content Lead đang trong quá trình thẩm định (`REVIEW`). Việc nạp thành fixture chính thức trong runtime phụ thuộc vào quyết định nghiệm thu của Trúc (Historical Reviewer) và Product Owner.

---

## 2. BẢNG ÁNH XẠ NGUYÊN LIỆU TÁC GIẢ VÀO DOMAIN FIXTURE

| Bài học | Tệp Authoring của Thọ | Service phụ trách | Domain Entity / Contract | Ranh giới chuyển giao UI |
|---|---|---|---|---|
| **Bài 1 (Video)** | `SCREENPLAY-1972.md`<br>`CAPTIONS-1972.vtt` | `MediaService`<br>`LessonService` | `MediaAsset`<br>`Lesson` (`format: 'video'`) | URL video, WebVTT subtitle tracks, text-first fallback card |
| **Bài 2 (VN)** | `LESSON-02-1972-STORY.json`<br>`DIAGRAM-SAM2-1972.json` | `VisualNovelService`<br>`ProgressService` | `StoryVersion` (8 scenes)<br>Interactive Diagram (5 nodes) | Scene nodes, narrative choices, knowledge check, checkpoint session |
| **Bài 3 (Standard)** | `LESSON-03-1972-STANDARD.md` | `DocumentService`<br>`LessonService` | `DomainDocument` (`doc-1972-03-standard`) | Structured content blocks, comparison table, reflection questions |
| **Bài 4 (Quiz)** | `QUIZ-1972.json` | `QuizService` | `QuestionSet`<br>`MultipleChoiceQuestion` | `DeliveredQuestion` (bảo mật answer key, nộp bài nhận receipt) |

---

## 3. HƯỚNG DẪN KỸ THUẬT CHI TIẾT TỪNG BÀI HỌC

### 3.1. Bài 1: Video Bài Học "Tối hậu thư từ bầu trời" (`lsn-1972-01`)
- **Tích hợp:** UI gọi `lessonService.getById('lsn-1972-01')` để lấy thông tin bài học và `mediaService.getResolvedAsset(mediaAssetId)` để lấy tài nguyên video/phụ đề đã được phân giải URL an toàn.
- **Text-first Fallback:** Nếu video chưa sẵn sàng hoặc người học chọn đọc nhanh, adapter cung cấp fallback tóm tắt kịch bản từ Phần 5 của `SCREENPLAY-1972.md`.

### 3.2. Bài 2: Visual Novel "SAM-2: Vạch nhiễu tìm thù" (`lsn-1972-02`)
- **Đồ thị phân cảnh (8 scenes cố định):**
  - Danh sách scene ID chuẩn hóa: `sam2-v1-briefing`, `sam2-v1-crew`, `sam2-v1-perspective`, `sam2-v1-coordination`, `sam2-v1-interference`, `sam2-v1-check`, `sam2-v1-debrief`, `sam2-v1-end`.
  - Node bắt đầu: `sam2-v1-briefing`; Node kết thúc: `sam2-v1-end`.
  - **Luồng học tuyến tính:** Người học tiếp cận lần lượt nội dung hiệp đồng (`sam2-v1-coordination`) và bối cảnh gây nhiễu điện tử (`sam2-v1-interference`) trước khi chuyển tới cảnh kiểm tra kiến thức (`sam2-v1-check`).
- **Phân loại lựa chọn (Choice Semantics):**
  - **Lựa chọn cốt truyện (`kind: 'narrative'`):** Tại các scenes 1–5 và 7–8. Lựa chọn không có thuộc tính `isCorrect`, không tính điểm/XP, chỉ thay đổi góc tiếp cận tài liệu.
  - **Lựa chọn kiểm tra kiến thức (`kind: 'knowledge_check'`):** Duy nhất tại Scene 6 (`sam2-v1-check`). Lựa chọn có đáp án đúng (`isCorrect: true`) và phần giải thích sư phạm khi người học chọn sai hoặc đúng.
- **Sơ đồ khí tài tương tác khái quát (5 nodes chuẩn xác từ `DIAGRAM-SAM2-1972.json`):**
  - Đúng 5 thành phần khí tài/bối cảnh khái quát theo chuẩn `CLM-1972-VN-002` và `CLM-1972-VN-003`:
    1. `sam2-node-cabin`: Cabin điều khiển (Xe K) — Sở chỉ huy tổ hợp, nơi kíp chiến đấu cùng làm việc.
    2. `sam2-node-crew`: Kíp chiến đấu SAM-2 — Sự phối hợp hiệp đồng tác chiến ở mức khái quát (không mô tả thao tác vi mô).
    3. `sam2-node-radar`: Đài radar Fan Song — Khí tài radar bám sát & chiếu xạ gắn liền với tổ hợp.
    4. `sam2-node-launcher`: Bệ phóng & Tên lửa S-75 Dvina (SAM-2) — Khí tài hỏa lực của tổ hợp.
    5. `sam2-node-interference`: Môi trường có gây nhiễu điện tử — Thách thức tác chiến chính trong đối đầu B-52.
  - Sơ đồ có text-first fallback hoàn chỉnh cho từng node.

### 3.3. Bài 3: Bài Đọc Tiêu Chuẩn "12 Ngày đêm rực lửa" (`lsn-1972-03`)
- **Tích hợp:** Domain adapter chuyển hóa `LESSON-03-1972-STANDARD.md` thành một `DomainDocument` có `id: 'doc-1972-03-standard'` chứa các section có kiểu phân biệt (`verified_fact`, `educational_explanation`, `reading_reflection`).
- **UI:** Gọi `documentService.getById('doc-1972-03-standard')` để render typography chuẩn Inter, bảng đối chiếu số liệu tổn thất khách quan (Việt Nam vs USAF) và hộp suy ngẫm đọc hiểu.

### 3.4. Bài 4: Trắc Nghiệm Tổng Kết Chapter 1972 (`lsn-1972-04`)
- **Ánh xạ Schema 3 tầng:**
  - **Tầng 1 — Authoring (`QUIZ-1972.json`):**
    ```json
    {
      "id": "q-1972-01",
      "objectiveId": "CLO-1",
      "question": "...",
      "options": [{ "id": "A", "text": "..." }, { "id": "B", "text": "..." }, ...],
      "correctOptionId": "B",
      "explanation": "...",
      "sourceIds": ["SRC-LB2-01"]
    }
    ```
  - **Tầng 2 — Domain / Mock Store:** Lưu trữ `MultipleChoiceQuestion` và `QuestionSet` trong fixture adapter.
  - **Tầng 3 — Delivery Contract (`DeliveredQuestion` qua `QuizService.getQuestionSet`):**
    - Trả về danh sách câu hỏi cho client với `options: { id: string, label: string }[]`.
    - **TUYỆT ĐỐI KHÔNG gửi `correctOptionId` hay `explanation` về client** trước khi nộp bài.
- **Nộp bài & Nhận kết quả:**
  - **Luyện tập:** Gọi `quizService.submitPracticeAttempt({ operationId, questionSetId, answers })` với `answers: Array<{ questionId: string; selectedOptionIds: string[] }>`. Nhận `PracticeQuizReceipt` chứa `feedback` từng câu.
  - **Tính điểm chính thức:** Gọi `quizService.submitScoredAttempt({ operationId, questionSetId, answers })`.
  - Service trả về `ScoredQuizReceipt`:
    ```ts
    {
      attemptId: string,
      score: number,
      total: number,
      passed: boolean,
      feedback: QuestionFeedback[]
    }
    ```
    - Tiêu chí đạt chuẩn: `passed === true` (khi `score / total >= 0.8`, tức đúng $\ge 4/5$ câu).
    - `feedback`: Mảng đầy đủ kết quả từng câu `{ questionId, outcome: 'correct' | 'incorrect', explanation }`.
- **Chính sách Phần thưởng (Phase 7 Spec):**
  - Phần thưởng hoàn thành (+20 XP cho lần đầu đạt bài kiểm tra cuối chapter, bonus +5 XP khi đạt $\ge 80\%$) và cập nhật chuỗi học tập (Streak) được xử lý độc lập qua service tiến độ/người dùng (`ProgressService` / `UserService`), UI hiển thị phần thưởng dựa trên dữ liệu từ các service này.

---

## 4. TÓM TẮT PHỐI HỢP & VERIFICATION

- Toàn bộ 4 tệp dữ liệu đã được cấu trúc hóa theo domain model.
- Các script tự động `validate-1972-authoring.mjs`, `validate-1972-lesson03.mjs`, `validate-1972-quiz.mjs` bảo đảm tính hợp lệ về cấu trúc JSON, đồ thị phân cảnh, và độ phủ mục tiêu học tập (CLO).
- Gói nội dung sẵn sàng bàn giao để nhóm Frontend xây dựng Mock Adapters sau khi hoàn tất phê duyệt từ Historical Reviewer và Product Owner.
