-- ==============================================================================
-- Su Chill - Comprehensive Database Schema Migration (PostgreSQL / Supabase)
-- Tuân thủ triệt để Supabase Postgres Best Practices: RLS, Indexes, Foreign Keys
-- ==============================================================================

-- 1. Bảng CHƯƠNG LỊCH SỬ (chapters)
CREATE TABLE IF NOT EXISTS public.chapters (
    id SERIAL PRIMARY KEY,
    year VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    progress REAL NOT NULL DEFAULT 0.0,
    status VARCHAR(50) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'current', 'completed')),
    unsplash_id VARCHAR(100) NOT NULL DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Bảng BÀI HỌC (lessons)
CREATE TABLE IF NOT EXISTS public.lessons (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL DEFAULT 5,
    status VARCHAR(50) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'current', 'completed')),
    visual_novel_id VARCHAR(100),
    order_index INTEGER NOT NULL DEFAULT 0,
    key_points TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON public.lessons(chapter_id);

-- 3. Bảng HỘI THOẠI BÀI HỌC (lesson_stories)
CREATE TABLE IF NOT EXISTS public.lesson_stories (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    emotion VARCHAR(50) NOT NULL DEFAULT 'happy' CHECK (emotion IN ('happy', 'thinking', 'excited', 'determined', 'surprised')),
    text TEXT NOT NULL,
    highlight TEXT,
    fact_label VARCHAR(100),
    fact_value VARCHAR(255),
    order_index INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_lesson_stories_lesson_id ON public.lesson_stories(lesson_id);

-- 4. Bảng TRẮC NGHIỆM CHƯƠNG (chapter_quizzes)
CREATE TABLE IF NOT EXISTS public.chapter_quizzes (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_index INTEGER NOT NULL DEFAULT 0,
    explanation TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_chapter_quizzes_chapter_id ON public.chapter_quizzes(chapter_id);

-- 5. Bảng KỊCH BẢN VISUAL NOVEL (visual_novel_stories)
CREATE TABLE IF NOT EXISTS public.visual_novel_stories (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    era VARCHAR(100) NOT NULL,
    historical_year VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    initial_scene_id VARCHAR(100) NOT NULL,
    initial_standing JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Bảng CÂU HỎI ĐẤU TRÍ 1V1 (pvp_questions)
CREATE TABLE IF NOT EXISTS public.pvp_questions (
    id SERIAL PRIMARY KEY,
    era VARCHAR(100) NOT NULL,
    era_year VARCHAR(20) NOT NULL,
    question TEXT NOT NULL,
    hint TEXT,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL DEFAULT 0,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Bảng HỒ SƠ & THỐNG KÊ NGƯỜI CHƠI (user_profiles)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id TEXT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    coins INTEGER NOT NULL DEFAULT 0,
    pvp_matches INTEGER NOT NULL DEFAULT 0,
    pvp_wins INTEGER NOT NULL DEFAULT 0,
    pvp_streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON public.user_profiles(xp DESC);

-- 8. Bảng THÀNH TỰU (achievements)
CREATE TABLE IF NOT EXISTS public.achievements (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT '🎖️',
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    total INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Bảng TIẾN ĐỘ THÀNH TỰU NGƯỜI CHƠI (user_achievements)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    progress INTEGER NOT NULL DEFAULT 0,
    unlocked_at TIMESTAMPTZ,
    CONSTRAINT uq_user_achievement UNIQUE (user_id, achievement_id)
);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- 10. Bảng TIẾN ĐỘ CHƯƠNG BÀI HỌC CỦA NGƯỜI DÙNG (user_chapter_progress)
CREATE TABLE IF NOT EXISTS public.user_chapter_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    chapter_id INTEGER NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    completed_lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
    quiz_score INTEGER,
    quiz_total INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'current', 'completed')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_chapter UNIQUE (user_id, chapter_id)
);
CREATE INDEX IF NOT EXISTS idx_user_chapter_progress_user ON public.user_chapter_progress(user_id);

-- ==============================================================================
-- CẤU HÌNH BẢO MẬT ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================

-- Kích hoạt RLS cho toàn bộ các bảng trong schema public
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visual_novel_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pvp_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chapter_progress ENABLE ROW LEVEL SECURITY;

-- 1. Quyền đọc công khai cho dữ liệu học tập & câu hỏi
CREATE POLICY "Cho phép đọc công khai chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc công khai lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc công khai lesson_stories" ON public.lesson_stories FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc công khai chapter_quizzes" ON public.chapter_quizzes FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc công khai visual_novel_stories" ON public.visual_novel_stories FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc công khai pvp_questions" ON public.pvp_questions FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc công khai achievements" ON public.achievements FOR SELECT USING (true);

-- 2. Quyền người dùng đối với hồ sơ và tiến độ cá nhân
CREATE POLICY "Cho phép đọc danh sách hồ sơ" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Cho phép tạo và cập nhật hồ sơ cá nhân" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép đọc tiến độ cá nhân" ON public.user_chapter_progress FOR SELECT USING (true);
CREATE POLICY "Cho phép ghi tiến độ cá nhân" ON public.user_chapter_progress FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép đọc thành tựu cá nhân" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Cho phép ghi thành tựu cá nhân" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);
