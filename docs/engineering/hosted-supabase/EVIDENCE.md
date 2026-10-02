# Supabase thật — bằng chứng nghiệm thu M3–M5

Ngày kiểm chứng: **2026-10-02**. Nhánh: `codex/m3-m5-complete`. Task: `SUPABASE-HOSTED-001`; trạng thái task và milestone do root/reviewer cập nhật trên [task board](../../project/TASK-BOARD.md). Owner: Codex integration root. Executor: root + hai lane hosted transport/Auth. Reviewer: Codex application/security, độc lập và chỉ đọc.

Project kiểm thử mới: **`suchill-test`**, ref `kyfqlhpweetsridmqkvl`, trong organization Sử Chill, gói **Free**. Project này phục vụ development/verification; nội dung được seed là fixture kỹ thuật, không phải bài lịch sử canonical đã phát hành. Không reset database hosted, không mua gói trả phí và không tự mở M6/M7.

## Kết quả kiểm chứng

| Bộ kiểm chứng | Kết quả | Điều kết quả thực sự chứng minh |
|---|---|---|
| Hosted REST/Storage/learning | **12/12 PASS**, 117.096s, không skip | **11 test tích hợp thật + 1 guard thuần**; SDK SupabaseJS, JWT Auth, PostgREST, giao dịch Postgres và Storage HTTP thật |
| Hosted Auth | **9/9 PASS**, 15.51s, không skip | Tám behavioral subtest và parent; confirmation, password, persistence, refresh/sign-out, account switch và ABA read qua endpoint thật |
| Fresh signup tới inbox do người dùng sở hữu | **PASS** | Người dùng cho phép đúng một email; public signup tạo user chưa confirmed; người dùng nhận/bấm email, server xác nhận đã confirmed |
| Browser thật của ứng dụng | **PASS: login/reload/completion/settings/logout/A–B** | User signup đã confirmed nhận10XP/1lesson/1day; replay không thêm XP; mute giữ qua reload; A/B mới đều0XP/unmuted sau account switch |
| `npm run quality` | **PASS: 238 test** | Typecheck/build, **146 unit + 22 component + 42 SQL + 19 authoring + 9 Chromium browser**, quét source/bundle không có secret |
| Native-mode database | **50/50 PASS**, 37.742s, không skip | PostgreSQL **17.11**, **26 migration**, kiểm chứng SQL/upgrade và contention với tám connection độc lập |

Không cộng các con số trên thành một số “test production” chung: nhiều suite kiểm chứng cùng invariants ở các tầng khác nhau. Native-mode50 có test persisted-file reopen cố ý dùng PGlite và hai guard trước kết nối; đây không phải tuyên bố cả50 đều chạy trên native engine. Quality42 SQL dùng harness local; bằng chứng Auth/REST/Storage thật nằm ở hai suite hosted riêng.

Lệnh tái lập, sau khi project/credentials kiểm thử đã được chuẩn bị an toàn:

```powershell
node --test --test-concurrency=1 supabase/hosted-tests/*.test.mjs
node --test supabase/hosted-auth/auth.test.mjs
npm run quality
```

Native run cần cluster PostgreSQL17 disposable riêng trên loopback, explicit opt-in và guard port/database; xem [database evidence](../../../supabase/tests/EVIDENCE.md). Log local của lượt cuối nằm ở `output/hosted-supabase/quality-final.txt` và `native-final.txt`; output/runtime không phải migration hay secret được commit.

## Cấu hình và migration

- Frontend chỉ có `VITE_SUPABASE_URL` và publishable key trong `.env.local` đã được Git-ignore. Trusted secret chỉ nằm trong `.env.hosted-test.local` cho Node harness; không có prefix public, không gửi vào service factory frontend, không vào source/bundle/chat/log. Mật khẩu database do người dùng tự lưu, không được yêu cầu gửi vào chat.
- Harness khóa cứng đúng ref/HTTPS URL, yêu cầu opt-in trong file ignored và tách loại publishable/secret key. Credential không lấy từ một shell fallback hay project khác.
- Migrations001–025 được áp dụng đúng thứ tự bằng giao dịch trên project trống; không sửa các file đã áp dụng. Sau lỗi integration thật, thêm **migration026** roll-forward. Server thật báo PostgreSQL17.11; history có26 migration.
- SQL kiểm tra cuối của root: **26 migration, 46 public tables, 0 table thiếu RLS, 0 public bucket, 0 active learning RPC** tại checkpoint. Ảnh local: `output/hosted-supabase/final-database.jpg`.
- Buckets `published-media`, `draft-media`, `user-avatars` đều private. Upload/download/remove dùng Storage API thật; hosted suite không bootstrap `auth`, giả JWT hay chèn trực tiếp `storage.objects`.
- Graph UUID ổn định và sáu file dưới `hosted-technical/v1/` chỉ là fixture kỹ thuật. Reapply fixture có guard; user/progress test thuộc từng run được dọn theo ownership.
- Auth Site URL đã lưu **`http://127.0.0.1:5173`**; redirect allowlist chỉ có hai URL exact `http://localhost:5173` và `http://127.0.0.1:5173`, không wildcard. Root đã mở app local và kiểm chứng confirmed login/reload. Ảnh cấu hình cuối: `output/hosted-supabase/auth-urls-final.jpg`.

## Ma trận hosted đã đạt

| Phạm vi | Kiểm chứng thực tế |
|---|---|
| Published/draft/key | Anon/A/B đọc graph đã publish; draft rows được RLS lọc; choice/question delivery không có answer key/explanation; private tables/schema helper không gọi được từ client |
| Cách ly A/B | JWT thật của hai user; đọc dữ liệu cá nhân chéo cả hai chiều trả rỗng; anon không có user rows; đổi profile người khác và tự ghi progress/reward/streak/publish bị từ chối |
| Subject/session | Token B với `expectedSubject` A bị từ chối trước ghi; A không gửi queue của B; delayed A → B → A read bị adapter loại bỏ |
| Service DTO/error | Production domain adapter dùng RPC thật, DTO camelCase; not-found/validation/conflict/unauthorized được chuẩn hóa, không trả raw SDK error cho UI |
| Storage | Anon nhận signed URL đúng asset đã review và tải video/poster/VTT/transcript qua HTTP; unsigned public/tampered URL bị từ chối; draft/unreferenced path không được sign; avatar của A không bị B đọc/sign/insert/update/delete |
| Completion/reward | Tám HTTP request chồng nhau cùng operation trả cùng receipt; một ledger reward10XP; recreated adapter/retry không thưởng trùng; ID trùng nhưng payload khác bị conflict |
| VN/quiz/daily | Model VN thật dùng hosted checkpoint/feedback; end/check gates và episode20XP; trusted scored quiz20+5, daily5, replay/attempt người khác không farm XP |
| Offline/response loss | Queue giữ block→lesson và chủ tài khoản; server thật commit10XP rồi test chủ động làm mất response; durable queue mở lại gửi đúng operation và nhận receipt, total vẫn10XP |
| Video/fallback | Không thể báo full range trước initialization hoặc tức thời; seek không đạt threshold; overlap merge; chờ45s thời gian thực đáp ứng budget2x, completion90% thưởng10XP một lần; transcript fallback cần recap đã hoàn thành |
| Auth | Signup token, OTP một lần, password sai/đúng, settings/profile bootstrap, refresh token rotation và event, restore session, sign-out/revoke refresh, switch actor và ABA reads |

Chi tiết từng assertion và giới hạn: [hosted transport evidence](../../../supabase/hosted-tests/EVIDENCE.md), [hosted Auth evidence](../../../supabase/hosted-auth/EVIDENCE.md). Bản video Storage rất nhỏ chỉ kiểm chứng binary transport/signing, không chứng minh media decoding hay quyền sử dụng video canonical; video telemetry được kiểm chứng riêng bằng thời gian server thật.

## Lỗi integration đã sửa và review lại

**Business conflict dùng `40001` làm PostgREST14 retry vô hạn.** Test stale revision đầu tiên timeout khoảng125s; probe SDK tắt client retry vẫn timeout. Supabase xác nhận custom serialization error có thể gây vòng retry middleware và khuyến nghị mã HTTP riêng trong [hướng dẫn chính thức](https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b).

Migration026 dùng `CREATE OR REPLACE` từ definition của bảy function, đổi **chỉ các intentional business RAISE** sang `PT409`. Genuine engine serialization failure giữ nguyên. Function identity/owner/ACL, security-definer/search-path và chính sách completion/reward không đổi. Adapter map `PT409` thành `conflict`; migrations001–025 bất biến. Regression upgrade bắt đầu ở025, áp026, kiểm tra giữ ACL/receipt và stale conflict mới. Final hosted test nhận **HTTP409 / PT409 dưới20s**, cả checkpoint scenario1.75s; native-mode và Quality đều PASS sau sửa.

**Xóa avatar nhưng GET lặp có thể trả cache cũ.** Test được sửa để kiểm tra authoritative folder đã mất object, không tạo được signature mới và request fresh cacheNonce/no-store với test cacheControl0. Ma trận owner isolation vẫn PASS. Signed URL đã cấp là capability trong TTL; không tuyên bố revoke tức thì URL/JWT stateless đã cấp.

**CI scanner phải xét server fixture sau khi Git-track.** Reviewer phát hiện literal fake-key dài trong guard có thể bị scanner nhận diện khi stage. Đã thay bằng fixture ngắn không giống secret thật, chạy lại pure guard1/1 PASS; đây là dữ liệu test, không phải đổi credential. Final staged scanner do root xác nhận trong checklist dưới; không cần chạy lại hosted matrix vì không đổi behavior.

## Cleanup và checkpoint cuối

| Việc cuối | Trạng thái / bằng chứng |
|---|---|
| Users/avatar của aggregate transport | **DONE**: tám user tổng hợp của finalrun được revalidate ID/email/marker và xóa đúng scope; không gửi email |
| Orphan từ probe trước026 | **DONE**: pagination toàn bộ users; chỉ generated transport UUID marker + email `@example.invalid`; revalidate lại ownership trước xóa; **deleted1, remaining0**. Browser/Auth users không match |
| Users của suite Auth9/9 | **DONE**: exact IDs do suite tạo được dọn; không broad deletion |
| Browser A/B fixtures và file credential tạm | **DONE**: guarded exact-manifest cleanup đã xóa hai synthetic A/B users và gỡ `.env.hosted-browser.local`; không gửi email |
| Tài khoản signup inbox do user sở hữu | **RETAINED**: account đã confirmed và có10XP dữ liệu kỹ thuật. Auto-review từ chối xóa vĩnh viễn vì quyền gửi email không đồng nghĩa quyền xóa account gắn email thật. Không thử cách xóa khác; giữ manifest ignored, chờ quyết định riêng của user. Không cản trở acceptance kỹ thuật đã PASS |
| Redirect confirmation tới app local | **DONE về cấu hình/reachability app**: email đã nhận/bấm, server confirmed; lần đầu localhost chưa mở. Root lưu Site URL127.0.0.1 và hai exact allowlist URL, mở app và xác nhận login/reload. Không gửi lại email để tạo bằng chứng trùng |
| Backend còn retry/RPC đang chạy | **DONE tại final SQL checkpoint**: root xác nhận0 active learning RPC; function fix không bị coi là tự dừng request cũ. Không broad terminate/restart |
| Scanner sau stage cuối | **DONE**: scan sau stage kiểm tra435 source/tracked/bundle files,0 unsafe matches; diff check PASS. Pure config guard và upgrade026 regression PASS. |

Chỉ root/reviewer chuyển task đạt đầy đủ acceptance sang DONE sau khi cập nhật các checkpoint liên quan. Individual technical DONE không tự đóng milestone hoặc mở content production.

## Content và credential cũ vẫn là gate riêng

Project mới dùng key mới của đúng target; không sử dụng lại privileged key cũ đã được nhắc trong tài liệu. Không biết project/key cũ nào nên **không thể xác nhận credential cũ đã bị revoke**. Đây là follow-up riêng với owner của hệ thống cũ trước integration/release của hệ thống đó; không ghi “đã rotate” khi thiếu bằng chứng. Hosted verification này cũng không phải production deployment.

Năm task content vẫn **REVIEW**, dù technical authoring validator PASS:

| Task | Điều kiện còn cần bằng chứng |
|---|---|
| CONTENT-003 | Nguồn đọc được/provenance nhất quán và historical/media sign-off đúng artifact |
| CONTENT-004 | Screenplay/storyboard, phương án quyền media và task-level technical/media/handoff acceptance đúng scope |
| CONTENT-010 | Media/license và acceptance của graph/nội dung bài2 |
| CONTENT-011 | Media/license và acceptance của bài3–4/fallback |
| CONTENT-012 | Historical/learning sign-off, media/license và handoff ngân hàng câu hỏi |

**MP4 cuối thuộc CONTENT-007, không phải dependency bổ sung để nghiệm thu CONTENT-004.** CONTENT-004 bàn giao kịch bản/storyboard đã review để Member2 sản xuất sau gate; không yêu cầu video phải được sản xuất trước khi chính gate sản xuất đạt. CONTENT-007 vẫn BLOCKED nếu source/script/media/handoff chưa đủ. Supabase PASS không chứng minh license, recording, canonical historical approval hay chốt content task.

Handoff: reviewer đã đọc migration026, source guards/cleanup và toàn bộ hosted source matrix; không còn P1 trong các path kỹ thuật được kiểm tra. Root đã cập nhật technical task/card/board DONE và phân biệt content REVIEW. Tài khoản email thật được giữ theo giới hạn authorization, không suy diễn đã cleanup. PWA/performance/release và M6/M7 nằm ngoài bằng chứng này.

## Bằng chứng giao diện

![Auth redirect đã lưu](./auth-urls-final.jpg)

![Database26 migration, RLS và không còn RPC lặp](./final-database.jpg)

![Profile confirmed,10XP và preference giữ sau reload](./confirmed-profile.jpg)

Read-only Auth enumeration cuối: syntheticAuthUsersRemaining=0, syntheticBrowserUsersRemaining=0, ownedSignupFixturesRemaining=1. File browser tạm đã gỡ; signup và trusted test config vẫn ignored. Không phát sinh mutation trong lượt kiểm chứng cleanup này.
