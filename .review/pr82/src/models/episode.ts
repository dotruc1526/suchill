export type EpisodeStage = "intro" | "video" | "knowledge" | "map" | "quiz" | "reward"

export type EpisodeQuestion = {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export type EpisodeVideoScene = {
  time: string
  title: string
  subtitle: string
  accent: string
}

export const episodeQuestions: EpisodeQuestion[] = [
  {
    question: "Điện Biên Phủ nằm ở khu vực nào của Việt Nam?",
    options: ["Đông Bắc", "Tây Bắc", "Tây Nguyên", "Đồng bằng Bắc Bộ"],
    correct: 1,
    explanation: "Điện Biên Phủ thuộc khu vực Tây Bắc và có vị trí chiến lược quan trọng.",
  },
  {
    question: "Vì sao Pháp xây dựng Điện Biên Phủ thành một tập đoàn cứ điểm mạnh?",
    options: ["Phát triển kinh tế địa phương", "Xây dựng thành phố mới", "Tạo lợi thế quân sự và kiểm soát khu vực", "Tổ chức hội nghị quốc tế"],
    correct: 2,
    explanation: "Vị trí chiến lược khiến Pháp muốn biến Điện Biên Phủ thành một cứ điểm quân sự mạnh.",
  },
  {
    question: "Bối cảnh nào dẫn đến chiến dịch Điện Biên Phủ?",
    options: [
      "Chiến trường thay đổi, Pháp gặp khó khăn và xây dựng cứ điểm chiến lược",
      "Việt Nam bắt đầu phát triển đường sắt ở Tây Bắc",
      "Một hội nghị quốc tế được tổ chức tại Điện Biên Phủ",
      "Các bên cùng mở rộng hoạt động thương mại",
    ],
    correct: 0,
    explanation: "Tình hình chiến trường thay đổi và việc xây dựng cứ điểm đã tạo nên bối cảnh dẫn tới chiến dịch.",
  },
]

export const episodeVideoScenes: EpisodeVideoScene[] = [
  {
    time: "00:00",
    title: "Đông Dương, đầu những năm 1950",
    subtitle: "Cuộc kháng chiến chống Pháp đang bước vào giai đoạn quyết liệt.",
    accent: "#C79A59",
  },
  {
    time: "00:26",
    title: "Chiến trường thay đổi",
    subtitle: "Pháp gặp nhiều khó khăn và tìm một nơi có thể tạo lợi thế quân sự.",
    accent: "#A84D3F",
  },
  {
    time: "00:58",
    title: "Điện Biên Phủ",
    subtitle: "Một thung lũng ở Tây Bắc trở thành vị trí chiến lược cho cuộc đối đầu quyết định.",
    accent: "#69705C",
  },
]
