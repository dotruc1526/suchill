const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const login = async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    return res.json();
};
export const completeLesson = async (token, lessonId) => {
    const res = await fetch(`${API_URL}/api/lessons/${lessonId}/complete`, {
        method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
    });
    return res.json();
};
