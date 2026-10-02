# Trúc TEXT APPROVED — Historical re-review PR #65 (Bạch Mai + Tòa Đại sứ)

> Reviewer: Trúc (Member 2 — Historical Reviewer), Codex hỗ trợ đối chiếu\
> Date: 2026-10-02\
> PR: #65 (`content/tho-chapter-1972-package` → `main`)\
> Reviewed head: `b65dd2d5a97746ac137d1348d063e35f70ccdc6a`\
> Scope: 2 finding P1 tại review head `3fbf5ea` (Bạch Mai, Tòa Đại sứ); quiz CONTENT-019 không đổi bytes\
> Verdict: **TEXT APPROVED** (scoped historical approval, hash-bound bên dưới)

File này là biên bản duyệt sử liệu bằng văn bản để Thọ (executor) và PO thấy ngay
trên nhánh PR. Nếu nhóm yêu cầu trạng thái GitHub hiển thị Approved (ảnh bước 4),
Trúc bấm Approve trên PR #65 với cùng nội dung verdict này.

## 1. [P1 Bạch Mai] ĐÃ SỬA, CHẤP NHẬN

- `docs/content/LESSON-03-1972-STANDARD.md:34` tách Khâm Thiên đêm 26/12/1972
  (287 người thiệt mạng, 290 người bị thương, gần 2.000 ngôi nhà) khỏi Bệnh viện
  Bạch Mai rạng sáng 22/12 (28 người thiệt mạng, gồm 27 nhân viên y tế và
  1 bệnh nhân); claim list `:82` ghi đúng nguồn Bạch Mai `SRC-1972-WEB-09`.
- `docs/content/CHAPTER-1972-PACKAGE.md:160-161` tách source mapping đúng (bài
  Nhân Dân 2012 chỉ còn bảo chứng Khâm Thiên; special mới bảo chứng Bạch Mai);
  evidence rows `:178-179` tách thành 2 dòng đúng ngày.
- `docs/content/CHUAN-HOA-NOI-DUNG-GIAO-DUC-1972.md:284` (hook Bài 3) và
  `docs/content/HISTORICAL-SOURCES.md` (`SRC-1972-WEB-09` + `CLM-1972-RD-003`
  wording constraint) đồng bộ; validator bắt buộc `SRC-1972-WEB-09`, log trung thực.
- Đối chiếu nguồn: [Nhân Dân special](https://nhandan.vn/special/kyucbachmai/index.html)
  xác nhận rạng sáng 22/12 (bom 3h30–3h45), 28 người chết gồm 27 nhân viên y tế
  và 1 bệnh nhân. Chấp nhận Tier 3 official press cho số liệu thương vong này
  (kèm locator sách in `SRC-LB2-01`/`SRC-LB2-03` do executor dẫn; reviewer không
  xác minh lại từng trang in).
- Đã search 5 file phạm vi: không còn wording gộp cũ ("28 y bác sĩ", "28 cán bộ").

## 2. [P1 Tòa Đại sứ] ĐÃ SỬA, CHẤP NHẬN

- `docs/content/PILOT-SCREENPLAY.md:50` dùng wording giới hạn: Đội 11 tiến công
  vào khuôn viên; không đồng nhất với chiếm tòa nhà chính. Đã gỡ claim tầng
  dưới/6 giờ, gỡ nhãn `verified_fact` và `SRC-MT68-04` gắn sai.
- Khớp `PILOT-NARRATION.json` p04a + `PILOT-CAPTIONS.vtt` p04a (khuôn viên ≠ tòa nhà);
  registry `CLM-MT68-02` đồng bộ wording giới hạn ở cả hai bảng
  `HISTORICAL-SOURCES.md`.
- Đối chiếu [nguồn ADST](https://adst.org/2013/07/viet-cong-invade-american-embassy-the-1968-tet-offensive/):
  "held the embassy grounds... failed ever to enter the building" — ủng hộ phân
  biệt khuôn viên/tòa nhà; wording mới không nêu ngày/giờ nên tránh khác biệt
  niên biểu của nguồn.

## 3. Quiz CONTENT-019

- `docs/content/QUIZ-1972.json` không đổi byte nào từ head `3fbf5ea`
  (`git diff 3fbf5ea..b65dd2d` rỗng cho file này); q02/q03/q04 đã xác nhận tại
  review trước, giữ nguyên kết luận.
- PO nghiệm thu CONTENT-018 trước, rồi CONTENT-019 theo dependency trên card.

## 4. Hash binding (SHA-256, head `b65dd2d`)

| Artifact | SHA-256 |
|---|---|
| `docs/content/LESSON-03-1972-STANDARD.md` | `75b532f115c26820af242c032a2e55391064fe6a2d326fbc45ffff5b823881df` |
| `docs/content/CHAPTER-1972-PACKAGE.md` | `1ed77dae9c02dad6b774c2760661cd67e043d821536d027a38559cc273bbb5e4` |
| `docs/content/CHUAN-HOA-NOI-DUNG-GIAO-DUC-1972.md` | `ee41b7b335a73d2f7170d1eaac24bc1bda335837c0975005f344a7931417f7a3` |
| `docs/content/HISTORICAL-SOURCES.md` | `f8606d62998965a6994b061e14abca9b9a4b7f39e06c95ed97057210402f10b2` |
| `docs/content/PILOT-SCREENPLAY.md` | `6d1bf23a68bf1ad629a53ef1fed7f46360476ca769d8ea527ffb8c07610e9d56` |
| `docs/content/QUIZ-1972.json` | `bbcc55333c7a6332f630b689a6a30a9e3859ffccbf67a7fc4c7291eb4ad8c5e4` |

Verdict này chỉ có giá trị cho đúng các revision hash trên. Mọi sửa đổi nội dung
artifact sau head này cần re-review; chỉ đổi dòng trạng thái thì ghi hash mới
vào card theo tiền lệ CONTENT-012.

## 5. Verification đã chạy

- `node docs/content/validate-1972-lesson03.mjs` — PASS
- `node docs/content/validate-1972-quiz.mjs` — PASS
- `node docs/content/validate-1972-authoring.mjs` — PASS (5 nodes, 8 scenes)
- `git diff --check` — PASS (sạch)
- GitHub Quality 2/2 SUCCESS tại `b65dd2d`; PR MERGEABLE, mergeState BLOCKED
  (chờ review) — không chạy lại full quality local.
- Validator chỉ kiểm tra cấu trúc; verdict sử liệu dựa trên đối chiếu nguồn
  tại mục 1–2.

## 6. Ghi chú không chặn merge (Thọ/PO xử lý)

a) `CLM-1972-RD-003`: lesson/package ghi `verified_fact` trong khi registry vẫn
   ghi `NEEDS_HISTORICAL_REVIEW`. Verdict này là review lịch sử cho đúng các
   revision hash trên; đề nghị Thọ đồng bộ nhãn registry sau verdict (chỉ đổi
   dòng trạng thái, ghi hash mới vào card; đổi thêm nội dung khác thì re-review).
b) File mới `docs/content/CHUAN-HOA-NOI-DUNG-GIAO-DUC-MAUTHAN1968.md` (track
   CONTENT-004, ngoài file claimed/acceptance của CONTENT-018/019) NGOÀI phạm vi
   verdict này; các nhãn `[FACT]` trong file chưa được review, không coi là nội
   dung đã duyệt/sản xuất. Đề nghị PO/Thọ xác nhận file ở trạng thái draft theo
   review path riêng của CONTENT-004.
c) Điều kiện merge (theo ảnh): Dương re-review consumer (handoff M3) + Hưng
   re-review kiến trúc trên cùng head, PO sign-off CONTENT-018 trước rồi
   CONTENT-019; chỉ khi review Approved + PO sign-off mới merge.

## 7. Giới hạn verdict

- Nguồn báo chí Tier 3 được chấp nhận có reasoning cho từng claim như mục 1–2;
  locator sách in lấy theo executor dẫn.
- Không phê duyệt media/production; không thay consumer/architecture review;
  không quyết định gate milestone; không mở CONTENT-007 production.
- Nội dung authoring trong PR chưa được đưa vào runtime bởi review này.
