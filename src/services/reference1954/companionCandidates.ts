import type { CandidateLesson } from './candidateTypes'

// Internal companions to reference video and fictional VN; no canonical approval.
export const lessonOneCandidate: CandidateLesson = {
  id: 'preview.1954.episode01.candidate', version: '1954-study-v1',
  objective: 'Hiểu bối cảnh năm 1953 và phân biệt mục tiêu kế hoạch với diễn biến thực tế.',
  sections: [
    { id: 'study01.context', title: 'Trước khi nhìn vào một trận đánh', sourceIds: ['SRC-1954-FRUS-337'], paragraphs: [
      'Đến năm 1953, cuộc chiến ở Đông Dương đã kéo dài nhiều năm. Pháp gặp sức ép quân sự và tài chính. “Sức ép tài chính” nghĩa là việc tiếp tục chiến tranh đặt ra nhu cầu chi phí và nguồn lực.',
      'Khi xem video, hãy tìm những điều thuộc bối cảnh trước chiến dịch. Chúng giúp ta hiểu vì sao các bên tính toán kế hoạch, nhưng chưa đủ để dự đoán chính xác mọi sự kiện sau đó.',
    ] },
    { id: 'study01.plan', title: 'Một kế hoạch muốn đạt điều gì?', sourceIds: ['SRC-1954-FRUS-337', 'SRC-1954-FRUS-472'], paragraphs: [
      'Kế hoạch Navarre được trình bày trong các cuộc trao đổi Mỹ–Pháp năm 1953 với mục tiêu tăng lực lượng cơ động và giành lại chủ động quân sự. “Cơ động” có nghĩa là lực lượng có thể được điều chuyển để hoạt động ở những nơi cần thiết.',
      'Tài liệu khi ấy ghi dự tính và đánh giá của người tham gia. Chẳng hạn, một kế hoạch có thể dự kiến bước này trước, bước kia sau. Đó là mục tiêu người lập kế hoạch hướng đến, chưa phải bằng chứng rằng tất cả đã thực hiện thành công.',
    ] },
    { id: 'study01.directions', title: 'Hai phía cùng có hoạt động', sourceIds: ['SRC-1954-VNMH-NAVARRE-2013'], paragraphs: [
      'Chủ trương Đông Xuân 1953–1954 của phía Việt Nam hướng đến buộc Pháp phân tán lực lượng cơ động trên nhiều chiến trường. “Phân tán” nghĩa là phải chia lực lượng ra nhiều nơi thay vì tập trung như dự định.',
      'Vì thế, học một kế hoạch cần nhìn cả hoạt động của phía bên kia. Hãy giữ câu hỏi cho tập sau: Điện Biên Phủ ở đâu và trở thành địa điểm đối đầu như thế nào? Không cần gọi một nơi là tâm điểm của toàn bộ cuộc chiến mới hiểu được vai trò của nó.',
    ] },
  ],
  checks: [
    { id: 'check01.goal', prompt: 'Mục tiêu được trình bày của kế hoạch Navarre là gì?', choices: [{ id: 'initiative', text: 'Tăng lực lượng cơ động và giành lại chủ động quân sự' }, { id: 'election', text: 'Tổ chức tổng tuyển cử tháng 7/1956' }, { id: 'border', text: 'Biến giới tuyến thành biên giới vĩnh viễn' }], answerId: 'initiative', explanation: 'Biên bản cuộc họp Mỹ–Pháp tháng 7/1953 trình bày mục tiêu tăng lực lượng cơ động và chủ động quân sự. Mục tiêu chưa phải kết quả.', sourceIds: ['SRC-1954-FRUS-337'] },
    { id: 'check01.directions', prompt: 'Chủ trương Đông Xuân 1953–1954 của phía Việt Nam hướng đến điều gì?', choices: [{ id: 'disperse', text: 'Buộc Pháp phân tán lực lượng trên nhiều hướng' }, { id: 'idle', text: 'Không hoạt động ở các chiến trường khác' }, { id: 'automatic', text: 'Làm mọi cuộc đàm phán tự động thành công' }], answerId: 'disperse', explanation: 'Nguồn bảo tàng mô tả chủ trương phân tán lực lượng cơ động của Pháp. Không nên suy thành kết quả chắc chắn cho mọi diễn biến sau đó.', sourceIds: ['SRC-1954-VNMH-NAVARRE-2013'] },
  ],
  takeaway: 'Phân biệt bối cảnh, mục tiêu kế hoạch và điều đã xảy ra.',
  reflection: 'Em cần nguồn nào để kiểm tra một kế hoạch có đạt mục tiêu hay không?',
}

export const lessonSixCandidate: CandidateLesson = {
  id: 'preview.1954.episode06.candidate', version: '1954-study-v1',
  objective: 'Đọc đúng các văn kiện Genève và tách tình huống hư cấu khỏi sự kiện có nguồn.',
  sections: [
    { id: 'study06.documents', title: 'Một hội nghị, nhiều văn kiện', sourceIds: ['SRC-1954-GENEVA-CEASE', 'SRC-1954-GENEVA-DECL', 'SRC-1954-GENEVA-MUSEUM'], paragraphs: [
      'Phần bàn về Đông Dương của hội nghị Genève bắt đầu ngày 8/5/1954. Khi gọi chung “các văn kiện Genève”, ta đang nói đến nhiều văn bản khác nhau, không phải một tờ giấy mà mọi phái đoàn cùng ký.',
      'Văn bản đình chỉ chiến sự ở Việt Nam đề ngày 20/7/1954. Tuyên bố cuối cùng của hội nghị đề ngày 21/7/1954. Hãy nhớ tên văn kiện cùng ngày tháng để không đánh đồng hai văn bản.',
    ] },
    { id: 'study06.line', title: 'Hiểu chữ “tạm thời”', sourceIds: ['SRC-1954-GENEVA-DECL', 'SRC-1954-GENEVA-CEASE'], paragraphs: [
      'Văn bản đình chỉ chiến sự quy định giới tuyến quân sự và khu vực tập kết lực lượng của hai bên. Đoạn 6 của Tuyên bố cuối cùng xác định giới tuyến là tạm thời, không phải biên giới chính trị hay lãnh thổ.',
      'Trong câu chuyện, nhân vật Minh và hội thoại là hư cấu để giúp em luyện đọc thông tin. Lựa chọn của em không đổi kết quả lịch sử. Không dùng một lá thư hư cấu như bằng chứng về đời sống của mọi gia đình.',
    ] },
    { id: 'study06.plan', title: 'Kế hoạch và việc thực hiện', sourceIds: ['SRC-1954-GENEVA-DECL', 'SRC-1954-GENEVA-CEASE'], paragraphs: [
      'Đoạn 7 của Tuyên bố cuối cùng dự kiến tổng tuyển cử tháng 7/1956. Đây là nội dung kế hoạch nêu trong văn kiện. Nó không tự chứng minh việc thực hiện về sau đã diễn ra như thế nào.',
      'Văn bản đình chỉ chiến sự còn quy định lịch ngừng bắn theo từng khu vực của Việt Nam. Vì thế, một ngày ghi trên văn kiện không có nghĩa mọi hoạt động dừng ngay cùng lúc. Tập 7 sẽ giúp em phân biệt lịch, quy định và những bước chuyển tiếp.',
    ] },
  ],
  checks: [
    { id: 'check06.documents', prompt: 'Cặp ngày và văn kiện nào được phân biệt đúng?', choices: [{ id: 'distinct', text: 'Đình chỉ chiến sự Việt Nam: 20/7; Tuyên bố cuối cùng: 21/7/1954' }, { id: 'single', text: 'Chỉ có một văn bản duy nhất ngày 7/5/1954' }, { id: 'all', text: 'Mọi văn kiện là một bản cùng ký ngày 13/3/1954' }], answerId: 'distinct', explanation: 'Hai văn bản có tên và ngày ghi khác nhau: thỏa thuận đình chỉ chiến sự Việt Nam ngày 20/7, Tuyên bố cuối cùng ngày 21/7.', sourceIds: ['SRC-1954-GENEVA-CEASE', 'SRC-1954-GENEVA-DECL'] },
    { id: 'check06.line', prompt: 'Giới tuyến quân sự tạm thời có nghĩa là gì?', choices: [{ id: 'temporary', text: 'Sắp xếp quân sự, không phải biên giới chính trị hay lãnh thổ' }, { id: 'permanent', text: 'Biên giới quốc gia vĩnh viễn' }, { id: 'election', text: 'Bằng chứng tổng tuyển cử đã diễn ra' }], answerId: 'temporary', explanation: 'Đoạn 6 của Tuyên bố cuối cùng nêu rõ tính tạm thời và phân biệt với biên giới chính trị, lãnh thổ.', sourceIds: ['SRC-1954-GENEVA-DECL'] },
    { id: 'check06.fiction', prompt: 'Nên dùng lá thư trong câu chuyện hư cấu như thế nào?', choices: [{ id: 'reflection', text: 'Gợi suy nghĩ và đặt câu hỏi tìm hiểu thêm' }, { id: 'proof', text: 'Bằng chứng rằng mọi gia đình có cùng trải nghiệm' }, { id: 'quote', text: 'Lời chứng nguyên văn của một nhân vật lịch sử có thật' }], answerId: 'reflection', explanation: 'Nhân vật và hội thoại được ghi là hư cấu. Muốn biết trải nghiệm thật cần nguồn riêng, thay vì biến tình huống minh họa thành lời chứng.', sourceIds: ['SRC-1954-GENEVA-CEASE'] },
  ],
  takeaway: 'Tên văn kiện, ngày tháng và tính chất tạm thời đều cần được đọc chính xác.',
  reflection: 'Một điều khoản có thể ảnh hưởng đời sống con người thế nào, và em cần biết thêm điều gì về một gia đình cụ thể?',
}
