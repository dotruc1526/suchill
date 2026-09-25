import { useState, useEffect } from 'react';
import { api } from './services/apiV2';

export default function AppV2() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('login');
  
  // Auth state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Learning state
  const [events, setEvents] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState<number[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const handleLogin = async () => {
    try {
      const u = await api.login(username, password);
      if (u.error) return setAuthError(u.error);
      setUser(u);
      loadData(u.id);
    } catch (e) { 
      setAuthError('Lỗi kết nối Server'); 
    }
  };

  const handleRegister = async () => {
    try {
      const u = await api.register(username, password);
      if (u.error) return setAuthError(u.error);
      setUser(u);
      loadData(u.id);
    } catch (e) { 
      setAuthError('Lỗi đăng ký'); 
    }
  };

  const loadData = (uid: number) => {
    api.getLessons().then(data => setEvents(data));
    api.getProgress(uid).then(data => setProgress(data));
    setView('home');
  };

  if (view === 'login') {
    return (
      <div className='p-4 max-w-md mx-auto bg-amber-50 min-h-screen text-amber-950 font-sans flex flex-col justify-center'>
        <h1 className='text-4xl font-bold mb-8 text-red-800 text-center'>Sử Chill</h1>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-bold mb-4'>Đăng nhập / Đăng ký</h2>
          {authError && <p className='text-red-500 mb-2'>{authError}</p>}
          <input 
            type="text" 
            placeholder="Tên đăng nhập" 
            className="w-full p-2 mb-3 border rounded"
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            className="w-full p-2 mb-4 border rounded"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <button className='w-full bg-red-800 text-white p-2 rounded font-bold mb-2' onClick={handleLogin}>
            Đăng nhập
          </button>
          <button className='w-full bg-amber-200 text-amber-900 p-2 rounded font-bold' onClick={handleRegister}>
            Đăng ký mới
          </button>
        </div>
      </div>
    );
  }

  if (view === 'home') {
    return (
      <div className='p-4 max-w-md mx-auto bg-amber-50 min-h-screen text-amber-950 font-sans'>
        <div className="flex justify-between items-center mb-6">
          <h1 className='text-2xl font-bold text-red-800'>Sử Chill</h1>
          <div className="text-right">
            <p className="font-bold">{user.username}</p>
            <p className="text-sm text-amber-700">🔥 {user.current_streak} ngày | 🌟 {user.xp} XP</p>
          </div>
        </div>
        
        <p className='mb-4 font-bold text-lg'>Hành trình Lịch Sử Việt Nam</p>
        <div className='space-y-4'>
          {events.map(ev => {
            const isCompleted = progress.includes(ev.id);
            return (
              <div 
                key={ev.id} 
                className={`p-4 rounded-lg shadow cursor-pointer border-2 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-transparent'}`}
                onClick={() => { setSelectedLesson(ev); setView('lesson'); }}
              >
                <div className="flex justify-between items-center">
                  <h2 className='font-bold text-red-800 text-lg'>{ev.title}</h2>
                  {isCompleted && <span className="text-green-600 text-xl">✓</span>}
                </div>
                <p className='text-sm text-amber-700 mt-1'>{ev.event_name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'lesson' && selectedLesson) {
    return (
      <div className='p-4 max-w-md mx-auto bg-amber-50 min-h-screen text-amber-950 font-sans'>
        <button className='mb-4 text-amber-800 font-bold' onClick={() => setView('home')}>← Quay lại</button>
        <h1 className='text-2xl font-bold mb-4 text-red-800'>{selectedLesson.title}</h1>
        <div className='p-5 bg-white rounded-lg shadow-sm mb-6'>
          <p className='whitespace-pre-wrap leading-relaxed text-gray-800'>{selectedLesson.content}</p>
        </div>
        <button 
          className='w-full bg-red-800 text-white px-4 py-3 rounded-lg font-bold text-lg shadow' 
          onClick={() => { 
            api.getQuestions(selectedLesson.id).then(qs => { 
              setQuestions(qs); setCurrentQ(0); setScore(0); setView('quiz'); 
            }); 
          }}
        >
          Làm Quiz Ôn Tập
        </button>
      </div>
    );
  }

  if (view === 'quiz' && questions.length > 0) {
    const q = questions[currentQ];
    return (
      <div className='p-4 max-w-md mx-auto bg-amber-50 min-h-screen text-amber-950 font-sans flex flex-col justify-center'>
        <h2 className='font-bold mb-6 text-red-800 text-xl text-center'>Câu {currentQ + 1} / {questions.length}</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <p className='text-xl font-medium leading-relaxed'>{q.question}</p>
        </div>
        <div className='space-y-3'>
          {['option_a', 'option_b', 'option_c', 'option_d'].map((opt) => {
            const ansChar = opt.split('_')[1].toUpperCase();
            return (
              <button 
                key={opt} 
                className='block w-full p-4 bg-white rounded-lg border-2 border-amber-100 text-left font-medium hover:bg-amber-100 transition-colors' 
                onClick={async () => {
                  let newScore = score;
                  if (ansChar === q.correct_answer) newScore += 1;
                  setScore(newScore);
                  
                  if (currentQ + 1 < questions.length) {
                    setCurrentQ(curr => curr + 1);
                  } else {
                    const result = await api.completeLesson(selectedLesson.id, user.id, newScore, questions.length);
                    setXpEarned(result.xpEarned);
                    // Update local progress
                    if (!progress.includes(selectedLesson.id)) {
                      setProgress([...progress, selectedLesson.id]);
                    }
                    setUser({...user, xp: user.xp + result.xpEarned});
                    setView('result');
                  }
                }}
              >
                <span className="font-bold text-red-800 mr-2">{ansChar}.</span> {q[opt]}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div className='p-4 max-w-md mx-auto bg-amber-50 min-h-screen text-amber-950 font-sans flex flex-col justify-center items-center text-center'>
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xs">
          <h2 className='text-3xl font-bold mb-2 text-red-800'>Hoàn Thành!</h2>
          <p className="text-gray-600 mb-6">Bạn đã hoàn thành bài học</p>
          
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <p className="text-lg">Trả lời đúng</p>
            <p className="text-3xl font-black text-red-800">{score}/{questions.length}</p>
          </div>
          
          <div className="mb-8">
            <p className="text-green-600 font-bold text-xl">+ {xpEarned} XP</p>
          </div>

          <button 
            className='w-full bg-red-800 text-white px-6 py-3 rounded-xl font-bold shadow-md' 
            onClick={() => setView('home')}
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return null;
}