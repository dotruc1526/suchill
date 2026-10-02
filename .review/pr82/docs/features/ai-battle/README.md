# AI Battle — Người học đấu trí với AI

> Status: IN DEVELOPMENT — đang được một nhánh của nhóm phát triển\
> Product role: Experimental/extension feature — tính năng thử nghiệm, chưa phải điều kiện hoàn thành MVP

## Ý tưởng

Người học và đối thủ AI trả lời cùng một bộ câu hỏi trắc nghiệm lịch sử. Sau khi cả hai đã khóa đáp án, hệ thống công bố đáp án đúng, giải thích, nguồn và kết quả trận đấu.

## Ranh giới hiện tại

- Là feature riêng, không đặt logic trận đấu bên trong Visual Novel player.
- Dùng chung tài khoản, question bank, XP, streak và historical sources với Sử Chill.
- Câu hỏi chính thức phải đến từ ngân hàng đã review; AI không tự xuất bản câu hỏi lịch sử trong trận.
- Không để client giữ answer key, Gemini secret hoặc Supabase service-role key.
- Kết quả của AI phải được khóa trước khi công bố lựa chọn của người chơi.
- Nếu AI timeout/lỗi, trận đấu phải có fallback và không làm mất attempt của người chơi.

## Trạng thái cần bàn giao

Nhánh đang phát triển cần cung cấp cho project chính:

- Repo/branch hoặc đường dẫn code.
- Luật trận đấu và cách tính điểm.
- Contract dữ liệu câu hỏi, đáp án, attempt và result.
- Cách tạo câu trả lời AI và nơi giữ API key.
- Màn hình hiện có và video/demo kiểm thử.
- Danh sách phần đã xong, đang làm và blocker.

Sau khi nhận bàn giao, team sẽ review để quyết định tích hợp vào `src/features/ai-battle/` hay giữ thành prototype độc lập.
