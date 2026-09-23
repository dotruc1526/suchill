# Duyệt nhanh Phase 2 — Biên kịch một episode như thế nào?

> Trạng thái: ĐÃ DUYỆT\
> Thời gian đọc: khoảng 8–10 phút

## Phase 2 là gì?

Phase 1 đã quyết định Visual Novel dùng để dạy như thế nào. Phase 2 quyết định **biên kịch phải viết nội dung theo cấu trúc nào** để frontend có thể biến nó thành scene mà không phải đoán.

Phase này chưa thiết kế database hoặc TypeScript. Nó giống như tạo một mẫu screenplay chung cho cả nhóm.

## Bốn cấp nội dung

```text
Chapter — Một giai đoạn/mốc lịch sử lớn
└── Lesson — Một đơn vị học; có thể là text, video, Visual Novel hoặc quiz
    └── Episode — Một phiên Visual Novel hoàn chỉnh 6–10 phút
        └── Scene — Một khoảnh khắc hoặc nhiệm vụ nhỏ trong episode
```

Trong MVP:

- Một Visual Novel lesson tương ứng với một episode.
- Một episode là đơn vị được resume, hoàn thành và nhận reward.
- “Story” là tên/không gian kể chuyện có thể gom nhiều episode trong tương lai; MVP chưa cần nhiều episode trong một story.

## Một scene cần được viết những gì?

Mỗi scene cần trả lời:

1. Scene này phục vụ mục tiêu học nào?
2. Đây là fact, giải thích giáo dục hay hư cấu?
3. Người học nhìn thấy/nghe thấy gì?
4. Ai đang nói?
5. Người học phải làm gì?
6. Chọn xong thì nhận phản hồi gì?
7. Scene tiếp theo là gì?
8. Fact trong scene dựa trên nguồn nào?

## Bốn loại choice

### 1. Narrative choice

Cho người học chọn điều muốn khám phá hoặc cách phản hồi trong câu chuyện.

```text
Bạn muốn xem tài liệu nào trước?
A. Bản đồ khu tập kết
B. Biên bản hội nghị
C. Lá thư của người dân
```

Không có đúng/sai.

### 2. Reflection choice

Cho người học suy nghĩ về cảm xúc, tác động con người hoặc ý nghĩa.

```text
Điều gì khiến bạn chú ý nhất?
A. Mong muốn hòa bình
B. Nỗi lo chia cách
C. Vai trò của đàm phán
```

Không chấm điểm và không dùng để phán xét người học.

### 3. Branching choice

Cho người học chuyển sang một scene hoặc góc nhìn khác.

```text
Xem bản đồ trước → Scene bản đồ
Đọc biên bản trước → Scene tài liệu
```

Các nhánh nên quay lại luồng chính sau 1–2 scene. Không có nhánh nào được thay đổi kết quả lịch sử thật.

### 4. Knowledge check

Kiểm tra kiến thức có đáp án đúng/sai.

```text
Vĩ tuyến 17 được mô tả là gì?
A. Biên giới vĩnh viễn
B. Giới tuyến quân sự tạm thời
C. Một tỉnh của Việt Nam
```

Nếu sai, phải giải thích vì sao và cho thử lại.

## Không có công thức cố định như “lúc nào cũng là lá thư”

Ví dụ Genève/vĩ tuyến 17/lá thư chỉ là **minh họa tạm thời cho cách viết**, không phải template bắt buộc, chuẩn chất lượng hoặc target episode. Story hiện tại là demo rút gọn và chưa đủ bối cảnh ngoài đời; pilot chính thức sau này có thể viết lại hoặc chọn sự kiện khác hoàn toàn.

Mỗi episode phải chọn scenario phù hợp với sự kiện:

| Bối cảnh | Vai diễn có thể phù hợp | Tương tác có thể phù hợp |
|---|---|---|
| Chiến dịch/quân sự | Người lính, liên lạc viên, nhân viên cứu thương, người quan sát hậu cần | Đọc bản đồ, chọn tuyến liên lạc, nhận diện điều kiện thực tế |
| Hội nghị/đàm phán | Trợ lý đoàn, phiên dịch, người ghi biên bản, quan sát viên hư cấu | So sánh tài liệu, ghi chú điều khoản, xác định cách diễn đạt chính xác |
| Đời sống dân sự thời chiến | Người dân, giáo viên, y tế, người sơ tán hư cấu | Ưu tiên thông tin, nhận diện tác động con người, reflection choice |
| Sự kiện được ghi nhận bằng tư liệu | Người xem/đọc hồ sơ, phóng viên hư cấu, người lưu trữ | Kiểm tra nguồn, phân biệt ảnh/tường thuật, ghép timeline |

Không được chọn vai chỉ vì “nghe kịch tính”. Writer phải chứng minh vai đó có thể tồn tại trong thời gian, địa điểm và điều kiện của sự kiện.

## Ví dụ outline Genève 1954 — chỉ để minh họa cấu trúc

Đây chỉ là một **ví dụ minh họa**, không phải cấu trúc mặc định, không phải migration target và không phải cam kết sẽ phát triển tiếp story demo hiện tại; các fact vẫn cần kiểm chứng ở Phase 3.

```text
Episode: Hiệp định Genève 1954
Mục tiêu học:
1. Hiểu bối cảnh hội nghị.
2. Hiểu tính chất tạm thời của giới tuyến quân sự.
3. Phân biệt thỏa thuận lịch sử với tình huống hư cấu dùng để dẫn chuyện.

Scene 1 — Entry
Giới thiệu mục tiêu, thời lượng và nhãn hư cấu.

Scene 2 — Hành lang hội nghị
Nhân vật Minh (hư cấu) dẫn người học vào bối cảnh. Có thể thay bằng vai trợ lý đoàn, người ghi biên bản hoặc người quan sát khác nếu nguồn và mục tiêu học phù hợp.

Scene 3 — Chọn tư liệu
Narrative/branching choice: bản đồ hoặc biên bản trước.

Scene 4 — Bản đồ vĩ tuyến 17
Knowledge check về tính chất giới tuyến. [NEEDS HISTORICAL VERIFICATION]

Scene 5 — Góc nhìn con người
Reflection choice; không đúng/sai. Có thể là lá thư, lời kể, hồ sơ dân sự hoặc một artifact khác phù hợp với nguồn và bối cảnh; không bắt buộc là lá thư.

Scene 6 — Tóm tắt biên bản
Knowledge check tổng hợp. [NEEDS HISTORICAL VERIFICATION]

Scene 7 — Debrief
Ba điều cần nhớ, nhắc lại phần nào là hư cấu, hiển thị nguồn và next action.
```

## Quy tắc viết lời thoại

- Nhân vật lịch sử chỉ được đặt trong dấu ngoặc kép khi có nguồn trích dẫn rõ.
- Nếu chỉ diễn giải ý, phải ghi là paraphrase, không giả thành câu nói thật.
- Nhân vật hư cấu được nói lời do biên kịch viết nhưng phải có nhãn.
- Dùng tiếng Việt tự nhiên, ngắn, dễ đọc; tránh slang gây sai bối cảnh.
- Không biến nhân vật thành người giảng bài dài dòng.
- Mỗi đoạn thoại nên truyền một ý chính.

## Giới hạn để episode không quá dài

- 4–7 scene chính.
- 2–4 lựa chọn mỗi choice scene.
- Không quá hai scene chỉ đọc liên tiếp.
- Một scene thường mất khoảng 20–90 giây.
- Một episode có 1–3 learning objectives.
- Nhánh phụ quay lại luồng chính sau tối đa 1–2 scene trong MVP.

Nếu vượt giới hạn, tách thành episode hoặc lesson khác.

## AI hỗ trợ biên kịch thế nào?

AI có thể:

- Gợi ý outline và scene beats.
- Viết nhiều phương án lời thoại.
- Rút gọn đoạn dài.
- Phát hiện choice khó hiểu hoặc các nhánh không quay lại.
- Gợi ý misconception để làm knowledge check.

Biên kịch vẫn phải chọn, sửa và chịu trách nhiệm. AI không được coi là nguồn lịch sử và không được tự publish.

## Nguyên tắc chọn vai và scenario

1. Xác định historical question trước khi chọn nhân vật.
2. Xác định thời gian, địa điểm, lực lượng và điều kiện sống/thông tin thực tế.
3. Chọn vai có lý do xuất hiện trong bối cảnh đó.
4. Gắn nhãn rõ nếu vai là hư cấu, composite hoặc người chứng kiến được tạo để dẫn chuyện.
5. Choice nên yêu cầu người học quan sát, ghi nhận, ưu tiên, suy luận hoặc reflection; không yêu cầu thay đổi kết quả lịch sử.
6. Nếu dùng nhân vật lịch sử thật, mọi lời nói/hành động cần source phù hợp.
7. Nếu thiếu source để tái dựng vai, chuyển sang observer/narrator hoặc dùng lesson/video thường.

## Bạn đang duyệt điều gì?

| # | Đề xuất | Khuyến nghị |
|---|---|---|
| 1 | Chapter → Lesson → Episode → Scene là hierarchy nội dung | Duyệt |
| 2 | MVP: một Visual Novel lesson có một episode | Duyệt |
| 3 | Episode là đơn vị resume/completion/reward | Duyệt |
| 4 | Có bốn loại choice: narrative, reflection, branching, knowledge check | Duyệt |
| 5 | Narrative/reflection không có đúng sai | Đã chốt từ Phase 1 |
| 6 | Branching không thay đổi lịch sử và quay lại luồng chính sau 1–2 scene | Duyệt |
| 7 | Knowledge check bắt buộc có explanation và retry | Đã chốt từ Phase 1 |
| 8 | Mọi đoạn nội dung phải phân loại fact/explanation/fiction | Duyệt |
| 9 | Quote của nhân vật lịch sử phải có nguồn; paraphrase không được giả thành quote | Duyệt |
| 10 | Writer dùng story template và scene template chung | Duyệt |
| 11 | Scenario và vai diễn thay đổi theo bối cảnh lịch sử; không có motif bắt buộc như lá thư | Duyệt |
| 12 | Có thể dùng vai người lính/người dân/người cứu thương/người ghi chép/người chứng kiến nếu đúng bối cảnh và được gắn nhãn | Duyệt |
| 13 | Choice chỉ thay đổi góc nhìn/đường khám phá, không thay đổi historical outcome | Duyệt |

## Bạn chưa duyệt điều gì?

Phase 2 chưa quyết định:

- Field TypeScript/JSON chính xác.
- Database tables.
- UI của từng loại scene.
- Quy trình kiểm chứng nguồn cụ thể.
- Cách player lưu và chuyển state.
- Độ dài tối đa chính xác của video trong scene.

Các mục đó thuộc Phase 3–6.

## Cách phản hồi

Nếu đồng ý:

```text
Duyệt Phase 2 theo bản duyệt nhanh, làm Phase 3.
```

Nếu muốn sửa, chỉ cần ghi số mục và thay đổi mong muốn.

## Tài liệu đầy đủ

Xem [Phase 2 full spec](../phases/02-content-story-authoring-model.md) để đọc template, writing rules, impact và checklist đầy đủ.
