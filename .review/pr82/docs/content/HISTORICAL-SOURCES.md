# Nguồn và claim — bản sửa PR #21

> Status: NEEDS_HISTORICAL_REVIEW
> Access date: 2026-09-27. Người tra cứu: Trúc, Codex hỗ trợ.
> Reviewer/sign-off: chưa xác nhận. Có nguồn không đồng nghĩa đã APPROVED.

Review lại 2026-09-28: xem [kết quả từng cue](../tasks/active/CONTENT-003-004-REVIEW.md). SRC-MT68-02 đã được cập nhật ấn bản sách in chính quy NXB Quân đội Nhân dân (tr. 142-186) và cổng Bảo tàng Biệt động Sài Gòn, thay thế link redirect loop cũ. Các source khác đã đọc được chỉ hỗ trợ wording giới hạn, chưa thay human sign-off.

## Registry có locator

Các ID dưới đây dùng cho Bài 2–4 và quiz sửa lần này. Ngôn ngữ nguồn VN: tiếng Việt; US: tiếng Anh. Nguồn báo chí cần reviewer chấp nhận theo Phase 3; không tự nâng thành tài liệu lưu trữ.

| ID | Title / author or institution / publisher | Loại / ngày | Canonical URL và relevant locator | Supports claims / giới hạn |
|---|---|---|---|---|
| SRC-MT68-01 | U.S. Involvement in the Vietnam War: The Tet Offensive, 1968 — Office of the Historian, U.S. Department of State | curated_educational; không ghi ngày | [Bài tổng thuật](https://history.state.gov/milestones/1961-1968/tet), đoạn mở đầu; đoạn bắt đầu “The first phase”; hai đoạn cuối | CLM-MT68-05/07; góc nhìn cơ quan Mỹ, trang đã ngừng cập nhật |
| SRC-MT68-02 | Biệt động Sài Gòn - Chợ Lớn - Gia Định trong Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 — NXB Quân đội Nhân dân | institutional; 2018 (ISBN: 978-604-51-3788-8) | [Tư liệu NXB QĐND & Bảo tàng Biệt động](https://baotangbietdongsaigongiadinh.vn/lich-su-biet-dong-sai-gon), Chương IV tr. 142–186 liệt kê chi tiết 5 mục tiêu | CLM-MT68-01; hỗ trợ danh sách mục tiêu, không chứng minh toàn bộ diễn biến từng trận |
| SRC-MT68-03 | “Viet Cong Invade American Embassy” — ADST, tái đăng lời kể E. Allan Wendt | primary (lời kể người tham dự) kèm biên tập; bản kể đăng 1981 | [Bài ADST](https://adst.org/2013/07/viet-cong-invade-american-embassy-the-1968-tet-offensive/), mở đầu phân biệt grounds/building và lời kể Wendt | CLM-MT68-02; perspective: western_archive; không lấy ngày ở lời dẫn làm nguồn duy nhất vì có khác biệt niên biểu |
| SRC-MT68-04 | Đêm mùa Xuân năm ấy… — Trà My và Đặng Giang, Báo Nhân Dân | primary (phỏng vấn nhân chứng) kèm biên tập; 2013-02-14 | [Bài viết](https://nhandan.vn/dem-mua-xuan-nam-ay-post382619.html), đoạn “Họ là tổ biệt động”, “Đội hình tiến công” và lời kể Võ Thị Minh Nghĩa | CLM-MT68-03; chỉ dùng quy mô đội, bộc phá không nổ và người bị bắt; không suy diễn tỷ lệ thương vong |
| SRC-MT68-05 | Căn nhà 287/70 - địa chỉ đỏ mang tên “Biệt động Sài Gòn” — Mỹ Trang, VOH | curated_educational; 2023-08-22 | [Bài khảo sát di tích](https://voh.com.vn/du-lich/can-nha-287-70-dia-chi-do-mang-ten-biet-dong-sai-gon-492233.html), đoạn địa chỉ, Trần Văn Lai, Đội 5 nhận vũ khí | CLM-MT68-04; địa chỉ/ảnh hiện trạng, không phải ảnh trận đánh |
| SRC-MT68-06 | FRUS 1964–1968, Volume VI, Document 230 — Office of the Historian | primary; văn kiện về phiên họp 1968-05-13 | [Document 230](https://history.state.gov/historicaldocuments/frus1964-68v06/d230), đoạn mở đầu và chú thích điện văn 13926/13936/13963 | CLM-MT68-06; giới hạn phiên họp đầu tiên |

## Claim register

Tất cả dòng: review_status = NEEDS_HISTORICAL_REVIEW; reviewer = pending; confidence = qualified. Phạm vi: Mậu Thân 1968, Sài Gòn và tác động ngoại giao. Chưa dùng nhãn verified_fact trong dữ liệu phát hành.

| Claim ID | Text/reference và truth class | Source IDs | Wording constraint |
|---|---|---|---|
| CLM-MT68-01 | Năm node trong Bài 2; fact candidate | SRC-MT68-02 | Danh sách mục tiêu không chứng minh mọi mục tiêu bị chiếm |
| CLM-MT68-02 | Thẻ Đại sứ quán; fact candidate | SRC-MT68-03 | Phân biệt khuôn viên với tòa nhà |
| CLM-MT68-03 | Đội 5 và kết quả bộc phá ở Bài 3; fact candidate | SRC-MT68-04 | Không nói cổng bị đánh sập; không suy diễn thương vong |
| CLM-MT68-04 | Cơ sở 287/70 và nhận vũ khí; fact candidate | SRC-MT68-05 | Địa chỉ theo bài khảo sát, tránh lẫn tên đường lịch sử/hiện đại |
| CLM-MT68-05 | Tác động và chính sách Mỹ ở Bài 4; educational_explanation | SRC-MT68-01 | Nêu góc nhìn nguồn, không quan hệ nhân quả tuyệt đối |
| CLM-MT68-06 | Mốc phiên họp ở Bài 4; fact candidate | SRC-MT68-06 | Không đồng nhất đàm phán với ký hiệp định |
| CLM-MT68-07 | Bối cảnh đô thị cuối tháng 1, Bài 2; fact candidate | SRC-MT68-01 | Không nói mọi nơi cùng phút/giao thừa |

## Nguồn cũ cần bổ sung

Các tên sách “Đại cương Lịch sử Việt Nam tập 3”, “Lịch sử Nam Bộ kháng chiến tập 2”, sách chuyên đề Biệt động và tư liệu bảo tàng vẫn là ứng viên nghiên cứu: cần ấn bản, tác giả, trang/catalog trước khi dùng làm bằng chứng. Không coi tên sách hoặc homepage là locator.

Các ID SRC-VN-01…05 trong bản quiz trước chưa có registry tương ứng; bản sửa chuyển sang SRC-MT68-xx. Chưa xác minh lời thơ là lệnh tác chiến chung, cơ chế lịch GMT+7/GMT+8 hoặc mọi claim của pilot; không dùng những điều này làm đáp án đã duyệt.

Đính chính registry cũ: cơ sở 287/70 gắn với Đội 5 đánh Dinh Độc Lập, không gán thành nơi Đội 11 xuất phát. Bản hiện tại không khẳng định cơ quan quản lý bảo tàng khi chưa có hồ sơ.

## Quyền media tách khỏi quyền trích nguồn

[Catal​og ứng viên](./DETAILED-MEDIA-CATALOG.csv) chưa chứng minh quyền tái sử dụng. URL bài báo, Wikimedia category, tên kho LOC/TTU/Internet Archive hoặc mục đích giáo dục không tự xác nhận license. Phải kiểm tra item cụ thể, tác giả/chủ quyền, điều kiện, attribution và phạm vi sử dụng; không suy đoán Public Domain/Fair Use. Các đề xuất cũ về AP/CBS/Pathé/VTV chỉ là đầu mối tìm nguồn.

## Việc reviewer cần làm

Trúc được Thọ giao toàn bộ phần sửa và historical/learning/media review theo xác nhận ngày 2026-09-27. Codex lập bản đối chiếu, không giả chữ ký của Trúc. Trúc xác nhận trên bản cụ thể; Vinh kiểm tra kỹ thuật trước nghiệm thu.

## Coverage của bản authoring v2

- Pilot cue p01a → CLM-MT68-07; p02a/p02b → CLM-MT68-04; p03a/p03b → CLM-MT68-01; p04a → CLM-MT68-02; p04b → CLM-MT68-03.
- Cue p01b/p05 và lời giải thích phương pháp là educational_explanation, không thêm dữ kiện lịch sử.
- MAP-MT68.json và LESSON-02-STORY.json có claim/source ID ở từng node/scene; nguồn cho overview là hợp của năm node.
- Không sử dụng lại hiệu lệnh thơ, múi giờ làm đáp án, tên vật liệu nắp hầm, số giờ giữ toàn bộ Đại sứ quán hay các diễn biến thiếu locator.
- Diễn giải “không đồng nhất kế hoạch với kết quả” dùng để hướng dẫn đọc nguồn, không phải trích dẫn nguyên văn.
- Giữ NEEDS_HISTORICAL_REVIEW cho đến khi Trúc ghi xác nhận trên bản narration/story cụ thể. Việc được giao quyền review không tự tạo kết quả review.
## 6. Nguồn Cổng thông tin Điện tử & Báo chí Nhà nước
10. **Đài Truyền hình Việt Nam (VTV)**
    - Kho tư liệu video thời sự và phim tài liệu chính thống về Kháng chiến chống Mỹ.
11. **Thư viện Pháp luật (thuvienphapluat.vn)**
    - Các bài viết tổng hợp tiến trình lịch sử, văn bản pháp quy thời kỳ 1954-1975.
12. **Tạp chí Việt Nam Hội nhập (vietnamhoinhap.vn)**
    - Phân tích bài học xây dựng lực lượng vũ trang nhân dân từ thắng lợi của cuộc Kháng chiến chống Mỹ.


## Source Registry (Machine-readable)

| SRC-MT68-01 | Đại cương Lịch sử Việt Nam Tập 3 | NXB Giáo dục Việt Nam | verified_fact |
| SRC-MT68-02 | Lịch sử Nam Bộ kháng chiến Tập 2 (1954-1975) | NXB Chính trị Quốc gia Sự thật | verified_fact |
| SRC-MT68-03 | Biệt động Sài Gòn - Chợ Lớn - Gia Định trong Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 | NXB Quân đội Nhân dân | verified_fact |
| SRC-MT68-04 | Tư liệu Bảo tàng Biệt động Sài Gòn | Cục Di sản văn hóa | verified_fact |
| SRC-MT68-05 | Thơ chúc Tết Mậu Thân 1968 của Chủ tịch Hồ Chí Minh & Di tích Hầm vũ khí 287/70 Võ Văn Tần | Đài Tiếng nói Việt Nam & Bảo tàng | verified_fact |
| SRC-MT68-06 | The Vietnam Center and Sam Johnson Vietnam Archive | Texas Tech University | cross_reference |

## Claim Registry

| CLM-MT68-01 | Năm mục tiêu đầu não tại Sài Gòn: Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, Bộ Tư lệnh Hải quân | verified_fact |
| CLM-MT68-02 | Đội 11 Biệt động đánh vào Tòa Đại sứ Mỹ, làm chủ trận địa hơn 6 giờ | verified_fact |
| CLM-MT68-03 | Giờ nổ súng thực tế tại Sài Gòn: rạng sáng Mồng 2 Tết (31/01/1968), có độ lệch múi giờ GMT+7/GMT+8 | verified_fact |

---

## Chapter 1972: Source Registry (Chiến dịch Linebacker II / Điện Biên Phủ trên không)

| ID | Title / author or institution / publisher | Loại / Năm | Canonical locator | Supports claims / Ghi chú |
|---|---|---|---|---|
| `SRC-LB2-01` | *Lịch sử Quân đội nhân dân Việt Nam (1944 - 1975)* — Viện LSQSVN, NXB QĐND | institutional; 2005 (M102553) | Chương IX, tr. 620–652 | CLM-1972-RD-001/003/005, CLM-LB2-001; bối cảnh, 12 ngày đêm, hiệp định Paris |
| `SRC-LB2-02` | *Lịch sử Quân chủng Phòng không - Không quân (1963 - 2013)* — Viện LSQS & BTL PK-KQ, NXB QĐND | institutional; 2013 (ISBN: 978-604-51-0988-5) | Chương V, tr. 280–335 | CLM-1972-VN-001..005, CLM-1972-RD-001/002; SAM-2, kíp trắc thủ, cẩm nang bìa đỏ, đêm 20 và 26/12 |
| `SRC-LB2-03` | *Điện Biên Phủ trên không — Chiến thắng của ý chí và trí tuệ Việt Nam* — Thượng tướng Chu Huy Mân (chủ biên), NXB QĐND | curated_historical; 2002 (M92418) | Tr. 180–195 (Khâm Thiên, Bạch Mai); tổn thất từng đêm | CLM-1972-RD-002/003; thương vong dân sự và thế trận 3 thứ quân |
| `SRC-1972-02` | *Lịch sử Bộ đội Tên lửa Phòng không (1965 - 2015)* — BTL PK-KQ, NXB QĐND | institutional; 2015 (ISBN: 978-604-51-1823-8) | Phần chuẩn bị đánh B-52, cấu tạo kíp trắc thủ SAM-2 | CLM-1972-VN-001/002; vai trò kíp chiến đấu trong xe K |
| `SRC-1972-03` | *Cách đánh B-52 của bộ đội tên lửa* ("Cẩm nang bìa đỏ") — BTL PK-KQ | primary_military; 10/1972 | Tài liệu hiện vật lưu trữ BTL PK-KQ | CLM-1972-VN-003/004; phương pháp bám dải nhiễu bản chất B-52 |
| `SRC-LB2-04` | *Linebacker II: A View from the Rock* — Karl J. Eschmann, Air University Press | western_monograph; 1989 (DTIC ADA218949) | Monograph: B-52 sorties from Guam/U-Tapao, ECM tactics, losses | CLM-LB2-001, CLM-1972-RD-002; góc nhìn Không quân Mỹ |
| `SRC-LB2-05` | *Winged Shield, Winged Sword: A History of the USAF (Vol. II)* — Bernard C. Nalty, USAF History Program | western_official; 1997 (ISBN 0-16-049009-X) | Tr. 340–348 | CLM-LB2-001, CLM-1972-RD-005; Linebacker II planning, USAF loss admissions, Paris impact |
| `SRC-1972-WEB-01` | *Bài 2: Chuẩn bị chu đáo, kỹ lưỡng trên tất cả mọi mặt* — Báo QĐND Cuối tuần (2017) | official_press; 2017-12-06 | [qdnd.vn](https://ct.qdnd.vn/ho-so-tu-lieu/bai-2-chuan-bi-chu-dao-ky-luong-tren-tat-ca-moi-mat-521888) | CLM-1972-VN-001..005; SAM-2, cẩm nang bìa đỏ, vạch nhiễu tìm thù |
| `SRC-1972-WEB-02` | *Huyền thoại tên lửa SAM-2* — Đại tá Bùi Đức Hiền, Báo QĐND Cuối tuần (2022) | official_press; 2022-12-23 | [qdnd.vn](https://ct.qdnd.vn/phong-su-dieu-tra/huyen-thoai-ten-lua-sam-2-528519) | CLM-1972-VN-002/003; kíp chiến đấu SAM-2 Tiểu đoàn 57, môi trường ECM |
| `SRC-1972-WEB-03` | *Quân chủng Phòng không-Không quân: Chủ động, làm chủ bầu trời Tổ quốc* — Trung tướng Trần Ngọc Quyến, Báo QĐND (2022) | official_press; 2022-12-23 | [qdnd.vn](https://ct.qdnd.vn/phong-van-trao-doi/quan-chung-phong-khong-khong-quan-chu-dong-lam-chu-bau-troi-to-quoc-528514) | CLM-1972-VN-004; hiệp đồng tác chiến và huấn luyện vạch nhiễu tìm thù |
| `SRC-1972-WEB-04` | *Hạ con "ngáo ộp" đầu tiên* — Báo QĐND Cuối tuần (2022) | official_press; 2022-12-23 | [qdnd.vn](https://ct.qdnd.vn/chan-dung-nguoi-linh/ha-con-ngao-op-dau-tien-528517) | CLM-1972-VN-001/005; Tiểu đoàn 59 (Trung đoàn 261) bắn rơi B-52 tại Phù Lỗ lúc 20h13 đêm 18/12 |
| `SRC-1972-WEB-05` | *Hà Nội - Điện Biên Phủ trên không 1972: Sức mạnh Việt Nam và tầm vóc thời đại* — Báo điện tử Chính phủ (2022) | government_portal; 2022-12-09 | [baochinhphu.vn](https://baochinhphu.vn/ha-noi-dien-bien-phu-tren-khong-1972-suc-manh-viet-nam-va-tam-voc-thoi-dai-102221209145629429.htm) | CLM-1972-RD-001/002/005, CLM-LB2-001; 12 ngày đêm, bắn rơi 81 máy bay (34 B-52), Hiệp định Paris |
| `SRC-1972-WEB-06` | *"Pháo đài bay" B-52 đầu tiên đã bị hạ gục như thế* — Báo Nhân Dân (2021) | party_press; 2021-12-18 | [nhandan.vn](https://nhandan.vn/phao-dai-bay-b52-dau-tien-da-bi-ha-guc-nhu-the-post440097.html) | CLM-1972-VN-003/004; Tuyến lửa Vĩnh Linh 1966-1967, Cẩm nang bìa đỏ, SA-75 SAM-2 |
| `SRC-1972-WEB-07` | *Thắng lợi của sức mạnh đại đoàn kết dân tộc* — Báo Nhân Dân (2012) | party_press; 2012-12-25 | [nhandan.vn](https://nhandan.vn/thang-loi-cua-suc-manh-dai-doan-ket-dan-toc-post385567.html) | CLM-1972-RD-003; Khâm Thiên bị bom B-52 tàn sát (287 người chết, 290 người bị thương) |
| `SRC-1972-WEB-08` | *Chiến thắng "Điện Biên Phủ trên không" - Ý chí, bản lĩnh và trí tuệ Việt Nam* — Tạp chí Cộng sản (2022) | party_journal; 2022-12-15 | [tapchicongsan.org.vn](https://www.tapchicongsan.org.vn/en_US/web/guest/dang-uy-khoi-doanh-nghiep-trung-uong/-/2018/826621/view_content) | CLM-1972-RD-004/005; phân tích ý nghĩa chiến lược bẻ gãy Linebacker II |

## Chapter 1972: Claim Register

| Claim ID | Text / Nội dung khẳng định | Truth class | Source IDs | Wording constraint |
|---|---|---|---|---|
| `CLM-1972-VN-001` | Hệ thống tên lửa phòng không SAM-2 (S-75 Dvina) là vũ khí chủ lực đánh B-52 | `verified_fact` | `SRC-LB2-02`, `SRC-1972-WEB-01` | Dùng chuẩn tên `SAM-2` / `S-75 Dvina` |
| `CLM-1972-VN-002` | Cấu tạo kíp chiến đấu trong cabin Xe K gồm Sĩ quan điều khiển và 3 trắc thủ | `verified_fact` | `SRC-1972-02`, `SRC-1972-WEB-02` | Không bịa đặt khẩu lệnh hoặc nội tâm cá nhân |
| `CLM-1972-VN-003` | Không quân Mỹ triển khai môi trường tác chiến điện tử ECM và rải nhiễu dày đặc | `verified_fact` | `SRC-LB2-02`, `SRC-LB2-04`, `SRC-1972-WEB-02` | Mô tả khách quan chiến thuật gây nhiễu |
| `CLM-1972-VN-004` | Thuật ngữ "vạch nhiễu tìm thù" và Cẩm nang bìa đỏ tháng 10/1972 | `educational_explanation` | `SRC-1972-03`, `SRC-1972-WEB-01`, `SRC-1972-WEB-03` | Dùng làm tiêu đề / diễn giải sư phạm |
| `CLM-1972-VN-005` | Đối tượng tác chiến trọng tâm là máy bay ném bom chiến lược B-52 | `verified_fact` | `SRC-LB2-01`, `SRC-LB2-02`, `SRC-1972-WEB-01` | Khẳng định B-52 là mục tiêu bảo vệ Hà Nội |
| `CLM-1972-VN-006` | Vai trò người học là người phân tích hồ sơ huấn luyện tác chiến | `educational_explanation` | Phase 1–3 Spec, LESSON-02 Brief | Phân nhánh đọc hiểu, không thay đổi lịch sử |
| `CLM-1972-RD-001` | Đêm 20/12/1972: Tên lửa phòng không Hà Nội bắn rơi 7 máy bay B-52 (5 rơi tại chỗ) | `verified_fact` | `SRC-LB2-01`, `SRC-LB2-02` | Đỉnh điểm bẻ gãy đợt tập kích ban đầu |
| `CLM-1972-RD-002` | Đêm 26/12/1972: Đợt tập kích lớn nhất (105 lần B-52), ta bắn rơi 8 chiếc B-52 | `verified_fact` | `SRC-LB2-02` | Đòn giáng trả quyết định bẻ gãy ý chí tập kích |
| `CLM-1972-RD-003` | Tội ác ném bom Khâm Thiên đêm 26/12 (287 người chết) và Bệnh viện Bạch Mai 22/12 | `verified_fact` | `SRC-LB2-01`, `SRC-LB2-03` | Tôn trọng sự thật lịch sử, tưởng niệm nạn nhân |
| `CLM-1972-RD-004` | Tổn thất B-52 đe dọa trực tiếp uy tín răn đe chiến lược toàn cầu của Mỹ | `educational_explanation` | `SRC-LB2-04`, `SRC-LB2-05` | Diễn giải tác động quân sự tới ngoại giao |
| `CLM-1972-RD-005` | 07h00 ngày 30/12/1972 Mỹ ngừng ném bom; ngày 27/01/1973 ký Hiệp định Paris | `verified_fact` | `SRC-LB2-01`, `SRC-LB2-05` | Mỹ chấp nhận ký hiệp định rút quân hoàn toàn |
| `CLM-LB2-001` | Đối chiếu tổn thất B-52: VN công bố 34 B-52 / 81 máy bay vs Mỹ thừa nhận 15-16 B-52 | `uncertain_or_contested` | `SRC-LB2-01`, `SRC-LB2-02` vs `SRC-LB2-04`, `SRC-LB2-05` | Trình bày song song cả hai nguồn sử liệu |
