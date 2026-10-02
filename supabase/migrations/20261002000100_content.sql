-- Normalized authored content. Technical fixtures are loaded only by the test harness.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create type public.publish_status as enum ('draft','in_review','approved','published','archived');
create table public.learning_objectives (
  id uuid primary key default gen_random_uuid(), title text not null, status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.historical_sources (
  id uuid primary key default gen_random_uuid(), title text not null, author_or_institution text, published_year integer,
  url text, citation_text text not null, tier text not null check (tier in ('primary','scholarly','institutional','reference')),
  status public.publish_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.historical_claims (
  id uuid primary key default gen_random_uuid(), statement text not null,
  kind text not null check (kind in ('fact','interpretation','fiction','composite','uncertain')),
  review_status public.publish_status not null default 'draft', reviewer_note text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.claim_sources (
  claim_id uuid not null references public.historical_claims on delete restrict,
  source_id uuid not null references public.historical_sources on delete restrict, primary key(claim_id,source_id)
);
create table public.learning_documents (
  id uuid primary key default gen_random_uuid(), title text not null, locale text not null default 'vi-VN' check(locale='vi-VN'),
  status public.publish_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.document_sections (
  id uuid primary key default gen_random_uuid(), document_id uuid not null references public.learning_documents on delete restrict,
  order_index integer not null check(order_index>=0), kind text not null check(kind in ('paragraph','heading','key_points')),
  payload jsonb not null, unique(document_id,order_index)
);
create table public.document_sources (
  document_id uuid not null references public.learning_documents on delete restrict,
  source_id uuid not null references public.historical_sources on delete restrict, primary key(document_id,source_id)
);
create table public.media_assets (
  id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('image','video','audio','illustration')),
  title text not null, storage_ref text not null, poster_media_id uuid references public.media_assets on delete restrict,
  caption text, alt_text text, duration_seconds numeric check(duration_seconds>0), aspect_ratio text,
  attribution text, license text, review_status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.media_sources (
  media_asset_id uuid not null references public.media_assets on delete restrict,
  source_id uuid not null references public.historical_sources on delete restrict, primary key(media_asset_id,source_id)
);
create table public.caption_tracks (
  id uuid primary key default gen_random_uuid(), media_asset_id uuid not null references public.media_assets on delete restrict,
  locale text not null default 'vi-VN' check(locale='vi-VN'), label text not null, storage_ref text not null,
  unique(media_asset_id,locale)
);
create table public.transcripts (
  id uuid primary key default gen_random_uuid(), media_asset_id uuid not null unique references public.media_assets on delete restrict,
  locale text not null default 'vi-VN' check(locale='vi-VN'), label text not null, storage_ref text not null,
  document_id uuid references public.learning_documents on delete restrict
);
create table public.visual_novel_stories (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, summary text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.story_versions (
  id uuid primary key default gen_random_uuid(), story_id uuid not null references public.visual_novel_stories on delete restrict,
  version_number integer not null check(version_number>0), eligibility_version text not null default '1',
  status public.publish_status not null default 'draft', start_scene_id uuid,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz,
  unique(story_id,version_number)
);
create table public.scenes (
  id uuid primary key default gen_random_uuid(), story_version_id uuid not null references public.story_versions on delete restrict,
  order_index integer not null check(order_index>=0), kind text not null check(kind in ('narration','dialogue','choice','media','debrief','end')),
  title text, backdrop_media_id uuid references public.media_assets on delete restrict,
  next_scene_id uuid, payload jsonb not null default '{}', required_check boolean not null default false,
  unique(story_version_id,id), unique(story_version_id,order_index),
  foreign key(story_version_id,next_scene_id) references public.scenes(story_version_id,id) deferrable initially deferred,
  check((kind='end' and next_scene_id is null) or kind<>'end'), check(not required_check or kind='choice')
);
alter table public.story_versions add foreign key(id,start_scene_id) references public.scenes(story_version_id,id) deferrable initially deferred;
create table public.scene_choices (
  id uuid primary key default gen_random_uuid(), scene_id uuid not null references public.scenes on delete restrict,
  order_index integer not null check(order_index>=0), kind text not null check(kind in ('narrative','reflection','branching','knowledge_check')),
  label text not null, response text, next_scene_id uuid references public.scenes on delete restrict,
  unique(scene_id,order_index), check(kind='knowledge_check' or next_scene_id is not null)
);
create table private.scene_answer_keys (
  choice_id uuid primary key references public.scene_choices on delete restrict, is_correct boolean not null, explanation text not null
);
create table public.scene_sources (
  scene_id uuid not null references public.scenes on delete restrict, source_id uuid not null references public.historical_sources on delete restrict,
  primary key(scene_id,source_id)
);
create table public.scene_claims (
  scene_id uuid not null references public.scenes on delete restrict, claim_id uuid not null references public.historical_claims on delete restrict,
  primary key(scene_id,claim_id)
);
create table public.story_objectives (
  story_version_id uuid not null references public.story_versions on delete restrict,
  objective_id uuid not null references public.learning_objectives on delete restrict, primary key(story_version_id,objective_id)
);
create table public.story_sources (
  story_version_id uuid not null references public.story_versions on delete restrict,
  source_id uuid not null references public.historical_sources on delete restrict, primary key(story_version_id,source_id)
);
create table public.question_sets (
  id uuid primary key default gen_random_uuid(), title text not null, mode text not null check(mode in ('practice','scored')),
  pass_threshold numeric not null default 0.7 check(pass_threshold between 0 and 1), eligibility_version text not null default '1',
  status public.publish_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.questions (
  id uuid primary key default gen_random_uuid(), prompt text not null, difficulty text not null check(difficulty in ('intro','standard','advanced')),
  status public.publish_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.question_options (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.questions on delete restrict,
  order_index integer not null check(order_index>=0), label text not null, unique(question_id,order_index)
);
create table private.question_answer_keys (
  question_id uuid primary key references public.questions on delete restrict, correct_option_ids uuid[] not null,
  explanation text not null, check(cardinality(correct_option_ids)>0)
);
create table public.question_set_items (
  question_set_id uuid not null references public.question_sets on delete restrict, question_id uuid not null references public.questions on delete restrict,
  order_index integer not null check(order_index>=0), primary key(question_set_id,question_id), unique(question_set_id,order_index)
);
create table public.question_sources (
  question_id uuid not null references public.questions on delete restrict, source_id uuid not null references public.historical_sources on delete restrict,
  primary key(question_id,source_id)
);
create table public.question_set_objectives (
  question_set_id uuid not null references public.question_sets on delete restrict, objective_id uuid not null references public.learning_objectives on delete restrict,
  primary key(question_set_id,objective_id)
);
create table public.chapters (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, subtitle text, summary text not null,
  historical_period_label text not null, cover_media_id uuid references public.media_assets on delete restrict,
  estimated_minutes integer not null check(estimated_minutes>=0), status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.chapter_objectives (
  chapter_id uuid not null references public.chapters on delete restrict, objective_id uuid not null references public.learning_objectives on delete restrict,
  primary key(chapter_id,objective_id)
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(), chapter_id uuid not null references public.chapters on delete restrict,
  order_index integer not null check(order_index>=0), slug text not null, title text not null, summary text not null,
  format text not null check(format in ('standard','visual_novel','video','quiz','mixed')), required boolean not null default true,
  eligibility_version text not null default '1', estimated_minutes integer not null check(estimated_minutes>=0), status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(chapter_id,slug), unique(chapter_id,order_index)
);
create table public.lesson_objectives (
  lesson_id uuid not null references public.lessons on delete restrict, objective_id uuid not null references public.learning_objectives on delete restrict,
  primary key(lesson_id,objective_id)
);
create table public.lesson_prerequisites (
  lesson_id uuid not null references public.lessons on delete restrict, prerequisite_lesson_id uuid not null references public.lessons on delete restrict,
  primary key(lesson_id,prerequisite_lesson_id), check(lesson_id<>prerequisite_lesson_id)
);
create table public.lesson_blocks (
  id uuid primary key default gen_random_uuid(), lesson_id uuid not null references public.lessons on delete restrict,
  order_index integer not null check(order_index>=0), required boolean not null default true,
  kind text not null check(kind in ('text','recap','visual_novel','video','quiz')),
  document_id uuid references public.learning_documents on delete restrict, story_version_id uuid references public.story_versions on delete restrict,
  media_asset_id uuid references public.media_assets on delete restrict, question_set_id uuid references public.question_sets on delete restrict,
  completion_policy text check(completion_policy in ('optional','reach_end','watch_threshold')),
  assessment_mode text check(assessment_mode in ('practice','scored')), knowledge_check_set_id uuid references public.question_sets on delete restrict,
  unique(lesson_id,order_index), unique(lesson_id,id),
  check(case kind when 'text' then document_id is not null and num_nonnulls(story_version_id,media_asset_id,question_set_id)=0
    when 'recap' then document_id is not null and num_nonnulls(story_version_id,media_asset_id,question_set_id)=0
    when 'visual_novel' then story_version_id is not null and num_nonnulls(document_id,media_asset_id,question_set_id)=0
    when 'video' then media_asset_id is not null and completion_policy is not null and num_nonnulls(document_id,story_version_id,question_set_id)=0
    when 'quiz' then question_set_id is not null and assessment_mode is not null and num_nonnulls(document_id,story_version_id,media_asset_id)=0 else false end)
);
