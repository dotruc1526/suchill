-- Stable reward identity survives minor corrections that create new immutable content rows.
alter table public.lessons add column reward_scope_id uuid references public.lessons(id) on delete restrict;
alter table public.question_sets add column reward_scope_id uuid references public.question_sets(id) on delete restrict;
create function private.assign_reward_scope() returns trigger language plpgsql set search_path='' as $$
begin new.reward_scope_id:=coalesce(new.reward_scope_id,new.id); return new; end $$;
create trigger assign_scope before insert on public.lessons for each row execute function private.assign_reward_scope();
create trigger assign_scope before insert on public.question_sets for each row execute function private.assign_reward_scope();
-- Existing content receives an identity without changing its published behavior.
alter table public.lessons disable trigger immutable;
alter table public.question_sets disable trigger immutable;
update public.lessons set reward_scope_id=id where reward_scope_id is null;
update public.question_sets set reward_scope_id=id where reward_scope_id is null;
alter table public.lessons enable trigger immutable;
alter table public.question_sets enable trigger immutable;
alter table public.lessons alter column reward_scope_id set not null;
alter table public.question_sets alter column reward_scope_id set not null;
alter table public.user_video_progress add column telemetry_started_at timestamptz not null default now();
-- Editorial reviewer notes are not part of the public historical claim projection.
revoke select on public.historical_claims from anon,authenticated;
grant select(id,statement,kind,review_status,created_at,updated_at) on public.historical_claims to anon,authenticated;
revoke all on all functions in schema private from public,anon,authenticated;
