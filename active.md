# Sử Chill — Active Task Handoff

> Chỉ có **một** task được bàn giao trong file này. File này không thay thế task board hoặc task card.

## Task tiếp theo

- Task ID: `M0-01`
- Tên: Chạy lại baseline hiện tại
- Trạng thái: `BLOCKED`
- Lý do blocked: Product owner đã đồng ý tiếp tục, nhưng `M0-00` còn chờ Hưng/Vinh xác nhận phạm vi.
- Task card: [M0-01](docs/tasks/blocked/M0-01.md)
- Milestone: M0 (`OPEN`)
- Nhánh đề xuất sau khi mở task: `codex/member5-backend-qa-plan`

Không được chạy M0-01 cho đến khi board/card ghi dependency M0-00 đã đạt và task được chuyển sang `READY` rồi `IN PROGRESS` với executor/file claim đầy đủ.

## Model AI phù hợp

- Model đề xuất: `gpt-6-sol`
- Reasoning effort: `medium`
- Lý do: M0-01 là công việc software-engineering hằng ngày nhưng cần đọc nhiều nguồn, chạy tool, phân loại lỗi và ghi evidence đầy đủ. Theo [OpenAI model-selection guidance](https://developers.openai.com/api/docs/guides/model-selection), Sol phù hợp cho coding/workflows cần judgment; mức medium phù hợp cho công việc thường ngày cần tính đầy đủ.
- Không cần dùng Astra cho baseline này. Chỉ nâng model/effort nếu task card được đổi vì xuất hiện vấn đề kiến trúc hoặc bảo mật phức tạp.

## Skill bắt buộc

- Dùng `$su-chill-task-handoff` tại [SKILL.md](.agents/skills/su-chill-task-handoff/SKILL.md) trước khi nhận hoặc thực thi task.
- Task M0-01 không cần skill chuyên biệt khác. Nếu task sau yêu cầu tài liệu, PDF, spreadsheet, hình ảnh hoặc OpenAI API thì chỉ thêm skill khi task card ghi rõ.

## Đọc theo thứ tự

1. [AGENTS.md](AGENTS.md).
2. [docs/README.md](docs/README.md).
3. [TASK-BOARD.md](docs/project/TASK-BOARD.md).
4. [ARCHITECTURE.md](ARCHITECTURE.md).
5. File `active.md` này.
6. [Task card M0-01](docs/tasks/blocked/M0-01.md) và tài liệu được card liên kết.

Nếu các nguồn mâu thuẫn, không tự chọn cách hiểu thuận tiện để tiếp tục. Ghi mâu thuẫn vào handoff và dừng trước khi sửa file.

## Phạm vi duy nhất được bàn giao

Sau khi task được mở:

1. Xác nhận branch/worktree và trạng thái Git.
2. Ghi phiên bản Node và package manager.
3. Chạy lại typecheck, production build và smoke-check demo hiện tại.
4. Nhóm lỗi theo TypeScript, runtime, legacy architecture và env/security.
5. Ghi command, file, lỗi và cách tái hiện vào evidence của M0-01.
6. Cập nhật task card/board rồi chuyển M0-01 sang `REVIEW`.

## Không được làm trong task này

- Không sửa source code hoặc “tiện tay” sửa lỗi vừa phát hiện.
- Không cài package, đổi lockfile, sửa env, đọc/log secret hoặc chạy migration.
- Không bắt đầu M0-02, M0-03 hay M0-06 trong cùng lượt.
- Không sửa file ngoài phần evidence đã claim khi M0-01 được mở.

## Điều kiện hoàn thành

- Có evidence tái hiện được cho typecheck/build/demo baseline.
- Mỗi lỗi có nhóm, command và file liên quan.
- Git không có thay đổi source/package/env ngoài scope.
- M0-01 được chuyển `REVIEW`; reviewer quyết định task nào được mở tiếp.

Sau khi hoàn thành, dừng và bàn giao. Không tự đổi `active.md` sang task tiếp theo trước khi reviewer/Product owner chấp thuận.
