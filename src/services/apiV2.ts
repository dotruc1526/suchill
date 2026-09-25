export const api = {
  login: async (username: string, password: string) => {
    const res = await fetch('http://localhost:3001/api/auth/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username, password }) });
    return res.json();
  },
  register: async (username: string, password: string) => {
    const res = await fetch('http://localhost:3001/api/auth/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username, password }) });
    return res.json();
  },
  getLessons: async () => {
    const res = await fetch('http://localhost:3001/api/lessons');
    return res.json();
  },
  getQuestions: async (lessonId: number) => {
    const res = await fetch(`http://localhost:3001/api/lessons/${lessonId}/questions`);
    return res.json();
  },
  completeLesson: async (lessonId: number, userId: number, score: number, maxScore: number) => {
    const res = await fetch(`http://localhost:3001/api/lessons/${lessonId}/complete`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ userId, score, maxScore }) });
    return res.json();
  },
  getProgress: async (userId: number) => {
    const res = await fetch(`http://localhost:3001/api/users/${userId}/progress`);
    return res.json();
  }
};
