# CONTENT-016 — Claim/source và media boundary cho Visual Novel SAM-2

> Status: READY FOR TRÚC RE-REVIEW — chưa phải historical/media approval\
> Reviewer: Trúc\
> Consumer: [Lesson 2 Visual Novel brief](./LESSON-02-VISUAL-NOVEL-1972.md)\
> Rule: claim chưa `APPROVED` không được đưa thành narration fact hoặc `StoryVersion` publishable.

## 1. Source register có locator

| Source ID | Tài liệu | Locator dùng cho review | Phạm vi được phép hỗ trợ | Giới hạn |
|---|---|---|---|---|
| `SRC-LB2-02` / `SRC-1972-01` | *Lịch sử Quân chủng Phòng không - Không quân (1963–2013)*, Viện Lịch sử Quân sự — Đảng ủy BTL PK-KQ, NXB QĐND, 2013, ISBN 978-604-51-0988-5 | Chương V, “Chiến dịch phòng không bảo vệ Hà Nội–Hải Phòng cuối tháng 12-1972”, tr. 280–335 | Tổ chức chiến dịch, kíp trắc thủ, tên lửa phòng không, B-52 và kinh nghiệm chống nhiễu trong chiến dịch | Khoảng trang còn rộng; Trúc phải khóa trang/đoạn cụ thể trước khi trích lời hoặc mô tả thao tác chi tiết |
| `SRC-1972-02` | *Lịch sử Bộ đội Tên lửa Phòng không (1965–2015)*, BTL Quân chủng PK-KQ, NXB QĐND, 2015, ISBN 978-604-51-1823-8 | Phần lịch sử chuẩn bị đánh B-52 và chiến dịch tháng 12/1972; bản ghi hiện chưa có số trang cụ thể | Nhận diện hệ thống tên lửa, lịch sử nghiên cứu B-52, vai trò đơn vị/kíp chiến đấu | `LOCATOR_INCOMPLETE`; không dùng làm nguồn duy nhất cho narration chi tiết cho đến khi bổ sung trang/đoạn |
| `SRC-1972-03` | *Cách đánh B-52 của bộ đội tên lửa* (“Cẩm nang bìa đỏ”), Bộ Tư lệnh Quân chủng PK-KQ, 10/1972 | Bản hiện vật/tài liệu nội bộ; các mục về nhận dạng nhiễu và phương pháp đánh B-52; chưa có bản số hóa/pagination được khóa trong repo | Thuật ngữ và phương pháp chỉ sau khi reviewer đọc đúng bản | `RESTRICTED_REFERENCE`; không trích nguyên văn, không mô phỏng thao tác hoặc gọi là “vạch nhiễu tìm thù” theo nghĩa kỹ thuật cho đến khi Trúc ghi locator đọc được |
| `SRC-LB2-04` | Karl J. Eschmann, *Linebacker II: A View from the Rock*, Air University Press, 1989, DTIC ADA218949 / ISBN 978-1585660346 | Các phần về planning, B-52 operations và electronic countermeasures trong monograph; cần ghi số trang theo bản PDF dùng review | Góc nhìn phía USAF về B-52, ECM và tổn thất | Dùng để đối chiếu, không tự thay thế nguồn Việt Nam cho tổ chức kíp SAM-2 |
| `SRC-LB2-05` | Bernard C. Nalty (chủ biên), *Winged Shield, Winged Sword*, Vol. II, Air Force History and Museums Program, 1997, ISBN 0-16-049009-X | tr. 340–348 | Linebacker II, B-52, thiệt hại và tác động chiến dịch theo lịch sử chính thức USAF | Không hỗ trợ chi tiết thao tác kíp tên lửa Việt Nam |
| `SRC-1972-WEB-01` | Báo Quân đội nhân dân Cuối tuần, [“Bài 2: Chuẩn bị chu đáo, kỹ lưỡng trên tất cả mọi mặt”](https://ct.qdnd.vn/ho-so-tu-lieu/bai-2-chuan-bi-chu-dao-ky-luong-tren-tat-ca-moi-mat-521888), 06/12/2017 | Phần “Thứ hai, chuẩn bị chu đáo...”: đoạn bắt đầu “Trong việc chuẩn bị...”, các đoạn bắt đầu “SAM-2 là tên gọi...”, “Trên thực tế...” và hai đoạn cuối về “Cẩm nang bìa đỏ” | SAM-2/S-75 Dvina; vai trò radar trước nhiễu; cụm “vạch nhiễu tìm thù”; tài liệu đánh B-52 được phổ biến tới từng kíp chiến đấu | Nguồn báo chí quân đội, dùng để đưa claim sang hàng chờ reviewer; không thay thế sign-off của Trúc hoặc cho phép mô phỏng thao tác kỹ thuật |
| `SRC-1972-WEB-02` | Đại tá Bùi Đức Hiền, Báo Quân đội nhân dân Cuối tuần, [“Huyền thoại tên lửa SAM-2”](https://ct.qdnd.vn/phong-su-dieu-tra/huyen-thoai-ten-lua-sam-2-528519), 23/12/2022 | Chú thích ảnh bắt đầu “Kíp chiến đấu tên lửa SAM-2 Tiểu đoàn 57...”; các đoạn bắt đầu “Cuộc chiến của SAM-2...”, “Thời gian đầu...” và “Trong 12 ngày đêm...” | Có kíp chiến đấu SAM-2 trong chiến dịch; đối đầu B-52–SAM-2; gây nhiễu radar và môi trường nhiễu trong tháng 12/1972 | Không lấy các chi tiết thao tác, cự ly, tần số hoặc số liệu chiến quả vào Lesson 2 nếu Trúc chưa duyệt riêng |
| `SRC-1972-WEB-03` | Phỏng vấn Trung tướng Trần Ngọc Quyến, Báo Quân đội nhân dân Cuối tuần, [“Quân chủng Phòng không-Không quân: Chủ động, làm chủ bầu trời Tổ quốc”](https://ct.qdnd.vn/phong-van-trao-doi/quan-chung-phong-khong-khong-quan-chu-dong-lam-chu-bau-troi-to-quoc-528514), 23/12/2022 | Phần trả lời câu hỏi về công tác chuẩn bị: các đoạn “Thứ hai là công tác huấn luyện...”, “Chính vì vậy...” và “Thứ ba là công tác hiệp đồng...” | Công tác huấn luyện, cách dùng cụm “vạch nhiễu tìm thù” trong hồi cố, và hiệp đồng giữa các lực lượng PK-KQ | Chỉ hỗ trợ framing khái quát; không suy diễn thành quy trình nội bộ của một kíp hoặc lời thoại lịch sử |

Nguồn trên tái sử dụng registry đã có tại `docs/features/research-content-009.md` và `docs/content/SCREENPLAY-1972.md`; bảng này không tự xác nhận rằng reviewer đã đọc mọi trang được nêu.

## 2. Claim matrix cho Lesson 2

| Claim ID | Claim dự kiến | Truth class | Source/locator | Trạng thái | Wording constraint / hành động |
|---|---|---|---|---|---|
| `CLM-1972-VN-001` | Lesson đề cập hệ thống tên lửa phòng không SAM-2/S-75 Dvina trong bối cảnh phòng không Việt Nam năm 1972 | `verified_fact` candidate | `SRC-1972-WEB-01`, đoạn bắt đầu “SAM-2 là tên gọi...” | `READY_FOR_TRUC_REVIEW` | Trúc xác nhận cách viết `SAM-2`/`S-75 Dvina`; không đưa thông số kỹ thuật vào lesson theo claim này |
| `CLM-1972-VN-002` | Lesson đề cập một kíp chiến đấu SAM-2 và việc phối hợp ở mức khái quát, không tái dựng vị trí hoặc quy trình thật | `verified_fact` candidate | `SRC-1972-WEB-02`, chú thích ảnh “Kíp chiến đấu tên lửa SAM-2...” và `SRC-1972-WEB-01`, đoạn “...phổ biến tỉ mỉ cho từng kíp chiến đấu” | `READY_FOR_TRUC_REVIEW` | Đã thu hẹp claim: không nêu số người, chức danh, khẩu lệnh, thao tác hay thứ tự tác chiến nếu chưa có locator khác được Trúc duyệt |
| `CLM-1972-VN-003` | Nhiễu điện tử là một phần của đối đầu B-52–phòng không trong tháng 12/1972 | `verified_fact` candidate | `SRC-1972-WEB-02`, các đoạn bắt đầu “Cuộc chiến của SAM-2...” và “Trong 12 ngày đêm...” | `READY_FOR_TRUC_REVIEW` | Chỉ framing khái quát; không mô phỏng tín hiệu radar thật, tần số hoặc cách khắc chế |
| `CLM-1972-VN-004` | Cụm “vạch nhiễu tìm thù” dùng như nhan đề/diễn giải sư phạm về việc tìm mục tiêu trong nhiễu | `educational_explanation` candidate | `SRC-1972-WEB-01`, đoạn bắt đầu “Trên thực tế...” và `SRC-1972-WEB-03`, đoạn bắt đầu “Chính vì vậy...” | `READY_FOR_TRUC_REVIEW` | Đã gỡ blocker locator; vẫn không đưa vào narration fact hoặc mechanic “lựa chọn tối ưu” trước khi Trúc xác nhận nghĩa và framing |
| `CLM-1972-VN-005` | B-52 là đối tượng tác chiến trong cuộc tập kích đường không tháng 12/1972 | `verified_fact` candidate | `SRC-1972-WEB-01`, đoạn mở đầu và đoạn bắt đầu “Trong 12 ngày đêm...”; `SRC-1972-WEB-02`, đoạn bắt đầu “Cuộc chiến của SAM-2...” | `READY_FOR_TRUC_REVIEW` | Không đưa số tổn thất hoặc nguyên nhân rơi vào Lesson 2; số liệu trong nguồn nằm ngoài claim này |
| `CLM-1972-VN-006` | Người học là người phân tích hồ sơ; lựa chọn chỉ đổi thứ tự đọc, không thay đổi lịch sử | `educational_explanation` | Phase 1–3 contract; `LESSON-02-VISUAL-NOVEL-1972.md` | `READY_FOR_PRODUCT_REVIEW` | Không gán người học thành nhân vật thật hoặc cho phép quyết định kết quả trận đánh |

### Nội dung bị loại khỏi brief hiện tại

- Không dùng mechanic “bật/tắt radar”, chọn tần số, chọn thời điểm phóng hoặc một “lựa chọn tối ưu lịch sử” khi chưa có nguồn kỹ thuật và safety review.
- Không dùng lời thoại, khẩu lệnh, nội tâm hoặc tên một kíp chiến đấu có thật trong story draft.
- Không đưa con số B-52 bị bắn rơi vào Lesson 2; nếu cần ở lesson tổng kết phải trình bày nguồn Việt Nam và USAF song song theo `CLM-LB2-001`.
- Không dùng hình radar giả như bằng chứng lịch sử hoặc tuyên bố UI mô phỏng đúng khí tài thật.

## 3. Historical/fiction boundary

| Thành phần | Cho phép ở bước brief | Chỉ cho phép sau Trúc approve | Không cho phép |
|---|---|---|---|
| Narration | Objective, hướng dẫn đọc artifact, giới hạn vai trò người học | Fact có claim ID + source locator đã `APPROVED` | Fact không nguồn; trích dẫn hoặc khẩu lệnh được dựng lại |
| Branching choice | Chọn thứ tự đọc “phối hợp” hoặc “nhiễu” | Wording chi tiết đã được review | Nhánh thay đổi kết quả lịch sử hoặc ngầm chấm đúng/sai narrative choice |
| Knowledge check | Câu hỏi về giới hạn bằng chứng và khái niệm đã duyệt | Câu hỏi kỹ thuật sau khi source locator được khóa | Đưa answer key chưa duyệt hoặc biến thao tác chiến đấu thành game phản xạ |
| Perspective | Người phân tích hồ sơ phi cá nhân | Composite perspective có nhãn và approval riêng | Mạo danh nhân chứng/người thật hoặc bịa lời thoại/nội tâm |

## 4. Media boundary và accessibility package

Không asset bên ngoài nào là dependency bắt buộc của `CONTENT-016`. Story phải chạy được bằng text và sơ đồ nguyên bản do team tạo sau review.

**Quyết định phạm vi PR #45:** trạng thái `NO_ASSET_SELECTED` và `BLOCKED_UNTIL_CLAIMS_APPROVED` là guardrail cho bước sản xuất, không phải thiếu sót của authoring brief. PR này không chọn, nhúng hoặc xin duyệt một media asset cụ thể; acceptance của PR là text-first flow và yêu cầu metadata/fallback đã được khóa. Mọi asset vẫn cần task/claim và review riêng trước khi đi vào `StoryVersion`.

| Candidate ID | Loại | Nguồn/quyền | Metadata accessibility bắt buộc | Fallback | Trạng thái |
|---|---|---|---|---|---|
| `MED-1972-VN-DIAGRAM-01` | Sơ đồ khái niệm kíp chiến đấu | Chưa tạo; phải là artwork nguyên bản của team dựa trên fact đã duyệt; manifest ghi creator/date/version, không sao chép sơ đồ kỹ thuật chưa rõ quyền | Alt mô tả các nhóm chức năng; caption ghi “sơ đồ giáo dục, không phải bản vẽ kỹ thuật”; keyboard order và text equivalent | Ordered text list chứa cùng nội dung | `BLOCKED_UNTIL_CLAIMS_APPROVED` |
| `MED-1972-VN-RADAR-01` | Minh họa màn hình radar/nhiễu | Chưa chọn asset; không dùng ảnh/screenshot bên ngoài cho tới khi có source page, rightsholder và license/permission | Alt/caption phân biệt minh họa với ảnh khí tài thật; mô tả không chỉ dựa vào màu | Text giải thích giới hạn của minh họa | `NO_ASSET_SELECTED` |
| `AUD-1972-VN-01` | Còi/radar/SFX hoặc voice | Không chọn asset; audio không bắt buộc, không tái sử dụng audio/Edge TTS/reference package chưa clear quyền | Transcript/cue sheet cho lời nói và âm thanh có ý nghĩa; mute; không autoplay | Toàn bộ thông tin có bằng text | `NO_ASSET_SELECTED` |
| `VID-1972-VN-01` | Video artifact trong scene | Không thuộc dependency Lesson 2; nếu tái dùng video Lesson 1 phải tham chiếu media package đã duyệt riêng | Caption tiếng Việt, transcript, poster, alt/description và cue metadata | Transcript + poster + retry | `OUT_OF_SCOPE_PENDING_CONTENT-007` |

## 5. Gate để tạo narration và StoryVersion

Chỉ tạo narration chi tiết hoặc `StoryVersion` draft khi:

1. Thọ approve learner role, CLO-2/CLO-3, pacing và vị trí Lesson 2.
2. Trúc kiểm tra các locator `READY_FOR_TRUC_REVIEW`, rồi chuyển các claim thực sự dùng trong scene sang trạng thái được phép authoring.
3. Mỗi media được dùng có source/license/creator, alt, caption, transcript/cue nếu có audio và fallback; hoặc scene dùng text/original schematic theo boundary ở trên.
4. Story validator kiểm tra stable IDs, reachable scenes, narrative choice không có correctness và mọi continuing choice có transition.

Việc đủ gate authoring không mở M2/M3 và không tự biến story thành published content.
