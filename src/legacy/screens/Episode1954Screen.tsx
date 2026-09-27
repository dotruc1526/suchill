import { useState } from 'react'
import { type EpisodeStage, episodeQuestions, episodeVideoScenes } from '../models/episode'
import { getEpisodeProgress, isCorrectEpisodeAnswer, isFinalEpisodeQuestion } from '../controllers/episodeController'
import { EpisodeHeader, PrimaryButton, XPBadge } from '../components/episode/EpisodeChrome'
import HistoricalImage from '../components/episode/HistoricalImage'
import KnowledgeCard from '../components/episode/KnowledgeCard'
import EpisodeInteraction from '../components/episode/EpisodeInteraction'
import QuizOption from '../components/episode/QuizOption'
import FeedbackCard from '../components/episode/FeedbackCard'
import EpisodeReward from '../components/episode/EpisodeReward'

export default function Episode1954Screen({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<EpisodeStage>('intro')
  const [videoScene, setVideoScene] = useState(0)
  const [interactionIndex, setInteractionIndex] = useState(0)
  const [interactionCorrect, setInteractionCorrect] = useState<boolean | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const question = episodeQuestions[questionIndex]
  const isCorrect = selectedAnswer !== null && isCorrectEpisodeAnswer(questionIndex, selectedAnswer)
  const video = episodeVideoScenes[videoScene]

  const chooseAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    if (isCorrectEpisodeAnswer(questionIndex, index)) setScore(currentScore => currentScore + 1)
  }

  const nextQuestion = () => {
    if (isFinalEpisodeQuestion(questionIndex)) {
      setStage('reward')
      return
    }
    setQuestionIndex(index => index + 1)
    setSelectedAnswer(null)
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col overflow-hidden" style={{ background: '#F4E8D2' }}>
      <EpisodeHeader stage={stage} progress={getEpisodeProgress(stage)} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {stage === 'intro' && (
          <div className="pt-6 animate-bubble-in">
            <div className="font-sans text-[11px] font-bold tracking-[0.18em]" style={{ color: '#A84D3F' }}>CHƯƠNG 01</div>
            <div className="font-serif font-bold text-6xl leading-none mt-1" style={{ color: '#302820' }}>1954</div>
            <div className="font-hand text-base mt-3" style={{ color: '#69705C' }}>TẬP 01</div>
            <div className="font-serif font-bold text-xl leading-tight" style={{ color: '#35495B' }}>BỐI CẢNH TRƯỚC ĐIỆN BIÊN PHỦ</div>
            <HistoricalImage />
            <div className="flex items-center gap-3 mt-4">
              <XPBadge text="⏱ 4 phút" />
              <XPBadge text="⭐ +50 XP" />
            </div>
            <p className="font-sans text-sm leading-relaxed mt-4" style={{ color: '#4B4035' }}>
              Trước khi Điện Biên Phủ trở thành một trận chiến quyết định, tình hình chiến trường Đông Dương đã thay đổi rất nhiều.
            </p>
            <PrimaryButton onClick={() => setStage('video')}>BẮT ĐẦU TẬP</PrimaryButton>
          </div>
        )}

        {stage === 'video' && (
          <div className="pt-5 animate-bubble-in">
            <div className="font-serif font-bold text-xl" style={{ color: '#302820' }}>TẬP 01 · BỐI CẢNH</div>
            <div className="relative mt-4 aspect-video overflow-hidden rounded-xl" style={{ background: '#35495B', boxShadow: '3px 4px 0 rgba(48,40,32,0.14)' }}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#FFF9EC 1px, transparent 1px)', backgroundSize: '13px 13px' }} />
              <div className="absolute left-5 top-5 w-28 h-16 border-2 rounded-sm rotate-[-5deg]" style={{ borderColor: video.accent }} />
              <div className="absolute right-6 top-8 w-20 h-20 rounded-full border-[10px]" style={{ borderColor: `${video.accent}AA` }} />
              <div className="absolute left-7 bottom-9 font-serif text-2xl leading-tight" style={{ color: '#FFF9EC' }}>{video.title}</div>
              <div className="absolute left-7 right-16 bottom-4 font-sans text-xs leading-relaxed" style={{ color: 'rgba(255,249,236,0.82)' }}>{video.subtitle}</div>
              <div className="absolute right-4 bottom-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#A84D3F', color: '#FFF9EC' }}>{videoScene < 2 ? '▶' : '✓'}</div>
            </div>
            <div className="mt-4 rounded-lg px-4 py-3 font-sans text-sm leading-relaxed" style={{ background: '#FFF9EC', border: '1px solid rgba(48,40,32,0.14)', color: '#302820' }}>
              <span className="font-hand text-base mr-2" style={{ color: '#A84D3F' }}>{video.time}</span>
              {video.subtitle}
            </div>
            <div className="mt-4 flex gap-1.5">
              {episodeVideoScenes.map((scene, index) => <div key={scene.time} className="h-1.5 flex-1 rounded-full" style={{ background: index <= videoScene ? '#A84D3F' : '#D6C5AA' }} />)}
            </div>
            <div className="mt-3 font-hand text-sm" style={{ color: '#69705C' }}>Video 01 · 01:20 · phụ đề tiếng Việt</div>
            <PrimaryButton onClick={() => videoScene < episodeVideoScenes.length - 1 ? setVideoScene(index => index + 1) : setStage('knowledge')}>
              {videoScene < episodeVideoScenes.length - 1 ? 'XEM ĐOẠN TIẾP →' : 'CHỐT KIẾN THỨC →'}
            </PrimaryButton>
          </div>
        )}

        {stage === 'knowledge' && (
          <div className="pt-5 animate-bubble-in">
            <div className="font-serif font-bold text-2xl" style={{ color: '#302820' }}>📌 CHỐT KIẾN THỨC</div>
            <div className="font-sans text-sm mt-1" style={{ color: '#69705C' }}>Bạn chỉ cần nhớ 3 điều</div>
            <div className="mt-4 space-y-3">
              <KnowledgeCard number="01" title="Tình hình chiến trường">Cuộc kháng chiến chống Pháp bước vào giai đoạn quyết liệt, trong khi quân Pháp gặp nhiều khó khăn trên chiến trường.</KnowledgeCard>
              <KnowledgeCard number="02" title="Vị trí Điện Biên Phủ">Điện Biên Phủ nằm ở khu vực <strong>Tây Bắc</strong> và có vị trí chiến lược quan trọng.</KnowledgeCard>
              <KnowledgeCard number="03" title="Tập đoàn cứ điểm">Pháp xây dựng Điện Biên Phủ thành một <strong>tập đoàn cứ điểm</strong> mạnh để kiểm soát khu vực và tạo lợi thế quân sự.</KnowledgeCard>
            </div>
            <div className="font-hand text-sm mt-4 px-2" style={{ color: '#A84D3F' }}>“3 ý này sẽ xuất hiện lại ở phần tương tác.”</div>
            <PrimaryButton onClick={() => setStage('map')}>MÌNH ĐÃ HIỂU →</PrimaryButton>
          </div>
        )}

        {stage === 'map' && (
          <div className="pt-5 animate-bubble-in">
            <EpisodeInteraction
              index={interactionIndex}
              correct={interactionCorrect}
              onAnswer={isAnswerCorrect => setInteractionCorrect(isAnswerCorrect)}
            />
            {interactionCorrect !== null && <FeedbackCard correct={interactionCorrect}>{interactionCorrect ? <>✓ Chính xác. Bạn đã hoàn thành thử thách {interactionIndex + 1}/3. <strong>+10 XP</strong></> : <>Chưa chính xác. Hãy quan sát lại các ý vừa xem và thử lại.</>}</FeedbackCard>}
            {interactionCorrect === true && <PrimaryButton onClick={() => {
              if (interactionIndex === 2) {
                setStage('quiz')
              } else {
                setInteractionIndex(index => index + 1)
                setInteractionCorrect(null)
              }
            }}>{interactionIndex === 2 ? 'BẮT ĐẦU QUIZ →' : 'THỬ THÁCH TIẾP →'}</PrimaryButton>}
          </div>
        )}

        {stage === 'quiz' && (
          <div className="pt-5 animate-bubble-in">
            <div className="font-hand text-sm" style={{ color: '#A84D3F' }}>KIỂM TRA NHANH · CÂU {questionIndex + 1}/3</div>
            <div className="font-serif font-bold text-2xl leading-tight mt-2" style={{ color: '#302820' }}>{question.question}</div>
            <div className="mt-5 space-y-3">
              {question.options.map((option, index) => (
                <QuizOption
                  key={option}
                  index={index}
                  option={option}
                  selected={selectedAnswer}
                  correct={question.correct}
                  onClick={() => chooseAnswer(index)}
                />
              ))}
            </div>
            {selectedAnswer !== null && (
              <>
                <FeedbackCard correct={isCorrect}>{isCorrect ? <>Điện Biên Phủ thuộc khu vực Tây Bắc. <strong>+10 XP</strong></> : <>Chưa chính xác. {question.explanation}</>}</FeedbackCard>
                <PrimaryButton onClick={nextQuestion}>{questionIndex === 2 ? 'XEM PHẦN THƯỞNG →' : 'CÂU TIẾP THEO →'}</PrimaryButton>
              </>
            )}
          </div>
        )}

        {stage === 'reward' && <EpisodeReward score={score} onBack={onBack} />}
      </div>
    </div>
  )
}

