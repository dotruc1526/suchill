# Nguồn và claim — bản sửa PR #21

> Status: NEEDS_HISTORICAL_REVIEW
> Access date: 2026-09-27. Người tra cứu: Trúc, Codex hỗ trợ.
> Reviewer/sign-off: chưa xác nhận. Có nguồn không đồng nghĩa đã APPROVED.

Review lại 2026-09-28: xem [kết quả từng cue](../tasks/active/CONTENT-003-004-REVIEW.md). SRC-MT68-02 chưa truy cập lại được (redirect loop); giữ CLM-MT68-01 chờ evidence, không đánh dấu VERIFIED. Các source khác đã đọc được chỉ hỗ trợ wording giới hạn, chưa thay human sign-off.

## Registry có locator

Các ID dưới đây dùng cho Bài 2–4 và quiz sửa lần này. Ngôn ngữ nguồn VN: tiếng Việt; US: tiếng Anh. Nguồn báo chí cần reviewer chấp nhận theo Phase 3; không tự nâng thành tài liệu lưu trữ.

| ID | Title / author or institution / publisher | Loại / ngày | Canonical URL và relevant locator | Supports claims / giới hạn |
|---|---|---|---|---|
| SRC-MT68-01 | U.S. Involvement in the Vietnam War: The Tet Offensive, 1968 — Office of the Historian, U.S. Department of State | curated_educational; không ghi ngày | [Bài tổng thuật](https://history.state.gov/milestones/1961-1968/tet), đoạn mở đầu; đoạn bắt đầu “The first phase”; hai đoạn cuối | CLM-MT68-05/07; góc nhìn cơ quan Mỹ, trang đã ngừng cập nhật |
| SRC-MT68-02 | Người chỉ huy biệt động Sài Gòn–Gia Định tài ba — Báo Quân đội nhân dân | curated_educational; ngày cần kiểm tra lại | [Bài viết](https://www.qdnd.vn/phong-su-dieu-tra/phong-su/nguoi-chi-huy-biet-dong-sai-gon-gia-dinh-tai-ba-449193), đoạn liệt kê “5 điểm” trong lời kể về Nguyễn Đức Hùng | CLM-MT68-01; hỗ trợ danh sách mục tiêu, không chứng minh toàn bộ diễn biến từng trận |
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
