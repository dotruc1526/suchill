const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

(async () => {
  const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  
  // Clear old data for a fresh demo sync
  await db.run('DELETE FROM lessons');
  await db.run('DELETE FROM events');
  await db.run('DELETE FROM questions');
  await db.run('DELETE FROM periods');
  
  // Insert period
  await db.run(`INSERT INTO periods (id, name, description) VALUES (1, '1959-1975', 'Kháng chiến chống Mỹ cứu nước')`);
  
  // Event 1: Đồng Khởi
  await db.run(`INSERT INTO events (id, period_id, name, year, description) VALUES (1, 1, 'Phong trào Đồng Khởi', '1959-1960', 'Cách mạng miền Nam chuyển sang thế tiến công')`);
  await db.run(`INSERT INTO lessons (id, event_id, title, content) VALUES (1, 1, 'Phong trào Đồng Khởi', 'Bối cảnh: Luật 10/59 lê máy chém khắp miền Nam.\\n\\nDiễn biến: Đêm 17/1/1960, nhân dân Bến Tre nổi dậy phá kìm kẹp.\\n\\nKết quả: Lan ra khắp miền Nam, chuyển cách mạng sang thế tiến công.')`);
  await db.run(`INSERT INTO questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (1, 'Quê hương của phong trào Đồng Khởi nằm ở tỉnh nào?', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Long An', 'B')`);
  
  // Event 2: Mậu Thân
  await db.run(`INSERT INTO events (id, period_id, name, year, description) VALUES (2, 1, 'Tết Mậu Thân', '1968', 'Cuộc Tổng tiến công và nổi dậy')`);
  await db.run(`INSERT INTO lessons (id, event_id, title, content) VALUES (2, 2, 'Tết Mậu Thân', 'Bối cảnh: Mỹ sa lầy trong "Chiến tranh cục bộ".\\n\\nDiễn biến: Đêm Giao thừa 1968, bất ngờ tiến công 37 thị xã, đô thị.\\n\\nKết quả: Làm lung lay ý chí xâm lược của Mỹ.')`);
  await db.run(`INSERT INTO questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (2, 'Cuộc Tổng tiến công Mậu Thân diễn ra vào thời điểm đặc biệt nào?', 'Lễ Quốc Khánh', 'Đêm Giao thừa', 'Tết Trung Thu', 'Ngày Giáng Sinh', 'B')`);

  // Event 3: Điện Biên Phủ trên không
  await db.run(`INSERT INTO events (id, period_id, name, year, description) VALUES (3, 1, 'Điện Biên Phủ trên không', '1972', 'Đập tan cuộc tập kích chiến lược B-52')`);
  await db.run(`INSERT INTO lessons (id, event_id, title, content) VALUES (3, 3, 'Điện Biên Phủ trên không', 'Bối cảnh: Mỹ dùng B-52 ném bom hủy diệt Hà Nội, Hải Phòng.\\n\\nDiễn biến: 12 ngày đêm cuối năm 1972, bắn rơi 34 máy bay B-52.\\n\\nKết quả: Buộc Mỹ phải ký Hiệp định Paris.')`);
  await db.run(`INSERT INTO questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (3, 'Pháo đài bay của Mỹ bị quân dân ta bắn rơi năm 1972 tên là gì?', 'F-111', 'B-52', 'F-4 Phantom', 'B-2 Spirit', 'B')`);

  // Event 4: Chiến dịch Hồ Chí Minh
  await db.run(`INSERT INTO events (id, period_id, name, year, description) VALUES (4, 1, 'Chiến dịch Hồ Chí Minh', '1975', 'Giải phóng hoàn toàn miền Nam')`);
  await db.run(`INSERT INTO lessons (id, event_id, title, content) VALUES (4, 4, 'Chiến dịch Hồ Chí Minh', 'Bối cảnh: Quân VNCH suy sụp sau chiến dịch Tây Nguyên và Huế-Đà Nẵng.\\n\\nDiễn biến: 5 cánh quân tiến vào Sài Gòn, 11h30 ngày 30/4 xe tăng húc cổng Dinh Độc Lập.\\n\\nKết quả: Giải phóng miền Nam, thống nhất đất nước.')`);
  await db.run(`INSERT INTO questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (4, 'Thời khắc xe tăng húc đổ cổng Dinh Độc Lập là vào lúc nào?', 'Sáng sớm 30/4', '11h30 ngày 30/4', 'Chiều tối 30/4', '12h00 ngày 1/5', 'B')`);

  console.log('✅ Đã đồng bộ Database với format Bóc Củ Hành!');
})();
