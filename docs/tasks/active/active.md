# Bàn giao công việc tiếp theo — Trúc (Member 2)

> Task nguồn: [`CONTENT-006`](./CONTENT-006.md)
> Nhánh: `codex/truc-content-006-video-reference`
> Executor duy nhất: Trúc (Member 2)
> Trạng thái task nguồn: `IN PROGRESS`
> Ngày bàn giao: 2026-09-26

## Bắt đầu tại đây — phiếu thực hiện tiếp theo

### Checkpoint cuối — đồng bộ sau quyền mới (2026-09-26)

Thọ đã giao Trúc review learning objective/wording lịch sử và Product owner giao Trúc chốt media/legal cho CONTENT-006. Kết luận đã ghi vào hồ sơ:

- Objective hiện có được chấp nhận cho mục đích tham khảo nội bộ `REFERENCE_ONLY`.
- Bốn nhóm claim lịch sử được giữ `VERIFIED`; claim 01:17–01:29 phải sửa wording trước khi dùng lại vì cụm “tâm điểm của cả cuộc chiến” quá rộng.
- Media/legal chỉ đạt `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`; không approve publish, tích hợp lesson/VN, teaser công khai hoặc canonical media.
- CONTENT-006 vẫn `IN PROGRESS`; không chuyển `REVIEW`/`DONE`, không mở M1, không biến video “Trước cơn bão” thành video canonical.

Việc tiếp theo chỉ phát sinh nếu nhóm muốn dùng clip ngoài reference: tạo/sửa media package mới, thay hoặc chứng minh quyền audio/nhạc/SFX, khóa manifest/hash/source export, sửa wording 01:17–01:29, rồi review lại.

### Checkpoint mới nhất — media/legal review decision (2026-09-25)

Theo thông tin Trúc cung cấp, Product owner cũng muốn Trúc chốt phần media/legal cho CONTENT-006. Quyết định của Trúc trong phạm vi media/legal hiện có: **chỉ chấp nhận clip “Trước cơn bão” làm tài liệu tham khảo nội bộ `REFERENCE_ONLY`; không approve publish, integration hoặc canonical use**.

Lý do: hồ sơ có provenance đủ để hiểu nguồn tạo ở mức executor-side, nhưng chưa có bằng chứng license/permission đủ mạnh để phát hành:

- Audio Microsoft Neural TTS qua `edge-tts`: ghi nhận được công cụ, voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`; chưa có điều khoản áp dụng tại thời điểm tạo và chưa chứng minh quyền phát hành audio theo cách dùng này.
- Nhạc/SFX: có dấu vết script tạo/mix, nhưng chưa có quyền/tác giả/manifest khóa vào MP4 cuối.
- Source export cuối: file dựng ứng viên và audio/hash không khớp MP4 hiện tại; report thiếu hash final, nên không dùng làm bằng chứng chuỗi xuất cuối.
- Asset AI/Codex: mascot AI và tranh Codex có mô tả nguồn do Trúc cung cấp, nhưng không còn model/prompt/session gốc; chấp nhận ghi provenance nội bộ, không biến thành permission release.
- Font/Natural Earth: Natural Earth có điều khoản public domain; chữ bitmap có căn cứ theo Microsoft Font FAQ nếu không phân phối file font, nhưng điều này không giải quyết quyền audio/nhạc/SFX hoặc source export.

Kết luận media/legal: `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`. Nếu sau này muốn dùng clip trong lesson, Visual Novel, teaser công khai hoặc media canonical, phải tạo/sửa package mới: thay hoặc xác minh audio/nhạc/SFX, khóa manifest/hash/source export, sửa wording 01:17–01:29, tạo transcript/caption/poster/fallback/rendition cuối và chạy lại review.

### Checkpoint — review learning objective và wording lịch sử (2026-09-25)

Theo thông tin Trúc cung cấp, Thọ đã cấp quyền cho Trúc làm phần review learning objective và wording lịch sử của CONTENT-006. Phạm vi review này chỉ xử lý objective/wording; không thay thế Product owner sign-off, không xử lý quyền audio/nhạc/SFX/source export và không chuyển video sang canonical.

Kết luận:

- Learning objective hiện có được chấp nhận cho hồ sơ `REFERENCE_ONLY`: người xem nêu được mục tiêu tập trung lực lượng của Kế hoạch Navarre và mối liên hệ với việc Pháp phải phân tán lực lượng đối phó trên nhiều hướng.
- Objective này phù hợp với nội dung lời dẫn và bốn nhóm claim đã `VERIFIED`, nhưng chưa chốt hướng tích hợp sản phẩm vì clip thuộc bối cảnh kháng chiến chống Pháp năm 1953–1954, trong khi scope canonical dài hạn của app là kháng chiến chống Mỹ ở Việt Nam.
- Wording 01:17–01:29 không được giữ nguyên nếu dùng lại trong bài học/video publish: cụm “tâm điểm của cả cuộc chiến” quá rộng so với nguồn. Câu thay thế được duyệt ở mức wording review: “Nhưng tại sao một thung lũng ở Tây Bắc lại trở thành điểm quyết chiến chiến lược của hai bên?” Nếu cần bám sát chiến cục hơn, dùng: “...trở thành tâm điểm của cuộc đối đầu Đông Xuân 1953–1954?”
- Vì bản MP4 hiện tại vẫn chứa wording cũ, claim cuối được ghi là `REVISION_REQUIRED_BEFORE_USE`, không phải historical sign-off cho bản video hiện tại.

Task vẫn `IN PROGRESS`, video vẫn `REFERENCE_ONLY`. Product owner đã giao Trúc chốt media/legal; kết luận media/legal là chỉ dùng tham khảo nội bộ, không approve publish/integration.

### Checkpoint — đối chiếu claim lịch sử (2026-09-24)

Đã đối chiếu toàn bộ năm nhóm claim lịch sử trong lời dẫn với nguồn có locator ở bảng claim bên dưới. Bốn nhóm được nguồn hỗ trợ; nhóm cuối cần sửa cụm “tâm điểm của cả cuộc chiến” vì diễn đạt rộng hơn bằng chứng. Đây là kết quả review của Trúc với Codex hỗ trợ tra cứu, chưa phải kiểm tra độc lập vì Trúc đồng thời là executor. Task vẫn `IN PROGRESS`, video vẫn `REFERENCE_ONLY`.

| Hạng mục | Kết quả có bằng chứng | Trạng thái / phần còn thiếu |
|---|---|---|
| Dịch vụ giọng đọc | README chính chủ `rany2/edge-tts` xác nhận thư viện gọi dịch vụ đọc trực tuyến của Microsoft Edge. Repo có giấy phép phần mềm riêng | Trúc chốt media/legal: chỉ chấp nhận cho `REFERENCE_ONLY`; chưa đủ bằng chứng cấp quyền publish/integration audio theo cách dùng `edge-tts` |
| Điều khoản Microsoft | Đã đọc Microsoft Services Agreement; hai đường dẫn Edge `/en-us/edge/terms` và `/en-us/edge/terms-of-use` không tải được qua công cụ | Không kết luận bị cấm; nhưng do chưa biết thời điểm tạo/điều khoản áp dụng, không approve phát hành audio |
| Font trong video | `illustration.py:16–23` đọc `segoeui.ttf`, `segoeuib.ttf`, `timesbd.ttf` từ Windows. Microsoft FAQ cho phép chữ/caption render thành bitmap trong video, với điều kiện không nhúng file font và tuân thủ giới hạn của phần mềm sử dụng | Có căn cứ điều khoản cho cách render; cần xác nhận nguồn font/phần mềm của bản xuất thực tế. Không phải quyền phân phối file font |
| File dựng ứng viên | `D:/suchill-render-work/episode-portrait-steady-polished.mp4` thực sự tồn tại; đã đọc audio bằng FFmpeg | PCM s16le 90 giây đầu có SHA-256 `d7438330f4dbe4bc26ab598d0380dfccd633476f5167dfbd3ee4579a5dbe9fb5`, khác MP4 hiện tại và audio rời đã kiểm tra. Chưa xác định nguồn xuất cuối |
| Report xuất | `lock_approved_audio.py` dự kiến ghi `finalSha256`, `approvedAudioStreamSha256`, `finalAudioStreamSha256`; report final hiện có không chứa các trường đó | Không dùng report này để chứng minh MP4 được tạo bởi lần chạy script khóa audio hiện tại |
| Mascot/tranh/nhạc/SFX | Trúc xác nhận mascot SỬu do AI tạo, tên công cụ/model “Không nhớ”; các tranh trong danh sách đều do Codex tạo; phiên tạo/project gốc “Không còn lưu” | Trúc chốt media/legal: provenance đủ để lưu hồ sơ tham khảo nội bộ; không đủ để approve publish/integration nếu chưa có permission/manifest bổ sung |

Nguồn tra cứu ngày 2026-09-24, để reviewer mở kiểm tra:

- [edge-tts README](https://github.com/rany2/edge-tts#readme) và [LICENSE của thư viện](https://github.com/rany2/edge-tts/blob/master/LICENSE): phạm vi thư viện và giấy phép phần mềm; chưa khóa phiên bản thư viện đã dùng tạo audio.
- [Microsoft Services Agreement](https://www.microsoft.com/en-us/servicesagreement): tài liệu dịch vụ chung, chưa đủ xác nhận điều khoản riêng cho audio Read Aloud qua thư viện này. Không áp dụng điều khoản dịch vụ khác chỉ vì cùng hãng Microsoft.
- [Microsoft Font FAQ](https://learn.microsoft.com/en-us/typography/fonts/font-faq), mục “Can I use the fonts to produce captions and text included in videos?”: căn cứ cho chữ bitmap, không phải giấy phép phân phối font.

Kiểm tra tái lập audio ứng viên: `ffmpeg -v error -i D:/suchill-render-work/episode-portrait-steady-polished.mp4 -t 90 -map 0:a:0 -c:a pcm_s16le -f hash -hash sha256 -`. Chỉ đọc file; không chạy script render/remux. SHA-256 MP4 hiện tại vẫn `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.

**Một việc tiếp theo:** nếu muốn dùng clip ngoài `REFERENCE_ONLY`, tạo task/media package mới để sửa wording 01:17–01:29, thay hoặc chứng minh quyền audio/nhạc/SFX, khóa manifest/hash/source export và chạy lại review. Không duyệt tích hợp/phát hành từ checkpoint này.

Đây là các bước nhỏ của CONTENT-006, không phải task độc lập hoặc mở milestone mới. Executor duy nhất vẫn là Trúc; Codex hỗ trợ chuẩn bị hồ sơ. Làm lần lượt từng việc, ghi kết quả ngay trong phần này.

### Việc 1: bổ sung thông tin nguồn còn thiếu

Đầu ra phần provenance của Trúc đã được điền theo thông tin hiện có. Không cần cung cấp lại ba thông tin đã xác nhận. Không tự đoán model/prompt/quyền khi hồ sơ gốc không còn lưu. Không ghi mật khẩu, khóa API hoặc thông tin đăng nhập.

| Thành phần | Đã xác nhận bởi Trúc | Trúc cần bổ sung |
|---|---|---|
| Mascot SỬu | Do AI tạo | Tên công cụ/model nếu biết: Không nhớ. File gốc hoặc nơi lưu phiên tạo: Không nhớ |
| Tranh minh họa | Do Codex tạo | Các tranh trong sổ asset bên dưới: đều do Codex tạo. Tham chiếu phiên tạo/prompt/project gốc: Không còn lưu |
| Giọng đọc | Microsoft Neural TTS, giọng nam tiếng Việt, đã hậu kỳ tốc độ/chất lượng | Cách dùng: Edge TTS qua thư viện `edge-tts` trong script, voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`. Thời điểm tạo: Không nhớ |
| Âm thanh bản cuối | Chưa xác nhận file nguồn của audio nhúng | File hoặc lệnh/project xuất MP4 nếu còn: Không còn lưu. Vẫn nghe kiểm tra trực tiếp MP4; media/legal decision 2026-09-25 chỉ cho phép reference nội bộ |

Sau khi biết dịch vụ/cách tạo, Codex có thể tìm điều khoản chính thức tương ứng và ghi nguồn để media reviewer kiểm tra. Thông tin “AI tạo” là nguồn gốc do người tạo cung cấp, chưa tự xác nhận quyền sử dụng.

### Việc 2: nghe và kiểm tra phụ đề của clip đã chọn

Đầu ra: phiếu kiểm tra toàn bộ 28 cue. Mở [video Trước cơn bão](../../../public/media/truoc-con-bao/episode-portrait-final.mp4), đối chiếu [phụ đề](../../../public/media/truoc-con-bao/subtitles.vtt). Trúc đã xác nhận tổng thể “clip oke”; các dòng dưới ghi lại cùng xác nhận đó, không phải sáu lượt kiểm tra độc lập có evidence riêng. Khi kiểm tra chi tiết, nghe ở tốc độ bình thường và ghi cue hoặc mốc giây khi có lỗi.

| Cue | Khoảng thời gian | Nội dung để nhận diện | Kết quả / lỗi |
|---|---|---|---|
| 1–3 | 00:00.000–00:09.000 | SỬu chào và giới thiệu tua ngược thời gian | Trúc xác nhận clip oke; không ghi lỗi |
| 4–6 | 00:09.000–00:20.383 | Bối cảnh đầu những năm 1950 | Trúc xác nhận clip oke; không ghi lỗi |
| 7–12 | 00:20.383–00:39.033 | Khó khăn phía Pháp | Trúc xác nhận clip oke; không ghi lỗi |
| 13–18 | 00:39.033–00:58.733 | Kế hoạch Navarre và mục tiêu | Trúc xác nhận clip oke; không ghi lỗi |
| 19–22 | 00:58.733–01:13.683 | Nhiều hướng hoạt động, phân tán lực lượng | Trúc xác nhận clip oke; không ghi lỗi |
| 23–28 | 01:13.683–01:33.389 | Điện Biên Phủ và dẫn sang tập sau | Trúc xác nhận clip oke; không ghi lỗi |

Mỗi lượt kiểm tra: lời đọc có khớp từng cue; chữ có xuất hiện đúng lúc và đủ thời gian đọc; có mất dấu/cắt/chồng chữ; nhạc có lấn giọng; âm thanh có ý nghĩa nào cần thêm chú thích. Chú ý vùng tiêu đề ở đoạn cuối đã được đánh dấu trong kiểm tra khung hình.

Mẫu ghi lỗi: `Cue … | thời điểm … | nghe/thấy … | phụ đề hiện … | đề nghị …`. Nếu đạt cả nhóm, ghi `Đã đối chiếu từng cue; không phát hiện lỗi` cùng ngày và thiết bị. Đây là kiểm tra nghe/nhìn, không phải duyệt tính chính xác lịch sử.

- Người kiểm tra: Trúc.
- Ngày / thiết bị / ứng dụng phát: 2026-09-24; thiết bị/ứng dụng phát chưa ghi.
- Kết luận lời đọc–phụ đề: Trúc xác nhận clip oke; không ghi lỗi cụ thể.
- Kết luận độ rõ của giọng và chữ: Trúc xác nhận clip oke; không ghi lỗi cụ thể.

### Bàn giao sau hai việc trên

Trúc đã cập nhật provenance, hoàn tất lượt đối chiếu claim phía executor, theo quyền Thọ giao đã review learning objective/wording lịch sử, và theo quyền Product owner giao đã chốt media/legal ở mức `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`. Codex tổng hợp nguồn, locator và kết quả vào hồ sơ. Mọi yêu cầu sửa video hoặc code phải được ghi rõ phạm vi/file claim trước khi thực hiện. CONTENT-006 giữ `IN PROGRESS` và video giữ `REFERENCE_ONLY` vì bản media còn wording cần sửa và không được approve publish/integration.

## Kết quả bước 1 — nhận diện file (2026-09-24)

Đã kiểm tra hai file ứng viên, tính SHA-256 từ file thực tế và đối chiếu cues/report/script trong repo. **Trúc xác nhận ngày 2026-09-24: “trước cơn bão là file đầu tiên”.** Reference dùng tiếp cho CONTENT-006 là `public/media/truoc-con-bao/episode-portrait-final.mp4`. Trúc giữ vai trò executor; Codex hỗ trợ đọc và ghi hồ sơ. Xác nhận này chốt clip cần review, không xác nhận lịch sử/license hay quan hệ byte-for-byte với bản ~67 MB được ghi trước đây.

| Ứng viên trong `public/media/` | Nhận diện theo cues/report hiện có | Dung lượng đo từ file |
|---|---|---|
| `truoc-con-bao/episode-portrait-final.mp4` | Tập 1 — Trước cơn bão; 93,389 giây; 1080×1920; 24 fps | 19.289.629 byte (~19,29 MB) |
| `vi-sao-dien-bien-phu/episode-portrait-final.mp4` | Tập 2 — Vì sao lại là Điện Biên Phủ?; 91,868 giây; 1080×1920; 24 fps | 51.208.479 byte (~51,21 MB) |

Thời lượng/độ phân giải/fps ở bảng lấy từ report có sẵn, chưa đo lại trực tiếp stream. SHA-256 tính bằng `Get-FileHash`:

- Tập 1: `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.
- Tập 2: `05286d722ae9e205187a567130fc94d424e90343850469c900769a123bc7bd03`; khớp trường `sha256` của `episode-portrait-final-sync-verification.json` cùng thư mục. Đây là đối chiếu identity với report cũ, không phải lần chạy decode/QA mới.

Tập 1 gần mô tả cũ về thời lượng (~93 giây) và khung hình, nhưng khác dung lượng (~67 MB trong task card). Không có hash hoặc đường dẫn reference gốc để kết luận là cùng bản hoặc bản nén lại. Report `episode-portrait-final-verification.json` của Tập 1 khớp dung lượng nhưng không có hash để đối chiếu identity.

Dấu vết dựng: `scripts/media/lock_approved_audio.py` khai báo đầu ra Tập 1 và đầu vào visual tại `D:/suchill-render-work/episode-portrait-steady-polished.mp4`; đó là đường dẫn trong script, chưa xác minh file nguồn tồn tại. `scripts/media/episode2_verify.py` khai báo đầu ra Tập 2. `scripts/media/README.md` mô tả pipeline dùng giọng tổng hợp, mascot và bản đồ; những mô tả này chưa phải chứng cứ cấp phép từng asset. `EPISODE-1954.md` còn mô tả bản 106 giây/chưa có lời đọc, khác cues hiện tại: không dùng tài liệu đó để xác nhận phiên bản cuối.

Hai cues đều ghi chapter 1954. Theo AGENTS, chúng chưa được tự coi là nội dung canonical của phạm vi kháng chiến chống Mỹ. Chưa đánh giá tính đúng sai lịch sử, nghe/xem toàn video, đồng bộ phụ đề hay license trong bước nhận diện này.

**Bước tiếp theo:** lập hồ sơ nguồn/media cho “Trước cơn bão”: kiểm kê transcript, VTT, poster, nguồn từng asset và trạng thái quyền sử dụng; đề xuất learning objective/hướng sử dụng để reviewer đánh giá. Chênh lệch dung lượng với ghi nhận cũ được giữ như lưu ý phiên bản, không còn chặn việc chọn clip. Chưa gửi hồ sơ ra ngoài hoặc yêu cầu review qua công cụ liên lạc.

Kiểm tra đã thực hiện: đọc cues/report/script, đo byte và SHA-256 của hai file; `git log` không có lịch sử cho đường dẫn Tập 1. Không tìm thấy `ffmpeg`/`ffprobe` trên PATH; một số thư mục vendor bị từ chối đọc. Chưa chạy decode hoặc build vì bước này chỉ nhận diện file và cập nhật docs.

## Kiểm tra trực tiếp và provenance — cập nhật mới nhất 2026-09-24

Phần này cập nhật các giới hạn kiểm tra ở checkpoint trước; các ghi chú “chưa decode” bên dưới là lịch sử, không còn mô tả trạng thái mới nhất.

### Kết quả trên MP4 hiện tại

- SHA-256 đọc lại trước/sau kiểm tra vẫn `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.
- Tìm thấy FFmpeg đi kèm Overwolf tại `C:/Users/Thinkpad/AppData/Local/Overwolf/Extensions/ncfplpkmiejjaklknfnkgcpapnhkggmlcppckhcb/270.0.25/obs/bin/64bit/ffmpeg.exe`. Chạy trực tiếp binary; không chạy pipeline render của dự án.
- Đọc stream: duration 93,39 giây; H.264 High, yuv420p progressive, 1080×1920, 24 fps; audio AAC LC mono 48 kHz, nhãn `vie`; tổng bitrate khoảng 1.652 kb/s (1652 kb/s theo FFmpeg).
- Giải mã toàn video/audio bằng `ffmpeg -hide_banner -i <video> -f null -`: hoàn tất 2.241 frame, không báo lỗi decode. Đây là kiểm tra file đọc được; chưa thay cho thử trình duyệt/mobile.
- Tạo và xem contact sheet lấy mẫu mỗi 8 giây từ MP4 hiện tại, 12 khung hình. Có mascot, binh lính minh họa, trục năm 1946/1950/1953, hồ sơ Navarre, bản đồ vùng và ảnh thung lũng; phụ đề được vẽ trong các khung đã xem. Chưa kiểm tra từng frame hoặc xác nhận đồng bộ lời nói. Contact sheet tạm ở `C:/Users/Thinkpad/AppData/Local/Temp/content006-27e308e0395947d4916e2ee833fd756a/contact.jpg`; có thể tái tạo với filter `fps=1/8,scale=270:-1,tile=4x3` và `-frames:v 1`.
- Hai khung cuối lấy mẫu có chữ tiêu đề sát/chồng vùng nhãn đầu trang; cần Trúc kiểm tra ở kích thước hiển thị thực trước khi quyết định sửa. Ảnh contact thu nhỏ không đủ để đánh giá độ đọc toàn video.

### Đối chiếu audio: chưa đủ bằng chứng đồng bộ

Đã giải mã audio MP4 và `episode-audio-steady.m4a` sang PCM s16le bằng cùng FFmpeg. Hash toàn audio khác nhau. Để loại khác biệt chỉ do phần đuôi, đối chiếu thêm 90 giây đầu:

| File | SHA-256 PCM s16le, 90 giây đầu |
|---|---|
| MP4 hiện tại | `5ba1868fa3e4dac71f65e3e7bdeda2cf20e13ca1d165460aa29b79ffc3ab35d0` |
| `episode-audio-steady.m4a` | `7cc66dffaf96c794f0e7ba19551e25a4581ab566c64565b8abfaf812c574b5c5` |

Lệnh tái lập cho từng file: `ffmpeg -v error -i <file> -t 90 -map 0:a:0 -c:a pcm_s16le -f hash -hash sha256 -`.

Phép trừ hai tín hiệu bắt đầu tại t=0 trên 4.320.000 mẫu cho RMS -13,09 dBFS, nên không coi audio rời là bản giống hệt audio nhúng. Chưa xác định nguyên nhân: có thể khác bản mix, encode hoặc lệch thời gian. Không suy ra lời đọc sai chỉ từ hash/RMS. Công cụ phiên này chưa cung cấp nhận dạng/đối chiếu lời nói; cần nghe bản MP4 hiện tại cùng VTT để kết luận ngữ nghĩa và đồng bộ. Không dùng report correlation cũ làm kết quả mới.

### Sổ nguồn/quyền sử dụng

Các dòng dưới là asset ứng viên theo renderer và hình quan sát; chưa có manifest khóa vào hash MP4 chứng minh toàn bộ danh sách thực sự được dùng. UNKNOWN nghĩa là chưa tìm thấy bằng chứng trong các file đã kiểm tra, không có nghĩa chắc chắn không được phép dùng.

### Cập nhật provenance do Trúc cung cấp — 2026-09-24

Trúc cung cấp thêm thông tin nguồn tạo asset cho clip:

- Mascot SỬu: do AI generate; tên công cụ/model cụ thể: Không nhớ.
- Tranh minh họa: do Codex tạo.
- Giọng đọc: giọng tiếng Việt nam của Microsoft Neural TTS, tạo qua Edge TTS bằng thư viện `edge-tts` trong script với voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`, sau đó hậu kỳ tốc độ/chất lượng để hợp với nhân vật SỬu. Thời điểm tạo: Không nhớ.

Thông tin này giúp đổi trạng thái từ “chưa rõ người/công cụ tạo” sang “đã có mô tả nguồn tạo từ executor”. Tuy nhiên trước khi publish vẫn cần ghi rõ tài khoản/điều khoản áp dụng, prompt/file gốc nếu có, và xác nhận quyền dùng thương mại/nội bộ theo chính sách dự án. Riêng giọng Microsoft Neural TTS/Edge TTS cần đối chiếu điều khoản dịch vụ tại thời điểm tạo audio; hậu kỳ không tự thay thế giấy phép.

| Asset/nhóm | Dấu vết nguồn | Trạng thái quyền / đầu vào còn cần |
|---|---|---|
| Natural Earth 1:50m | `scripts/media/data/natural-earth/`, hai JSON trong `public/media/shared/vietnam-map/` và `regional-map/` | Điều khoản chính thức xác nhận dữ liệu Natural Earth public domain; xác định được quyền dữ liệu nền, chưa xác nhận mọi lớp ảnh/nhãn bổ sung |
| Mascot SỬu | `scripts/media/illustration.py` đọc `src/imports/image-1.png`; Trúc xác nhận do AI generate; tên công cụ/model cụ thể: Không nhớ | Đã có mô tả nguồn tạo từ executor; còn cần prompt/file gốc nếu có, người tạo/chủ quyền và điều khoản/quyền dùng |
| Nền núi | `public/media/shared/su-chill-mountain-valley-background.png`; Trúc xác nhận tranh minh họa do Codex tạo | Đã xác nhận thuộc nhóm tranh Codex tạo; phiên/prompt/project gốc không còn lưu; media/legal decision 2026-09-25 chỉ cho phép reference nội bộ |
| Thung lũng | `public/media/shared/dien-bien-phu-valley-cinematic-1080x1920.png`; Trúc xác nhận tranh minh họa do Codex tạo | Đã có mô tả nguồn tạo từ executor; cần nhãn minh họa và review địa hình/bối cảnh |
| Binh lính Pháp | `public/media/shared/french-colonial-soldiers-northwest-1950s-1080x1920.png`; Trúc xác nhận tranh minh họa do Codex tạo | Đã có mô tả nguồn tạo từ executor; cần review quân phục/trang bị và nhãn minh họa |
| Lính dù | `public/media/shared/french-paratroopers-dien-bien-phu-1080x1920.png`; Trúc xác nhận tranh minh họa do Codex tạo | Đã có mô tả nguồn tạo từ executor; cần review quân phục/trang bị và nhãn minh họa |
| Cứ điểm | `public/media/shared/dien-bien-phu-fortified-camp-system-1080x1920.png`; Trúc xác nhận tranh minh họa do Codex tạo | Đã có mô tả nguồn tạo từ executor; cần review niên biểu, tránh trình bày giai đoạn sau như bối cảnh trước |
| Đoàn vận tải | `public/media/truoc-con-bao/assets/convoy-mountain-keyframe.png`; Trúc xác nhận tranh minh họa do Codex tạo | Đã xác nhận thuộc nhóm tranh Codex tạo; phiên/prompt/project gốc không còn lưu; cần xác nhận có dùng trong bản cuối và nhãn minh họa |
| Map raster và icons | `public/media/shared/vietnam-map/`, `regional-map/`, `icons/dien-bien-phu/` | Dữ liệu nền có điều khoản; người tạo bản dẫn xuất/lớp trang trí chưa ghi. Bản đồ hiện đại không tự chứng minh ranh giới lịch sử |
| Giọng `vi-VN-NamMinhNeural` | `cues.json`, `scripts/media/audio_pipeline.py`, `scripts/media/steady_voice.py`, README pipeline; Trúc xác nhận là giọng tiếng Việt nam của Microsoft Neural TTS; script dùng Edge TTS qua thư viện `edge-tts`, rate `-25%`, pitch `+0Hz`, có hậu kỳ tốc độ/chất lượng | Đã có mô tả nguồn tạo từ executor và cách dùng công cụ; cần đối chiếu điều khoản Microsoft Neural TTS/Edge TTS/tài khoản sử dụng tại thời điểm tạo và xác nhận audio nào được nhúng vào MP4 |
| Nhạc và SFX | README và code `audio_pipeline.py` mô tả tổng hợp nhạc/hiệu ứng bằng script | Có dấu vết cách tạo; thiếu xác nhận tác giả/quyền sử dụng và bản audio thực sự nhúng vào MP4 |
| Font | README pipeline nêu Segoe UI/Times New Roman | Cần người dựng ghi font thực dùng và điều khoản áp dụng; không suy quyền phân phối file font từ việc máy cài sẵn |

Nguồn quyền dữ liệu bản đồ: [Natural Earth — Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/), truy cập 2026-09-24. Trang cho phép dùng/sửa/phân phối dữ liệu, không yêu cầu ghi công. Attribution tự nguyện dự thảo cho riêng dữ liệu nền: “Dữ liệu bản đồ: Natural Earth; đồ họa được biên tập để minh họa.” Không áp dụng câu này như giấy phép chung của video.

### Phần hình ảnh bổ sung cho bản đọc thay thế — DRAFT

Từ khung hình đã xem: phần mở đầu dùng SỬu và hồ sơ giấy trên nền thung lũng. Tiếp theo là trục năm 1946, 1950 và 1953, cảnh binh lính minh họa và biểu tượng áp lực quân sự. Phần Navarre dùng tài liệu, quân cờ và mũi tên. Phần phân tán lực lượng dùng bản đồ Tây Bắc–Thượng Lào với các điểm và đường nối. Phần kết quay lại thung lũng, đặt câu hỏi về Điện Biên Phủ và giới thiệu tập sau. Đây là mô tả mẫu quan sát, chưa phải audio description đầy đủ hoặc xác nhận lịch sử của bản đồ/hình ảnh.

### Việc còn lại cần người cung cấp/reviewer

Phần claim lịch sử đã được Trúc review ở mức executor-side và ghi kết quả bên dưới. Product owner đã giao Trúc chốt media/legal; Trúc chốt chỉ dùng `REFERENCE_ONLY`, không approve release. Còn thiếu nếu muốn dùng lại ngoài nội bộ: sửa câu 01:17–01:29, chứng minh hoặc thay quyền audio Edge TTS, nhạc/SFX, chuỗi nguồn/xuất cuối và permission của các asset AI/Codex không còn phiên gốc. Task vẫn `IN PROGRESS`, reference chưa đủ acceptance để `REVIEW`/`DONE`.

## Hồ sơ review sơ bộ — Trước cơn bão (2026-09-24)

Trạng thái: DRAFT / REFERENCE_ONLY. Kiểm kê tài liệu đã hoàn tất; chưa đạt historical/media sign-off. Hash video đọc lại trong lượt kiểm kê vẫn là `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.

### Mục tiêu và hướng dùng đề xuất

Objective đã được Trúc review theo quyền Thọ giao: người xem nêu được mục tiêu tập trung lực lượng của Kế hoạch Navarre và mối liên hệ với việc Pháp phải phân tán lực lượng đối phó trên nhiều hướng. Objective này được chấp nhận cho hồ sơ `REFERENCE_ONLY`; chưa phải quyết định tích hợp sản phẩm.

Khuyến nghị hiện tại: giữ clip làm reference để đánh giá cách trình bày video, caption và media handoff. Clip tập trung bối cảnh kháng chiến chống Pháp năm 1953–1954; không phù hợp để tự chọn làm lesson canonical của phạm vi kháng chiến chống Mỹ trong AGENTS. Đề xuất video-led lesson năm 1954 ở trao đổi trước không phải quyết định sản phẩm và không được triển khai.

Ba hướng của task: video-led lesson có thể tận dụng lời dẫn liền mạch nhưng vướng phạm vi nội dung; tư liệu VN cần scene/objective đã duyệt và đoạn cắt tương ứng, hiện chưa có; nội dung mở rộng chỉ là đề xuất nếu Product owner chấp thuận bối cảnh và historical reviewer duyệt. Chưa có hướng tích hợp nào được chốt.

### Kiểm kê và evidence

| Hạng mục | Đã thấy / đã kiểm tra | Còn thiếu |
|---|---|---|
| Video | File đã xác nhận, 19.289.629 byte; hash nêu trên | Đọc trực tiếp stream, decode/playback và thử thiết bị/network cho bản hiện tại |
| VTT | `public/media/truoc-con-bao/subtitles.vtt`: 28 cue; text/start/end khớp 28 cue trong `cues.json`; không overlap, không duration âm, kết thúc 93,389 giây | Nghe đối chiếu audio thật; kiểm tra âm thanh phi lời nói cần chú thích và tốc độ đọc trên mobile |
| Transcript | `src/data/episodeEditorial.ts` có 7 đoạn tóm tắt; lời dẫn gốc trong `scripts/media/narrative.py`; bản từ VTT ở dưới | Bản trong app không nguyên văn: thêm mốc 1946 và diễn giải, bỏ lời dẫn. Chưa thể ghi transcript khớp audio cuối |
| Poster | Đã xem `public/media/truoc-con-bao/poster.png`: tranh dọc, SỬu trước núi/thung lũng, chữ “HELLO! SỬu đây!”, nhãn 1954 | Chưa hiển thị tên “Trước cơn bão”; cần quyết định biên tập. Chưa kiểm tra mobile/performance; file 1.799.869 byte |
| Audio | Có `episode-audio-steady.m4a`, `voice-over.mp3`; cues khai báo `vi-VN-NamMinhNeural` | Media/legal decision: approved only for internal reference; không approve publish/integration khi chưa xác nhận file audio nhúng và quyền giọng/nhạc/SFX |
| Hình/map | Script tham chiếu mascot, convoy, ảnh minh họa binh lính/thung lũng, map và icons trong `public/media/shared/`; hai JSON map mô tả Natural Earth | Manifest asset thực sự dùng trong MP4 hiện tại; tác giả/chủ quyền, nguồn gốc, license/permission và nhãn minh họa của từng asset |
| Fallback | Có văn bản dự thảo bên dưới | Chưa được review và tích hợp, chưa có mô tả đầy đủ thông tin chỉ thể hiện bằng hình ảnh |
| Rendition | Có `episode-portrait-upgraded-telegram.mp4` và `episode-portrait-upgraded-cinematic.mp4` | Tên file không chứng minh là rendition tương đương; cần đối chiếu nội dung/version và budget trước khi chọn |

Report `episode-portrait-final-sync-verification.json` ghi hash `fcc10f8a92b370effc2c648de007939f112043f610c30a1b4aa69bc2a071d489`, khác MP4 hiện tại. Report icon-only cũng ghi hash khác và đường dẫn render khác. Không chuyển các kết quả “fullDecode passed”/“audioCorrelation” cũ thành QA pass của file hiện tại.

### Nguồn lịch sử và kết quả đối chiếu claim

- S1: [Kế hoạch Na-va và chiến cục Đông Xuân 1953–1954](https://baotanglichsu.vn/vi/Articles/3097/13850/ke-hoach-na-va-va-chien-cuc-djong-xuan-1953-1954.html), Bảo tàng Lịch sử Quốc gia, đăng 15-03-2013, truy cập 2026-09-24. Locator: đoạn mở đầu “Sau gần tám năm...”; các đoạn “Theo kế hoạch Na va...”, “Về phía ta...” và phần kết về Điện Biên Phủ. Nguồn curated secondary (Tier 2 theo Phase 3).
- S2: [Thất bại của Kế hoạch Navarre và sự ra đời của Tập đoàn cứ điểm Điện Biên Phủ](https://svhttdl.dienbien.gov.vn/ditich/pages/2014/That-bai-cua-Ke-hoach-Navarre-va-su-ra-doi-cua-Tap-9937.aspx), Hồng Nhung, Bảo tàng Chiến thắng LS ĐBP, đăng 09-03-2014, truy cập 2026-09-24. Locator: các đoạn bắt đầu “Về phía Việt Nam...”, “Trước đó từ cuối tháng 7...” và “Ngày 29 tháng 11 năm 1953...”. Nguồn curated secondary (Tier 2). Dẫn nguồn không cấp quyền sao chép media/nội dung từ trang.
- S3: [Memorandum by the French Government, 1 September 1953](https://history.state.gov/historicaldocuments/frus1952-54v13p1/d395), *Foreign Relations of the United States, 1952–1954*, Office of the Historian, U.S. Department of State, truy cập 2026-09-24. Locator: “Forces in Indochina and Their Costs” và “Principles of Military Action in Indochina”. Đây là bản dịch tài liệu chính phủ đương thời được xuất bản trong tuyển tập ngoại giao (Tier 1/archival) và dùng để đối chiếu áp lực tài chính, chi phí cùng mục tiêu giành lại thế chủ động.

| Claim / đoạn VTT | Truth class | Nguồn + locator | Kết quả review của Trúc (2026-09-24) |
|---|---|---|---|
| 00:09–00:20, đầu những năm 1950 cuộc kháng chiến chống Pháp đã kéo dài nhiều năm | `verified_fact` + `educational_explanation` | S1, đoạn mở đầu “Sau gần tám năm...” | `VERIFIED`; cách nói khái quát phù hợp với niên biểu được nguồn hỗ trợ |
| 00:20–00:39, chi phí lớn, tình hình quân sự khó khăn và Pháp khó giữ thế chủ động | `verified_fact` + `educational_explanation` | S1, ba đoạn mở đầu về tổn thất/chi phí, thế bị động và khủng hoảng; S3, “Forces in Indochina and Their Costs” | `VERIFIED`; giữ đây là lời tóm tắt, không biến số liệu của nguồn thành trích dẫn trực tiếp |
| 00:39–00:54, Pháp triển khai Kế hoạch Navarre năm 1953 nhằm tập trung lực lượng, giành lại thế chủ động và tạo chuyển biến quân sự có lợi | `verified_fact` + tóm tắt | S1, các đoạn về tháng 5/1953 và hai bước kế hoạch; S3, “Principles of Military Action in Indochina” | `VERIFIED`; “chuyển biến quân sự có lợi” là paraphrase thận trọng của mục tiêu tạo tình hình quân sự thuận lợi |
| 00:58–01:07, phía Việt Nam hoạt động trên nhiều hướng khiến Pháp phải điều/phân tán lực lượng đối phó | `verified_fact` + causal explanation | S1, các đoạn về chủ trương phân tán và danh sách hướng tiến công; S2, đoạn “Về phía Việt Nam...” | `VERIFIED`; quan hệ nhân quả được cả S1 và S2 hỗ trợ trong chiến cục Đông Xuân 1953–1954 |
| 01:17–01:29, Điện Biên Phủ là thung lũng ở Tây Bắc và trở thành “tâm điểm của cả cuộc chiến” | fact địa lý + hook | S2, các đoạn về thung lũng/vị trí chiến lược và điểm quyết chiến; S1, phần Điện Biên Phủ trở thành trung tâm kế hoạch Navarre | `REVISION_REQUIRED_BEFORE_USE`; địa lý và vai trò chiến lược được hỗ trợ, nhưng “cả cuộc chiến” quá rộng. Wording được Trúc review theo quyền Thọ giao: “trở thành điểm quyết chiến chiến lược của hai bên” hoặc “trở thành tâm điểm của cuộc đối đầu Đông Xuân 1953–1954”. Bản MP4 hiện tại vẫn chứa wording cũ nên chưa được sign-off để publish/integrate |
| “một đống”, “rối như tơ vò”, SỬu chào người xem | `educational_explanation` / biên kịch | Không dùng làm historical evidence | `VERIFIED_AS_NARRATIVE`; không phải lời trích hay fact độc lập, cần giữ tone rõ là lời dẫn của mascot |

Kết quả trên hoàn tất lượt historical/wording review do Trúc thực hiện với Codex hỗ trợ tra cứu, gồm phần learning objective/wording lịch sử được Thọ cấp quyền. Product owner cũng giao Trúc chốt media/legal; Trúc chốt hồ sơ ở mức `REFERENCE_ONLY`. Một claim yêu cầu sửa trước khi dùng lại; do đó chưa có sign-off phát hành.

### Transcript dự thảo từ VTT

Nguồn: nối nguyên văn nội dung 28 cue trong VTT hiện tại thành đoạn đọc. Đây là bản đối chiếu văn bản, chưa nghe xác nhận với audio của MP4.

Hello, SỬu đây! Trước khi nói tới Điện Biên Phủ, cho SỬu tua ngược thời gian một chút nha. Đầu những năm 1950, cuộc kháng chiến chống Pháp đã kéo dài nhiều năm rồi. Và càng kéo dài thì chiến trường càng căng.

Về phía Pháp, vấn đề bắt đầu chất thành… một đống. Chi phí chiến tranh lớn, tình hình quân sự khó khăn, mà thế chủ động thì cũng không còn dễ giữ như trước. Nói đơn giản là: cứ tiếp tục như vậy thì không ổn.

Thế là năm 1953, Pháp triển khai Kế hoạch Navarre. Mục tiêu? Tập trung lực lượng, giành lại thế chủ động và tìm cách tạo ra một chuyển biến quân sự có lợi. Nghe ổn đúng không? Nhưng có một vấn đề nhỏ…

Phía Việt Nam cũng đang chủ động hoạt động trên nhiều hướng. Quân Pháp phải điều lực lượng đi đối phó ở nhiều nơi. Thành ra trên bản đồ lúc này, mọi thứ bắt đầu… rối như tơ vò.

Và rồi có một cái tên bắt đầu xuất hiện. Điện Biên Phủ. Một thung lũng ở Tây Bắc. Nhưng tại sao một nơi ở tận đây lại trở thành tâm điểm của cả cuộc chiến? Đó là chuyện của tập sau. Đi thôi!

### Fallback, mô tả và attribution dự thảo

- Thông báo fallback: “Video hiện chưa tải được. Bạn có thể đọc lời dẫn của ‘Trước cơn bão’ bên dưới và thử tải lại.” Dùng transcript ở trên sau review; cần bổ sung mô tả hình ảnh quan trọng sau khi xem toàn clip. Không coi fallback là đã triển khai hoặc có quyền tự ghi completion/reward.
- Alt poster dự thảo, dựa trên ảnh đã xem: “SỬu đội nón lá vẫy tay trước phong cảnh núi và thung lũng, cạnh hồ sơ giấy; chữ ‘Hello! SỬu đây!’.” Đây là tranh minh họa, chưa xác minh mô tả địa danh cụ thể.
- Attribution template từng asset: `Tên asset | tác giả/chủ quyền | URL nguồn | license hoặc văn bản cho phép | thay đổi đã làm | nhãn minh họa/AI nếu có | reviewer`. Điền UNKNOWN cho chỗ chưa có chứng cứ; không suy license từ việc file có trong repo.

### Handoff sau kiểm kê

Executor vẫn là Trúc. Lượt đối chiếu historical claim phía executor đã hoàn tất; learning objective/wording lịch sử đã được Trúc review theo quyền Thọ giao; media/legal đã được Trúc chốt theo quyền Product owner giao ở mức `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`. Một claim vẫn cần sửa trong bản media trước khi dùng lại ngoài nội bộ. Task giữ `IN PROGRESS` vì hướng tích hợp, bản media sửa wording, release package và acceptance publish chưa đạt. Chưa gửi thông điệp cho người khác.

## Trình tự task gốc để tham chiếu

Hoàn tất **một gói nhận diện và đánh giá video reference** theo `CONTENT-006`, trước khi quyết định dùng video theo hướng nào. Không bắt đầu code hoặc đưa media vào app trong phần việc bàn giao này.

### Trình tự thực hiện

1. **Đã chốt clip theo xác nhận Trúc**: dùng `public/media/truoc-con-bao/episode-portrait-final.mp4` và SHA-256 Tập 1 đã ghi ở trên để review. Nếu file thay đổi, ghi nhận phiên bản/hash mới trước khi dùng lại evidence. Không đổi tên, ghi đè hoặc xóa media trong phần việc bàn giao này.

2. **Lập hồ sơ đánh giá**: ghi đường dẫn file được xác định, thời lượng/kích thước/khung hình, nguồn gốc và quyền sử dụng, mục tiêu học tập dự kiến, ba lựa chọn sử dụng (video-led lesson, tư liệu trong Visual Novel, nội dung mở rộng), cùng khuyến nghị có lý do. Mọi dữ kiện lịch sử phải gắn nguồn có thể truy vết; không suy diễn từ hình ảnh hoặc lời kể của AI.

3. **Liệt kê phần media còn thiếu**: transcript, phụ đề tiếng Việt đồng bộ (kể cả âm thanh có ý nghĩa), poster, mô tả hình ảnh quan trọng, attribution và phương án thay thế khi video không tải được. Chỉ đánh dấu đạt khi đã kiểm tra bản media cụ thể và có bằng chứng.

4. **Bàn giao review**: Product owner đã giao Trúc chốt media/legal; quyết định hiện tại là `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`. Không chuyển `CONTENT-006` sang `DONE` khi chưa có bản media/package đạt acceptance publish hoặc quyết định rõ ràng rằng task chỉ dừng ở hồ sơ reference.

## Phạm vi và đầu ra

- **Trong phạm vi**: xác định đúng reference, lập hồ sơ nguồn/media, đề xuất hướng sử dụng và learning objective, ghi quyết định đã chốt cùng thiếu sót nếu muốn dùng ngoài reference.
- **Ngoài phạm vi**: sửa ứng dụng; tích hợp hoặc publish video; sản xuất video MVP theo screenplay. Video MVP thuộc `CONTENT-007`, hiện `BLOCKED` cho đến khi dependency của task đó được gỡ.
- **Đầu ra**: một hồ sơ review được liên kết từ task card `CONTENT-006`, đủ để người nhận task tiếp theo hiểu trạng thái media. Product owner đã giao Trúc chốt media/legal; quyết định hiện tại chỉ cho phép reference nội bộ, không tự phê duyệt publish/integration.
- **Executor**: Trúc. Thọ/Product owner/historical reviewer là người phối hợp hoặc reviewer, không phải đồng executor.

## Quy trình và tài liệu cần dùng

Trong repo hiện không tìm thấy `SKILL.md` chuyên biệt cho video production hoặc historical/media review. Quy trình phù hợp hiện được quy định tại:

- [`AGENTS.md`](../../../AGENTS.md) — claim task, một executor, checkpoint, handoff và giới hạn lịch sử/media.
- [`docs/tasks/README.md`](../README.md) — vòng đời task và cách đồng bộ board/card.
- [`Phase 3: Historical & Media Governance`](../../specs/phases/03-historical-media-governance.md) — provenance, license, source, phân loại claim và checklist media.
- [`Phase 8: QA, Accessibility & Release`](../../specs/phases/08-qa-accessibility-release-spec.md) — caption/transcript, fallback, khả năng truy cập và kiểm tra trên thiết bị.
- [`CONTENT-006`](./CONTENT-006.md) — acceptance, dependency và checkpoint cụ thể của task.

Các tài liệu này là quy trình dự án cần tuân theo; handoff này không tự tạo hay cài thêm skill/plugin.

## Model AI phù hợp

- **Khuyến nghị: GPT-6 Astra** để đọc/tổng hợp nguồn đã cung cấp, đối chiếu hồ sơ media với checklist Phase 3/8, lập bảng claim–source và rà tính nhất quán transcript/caption. Chỉ dùng nguồn có thể kiểm tra; yêu cầu nêu chỗ thiếu chứng cứ thay vì tự điền.
- **GPT-6 Sol** phù hợp nếu chỉ cần trợ giúp thao tác hồ sơ, chuẩn hóa metadata hoặc checklist ngắn. Không cần model coding cho task này vì đầu ra là review media, không phải thay đổi code.
- AI không xác nhận lịch sử, quyền sử dụng hoặc license thay reviewer có thẩm quyền; không giao AI tự biên tập/publish nội dung lịch sử.

## Điều kiện hoàn tất và kiểm tra

- [x] Đã phân biệt hai ứng viên; Trúc xác nhận “Trước cơn bão” là clip cần review.
- [x] Có metadata, nguồn/license status, objective và khuyến nghị có căn cứ cho hồ sơ `REFERENCE_ONLY`; chưa đủ publish/integration.
- [x] Có danh sách trạng thái transcript, caption, poster, attribution, mô tả hình ảnh và fallback; nhiều mục vẫn là draft/thiếu nếu muốn publish.
- [x] Product owner chỉ định Trúc chốt media/legal; quyết định: `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`.
- [x] Task card được cập nhật evidence, blocker và next action; không chuyển `REVIEW` vì gói publish/integration chưa đạt.

Không cần build/typecheck vì handoff này không sửa code. Trước khi kết thúc lượt làm việc, kiểm tra diff của đúng file handoff và ghi kết quả vào checkpoint task card khi có deliverable.
