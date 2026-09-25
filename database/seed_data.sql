BEGIN;

-- 1. Sources (INSERT INTO sources)
INSERT INTO sources (id, title, author, year_published, publisher) VALUES
(1, 'Lịch sử Việt Nam - Tập 12 (1954-1965)', 'Viện Sử học', 2017, 'NXB KHXH'),
(2, 'Lịch sử Việt Nam - Tập 13 (1965-1975)', 'Viện Sử học', 2017, 'NXB KHXH'),
(3, 'Lịch sử Nam Bộ kháng chiến - Tập 2', 'Hội đồng chỉ đạo biên soạn', 2011, 'NXB CTQG'),
(4, 'Tổng kết cuộc kháng chiến chống Mỹ, cứu nước', 'Bộ Quốc phòng', 1995, 'NXB CTQG'),
(5, 'Vietnam: A History', 'Stanley Karnow', 1983, 'Viking Press'),
(6, 'A Bright Shining Lie', 'Neil Sheehan', 1988, 'Random House'),
(7, 'We Were Soldiers Once... and Young', 'Harold Moore & Joseph Galloway', 1992, 'Random House');

-- 2. Roadmap
INSERT INTO roadmaps (id, title) VALUES
(1, 'Kháng chiến chống Mỹ cứu nước (1954-1975)');

-- 3. Chapters (5 chapters)
INSERT INTO chapters (id, roadmap_id, title, order_index) VALUES
(1, 1, 'Giai đoạn 1954-1960: Đấu tranh chính trị và phong trào Đồng khởi', 1),
(2, 1, 'Giai đoạn 1961-1964: Chiến tranh đặc biệt', 2),
(3, 1, 'Giai đoạn 1965-1968: Chiến tranh cục bộ', 3),
(4, 1, 'Giai đoạn 1969-1973: Việt Nam hóa chiến tranh', 4),
(5, 1, 'Giai đoạn 1974-1975: Tổng tiến công và thống nhất', 5);

-- 4. Lessons (Multiple lessons per chapter)
INSERT INTO lessons (id, chapter_id, title, order_index) VALUES
-- Chapter 1
(1, 1, 'Hiệp định Genève và sự chia cắt', 1),
(2, 1, 'Khởi nghĩa vũ trang và đường Trường Sơn', 2),
-- Chapter 2
(3, 2, 'Thách thức Chiến tranh đặc biệt', 1),
(4, 2, 'Những đòn giáng trả', 2),
-- Chapter 3
(5, 3, 'Đối đầu quân viễn chinh Mỹ', 1),
(6, 3, 'Bước ngoặt Mậu Thân', 2),
-- Chapter 4
(7, 4, 'Việt Nam hóa chiến tranh', 1),
(8, 4, 'Mùa hè rực lửa và Điện Biên Phủ trên không', 2),
(9, 4, 'Hiệp định Paris', 3),
-- Chapter 5
(10, 5, 'Bản lề lịch sử 1974-1975', 1),
(11, 5, 'Tổng tiến công mùa Xuân', 2),
(12, 5, 'Chiến dịch Hồ Chí Minh', 3);

-- 5. All 25 Historical Events
INSERT INTO events (id, lesson_id, title, event_date, location_name, latitude, longitude, l1_hook, l1_facts, l2_content) VALUES
-- Lesson 1 (Ch1)
(1, 1, 'Ký kết Hiệp định Genève (21/07/1954)', '1954-07-21', 'Genève, Thụy Sĩ', 46.2044, 6.1432, 
 'Một hiệp định cắt đôi đất nước – và lời hẹn tổng tuyển cử không bao giờ được thực hiện.', 
 'Ngày: 21/7/1954 | Vĩ tuyến 17 chia đôi | Tổng tuyển cử 1956 bị hủy', 
 'Kết thúc 9 năm kháng chiến chống Pháp. Việt Nam tạm chia hai miền tại vĩ tuyến 17. Mỹ không ký hiệp định, hậu thuẫn Ngô Đình Diệm ở miền Nam.'),
-- Lesson 2 (Ch1)
(2, 2, 'Phong trào Đồng khởi (1959-1960)', '1960-01-17', 'Bến Tre, Việt Nam', 10.2328, 106.3756, 
 'Từ Bến Tre, ngọn lửa Đồng khởi bùng lên thiêu cháy hệ thống kìm kẹp khắp Nam Bộ.', 
 '17/1/1960 Bến Tre | Lan rộng 600 xã | Mặt trận DTGP ra đời 20/12/1960', 
 'Phong trào nổi dậy từ đấu tranh chính trị sang vũ trang. Phá vỡ hệ thống kìm kẹp của chính quyền Diệm. Khai sinh Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.'),
(3, 2, 'Mở đường Trường Sơn / Đoàn 559 (19/05/1959)', '1959-05-19', 'Dọc dãy Trường Sơn', 16.5, 106.5, 
 '20.000 km đường mòn xuyên rừng rậm – tuyến huyết mạch nuôi sống cách mạng miền Nam.', 
 '19/5/1959 thành lập | 20.000 km đường | Hơn 2 triệu tấn vũ khí vận chuyển', 
 'Tuyến chi viện chiến lược Bắc-Nam. Vượt qua bom đạn hủy diệt của không quân Mỹ. Đảm bảo sức người sức của cho chiến trường miền Nam suốt 16 năm.'),
-- Lesson 3 (Ch2)
(4, 3, 'Chiến thắng Ấp Bắc (02/01/1963)', '1963-01-02', 'Mỹ Tho, Tiền Giang', 10.4, 106.3, 
 'Chỉ bằng súng trường, du kích bắn hạ 5 trực thăng UH-1 tối tân của Mỹ.', 
 '02/01/1963 | 5 trực thăng bị bắn rơi | Đánh bại trực thăng vận & thiết xa vận', 
 'Quân đội VNCH mở càn quét lớn vào Ấp Bắc. Quân giải phóng bám trụ, bẻ gãy các đợt tấn công. Báo hiệu sự phá sản chiến lược Chiến tranh đặc biệt.'),
-- Lesson 4 (Ch2)
(5, 4, 'Chiến dịch Bình Giã (12/1964-01/1965)', '1964-12-01', 'Bà Rịa - Vũng Tàu', 10.5, 107.1, 
 'Lần đầu tiên quân chủ lực miền Nam đánh tiêu diệt gọn tiểu đoàn tinh nhuệ đối phương.', 
 'Tháng 12/1964 | Tiêu diệt nhiều tiểu đoàn | Sụp đổ Chiến tranh đặc biệt', 
 'Chiến dịch tấn công chủ động đầu tiên quy mô lớn. Tiêu diệt gọn các tiểu đoàn chủ lực VNCH. Cơ bản làm sụp đổ hoàn toàn chiến lược Chiến tranh đặc biệt.'),
-- Lesson 5 (Ch3)
(6, 5, 'Mỹ đổ bộ quân vào Đà Nẵng (08/03/1965)', '1965-03-08', 'Bãi biển Đà Nẵng', 16.0544, 108.2022, 
 '3.500 lính thủy đánh bộ Mỹ đổ bộ lên bãi biển – cuộc chiến bước sang trang mới.', 
 '08/03/1965 | 3.500 Marines | Mở màn Chiến tranh cục bộ', 
 'Chiến tranh đặc biệt thất bại, Mỹ trực tiếp đưa bộ binh vào. Hai tiểu đoàn TQLC đổ bộ lên bãi biển Đà Nẵng. Đánh dấu Mỹ can thiệp quân sự trực tiếp bằng lục quân.'),
(7, 5, 'Trận Vạn Tường (18/08/1965)', '1965-08-18', 'Vạn Tường, Quảng Ngãi', 15.3, 108.8, 
 'Ấp Bắc đối với quân viễn chinh Mỹ – trận đánh mở đầu phong trào Tìm Mỹ mà đánh.', 
 '18/08/1965 | Đánh bại Chiến dịch Ánh sáng sao | Quân giải phóng thắng quân viễn chinh Mỹ', 
 'Mỹ mở cuộc hành quân Starlite quy mô lớn vào Vạn Tường. Quân giải phóng bẻ gãy các mũi tiến công bộ binh và xe tăng. Khẳng định khả năng đánh thắng trực tiếp quân đội Mỹ.'),
(8, 5, 'Chiến dịch Plei Me - Ia Đrăng (10-11/1965)', '1965-10-19', 'Gia Lai, Tây Nguyên', 13.7, 107.8, 
 'Bám thắt lưng địch mà đánh – chiến thuật thiên tài khiến bom Mỹ trở nên vô dụng.', 
 'Tháng 10-11/1965 | Đụng độ Sư đoàn Kỵ binh bay số 1 | Chiến thuật giáp lá cà', 
 'Bao vây cứ điểm Plei Me thu hút quân viện. Đụng độ lớn với kỵ binh không vận Mỹ tại thung lũng Ia Đrăng. Hình thành chiến thuật "bám thắt lưng địch mà đánh".'),
(9, 5, 'Chiến dịch Junction City (02-04/1967)', '1967-02-22', 'Tây Ninh', 11.4, 106.1, 
 'Cuộc hành quân lớn nhất của Mỹ tìm diệt căn cứ đầu não kháng chiến – và thất bại.', 
 '02-04/1967 | 25.000 quân Mỹ | Thất bại tìm diệt Trung ương Cục', 
 'Mỹ huy động 25.000 quân càn quét căn cứ Dương Minh Châu. Quân giải phóng phân tán linh hoạt bảo toàn lực lượng. Cuộc hành quân tìm diệt lớn nhất chiến tranh bị đập tan.'),
-- Lesson 6 (Ch3)
(10, 6, 'Chiến dịch Đường 9 - Khe Sanh (01-07/1968)', '1968-01-21', 'Quảng Trị', 16.6, 106.7, 
 '77 ngày vây hãm khiến Mỹ điều 6.000 quân phòng thủ – trong khi mục tiêu thật ở nơi khác.', 
 '01-07/1968 | 77 ngày bị vây | Kéo căng lực lượng Mỹ ra biên giới', 
 'Quân giải phóng bao vây căn cứ Thủy quân lục chiến Mỹ tại Khe Sanh. Mỹ phải tập trung lực lượng lớn giải vây. Kéo căng chiến tuyến, tạo điều kiện cho Tết Mậu Thân.'),
(11, 6, 'Tổng tiến công và nổi dậy Tết Mậu Thân (30/01-09/1968)', '1968-01-30', 'Sài Gòn, Huế và các đô thị miền Nam', 10.8231, 106.6297, 
 'Đêm giao thừa, quân giải phóng đồng loạt tấn công 36 thành phố – cú sốc chấn động nước Mỹ.', 
 '30/01/1968 | Tấn công 36 đô thị | Buộc Mỹ đàm phán', 
 'Tấn công bất ngờ đồng loạt vào 36 thành phố và đô thị. Đánh vào Đại sứ quán Mỹ, Dinh Độc Lập, sân bay Tân Sơn Nhất. Buộc Mỹ tuyên bố phi Mỹ hóa và ngồi vào bàn đàm phán Paris.'),
-- Lesson 7 (Ch4)
(12, 7, 'Thành lập Chính phủ CMLT CHMNVN (06/1969)', '1969-06-06', 'Tây Ninh', 11.35, 106.1, 
 'Một chính phủ ra đời giữa chiến khu – đại diện hợp pháp của nhân dân miền Nam trên trường quốc tế.', 
 '06/06/1969 | Chủ tịch: Huỳnh Tấn Phát | Được 23 nước công nhận', 
 'Thành lập cơ quan nhà nước hợp pháp của cách mạng miền Nam. Được hàng chục quốc gia trên thế giới công nhận. Tham gia đàm phán tại Hội nghị Paris.'),
(13, 7, 'Chiến dịch Đường 9 - Nam Lào (01-03/1971)', '1971-01-30', 'Nam Lào, Đường 9 - Quảng Trị', 16.5, 106.5, 
 'Lần thử nghiệm lớn nhất của Việt Nam hóa chiến tranh – quân đội Sài Gòn đại bại không Mỹ hỗ trợ mặt đất.', 
 '01-03/1971 | VNCH tổn thất nặng | Việt Nam hóa chiến tranh thất bại', 
 'Mỹ cho quân VNCH tiến vào Nam Lào cắt đường Trường Sơn. Quân giải phóng phản công mạnh mẽ, gây tổn thất lớn. Đánh bại cuộc thử nghiệm chiến lược Việt Nam hóa chiến tranh.'),
-- Lesson 8 (Ch4)
(14, 8, 'Tiến công chiến lược năm 1972 (03-10/1972)', '1972-03-30', 'Quảng Trị, Tây Nguyên, Đông Nam Bộ', 16.7, 107.1, 
 'Ba mũi tiến công đồng loạt chọc thủng ba phòng tuyến – cuộc tấn công lớn nhất kể từ Mậu Thân.', 
 '03-10/1972 | Ba hướng chiến lược | Chọc thủng tuyến phòng ngự', 
 'Tấn công đồng loạt trên 3 hướng: Quảng Trị, Tây Nguyên, Đông Nam Bộ. Giải phóng thị xã Quảng Trị và nhiều vùng rộng lớn. Buộc Mỹ phải quay lại ném bom dữ dội để cứu vãn.'),
(15, 8, '81 ngày đêm bảo vệ Thành Cổ Quảng Trị (06-09/1972)', '1972-06-28', 'Thị xã Quảng Trị', 16.73, 107.19, 
 '81 ngày đêm chiến đấu khốc liệt – mỗi mét vuông Thành Cổ thấm đẫm máu chiến sĩ.', 
 '81 ngày (06-09/1972) | Hàng nghìn chiến sĩ hy sinh | Tạo thế mạnh trên bàn đàm phán Paris', 
 'Cuộc đọ sức khốc liệt nhất trong chiến tranh. Bộ đội kiên cường bảo vệ Thành Cổ trước hỏa lực hủy diệt. Tạo vị thế áp đảo trên bàn đàm phán ngoại giao tại Paris.'),
(16, 8, 'Chiến dịch Điện Biên Phủ trên không (18-30/12/1972)', '1972-12-18', 'Hà Nội, Hải Phòng', 21.0285, 105.8542, 
 '34 pháo đài bay B-52 – biểu tượng sức mạnh không quân Mỹ – bị bắn rơi trên bầu trời Hà Nội.', 
 '12 ngày đêm (18-30/12) | 81 máy bay rơi (34 B-52) | Đập tan tối hậu thư Mỹ', 
 'Mỹ ném bom rải thảm bằng B-52 nhằm buộc Việt Nam nhượng bộ. Quân dân Hà Nội bắn rơi 81 máy bay, gồm 34 B-52. Nixon phải chấp nhận ký Hiệp định Paris.'),
-- Lesson 9 (Ch4)
(17, 9, 'Ký kết Hiệp định Paris (27/01/1973)', '1973-01-27', 'Paris, Pháp', 48.8566, 2.3522, 
 '4 năm 8 tháng đàm phán – Mỹ buộc phải cam kết rút toàn bộ quân về nước.', 
 '27/01/1973 | Mỹ rút quân | Chấm dứt can thiệp quân sự trực tiếp', 
 'Kết quả 4 năm 8 tháng đàm phán cam go tại Paris. Mỹ buộc phải rút toàn bộ quân đội về nước. Công nhận quyền tự quyết của nhân dân Việt Nam.'),
(18, 9, 'Quân nhân Mỹ cuối cùng rời Việt Nam (29/03/1973)', '1973-03-29', 'Sân bay Tân Sơn Nhất, Sài Gòn', 10.8188, 106.6522, 
 'Người lính Mỹ cuối cùng bước lên máy bay – "Đánh cho Mỹ cút" hoàn thành.', 
 '29/03/1973 | Sân bay Tân Sơn Nhất | Hoàn thành mục tiêu "Đánh cho Mỹ cút"', 
 'Thực hiện điều khoản rút quân theo Hiệp định Paris. Toàn bộ quân đội viễn chinh Mỹ rời khỏi Việt Nam. Hoàn thành bước đầu mục tiêu chiến lược: "Đánh cho Mỹ cút".'),
-- Lesson 10 (Ch5)
(19, 10, 'Chiến dịch Đường 14 - Phước Long (12/1974-01/1975)', '1974-12-13', 'Bình Phước', 11.8, 106.9, 
 'Trận trinh sát chiến lược – phép thử quyết định cho Tổng tiến công mùa Xuân 1975.', 
 '12/1974-01/1975 | Giải phóng tỉnh Phước Long | Mỹ không can thiệp trở lại', 
 'Trận đánh thăm dò phản ứng của Mỹ sau khi rút quân. Giải phóng hoàn toàn tỉnh Phước Long. Khẳng định Mỹ không có khả năng quay lại can thiệp quân sự.'),
-- Lesson 11 (Ch5)
(20, 11, 'Chiến dịch Tây Nguyên (04-24/03/1975)', '1975-03-04', 'Buôn Ma Thuột, Kon Tum, Gia Lai', 12.68, 108.05, 
 'Đòn điểm huyệt Buôn Ma Thuột – làm tan rã cả một quân đoàn trong vài ngày.', 
 '10/03/1975 giải phóng BMT | Quân đoàn II tan rã | Mở đầu Tổng tiến công mùa Xuân 1975', 
 'Đánh bất ngờ vào Buôn Ma Thuột – trọng điểm Tây Nguyên. Quân đoàn II đối phương tan rã, rút chạy hỗn loạn. Mở đầu cuộc Tổng tiến công mùa Xuân 1975.'),
(21, 11, 'Chiến dịch giải phóng Huế (21-26/03/1975)', '1975-03-21', 'Thừa Thiên Huế', 16.4637, 107.5909, 
 '5 ngày giải phóng Cố đô – tuyến phòng thủ phía Bắc miền Nam sụp đổ.', 
 '21-26/03/1975 | Giải phóng Huế | Cắt đứt Trị-Thiên', 
 'Quân giải phóng thần tốc tiến vào giải phóng Cố đô Huế. Cắt đứt hoàn toàn tuyến phòng thủ Trị-Thiên. Tạo thế tấn công áp đảo từ phía Bắc.'),
(22, 11, 'Chiến dịch giải phóng Đà Nẵng (26-29/03/1975)', '1975-03-26', 'Đà Nẵng', 16.0544, 108.2022, 
 'Căn cứ quân sự lớn thứ hai miền Nam thất thủ trong 3 ngày – chớp nhoáng như sấm sét.', 
 '26-29/03/1975 | 3 ngày giải phóng | Căn cứ liên hợp quân sự lớn nhất sụp đổ', 
 'Tiến công thần tốc giải phóng Đà Nẵng trong 3 ngày. Tiêu diệt căn cứ liên hợp quân sự lớn thứ hai ở miền Nam. Đối phương hoảng loạn, tan rã không kịp tổ chức phòng thủ.'),
-- Lesson 12 (Ch5)
(23, 12, 'Trận Xuân Lộc (09-21/04/1975)', '1975-04-09', 'Đồng Nai', 10.95, 107.25, 
 'Cánh cửa thép bảo vệ Sài Gòn bị phá vỡ – phòng tuyến cuối cùng sụp đổ.', 
 '09-21/04/1975 | 12 ngày chiến đấu | Phá vỡ cửa ngõ phía Đông Sài Gòn', 
 'Trận quyết chiến ác liệt nhất giai đoạn cuối chiến tranh. Quân giải phóng phá vỡ phòng tuyến kiên cố nhất bảo vệ Sài Gòn. Mở toang cửa ngõ phía Đông cho đại quân tiến vào Sài Gòn.'),
(24, 12, 'Chiến dịch Hồ Chí Minh (26-30/04/1975)', '1975-04-26', 'Sài Gòn - Gia Định', 10.8231, 106.6297, 
 '5 cánh quân ào ạt tiến vào Sài Gòn – chiến dịch quyết chiến chiến lược cuối cùng.', 
 '26-30/04/1975 | 5 cánh quân | Giải phóng hoàn toàn miền Nam', 
 'Chiến dịch quyết chiến chiến lược với 5 cánh quân. Tiến công thần tốc từ 5 hướng vào Sài Gòn. Xe tăng húc đổ cổng Dinh Độc Lập lúc 11h30 ngày 30/4/1975.'),
(25, 12, 'Cắm cờ trên Dinh Độc Lập (11:30, 30/04/1975)', '1975-04-30', 'Dinh Độc Lập, Sài Gòn', 10.7769, 106.6951, 
 '11 giờ 30 phút – lá cờ tung bay trên nóc Dinh Độc Lập, non sông thu về một mối.', 
 '11:30 ngày 30/04/1975 | Dương Văn Minh đầu hàng | Thống nhất đất nước', 
 'Xe tăng T-54 số hiệu 843 húc đổ cổng Dinh Độc Lập. Tổng thống Dương Văn Minh tuyên bố đầu hàng không điều kiện. Kết thúc 21 năm kháng chiến, đất nước hoàn toàn thống nhất.');

-- 6. Event-Source mappings
INSERT INTO event_sources (event_id, source_id) VALUES
(1, 1), (1, 5), (2, 1), (2, 3), (3, 1), (3, 4), (4, 1), (4, 6), (5, 1), (5, 4),
(6, 2), (6, 5), (7, 2), (7, 4), (8, 2), (8, 7), (9, 2), (9, 4), (10, 2), (10, 5),
(11, 2), (11, 5), (12, 2), (13, 2), (13, 4), (14, 2), (14, 4), (15, 2), (15, 4),
(16, 2), (16, 4), (17, 2), (17, 5), (18, 2), (19, 2), (19, 4), (20, 2), (20, 4),
(21, 2), (21, 4), (22, 2), (22, 4), (23, 2), (23, 4), (24, 2), (24, 4), (25, 2), (25, 4);

-- 7. Quizzes and Questions
INSERT INTO quizzes (id, chapter_id, title) VALUES
(1, 1, 'Trắc nghiệm Giai đoạn 1954-1960'),
(2, 2, 'Trắc nghiệm Giai đoạn 1961-1964'),
(3, 3, 'Trắc nghiệm Giai đoạn 1965-1968'),
(4, 4, 'Trắc nghiệm Giai đoạn 1969-1973'),
(5, 5, 'Trắc nghiệm Giai đoạn 1974-1975');

INSERT INTO questions (id, quiz_id, content, explanation) VALUES
-- Quiz 1
(1, 1, 'Hiệp định Genève chia cắt Việt Nam tại vĩ tuyến bao nhiêu?', 'Việt Nam tạm chia hai miền tại vĩ tuyến 17.'),
(2, 1, 'Phong trào Đồng khởi bắt đầu từ tỉnh nào?', 'Bến Tre là quê hương của phong trào Đồng khởi.'),
(3, 1, 'Đoàn 559 được thành lập vào ngày tháng năm nào?', 'Đoàn 559 được thành lập ngày 19/05/1959.'),
(4, 1, 'Mặt trận Dân tộc Giải phóng miền Nam Việt Nam ra đời năm nào?', 'Mặt trận ra đời ngày 20/12/1960 trong phong trào Đồng khởi.'),
-- Quiz 2
(5, 2, 'Chiến thắng Ấp Bắc đánh bại chiến thuật nào của Mỹ?', 'Chiến thắng Ấp Bắc đánh bại chiến thuật trực thăng vận và thiết xa vận.'),
(6, 2, 'Trận Ấp Bắc diễn ra vào năm nào?', 'Diễn ra ngày 02/01/1963.'),
(7, 2, 'Chiến dịch Bình Giã đã làm sụp đổ chiến lược nào của Mỹ?', 'Làm sụp đổ cơ bản chiến lược Chiến tranh đặc biệt.'),
(8, 2, 'Mục tiêu chính của quân giải phóng trong trận Bình Giã là gì?', 'Tiêu diệt chủ lực của quân đội Sài Gòn.'),
-- Quiz 3
(9, 3, 'Quân Mỹ đổ bộ lần đầu tiên vào đâu năm 1965?', '3.500 lính thủy đánh bộ Mỹ đổ bộ lên bãi biển Đà Nẵng.'),
(10, 3, 'Chiến dịch nào có sự đụng độ lớn với Sư đoàn Kỵ binh bay số 1?', 'Chiến dịch Plei Me - Ia Đrăng.'),
(11, 3, 'Mục tiêu của Mỹ trong chiến dịch Junction City là gì?', 'Tìm diệt cơ quan đầu não Trung ương Cục miền Nam nhưng thất bại.'),
(12, 3, 'Tết Mậu Thân 1968 đánh vào bao nhiêu đô thị?', 'Quân giải phóng tấn công đồng loạt 36 thành phố và đô thị.'),
-- Quiz 4
(13, 4, 'Chiến dịch Điện Biên Phủ trên không diễn ra trong bao nhiêu ngày đêm?', 'Diễn ra trong 12 ngày đêm cuối năm 1972.'),
(14, 4, 'Thành cổ Quảng Trị được bảo vệ trong bao nhiêu ngày đêm?', 'Bộ đội đã kiên cường bảo vệ trong 81 ngày đêm.'),
(15, 4, 'Hiệp định Paris được ký kết vào ngày nào?', 'Ký kết ngày 27/01/1973 buộc Mỹ rút quân.'),
(16, 4, 'Lính Mỹ cuối cùng rời khỏi Việt Nam tại đâu?', 'Rời khỏi sân bay Tân Sơn Nhất ngày 29/03/1973.'),
-- Quiz 5
(17, 5, 'Trận đánh nào được coi là đòn điểm huyệt mở màn Tổng tiến công mùa Xuân 1975?', 'Chiến dịch Tây Nguyên với trận Buôn Ma Thuột.'),
(18, 5, 'Chiến dịch giải phóng Huế diễn ra trong bao nhiêu ngày?', 'Diễn ra thần tốc trong 5 ngày (21-26/03/1975).'),
(19, 5, 'Trận đánh phá vỡ phòng tuyến cuối cùng bảo vệ Sài Gòn là?', 'Trận Xuân Lộc phá vỡ cánh cửa thép phía Đông.'),
(20, 5, 'Cờ giải phóng tung bay trên Dinh Độc Lập lúc mấy giờ?', '11h30 ngày 30/04/1975.');

INSERT INTO answer_options (id, question_id, content, is_correct) VALUES
(1, 1, 'Vĩ tuyến 16', FALSE), (2, 1, 'Vĩ tuyến 17', TRUE), (3, 1, 'Vĩ tuyến 18', FALSE), (4, 1, 'Vĩ tuyến 19', FALSE),
(5, 2, 'Bến Tre', TRUE), (6, 2, 'Long An', FALSE), (7, 2, 'Tiền Giang', FALSE), (8, 2, 'Cà Mau', FALSE),
(9, 3, '19/05/1958', FALSE), (10, 3, '19/05/1959', TRUE), (11, 3, '19/05/1960', FALSE), (12, 3, '19/05/1961', FALSE),
(13, 4, '1959', FALSE), (14, 4, '1960', TRUE), (15, 4, '1961', FALSE), (16, 4, '1962', FALSE),
(17, 5, 'Tìm diệt', FALSE), (18, 5, 'Bình định', FALSE), (19, 5, 'Trực thăng vận và Thiết xa vận', TRUE), (20, 5, 'Quét và giữ', FALSE),
(21, 6, '1961', FALSE), (22, 6, '1962', FALSE), (23, 6, '1963', TRUE), (24, 6, '1964', FALSE),
(25, 7, 'Chiến tranh đơn phương', FALSE), (26, 7, 'Chiến tranh đặc biệt', TRUE), (27, 7, 'Chiến tranh cục bộ', FALSE), (28, 7, 'Việt Nam hóa chiến tranh', FALSE),
(29, 8, 'Chiếm đất', FALSE), (30, 8, 'Phá ấp chiến lược', FALSE), (31, 8, 'Tiêu diệt chủ lực', TRUE), (32, 8, 'Mở rộng hành lang', FALSE),
(33, 9, 'Đà Nẵng', TRUE), (34, 9, 'Chu Lai', FALSE), (35, 9, 'Quy Nhơn', FALSE), (36, 9, 'Cam Ranh', FALSE),
(37, 10, 'Trận Vạn Tường', FALSE), (38, 10, 'Chiến dịch Plei Me - Ia Đrăng', TRUE), (39, 10, 'Chiến dịch Junction City', FALSE), (40, 10, 'Chiến dịch Khe Sanh', FALSE),
(41, 11, 'Mở rộng căn cứ', FALSE), (42, 11, 'Tìm diệt Trung ương Cục', TRUE), (43, 11, 'Chiếm Tây Ninh', FALSE), (44, 11, 'Đóng đồn bốt', FALSE),
(45, 12, '34 đô thị', FALSE), (46, 12, '35 đô thị', FALSE), (47, 12, '36 đô thị', TRUE), (48, 12, '37 đô thị', FALSE),
(49, 13, '10 ngày đêm', FALSE), (50, 13, '11 ngày đêm', FALSE), (51, 13, '12 ngày đêm', TRUE), (52, 13, '15 ngày đêm', FALSE),
(53, 14, '79 ngày đêm', FALSE), (54, 14, '80 ngày đêm', FALSE), (55, 14, '81 ngày đêm', TRUE), (56, 14, '82 ngày đêm', FALSE),
(57, 15, '27/01/1972', FALSE), (58, 15, '27/01/1973', TRUE), (59, 15, '27/01/1974', FALSE), (60, 15, '27/01/1975', FALSE),
(61, 16, 'Sân bay Tân Sơn Nhất', TRUE), (62, 16, 'Sân bay Biên Hòa', FALSE), (63, 16, 'Sân bay Đà Nẵng', FALSE), (64, 16, 'Cảng Sài Gòn', FALSE),
(65, 17, 'Chiến dịch Đường 14', FALSE), (66, 17, 'Chiến dịch Tây Nguyên', TRUE), (67, 17, 'Chiến dịch Huế - Đà Nẵng', FALSE), (68, 17, 'Trận Xuân Lộc', FALSE),
(69, 18, '3 ngày', FALSE), (70, 18, '5 ngày', TRUE), (71, 18, '7 ngày', FALSE), (72, 18, '9 ngày', FALSE),
(73, 19, 'Trận Phước Long', FALSE), (74, 19, 'Trận Xuân Lộc', TRUE), (75, 19, 'Trận Biên Hòa', FALSE), (76, 19, 'Trận Lộc Ninh', FALSE),
(77, 20, '10h30', FALSE), (78, 20, '11h00', FALSE), (79, 20, '11h30', TRUE), (80, 20, '12h00', FALSE);

-- 8. Admin user
INSERT INTO users (id, username, role) VALUES
(1, 'admin_suchill', 'admin'),
(2, 'test_user', 'user');

-- 9. Sample user progress
INSERT INTO user_progress (user_id, lesson_id, completed_at) VALUES
(2, 1, '2023-10-01 10:00:00'),
(2, 2, '2023-10-02 11:30:00'),
(2, 3, '2023-10-05 14:15:00');

COMMIT;
