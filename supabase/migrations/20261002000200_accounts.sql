create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade, display_name text not null default '' check(length(display_name)<=100),
  locale text not null default 'vi-VN' check(locale='vi-VN'), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade, sound_enabled boolean not null default true,
  reduced_motion boolean not null default false, analytics_enabled boolean not null default false,
  account_timezone text not null default 'Asia/Ho_Chi_Minh', timezone_changed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade, lesson_id uuid not null references public.lessons on delete restrict,
  status text not null default 'in_progress' check(status in ('not_started','in_progress','completed')), current_block_id uuid,
  started_at timestamptz not null default now(), completed_at timestamptz, updated_at timestamptz not null default now(), revision bigint not null default 0,
  primary key(user_id,lesson_id), foreign key(lesson_id,current_block_id) references public.lesson_blocks(lesson_id,id)
);
create table public.user_block_completions (
  user_id uuid not null references auth.users(id) on delete cascade, lesson_id uuid not null, block_id uuid not null,
  reason text not null check(reason in ('explicit','policy','accessible_fallback','media_fallback')), completed_at timestamptz not null default now(),
  primary key(user_id,block_id), foreign key(lesson_id,block_id) references public.lesson_blocks(lesson_id,id) on delete restrict
);
create table public.user_episode_progress (
  user_id uuid not null references auth.users(id) on delete cascade, story_version_id uuid not null references public.story_versions on delete restrict,
  current_scene_id uuid not null, status text not null default 'in_progress' check(status in ('in_progress','completed')),
  started_at timestamptz not null default now(), completed_at timestamptz, updated_at timestamptz not null default now(), revision bigint not null default 0,
  primary key(user_id,story_version_id), foreign key(story_version_id,current_scene_id) references public.scenes(story_version_id,id)
);
create table public.user_scene_visits (
  user_id uuid not null references auth.users(id) on delete cascade, story_version_id uuid not null, scene_id uuid not null,
  visited_at timestamptz not null default now(), primary key(user_id,story_version_id,scene_id),
  foreign key(story_version_id,scene_id) references public.scenes(story_version_id,id) on delete restrict
);
create table public.user_choice_selections (
  user_id uuid not null references auth.users(id) on delete cascade, story_version_id uuid not null, scene_id uuid not null,
  choice_id uuid not null references public.scene_choices on delete restrict, selected_at timestamptz not null default now(),
  primary key(user_id,story_version_id,scene_id), foreign key(story_version_id,scene_id) references public.scenes(story_version_id,id) on delete restrict
);
create table public.user_video_progress (
  user_id uuid not null references auth.users(id) on delete cascade, lesson_id uuid not null, block_id uuid not null,
  position_seconds numeric not null default 0 check(position_seconds>=0), watched_ranges jsonb not null default '[]', completed boolean not null default false,
  updated_at timestamptz not null default now(), revision bigint not null default 0, primary key(user_id,lesson_id,block_id),
  foreign key(lesson_id,block_id) references public.lesson_blocks(lesson_id,id) on delete restrict
);
create table public.learning_attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null check(activity_type in ('knowledge_check','quiz')), activity_id uuid not null,
  activity_version text not null, submission jsonb not null, score integer not null check(score>=0), total integer not null check(total>0),
  passed boolean not null, retry_index integer not null check(retry_index>=0), feedback jsonb not null,
  attempted_at timestamptz not null default now()
);
create table public.user_quiz_mastery (
  user_id uuid not null references auth.users(id) on delete cascade, question_set_id uuid not null references public.question_sets on delete restrict,
  best_score integer not null check(best_score>=0), total integer not null check(total>0), attempts integer not null check(attempts>0),
  passed boolean not null, updated_at timestamptz not null default now(), primary key(user_id,question_set_id)
);
create table public.activity_completions (
  user_id uuid not null references auth.users(id) on delete cascade, activity_type text not null check(activity_type in ('lesson','episode','quiz','daily_review')),
  activity_id uuid not null, eligibility_version text not null, completed_at timestamptz not null default now(),
  primary key(user_id,activity_type,activity_id,eligibility_version)
);
create table public.reward_ledger (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  reward_type text not null check(reward_type in ('lesson','episode','quiz','quiz_bonus','daily_review','achievement','adjustment')),
  activity_id uuid not null, eligibility_version text not null, xp_delta integer not null,
  idempotency_key text not null unique, reason text, occurred_at timestamptz not null default now(),
  unique(user_id,reward_type,activity_id,eligibility_version)
);
create table public.streak_days (
  user_id uuid not null references auth.users(id) on delete cascade, local_date date not null, timezone text not null,
  activity_id uuid not null, qualified_at timestamptz not null default now(), primary key(user_id,local_date)
);
create table public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade, current_streak integer not null default 0 check(current_streak>=0),
  longest_streak integer not null default 0 check(longest_streak>=current_streak), last_qualified_local_date date,
  updated_at timestamptz not null default now()
);
create table private.operations (
  user_id uuid not null references auth.users(id) on delete cascade, operation_id text not null check(length(operation_id) between 1 and 200),
  signature jsonb not null, receipt jsonb, occurred_at timestamptz not null default now(), primary key(user_id,operation_id)
);
create table private.audit_events (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  kind text not null, payload jsonb not null, occurred_at timestamptz not null default now()
);
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null, properties jsonb not null, occurred_at timestamptz not null default now()
);
create function private.on_signup() returns trigger language plpgsql security definer set search_path='' as $$
declare tz text := coalesce(new.raw_user_meta_data->>'timezone','Asia/Ho_Chi_Minh');
begin
  if not exists(select 1 from pg_timezone_names where name=tz) then tz:='Asia/Ho_Chi_Minh'; end if;
  insert into public.profiles(id,display_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'displayName',''),100));
  insert into public.user_settings(user_id,account_timezone) values(new.id,tz);
  insert into public.user_streaks(user_id) values(new.id);
  return new;
end $$;
revoke all on function private.on_signup() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.on_signup();
-- Query/RLS paths start with user_id. Additional FK indexes protect editorial operations.
create index lessons_chapter_idx on public.lessons(chapter_id);
create index blocks_story_idx on public.lesson_blocks(story_version_id);
create index blocks_media_idx on public.lesson_blocks(media_asset_id);
create index blocks_question_idx on public.lesson_blocks(question_set_id);
create index attempts_user_activity_idx on public.learning_attempts(user_id,activity_id,attempted_at);
create index ledger_user_idx on public.reward_ledger(user_id,occurred_at);
create index scene_choices_scene_idx on public.scene_choices(scene_id);
create index questions_set_question_idx on public.question_set_items(question_id);
