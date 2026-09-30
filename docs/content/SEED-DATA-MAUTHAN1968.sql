-- ====================================================================
-- SEED DATA: CHAPTER MẬU THÂN 1968 — "SẤM SÉT NỘI ĐÔ"
-- Dự án: Sử Chill
-- Tác giả: Thọ (Member 1 — Content Lead)
-- Phục vụ: Milestone 4 (M4-02: Content Migrations & Database Seed)
-- Chuẩn kiến trúc: Phase 6 Database & Service Layer Spec
-- ====================================================================

-- 1. LEARNING OBJECTIVES
INSERT INTO learning_objectives (id, code, description) VALUES
  ('obj-mt68-clo1', 'CLO-MT68-1', 'Nhận diện bối cảnh và ý đồ chiến lược của Trung ương Đảng khi mở cuộc Tổng tiến công Tết Mậu Thân 1968.'),
  ('obj-mt68-clo2', 'CLO-MT68-2', 'Hiểu được nghệ thuật tác chiến và sự dũng cảm của các đội Biệt động Sài Gòn đánh vào 5 mục tiêu đầu não.'),
  ('obj-mt68-clo3', 'CLO-MT68-3', 'Phân tích vai trò của thế trận lòng dân và các căn hầm bí mật nuôi giấu vũ khí trong nội đô Sài Gòn.'),
  ('obj-mt68-clo4', 'CLO-MT68-4', 'Đánh giá bước ngoặt chiến lược buộc Mỹ phải xuống thang chiến tranh, chấp nhận đàm phán tại Hội nghị Paris.');

-- 2. CHAPTER METADATA
INSERT INTO chapters (id, slug, title, subtitle, summary, historical_period_label, estimated_minutes, status) VALUES
  ('ch-mt68-tong-tien-cong-mau-than', 'tong-tien-cong-mau-than-1968', 'Tổng Tiến Công và Nổi Dậy Xuân Mậu Thân 1968', 'Sấm Sét Nội Đô và Bước Ngoặt Chiến Lược', 'Tái hiện cuộc tập kích táo bạo bất ngờ của quân dân miền Nam đánh thẳng vào các đô thị và cơ quan đầu não đối phương đầu năm 1968.', 'Kháng chiến chống Mỹ cứu nước (1968)', 40, 'published');

INSERT INTO chapter_objectives (chapter_id, objective_id) VALUES
  ('ch-mt68-tong-tien-cong-mau-than', 'obj-mt68-clo1'),
  ('ch-mt68-tong-tien-cong-mau-than', 'obj-mt68-clo2'),
  ('ch-mt68-tong-tien-cong-mau-than', 'obj-mt68-clo3'),
  ('ch-mt68-tong-tien-cong-mau-than', 'obj-mt68-clo4');

-- 3. HISTORICAL SOURCES
INSERT INTO historical_sources (id, code, title, author_or_publisher, publication_year, source_type, external_url) VALUES
  ('src-mt68-01', 'SRC-MT68-01', 'Lịch sử Kháng chiến chống Mỹ cứu nước (1954-1975), Tập V', 'Viện Lịch sử Quân sự Việt Nam / NXB QĐND', 2013, 'published_book', 'https://baochinhphu.vn'),
  ('src-mt68-02', 'SRC-MT68-02', 'Lịch sử Lực lượng Vũ trang TP. Hồ Chí Minh (1945-2015)', 'Bộ Tư lệnh TP.HCM / NXB Quân đội Nhân dân', 2015, 'published_book', 'https://qdnd.vn'),
  ('src-mt68-03', 'SRC-MT68-03', 'Biệt động Sài Gòn trong Tết Mậu Thân 1968', 'Bảo tàng Biệt động Sài Gòn - Gia Định', 2018, 'monograph', 'https://nhandan.vn');

-- 4. LESSONS
INSERT INTO lessons (id, chapter_id, slug, title, summary, format, estimated_minutes, status) VALUES
  ('lsn-mt68-01', 'ch-mt68-tong-tien-cong-mau-than', 'ke-hoach-giao-thua', 'Bài 1: Kế Hoạch Giao Thừa', 'Kịch bản dẫn nhập 110s về quyết định lịch sử và thời khắc nổ súng đêm Giao thừa Tết Mậu Thân.', 'video', 5, 'published'),
  ('lsn-mt68-02', 'ch-mt68-tong-tien-cong-mau-than', 'sam-set-noi-do', 'Bài 2: Sấm Sét Nội Đô', 'Bản đồ tương tác 5 mục tiêu đầu não bị Biệt động Sài Gòn tiến công và phân tích chiến thuật.', 'visual_novel', 15, 'published'),
  ('lsn-mt68-03', 'ch-mt68-tong-tien-cong-mau-than', 'y-chi-quyet-chien', 'Bài 3: Ý Chí Quyết Chiến', 'Bài đọc phân tích bước ngoặt chiến lược làm lung lay chính trường Mỹ và mở ra bàn đàm phán Paris.', 'standard', 10, 'published'),
  ('lsn-mt68-04', 'ch-mt68-tong-tien-cong-mau-than', 'buoc-ngoat-lich-su-quiz', 'Bài 4: Bước Ngoặt Lịch Sử', 'Ngân hàng 5 câu hỏi trắc nghiệm đánh giá kiến thức toàn diện về sự kiện Mậu Thân 1968.', 'quiz', 10, 'published');

INSERT INTO lesson_objectives (lesson_id, objective_id) VALUES
  ('lsn-mt68-01', 'obj-mt68-clo1'),
  ('lsn-mt68-02', 'obj-mt68-clo2'),
  ('lsn-mt68-02', 'obj-mt68-clo3'),
  ('lsn-mt68-03', 'obj-mt68-clo4'),
  ('lsn-mt68-04', 'obj-mt68-clo1'),
  ('lsn-mt68-04', 'obj-mt68-clo2'),
  ('lsn-mt68-04', 'obj-mt68-clo3'),
  ('lsn-mt68-04', 'obj-mt68-clo4');

-- 5. QUESTIONS & QUIZ BANK (BÀI 4)
INSERT INTO question_sets (id, title, assessment_mode) VALUES
  ('qset-mt68-quiz', 'Bộ Đề Trắc Nghiệm Tổng Kết Chapter Mậu Thân 1968', 'scored');

INSERT INTO questions (id, question_set_id, order_index, prompt, explanation, source_id, correct_key) VALUES
  ('q-mt68-01', 'qset-mt68-quiz', 1, 'Quyết định mở cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 của Trung ương Đảng nhằm mục tiêu cốt lõi nào?', 'Giáng đòn quyết định vào ý chí xâm lược của Mỹ, buộc Mỹ phải xuống thang chiến tranh và ngồi vào bàn đàm phán.', 'src-mt68-01', 'B'),
  ('q-mt68-02', 'qset-mt68-quiz', 2, 'Để chuẩn bị vũ khí cho Biệt động đánh các mục tiêu đầu não tại Sài Gòn, lực lượng ta chủ yếu dựa vào phương thức nào?', 'Xây dựng các căn hầm bí mật ngay trong nhà dân giữa lòng đô thị để cất giấu vũ khí từ nhiều năm trước.', 'src-mt68-02', 'B'),
  ('q-mt68-03', 'qset-mt68-quiz', 3, 'Trong các mục tiêu bị Biệt động Sài Gòn tiến công, mục tiêu nào tạo nên cú sốc tâm lý lớn nhất đối với công chúng và chính giới Mỹ?', 'Tòa Đại sứ Mỹ tại trung tâm Sài Gòn.', 'src-mt68-03', 'A'),
  ('q-mt68-04', 'qset-mt68-quiz', 4, 'Sau đòn bất ngờ của Tết Mậu Thân 1968, Tổng thống Mỹ Lyndon B. Johnson đã phải tuyên bố nhượng bộ nào vào ngày 31/3/1968?', 'Tuyên bố ngừng ném bom miền Bắc từ vĩ tuyến 20 trở ra, cử đại diện đàm phán tại Paris và không tái tranh cử Tổng thống.', 'src-mt68-01', 'B'),
  ('q-mt68-05', 'qset-mt68-quiz', 5, 'Thắng lợi của cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 đã mở đường cho thắng lợi hoàn toàn thông qua việc:', 'Bẻ gãy ý chí xâm lược của Mỹ, buộc Mỹ phải chuyển sang "Việt Nam hóa chiến tranh" và ngồi vào bàn đàm phán Paris.', 'src-mt68-01', 'B');

INSERT INTO question_options (question_id, option_key, label) VALUES
  ('q-mt68-01', 'A', 'Giải phóng hoàn toàn miền Nam và kết thúc chiến tranh ngay trong năm 1968'),
  ('q-mt68-01', 'B', 'Giáng đòn quyết định vào ý chí xâm lược của Mỹ, buộc Mỹ phải xuống thang chiến tranh và ngồi vào bàn đàm phán'),
  ('q-mt68-01', 'C', 'Thử nghiệm các loại vũ khí mới do nước bạn viện trợ'),
  ('q-mt68-01', 'D', 'Đánh chiếm các hòn đảo ở Trường Sa'),
  ('q-mt68-02', 'A', 'Chờ máy bay thả dù vũ khí thẳng vào trung tâm thành phố'),
  ('q-mt68-02', 'B', 'Xây dựng các căn hầm bí mật ngay trong nhà dân giữa lòng đô thị để cất giấu vũ khí từ nhiều năm trước'),
  ('q-mt68-02', 'C', 'Mua trực tiếp từ các tàu chiến Mỹ'),
  ('q-mt68-02', 'D', 'Chỉ dùng vũ lực tay không cướp đồn địch'),
  ('q-mt68-03', 'A', 'Tòa Đại sứ Mỹ'),
  ('q-mt68-03', 'B', 'Trụ sở Cảnh sát Quốc gia'),
  ('q-mt68-03', 'C', 'Cầu Tân Thuận'),
  ('q-mt68-03', 'D', 'Bệnh viện Từ Dũ'),
  ('q-mt68-04', 'A', 'Tuyên bố từ chức ngay lập tức và trao quyền cho Phó Tổng thống'),
  ('q-mt68-04', 'B', 'Tuyên bố ngừng ném bom miền Bắc từ vĩ tuyến 20 trở ra, cử đại diện đàm phán tại Paris và không tái tranh cử'),
  ('q-mt68-04', 'C', 'Ký sắc lệnh rút toàn bộ quân về nước trong vòng 24 giờ'),
  ('q-mt68-04', 'D', 'Ra lệnh ném bom nguyên tử xuống miền Bắc'),
  ('q-mt68-05', 'A', 'Tiêu diệt toàn bộ quân viễn chinh Mỹ tại chỗ'),
  ('q-mt68-05', 'B', 'Bẻ gãy ý chí xâm lược của Mỹ, buộc Mỹ phải chuyển sang "Việt Nam hóa chiến tranh" và ngồi vào bàn đàm phán Paris'),
  ('q-mt68-05', 'C', 'Giải phóng toàn bộ các đô thị lớn ở miền Nam ngay trong năm 1968'),
  ('q-mt68-05', 'D', 'Xóa bỏ hoàn toàn chính quyền Sài Gòn trong vòng một tháng');
