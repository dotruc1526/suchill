-- ==============================================================================
-- Su Chill - Seed Data Migration
-- Nạp đầy đủ toàn bộ dữ liệu mẫu ban đầu vào Supabase Database
-- ==============================================================================

-- 1. Nạp CHƯƠNG LỊCH SỬ (chapters)
INSERT INTO public.chapters (id, year, title, subtitle, description, progress, status, unsplash_id, order_index)
VALUES (
    1,
    '1954',
    'ĐIỂM NGOẶT',
    'Chiến thắng Điện Biên Phủ & Hiệp định Genève',
    'Năm 1954 đánh dấu bước ngoặt lịch sử: Chiến thắng Điện Biên Phủ vang dội năm châu và Ký kết Hiệp định Genève.',
    0.8,
    'current',
    '1470290378698-92266f76aebc',
    1
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description;

-- 2. Nạp BÀI HỌC (lessons)
INSERT INTO public.lessons (id, chapter_id, title, duration, status, visual_novel_id, order_index, key_points)
VALUES 
(
    1,
    1,
    'BỐI CẢNH',
    7,
    'completed',
    NULL,
    1,
    ARRAY[
        'Chiến dịch Điện Biên Phủ: 13/3 – 7/5/1954 (56 ngày đêm)',
        'Đại tướng Võ Nguyên Giáp trực tiếp chỉ huy tác chiến',
        'Hiệp định Genève ký kết ngày 21/7/1954',
        'Vĩ tuyến 17 (Sông Bến Hải) tạm thời chia đôi 2 miền tập kết'
    ]
),
(
    2,
    1,
    'HIỆP ĐỊNH GENÈVE 1954',
    8,
    'current',
    'geneva-1954',
    2,
    ARRAY[
        'Phái đoàn VN do Phó Thủ tướng Phạm Văn Đồng dẫn đầu',
        'Lập vĩ tuyến 17 làm ranh giới quân sự tạm thời',
        'Quy định tổng tuyển cử thống nhất sau 2 năm (1956)'
    ]
),
(
    3,
    1,
    'DIỄN BIẾN ĐIỆN BIÊN PHỦ',
    10,
    'current',
    NULL,
    3,
    ARRAY[
        'Đợt 1 (13-17/3): Tiêu diệt cứ điểm phía Bắc',
        'Đợt 2 (30/3-30/4): Siết chặt vòng vây phía Đông',
        'Đợt 3 (1-7/5): Tổng tấn công, toàn thắng',
        'De Castries đầu hàng lúc 17h30 ngày 7/5'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    duration = EXCLUDED.duration,
    key_points = EXCLUDED.key_points;

-- 3. Nạp HỘI THOẠI BÀI HỌC (lesson_stories)
DELETE FROM public.lesson_stories WHERE lesson_id IN (1, 3);

INSERT INTO public.lesson_stories (lesson_id, emotion, text, highlight, fact_label, fact_value, order_index)
VALUES
-- Bài 1: Bối cảnh
(1, 'excited', 'Chào bạn! Mình là Chill — người bạn đồng hành trên hành trình khám phá lịch sử Việt Nam! Hôm nay, chúng ta sẽ tìm hiểu về năm 1954 — một trong những năm hào hùng nhất của dân tộc!', NULL, NULL, NULL, 1),
(1, 'thinking', 'Năm 1954, Việt Nam đang ở giai đoạn cuối của cuộc kháng chiến chống thực dân Pháp kéo dài 9 năm. Cả dân tộc đang chờ đợi một thay đổi lịch sử vĩ đại...', '9 năm kháng chiến chống Pháp', NULL, NULL, 2),
(1, 'determined', 'Dưới sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh, quân dân Việt Nam đã kiên cường chiến đấu. Và rồi, khoảnh khắc lịch sử đã đến!', NULL, 'Tổng chỉ huy', 'Đại tướng Võ Nguyên Giáp', 3),
(1, 'surprised', 'Bạn có biết không? Chiến dịch Điện Biên Phủ kéo dài đúng 56 ngày đêm — từ 13/3 đến 7/5/1954. Đây là trận chiến quyết định số phận của cuộc chiến tranh!', '56 ngày đêm khoét núi ngủ hầm', NULL, NULL, 4),
(1, 'happy', 'Chiến thắng Điện Biên Phủ ngày 7/5/1954 đã buộc Pháp ngồi vào bàn đàm phán. Hiệp định Genève được ký ngày 21/7/1954 — kết thúc chiến tranh, lập lại hòa bình!', '7/5/1954 — Toàn thắng Điện Biên', NULL, NULL, 5),

-- Bài 3: Diễn biến Điện Biên Phủ
(3, 'determined', 'Chiến dịch chia làm 3 đợt tấn công. Đợt 1 (13-17/3): Ta tiêu diệt các cứ điểm phía Bắc, sân bay Mường Thanh bị uy hiếp.', NULL, 'Đợt 1', '13–17/3/1954', 1),
(3, 'thinking', 'Đợt 2 (30/3-30/4): Ta siết chặt vòng vây, chiếm các đồi phòng ngự phía Đông. Quân Pháp rơi vào thế bị động hoàn toàn!', NULL, 'Đợt 2', '30/3–30/4/1954', 2),
(3, 'excited', 'Đợt 3 (1-7/5): Tổng tấn công! Ngày 7/5/1954, lá cờ "Quyết chiến Quyết thắng" tung bay trên nóc hầm De Castries. Chiến thắng hoàn toàn!', '7/5/1954 — Lá cờ chiến thắng tung bay!', NULL, NULL, 3);

-- 4. Nạp TRẮC NGHIỆM CHƯƠNG (chapter_quizzes)
DELETE FROM public.chapter_quizzes WHERE chapter_id = 1;

INSERT INTO public.chapter_quizzes (chapter_id, question, options, correct_index, explanation, order_index)
VALUES
(
    1,
    'Chiến dịch Điện Biên Phủ bắt đầu vào ngày nào?',
    ARRAY['7/5/1954', '13/3/1954', '21/7/1954', '2/9/1954'],
    1,
    'Chiến dịch Điện Biên Phủ bắt đầu ngày 13/3/1954 và kết thúc thắng lợi ngày 7/5/1954 — kéo dài 56 ngày đêm.',
    1
),
(
    1,
    'Hiệp định Genève năm 1954 lấy vĩ tuyến nào làm giới tuyến quân sự tạm thời?',
    ARRAY['Vĩ tuyến 13', 'Vĩ tuyến 15', 'Vĩ tuyến 17', 'Vĩ tuyến 19'],
    2,
    'Hiệp định Genève quy định vĩ tuyến 17 (dọc sông Bến Hải, Quảng Trị) là giới tuyến quân sự tạm thời chia đôi 2 miền.',
    2
),
(
    1,
    'Ai là Tổng chỉ huy Chiến dịch Điện Biên Phủ?',
    ARRAY['Đại tướng Văn Tiến Dũng', 'Đại tướng Võ Nguyên Giáp', 'Trung tướng Đồng Sỹ Nguyên', 'Đại tướng Chu Huy Mân'],
    1,
    'Đại tướng Võ Nguyên Giáp là Chỉ huy trưởng kiêm Bí thư Đảng ủy chiến dịch Điện Biên Phủ.',
    3
);

-- 5. Nạp KỊCH BẢN VISUAL NOVEL (visual_novel_stories)
INSERT INTO public.visual_novel_stories (id, title, era, historical_year, description, initial_scene_id, initial_standing, metadata)
VALUES (
    'geneva-1954',
    'Hội nghị Genève 1954',
    'Kháng chiến chống Pháp',
    '1954',
    'Trải nghiệm vai trò phái viên ngoại giao trong bàn đàm phán lịch sử Genève sau chiến thắng Điện Biên Phủ chấn động địa cầu.',
    'scene_intro',
    '{"diplomaticPrestige": 50, "nationalInterest": 50, "internationalSupport": 50}'::jsonb,
    '{"author": "Sử Chill Studio", "version": "1.0"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;

-- 6. Nạp THÀNH TỰU HỌC TẬP (achievements)
INSERT INTO public.achievements (id, title, description, icon, category, total)
VALUES
('first_lesson', 'Bước chân đầu tiên', 'Hoàn thành bài học lịch sử đầu tiên của bạn', '🌱', 'learning', 1),
('streak_3', 'Ngọn lửa kiên trì', 'Duy trì chuỗi học tập 3 ngày liên tiếp', '🔥', 'streak', 3),
('quiz_master', 'Sử gia nhí', 'Đạt điểm tuyệt đối trong một bài kiểm tra chương', '🎓', 'quiz', 1),
('pvp_first_win', 'Chiến công đầu', 'Giành chiến thắng trong trận Đấu Trí 1v1 đầu tiên', '⚔️', 'pvp', 1),
('pvp_streak_5', 'Bất khả chiến bại', 'Đạt chuỗi thắng 5 trận liên tiếp trong Đấu Trí 1v1', '👑', 'pvp', 5)
ON CONFLICT (id) DO NOTHING;

-- 7. Nạp 10 CÂU HỎI ĐẤU TRÍ 1V1 (pvp_questions - Kháng chiến chống Mỹ)
DELETE FROM public.pvp_questions WHERE id BETWEEN 1 AND 10;

INSERT INTO public.pvp_questions (id, era, era_year, question, hint, options, correct_index, explanation)
VALUES
(
    1,
    'Kháng chiến chống Mỹ',
    '1960',
    'Phong trào Đồng khởi (1959 - 1960) nổ ra tiêu biểu và giành thắng lợi vang dội nhất tại tỉnh nào ở miền Nam?',
    'Vùng đất xứ dừa với Đội quân tóc dài huyền thoại của nữ tướng Nguyễn Thị Định.',
    '[
        {"label": "A", "text": "Bến Tre", "subtext": "Ba xã Định Thủy, Phước Hiệp, Bình Khánh"},
        {"label": "B", "text": "Tây Ninh", "subtext": "Căn cứ Trung ương Cục miền Nam"},
        {"label": "C", "text": "Quảng Nam", "subtext": "Chiến trường Khu 5 ác liệt"},
        {"label": "D", "text": "Bình Định", "subtext": "Vùng đồng bằng duyên hải Trung Bộ"}
    ]'::jsonb,
    0,
    'Ngày 17/01/1960, dưới sự lãnh đạo của bà Nguyễn Thị Định, phong trào Đồng Khởi bùng nổ tại Mỏ Cày (Bến Tre) rồi nhanh chóng lan khắp miền Nam.'
),
(
    2,
    'Kháng chiến chống Mỹ',
    '1963',
    'Chiến thắng Ấp Bắc (02/01/1963) tại Tiền Giang đã đánh bại bước đầu hai chiến thuật tác chiến nào của Mỹ?',
    'Chiến thuật đổ quân bằng trực thăng và xe bọc thép M113 tối tân thời bấy giờ.',
    '[
        {"label": "A", "text": "Tìm diệt và Bình định", "subtext": "Chiến lược Chiến tranh cục bộ"},
        {"label": "B", "text": "Trực thăng vận và Thiết xa vận", "subtext": "Chiến lược Chiến tranh đặc biệt"},
        {"label": "C", "text": "Tràn ngập lãnh thổ", "subtext": "Giai đoạn sau Hiệp định Paris"},
        {"label": "D", "text": "Bao vây và Khóa biên", "subtext": "Kế hoạch lập phòng tuyến quân sự"}
    ]'::jsonb,
    1,
    'Chiến thắng Ấp Bắc mở ra phong trào "Thi đua Ấp Bắc, giết giặc lập công", chứng minh ta hoàn toàn có thể đánh bại chiến thuật "Trực thăng vận" và "Thiết xa vận".'
),
(
    3,
    'Kháng chiến chống Mỹ',
    '1965',
    'Chiến thắng Vạn Tường (Quảng Ngãi, 8/1965) được mệnh danh là bước ngoặt gì trong cuộc đụng đầu trực tiếp với quân viễn chinh Mỹ?',
    'Trận đánh được coi như "Điện Biên Phủ" chống quân viễn chinh Mỹ trên chiến trường miền Nam.',
    '[
        {"label": "A", "text": "Chiến thắng mở đầu chống Chiến tranh cục bộ", "subtext": "Đánh bại cuộc hành quân Ánh sáng sao của Thủy quân lục chiến Mỹ"},
        {"label": "B", "text": "Trận đánh mở đường vận tải biển bí mật", "subtext": "Đoàn tàu Không số cập bến an toàn"},
        {"label": "C", "text": "Cuộc tập kích đường không đầu tiên vào cơ quan chỉ huy Mỹ", "subtext": "Đặc công đánh sân bay quân sự"},
        {"label": "D", "text": "Trận giải phóng hoàn toàn vùng duyên hải miền Trung", "subtext": "Phá vỡ hệ thống ấp chiến lược"}
    ]'::jsonb,
    0,
    'Trận Vạn Tường chứng minh quân dân ta có khả năng đánh bại quân viễn chinh Mỹ về mặt quân sự, dấy lên phong trào "Tìm Mỹ mà đánh, lùng ngụy mà diệt".'
),
(
    4,
    'Kháng chiến chống Mỹ',
    '1959',
    'Tuyến chi viện chiến lược Trường Sơn (Đường Hồ Chí Minh) lịch sử được thành lập vào ngày tháng năm nào?',
    'Trùng đúng vào ngày kỷ niệm sinh nhật Bác Hồ kính yêu.',
    '[
        {"label": "A", "text": "19/05/1959", "subtext": "Đoàn 559 được thành lập soi đường mở tuyến"},
        {"label": "B", "text": "02/09/1960", "subtext": "Đại hội đại biểu toàn quốc lần thứ III"},
        {"label": "C", "text": "22/12/1959", "subtext": "Ngày thành lập Quân đội Nhân dân"},
        {"label": "D", "text": "30/04/1961", "subtext": "Hợp nhất các lực lượng vũ trang giải phóng"}
    ]'::jsonb,
    0,
    'Ngày 19/05/1959, Tổng Quân ủy Trung ương quyết định thành lập "Đoàn công tác quân sự đặc biệt" (Đoàn 559) để xẻ dọc Trường Sơn chi viện sức người, sức của cho miền Nam.'
),
(
    5,
    'Kháng chiến chống Mỹ',
    '1968',
    'Cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 đã buộc Tổng thống Mỹ Lyndon Johnson phải tuyên bố điều gì?',
    'Buộc Mỹ phải xuống thang chiến tranh, ngừng ném bom miền Bắc và chấp nhận đàm phán.',
    '[
        {"label": "A", "text": "Rút toàn bộ quân đội ngay trong năm 1968", "subtext": "Chấm dứt hoàn toàn sự can thiệp quân sự"},
        {"label": "B", "text": "Ngừng ném bom miền Bắc và ngồi vào đàm phán Paris", "subtext": "Thừa nhận sự phá sản của Chiến tranh cục bộ"},
        {"label": "C", "text": "Ký ngay hiệp định đình chiến vô điều kiện", "subtext": "Bàn giao quyền kiểm soát cho chính quyền Sài Gòn"},
        {"label": "D", "text": "Mở rộng cuộc chiến tranh xâm lược sang toàn Đông Dương", "subtext": "Đưa thêm 20 vạn lính viễn chinh sang"}
    ]'::jsonb,
    1,
    'Đòn bất ngờ Tết Mậu Thân 1968 làm lung lay tận gốc ý chí xâm lược của Mỹ, buộc Tổng thống Johnson tuyên bố ngừng ném bom miền Bắc từ vĩ tuyến 20 trở ra và cử đại diện đàm phán ở Paris.'
),
(
    6,
    'Kháng chiến chống Mỹ',
    '1972',
    'Chiến dịch 12 ngày đêm cuối năm 1972 bắn rơi 34 pháo đài bay B-52 của Mỹ trên bầu trời Hà Nội - Hải Phòng được ngợi ca là gì?',
    'Một chiến thắng mang tên địa danh lịch sử lừng lẫy năm châu nhưng diễn ra trên không trung.',
    '[
        {"label": "A", "text": "Chiến dịch Sấm Rền", "subtext": "Tên chiến dịch không kích của không quân Mỹ"},
        {"label": "B", "text": "Trận Điện Biên Phủ trên không", "subtext": "Bản hùng ca đập tan chiến dịch Linebacker II"},
        {"label": "C", "text": "Chiến dịch Ánh Sáng Mùa Đông", "subtext": "Kế hoạch tác chiến phối hợp binh chủng"},
        {"label": "D", "text": "Chiến dịch Đường 9 - Khe Sanh", "subtext": "Mặt trận nghi binh chiến lược"}
    ]'::jsonb,
    1,
    'Chiến dịch "Điện Biên Phủ trên không" (18/12 - 30/12/1972) đập tan nỗ lực ném bom rải thảm B-52 của Mỹ, buộc Tổng thống Nixon phải ký Hiệp định Paris.'
),
(
    7,
    'Kháng chiến chống Mỹ',
    '1973',
    'Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được chính thức ký kết vào ngày nào?',
    'Hiện thực hóa mục tiêu chiến lược "Đánh cho Mỹ cút" của Chủ tịch Hồ Chí Minh.',
    '[
        {"label": "A", "text": "27/01/1973", "subtext": "Tại Trung tâm Hội nghị quốc tế phố Kléber (Paris)"},
        {"label": "B", "text": "30/04/1973", "subtext": "Thời điểm hoàn tất rút quân viễn chinh Mỹ"},
        {"label": "C", "text": "21/07/1973", "subtext": "Kỷ niệm ngày ký Hiệp định Genève 1954"},
        {"label": "D", "text": "19/12/1972", "subtext": "Ngày bắt đầu chiến dịch phòng không Hà Nội"}
    ]'::jsonb,
    0,
    'Ngày 27/01/1973, Hiệp định Paris được ký kết, buộc Mỹ phải công nhận độc lập, chủ quyền, thống nhất của Việt Nam và rút toàn bộ quân viễn chinh về nước.'
),
(
    8,
    'Kháng chiến chống Mỹ',
    '1975',
    'Trận đánh then chốt, táo bạo mở màn cho Đại thắng mùa Xuân 1975 trong Chiến dịch Tây Nguyên diễn ra tại thị xã nào?',
    'Thủ phủ cà phê Tây Nguyên, nơi địch bị đòn bất ngờ không kịp trở tay vào ngày 10/03/1975.',
    '[
        {"label": "A", "text": "Pleiku", "subtext": "Sở chỉ huy Quân đoàn II ngụy quyền"},
        {"label": "B", "text": "Buôn Ma Thuột", "subtext": "Đòn điểm huyệt chiến lược ngày 10/03/1975"},
        {"label": "C", "text": "Kon Tum", "subtext": "Căn cứ tiền tiêu phía bắc Tây Nguyên"},
        {"label": "D", "text": "Đà Lạt", "subtext": "Vùng cao nguyên phía nam Trung Bộ"}
    ]'::jsonb,
    1,
    'Đòn đánh nghi binh ở Pleiku rồi bất ngờ giáng sấm sét vào Buôn Ma Thuột ngày 10/03/1975 đã phá vỡ thế phòng ngự của địch, châm ngòi cho sự sụp đổ dây chuyền của quân ngụy.'
),
(
    9,
    'Kháng chiến chống Mỹ',
    '1975',
    'Bức điện mật lịch sử ngày 07/04/1975 của Đại tướng Tổng Tư lệnh Võ Nguyên Giáp có câu khẩu lệnh truyền lửa nào?',
    'Khẩu lệnh hối hả, thôi thúc các cánh quân tiến công thần tốc giải phóng Sài Gòn.',
    '[
        {"label": "A", "text": "Không có gì quý hơn độc lập tự do", "subtext": "Lời kêu gọi chống Mỹ cứu nước năm 1966"},
        {"label": "B", "text": "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa", "subtext": "Tranh thủ từng giờ, từng phút xốc tới mặt trận"},
        {"label": "C", "text": "Nhằm thẳng quân thù mà bắn", "subtext": "Lời hô bất tử của Anh hùng Nguyễn Viết Xuân"},
        {"label": "D", "text": "Quyết tử để Tổ quốc quyết sinh", "subtext": "Lời thề cảm tử quân Thủ đô mùa đông 1946"}
    ]'::jsonb,
    1,
    '"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút xốc tới mặt trận, giải phóng miền Nam. Quyết chiến và toàn thắng!" - Bức điện khẩn lịch sử của Đại tướng Võ Nguyên Giáp.'
),
(
    10,
    'Kháng chiến chống Mỹ',
    '1975',
    'Chiếc xe tăng mang số hiệu nào của Quân đội nhân dân Việt Nam đã húc đổ cổng chính Dinh Độc Lập trưa ngày 30/04/1975?',
    'Xe tăng T-59 thuộc Lữ đoàn Tăng - Thiết giáp 203 do Trung úy Vũ Đăng Toàn chỉ huy.',
    '[
        {"label": "A", "text": "Xe tăng 390", "subtext": "Húc tung cánh cổng chính Dinh Độc Lập lúc 11h30"},
        {"label": "B", "text": "Xe tăng 843", "subtext": "Húc cổng phụ, do Trung úy Bùi Quang Thận chỉ huy"},
        {"label": "C", "text": "Xe tăng 380", "subtext": "Chiếc xe tăng tiến vào chi viện đội hình"},
        {"label": "D", "text": "Xe tăng 985", "subtext": "Xe tăng thọc sâu thuộc mũi tiến công hướng đông"}
    ]'::jsonb,
    0,
    'Đúng 11h30 ngày 30/04/1975, xe tăng 390 đã húc tung cánh cổng chính Dinh Độc Lập, ngay sau đó đại đội trưởng Bùi Quang Thận cắm lá cờ chiến thắng trên nóc Dinh.'
);
