# Sử Chill — Legacy & Prototype Archive

> Mục đích: Lưu trữ an toàn các màn hình prototype và code demo ban đầu để tham khảo, đối chiếu trong quá trình phát triển.

## Quy tắc quan trọng

1. **Không import vào production runtime:** Toàn bộ runtime và feature mới của ứng dụng được xây dựng trong `src/features/*`.
2. **Không sửa tính năng mới tại đây:** Thư mục này chỉ đóng vai trò lưu trữ tham khảo lịch sử (archive).
3. **Cấu trúc canonical hiện tại:**
   - Home screen: `src/features/home/`
   - Learning & Chapter: `src/features/learning/`
   - Visual Novel: `src/features/visual-novel/`
   - Quiz: `src/features/quiz/`
   - Practice: `src/features/practice/`
   - AI Assistant: `src/features/ai-assistant/`
   - Profile: `src/features/profile/`
