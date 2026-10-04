import type { CandidateDraftLessons } from './candidateTypes'
export { lessonOneCandidate, lessonSixCandidate } from './companionCandidates'

// Source-bound internal authoring candidate; historical review remains pending.
const navarre = ['SRC-1954-VNMH-NAVARRE-2013']
const phase1 = ['SRC-1954-BTLSQG-PHASE-1']
const phase2 = ['SRC-1954-BTLSQG-PHASE-2']
const phase3 = ['SRC-1954-BTLSQG-PHASE-3']
const cease = ['SRC-1954-GENEVA-CEASE']
export const candidateLessons: CandidateDraftLessons = {
  draft02: {
    id: 'preview.1954.episode02.candidate', version: '1954-study-v1',
    objective: 'Đọc vị trí, hiểu tập đoàn cứ điểm và phân biệt hai thời điểm quan trọng.',
    sections: [
      { id: 'study02.location', title: 'Một thung lũng ở Tây Bắc', sourceIds: navarre, paragraphs: [
        'Điện Biên Phủ nằm ở vùng Tây Bắc Việt Nam. Đây là một thung lũng. Khi tìm địa điểm trên bản đồ, hãy xác định khu vực trước, rồi mới nhìn các vị trí bên trong.',
        'Địa điểm này liên quan đến hướng Tây Bắc và Thượng Lào. “Chiến lược” ở đây nói đến vị trí và việc tổ chức lực lượng trong một kế hoạch lớn. Không phải cứ nhìn thấy một nơi trên bản đồ là hiểu được toàn bộ kế hoạch của hai bên.',
      ] },
      { id: 'study02.fortifications', title: 'Tập đoàn cứ điểm là gì?', sourceIds: navarre, paragraphs: [
        'Trong các ngày 20–22/11/1953, Pháp đưa quân nhảy dù chiếm Điện Biên Phủ. Sau đó, nơi này được xây dựng thành tập đoàn cứ điểm: một hệ thống gồm nhiều vị trí phòng thủ, không phải một ngôi nhà hay một đồn riêng lẻ.',
        'Có ba khu cần nhớ: khu trung tâm Mường Thanh, khu Bắc và khu Nam Hồng Cúm. Khi đọc diễn biến sau này, tên các khu giúp ta hiểu sự kiện xảy ra ở đâu. Một khu thất thủ không có nghĩa mọi khu khác dừng hoạt động cùng lúc.',
      ] },
      { id: 'study02.sequence', title: 'Kế hoạch và quyết định cụ thể', sourceIds: ['SRC-1954-FRUS-337', 'SRC-1954-FRUS-472'], paragraphs: [
        'Kế hoạch Navarre được trình bày từ mùa hè năm 1953. Việc chiếm và củng cố Điện Biên Phủ diễn ra vào cuối năm đó. Hãy đặt hai việc lên dòng thời gian thay vì coi chúng là cùng một quyết định vào cùng một ngày.',
        'Các tài liệu Mỹ–Pháp khi ấy ghi những dự tính và đánh giá của người tham gia. Một dự tính là điều người ta muốn làm, chưa phải kết quả chắc chắn. Khi học lịch sử, phân biệt “dự định” với “đã xảy ra” giúp chúng ta đọc nguồn cẩn thận hơn.',
      ] },
    ],
    checks: [
      { id: 'check02.location', prompt: 'Điện Biên Phủ thuộc khu vực nào?', choices: [{ id: 'northwest', text: 'Tây Bắc Việt Nam' }, { id: 'delta', text: 'Đồng bằng sông Cửu Long' }, { id: 'coast', text: 'Duyên hải miền Trung' }], answerId: 'northwest', explanation: 'Điện Biên Phủ nằm ở Tây Bắc. Xác định khu vực là bước đầu để đọc bản đồ chiến dịch.', sourceIds: navarre },
      { id: 'check02.system', prompt: 'Cách hiểu nào phù hợp với “tập đoàn cứ điểm”?', choices: [{ id: 'single', text: 'Chỉ một căn nhà chỉ huy' }, { id: 'system', text: 'Hệ thống nhiều vị trí phòng thủ' }, { id: 'country', text: 'Tên của một quốc gia' }], answerId: 'system', explanation: 'Ở Điện Biên Phủ, hệ thống này gồm khu trung tâm Mường Thanh, khu Bắc và khu Nam Hồng Cúm.', sourceIds: navarre },
      { id: 'check02.sequence', prompt: 'Việc Pháp chiếm Điện Biên Phủ cuối năm 1953 diễn ra khi nào so với ngày mở màn chiến dịch 13/3/1954?', choices: [{ id: 'before', text: 'Trước ngày mở màn chiến dịch' }, { id: 'same', text: 'Cùng một ngày' }, { id: 'after', text: 'Sau khi chiến dịch kết thúc' }], answerId: 'before', explanation: 'Pháp chiếm Điện Biên Phủ trong tháng 11/1953. Chiến dịch của phía Việt Nam mở màn tháng 3/1954; đó là hai sự kiện khác nhau.', sourceIds: [...navarre, ...phase1] },
    ],
    takeaway: 'Đọc đúng vị trí và thứ tự sự kiện trước khi giải thích ý nghĩa chiến lược.',
    reflection: 'Nếu vẽ một sơ đồ ba khu, em sẽ đặt tên Mường Thanh và Hồng Cúm như thế nào để không nhầm?',
  },
  draft03: {
    id: 'preview.1954.episode03.candidate', version: '1954-study-v1',
    objective: 'Hiểu vai trò hậu cần và vì sao phương án tác chiến có thể được điều chỉnh.',
    sections: [
      { id: 'study03.supplies', title: 'Phía sau một trận đánh', sourceIds: ['SRC-1954-VNMH-BULLETIN-2024'], paragraphs: [
        'Muốn chiến đấu, bộ đội cần lương thực, đạn dược và trang thiết bị. “Hậu cần” là công việc bảo đảm những nhu cầu ấy. Chuẩn bị cho Điện Biên Phủ vì vậy không chỉ có việc đưa quân đến mặt trận.',
        'Dân công góp sức vận chuyển bằng gánh bộ, xe đạp thồ và các phương tiện khác. Công binh cùng lực lượng phục vụ chiến dịch mở đường, bảo đảm giao thông và đưa pháo vào trận địa. Những công việc khác nhau cùng phục vụ việc tiếp tế và chuẩn bị chiến đấu.',
      ] },
      { id: 'study03.notebook', title: 'Một cuốn sổ kể được điều gì?', sourceIds: ['SRC-1954-VNMH-NOTEBOOK-2024'], paragraphs: [
        'Bảo tàng Lịch sử Quốc gia giới thiệu cuốn sổ tay của dân công Phú Thọ. Trong đó có ghi chép giao nhận gạo, phụ tùng xe và quy định phục vụ chiến dịch. Đây là dấu vết cụ thể về công việc tiếp tế.',
        'Xe đạp thồ có thể hoạt động trên những tuyến đường mà ô tô khó đi. Khi nhìn phương tiện, hãy hỏi nó giải quyết khó khăn gì. Một cuốn sổ cho thấy công việc của những người ghi chép, nhưng không tự kể hết trải nghiệm của mọi người tham gia chiến dịch.',
      ] },
      { id: 'study03.change', title: 'Điều chỉnh để chuẩn bị chắc hơn', sourceIds: ['SRC-1954-DNLIB-GIAP-EXCERPT-2024'], paragraphs: [
        'Theo đoạn hồi ức được Thư viện Đồng Nai tuyển đăng, ngày 26/1/1954, Võ Nguyên Giáp quyết định chuyển sang phương châm “đánh chắc, tiến chắc”. Phương án trước đó là “đánh nhanh, giải quyết nhanh”. Đây là thay đổi cách tổ chức tác chiến, không phải chiến dịch đã kết thúc.',
        'Việc thay đổi đi kèm hoãn tiến công, kéo pháo ra và chuẩn bị lại hậu cần cho một chiến dịch kéo dài hơn. Bài học cần nhớ là quyết định và công việc chuẩn bị gắn với nhau. Khi điều kiện thay đổi, người chỉ huy phải đánh giá lại phương án.',
      ] },
    ],
    checks: [
      { id: 'check03.logistics', prompt: 'Việc nào thuộc hậu cần?', choices: [{ id: 'supplies', text: 'Vận chuyển lương thực và đạn dược' }, { id: 'election', text: 'Quy định ngày tổng tuyển cử' }, { id: 'treaty', text: 'Soạn Tuyên bố cuối cùng Genève' }], answerId: 'supplies', explanation: 'Hậu cần bảo đảm những nhu cầu phục vụ bộ đội, như lương thực, đạn dược và trang thiết bị.', sourceIds: ['SRC-1954-VNMH-BULLETIN-2024'] },
      { id: 'check03.evidence', prompt: 'Sổ tay dân công giúp tìm hiểu điều gì trực tiếp nhất?', choices: [{ id: 'all', text: 'Suy nghĩ của mọi người trong chiến dịch' }, { id: 'records', text: 'Các việc giao nhận và phục vụ được ghi lại' }, { id: 'future', text: 'Kết quả của một cuộc bầu cử về sau' }], answerId: 'records', explanation: 'Sổ có ghi giao nhận gạo, phụ tùng và quy định. Không nên gán cho nó những thông tin nằm ngoài nội dung ghi chép.', sourceIds: ['SRC-1954-VNMH-NOTEBOOK-2024'] },
      { id: 'check03.change', prompt: 'Việc chuyển sang “đánh chắc, tiến chắc” đi kèm điều gì?', choices: [{ id: 'prepare', text: 'Hoãn tiến công và chuẩn bị lại' }, { id: 'finish', text: 'Kết thúc ngay toàn chiến dịch' }, { id: 'stop', text: 'Không cần tiếp tế nữa' }], answerId: 'prepare', explanation: 'Đoạn hồi ức nói đến hoãn tiến công, kéo pháo ra và chuẩn bị hậu cần cho chiến dịch dài hơn.', sourceIds: ['SRC-1954-DNLIB-GIAP-EXCERPT-2024'] },
    ],
    takeaway: 'Chuẩn bị, tiếp tế và quyết định tác chiến đều góp phần vào diễn biến chiến dịch.',
    reflection: 'Nếu một kế hoạch gặp điều kiện mới, em cần kiểm tra những thông tin nào trước khi đề nghị điều chỉnh?',
  },
  draft04: {
    id: 'preview.1954.episode04.candidate', version: '1954-study-v1',
    objective: 'Kể đúng ba đợt chính mà không nhầm chuẩn bị với dừng chiến dịch.',
    sections: [
      { id: 'study04.first', title: 'Đợt I: các vị trí vòng ngoài', sourceIds: phase1, paragraphs: [
        'Ngày 13/3/1954, chiến dịch mở màn với trận tiến công Him Lam. Đợt I kéo dài đến ngày 17/3. Him Lam, Độc Lập và Bản Kéo là các vị trí vòng ngoài được nhắc đến khi học giai đoạn này.',
        'Không phải mọi vị trí đều có cùng cách kết thúc giao tranh. Có vị trí bị đánh chiếm, có vị trí buộc ra hàng. Khi tóm tắt, hãy giữ sự khác biệt ấy thay vì nói ba nơi là một trận giống hệt nhau.',
      ] },
      { id: 'study04.second', title: 'Đợt II: bao vây và tiến công', sourceIds: phase2, paragraphs: [
        'Bảo tàng Lịch sử Quốc gia xác định đợt II từ ngày 30/3 đến 30/4/1954. Bộ đội tiến công các cao điểm phía Đông, đồng thời xây dựng trận địa bao vây và đào giao thông hào.',
        'Giao thông hào giúp tổ chức trận địa và tiến gần các vị trí. Việc bao vây nhằm hạn chế tiếp tế và thu hẹp khu vực quân Pháp kiểm soát. Đợt này kéo dài; không nên hiểu rằng mọi cao điểm đều bị chiếm ngay ngày đầu.',
      ] },
      { id: 'study04.third', title: 'Đợt III và ngày tổng công kích', sourceIds: [...phase3, ...phase2], paragraphs: [
        'Đợt III bắt đầu ngày 1/5 và kéo dài đến ngày 7/5/1954. Bộ đội tiếp tục đánh các vị trí còn lại và chuẩn bị tiến tới tổng công kích. Ngày 7/5, cuộc tổng công kích vào khu trung tâm diễn ra. Bắt đầu đợt III và tổng công kích cuối cùng là hai mốc khác nhau.',
        'Nhìn ba đợt trên dòng thời gian, em sẽ thấy có khoảng giữa đợt I và đợt II. Khoảng đó có công việc chuẩn bị trận địa; không thể suy ra chiến dịch đã dừng hoàn toàn. Hãy dùng mốc 13/3–7/5 để nhớ diễn biến; bài này không kiểm tra cách đếm 55 hay 56 ngày.',
      ] },
    ],
    checks: [
      { id: 'check04.opening', prompt: 'Trận mở màn được nhắc đến trong bài là trận nào?', choices: [{ id: 'himlam', text: 'Him Lam' }, { id: 'geneva', text: 'Hội nghị Genève' }, { id: 'hanoi', text: 'Tiếp quản Hà Nội' }], answerId: 'himlam', explanation: 'Chiến dịch mở màn ngày 13/3/1954 với trận tiến công Him Lam.', sourceIds: phase1 },
      { id: 'check04.middle', prompt: 'Trong đợt II, việc bao vây có mục đích nào?', choices: [{ id: 'expand', text: 'Mở rộng khu vực quân Pháp kiểm soát' }, { id: 'limit', text: 'Hạn chế tiếp tế và thu hẹp khu vực quân Pháp kiểm soát' }, { id: 'vote', text: 'Tổ chức tổng tuyển cử' }], answerId: 'limit', explanation: 'Tiến công cao điểm và xây dựng trận địa bao vây là những hoạt động gắn với nhau trong đợt II.', sourceIds: phase2 },
      { id: 'check04.third', prompt: 'Cách kể nào phân biệt đúng hai mốc?', choices: [{ id: 'same', text: 'Đợt III và tổng công kích cuối cùng đều bắt đầu 1/5' }, { id: 'distinct', text: 'Đợt III bắt đầu 1/5; tổng công kích cuối cùng diễn ra 7/5' }, { id: 'reverse', text: 'Tổng công kích kết thúc trước đợt I' }], answerId: 'distinct', explanation: 'Nguồn bảo tàng phân biệt đợt III từ 1–7/5 với lệnh tổng công kích chiều 7/5.', sourceIds: phase3 },
    ],
    takeaway: 'Ba đợt là ba giai đoạn chính; mỗi đợt vẫn có nhiều hoạt động và diễn biến.',
    reflection: 'Em sẽ giải thích thế nào cho bạn nếu bạn nghĩ chiến dịch dừng hoàn toàn giữa hai đợt?',
  },
  draft05: {
    id: 'preview.1954.episode05.candidate', version: '1954-study-v1',
    objective: 'Phân biệt mốc chiếm sở chỉ huy với toàn bộ diễn biến và tiến trình đình chiến.',
    sections: [
      { id: 'study05.assault', title: 'Chiều 7/5 ở khu trung tâm', sourceIds: phase3, paragraphs: [
        'Chiều ngày 7/5/1954, sau các hoạt động tiến công gần Mường Thanh, bộ đội nhận lệnh tổng công kích lúc 15 giờ. Mốc này nói về diễn biến cuối chiến dịch, không phải ngày đầu mở màn 13/3.',
        'Khi đọc một giờ cụ thể trong nguồn, hãy hỏi: giờ của sự kiện nào, ở đâu? Dùng câu hỏi ấy giúp em tránh nhầm một sự kiện ở khu trung tâm với toàn bộ chiến dịch.',
      ] },
      { id: 'study05.headquarters', title: 'Sở chỉ huy và phân khu Nam', sourceIds: [...phase3, 'SRC-1954-BCP-THREE-PHASES'], paragraphs: [
        'Lúc 17 giờ 30 ngày 7/5, sở chỉ huy tại Mường Thanh bị chiếm. De Castries cùng bộ tham mưu bị bắt. Đây là mốc nổi bật của thắng lợi tại khu trung tâm.',
        'Hoạt động tại phân khu Nam còn tiếp diễn trong đêm. Vì vậy, không nên nói mọi hoạt động ở tất cả các khu đều kết thúc đúng 17 giờ 30. Bài này giữ sự phân biệt giữa khu trung tâm và phân khu Nam, không đặt một giờ kết thúc duy nhất cho mọi vị trí.',
      ] },
      { id: 'study05.after', title: 'Thắng lợi quân sự và đình chiến', sourceIds: [...phase3, ...cease], paragraphs: [
        'Chiến dịch Điện Biên Phủ diễn ra từ ngày 13/3 đến 7/5/1954. Sau diễn biến chiến trường, việc đình chỉ chiến sự được quy định qua các văn kiện đàm phán. Đây là hai phần lịch sử có liên hệ nhưng không phải cùng một sự kiện.',
        'Văn bản đình chỉ chiến sự ở Việt Nam đề ngày 20/7/1954. Nếu chỉ nhìn ngày chiến thắng rồi kết luận mọi nơi ngừng bắn ngay hôm ấy, chúng ta đã bỏ qua tiến trình sau đó. Tập tiếp theo giúp em tìm hiểu các văn kiện và sự khác nhau giữa quy định với việc thực hiện.',
      ] },
    ],
    checks: [
      { id: 'check05.capture', prompt: 'Mốc 17 giờ 30 ngày 7/5 gắn với sự kiện nào?', choices: [{ id: 'capture', text: 'Chiếm sở chỉ huy tại Mường Thanh' }, { id: 'opening', text: 'Mở màn chiến dịch' }, { id: 'declaration', text: 'Công bố Tuyên bố cuối cùng Genève' }], answerId: 'capture', explanation: 'Nguồn bảo tàng gắn mốc này với sở chỉ huy và việc bắt De Castries cùng bộ tham mưu.', sourceIds: phase3 },
      { id: 'check05.scope', prompt: 'Vì sao không dùng 17 giờ 30 làm giờ kết thúc mọi hoạt động?', choices: [{ id: 'south', text: 'Phân khu Nam còn có hoạt động trong đêm' }, { id: 'nothing', text: 'Không có sự kiện nào lúc đó' }, { id: 'election', text: 'Tổng tuyển cử diễn ra lúc đó' }], answerId: 'south', explanation: 'Nguồn tách khu trung tâm thất thủ khỏi hoạt động tiếp diễn tại phân khu Nam.', sourceIds: ['SRC-1954-BCP-THREE-PHASES'] },
      { id: 'check05.sequence', prompt: 'Cách kể nào đúng thứ tự?', choices: [{ id: 'militaryfirst', text: 'Diễn biến ngày 7/5 trước văn bản đình chiến tháng 7' }, { id: 'same', text: 'Hai việc là một sự kiện cùng ngày' }, { id: 'reverse', text: 'Văn bản tháng 7 xuất hiện trước chiến dịch tháng 3' }], answerId: 'militaryfirst', explanation: 'Ngày 7/5 và văn bản ngày 20/7 thuộc hai thời điểm, hai loại sự kiện khác nhau.', sourceIds: [...phase3, ...cease] },
    ],
    takeaway: 'Một mốc nổi bật cần đi cùng tên sự kiện và phạm vi của nó.',
    reflection: 'Nếu chỉ được viết một câu về 17 giờ 30, em sẽ thêm địa điểm nào để câu chính xác hơn?',
  },
  draft07: {
    id: 'preview.1954.episode07.candidate', version: '1954-study-v1',
    objective: 'Phân biệt quy định ngừng bắn, tập kết và kế hoạch thống nhất với việc thực hiện.',
    sections: [
      { id: 'study07.regrouping', title: 'Tập kết quân sự là gì?', sourceIds: cease, paragraphs: [
        'Văn kiện quy định lực lượng Quân đội nhân dân Việt Nam tập kết ở phía Bắc giới tuyến; lực lượng Liên hiệp Pháp ở phía Nam. “Tập kết” ở đây là chuyển quân về khu vực được quy định. Không nên gọi đó là việc tạo ra hai quốc gia.',
        'Văn kiện đặt thời hạn chuyển quân và trang bị không quá 300 ngày. Đây là thời hạn trong thỏa thuận; bản thân câu quy định chưa chứng minh mọi việc đã hoàn tất đúng như dự kiến.',
      ] },
      { id: 'study07.ceasefire', title: 'Ngày văn kiện khác ngày ngừng bắn', sourceIds: cease, paragraphs: [
        'Văn bản đình chỉ chiến sự ở Việt Nam đề ngày 20/7/1954. Điều 11 quy định ngừng bắn theo các khu vực: miền Bắc ngày 27/7, miền Trung ngày 1/8 và miền Nam ngày 11/8. Vì vậy, không kể rằng mọi nơi đều đồng loạt ngừng bắn ngay ngày ký văn bản.',
        'Văn kiện còn quy định giúp dân cư muốn chuyển sang vùng do bên kia quản lý trong thời gian chuyển quân. Đây là nội dung thỏa thuận. Khi tìm hiểu trải nghiệm của một gia đình cụ thể, ta cần thêm nguồn, không đoán rằng mọi gia đình đều có cùng lựa chọn và hoàn cảnh.',
      ] },
      { id: 'study07.transition', title: 'Những bước chuyển tiếp', sourceIds: ['SRC-1954-HANOI-MUSEUM', 'SRC-1954-REGROUP-MUSEUM', 'SRC-1954-GENEVA-DECL'], paragraphs: [
        'Ngày 10/10/1954, Hà Nội được tiếp quản. Sau đó là việc tổ chức quản lý và khôi phục hoạt động. Sầm Sơn là một địa điểm đón người tập kết từ miền Nam trong giai đoạn 1954–1955. Đó là các ví dụ ở những địa điểm cụ thể, không phải toàn bộ đời sống Việt Nam khi ấy.',
        'Tuyên bố cuối cùng của hội nghị Genève dự kiến tổng tuyển cử vào tháng 7/1956. Giới tuyến quân sự được xác định là tạm thời, không phải biên giới chính trị hay lãnh thổ. Muốn tìm hiểu kế hoạch được thực hiện ra sao về sau, cần tiếp tục đọc nguồn cho giai đoạn tiếp theo.',
      ] },
    ],
    checks: [
      { id: 'check07.border', prompt: 'Giới tuyến quân sự được hiểu thế nào theo Tuyên bố cuối cùng?', choices: [{ id: 'temporary', text: 'Tạm thời, không phải biên giới chính trị hay lãnh thổ' }, { id: 'permanent', text: 'Biên giới vĩnh viễn của hai quốc gia' }, { id: 'city', text: 'Ranh giới riêng của Hà Nội' }], answerId: 'temporary', explanation: 'Đoạn 6 của Tuyên bố cuối cùng phân biệt rõ giới tuyến quân sự tạm thời với biên giới chính trị, lãnh thổ.', sourceIds: ['SRC-1954-GENEVA-DECL'] },
      { id: 'check07.schedule', prompt: 'Ngày văn kiện và lịch ngừng bắn có phải luôn là cùng một ngày?', choices: [{ id: 'same', text: 'Có, mọi nơi dừng ngay ngày 20/7' }, { id: 'different', text: 'Không, văn kiện quy định các ngày theo khu vực' }, { id: 'none', text: 'Văn kiện không đề cập ngừng bắn' }], answerId: 'different', explanation: 'Điều 11 nêu lịch miền Bắc 27/7, miền Trung 1/8, miền Nam 11/8/1954.', sourceIds: cease },
      { id: 'check07.plan', prompt: 'Câu “dự kiến tổng tuyển cử tháng 7/1956” chứng minh điều gì?', choices: [{ id: 'plan', text: 'Nội dung kế hoạch nêu trong văn kiện' }, { id: 'result', text: 'Cuộc tuyển cử chắc chắn đã diễn ra' }, { id: 'family', text: 'Mọi gia đình đã đoàn tụ' }], answerId: 'plan', explanation: 'Một văn kiện nêu kế hoạch không tự chứng minh kết quả thực hiện về sau. Cần nguồn cho giai đoạn sau để trả lời câu hỏi ấy.', sourceIds: ['SRC-1954-GENEVA-DECL'] },
    ],
    takeaway: 'Phân biệt thỏa thuận, lịch thực hiện và trải nghiệm thực tế của con người.',
    reflection: 'Nếu tìm hiểu chuyện tập kết của một gia đình, em sẽ hỏi thêm những loại nguồn nào?',
  },
}
