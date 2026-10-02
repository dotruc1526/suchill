-- Every exposed table is default-deny. Users write through the two authenticated RPCs.
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('alter table public.%I enable row level security',t.tablename);
    execute format('revoke all on public.%I from public, anon, authenticated',t.tablename);
    execute format('grant select on public.%I to anon, authenticated',t.tablename);
  end loop;
end $$;
revoke all on all tables in schema private from public,anon,authenticated;
alter default privileges in schema public revoke all on tables from public,anon,authenticated;
alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema private revoke execute on functions from public;

create policy published on public.chapters for select using(status='published');
create policy published on public.lessons for select using(status='published' and exists(select 1 from public.chapters c where c.id=chapter_id));
create policy published on public.learning_objectives for select using(status='published');
create policy published on public.historical_sources for select using(status='published');
create policy published on public.historical_claims for select using(review_status='published');
create policy published on public.learning_documents for select using(status='published');
create policy published on public.media_assets for select using(review_status='published');
create policy published on public.story_versions for select using(status='published');
create policy published on public.visual_novel_stories for select using(exists(select 1 from public.story_versions v where v.story_id=id));
create policy published on public.question_sets for select using(status='published');
create policy published on public.questions for select using(status='published');
create policy parent on public.chapter_objectives for select using(exists(select 1 from public.chapters p where p.id=chapter_id));
create policy parent on public.lesson_objectives for select using(exists(select 1 from public.lessons p where p.id=lesson_id));
create policy parent on public.lesson_prerequisites for select using(exists(select 1 from public.lessons p where p.id=lesson_id));
create policy parent on public.lesson_blocks for select using(exists(select 1 from public.lessons p where p.id=lesson_id));
create policy parent on public.scenes for select using(exists(select 1 from public.story_versions p where p.id=story_version_id));
create policy parent on public.scene_choices for select using(exists(select 1 from public.scenes p where p.id=scene_id));
create policy parent on public.scene_sources for select using(exists(select 1 from public.scenes p where p.id=scene_id));
create policy parent on public.scene_claims for select using(exists(select 1 from public.scenes p where p.id=scene_id));
create policy parent on public.story_objectives for select using(exists(select 1 from public.story_versions p where p.id=story_version_id));
create policy parent on public.story_sources for select using(exists(select 1 from public.story_versions p where p.id=story_version_id));
create policy parent on public.claim_sources for select using(exists(select 1 from public.historical_claims p where p.id=claim_id));
create policy parent on public.media_sources for select using(exists(select 1 from public.media_assets p where p.id=media_asset_id));
create policy parent on public.caption_tracks for select using(exists(select 1 from public.media_assets p where p.id=media_asset_id));
create policy parent on public.transcripts for select using(exists(select 1 from public.media_assets p where p.id=media_asset_id));
create policy parent on public.document_sections for select using(exists(select 1 from public.learning_documents p where p.id=document_id));
create policy parent on public.document_sources for select using(exists(select 1 from public.learning_documents p where p.id=document_id));
create policy parent on public.question_options for select using(exists(select 1 from public.questions p where p.id=question_id));
create policy parent on public.question_set_items for select using(exists(select 1 from public.question_sets p where p.id=question_set_id) and exists(select 1 from public.questions q where q.id=question_id));
create policy parent on public.question_sources for select using(exists(select 1 from public.questions p where p.id=question_id));
create policy parent on public.question_set_objectives for select using(exists(select 1 from public.question_sets p where p.id=question_set_id));
create policy own on public.profiles for select to authenticated using(id=auth.uid());
do $$ declare t text; begin
  foreach t in array array['user_settings','user_lesson_progress','user_block_completions','user_episode_progress','user_scene_visits',
    'user_choice_selections','user_video_progress','learning_attempts','user_quiz_mastery','activity_completions','reward_ledger','streak_days','user_streaks','analytics_events'] loop
    execute format('create policy own on public.%I for select to authenticated using(user_id=auth.uid())',t);
  end loop;
end $$;

create function private.immutable_root() returns trigger language plpgsql set search_path='' as $$
begin
  if to_jsonb(old)->>tg_argv[0]='published' then raise exception 'Published content is immutable' using errcode='22023'; end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end $$;
create function private.immutable_child() returns trigger language plpgsql set search_path='' as $$
declare parent_status text; row_data jsonb; parent_id uuid;
begin
  if tg_op<>'INSERT' then
    row_data:=to_jsonb(old); parent_id:=(row_data->>tg_argv[1])::uuid;
    execute format('select %I::text from public.%I where id=$1 for update',tg_argv[2],tg_argv[0]) into parent_status using parent_id;
    if parent_status='published' then raise exception 'Published child is immutable' using errcode='22023'; end if;
  end if;
  if tg_op<>'DELETE' then
    row_data:=to_jsonb(new); parent_id:=(row_data->>tg_argv[1])::uuid;
    execute format('select %I::text from public.%I where id=$1 for update',tg_argv[2],tg_argv[0]) into parent_status using parent_id;
    if parent_status='published' then raise exception 'Published child is immutable' using errcode='22023'; end if;
    return new;
  end if;
  return old;
end $$;
do $$ declare t text; spec text[]; begin
  foreach t in array array['chapters','lessons','learning_documents','story_versions','questions','question_sets','historical_sources','learning_objectives'] loop
    execute format('create trigger immutable before update or delete on public.%I for each row execute function private.immutable_root(''status'')',t);
  end loop;
  foreach t in array array['media_assets','historical_claims'] loop
    execute format('create trigger immutable before update or delete on public.%I for each row execute function private.immutable_root(''review_status'')',t);
  end loop;
  foreach spec slice 1 in array array[
    ['chapter_objectives','chapters','chapter_id','status'],['lesson_objectives','lessons','lesson_id','status'],
    ['lesson_prerequisites','lessons','lesson_id','status'],['lesson_blocks','lessons','lesson_id','status'],
    ['scenes','story_versions','story_version_id','status'],['story_objectives','story_versions','story_version_id','status'],
    ['story_sources','story_versions','story_version_id','status'],['media_sources','media_assets','media_asset_id','review_status'],
    ['caption_tracks','media_assets','media_asset_id','review_status'],['transcripts','media_assets','media_asset_id','review_status'],
    ['claim_sources','historical_claims','claim_id','review_status'],['document_sections','learning_documents','document_id','status'],
    ['document_sources','learning_documents','document_id','status'],['question_options','questions','question_id','status'],
    ['question_set_items','question_sets','question_set_id','status'],['question_sources','questions','question_id','status'],
    ['question_set_objectives','question_sets','question_set_id','status']
  ] loop
    execute format('create trigger immutable before insert or update or delete on public.%I for each row execute function private.immutable_child(%L,%L,%L)',spec[1],spec[2],spec[3],spec[4]);
  end loop;
end $$;
create function private.immutable_scene_child() returns trigger language plpgsql set search_path='' as $$
declare parent_status text; sid uuid;
begin
  if tg_op<>'INSERT' then
    sid:=(to_jsonb(old)->>'scene_id')::uuid;
    select v.status::text into parent_status from public.scenes s join public.story_versions v on v.id=s.story_version_id where s.id=sid for update of v;
    if parent_status='published' then raise exception 'Published scene child is immutable' using errcode='22023'; end if;
  end if;
  if tg_op<>'DELETE' then
    sid:=(to_jsonb(new)->>'scene_id')::uuid;
    select v.status::text into parent_status from public.scenes s join public.story_versions v on v.id=s.story_version_id where s.id=sid for update of v;
    if parent_status='published' then raise exception 'Published scene child is immutable' using errcode='22023'; end if;
    return new;
  end if;
  return old;
end $$;
create trigger immutable before insert or update or delete on public.scene_choices for each row execute function private.immutable_scene_child();
create trigger immutable before insert or update or delete on public.scene_sources for each row execute function private.immutable_scene_child();
create trigger immutable before insert or update or delete on public.scene_claims for each row execute function private.immutable_scene_child();
create function private.ledger_append_only() returns trigger language plpgsql set search_path='' as $$
begin raise exception 'Ledger is append only' using errcode='42501'; end $$;
create trigger append_only before update or delete on public.reward_ledger for each row execute function private.ledger_append_only();
revoke all on all functions in schema private from public,anon,authenticated;
