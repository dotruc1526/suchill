# M3-06 — Thiết kế controller và kế hoạch kiểm thử

> Status: PROPOSED preparation; chưa triển khai hoặc chạy các test bên dưới.
> Owner: Dương; executor: Codex; reviewers: Hưng (UI/architecture), Vinh (service/QA).
> Date: 2026-10-02; contract runtime `68580ed`; PR88 head `c816ec7` docs-only còn OPEN.

Nguồn: [agreement D1–D7 và acceptance](../blocked/M3-06.md), [Phase 7](../../specs/phases/07-progress-reward-analytics-spec.md), [roadmap](../../specs/phases/09-implementation-roadmap.md), [contract PR88](https://github.com/dotruc1526/suchill/blob/68580edc7a0c5e465c8c3065e3a6060c0f169900/src/services/next/completionContracts.ts). Đây là chuẩn bị trong M3-STATUS-01; không claim runtime của task BLOCKED.

## Ranh giới và module dự kiến

- Controller/hook feature nhận `LearningServices`, context account/session/lesson/version và factory operation ID qua dependency injection. React chỉ gọi controller; không đọc store hoặc import legacy fixture.
- Tách completion state khỏi account-summary state: lỗi đọc hồ sơ không xóa receipt; profile đọc dữ liệu service thay cho prop XP/legacy data hiện có.
- Dự kiến `src/features/learning/completion/` cho model/controller/panel, `src/features/profile/` cho summary hook/view. Đây là đề xuất, chưa phải file claim.
- Trước runtime: claim integration riêng cho composition/App/journey theo owner Hưng; claim tests với Vinh. Dùng tokens và UI primitives hiện có.
- Technical catalog cần authored completion policy, version và required evidence hợp lệ. Fixture Home hiện không được mặc nhiên coi là catalog completion hợp lệ; UI không tự sửa required flags để nhận XP.

## State model

Context identity gồm account/session epoch, lessonId và contentVersionId. Mỗi request chụp identity và request generation; chỉ response còn khớp mới được cập nhật state. Services thay hoặc session đổi phải tăng epoch dù userId giống nhau.

| Nhánh | State | Dữ liệu giữ lại / ý nghĩa |
|---|---|---|
| Completion | restoring | Đọc receipt, chưa quyết định có hoàn thành hay không |
| Completion | ready | Read thành công với receipt null; null không phải lỗi |
| Completion | submitting | Một request duy nhất; disable submit ngay trước khi gọi service |
| Completion | ineligible | Reasons do service trả; không receipt/XP mới |
| Completion | confirmed | Outcome completed/already_completed và receipt service xác nhận |
| Completion | error | ServiceErrorCode riêng; lỗi restore không chuyển ready |
| Summary | loading / ready / empty / error | Ready có AccountSummary (0 XP hợp lệ); empty là null; error có thể giữ summary confirmed cùng account |

Receipt phục hồi bằng getLessonCompletion chỉ chứng minh đã hoàn thành; không có outcome lần submit và không thông báo thưởng mới. Receipt khác user/lesson/version context không được render; summary khác account không được render.

## Luồng và vòng đời operation

1. Mount/context đổi: clear state nhạy cảm của context cũ, vô hiệu response cũ; đọc receipt và summary độc lập. Không auto-submit từ mount/effect. Restore lỗi chỉ retry read.
2. Người dùng xác nhận text/recap hoặc authored fallback: gọi recordBlockAction với action và operation ID riêng. Flush/await checkpoint/action writes liên quan trước submit để service đọc evidence đã lưu. Không dùng acknowledge cho VN/quiz.
3. Submit: lưu `{lessonId, operationId}` trước request, khóa đồng bộ chống double click. Offline/thrown error giữ payload; retry dùng đúng payload, không sinh ID mới.
4. Ineligible: map blockId sang nhãn hiện có, chỉ mô tả missing evidence mà service chứng minh. Reason hiện là required_evidence_missing, không suy ra phần trăm xem hoặc quiz score. Tiếp tục bài, cập nhật evidence rồi submit lại cùng operation chưa bị tiêu thụ.
5. Confirmed: lưu receipt rồi refresh summary bằng read. Hiển thị totalXp/streak từ summary; không cộng xpDelta vào local totals. Same-operation replay có thể vẫn mang granted rewards; chỉ thông báo reward một lần trong vòng đời controller, restore không phát lại thông báo +XP.
6. Summary lỗi sau confirm: receipt vẫn hiển thị, số liệu confirmed cùng account giữ nguyên kèm thông báo chưa cập nhật; nút tải lại chỉ gọi getAccountSummary. Null summary hiển thị empty, không thay bằng 0 XP.
7. Remount lesson trong cùng phiên: registry intent thuộc context ở tầng feature/composition giữ pending ID/payload qua điều hướng, không nằm trong component bị unmount. Full browser restart mock không bảo đảm store bền vững; không lưu queue có thể replay sang store/account mới. Trong store còn tồn tại, restore receipt trước submit để tránh replay notification; adapter dedupe vẫn là authority.
8. Đổi account/services/version hoặc unmount: vô hiệu generation; account đổi xóa receipt/summary/intent của account cũ. Không auto-retry operation cũ vào context mới. Nếu unmount không thể hủy service write, response vẫn phải bị bỏ qua.

## Error mapping và copy

| Result / state | Copy và hành động |
|---|---|
| submitting | “Đang xác nhận hoàn thành…”; role=status; disable submit, không hứa XP |
| offline / thrown request | “Chưa xác nhận hoàn thành”; retry cùng payload + tiếp tục bài; role=alert |
| ineligible | “Chưa đủ điều kiện hoàn thành”; danh sách tên block + “Chưa có xác nhận phần bắt buộc”; tiếp tục bài |
| completed | “Đã hoàn thành bài!”; receipt/time/method service; rewards mới chỉ trong lần xác nhận hiện tại |
| already_completed / restored | “Bài đã hoàn thành trước đó”; không cộng thưởng lần nữa; không replay toast +XP |
| validation | “Chưa thể xác nhận bài học”; giải thích không đủ dữ liệu hợp lệ để xác nhận; retry cùng operation khi điều kiện phục hồi, không tự hứa retry sẽ sửa lỗi cấu hình |
| conflict | “Yêu cầu xác nhận chưa khớp”; restore receipt và kiểm tra context, không tự đổi operation ID để vượt conflict |
| unauthorized | “Chưa có phiên tài khoản hợp lệ”; reset dữ liệu account; không hiển thị account cũ |
| not_found | “Không tìm thấy bài học hoặc phiên bản”; quay về hành trình, không submit lặp |
| server_error | “Chưa xác nhận được hoàn thành”; retry cùng payload, giữ confirmed dữ liệu còn hợp lệ |
| summary error / null | “Chưa tải được số liệu hồ sơ” / “Chưa có dữ liệu tài khoản”; retry read riêng; null không phải account 0 XP |

Không tiết lộ nguyên nhân validation cụ thể (clock/catalog) khi Result chỉ trả code chung. Receipt time dùng timezone của account đã xác nhận; nếu chưa có timezone hợp lệ, hoãn format theo timezone, không mặc định device timezone thành authoritative account time.

## Test cases dự kiến — chưa chạy

Controller tests dùng fake services, deferred promises, injected ID factory; adapter integration dùng catalog có required blocks và injected shared store/clock. Không sửa production service để giả lập lỗi.

| ID / layer | Trigger | Assertion cần chứng minh |
|---|---|---|
| C01 controller | Double click trong pending | completeLesson chỉ 1 call, 1 ID, không thay summary |
| C02 controller | Offline rồi retry | Cùng ID/payload; không optimistic XP; response mới xác nhận mới đổi state |
| C03 controller | Request throw | Unlock submit, accessible error; retry cùng ID; không unhandled rejection |
| C04 controller | Ineligible rồi bổ sung evidence | Reasons map đúng nhãn; retry cùng ID; không tự set completion/progress |
| C05 controller | completed rồi summary fail | Receipt giữ nguyên; retry chỉ read; completion call count không tăng |
| C06 controller | Summary null / 0 XP / error | 3 trạng thái khác nhau; error giữ confirmed summary cùng account |
| C07 controller | Same-ID replay / already_completed / restore | Không cộng local XP/toast lặp; totals chỉ từ summary; already_completed delta 0 |
| C08 controller | Account A slow request, đổi sang B | A receipt/summary không render ở B; không replay intent A; cùng userId nhưng services mới vẫn loại response cũ |
| C09 controller | Lesson/version đổi, unmount, read responses đảo thứ tự | Generation mới thắng; không stale write state; restore error không auto-submit |
| C10 controller | Navigate profile/back khi pending rồi retry | Registry giữ payload cùng context; không tạo completion operation mới |
| C11 controller | validation/conflict/not_found/unauthorized | Map riêng; conflict không sinh ID né lỗi; unauthorized xóa dữ liệu nhạy cảm |
| C12 integration | Optional-only catalog hoặc clock lùi | validation, không receipt/reward writes; UI không render success; recovered clock retry cùng ID đạt |
| C13 integration | Mixed required blocks, flush action/checkpoint rồi complete | Service authority quyết định; incomplete stored evidence không được UI bypass |
| U01 component | Pending/error/confirmed/empty + keyboard | role=status/alert, disable button, text không chỉ màu, focus không bị request giật |
| U02 component | Receipt + reward/summary | Account timezone, copied receipt, empty achievements; không legacy fixture/XP prop authority |
| B01 browser | Complete → profile → back | Receipt/summary đúng service, checkpoint giữ nguyên; heading focus và return opener hợp lý |
| B02 browser | 375/430px, tên Việt dài, keyboard/reduced motion | Không overflow, target ≥44px, navigation/announcement đạt, tokens/visual evidence mới |
| B03 browser | Duplicate/recreate cùng store; account switch | Không thưởng lặp, receipt recovery, không lẫn account; ghi rõ không certify browser-restart persistence |

## Điều kiện chuyển sang runtime và handoff

- PR88 `c816ec7` đã ghi Hưng ACCEPTED hai fixes runtime `68580ed` và Dương APPROVED; Vinh cần tích hợp main/gỡ conflict, verify integrated head và CI 2/2, acceptance/merge/handoff; đọc lại final contract nếu head thay đổi. Copy/checklist này không thay reviewer acceptance.
- Dương điền runtime files/reviewers/dependency, chuyển M3-06 READY → IN PROGRESS; chọn module/test filenames cụ thể lúc claim, phối hợp hotspot với Hưng/Vinh.
- Khi runtime xong: typecheck/build, controller/component/adapter tests liên quan, full browser suite, client scan, ảnh mới 375/430px và handoff; chuyển REVIEW. Reviewer quyết DONE, Vinh làm M3-07 sau dependency, PO audit Gate M3 riêng.
