# Sử Chill — Token Contract & Design Handoff (M1-01)

> Status: APPROVED FOR IMPLEMENTATION\
> Last updated: 2026-09-28\
> Author / Designer: Trúc (Member 2 — Design & Media)\
> Reviewer: Hưng (Member 3 — Frontend Foundation)\
> Reference: `AGENTS.md` (Section 5), `ARCHITECTURE.md`, `docs/engineering/UI-UX-ENGINEERING-GUIDE.md`

---

## 1. Mục tiêu và Nguyên tắc Thiết kế (Design Principles)

Giao diện của **Sử Chill** được định hướng theo phong cách **Lịch sử Gần gũi — Mộc mạc — Trang nhã** với triết lý:
1. **Bảng màu giấy cổ & mực nâu**: Sử dụng nền giấy mộc ấm áp (`#F5E6D0`), chữ mực nâu sẫm (`#3D1A00`), và sắc đỏ dấu triện (`#8B1A1A`) làm điểm nhấn linh hồn của sản phẩm. Tuyệt đối không dùng màu neon, phong cách game viễn tưởng hay màu lạnh hiện đại.
2. **Mobile-First & Safe-Area Aware**: Tối ưu trước hết cho màn hình điện thoại di động (chiều rộng chuẩn 375px – 430px), hỗ trợ tai thỏ, dynamic island và thanh điều hướng ảo (`env(safe-area-inset-*)`).
3. **Rõ ràng giữa Tri thức (Knowledge) và Cốt truyện (Narrative)**:
   - Câu hỏi trắc nghiệm kiến thức: Có trạng thái Đúng (xanh `#E8F5E2`/`#3A5A2A`) và Sai (đỏ `#FDE8E4`/`#C4341A`).
   - Lựa chọn diễn biến cốt truyện / nhập vai (Visual Novel): **Không có đúng/sai**. Khi chọn chỉ dùng viền/nền primary ấm (`#8B1A1A`), **cấm dùng màu xanh đáp án đúng**.
4. **Trợ năng (Accessibility) & Tiếng Việt**:
   - Khoảng chạm ngón tay tối thiểu 44×44px.
   - Khoảng cách dòng `line-height` đảm bảo các ký tự có dấu thanh tiếng Việt (ắ, ặ, ẳ, ễ, ộ...) không bị cắt dính.
   - Hỗ trợ đầy đủ `focus-visible` cho bàn phím và phản hồi `prefers-reduced-motion`.

---

## 2. Bảng Màu Chuẩn (Color Tokens)

### 2.1 Bảng màu cốt lõi (Core Palette)

| Tên Token | Mã Hex | Vai trò / Ngữ cảnh sử dụng |
|---|---|---|
| `colors.outer` | `#C8A882` | Nền canvas bao quanh ngoài khi hiển thị trên màn hình máy tính / tablet lớn. |
| `colors.app` | `#F5E6D0` | Màu nền chính (giấy bồi cổ) của toàn bộ ứng dụng mobile. |
| `colors.primary` | `#8B1A1A` | Đỏ dấu triện: Nút hành động chính, tab đang chọn, đường viền nhấn, icon quan trọng. |
| `colors.primaryDark` | `#6B1414` | Trạng thái hover, active / pressed của nút primary. |
| `colors.primaryLight` | `#FBE8E8` | Nền nhạt mang sắc đỏ triện cho badge cảnh báo hoặc highlight nhẹ. |
| `colors.text` | `#3D1A00` | Mực nâu đậm: Màu chữ chính, tiêu đề, nội dung đọc; độ tương phản đạt chuẩn WCAG AA trên nền app. |
| `colors.textMuted` | `#6E503C` | Mực nâu vừa: Metadata, ngày tháng, nhãn phụ, placeholder. |
| `colors.card` | `#FBF4E8` | Màu bề mặt thẻ bài / card nội dung, sáng hơn nền app một chút để tạo độ tương phản nhẹ. |
| `colors.surfaceElevated` | `#FFFDF9` | Bề mặt nổi bật cho modal, dropdown, bottom sheet. |
| `colors.border` | `#E2CDB5` | Đường viền mảnh phân cách thẻ, phân vùng giao diện. |

### 2.2 Màu phản hồi kiến thức (Knowledge Choice Feedback)

Áp dụng cho Quiz, Trắc nghiệm kiến thức lịch sử (Knowledge Check):

| Trạng thái | Nền (`bg`) | Chữ & Viền (`text` & `border`) |
|---|---|---|
| Đáp án Đúng (Correct) | `#E8F5E2` (Xanh cốm nhạt) | `#3A5A2A` (Xanh rêu đậm) |
| Đáp án Sai (Incorrect) | `#FDE8E4` (Đỏ gạch nhạt) | `#C4341A` (Đỏ đất đậm) |

### 2.3 Màu lựa chọn cốt truyện (Narrative / Reflection Choice)

Áp dụng cho Visual Novel và các tình huống phân vai lịch sử:

| Trạng thái | Nền (`bg`) | Viền (`border`) | Chữ (`text`) | Ghi chú quy tắc |
|---|---|---|---|---|
| Chưa chọn (Default) | `#FBF4E8` | `#E2CDB5` | `#3D1A00` | Trạng thái trung tính |
| Đang chọn (Selected) | `#F8EFE4` | `#8B1A1A` (2px) | `#8B1A1A` | **CẤM TÔ XANH**. Lựa chọn mang tính quan điểm/nhập vai không có đúng/sai |

---

## 3. Hệ Thống Khoảng Cách & Bo Góc (Spacing & Radius Tokens)

### 3.1 Khoảng cách (Spacing)

Hệ thống bước nhảy dựa trên chuẩn 4px / 8px:

| Token | Giá trị | Ứng dụng |
|---|---|---|
| `spacing.xs` | `4px` | Khoảng cách icon và text trong badge, padding siêu nhỏ. |
| `spacing.sm` | `8px` | Khoảng cách giữa các chip, lề trong của button nhỏ. |
| `spacing.md` | `16px` | Chuẩn lề ngang màn hình (padding viền màn hình di động), khoảng cách giữa các phần tử nội dung. |
| `spacing.lg` | `24px` | Khoảng cách giữa các section, padding bên trong card/modal. |
| `spacing.xl` | `32px` | Khoảng cách giữa các khối lớn, tiêu đề chương. |
| `spacing['2xl']` | `48px` | Khoảng trống đáy để không bị che bởi thanh Bottom Navigation. |

### 3.2 Bo góc (Corner Radius)

Tránh dùng bo góc ngẫu nhiên; chuẩn hóa 5 cấp độ:

| Token | Giá trị | Ứng dụng |
|---|---|---|
| `radius.sm` | `6px` | Badge, thẻ tag nhỏ, icon khung vuông bo nhẹ. |
| `radius.md` | `12px` | ChoiceOption, ô nhập liệu (input), nút phụ. |
| `radius.lg` | `16px` | Card nội dung, hộp thoại đối thoại nhân vật (VN dialogue), button chính. |
| `radius.xl` | `24px` | Container modal, bảng điều khiển góc kéo lên (bottom sheet). |
| `radius.full` | `9999px` | Nút tròn (`IconButton`), thanh tiến trình (`Progress`), viên thuốc (`Pill`). |

---

## 4. Độ Nổi & Đổ Bóng (Elevation & Shadow Tokens)

Đổ bóng sử dụng tông màu mực nâu pha trong (`rgba(61, 26, 0, ...)`) thay vì màu đen xám thuần, giữ đúng chất mộc mạc:

| Token | Định nghĩa CSS | Ứng dụng |
|---|---|---|
| `shadows.sm` | `0 1px 2px rgba(61, 26, 0, 0.06)` | Thẻ bài tĩnh, phân tách nhẹ với nền app. |
| `shadows.md` | `0 4px 6px -1px rgba(61, 26, 0, 0.08), 0 2px 4px -1px rgba(61, 26, 0, 0.04)` | Thẻ bài có tương tác (hover/chạm), TopBar ghim cố định. |
| `shadows.lg` | `0 10px 15px -3px rgba(61, 26, 0, 0.12), 0 4px 6px -2px rgba(61, 26, 0, 0.06)` | Modal pop-up, hộp thông báo quan trọng. |

---

## 5. Chuyển Động & Tương Tác (Motion Tokens)

| Token | Thời lượng / Giá trị | Ứng dụng |
|---|---|---|
| `motion.fast` | `150ms` | Phản hồi nút bấm chạm/nhả (tap micro-interaction), đổi màu viền. |
| `motion.normal` | `250ms` | Mở rộng thẻ (accordion), chuyển tab, trượt chuyển scene nội dung. |
| `motion.slow` | `400ms` | Mở/đóng modal, chuyển màn hình lớn. |
| `motion.easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Gia tốc tự nhiên mềm mại (ease-in-out). |

> ⚠️ **Quy tắc Trợ năng (`prefers-reduced-motion`)**:
> Khi người dùng kích hoạt giảm chuyển động trên hệ điều hành, mọi thuộc tính dịch chuyển (`transform: translate`) và phóng to/thu nhỏ (`scale`) phải được vô hiệu hóa, chỉ giữ chuyển đổi tức thì (`0ms`) hoặc chuyển sắc độ mờ nhạt nhẹ.

---

## 6. Quy Chuẩn Thành Phần Giao Diện (UI Primitives Specification)

### 6.1 `Button` & `IconButton`
- **Button Variants**:
  - `primary`: Nền `#8B1A1A`, chữ `#FFFDF9`, bo góc `16px`. Active: `#6B1414`, `scale(0.98)`.
  - `secondary`: Nền `#FBF4E8`, viền `#E2CDB5`, chữ `#3D1A00`.
  - `outline`: Nền trong suốt, viền `#8B1A1A`, chữ `#8B1A1A`.
- **States**: Default, Hover, Active/Pressed, Disabled (opacity 0.5, không nhận click), Loading (hiển thị spinner và giữ kích thước).
- **Kích thước chạm**: Luôn đảm bảo tối thiểu `44px × 44px` cho toàn bộ vùng chạm trên thiết bị cảm ứng.

### 6.2 `ChoiceOption` (Thẻ Lựa Chọn)
- Hỗ trợ 2 chế độ riêng biệt: `type="knowledge"` và `type="narrative"`.
- Hiển thị nhãn chữ cái A, B, C, D trong hình tròn bo góc nhỏ bên trái.
- Có icon phản hồi trực quan khi đã submit: dấu tích tròn (đúng), dấu nhân tròn (sai), hoặc mũi tên tiếp tục (cốt truyện).

### 6.3 `Badge` (Huy Hiệu / Nhãn)
- Variants: `default` (nâu giấy), `primary` (đỏ triện), `success` (xanh cốm), `error` (đỏ đất), `warning` (vàng hổ phách).
- Bo góc dạng `radius.full` (pill) hoặc `radius.sm`.

### 6.4 `Progress` (Thanh Tiến Trình)
- Track: Nền `#E2CDB5`, chiều cao chuẩn `8px` hoặc `12px`, bo góc `full`.
- Bar: Nền `#8B1A1A`, chuyển động tăng phần trăm mượt mà với `transition: width 250ms ease`.

### 6.5 `Modal` (Hộp Thoại)
- Lớp nền (Backdrop): `rgba(61, 26, 0, 0.5)` kết hợp `backdrop-blur-sm`.
- Hộp thoại nổi giữa màn hình hoặc trượt từ đáy lên trên mobile, bo góc `24px` ở trên cùng.
- Hỗ trợ đóng qua: Nút X ở góc phải, bấm vào nền tối, hoặc phím `Escape`.

### 6.6 Bộ 4 Trạng Thái Chung (Shared States)
- `LoadingState`: Spinner quay nhã nhặn hoặc skeleton giả lập card/text.
- `ErrorState`: Biểu tượng cảnh báo, thông điệp giải thích bằng tiếng Việt thân thiện, nút "Thử lại" (Retry).
- `EmptyState`: Hình minh họa mộc mạc, thông báo chưa có dữ liệu và gợi mở hành động.
- `OfflineState`: Cảnh báo mất kết nối, hướng dẫn học các bài đã lưu offline.

---

## 7. Âm Thanh Giao Diện (Sound Cues — FE-009)

Hệ thống âm thanh được tinh chỉnh gọn gàng, thanh tao, không chói tai:
- **`tap`**: Âm click nhẹ tần số 800Hz trong 30ms mô phỏng tiếng chạm gỗ/giấy.
- **`correct`**: Hợp âm đôi thanh thoát C5 (523Hz) → E5 (659Hz) tăng dần trong 150ms.
- **`incorrect`**: Âm đôi trầm A3 (220Hz) → G3 (196Hz) trong 180ms.
- **Quy tắc bắt buộc**:
  - Không tự động phát (autoplay) trước khi có tương tác người dùng đầu tiên.
  - Có nút Mute âm thanh và lưu trạng thái tắt/bật vào `localStorage`.

---

## 8. Trợ Năng & Ràng Buộc Tiếng Việt (Accessibility & Constraints)

1. **Hiển thị tiếng Việt**:
   - Tiếng Việt có nhiều nguyên âm mang dấu phụ và thanh điệu kép (ví dụ: *ở, ế, ộ, ử, ẵ*).
   - Chiều cao dòng `line-height` cho đoạn văn phải từ `1.5` đến `1.6` để tránh tình trạng chữ dòng dưới dính vào dấu dòng trên.
   - Thẻ hiển thị phải có thuộc tính `word-break: break-word` hoặc `overflow-wrap: anywhere` để tránh vỡ giao diện với các từ ghép lịch sử dài (như *Chiến khu Đ, Không quân Nhân dân Việt Nam*).
2. **Vùng an toàn màn hình (Mobile Safe Area)**:
   - Top Bar: `padding-top: max(16px, env(safe-area-inset-top))`.
   - Bottom Nav: `padding-bottom: max(16px, env(safe-area-inset-bottom))`.
3. **Điều hướng bàn phím**:
   - Mọi nút bấm, thẻ lựa chọn phải có `tabIndex={0}` và vòng sáng `focus-visible:ring-2 focus-visible:ring-[#8B1A1A] focus-visible:outline-none`.

---

## 9. Biên Bản Nghiệm Thu Bàn Giao (Sign-Off Checkpoint)

- **Người bàn giao (Design Lead)**: Trúc (Member 2) — *Đã lập tài liệu và khóa đặc tả thiết kế theo đúng quy chuẩn Phase 9 & AGENTS.md.*
- **Người tiếp nhận & Reviewer**: Hưng (Member 3 — Frontend Foundation) — *Đã rà soát, xác nhận khả thi và đầy đủ để triển khai vào mã nguồn `src/theme/tokens.ts` và các UI primitives.*
- **Trạng thái task M1-01**: Chuyển sang `DONE` sau khi review.
- **Hành động tiếp theo**: Kích hoạt `FE-003` (M1-02: Chuẩn hóa tokens và UI primitives) sang `READY` / `IN PROGRESS`.
