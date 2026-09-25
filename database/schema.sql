-- PostgreSQL Schema for "Sử Chill" Vietnamese History Learning App
-- Designed for PostgreSQL 15+

-- ============================================================================
-- 0. CUSTOM ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended');
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');
CREATE TYPE lesson_type AS ENUM ('reading', 'video', 'interactive', 'quiz');
CREATE TYPE source_type AS ENUM ('book', 'article', 'archive', 'website', 'documentary', 'oral_history');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false');
CREATE TYPE material_type AS ENUM ('text', 'quote', 'memoir', 'document', 'technical_data', 'video', 'image');
CREATE TYPE historical_side AS ENUM ('vietnam', 'us', 'arvn', 'other');
CREATE TYPE location_type AS ENUM ('start', 'waypoint', 'battle', 'end');
CREATE TYPE verification_status AS ENUM ('verified', 'unverified', 'disputed');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document', 'audio');
CREATE TYPE ai_message_role AS ENUM ('user', 'assistant');
CREATE TYPE xp_source_type AS ENUM ('quiz', 'lesson', 'streak', 'achievement', 'flashcard', 'timeline');


-- ============================================================================
-- 1. MVP TABLES (CORE)
-- ============================================================================

-- Users
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    xp INT NOT NULL DEFAULT 0 CHECK (xp >= 0),
    level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INT NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_active_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status user_status NOT NULL DEFAULT 'active'
);
COMMENT ON TABLE users IS 'User accounts and overall progress.';

-- Roadmaps
CREATE TABLE roadmaps (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    status content_status NOT NULL DEFAULT 'draft',
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE roadmaps IS 'High-level learning paths (e.g., Vietnam War Overview).';
CREATE INDEX idx_roadmaps_created_by ON roadmaps(created_by);

-- Chapters
CREATE TABLE chapters (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    roadmap_id BIGINT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    status content_status NOT NULL DEFAULT 'draft',
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE chapters IS 'Chapters grouping lessons within a roadmap.';
CREATE INDEX idx_chapters_roadmap_id ON chapters(roadmap_id);

-- Lessons
CREATE TABLE lessons (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chapter_id BIGINT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    duration_minutes INT CHECK (duration_minutes >= 0),
    status content_status NOT NULL DEFAULT 'draft',
    lesson_type lesson_type NOT NULL DEFAULT 'reading',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE lessons IS 'Individual learning modules.';
CREATE INDEX idx_lessons_chapter_id ON lessons(chapter_id);

-- Historical Events
CREATE TABLE historical_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    event_date_str VARCHAR(100), -- For vague dates like "Spring 1968"
    event_date DATE,             -- Exact date for sorting
    end_date DATE,               -- If it spans a period
    location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Layer 1 (5s Overview)
    l1_hook VARCHAR(500),
    l1_thumbnail_url VARCHAR(500),
    l1_fact_1 VARCHAR(200),
    l1_fact_2 VARCHAR(200),
    l1_fact_3 VARCHAR(200),
    
    -- Layer 2 (30s Deep Dive)
    l2_summary_1 TEXT,
    l2_summary_2 TEXT,
    l2_summary_3 TEXT,
    l2_key_figure VARCHAR(255),
    l2_significance TEXT,
    
    -- Metadata
    status content_status NOT NULL DEFAULT 'draft',
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    order_index INT NOT NULL DEFAULT 0
);
COMMENT ON TABLE historical_events IS 'Core historical events structured with Progressive Disclosure ("Bóc củ hành" model).';
CREATE INDEX idx_events_lesson_id ON historical_events(lesson_id);
CREATE INDEX idx_events_date ON historical_events(event_date);

-- Sources
CREATE TABLE sources (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255),
    publication_year INT,
    publisher VARCHAR(255),
    url TEXT,
    isbn VARCHAR(50),
    source_type source_type NOT NULL,
    status content_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE sources IS 'Reference materials and citations ensuring historical accuracy.';

-- Event Sources (M:N)
CREATE TABLE event_sources (
    event_id BIGINT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    source_id BIGINT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    reference_detail VARCHAR(255),
    page_number VARCHAR(50),
    PRIMARY KEY (event_id, source_id)
);
COMMENT ON TABLE event_sources IS 'Junction table linking events to their historical sources.';

-- Quizzes
CREATE TABLE quizzes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lesson_id BIGINT NOT NULL UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INT NOT NULL DEFAULT 60 CHECK (passing_score >= 0 AND passing_score <= 100),
    xp_reward INT NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
    time_limit_seconds INT CHECK (time_limit_seconds > 0)
);
COMMENT ON TABLE quizzes IS 'Quizzes associated with specific lessons.';

-- Questions
CREATE TABLE questions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    event_id BIGINT REFERENCES historical_events(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    explanation TEXT,
    difficulty difficulty_level NOT NULL DEFAULT 'medium',
    order_index INT NOT NULL DEFAULT 0,
    question_type question_type NOT NULL DEFAULT 'multiple_choice'
);
COMMENT ON TABLE questions IS 'Questions belonging to a quiz.';
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);

-- Answers
CREATE TABLE answers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INT NOT NULL DEFAULT 0
);
COMMENT ON TABLE answers IS 'Answer options for quiz questions.';
CREATE INDEX idx_answers_question_id ON answers(question_id);

-- User Progress
CREATE TABLE user_progress (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    xp_earned INT NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, lesson_id)
);
COMMENT ON TABLE user_progress IS 'Tracks user completion of individual lessons.';

-- User Quiz Attempts
CREATE TABLE user_quiz_attempts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0 CHECK (score >= 0),
    total_questions INT NOT NULL CHECK (total_questions > 0),
    correct_count INT NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
    incorrect_count INT NOT NULL DEFAULT 0 CHECK (incorrect_count >= 0),
    xp_earned INT NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    time_spent_seconds INT NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE user_quiz_attempts IS 'Records of users taking quizzes.';
CREATE INDEX idx_uqa_user_id ON user_quiz_attempts(user_id);
CREATE INDEX idx_uqa_quiz_id ON user_quiz_attempts(quiz_id);

-- User Attempt Answers
CREATE TABLE user_attempt_answers (
    attempt_id BIGINT NOT NULL REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_answer_id BIGINT REFERENCES answers(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL,
    PRIMARY KEY (attempt_id, question_id)
);
COMMENT ON TABLE user_attempt_answers IS 'Individual answers given during a quiz attempt.';

-- User Streaks
CREATE TABLE user_streaks (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    xp_earned INT NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    PRIMARY KEY (user_id, activity_date)
);
COMMENT ON TABLE user_streaks IS 'Tracks daily activity for streak calculation.';


-- ============================================================================
-- 2. EXTENSION TABLES (FUTURE-READY)
-- ============================================================================

-- Event Materials (Layer 3)
CREATE TABLE event_materials (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    material_type material_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    media_url TEXT,
    source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
    order_index INT NOT NULL DEFAULT 0,
    status content_status NOT NULL DEFAULT 'draft'
);
COMMENT ON TABLE event_materials IS 'Deep-dive content (Layer 3) for events like detailed memoirs or technical specs.';
CREATE INDEX idx_event_materials_event_id ON event_materials(event_id);

-- Historical Figures
CREATE TABLE historical_figures (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title_rank VARCHAR(100),
    birth_year INT,
    death_year INT,
    bio TEXT,
    portrait_url TEXT,
    side historical_side NOT NULL
);
COMMENT ON TABLE historical_figures IS 'Key historical figures involved in events.';

-- Event Figures (M:N)
CREATE TABLE event_figures (
    event_id BIGINT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    figure_id BIGINT NOT NULL REFERENCES historical_figures(id) ON DELETE CASCADE,
    role_description VARCHAR(255),
    PRIMARY KEY (event_id, figure_id)
);
COMMENT ON TABLE event_figures IS 'Junction linking historical events to the figures involved.';

-- Campaigns
CREATE TABLE campaigns (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    event_id BIGINT REFERENCES historical_events(id) ON DELETE SET NULL,
    status content_status NOT NULL DEFAULT 'draft'
);
COMMENT ON TABLE campaigns IS 'Military campaigns structured for interactive maps.';

-- Campaign Locations
CREATE TABLE campaign_locations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    location_name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    location_type location_type NOT NULL DEFAULT 'waypoint',
    order_index INT NOT NULL DEFAULT 0,
    event_id BIGINT REFERENCES historical_events(id) ON DELETE SET NULL
);
COMMENT ON TABLE campaign_locations IS 'Specific geographic locations/waypoints within a campaign.';
CREATE INDEX idx_campaign_locations_campaign_id ON campaign_locations(campaign_id);

-- Campaign Routes
CREATE TABLE campaign_routes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    route_name VARCHAR(255),
    description TEXT,
    route_geojson TEXT NOT NULL,
    unit_name VARCHAR(100),
    order_index INT NOT NULL DEFAULT 0
);
COMMENT ON TABLE campaign_routes IS 'Polylines/GeoJSON data mapping attack routes or movements.';
CREATE INDEX idx_campaign_routes_campaign_id ON campaign_routes(campaign_id);

-- Flashcards
CREATE TABLE flashcards (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    front_image_url TEXT,
    hint TEXT,
    event_id BIGINT REFERENCES historical_events(id) ON DELETE SET NULL,
    figure_id BIGINT REFERENCES historical_figures(id) ON DELETE SET NULL,
    difficulty difficulty_level NOT NULL DEFAULT 'medium',
    source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
    status content_status NOT NULL DEFAULT 'draft'
);
COMMENT ON TABLE flashcards IS 'Flashcards for spaced repetition learning.';
CREATE INDEX idx_flashcards_event_id ON flashcards(event_id);

-- User Flashcard Reviews
CREATE TABLE user_flashcard_reviews (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flashcard_id BIGINT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    correct_count INT NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
    ease_factor DECIMAL(4,2) NOT NULL DEFAULT 2.5 CHECK (ease_factor >= 1.3),
    interval_days INT NOT NULL DEFAULT 1 CHECK (interval_days >= 0),
    next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_reviewed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, flashcard_id)
);
COMMENT ON TABLE user_flashcard_reviews IS 'Spaced repetition state for users and their flashcards.';

-- Timeline Games
CREATE TABLE timeline_games (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty difficulty_level NOT NULL DEFAULT 'medium',
    chapter_id BIGINT REFERENCES chapters(id) ON DELETE CASCADE
);
COMMENT ON TABLE timeline_games IS 'Configurable timeline drag-and-drop game sets.';

-- Timeline Items
CREATE TABLE timeline_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_id BIGINT NOT NULL REFERENCES timeline_games(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    correct_order INT NOT NULL,
    display_label VARCHAR(255) NOT NULL
);
COMMENT ON TABLE timeline_items IS 'Items belonging to a specific timeline game setup.';
CREATE INDEX idx_timeline_items_game_id ON timeline_items(game_id);

-- User Timeline Attempts
CREATE TABLE user_timeline_attempts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id BIGINT NOT NULL REFERENCES timeline_games(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    score INT NOT NULL DEFAULT 0 CHECK (score >= 0),
    time_spent_seconds INT NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE user_timeline_attempts IS 'Results of users playing timeline games.';
CREATE INDEX idx_uta_user_id ON user_timeline_attempts(user_id);

-- Witness Stories
CREATE TABLE witness_stories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id BIGINT REFERENCES historical_events(id) ON DELETE SET NULL,
    figure_id BIGINT REFERENCES historical_figures(id) ON DELETE SET NULL,
    witness_name VARCHAR(255) NOT NULL,
    quote_text TEXT NOT NULL,
    context TEXT,
    source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    status content_status NOT NULL DEFAULT 'draft'
);
COMMENT ON TABLE witness_stories IS 'Eyewitness accounts and storytelling elements.';
CREATE INDEX idx_witness_stories_event_id ON witness_stories(event_id);

-- Media Assets
CREATE TABLE media_assets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_type media_type NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    source_attribution TEXT,
    license VARCHAR(255),
    license_url TEXT,
    event_id BIGINT REFERENCES historical_events(id) ON DELETE SET NULL,
    figure_id BIGINT REFERENCES historical_figures(id) ON DELETE SET NULL,
    tags TEXT[],
    status content_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE media_assets IS 'Centralized media catalog for images, audio, video, and documents.';
CREATE INDEX idx_media_assets_event_id ON media_assets(event_id);

-- Achievements
CREATE TABLE achievements (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255),
    criteria_type VARCHAR(100) NOT NULL, -- e.g., 'complete_quiz_perfect', 'login_streak'
    criteria_value INT NOT NULL CHECK (criteria_value >= 0),
    xp_reward INT NOT NULL DEFAULT 0 CHECK (xp_reward >= 0)
);
COMMENT ON TABLE achievements IS 'Badges and achievements users can earn.';

-- User Achievements
CREATE TABLE user_achievements (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);
COMMENT ON TABLE user_achievements IS 'Tracks which achievements users have earned.';

-- AI Conversations
CREATE TABLE ai_conversations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE ai_conversations IS 'Tracks AI chatbot sessions with users.';
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);

-- AI Messages
CREATE TABLE ai_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role ai_message_role NOT NULL,
    content TEXT NOT NULL,
    event_id BIGINT REFERENCES historical_events(id) ON DELETE SET NULL,
    sources_used INT[], -- Array of Source IDs if the AI cites specific sources
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE ai_messages IS 'Messages within an AI chat session.';
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);

-- XP Ledger
CREATE TABLE xp_ledger (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source_type xp_source_type NOT NULL,
    source_id BIGINT,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE xp_ledger IS 'Immutable transaction history for XP earned by users.';
CREATE INDEX idx_xp_ledger_user_id ON xp_ledger(user_id);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
