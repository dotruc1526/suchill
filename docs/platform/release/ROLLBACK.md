# Rollback một bản web/PWA

Chuẩn bị trước release; chưa có deployment hoặc rollback thực nào được xác nhận ở hồ sơ này.

| Dữ liệu cần ghi | Giá trị thực |
|---|---|
| Build/commit ứng viên và manifest media SHA | Chưa cung cấp |
| Firebase project/site/channel + release ID | Chưa cung cấp |
| Bản Hosting tốt trước đó | Chưa cung cấp |
| Backend environment + migration version | Chưa cung cấp |
| Canonical content version cũ/mới | Chưa cung cấp |
| Người có quyền rollback và tiêu chí kích hoạt | Chưa cung cấp |
| URL/evidence kiểm thử rollback | Chưa cung cấp |

1. Giữ build tốt trước đó và preview của nó. Kiểm tra sign-in/read/resume với schema hiện hành trước khi coi là rollback khả dụng.
2. Nếu release lỗi: owner dừng promotion, chọn release Hosting tốt đã ghi và dùng chức năng rollback của project/site đúng mục tiêu. Không xóa project, database hoặc user progress.
3. RLS/reward/content version là backend riêng; quay frontend không tự quay schema. Migration đã áp dụng giữ nguyên, sửa bằng roll-forward được review. Published content sửa bằng version mới.
4. Service worker có thể còn phục vụ build cũ cho tab đang mở. Thử Home update/reopen, phiên cũ và offline; không xóa localStorage/queue/Auth để ép cập nhật.
5. Kiểm tra anonymous/account A/B, sign-out, canonical read, pending sync và replay XP sau rollback. Ghi kết quả thực cùng thời gian/người thực hiện.
6. Chỉ đóng incident khi reviewer chấp nhận evidence; không gọi phương án chưa thử là recovery PASS.

Với lỗi lịch sử/media, gỡ promotion/phiên bản khỏi release theo publication workflow được duyệt; giữ audit và checkpoint của version cũ.
