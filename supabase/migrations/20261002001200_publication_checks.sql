-- Roll-forward integrity checks for publication and protected assessment children.
alter table public.question_sets add column daily_review_enabled boolean not null default false;
create function private.validate_publication() returns trigger language plpgsql set search_path='' as $$
declare root_status text:=coalesce(to_jsonb(new)->>'status',to_jsonb(new)->>'review_status'); bad boolean;
begin
 if root_status<>'published' then return new; end if;
 if tg_table_name='story_versions' then
  if new.start_scene_id is null or not exists(select 1 from public.scenes where id=new.start_scene_id and story_version_id=new.id)
   or not exists(select 1 from public.scenes where story_version_id=new.id and kind='end') then raise exception 'Story requires valid start and end' using errcode='22023'; end if;
  if exists(select 1 from public.scene_choices ch join public.scenes s on s.id=ch.scene_id where s.story_version_id=new.id
    and (ch.next_scene_id is not null and not exists(select 1 from public.scenes target where target.id=ch.next_scene_id and target.story_version_id=new.id)
      or ch.kind='knowledge_check' and not exists(select 1 from private.scene_answer_keys where choice_id=ch.id)
      or ch.kind<>'knowledge_check' and exists(select 1 from private.scene_answer_keys where choice_id=ch.id))) then raise exception 'Invalid scene choice reference or key' using errcode='22023'; end if;
  if exists(select 1 from public.scenes s where s.story_version_id=new.id and (
    s.payload ? 'isCorrect' or s.payload ? 'explanation' or s.payload ? 'choices'
    or s.kind='choice' and (s.payload->>'policy' is null or s.payload->>'policy' not in ('retry_until_correct','continue_after_feedback') or not exists(select 1 from public.scene_choices c where c.scene_id=s.id))
    or s.required_check and not exists(select 1 from public.scene_choices c where c.scene_id=s.id and c.kind='knowledge_check')
    or s.kind not in ('choice','end') and s.next_scene_id is null
    or s.backdrop_media_id is not null and not exists(select 1 from public.media_assets m where m.id=s.backdrop_media_id and m.review_status='published')
    or s.kind='media' and not exists(select 1 from public.media_assets m where m.id=(s.payload->>'mediaAssetId')::uuid and m.review_status='published')
   )) then raise exception 'Invalid published scene payload' using errcode='22023'; end if;
  with recursive reachable(id) as (
   select new.start_scene_id union select edge.target from reachable r join lateral (
     select s.next_scene_id target from public.scenes s where s.id=r.id and s.next_scene_id is not null
     union select c.next_scene_id from public.scene_choices c where c.scene_id=r.id and c.next_scene_id is not null
    ) edge on true
  ) select exists(select 1 from public.scenes s where s.story_version_id=new.id and not exists(select 1 from reachable r where r.id=s.id)) into bad;
  if bad then raise exception 'Unreachable scene' using errcode='22023'; end if;
 elsif tg_table_name='lessons' then
  if not exists(select 1 from public.lesson_blocks where lesson_id=new.id) then raise exception 'Lesson requires blocks' using errcode='22023'; end if;
  if exists(select 1 from public.lesson_blocks b where b.lesson_id=new.id and (
    b.document_id is not null and not exists(select 1 from public.learning_documents d where d.id=b.document_id and d.status='published')
    or b.story_version_id is not null and not exists(select 1 from public.story_versions v where v.id=b.story_version_id and v.status='published')
    or b.media_asset_id is not null and not exists(select 1 from public.media_assets m where m.id=b.media_asset_id and m.review_status='published' and m.kind='video' and m.duration_seconds>0)
    or b.question_set_id is not null and not exists(select 1 from public.question_sets q where q.id=b.question_set_id and q.status='published' and q.mode=b.assessment_mode)
    or b.knowledge_check_set_id is not null and not exists(select 1 from public.question_sets q where q.id=b.knowledge_check_set_id and q.status='published')
   )) then raise exception 'Lesson references unpublished or mismatched content' using errcode='22023'; end if;
 elsif tg_table_name='question_sets' then
  if not exists(select 1 from public.question_set_items where question_set_id=new.id) or exists(select 1 from public.question_set_items i join public.questions q on q.id=i.question_id where i.question_set_id=new.id and
   (q.status<>'published' or not exists(select 1 from private.question_answer_keys a where a.question_id=q.id))) then raise exception 'Assessment requires published keyed questions' using errcode='22023'; end if;
  if new.daily_review_enabled and new.mode<>'practice' then raise exception 'Daily review must be practice' using errcode='22023'; end if;
 elsif tg_table_name='questions' then
  if not exists(select 1 from private.question_answer_keys where question_id=new.id) or exists(select 1 from private.question_answer_keys a,unnest(a.correct_option_ids) x(id) where a.question_id=new.id and not exists(select 1 from public.question_options o where o.id=x.id and o.question_id=new.id)) then raise exception 'Question key references invalid option' using errcode='22023'; end if;
 elsif tg_table_name='learning_documents' then
  if not exists(select 1 from public.document_sections where document_id=new.id) or exists(select 1 from public.document_sections s where s.document_id=new.id and
    (jsonb_typeof(s.payload)<>'object' or s.kind in ('paragraph','heading') and jsonb_typeof(s.payload->'text') is distinct from 'string'
      or s.kind='heading' and coalesce(s.payload->>'level','') not in ('2','3') or s.kind='key_points' and jsonb_typeof(s.payload->'items') is distinct from 'array')) then raise exception 'Invalid document sections' using errcode='22023'; end if;
 elsif tg_table_name='media_assets' then
  if new.storage_ref not like 'published-media/%' or new.poster_media_id is not null and not exists(select 1 from public.media_assets where id=new.poster_media_id and review_status='published') then raise exception 'Published media needs safe path and approved poster' using errcode='22023'; end if;
  if exists(select 1 from public.caption_tracks where media_asset_id=new.id and storage_ref not like 'published-media/%')
   or exists(select 1 from public.transcripts t where t.media_asset_id=new.id and (t.storage_ref not like 'published-media/%' or t.document_id is not null and not exists(select 1 from public.learning_documents d where d.id=t.document_id and d.status='published'))) then raise exception 'Published media requires safe captions and approved transcript' using errcode='22023'; end if;
 end if;
 return new;
end $$;
do $$ declare t text; begin
 foreach t in array array['story_versions','lessons','question_sets','questions','learning_documents','media_assets'] loop
  execute format('create trigger validate_publish before insert or update on public.%I for each row execute function private.validate_publication()',t);
 end loop;
end $$;
create function private.immutable_answer() returns trigger language plpgsql set search_path='' as $$
declare key_id uuid; published boolean;
begin
 if tg_op<>'INSERT' then
  if tg_table_name='question_answer_keys' then
   key_id:=old.question_id; select status='published' into published from public.questions where id=key_id for update;
  else
   key_id:=old.choice_id; select v.status='published' into published from public.scene_choices c join public.scenes s on s.id=c.scene_id join public.story_versions v on v.id=s.story_version_id where c.id=key_id for update of v;
  end if;
  if published then raise exception 'Published answer key immutable' using errcode='22023'; end if;
 end if;
 if tg_op<>'DELETE' then
  if tg_table_name='question_answer_keys' then
   key_id:=new.question_id; select status='published' into published from public.questions where id=key_id for update;
  else
   key_id:=new.choice_id; select v.status='published' into published from public.scene_choices c join public.scenes s on s.id=c.scene_id join public.story_versions v on v.id=s.story_version_id where c.id=key_id for update of v;
  end if;
  if published then raise exception 'Published answer key immutable' using errcode='22023'; end if;
  return new;
 end if;
 return old;
end $$;
create trigger immutable before insert or update or delete on private.question_answer_keys for each row execute function private.immutable_answer();
create trigger immutable before insert or update or delete on private.scene_answer_keys for each row execute function private.immutable_answer();
drop policy published on public.visual_novel_stories;
create policy published on public.visual_novel_stories for select using(exists(select 1 from public.story_versions v where v.story_id=visual_novel_stories.id and v.status='published'));
revoke all on all functions in schema private from public,anon,authenticated;
