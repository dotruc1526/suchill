# Rollback web/PWA

Diễn tập 2026-10-03 PASS trên channel tách biệt, không thay link người dùng hoặc live.

- Project/site: suchill-preview. Channel QA m6-rollback-1954, [URL](https://suchill-preview--m6-rollback-1954-vo04nbif.web.app); hết hạn 2026-10-04 04:02 Asia/Bangkok.
- Đã kiểm tra bản tốt 0aeb37eef6bebd8b / build bfc05ef6fabc8087b4c0 → ứng viên b57c74b74e2de7d9 / build cdc8b3db5c5f0b5ade70 → bản tốt cũ.
- Release ứng viên /1790975078736000; rollback /1790975090578000 trong projects/777513574147/sites/suchill-preview/channels/m6-rollback-1954/releases/.
- Mỗi lần: video gốc 1080×1920, 28 cue, resume17 giây, completed=false và storage không liên quan giữ nguyên. Link người dùng giữ release /1790973825289000 khi diễn tập; live chưa publish.
- MP4 SHA256 2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec; manifest d1bfd0bd021df6bd52a00eb6bac5dbe3c7dbe814a13a0e1edd7d485c23647474.
- Không đổi Auth domains, CORS, backend, migration hoặc canonical content. Đây là rollback transport preview; không nghiệm thu rollback tài khoản/schema/thiết bị thật.

Khi frontend lỗi, dừng promotion và chọn đúng version tốt đã kiểm tra của đúng site/channel. Không xóa user progress, Auth hoặc queue để ép cập nhật. Tab cũ có worker riêng: kiểm tra update tại Home, reopen/offline và phiên cũ trước khi đóng incident. Quay frontend không quay schema; migration đã áp dụng sửa bằng roll-forward, nội dung published sửa bằng version mới. Authenticated read/pending sync/replay reward vẫn là kiểm tra riêng trước public release.
