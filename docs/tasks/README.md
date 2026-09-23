# Sử Chill — Detailed Task Cards

Task board là danh sách tổng. Thư mục này giữ hồ sơ chi tiết và tiến trình bền vững của từng task để thành viên hoặc AI khác có thể tiếp tục mà không cần đọc lại toàn bộ chat.

## Cấu trúc

```text
docs/tasks/
├── active/      # READY, IN PROGRESS hoặc REVIEW
├── blocked/     # đang chờ dependency/quyết định/quyền truy cập
├── done/        # đã đạt acceptance và được review
└── TASK-TEMPLATE.md
```

Di chuyển task card giữa các thư mục khi trạng thái đổi và cập nhật link tương ứng trên `TASK-BOARD.md`. Việc di chuyển task phải giữ nguyên lịch sử/checkpoint trong file.

## Vòng đời task

```text
BACKLOG (chỉ ở task board)
→ READY (có task card)
→ IN PROGRESS (đã claim owner/files)
→ REVIEW (có deliverable + evidence)
→ DONE (reviewer xác nhận)
```

Nếu không thể tiếp tục, chuyển `BLOCKED`, nêu điều kiện mở chặn và next owner. Không dùng phần trăm. Dùng acceptance checklist và checkpoint có ngày giờ để thấy đã tới đâu.

## Quy tắc cho AI/Codex

1. Đọc `AGENTS.md`, docs index, task board, architecture; nếu người dùng chỉ nêu vai trò, đọc thêm team ownership rồi tự tìm task/card phù hợp.
2. Chỉ chọn task thuộc milestone đang `OPEN` hoặc content track độc lập, đủ dependency, đúng vai trò và không có file conflict. Nếu không có, giải thích blocker và next action; không đòi người dùng biết ID.
3. Đọc task card/spec được liên kết rồi claim task/file trước khi sửa.
4. Cập nhật checkpoint sau một deliverable có ý nghĩa hoặc trước khi handoff/dừng.
5. Ghi command/check đã chạy và kết quả ngắn gọn.
6. Chuyển `REVIEW`; reviewer xác nhận `DONE`. Milestone sau chỉ mở khi Product owner duyệt gate và ghi vào task board.

Commentary trực tiếp trong một Codex task giúp xem tiến trình hiện tại; task card là bản ghi lâu dài cho người/AI khác và những lần làm việc sau.

## Xem tiến độ theo từng thành viên

Không cập nhật `APP-PLAN.md` mỗi khi một người hoàn thành việc. Ba nơi có vai trò khác nhau:

1. [Team ownership](../project/TEAM-OWNERSHIP.md) cho biết mỗi thành viên phụ trách lĩnh vực nào và ai review; điền tên thật khi phân công hoặc đổi vai trò.
2. [Task board](../project/TASK-BOARD.md) cho biết task nào thuộc người đó, trạng thái hiện tại, dependency, blocker và hành động tiếp theo. Đọc các dòng có tên người ở cột `Owner` hoặc bảng active/review để có cái nhìn nhanh.
3. Task card cho biết chính xác đã hoàn thành tiêu chí nào, bằng chứng ở đâu, file nào đã sửa, kết quả kiểm tra và việc tiếp theo. Mở card từ link của task trên board để xem chi tiết.

Ví dụ sau khi Member 3 được giao `FE-001`: ghi tên Member 3 vào `Owner` trên board và `Accountable owner` trong card; ghi người thực hiện ở `Executor`, người kiểm tra ở `Reviewer`. Khi sửa xong TypeScript, thêm checkpoint và kết quả `tsc` vào card, chuyển cả card và board sang `REVIEW`. Reviewer xác nhận rồi mới chuyển `DONE`. `APP-PLAN.md` không cần sửa cho các bước đó.

Quy tắc đồng bộ: một task có một ID; board và card phải cùng status/owner/next action. Mỗi lần đổi trạng thái hoặc handoff thì cập nhật cả hai trong cùng thay đổi. Không chép toàn bộ checkpoint vào board và không duy trì thêm bảng phần trăm riêng cho từng người, vì sẽ dễ lệch dữ liệu.

Ví dụ cho Member 1: AI sẽ thấy `CONTENT-009` đang `READY` dù M0 đang mở, vì đây là nghiên cứu nguồn sơ bộ của content track. Member 1 nhận task, claim file và ghi nguồn có thể truy vết; kết quả giúp Product owner chọn chapter ở `CONTENT-002`. Các task curriculum `CONTENT-008` và screenplay `CONTENT-004` vẫn `BLOCKED` cho đến khi dependency và review tương ứng đạt. Nghiên cứu này không mở milestone code kế tiếp và không tự duyệt nội dung lịch sử.
