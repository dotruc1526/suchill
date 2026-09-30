-- ====================================================================
-- SEED DATA: CHAPTER 1972 — "ĐIỆN BIÊN PHỦ TRÊN KHÔNG"
-- Dự án: Sử Chill
-- Tác giả: Thọ (Member 1 — Content Lead)
-- Phục vụ: Milestone 4 (M4-02: Content Migrations & Database Seed)
-- Chuẩn kiến trúc: Phase 6 Database & Service Layer Spec
-- ====================================================================

-- 1. LEARNING OBJECTIVES
INSERT INTO learning_objectives (id, code, description) VALUES
  ('obj-1972-clo1', 'CLO-1', 'Nhận diện bối cảnh hội nghị Paris bế tắc và âm mưu ném bom rải thảm của chiến dịch Linebacker II.'),
  ('obj-1972-clo2', 'CLO-2', 'Hiểu được cấu trúc kíp chiến đấu và cách thức vận hành hệ thống tên lửa phòng không SAM-2 (S-75 Dvina).'),
  ('obj-1972-clo3', 'CLO-3', 'Nhận diện chiến thuật nhiễu điện tử của Không quân Mỹ và cách bộ đội ta "vạch nhiễu tìm thù" bằng Cẩm nang bìa đỏ.'),
  ('obj-1972-clo4', 'CLO-4', 'Phân tích ý nghĩa chiến lược của việc bắn rơi B-52, buộc Mỹ ký Hiệp định Paris 1973.');

-- 2. CHAPTER METADATA
INSERT INTO chapters (id, slug, title, subtitle, summary, historical_period_label, estimated_minutes, status) VALUES
  ('ch-1972-dien-bien-phu-tren-khong', 'dien-bien-phu-tren-khong-1972', 'Điện Biên Phủ Trên Không 1972', '12 Ngày Đêm Rực Lửa và Bản Lĩnh Thăng Long', 'Tái hiện cuộc đối đầu lịch sử tháng 12/1972 giữa quân dân miền Bắc và siêu pháo đài bay B-52 của Mỹ, dẫn tới việc ký kết Hiệp định Paris 1973.', 'Kháng chiến chống Mỹ cứu nước (1972 - 1973)', 45, 'published');

INSERT INTO chapter_objectives (chapter_id, objective_id) VALUES
  ('ch-1972-dien-bien-phu-tren-khong', 'obj-1972-clo1'),
  ('ch-1972-dien-bien-phu-tren-khong', 'obj-1972-clo2'),
  ('ch-1972-dien-bien-phu-tren-khong', 'obj-1972-clo3'),
  ('ch-1972-dien-bien-phu-tren-khong', 'obj-1972-clo4');

-- 3. HISTORICAL SOURCES
INSERT INTO historical_sources (id, code, title, author_or_publisher, publication_year, source_type, external_url) VALUES
  ('src-1972-pk-kq', 'SRC-1972-01', 'Lịch sử Quân chủng Phòng không - Không quân (1963 - 2013)', 'NXB Quân đội Nhân dân', 2013, 'published_book', 'https://ct.qdnd.vn/ho-so-tu-lieu/bai-2-chuan-bi-chu-dao-ky-luong-tren-tat-ca-moi-mat-521888'),
  ('src-1972-tenlua', 'SRC-1972-02', 'Lịch sử Bộ đội Tên lửa Phòng không (1965 - 2015)', 'NXB Quân đội Nhân dân', 2015, 'published_book', 'https://ct.qdnd.vn/phong-su-dieu-tra/huyen-thoai-ten-lua-sam-2-528519'),
  ('src-1972-camnang', 'SRC-1972-03', 'Cẩm nang Cách đánh B-52 của bộ đội tên lửa (Cẩm nang bìa đỏ)', 'Bộ Tư lệnh Quân chủng PK-KQ', 1972, 'military_manual', 'https://nhandan.vn/phao-dai-bay-b52-dau-tien-da-bi-ha-guc-nhu-the-post440097.html'),
  ('src-1972-hcm', 'SRC-1972-04', 'Hồ Chí Minh Toàn tập, Tập 15', 'NXB Chính trị Quốc gia Sự thật', 2011, 'published_book', 'https://baochinhphu.vn/ha-noi-dien-bien-phu-tren-khong-1972-suc-manh-viet-nam-va-tam-voc-thoi-dai-102221209145629429.htm'),
  ('src-1972-hanoi', 'SRC-1972-05', 'Lịch sử Đảng bộ thành phố Hà Nội (1930 - 2000)', 'NXB Hà Nội', 2004, 'published_book', 'https://nhandan.vn/thang-loi-cua-suc-manh-dai-doan-ket-dan-toc-post385567.html');

-- 4. LESSONS
INSERT INTO lessons (id, chapter_id, slug, title, summary, format, estimated_minutes, status) VALUES
  ('lsn-1972-01', 'ch-1972-dien-bien-phu-tren-khong', 'toi-hau-thu-tu-bau-troi', 'Bài 1: Tối Hậu Thư Từ Bầu Trời', 'Video tài liệu 110s dẫn nhập về âm mưu mở chiến dịch Linebacker II của Mỹ và lời tiên đoán của Bác Hồ.', 'video', 5, 'published'),
  ('lsn-1972-02', 'ch-1972-dien-bien-phu-tren-khong', 'sam2-vach-nhieu-tim-thu', 'Bài 2: SAM-2: Vạch Nhiễu Tìm Thù', 'Interactive Visual Novel 8 cảnh tái hiện kíp chiến đấu trong xe điều khiển tên lửa SAM-2 vạch nhiễu bắn rơi B-52.', 'visual_novel', 15, 'published'),
  ('lsn-1972-03', 'ch-1972-dien-bien-phu-tren-khong', '12-ngay-dem-ruc-lua', 'Bài 3: 12 Ngày Đêm Rực Lửa', 'Bài đọc tiêu chuẩn 3 hồi về tội ác Khâm Thiên, trận đánh quyết định đêm 26/12 và đối chiếu số liệu khách quan.', 'standard', 15, 'published'),
  ('lsn-1972-04', 'ch-1972-dien-bien-phu-tren-khong', 'trac-nghiem-tri-thuc-1972', 'Bài 4: Trắc Nghiệm Tri Thức 1972', 'Ngân hàng 5 câu hỏi trắc nghiệm tổng hợp đánh giá toàn diện 4 chuẩn đầu ra của Chapter.', 'quiz', 10, 'published');

INSERT INTO lesson_objectives (lesson_id, objective_id) VALUES
  ('lsn-1972-01', 'obj-1972-clo1'),
  ('lsn-1972-02', 'obj-1972-clo2'),
  ('lsn-1972-02', 'obj-1972-clo3'),
  ('lsn-1972-03', 'obj-1972-clo4'),
  ('lsn-1972-04', 'obj-1972-clo1'),
  ('lsn-1972-04', 'obj-1972-clo2'),
  ('lsn-1972-04', 'obj-1972-clo3'),
  ('lsn-1972-04', 'obj-1972-clo4');

-- 5. VISUAL NOVEL STORY & SCENES (BÀI 2)
INSERT INTO visual_novel_stories (id, title, summary) VALUES
  ('story-1972-sam2', 'Kíp Chiến Đấu SAM-2 — Vạch Nhiễu Tìm Thù', 'Trải nghiệm nhập vai kíp xe chỉ huy điều khiển tên lửa phòng không SAM-2 tại trận địa bảo vệ Hà Nội 1972.');

INSERT INTO story_versions (id, story_id, version_number, status, start_scene_id) VALUES
  ('story-ver-1972-sam2-v1', 'story-1972-sam2', 1, 'published', 'sam2-v1-briefing');

INSERT INTO scenes (id, story_version_id, kind, title, payload) VALUES
  ('sam2-v1-briefing', 'story-ver-1972-sam2-v1', 'narration', 'Hầm Chỉ Huy', '{"text": "Đêm 18 tháng 12 năm 1972. Bầu trời Hà Nội đặc quánh những dải nhiễu điện tử của Không quân Mỹ.", "nextSceneId": "sam2-v1-cabin"}'),
  ('sam2-v1-cabin', 'story-ver-1972-sam2-v1', 'narration', 'Xe Điều Khiển Cabin PA-00', '{"text": "Bên trong xe điều khiển chật chội, bốn người lính trẻ căng mắt trước màn huỳnh quang radar.", "nextSceneId": "sam2-v1-choice-role"}'),
  ('sam2-v1-choice-role', 'story-ver-1972-sam2-v1', 'choice', 'Phân Công Tác Chiến', '{"prompt": "Bạn muốn quan sát vị trí chỉ huy nào trước?", "policy": "continue_after_feedback"}'),
  ('sam2-v1-officer', 'story-ver-1972-sam2-v1', 'narration', 'Sĩ Quan Điều Khiển', '{"text": "Sĩ quan điều khiển là linh hồn kíp xe, quyết định thời điểm phát sóng và phát lệnh phóng đạn.", "nextSceneId": "sam2-v1-crew"}'),
  ('sam2-v1-crew', 'story-ver-1972-sam2-v1', 'narration', 'Kíp Ba Trắc Thủ', '{"text": "Ba trắc thủ (Góc tà, Phương vị, Cự ly) phối hợp nhịp nhàng để đưa vạch cữ trùng tâm dải nhiễu.", "nextSceneId": "sam2-v1-check"}'),
  ('sam2-v1-check', 'story-ver-1972-sam2-v1', 'choice', 'Xử Lý Tình Huống Tác Chiến', '{"prompt": "Tại sao không được bật phát sóng radar liên tục từ xa?", "policy": "continue_after_feedback"}'),
  ('sam2-v1-launch', 'story-ver-1972-sam2-v1', 'narration', 'Lệnh Phóng Tên Lửa', '{"text": "Khẩu lệnh phát ra: Phóng! Hai quả tên lửa SAM-2 rời bệ lao thẳng vào dải nhiễu B-52.", "nextSceneId": "sam2-v1-end"}'),
  ('sam2-v1-end', 'story-ver-1972-sam2-v1', 'narration', 'B-52 Đền Tội', '{"text": "Quầng lửa bốc cháy dữ dội trên bầu trời Phù Lỗ: B-52 bị tiêu diệt tại chỗ!", "nextSceneId": null}');

-- 6. QUESTIONS & QUIZ BANK (BÀI 4)
INSERT INTO question_sets (id, title, assessment_mode) VALUES
  ('qset-1972-quiz', 'Bộ Đề Trắc Nghiệm Tổng Kết Chapter 1972', 'scored');

INSERT INTO questions (id, question_set_id, order_index, prompt, explanation, source_id, correct_key) VALUES
  ('q-1972-01', 'qset-1972-quiz', 1, 'Mỹ đã huy động loại máy bay ném bom chiến lược nào làm lực lượng chủ công trong Chiến dịch Linebacker II (12/1972)?', 'Mỹ đã huy động gần 200 pháo đài bay B-52 Stratofortress ném bom rải thảm miền Bắc.', 'src-1972-pk-kq', 'A'),
  ('q-1972-02', 'qset-1972-quiz', 2, 'Trở ngại kỹ thuật lớn nhất bộ đội tên lửa phòng không Việt Nam phải giải quyết để bắn hạ B-52 là gì?', 'Màn hình radar bị che phủ bởi các dải nhiễu điện tử dày đặc, đòi hỏi kỹ năng vạch nhiễu tìm thù.', 'src-1972-camnang', 'B'),
  ('q-1972-03', 'qset-1972-quiz', 3, 'Trong đêm 26/12/1972, địa điểm dân cư đông đúc nào tại Hà Nội đã bị bom rải thảm B-52 tàn phá khốc liệt nhất làm 287 người thiệt mạng?', 'Khu phố Khâm Thiên đã bị bom B-52 san phẳng đêm 26/12/1972.', 'src-1972-hanoi', 'B'),
  ('q-1972-04', 'qset-1972-quiz', 4, 'Trong đêm tập kích quy mô lớn nhất ngày 26/12/1972, quân dân miền Bắc đã lập kỷ lục bắn rơi bao nhiêu máy bay B-52?', 'Đêm 26/12/1972, quân dân miền Bắc bắn rơi 8 máy bay B-52 (Hà Nội diệt 5 chiếc, 4 chiếc rơi tại chỗ).', 'src-1972-tenlua', 'C'),
  ('q-1972-05', 'qset-1972-quiz', 5, 'Thắng lợi của Chiến dịch Điện Biên Phủ trên không đã tạo tiền đề quyết định dẫn tới sự kiện nào ngay sau đó?', 'Buộc Mỹ phải ký Hiệp định Paris (27/01/1973) rút toàn bộ quân viễn chinh về nước.', 'src-1972-pk-kq', 'B');

INSERT INTO question_options (question_id, option_key, label) VALUES
  ('q-1972-01', 'A', 'B-52 Stratofortress ("Pháo đài bay")'),
  ('q-1972-01', 'B', 'B-2 Spirit'),
  ('q-1972-01', 'C', 'B-29 Superfortress'),
  ('q-1972-01', 'D', 'F-4 Phantom II'),
  ('q-1972-02', 'A', 'Đạn tên lửa SAM-2 không đủ tầm bắn vươn tới 10.000m'),
  ('q-1972-02', 'B', 'Màn hình radar bị bao phủ bởi các dải nhiễu điện tử dày đặc, đòi hỏi kỹ năng vạch nhiễu tìm thù'),
  ('q-1972-02', 'C', 'Thiếu hụt bệ phóng tên lửa ở ngoại thành Hà Nội'),
  ('q-1972-02', 'D', 'Không có sĩ quan chỉ huy được đào tạo bài bản'),
  ('q-1972-03', 'A', 'Khu phố cổ Hàng Đào'),
  ('q-1972-03', 'B', 'Khu phố Khâm Thiên'),
  ('q-1972-03', 'C', 'Khu vực Cầu Giấy'),
  ('q-1972-03', 'D', 'Thị xã Sơn Tây'),
  ('q-1972-04', 'A', '2 chiếc'),
  ('q-1972-04', 'B', '5 chiếc'),
  ('q-1972-04', 'C', '8 chiếc (Hà Nội bắn rơi 5 chiếc)'),
  ('q-1972-04', 'D', '15 chiếc'),
  ('q-1972-05', 'A', 'Ký kết Hiệp định Genève năm 1954'),
  ('q-1972-05', 'B', 'Ký kết Hiệp định Paris (27/01/1973), buộc toàn bộ quân Mỹ rút khỏi Việt Nam'),
  ('q-1972-05', 'C', 'Chiến dịch Điện Biên Phủ toàn thắng năm 1954'),
  ('q-1972-05', 'D', 'Ký kết Tuyên bố chung hòa bình với Pháp');
