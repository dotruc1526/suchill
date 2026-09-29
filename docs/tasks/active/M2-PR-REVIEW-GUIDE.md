# Hướng dẫn Review Pull Request Milestone 2 (M2-02 & M2-03)

> Branch: `codex/m2-02-03-validators-and-service-contracts`\
> Target: `main`\
> Tasks liên quan: `M2-02` (Story/Content validators), `M2-03` (Service interfaces)\
> Reviewers: Hưng (Member 3 — Contract/Architecture) và Dương (Member 4 — Frontend Learning Consumer)

---

## 1. Tiêu đề và Nội dung mẫu để dán vào Pull Request trên GitHub

### Tiêu đề (PR Title)
```text
feat(m2): implement story/content validators (M2-02) and service interfaces (M2-03)
```

### Nội dung mô tả (PR Description)
```markdown
## 📌 Tóm tắt nội dung PR (Summary)

Pull Request này triển khai hai hạng mục cốt lõi tiếp theo của **Milestone 2 (Domain, validators and service abstraction)**:

1. **M2-02: Story/Content Validators (`src/services/contracts/validation.ts`)**:
   - Xây dựng Validation Engine toàn diện cho toàn bộ các thực thể domain v2 theo đặc tả Phase 5 và Phase 8: `Chapter`, `Lesson`, `StoryVersion` (đồ thị phân cảnh Visual Novel), `MediaAsset`, `MultipleChoiceQuestion`, và `QuestionSet`.
   - **Bảo toàn các Invariants bắt buộc**:
     - *Đồ thị phân cảnh*: Thuật toán duyệt đồ thị (BFS/DFS) đảm bảo 100% scenes đến được từ `startSceneId`, không có orphan scene, đồ thị có ít nhất 1 đường dẫn hợp lệ tới scene loại `end`, phát hiện chu trình không lối thoát.
     - *Ngữ nghĩa lựa chọn*: Lựa chọn cốt truyện/suy ngẫm (`narrative`, `reflection`, `branching`) **tuyệt đối không mang thuộc tính `isCorrect`**; câu hỏi kiểm tra kiến thức (`knowledge_check`) bắt buộc có đúng 1 đáp án đúng và lời giải thích (`explanation`).
     - *Thứ tự và định danh*: Khối bài học (`blocks`) và danh sách bài học (`lessonRefs`) có `order` nguyên không âm và không trùng lặp.
     - *Bản quyền và Trợ năng Media*: Media đã duyệt bắt buộc có nguồn, bản quyền, attribution; hình ảnh cần `altText`; video cần poster, transcript và phụ đề.
     - *Câu hỏi trắc nghiệm*: Cần prompt, giải thích, ít nhất 2 options và nguồn tham chiếu.

2. **M2-03: Service Interfaces (`src/services/contracts/index.ts`)**:
   - Thiết lập bộ hợp đồng dịch vụ chuẩn hóa đại diện cho các ranh giới nghiệp vụ tại `ARCHITECTURE.md`:
     - `ChapterService` & `LessonService`: Danh mục bài học, chi tiết bài học và các ordered blocks.
     - `VisualNovelService`: Truy xuất StoryVersion bất biến và kiểm thực phiên bản.
     - `MediaService`: Phân giải media asset thành URL an toàn/hợp lệ.
     - `QuizService`: Phục vụ câu hỏi, bộ đề và ghi nhận bài làm (attempts).
     - `ProgressService`: Lưu trữ/truy xuất checkpoint tiến độ bài học (hỗ trợ `operationId` chống trùng lặp) và phân cảnh.
     - `UserService`: Thông tin hồ sơ, XP, streak read-only DTO.
   - Chuẩn hóa kiểu phản hồi `Result<T, E>` với helper `success`, `failure` và mã lỗi `ServiceErrorCode` (`not_found`, `unauthorized`, `offline`, `validation`, `conflict`, `server_error`).
   - Tương thích ngược: Re-export canonical sang `src/services/next/contracts.ts` và `src/services/next/validation.ts`, giữ nguyên hoạt động của mock adapters và test cũ.

3. **Bộ kiểm thử đơn vị (`tests/member5/validation-v2.test.ts`)**:
   - Bổ sung 5 bộ test cases chuyên sâu kiểm tra toàn diện các trường hợp hợp lệ và vi phạm invariants.

---

## 🧪 Bằng chứng kiểm thử & Chất lượng (Verification Evidence)

Toàn bộ các bước kiểm thử trong `npm run quality` đều chạy thành công 100% cục bộ:

- **Typecheck**: `npm run typecheck` (`tsc --noEmit`) -> **PASS** (0 errors).
- **Unit Tests**: `npm run test:unit` -> **PASS 21/21 tests** (bao gồm 5 tests mới và 16 tests nền tảng).
- **Production Build**: `npm run build` (`vite build`) -> **PASS** (bundle dist thành công).
- **Client Secret Scan**: Quét 241 files -> **0 unsafe matches**.
- **Component Tests**: `npm run test:component` -> **PASS 9/9 tests**.
- **Browser E2E Tests**: `npm run test:e2e` -> **PASS 2/2 tests** (Headless Chrome thật).

---

## 📋 Checklist Review

### Dành cho Hưng (Member 3 — Contract & Architecture Lead)
- [ ] Ranh giới kiến trúc: Các service interfaces không làm rò rỉ database rows hay Supabase DTO vào domain contract.
- [ ] Tính bất biến và định danh: `EntityId` dạng string ổn định, `StoryVersion` bất biến theo đúng Phase 5.
- [ ] Xử lý lỗi: Pattern `Result<T, E>` nhất quán, không quăng unhandled exception ra UI.

### Dành cho Dương (Member 4 — Frontend Learning Consumer)
- [ ] Đáp ứng UI Milestone 3: Các interfaces `ChapterService`, `LessonService`, `VisualNovelService`, `QuizService`, `ProgressService` cung cấp đầy đủ dữ liệu cần thiết để dựng các màn hình bài học, visual novel player, quiz và lưu checkpoint.
- [ ] Tính rõ ràng của checkpoint: `SaveLessonCheckpoint` có `operationId` sẵn sàng tích hợp với logic lưu tiến độ bài học.

---

## 📂 Quản lý Task
- [x] Tạo task card `docs/tasks/active/M2-02.md` và `docs/tasks/active/M2-03.md` (chuyển `REVIEW`).
- [x] Cập nhật bảng điều phối `docs/project/TASK-BOARD.md`.
```

---

## 2. Quy trình khi Reviewer phê duyệt (Sau khi Merge)
1. Di chuyển task cards sang `docs/tasks/done/`:
   - `docs/tasks/active/M2-02.md` -> `docs/tasks/done/M2-02.md`
   - `docs/tasks/active/M2-03.md` -> `docs/tasks/done/M2-03.md`
2. Cập nhật `Status: DONE` trong cả hai task card.
3. Cập nhật `docs/project/TASK-BOARD.md`: chuyển M2-02 và M2-03 sang `DONE`.
4. Mở khóa task **M2-04 (Mock adapters)** để Dương và Vinh phối hợp triển khai.
