export type UserProgress = {
  xp: number; // Điểm kinh nghiệm (bắt đầu từ 0)
  level: number; // Cấp độ (bắt đầu từ Cấp 0)
  streak: number; // Chuỗi ngày học (bắt đầu từ 0)
  coins: number; // Số xu tích lũy (bắt đầu từ 0)
  achievements: number; // Số danh hiệu đạt được (bắt đầu từ 0)
  totalLessons: number; // Số bài học đã hoàn thành (bắt đầu từ 0)
  totalQuestions: number; // Số câu hỏi đã làm (bắt đầu từ 0)
  correctAnswers: number; // Số câu trả lời đúng (bắt đầu từ 0)
  // Chỉ số thi đấu Đấu Trí 1v1
  pvpMatches: number; // Số trận đã đấu (bắt đầu từ 0)
  pvpWins: number; // Số trận thắng (bắt đầu từ 0)
  pvpStreak: number; // Chuỗi thắng hiện tại (bắt đầu từ 0)
  // Danh sách ID bài học đã học xong, ví dụ: ["1-0", "1-1"] (chapterId-lessonIdx)
  completedLessons: string[];
};

export const DEFAULT_NEW_USER_PROGRESS: UserProgress = {
  xp: 0,
  level: 0,
  streak: 0,
  coins: 0,
  achievements: 0,
  totalLessons: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  pvpMatches: 0,
  pvpWins: 0,
  pvpStreak: 0,
  completedLessons: [],
};

export type UserAccount = {
  id: string;
  username: string; // Tên đăng nhập / email / số điện thoại
  password: string;
  displayName?: string; // Tên hiển thị người chơi trong game (duy nhất)
  createdAt: number;
  progress: UserProgress;
};

export type AuthMode = 'login' | 'register' | 'forgot';
