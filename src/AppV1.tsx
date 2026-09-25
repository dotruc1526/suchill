import { useState, useEffect } from 'react';import { api } from './services/apiV1';

export default function AppV1() {
  const [view, setView] = useState('home');
  const [events, setEvents] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    api.getLessons().then(data => setEvents(data));
  }, []);

  return (
    <div className='p-4 max-w-md mx-auto bg-amber-50 min-h-screen text-amber-950 font-sans'>
      {view==='home' && (
        <div>
          <h1 className='text-2xl font-bold mb-2 text-red-800'>Sử Chill</h1>
          <p className='mb-4'>Hôm nay bạn mốn khám phá gì?</p>
          <div className='space-y-2'>
            {events.map((ev: any) => (
              <div key={ev.id} className='p-4 bg-white rounded shadow cursor-pointer' onClick={() => { setSelectedLesson(ev); setView('lesson'); })>
                <h2 className='font-bold text-red-800'>{ev.title}</h2>
                <p className='text-sm text-amber-700'>{ev.event_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {view==='lesson' && selectedLesson && (
        <div>
          <h1 className='text-2xl font-bold mb-2 text-red-800'>{selectedLesson.title}</h1>
          <div className='p-4 bg-white rounded mb-4'?
            <p className='whitespace-pre-wrap'>{selectedLesson.content}</p>
          </div>
          <button className='bg-red-800 text-white px-4 py-2 rounded' onClick={() => { api.getQuestions(selectedLesson.id).then(qs => { setQuestions(qs); setCurrentQ(0); setScore(0); setView('quiz'); }); })>Làm Quiz</button>
          <button className='ml-4 text-amber-800' onClick={() => setView('home'))>Quay lại</button>
        </div>
      )}
      {view==='quiz' && questions.length > 0 && (
        <div>
          <h2 className='font-bold mb-4 text-red-800'>Câu {currentQ + 1}/{questions.length}</h2>
          <p className='text-xl mb-4'>{questions[currentQ].question}</p>
          <div className='space-y-2'>
            {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, ) => <button key={opt} className='block w-full p-3 bg-white rounded border text-left' onClick={() => {
                let ansChar = opt[��].toUpperCase();
                if(ansChar === questions[currentQ].correct_answer) setScore(s => s + 1);
                if(currentQ + 1 < questions.length) setCurrentQ(q => q + 1);
                else { api.completeLesson(selectedLesson.id); setView('result'); }
             }}>{ansChar}. {questions[currentQ][opt]}</button>))}
          </div>
        </div>
      )}
      {view==='result' && (
        <div className='text-center'>
          <h2 className='text-3xl font-bold mb-4 text-red-800'>H�àn Thành!</h2>
          <p>Bạn đã trả lời đúng <span className='font-bold text-red-800'>{score}/{questions.length}</span> câu.</p>
          <button className='div mt-4 bg-red-800 text-white px-4 py-2 rounded' onClick={() => setView('home'))>Về Trang Chủ</button>
        </div>
      )}
    </div>
  );
}