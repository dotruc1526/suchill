import { chapters as baseChapters, achievements as baseAchievements } from './data';
import type { Chapter } from './data';
import type { UserProgress } from './auth/types';

// Tính toán danh sách chương và bài học mở khóa theo tiến trình thực tế của tài khoản
export function computeUserChapters(completedLessons: string[] = []): Chapter[] {
  const completedSet = new Set(completedLessons);

  return baseChapters.map((ch, chIdx) => {
    // Chương đầu tiên luôn mở khóa, các chương sau mở khi chương trước đã hoàn thành
    const isFirstChapter = chIdx === 0;
    const prevChapter = chIdx > 0 ? baseChapters[chIdx - 1] : null;
    const prevChapterAllLessonsDone = prevChapter
      ? prevChapter.lessons.length > 0 && prevChapter.lessons.every((_, lidx) => completedSet.has(`${prevChapter.id}-${lidx}`))
      : true;

    const isChapterUnlocked = isFirstChapter || prevChapterAllLessonsDone;

    let completedInChapter = 0;
    const lessons = ch.lessons.map((lesson, lidx) => {
      const key = `${ch.id}-${lidx}`;
      const isDone = completedSet.has(key);
      if (isDone) completedInChapter++;

      // Bài học được mở nếu là bài đầu tiên trong chương đã mở, hoặc bài trước đó đã học xong
      const prevLessonDone = lidx === 0 || completedSet.has(`${ch.id}-${lidx - 1}`);
      const status: 'completed' | 'current' | 'locked' = isDone
        ? 'completed'
        : (isChapterUnlocked && prevLessonDone ? 'current' : 'locked');

      return {
        ...lesson,
        status,
      };
    });

    const totalLessons = ch.lessons.length;
    const progress = totalLessons > 0 ? completedInChapter / totalLessons : 0;
    const allDone = totalLessons > 0 && completedInChapter === totalLessons;

    const status: 'completed' | 'current' | 'locked' = allDone
      ? 'completed'
      : (isChapterUnlocked ? 'current' : 'locked');

    return {
      ...ch,
      progress,
      status,
      lessons,
    };
  });
}

// Tính toán danh hiệu đạt được theo tiến trình người dùng
export function computeUserAchievements(progress: UserProgress) {
  return baseAchievements.map(a => {
    let earned = false;
    if (a.id === 1) earned = progress.totalLessons >= 5;
    else if (a.id === 2) earned = progress.streak >= 7;
    else if (a.id === 3) earned = progress.totalLessons >= 10;
    else if (a.id === 4) earned = progress.totalQuestions >= 20 && (progress.correctAnswers / Math.max(1, progress.totalQuestions)) >= 0.9;
    else if (a.id === 5) earned = progress.totalLessons >= 20;
    else if (a.id === 6) earned = progress.totalLessons >= 30;

    return {
      ...a,
      earned,
    };
  });
}
