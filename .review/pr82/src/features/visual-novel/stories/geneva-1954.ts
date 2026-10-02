import type { VisualNovelStory } from '../types'

export const geneva1954Story: VisualNovelStory = {
  id: 'geneva-1954',
  title: 'Hiệp định Genève 1954',
  scenes: [
    {
      id: 'arrival',
      title: 'GENÈVE · ĐÊM 20.07.1954',
      backdrop: 'hall',
      image: 'https://upload.wikimedia.org/wikipedia/commons/ca/ca/1954_Geneva_Conference.jpg',
      emotion: 'thinking',
      text: 'Bạn là Minh, thư ký trẻ của đoàn Việt Nam. Sau chiến thắng Điện Biên Phủ, cả hành lang hội nghị im lặng trước giờ họp cuối. Tối nay, từng câu trong biên bản có thể đi vào lịch sử.',
      choices: [
        {
          label: 'Ưu tiên chấm dứt chiến sự để người dân được trở về.',
          response: 'Bạn đánh dấu vào sổ: hòa bình không chỉ là chữ ký, mà còn là mái nhà và những cuộc đoàn tụ.',
        },
        {
          label: 'Ưu tiên con đường thống nhất đất nước.',
          response: 'Bạn đánh dấu vào sổ: một đất nước thống nhất là điều không thể bị quên trong bất kỳ thỏa thuận nào.',
        },
        {
          label: 'Tìm hiểu kỹ đề xuất tập kết quân sự.',
          response: 'Bạn mở bản đồ. Muốn hiểu ngày mai, trước hết phải đọc thật đúng từng nét mực hôm nay.',
        },
      ],
    },
    {
      id: 'map-17',
      title: 'BẢN ĐỒ TRÊN BÀN HỌP',
      backdrop: 'map',
      emotion: 'idea',
      text: 'Trưởng đoàn đẩy bản đồ về phía bạn: “Minh, hãy ghi thật chính xác. Vĩ tuyến 17 trong dự thảo này là gì?”',
      choices: [
        {
          label: 'Biên giới vĩnh viễn giữa hai quốc gia.',
          correct: false,
          response: 'BẢN GHI BỊ BÁC BỎ',
          note: 'Hiệp định Genève quy định đây là giới tuyến quân sự tạm thời để tập kết, chuyển quân; không phải biên giới chính trị hay lãnh thổ.',
        },
        {
          label: 'Giới tuyến quân sự tạm thời để các lực lượng tập kết, chuyển quân.',
          correct: true,
          response: 'BẢN GHI ĐƯỢC XÁC NHẬN',
          note: 'Đúng. Vĩ tuyến 17 gắn với khu vực sông Bến Hải, là một sắp xếp quân sự tạm thời.',
        },
        {
          label: 'Một tên gọi khác của sông Hồng.',
          correct: false,
          response: 'BẢN GHI BỊ BÁC BỎ',
          note: 'Sông Bến Hải gắn với giới tuyến quân sự tạm thời. Sông Hồng không phải nội dung của quy định này.',
        },
      ],
    },
    {
      id: 'letter',
      title: 'LÁ THƯ BÊN NGOÀI PHÒNG HỌP',
      backdrop: 'people',
      image: 'https://upload.wikimedia.org/wikipedia/commons/2/25/PhamVanDong1954.jpg',
      emotion: 'worried',
      text: 'Bên ngoài, một người mẹ đưa bạn lá thư cho người thân ở phía bên kia khu tập kết: “Sau này, chúng tôi còn gặp nhau được không?” Bạn sẽ nói điều gì?',
      choices: [
        {
          label: '“Điều đầu tiên là tiếng súng phải dừng lại để mọi người được sống bình yên.”',
          response: 'Bà nắm chặt lá thư. Bạn nhận được mảnh ghi chép: HÒA BÌNH & ĐỜI SỐNG.',
        },
        {
          label: '“Sự chia cắt này chỉ là tạm thời; đất nước vẫn là một.”',
          response: 'Bà lặng im nhìn bản đồ. Bạn nhận được mảnh ghi chép: THỐNG NHẤT & HY VỌNG.',
        },
        {
          label: '“Tôi sẽ ghi lại câu hỏi này, vì một hiệp định luôn chạm đến đời sống con người.”',
          response: 'Bạn cất lá thư vào sổ. Bạn nhận me mảnh ghi chép: CON NGƯỜI & KÝ ỨC.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'CÂU CUỐI TRONG BIÊN BẢN',
      backdrop: 'table',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ph%C3%A1i_%C4%91o%C3%A0n_Vi%E1%BB%87t_Nam_t%E1%BA%A1i_H%E1%BB%99i_ngh%E1%BB%8B_Gen%C3%A8ve_%281954%29.jpg',
      emotion: 'determined',
      text: 'Gần sáng, trưởng đoàn nhìn trang biên bản chưa khép: “Hãy tóm tắt ý nghĩa của thỏa thuận này, nhưng đừng để lịch sử bị hiểu sai.”',
      choices: [
        {
          label: 'Chia cắt Việt Nam lâu dài để đổi lấy hòa bình.',
          correct: false,
          response: 'CÂU NÀY KHÔNG THỂ ĐƯỢC GHI',
          note: 'Cách diễn đạt này làm sai bản chất tạm thời của giới tuyến và mục tiêu thống nhất đất nước.',
        },
        {
          label: 'Đình chỉ chiến sự, tập kết tạm thời và hướng tới thống nhất bằng tổng tuyển cử.',
          correct: true,
          response: 'DÒNG BIÊN BẢN ĐƯỢC ĐÓNG DẤU',
          note: 'Đúng. Hiệp định Genève được ký ngày 21/7/1954, mở ra hòa bình nhưng việc thi hành sau đó gặp nhiều trở ngại.',
        },
        {
          label: 'Đàm phán không quan trọng vì chỉ thắng lợi quân sự mới quyết định tất cả.',
          correct: false,
          response: 'CÂU NÀY KHÔNG THỂ ĐƯỢC GHI',
          note: 'Chiến thắng Điện Biên Phủ tạo điều kiện cho đàm phán; ngoại giao là một phần quan trọng của kết quả lịch sử.',
        },
      ],
    },
    {
      id: 'dawn',
      title: 'BÌNH MINH TRÊN HỒ LÉMAN',
      backdrop: 'dawn',
      image: 'https://upload.wikimedia.org/wikipedia/commons/ca/ca/1954_Geneva_Conference.jpg',
      emotion: 'happy',
      text: 'Hiệp định Genève được ký. Hòa bình được lập lại ở Đông Dương, nhưng lời hứa về tổng tuyển cử đã không trở thành hiện thực. Bạn khép sổ: chặng đường tiếp theo của lịch sử Việt Nam vừa bắt đầu.',
    },
  ],
}
