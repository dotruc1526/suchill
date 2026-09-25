export const api = {
  getLessons: async () => {
    const res = await fetch('http://localhost:3001/api/lessons');
    return res.json();
  },
  getQuestions: async (lessonId: number) => {
    const res = await fetch(`http://localhost:3001/api/lessons/${lessonId}/questions`);
    return res.json();
  },
  completeLesson: async (lessonId: number) => {
    const res = await fetch(`http://localhost:3001/api/lessons/${lessonId}/complete`, { method: 'POST' });
    return res.json();
  }
};