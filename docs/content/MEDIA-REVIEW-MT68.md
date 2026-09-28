# Media review — Mậu Thân, 2026-09-27

> CONTENT-014; Trúc phụ trách theo quyền Thọ giao, Codex tra cứu và lập hồ sơ.
> Kết quả là evidence/checklist, không tự ký thay Trúc. Không tải media.

## Quyết định dùng trong phương án authoring

Pilot/Bài 2 bắt buộc chỉ dùng chữ và sơ đồ giáo dục do nhóm tạo, không dùng ảnh chiến đấu hoặc hình tái dựng. Mọi ứng viên dưới đây là optional, chưa gắn asset runtime.
Narration phải thu mới và có quyền sử dụng; nhạc/SFX không dùng. Không tái sử dụng audio Edge TTS của CONTENT-006 hoặc bản ghi thơ có quyền chưa rõ.

| ID | Evidence / phát hiện | Quyết định |
|---|---|---|
| MED-MT68-01 | Trang item cũ chưa đọc được trong lượt kiểm tra; chưa xác minh tác giả/license | Không sử dụng; fallback chữ |
| MED-MT68-02 | Chưa xác minh trang item, ngày chụp và license; mô tả không chứng minh ảnh năm 1968 | Không sử dụng làm ảnh trận đánh |
| MED-MT68-03 | URL là category, không phải item có metadata riêng | Không sử dụng; phải chọn item trước |
| MED-MT68-04 | [Item bản đồ](https://commons.wikimedia.org/wiki/File:Tet_Offensive_attack_on_Tan_Son_Nhut_and_JGS_31_January_1968.jpg), Summary/Licensing: US Army Center of Military History; ngày tạo ghi 2017-02-01; PD-USGov | License evidence đã ghi; chưa duyệt dùng, kiểm tra phạm vi Việt Nam và tính phù hợp. Không gọi là ảnh chụp 1968 |
| MED-MT68-05 | URL category Hải quân, không chứng minh asset cụ thể | Không sử dụng; fallback chữ |
| MED-MT68-06 | URL báo cũ chưa có item ảnh và permission riêng; bài VOH dùng cho fact không cấp quyền mọi ảnh | Không sử dụng ảnh khi chưa có quyền |
| MED-MT68-07 | Đầu mối clip CBS; không có giấy phép tái sử dụng trong repo | Không dùng trong pilot; không suy luận Fair Use tự động |
| MED-MT68-08 | [Item ảnh](https://commons.wikimedia.org/wiki/File:19680810_20_Anti-War_March.jpg), Summary/Licensing: David Wilson, Chicago 10/8/1968, CC BY 2.0 | Sửa nhãn Public Domain thành CC BY 2.0; chỉ candidate, chờ duyệt caption/crop và attribution cuối |

## Attribution/caption dự kiến cho ứng viên có evidence

- MED-MT68-04: “US Army Center of Military History, sơ đồ diễn biến tại Tân Sơn Nhất và Bộ Tổng Tham mưu ngày 31/1/1968; bản đồ xuất bản sau sự kiện, qua Wikimedia Commons.” Ghi rõ PD-USGov tại nguồn không là kết luận pháp lý toàn cầu. Alt: “Sơ đồ quân sử về hai khu vực mục tiêu”; cần xem bản asset cuối để mô tả chi tiết.
- MED-MT68-08: “David Wilson, 19680810 20 Anti-War March, CC BY 2.0, qua Wikimedia Commons.” Link tới item và [license](https://creativecommons.org/licenses/by/2.0/); ghi chỉnh sửa/cắt ảnh nếu có. Caption: “Biểu tình phản chiến tại Chicago, 10/8/1968.” Không dùng như ảnh phản ứng ngay đêm Mậu Thân. Alt dự kiến: “Đoàn tuần hành phản chiến trên phố Chicago”; phải kiểm tra hình cuối.

[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) yêu cầu ghi công phù hợp, link license và nêu thay đổi. Đây là kiểm tra điều kiện của nguồn, không phải đảm bảo mọi quyền liên quan đã được giải quyết.

## File cuối và audio

### Quyết định nguồn giọng đọc — 2026-09-28

Nguồn được chọn cho narration mới là **Azure AI Speech Text to Speech paid tier**, dùng prebuilt neural voice `vi-VN-NamMinhNeural` (Vietnamese, male). Không dùng `edge-tts`, Edge Read Aloud hoặc audio Edge TTS của CONTENT-006: Microsoft không có tài liệu công khai cấp quyền rõ ràng để ghi và tái phân phối output Read Aloud/`edge-tts`.

- [Microsoft Product Terms — Text-to-Speech Services](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzureServices/EAEAS/SpecificUseRights) ghi rằng khách hàng **paid tier TTS Service** có thể dùng output audio của prebuilt neural voices, kể cả mục đích thương mại.
- [Azure Speech language and voice support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=language-identification) liệt kê `vi-VN-NamMinhNeural` là prebuilt neural voice tiếng Việt.
- Không tạo custom voice, không mô phỏng người thật và không dùng voice talent; vì vậy không áp dụng luồng consent của custom neural voice. Phần lời đọc vẫn phải là narration đã được sign-off và không được gây hiểu lầm là lời kể nhân chứng.

Trạng thái quyền audio: **LICENSE_PATH_SELECTED__ACCOUNT_EVIDENCE_PENDING**. Đây chưa là evidence đủ để publish: Product Terms chỉ áp dụng khi audio thật được tạo bởi tài khoản/gói Azure paid tier của nhóm. Trước khi thu/export, Trúc phải lưu bản không chứa secret gồm: tên subscription/resource hoặc invoice/portal screenshot che thông tin nhạy cảm, ngày tạo, service `Azure AI Speech TTS`, tier paid, voice, SSML/rate nếu dùng, tên file output và SHA-256. Nếu không chứng minh được paid tier, đổi sang bản thu người đọc có văn bản cho phép sử dụng; không quay lại dùng Edge Read Aloud/`edge-tts`.

Chưa có bản thu narration mới, source export hoặc hash. Quyền được Thọ giao review không thay các tài liệu này.

Poster/sơ đồ chữ do nhóm tạo cần source file, font/license thực tế, ngày xuất, rendition và hash. Hiện mới có thiết kế trong screenplay, chưa có file để nghiệm thu.

## Trạng thái còn thiếu

- Historical/learning sign-off cho bản narration/story mới. **Đã hoàn thành có giới hạn ngày 2026-09-28.**
- Trúc dùng Azure AI Speech paid tier theo quyết định trên hoặc bản thu có consent; lưu evidence tài khoản/quyền, đo timing và đồng bộ caption theo audio.
- Xuất MP4/poster/manifest, kiểm tra mobile/fallback/keyboard/caption trên player khi task mở.
- Nếu dùng ảnh optional: nghiệm thu item, caption/alt/crop, attribution và điều kiện phạm vi sử dụng trước tích hợp.
