import { useState, useRef, useEffect } from 'react'
import Mascot, { type MascotEmotion } from './Mascot'
import brandLogo from './imports/su-chill-logo-transparent.png'
import {
  chapters, userStats, weekDays, weekDone, achievements,
  aiSuggestions, initialAIConversation,
  type Chapter, type Lesson, type AIMessage,
} from './data'

// ─── Types ──────────────────────────────────────────────────────────────────
type Tab = 'home' | 'practice' | 'ai' | 'profile'
type View =
  | { type: 'home' }
  | { type: 'chapter'; chapterId: number }
  | { type: 'lesson'; chapterId: number; lessonIdx: number }
  | { type: 'lesson-done'; chapterId: number; lessonIdx: number }
  | { type: 'quiz'; chapterId: number }
  | { type: 'quiz-result'; score: number; total: number; chapterId: number }

// ─── App Root ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [view, setView] = useState<View>({ type: 'home' })
  const [xp, setXP] = useState(userStats.xp)

  const goHome = () => setView({ type: 'home' })
  const goChapter = (id: number) => setView({ type: 'chapter', chapterId: id })
  const goLesson = (cid: number, idx: number) => setView({ type: 'lesson', chapterId: cid, lessonIdx: idx })
  const goQuiz = (cid: number) => setView({ type: 'quiz', chapterId: cid })

  const handleLessonDone = (cid: number, lidx: number) => {
    setXP(x => x + 10)
    setView({ type: 'lesson-done', chapterId: cid, lessonIdx: lidx })
  }
  const handleQuizDone = (score: number, total: number, cid: number) => {
    setXP(x => x + score * 10)
    setView({ type: 'quiz-result', score, total, chapterId: cid })
  }

  const isOverlay = view.type !== 'home'

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: '#C8A882' }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100dvh',
          maxHeight: 900,
          background: '#F5E6D0',
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Main content (tabs) ── */}
        <div className="flex flex-col flex-1 overflow-hidden z-10">
          {/* Top bar */}
          {!isOverlay && (
            <TopBar xp={xp} streak={userStats.streak} achievements={userStats.achievements} />
          )}

          {/* Tab content */}
          {!isOverlay && (
            <div className="flex-1 overflow-y-auto">
              {tab === 'home' && (
                <HomeScreen
                  onChapter={goChapter}
                  onLesson={(cid, idx) => goLesson(cid, idx)}
                />
              )}
              {tab === 'practice' && <PracticeScreen />}
              {tab === 'ai' && <AIScreen />}
              {tab === 'profile' && <ProfileScreen xp={xp} />}
            </div>
          )}

          {/* Bottom nav */}
          {!isOverlay && <BottomNav tab={tab} onTab={setTab} />}
        </div>

        {/* ── Overlay screens ── */}
        {view.type === 'chapter' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          return (
            <ChapterScreen
              chapter={ch}
              onBack={goHome}
              onLesson={idx => goLesson(ch.id, idx)}
              onQuiz={() => goQuiz(ch.id)}
            />
          )
        })()}

        {view.type === 'lesson' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          return (
            <LessonScreen
              chapter={ch}
              lessonIdx={view.lessonIdx}
              onBack={() => goChapter(view.chapterId)}
              onComplete={() => handleLessonDone(view.chapterId, view.lessonIdx)}
            />
          )
        })()}

        {view.type === 'lesson-done' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          const lesson = ch.lessons[view.lessonIdx]
          return (
            <LessonCompleteScreen
              lesson={lesson}
              onQuiz={() => goQuiz(view.chapterId)}
              onHome={() => goChapter(view.chapterId)}
            />
          )
        })()}

        {view.type === 'quiz' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          return (
            <QuizScreen
              chapter={ch}
              onBack={() => goChapter(view.chapterId)}
              onDone={(score, total) => handleQuizDone(score, total, view.chapterId)}
            />
          )
        })()}

        {view.type === 'quiz-result' && (
          <QuizResultScreen
            score={view.score}
            total={view.total}
            onHome={goHome}
            onRetry={() => goQuiz(view.chapterId)}
          />
        )}
      </div>
    </div>
  )
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────
function TopBar({ xp, streak, achievements }: { xp: number; streak: number; achievements: number }) {
  return (
    <div
      className="relative flex items-center justify-between px-4 py-2 shrink-0"
      style={{ borderBottom: '1.5px solid rgba(61,26,0,0.12)' }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base">🔥</span>
        <div>
          <div className="font-serif font-bold text-sm leading-none" style={{ color: '#C4341A' }}>{streak}</div>
          <div className="font-hand text-[10px] leading-none" style={{ color: '#7A4020' }}>NGÀY</div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5" aria-label="Sử Chill">
        <img
          src={brandLogo}
          alt="Logo Sử Chill"
          className="w-10 h-9 object-contain shrink-0"
        />
        <span
          className="font-serif font-bold text-base whitespace-nowrap"
          style={{ color: '#3D1A00', letterSpacing: '0.03em' }}
        >
          Sử chill
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-sm">⭐</span>
          <span className="font-sans font-bold text-xs" style={{ color: '#7A4020' }}>{xp}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">🏆</span>
          <span className="font-sans font-bold text-xs" style={{ color: '#7A4020' }}>{achievements}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: 'home', icon: '🏠', label: 'HỌC' },
    { key: 'practice', icon: '🧠', label: 'LUYỆN TẬP' },
    { key: 'ai', icon: '🤖', label: 'AI' },
    { key: 'profile', icon: '👤', label: 'HỒ SƠ' },
  ]

  return (
    <div
      className="shrink-0 flex items-end justify-around px-2 pb-2 pt-1"
      style={{
        borderTop: '1.5px solid rgba(61,26,0,0.15)',
        background: '#EDD9B8',
        minHeight: 60,
      }}
    >
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onTab(t.key)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all"
          style={{ minWidth: 48 }}
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <span
            className="font-sans font-bold leading-none"
            style={{
              fontSize: 9,
              color: tab === t.key ? '#8B1A1A' : '#A0622A',
            }}
          >
            {t.label}
          </span>
          {tab === t.key && (
            <div
              className="font-hand"
              style={{ color: '#8B1A1A', fontSize: 10, lineHeight: 1, marginTop: -2 }}
            >
              ~~~
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({
  onChapter, onLesson,
}: {
  onChapter: (id: number) => void
  onLesson: (cid: number, idx: number) => void
}) {
  const currentChapter = chapters.find(c => c.status === 'current' && c.lessons.some(l => l.status === 'current'))
    ?? chapters.find(c => c.status === 'current')!
  const currentLesson = currentChapter?.lessons.find(l => l.status === 'current')
  const currentLessonIdx = currentChapter?.lessons.findIndex(l => l.status === 'current') ?? 0

  return (
    <div className="pb-4 px-4 space-y-4">
      {/* Greeting */}
      <div className="pt-4">
        <div className="font-hand text-2xl" style={{ color: '#3D1A00' }}>XIN CHÀO 👋</div>
        <div className="font-sans text-sm mt-0.5" style={{ color: '#7A4020' }}>
          Hôm nay bạn muốn khám phá điều gì?
        </div>
      </div>

      {/* Streak card */}
      <div
        className="paper-card rounded-lg p-3 flex items-center gap-3"
        style={{ borderLeft: '4px solid #C4341A' }}
      >
        <span className="text-3xl">🔥</span>
        <div>
          <div className="font-serif font-bold text-base" style={{ color: '#C4341A' }}>
            {userStats.streak} NGÀY LIÊN TIẾP
          </div>
          <div className="font-sans text-xs" style={{ color: '#7A4020' }}>
            Bạn đã khám phá lịch sử {userStats.streak} ngày liên tiếp!
          </div>
        </div>
        <div className="ml-auto flex gap-1">
          {weekDays.map((d, i) => (
            <div key={d} className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-sm flex items-center justify-center text-xs"
                style={{
                  background: weekDone[i] ? '#8B1A1A' : '#E8D5BA',
                  color: weekDone[i] ? '#F5E6D0' : '#A0622A',
                  fontSize: weekDone[i] ? 10 : 8,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                }}
              >
                {weekDone[i] ? '✓' : d[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue card */}
      {currentChapter && currentLesson && (
        <div
          className="paper-card rounded-lg p-4"
          style={{ borderTop: '3px solid #8B1A1A' }}
        >
          <div className="font-hand text-xs mb-1" style={{ color: '#A0622A' }}>
            → TIẾP TỤC HÀNH TRÌNH
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>
                {currentLesson.title}
              </div>
              <div className="font-sans text-xs mt-0.5" style={{ color: '#7A4020' }}>
                Chương {currentChapter.id} · {currentChapter.year} · ⏱ {currentLesson.duration} phút
              </div>
              <button
                onClick={() => onLesson(currentChapter.id, currentLessonIdx)}
                className="mt-3 px-5 py-2 font-sans font-bold text-sm rounded-sm transition-transform active:scale-95"
                style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.05em' }}
              >
                TIẾP TỤC HỌC ›
              </button>
            </div>
            <Mascot emotion="excited" size={72} animate />
          </div>
        </div>
      )}

      {/* Daily goal */}
      <div className="paper-card rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="font-serif font-semibold text-sm" style={{ color: '#3D1A00' }}>MỤC TIÊU HÔM NAY</div>
          <div className="font-hand text-sm" style={{ color: '#A0622A' }}>6 / 10 phút</div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
          <div className="h-full rounded-full transition-all" style={{ width: '60%', background: '#8B1A1A' }} />
        </div>
        <div className="font-hand text-xs mt-1" style={{ color: '#A0622A' }}>Còn 4 phút nữa để hoàn thành!</div>
      </div>

      {/* Chapter journey */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>HÀNH TRÌNH LỊCH SỬ</div>
          <div className="flex-1 h-px" style={{ background: 'rgba(61,26,0,0.15)' }} />
        </div>

        <JourneyMap chapters={chapters} onChapter={onChapter} />
      </div>
    </div>
  )
}

// ─── Journey Map ─────────────────────────────────────────────────────────────
function JourneyMap({ chapters, onChapter }: { chapters: Chapter[]; onChapter: (id: number) => void }) {
  const nodePositions = [
    { left: '24%', top: 58, labelSide: 'right' },
    { left: '72%', top: 138, labelSide: 'left' },
    { left: '29%', top: 224, labelSide: 'right' },
    { left: '69%', top: 310, labelSide: 'left' },
    { left: '43%', top: 396, labelSide: 'right' },
  ] as const

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        height: 470,
        background: 'linear-gradient(180deg, #F5E6C8 0%, #D9B47B 47%, #8B2421 100%)',
        border: '2px solid rgba(78,27,16,0.35)',
        boxShadow: 'inset 0 0 0 3px rgba(255,248,224,0.36)',
      }}
    >
      <div className="absolute -top-8 -left-10 w-40 h-24 rounded-[50%]" style={{ background: '#6A2A1E' }} />
      <div className="absolute -top-3 -right-8 w-36 h-20 rounded-[50%]" style={{ background: '#7C3324' }} />
      <div className="absolute bottom-0 -left-8 w-52 h-20 rounded-[50%]" style={{ background: '#67251D' }} />
      <div className="absolute bottom-2 -right-12 w-44 h-24 rounded-[50%]" style={{ background: '#772D22' }} />

      <div className="absolute top-5 left-5 text-2xl">🏯</div>
      <div className="absolute top-9 right-6 text-xl">✦</div>
      <div className="absolute top-[185px] right-4 text-lg">⚔</div>
      <div className="absolute top-[270px] left-5 text-lg">✦</div>
      <div className="absolute bottom-10 right-8 text-xl">⚜</div>
      <div className="absolute top-[28%] left-[45%] w-2 h-2 rounded-full" style={{ background: '#A53528' }} />
      <div className="absolute top-[58%] right-[32%] w-2.5 h-2.5 rounded-full" style={{ background: '#E4B653' }} />
      <div className="absolute top-[74%] left-[18%] w-2 h-2 rounded-full" style={{ background: '#F0D79B' }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 470" fill="none" aria-hidden="true">
        <path
          d="M88 58 C92 88 275 95 260 138 C245 180 106 177 105 224 C104 267 262 265 248 310 C234 352 165 356 155 396"
          stroke="#F9EBD0"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M88 58 C92 88 275 95 260 138 C245 180 106 177 105 224 C104 267 262 265 248 310 C234 352 165 356 155 396"
          stroke="#B8782E"
          strokeWidth="5"
          strokeDasharray="7 7"
          strokeLinecap="round"
        />
      </svg>

      {chapters.slice(0, nodePositions.length).map((chapter, index) => {
        const position = nodePositions[index]
        const isLocked = chapter.status === 'locked'
        const isCurrent = chapter.status === 'current'
        const nodeColor = isLocked ? '#8B6347' : isCurrent ? '#B52B25' : '#264B5B'

        return (
          <div
            key={chapter.id}
            className="absolute -translate-x-1/2"
            style={{ left: position.left, top: position.top }}
          >
            <button
              onClick={isLocked ? undefined : () => onChapter(chapter.id)}
              disabled={isLocked}
              aria-label={`Chương ${chapter.id}: ${chapter.year}`}
              className="relative z-10 w-[62px] h-[62px] rounded-full flex flex-col items-center justify-center transition-transform active:scale-95 disabled:cursor-not-allowed"
              style={{
                background: nodeColor,
                color: '#FFF4D8',
                border: '4px solid #F9EBD0',
                boxShadow: `0 4px 0 ${isLocked ? '#5D3C2A' : isCurrent ? '#731A17' : '#183441'}, 0 7px 12px rgba(53,20,10,0.3)`,
              }}
            >
              <span className="font-serif font-black text-sm leading-none">{chapter.year}</span>
              {isLocked ? (
                <span className="text-xs mt-0.5">🔒</span>
              ) : isCurrent ? (
                <span className="font-sans font-bold text-[8px] mt-0.5">ĐANG HỌC</span>
              ) : (
                <span className="text-xs mt-0.5">✓</span>
              )}
            </button>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-24"
              style={{
                left: position.labelSide === 'right' ? 72 : undefined,
                right: position.labelSide === 'left' ? 72 : undefined,
                textAlign: position.labelSide === 'right' ? 'left' : 'right',
              }}
            >
              <div className="font-serif font-bold text-[11px] leading-tight" style={{ color: '#3D1A00' }}>
                {chapter.title}
              </div>
              <div className="font-hand text-[11px] leading-tight" style={{ color: '#6D2A1D' }}>
                Chương {String(chapter.id).padStart(2, '0')}
              </div>
            </div>
          </div>
        )
      })}

      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-hand text-sm whitespace-nowrap"
        style={{ background: '#F7E1B2', color: '#6E251B', border: '1px solid rgba(93,38,22,0.28)' }}
      >
        Hành trình khám phá lịch sử
      </div>
    </div>
  )
}

// ─── Chapter Screen ───────────────────────────────────────────────────────────
function ChapterScreen({
  chapter, onBack, onLesson, onQuiz,
}: {
  chapter: Chapter
  onBack: () => void
  onLesson: (idx: number) => void
  onQuiz: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{ background: '#F5E6D0' }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-6 shrink-0"
        style={{ background: '#8B1A1A' }}
      >
        <button
          onClick={onBack}
          className="font-sans text-xs mb-4 flex items-center gap-1"
          style={{ color: 'rgba(245,230,208,0.8)' }}
        >
          ‹ QUAY LẠI
        </button>
        <div className="font-hand text-sm" style={{ color: 'rgba(245,230,208,0.7)' }}>
          CHƯƠNG {String(chapter.id).padStart(2, '0')}
        </div>
        <div className="font-serif font-bold text-4xl" style={{ color: '#FBF4E8' }}>{chapter.year}</div>
        <div className="font-serif italic text-lg" style={{ color: 'rgba(251,244,232,0.85)' }}>
          "{chapter.title}"
        </div>
        <div className="font-sans text-xs mt-2 leading-relaxed" style={{ color: 'rgba(245,230,208,0.8)' }}>
          {chapter.description}
        </div>
        {/* Progress bar */}
        {chapter.progress > 0 && (
          <div className="mt-3">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${chapter.progress * 100}%`, background: '#F5E6D0' }}
              />
            </div>
            <div className="font-hand text-xs mt-1" style={{ color: 'rgba(245,230,208,0.7)' }}>
              {Math.round(chapter.progress * 100)}% hoàn thành
            </div>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="font-serif font-semibold text-sm mb-4" style={{ color: '#3D1A00' }}>
          LỘ TRÌNH HỌC TẬP
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 top-4 bottom-4 w-px"
            style={{ background: 'rgba(61,26,0,0.15)' }}
          />

          <div className="space-y-3">
            {chapter.lessons.map((lesson, idx) => {
              const isLocked = lesson.status === 'locked'
              const isCurrent = lesson.status === 'current'
              const isDone = lesson.status === 'completed'

              return (
                <div key={lesson.id} className="flex items-start gap-4">
                  {/* Node */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-sans font-bold text-xs border-2"
                    style={{
                      background: isDone ? '#3A5A2A' : isCurrent ? '#8B1A1A' : '#E8D5BA',
                      color: isDone ? '#fff' : isCurrent ? '#fff' : '#A0622A',
                      borderColor: isDone ? '#3A5A2A' : isCurrent ? '#8B1A1A' : '#D4B896',
                    }}
                  >
                    {isDone ? '✓' : isLocked ? '🔒' : String(idx + 1).padStart(2, '0')}
                  </div>

                  {/* Card */}
                  <button
                    onClick={isLocked ? undefined : () => onLesson(idx)}
                    disabled={isLocked}
                    className="flex-1 paper-card rounded-lg p-3 text-left transition-transform active:scale-[0.98]"
                    style={{ opacity: isLocked ? 0.5 : 1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-sans font-bold text-xs" style={{ color: '#3D1A00' }}>
                          {lesson.title}
                        </div>
                        <div className="font-hand text-xs mt-0.5" style={{ color: '#A0622A' }}>
                          ⏱ {lesson.duration} phút
                        </div>
                      </div>
                      {isCurrent && (
                        <div
                          className="font-hand text-xs px-2 py-0.5 rounded-sm"
                          style={{ background: '#8B1A1A', color: '#F5E6D0' }}
                        >
                          Đang học
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              )
            })}

            {/* Quiz node */}
            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-sans font-bold text-base border-2"
                style={{
                  background: chapter.progress >= 1 ? '#8B1A1A' : '#E8D5BA',
                  color: chapter.progress >= 1 ? '#fff' : '#A0622A',
                  borderColor: chapter.progress >= 1 ? '#8B1A1A' : '#D4B896',
                }}
              >
                {chapter.quiz.length > 0 ? '🧠' : '🔒'}
              </div>
              <button
                onClick={chapter.quiz.length > 0 ? onQuiz : undefined}
                disabled={chapter.quiz.length === 0}
                className="flex-1 paper-card rounded-lg p-3 text-left"
                style={{ opacity: chapter.quiz.length === 0 ? 0.4 : 1 }}
              >
                <div className="font-sans font-bold text-xs" style={{ color: '#3D1A00' }}>
                  THỬ THÁCH CHƯƠNG
                </div>
                <div className="font-hand text-xs mt-0.5" style={{ color: '#A0622A' }}>
                  {chapter.quiz.length} câu hỏi · ⏱ 5 phút
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Lesson Screen ────────────────────────────────────────────────────────────
function LessonScreen({
  chapter, lessonIdx, onBack, onComplete,
}: {
  chapter: Chapter
  lessonIdx: number
  onBack: () => void
  onComplete: () => void
}) {
  const lesson = chapter.lessons[lessonIdx]
  const [step, setStep] = useState(0)
  const totalSteps = lesson.story.length + 1 // story steps + key points
  const isStory = step < lesson.story.length
  const isKeyPoints = step === lesson.story.length

  const storyStep = isStory ? lesson.story[step] : null
  const [key, setKey] = useState(0)

  const advance = () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1)
      setKey(k => k + 1)
    } else {
      onComplete()
    }
  }

  const progress = step / (totalSteps - 1)

  // If no story data, go to complete
  if (lesson.story.length === 0) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ background: '#F5E6D0' }}>
        <Mascot emotion="sorry" size={120} />
        <div className="font-hand text-lg mt-4" style={{ color: '#7A4020' }}>Bài học đang được cập nhật...</div>
        <button onClick={onBack} className="mt-6 px-6 py-2 rounded-sm font-sans font-bold text-sm" style={{ background: '#8B1A1A', color: '#F5E6D0' }}>
          QUAY LẠI
        </button>
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col"
      style={{ background: '#F5E6D0' }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0">
        <button onClick={onBack} className="font-sans text-sm font-bold" style={{ color: '#7A4020' }}>✕</button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: '#8B1A1A' }}
          />
        </div>
        <div className="font-hand text-xs" style={{ color: '#A0622A' }}>
          {step + 1} / {totalSteps}
        </div>
      </div>

      {/* Chapter label */}
      <div className="px-4 shrink-0">
        <div className="font-serif font-bold text-xs tracking-widest" style={{ color: '#8B1A1A' }}>
          {chapter.year} · {lesson.title}
        </div>
      </div>

      {/* Story content area */}
      {isStory && storyStep && (
        <div key={key} className="flex-1 flex flex-col px-4 pt-3 overflow-hidden animate-bubble-in">
          {/* Highlight / fact card */}
          {(storyStep.highlight || storyStep.fact) && (
            <div
              className="paper-card rounded-lg p-3 mb-3 shrink-0"
              style={{ borderLeft: '4px solid #8B1A1A' }}
            >
              {storyStep.highlight && (
                <div>
                  <div className="font-hand text-xs" style={{ color: '#A0622A' }}>📌 SỰ KIỆN QUAN TRỌNG</div>
                  <div className="font-serif font-bold text-base mt-1" style={{ color: '#8B1A1A' }}>
                    {storyStep.highlight}
                  </div>
                </div>
              )}
              {storyStep.fact && (
                <div className="flex justify-between items-center">
                  <div className="font-hand text-xs" style={{ color: '#A0622A' }}>{storyStep.fact.label}</div>
                  <div className="font-serif font-bold text-sm" style={{ color: '#3D1A00' }}>{storyStep.fact.value}</div>
                </div>
              )}
            </div>
          )}

          {/* Historical image placeholder */}
          <div
            className="rounded-lg flex-1 min-h-0 flex items-center justify-center relative overflow-hidden mb-3"
            style={{ background: '#D4B896', maxHeight: 180 }}
          >
            <img
              src={`https://images.unsplash.com/photo-${chapter.unsplashId}?w=600&h=300&fit=crop&auto=format`}
              alt="Hình ảnh lịch sử"
              className="w-full h-full object-cover"
              style={{ filter: 'sepia(0.35) contrast(0.9) brightness(0.95)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(61,26,0,0.3))' }}
            />
            <div
              className="absolute bottom-2 right-2 font-hand text-xs px-2 py-0.5 rounded-sm"
              style={{ background: 'rgba(61,26,0,0.6)', color: '#F5E6D0' }}
            >
              HÌNH ẢNH MINH HỌA
            </div>
          </div>

          {/* Mascot dialogue */}
          <div className="flex items-end gap-3 shrink-0">
            <Mascot emotion={storyStep.emotion} size={88} animate />
            <div
              className="flex-1 rounded-2xl rounded-bl-none p-4"
              style={{
                background: '#FBF4E8',
                border: '1.5px solid rgba(61,26,0,0.2)',
                boxShadow: '2px 3px 0 rgba(61,26,0,0.07)',
              }}
            >
              {/* Mascot name tag */}
              <div className="font-hand text-xs mb-1.5" style={{ color: '#8B1A1A', fontWeight: 700 }}>
                Sử Chill
              </div>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#3D1A00' }}>
                {storyStep.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key points */}
      {isKeyPoints && (
        <div key="keypoints" className="flex-1 flex flex-col px-4 pt-3 overflow-hidden animate-bubble-in">
          <div
            className="paper-card rounded-lg p-4 mb-3"
            style={{ borderTop: '3px solid #3A5A2A' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📋</span>
              <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>ĐIỀU CẦN NHỚ</div>
            </div>
            <div className="space-y-2">
              {lesson.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-serif font-bold text-sm shrink-0" style={{ color: '#3A5A2A' }}>✓</span>
                  <span className="font-sans text-sm leading-relaxed" style={{ color: '#3D1A00' }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-3 flex-1 items-start pt-2">
            <Mascot emotion="happy" size={88} animate />
            <div
              className="flex-1 rounded-2xl rounded-bl-none p-4"
              style={{ background: '#FBF4E8', border: '1.5px solid rgba(61,26,0,0.2)' }}
            >
              <div className="font-hand text-xs mb-1.5" style={{ color: '#8B1A1A', fontWeight: 700 }}>Sử Chill</div>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#3D1A00' }}>
                Bạn đã hoàn thành bài học! Hãy nhớ những điểm quan trọng này nhé. Bây giờ mình sẽ kiểm tra xem bạn nhớ được bao nhiêu! 🎉
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation button */}
      <div className="px-4 pb-6 pt-3 shrink-0">
        <button
          onClick={advance}
          className="w-full py-3.5 font-sans font-bold text-sm rounded-sm transition-transform active:scale-[0.97]"
          style={{
            background: '#8B1A1A',
            color: '#F5E6D0',
            letterSpacing: '0.1em',
          }}
        >
          {isKeyPoints ? 'LÀM QUIZ ›' : 'TIẾP THEO ›'}
        </button>
        {!isKeyPoints && (
          <button
            onClick={onBack}
            className="w-full pt-2 font-sans text-xs text-center"
            style={{ color: '#A0622A' }}
          >
            ‹ Quay lại
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Lesson Complete Screen ───────────────────────────────────────────────────
function LessonCompleteScreen({
  lesson, onQuiz, onHome,
}: {
  lesson: Lesson
  onQuiz: () => void
  onHome: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
      style={{ background: '#F5E6D0' }}
    >
      <div className="animate-stamp-in">
        <Mascot emotion="excited" size={140} animate />
      </div>
      <div className="font-serif font-bold text-2xl mt-4 text-center" style={{ color: '#3D1A00' }}>
        BÀI HỌC HOÀN THÀNH!
      </div>
      <div
        className="font-hand text-lg mt-1"
        style={{ color: '#3A5A2A' }}
      >
        +10 XP ⭐
      </div>
      <div className="font-sans text-sm text-center mt-2 leading-relaxed" style={{ color: '#7A4020' }}>
        "{lesson.title}" — bạn đã hiểu rõ hơn về lịch sử!
      </div>

      <div className="w-full mt-8 space-y-3">
        <button
          onClick={onQuiz}
          className="w-full py-3.5 rounded-sm font-sans font-bold text-sm"
          style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.1em' }}
        >
          LÀM QUIZ NGAY ›
        </button>
        <button
          onClick={onHome}
          className="w-full py-3 rounded-sm font-sans text-sm"
          style={{
            background: 'transparent',
            color: '#7A4020',
            border: '1.5px solid rgba(61,26,0,0.2)',
          }}
        >
          Quay lại chương
        </button>
      </div>
    </div>
  )
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────
function QuizScreen({
  chapter, onBack, onDone,
}: {
  chapter: Chapter
  onBack: () => void
  onDone: (score: number, total: number) => void
}) {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const q = chapter.quiz[qIdx]
  const total = chapter.quiz.length
  const isCorrect = selected === q.correct

  const handleSelect = (i: number) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    if (i === q.correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (qIdx < total - 1) {
      setQIdx(i => i + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      onDone(score + (isCorrect ? 0 : 0), total)
    }
  }

  const mascotEmotion: MascotEmotion = revealed ? (isCorrect ? 'excited' : 'sorry') : 'thinking'

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col"
      style={{ background: '#F5E6D0' }}
    >
      {/* Top */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0">
        <button onClick={onBack} className="font-sans text-sm font-bold" style={{ color: '#7A4020' }}>✕</button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((qIdx) / total) * 100}%`, background: '#8B1A1A' }}
          />
        </div>
        <div className="font-hand text-xs" style={{ color: '#A0622A' }}>
          CÂU {qIdx + 1} / {total}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 overflow-hidden">
        {/* Question */}
        <div
          className="paper-card rounded-lg p-4 mb-4 shrink-0"
          style={{ borderTop: '3px solid #8B1A1A' }}
        >
          <div className="font-hand text-xs mb-1" style={{ color: '#A0622A' }}>
            🧠 CÂU HỎI
          </div>
          <div className="font-serif font-bold text-base leading-snug" style={{ color: '#3D1A00' }}>
            {q.question}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5 shrink-0">
          {q.options.map((opt, i) => {
            let bg = '#FBF4E8'
            let border = 'rgba(61,26,0,0.2)'
            let textColor = '#3D1A00'

            if (revealed) {
              if (i === q.correct) { bg = '#E8F5E2'; border = '#3A5A2A'; textColor = '#3A5A2A' }
              else if (i === selected) { bg = '#FDE8E4'; border = '#C4341A'; textColor = '#C4341A' }
            } else if (selected === i) {
              bg = '#EDD9B8'; border = '#8B1A1A'
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="w-full text-left p-3.5 rounded-sm transition-all active:scale-[0.98]"
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  boxShadow: '1px 2px 0 rgba(61,26,0,0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-sm flex items-center justify-center font-sans font-bold text-xs shrink-0"
                    style={{
                      background: revealed && i === q.correct ? '#3A5A2A' : revealed && i === selected ? '#C4341A' : '#E8D5BA',
                      color: revealed && (i === q.correct || i === selected) ? 'white' : '#7A4020',
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-sans text-sm font-medium" style={{ color: textColor }}>{opt}</span>
                  {revealed && i === q.correct && <span className="ml-auto text-base">✓</span>}
                  {revealed && i === selected && i !== q.correct && <span className="ml-auto text-base">✗</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {revealed && (
          <div
            className="mt-4 flex items-start gap-3 paper-card rounded-lg p-3 animate-bubble-in shrink-0"
            style={{ borderLeft: `4px solid ${isCorrect ? '#3A5A2A' : '#C4341A'}` }}
          >
            <Mascot emotion={mascotEmotion} size={64} />
            <div className="flex-1">
              <div
                className="font-serif font-bold text-sm"
                style={{ color: isCorrect ? '#3A5A2A' : '#C4341A' }}
              >
                {isCorrect ? '✓ CHÍNH XÁC!' : '✗ CHƯA ĐÚNG'}
              </div>
              {!isCorrect && (
                <div className="font-sans text-xs mt-0.5" style={{ color: '#5A3010' }}>
                  Đáp án đúng: <strong>{q.options[q.correct]}</strong>
                </div>
              )}
              <div className="font-sans text-xs mt-1.5 leading-relaxed" style={{ color: '#5A3010' }}>
                {q.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next button */}
      {revealed && (
        <div className="px-4 pb-6 pt-3 shrink-0">
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-sm font-sans font-bold text-sm"
            style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.1em' }}
          >
            {qIdx < total - 1 ? 'CÂU TIẾP THEO ›' : 'XEM KẾT QUẢ ›'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Quiz Result ──────────────────────────────────────────────────────────────
function QuizResultScreen({
  score, total, onHome, onRetry,
}: {
  score: number; total: number; onHome: () => void; onRetry: () => void
}) {
  const pct = score / total
  const emotion: MascotEmotion = pct >= 0.8 ? 'excited' : pct >= 0.5 ? 'happy' : 'worried'
  const label = pct >= 0.8 ? 'RẤT TỐT! 🎉' : pct >= 0.5 ? 'KHÁ TỐT!' : 'CỐ THÊM NHÉ!'

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
      style={{ background: '#F5E6D0' }}
    >
      <Mascot emotion={emotion} size={130} animate className="animate-stamp-in" />

      <div
        className="mt-5 font-sans font-bold text-5xl"
        style={{ color: '#3D1A00', fontFamily: 'var(--font-serif)' }}
      >
        {score}<span className="text-2xl opacity-50">/{total}</span>
      </div>
      <div className="font-serif font-bold text-xl mt-1" style={{ color: '#8B1A1A' }}>{label}</div>

      <div className="font-sans text-xs mt-1" style={{ color: '#A0622A' }}>
        +{score * 10} XP ⭐
      </div>

      {pct < 1 && (
        <div
          className="paper-card rounded-lg p-3 mt-5 w-full flex items-start gap-3"
        >
          <Mascot emotion="idea" size={52} />
          <div>
            <div className="font-hand text-sm font-bold" style={{ color: '#8B1A1A' }}>Sử Chill nhận xét</div>
            <div className="font-sans text-xs mt-0.5 leading-relaxed" style={{ color: '#5A3010' }}>
              {pct >= 0.8
                ? 'Bạn nắm rất tốt kiến thức về giai đoạn lịch sử này! Tiếp tục phát huy nhé!'
                : pct >= 0.5
                ? 'Bạn nhớ khá tốt, nhưng hãy ôn thêm phần diễn biến để hiểu sâu hơn.'
                : 'Đừng nản nhé! Hãy ôn lại bài học và thử lại. Mình tin bạn làm được!'}
            </div>
          </div>
        </div>
      )}

      <div className="w-full mt-6 space-y-3">
        <button
          onClick={onHome}
          className="w-full py-3.5 rounded-sm font-sans font-bold text-sm"
          style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.1em' }}
        >
          TIẾP TỤC HÀNH TRÌNH ›
        </button>
        <button
          onClick={onRetry}
          className="w-full py-3 rounded-sm font-sans text-sm"
          style={{ border: '1.5px solid rgba(61,26,0,0.2)', color: '#7A4020' }}
        >
          Làm lại quiz
        </button>
      </div>
    </div>
  )
}

// ─── Practice Screen ──────────────────────────────────────────────────────────
function PracticeScreen() {
  const periods = [
    { year: '1954', items: ['Bối cảnh', 'Diễn biến', 'Ý nghĩa'], progress: [0.9, 0.6, 0.4] },
    { year: '1965', items: ['Bối cảnh', 'Nguyên nhân', 'Kết quả'], progress: [0.7, 0.4, 0.0] },
  ]

  return (
    <div className="px-4 pb-4">
      <div className="pt-4 pb-3">
        <div className="font-serif font-bold text-xl" style={{ color: '#3D1A00' }}>LUYỆN TẬP</div>
        <div className="font-sans text-xs mt-0.5" style={{ color: '#7A4020' }}>Ôn lại những gì bạn đã học</div>
      </div>

      {/* Smart review */}
      <div
        className="paper-card rounded-lg p-4 mb-4"
        style={{ borderLeft: '4px solid #1E2D5A' }}
      >
        <div className="flex items-start gap-3">
          <Mascot emotion="idea" size={64} />
          <div className="flex-1">
            <div className="font-serif font-bold text-sm" style={{ color: '#1E2D5A' }}>ÔN TẬP THÔNG MINH</div>
            <div className="font-sans text-xs mt-1 leading-relaxed" style={{ color: '#5A3010' }}>
              Bạn đang gặp khó khăn ở phần <strong>DIỄN BIẾN</strong> và <strong>Ý NGHĨA</strong>.
            </div>
            <button
              className="mt-2 px-3 py-1.5 font-sans font-bold text-xs rounded-sm"
              style={{ background: '#1E2D5A', color: '#F5E6D0' }}
            >
              ÔN NGAY (3 phút) ›
            </button>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="font-hand text-sm mb-3" style={{ color: '#A0622A' }}>Chọn giai đoạn để luyện tập:</div>

      {periods.map(p => (
        <div key={p.year} className="paper-card rounded-lg p-4 mb-3">
          <div className="font-serif font-bold text-2xl mb-3" style={{ color: '#8B1A1A' }}>{p.year}</div>
          <div className="space-y-2.5">
            {p.items.map((item, i) => (
              <div key={item}>
                <div className="flex justify-between mb-1">
                  <div className="font-sans text-xs" style={{ color: '#3D1A00' }}>{item}</div>
                  <div className="font-hand text-xs" style={{ color: '#A0622A' }}>
                    {Math.round(p.progress[i] * 100)}%
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.progress[i] * 100}%`,
                      background: p.progress[i] > 0.7 ? '#3A5A2A' : p.progress[i] > 0.4 ? '#8B1A1A' : '#C4341A',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-3 w-full py-2 font-sans font-bold text-xs rounded-sm"
            style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.08em' }}
          >
            LUYỆN TẬP ›
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── AI Screen ────────────────────────────────────────────────────────────────
function AIScreen() {
  const [messages, setMessages] = useState<AIMessage[]>(initialAIConversation)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' })
  }, [messages])

  const aiResponses: Record<string, string> = {
    '1954': 'Năm 1954 là bước ngoặt khi Chiến thắng Điện Biên Phủ (7/5/1954) buộc Pháp ký Hiệp định Genève, chấm dứt chiến tranh và tạm thời chia đôi Việt Nam tại vĩ tuyến 17.',
    'điện biên phủ': 'Chiến dịch Điện Biên Phủ (13/3–7/5/1954) do Đại tướng Võ Nguyên Giáp chỉ huy. Sau 56 ngày đêm chiến đấu, ta tiêu diệt hoàn toàn tập đoàn cứ điểm của Pháp — chiến thắng quân sự vĩ đại nhất thế kỷ XX!',
    'võ nguyên giáp': 'Đại tướng Võ Nguyên Giáp (1911–2013) là Tổng Tư lệnh Quân đội Nhân dân Việt Nam. Ông được coi là một trong những thiên tài quân sự lớn nhất thế kỷ XX, nổi tiếng với nghệ thuật chiến tranh nhân dân.',
    'genève': 'Hiệp định Genève ký ngày 21/7/1954 gồm các điểm chính: đình chỉ chiến sự, lập vĩ tuyến 17 làm ranh giới tạm thời, và tổ chức tổng tuyển cử thống nhất vào năm 1956.',
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: AIMessage = { role: 'user', text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setThinking(true)

    setTimeout(() => {
      const key = Object.keys(aiResponses).find(k => text.toLowerCase().includes(k))
      const reply = key
        ? aiResponses[key]
        : 'Đây là một câu hỏi thú vị! Mình đang tìm kiếm trong nguồn tư liệu lịch sử. Bạn có thể hỏi cụ thể hơn về một sự kiện, nhân vật hay giai đoạn lịch sử không? 📚'
      setMessages(m => [...m, { role: 'ai', text: reply }])
      setThinking(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <Mascot emotion="happy" size={48} />
          <div>
            <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>NGƯỜI DẪN CHUYỆN</div>
            <div className="font-sans text-xs" style={{ color: '#7A4020' }}>Hỏi mình bất cứ điều gì về lịch sử Việt Nam</div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-4 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {aiSuggestions.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="shrink-0 px-3 py-1.5 rounded-full font-sans text-xs whitespace-nowrap"
              style={{
                border: '1.5px solid rgba(61,26,0,0.25)',
                background: '#FBF4E8',
                color: '#5A3010',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && <Mascot emotion="happy" size={40} className="shrink-0" />}
            <div
              className="max-w-[78%] rounded-2xl px-4 py-3 font-sans text-sm leading-relaxed"
              style={{
                background: msg.role === 'ai' ? '#FBF4E8' : '#8B1A1A',
                color: msg.role === 'ai' ? '#3D1A00' : '#F5E6D0',
                border: msg.role === 'ai' ? '1.5px solid rgba(61,26,0,0.15)' : 'none',
                borderRadius: msg.role === 'ai' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-end gap-2">
            <Mascot emotion="thinking" size={40} animate />
            <div
              className="px-4 py-3 rounded-2xl font-sans text-sm"
              style={{
                background: '#FBF4E8',
                border: '1.5px solid rgba(61,26,0,0.15)',
                borderRadius: '18px 18px 18px 4px',
                color: '#A0622A',
              }}
            >
              Đang tra cứu tư liệu...
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 shrink-0">
        <div className="font-hand text-xs text-center" style={{ color: '#A0622A' }}>
          Thông tin dựa trên nguồn tư liệu lịch sử đã kiểm chứng
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 pb-4 pt-2 shrink-0 flex items-center gap-2"
        style={{ borderTop: '1.5px solid rgba(61,26,0,0.12)' }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Hỏi về lịch sử Việt Nam..."
          className="flex-1 px-4 py-2.5 rounded-full font-sans text-sm outline-none"
          style={{
            background: '#FBF4E8',
            border: '1.5px solid rgba(61,26,0,0.2)',
            color: '#3D1A00',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#8B1A1A' }}
        >
          <span className="text-sm" style={{ color: '#F5E6D0' }}>›</span>
        </button>
      </div>
    </div>
  )
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({ xp }: { xp: number }) {
  return (
    <div className="px-4 pb-6">
      {/* Header */}
      <div
        className="rounded-b-2xl -mx-4 px-6 pt-4 pb-6 mb-4"
        style={{ background: '#8B1A1A' }}
      >
        <div className="font-serif font-bold text-base mb-3" style={{ color: 'rgba(245,230,208,0.8)' }}>
          CUỐN SỔ HÀNH TRÌNH
        </div>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-sm overflow-hidden flex items-center justify-center"
            style={{ border: '3px solid rgba(245,230,208,0.5)', background: '#6B1010' }}
          >
            <Mascot emotion="happy" size={72} />
          </div>
          <div>
            <div className="font-serif font-bold text-lg" style={{ color: '#FBF4E8' }}>
              {userStats.name}
            </div>
            <div className="flex gap-3 mt-1">
              <div className="text-center">
                <div className="font-serif font-bold text-lg leading-none" style={{ color: '#FBF4E8' }}>🔥 {userStats.streak}</div>
                <div className="font-hand text-xs" style={{ color: 'rgba(245,230,208,0.7)' }}>ngày</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-lg leading-none" style={{ color: '#FBF4E8' }}>⭐ {xp}</div>
                <div className="font-hand text-xs" style={{ color: 'rgba(245,230,208,0.7)' }}>XP</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-lg leading-none" style={{ color: '#FBF4E8' }}>🏆 {userStats.achievements}</div>
                <div className="font-hand text-xs" style={{ color: 'rgba(245,230,208,0.7)' }}>danh hiệu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey progress */}
      <div className="mb-4">
        <div className="font-serif font-bold text-sm mb-3" style={{ color: '#3D1A00' }}>HÀNH TRÌNH</div>
        <div className="space-y-2">
          {chapters.map(ch => (
            <div key={ch.id} className="paper-card rounded-lg px-3 py-2 flex items-center gap-3">
              <div
                className="w-14 font-serif font-bold text-sm"
                style={{ color: ch.status === 'locked' ? '#A0622A' : '#8B1A1A' }}
              >
                {ch.year}
              </div>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: ch.status === 'locked' ? '0%' : `${ch.progress * 100}%`,
                    background: ch.progress >= 1 ? '#3A5A2A' : '#8B1A1A',
                  }}
                />
              </div>
              <div className="font-hand text-xs w-8 text-right" style={{ color: '#A0622A' }}>
                {ch.status === 'locked' ? '🔒' : ch.progress >= 1 ? '✓' : `${Math.round(ch.progress * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-4">
        <div className="font-serif font-bold text-sm mb-3" style={{ color: '#3D1A00' }}>DANH HIỆU</div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map(a => (
            <div
              key={a.id}
              className="paper-stamp rounded-lg p-2 flex flex-col items-center text-center"
              style={{
                background: a.earned ? '#FBF4E8' : '#E8D5BA',
                opacity: a.earned ? 1 : 0.5,
              }}
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="font-hand text-xs mt-1 leading-tight" style={{ color: '#3D1A00', fontSize: 9 }}>
                {a.title}
              </div>
              {a.earned && (
                <div
                  className="font-hand text-xs mt-0.5"
                  style={{ color: '#3A5A2A', fontSize: 8 }}
                >
                  07.09.2026
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <div className="font-serif font-bold text-sm mb-3" style={{ color: '#3D1A00' }}>THỐNG KÊ</div>
        <div className="paper-card rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-serif font-bold text-2xl" style={{ color: '#8B1A1A' }}>
              {userStats.totalLessons}
            </div>
            <div className="font-hand text-xs" style={{ color: '#A0622A' }}>bài học</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl" style={{ color: '#8B1A1A' }}>
              {userStats.totalQuestions}
            </div>
            <div className="font-hand text-xs" style={{ color: '#A0622A' }}>câu hỏi</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl" style={{ color: '#8B1A1A' }}>
              {Math.round(userStats.accuracy * 100)}%
            </div>
            <div className="font-hand text-xs" style={{ color: '#A0622A' }}>chính xác</div>
          </div>
        </div>
      </div>
    </div>
  )
}
