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

Chưa có bản thu narration mới, tên người đọc, ngày thu, đồng ý sử dụng, source export hoặc hash. Quyền được Thọ giao review không thay các tài liệu này.
Phương án hiện hành là TTS ElevenLabs theo lựa chọn của Trúc dưới đây. Hồ sơ cần voice ID, gói tài khoản, điều khoản áp dụng và chứng từ tại thời điểm tạo, phạm vi sử dụng, ngày xuất, tên file và hash; không cần chia sẻ secret.

### Phương án voice do Trúc chọn — 2026-10-02

| Cấu hình | Lựa chọn |
|---|---|
| Nhà cung cấp | ElevenLabs |
| Giọng | Hoa - Smooth, Gentle and Poetic |
| Voice ID | `5g2DMFQF8xR0KmnuNr4U` (Trúc cung cấp; chưa đối chiếu profile trong tài khoản) |
| Gói tài khoản | Free (Trúc xác nhận ngày 2026-10-02) |
| Người Việt Nam / chất giọng | Theo mô tả và lựa chọn của Trúc; chờ link thư viện/voice ID xác nhận đúng profile |
| Model | Eleven v4 (`eleven_v4`) |
| Ngôn ngữ | Vietnamese (tiếng Việt) |
| Phạm vi Trúc chốt | INTERNAL_REFERENCE_ONLY; phi thương mại, chỉ tham khảo nội bộ |
| Trạng thái | Đã chốt phương án nội bộ; file audio chưa nghiệm thu; commercial/production use BLOCKED |

[Tài liệu model ElevenLabs](https://elevenlabs.io/docs/overview/models) được đối chiếu ngày 2026-10-02: model ID `eleven_v4`, có Vietnamese trong danh sách ngôn ngữ hỗ trợ. Tên giọng Hoa do Trúc cung cấp; chưa xác minh profile cụ thể trong tài khoản.

Dùng lời đọc từ `PILOT-NARRATION.json`; không sửa lời đã review để vừa thời lượng. Sau khi đủ gate, xuất thử audio, kiểm tra phát âm tên riêng/ngày tháng và nhịp đọc, đo thời lượng thực tế rồi đồng bộ caption. Lưu thiết lập generation, file gốc và hash vào handoff. Việc chọn cấu hình không phê duyệt quyền media hoặc mở CONTENT-007.

Poster/sơ đồ chữ do nhóm tạo cần source file, font/license thực tế, ngày xuất, rendition và hash. Hiện mới có thiết kế trong screenplay, chưa có file để nghiệm thu.

## Checkpoint CONTENT-003 — 2026-10-02

- Historical/learning của screenplay/narration/lesson/quiz đã có verdict theo các card CONTENT-004/010/011/012; không yêu cầu ký lại wording không đổi. Registry mới cần xác nhận Tier 3/locator riêng; map artifact vẫn pending.
- Mandatory media plan đề nghị: chữ/sơ đồ do nhóm tạo, không ảnh/clip optional, không nhạc/SFX. Sáu candidate BLOCKED và hai NEEDS_MEDIA_REVIEW tiếp tục bị loại khỏi bản bắt buộc; lượt này không tái thẩm định hoặc cấp quyền dùng chúng.
- Audio: Trúc đã chọn ElevenLabs / Hoa - Smooth, Gentle and Poetic / Eleven v4 / Vietnamese. Voice ID/link thư viện, gói tài khoản, quyền sử dụng và file/hash còn pending; lựa chọn này không là media approval. CONTENT-006 không là nguồn audio cho pilot.
- Trước khi production được mở: reviewer chấp nhận registry/source scope và phương án quyền media/audio, PO ghi quyết định handoff, task CONTENT-007 có claim riêng. Bản thu/MP4/poster/manifest cuối là đầu ra phải kiểm tra sau khi sản xuất; không yêu cầu có MP4 trước khi bắt đầu dựng.
- Mẫu consent cho giọng người đọc: ghi tên người đọc, ngày, script/hash narration, cho phép ghi âm/chỉnh timing âm lượng/đồng bộ phụ đề và dùng trong video Sử Chill trên web/PWA, phạm vi phát hành và cách ghi công; chỉ có hiệu lực sau khi chính người đọc xác nhận. Không điền chữ ký hộ người đọc; không mặc định đồng ý quảng cáo hoặc voice cloning.
- Source file thiết kế và font/rendition/hash phải được ghi khi tạo asset trong CONTENT-007; chưa có font/file cuối được kiểm tra. Phần chữ/sơ đồ hiện là spec, chưa phải asset final đã duyệt.
- Gate hiện hành: M0–M3 DONE / M4 OPEN / M5–M7 LOCKED. CONTENT-007 vẫn BLOCKED theo content gate riêng.

## Trạng thái còn thiếu — cập nhật 2026-10-02

- Reviewer xác nhận registry revision 2026-10-02 và bằng chứng quyền audio cho cấu hình đã chọn; các verdict artifact đã có được giữ theo hash của từng card.
- Bổ sung voice ID/link giọng Hoa và evidence quyền sử dụng ElevenLabs; khi đủ gate mới tạo audio, đo timing và đồng bộ caption theo audio.
- Xuất MP4/poster/manifest, kiểm tra mobile/fallback/keyboard/caption trên player khi task mở.
- Nếu dùng ảnh optional: nghiệm thu item, caption/alt/crop, attribution và điều kiện phạm vi sử dụng trước tích hợp.

## Evidence quyền ElevenLabs — 2026-10-02

[Chính sách publish chính thức](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform): Free không có quyền thương mại; paid plans có commercial license cho eligible content, loại trừ Beta Services và vẫn cần quyền đối với input/voice cùng điều khoản áp dụng. Trúc xác nhận voice ID `5g2DMFQF8xR0KmnuNr4U`, gói Free, model Eleven v4. Trạng thái: `BLOCKED_FOR_COMMERCIAL_USE`; không có commercial license cho output tạo trên Free. Chưa xác minh độc lập profile Hoa trong tài khoản.

Cần link/voice ID Hoa, tên gói và evidence ngày generation, kiểm tra trạng thái model/service và phạm vi web/PWA. Không cung cấp API key. Cấu hình đã chọn không đồng nghĩa quyền audio đã được nghiệm thu; bản thu/file/hash và timing/caption QA được bổ sung khi task production đủ gate.

Checkpoint sau phản hồi Trúc: voice ID và gói đã được cung cấp. Các ghi chú trước đó “chưa có voice ID/gói” là snapshot superseded. Nếu cần phát hành thương mại, phải tạo audio mới trong gói có quyền phù hợp và xác minh service/model không thuộc Beta cùng điều khoản tại thời điểm tạo; nâng gói không cấp lại quyền cho output Free cũ. Chưa tạo audio hoặc duyệt phát hành.

## Quyết định phạm vi audio của Trúc — 2026-10-02

Trúc chọn “1”: **giữ Free, chỉ làm bản tham khảo nội bộ**. Audio plan `INTERNAL_REFERENCE_ONLY`, phi thương mại; không còn pending lựa chọn audio. Giữ đúng cấu hình/voice ID ở bảng trên. Quyết định này không cấp commercial license hoặc cho phép gắn vào canonical lesson/production; không tạo hoặc nghiệm thu audio trong lượt này.

Nếu có bản tham khảo nội bộ về sau: lưu ngày generation, model/service status (kiểm tra Beta/điều khoản tại thời điểm dùng), narration revision, thiết lập, file/hash và nhãn “Tham khảo nội bộ — không dùng phát hành”. Nếu chia sẻ phi thương mại ngoài nhóm, phải review riêng phạm vi và attribution theo chính sách ElevenLabs; chính sách hiện yêu cầu elevenlabs.io hoặc 11.ai trong tiêu đề khi publish output Free. Chưa cho phép chia sẻ công khai hoặc dùng promotional/commercial.

Phát hành/production vẫn cần phương án audio đủ quyền mới và reviewer/PO handoff riêng. Các snapshot “chờ Trúc chốt quyền/phương án audio” trước đó đã được quyết định phạm vi này thay thế; chưa thay verdict quyền production.
