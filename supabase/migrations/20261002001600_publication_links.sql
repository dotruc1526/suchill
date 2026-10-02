create function private.validate_publication_links() returns trigger language plpgsql set search_path='' as $$
declare root_status text:=coalesce(to_jsonb(new)->>'status',to_jsonb(new)->>'review_status'); bad boolean:=false;
begin
 if root_status<>'published' then return new; end if;
 case tg_table_name
 when 'historical_claims' then
  select exists(select 1 from public.claim_sources link join public.historical_sources s on s.id=link.source_id where link.claim_id=new.id and s.status<>'published') into bad;
  if new.kind='fact' and not exists(select 1 from public.claim_sources where claim_id=new.id) then bad:=true; end if;
 when 'learning_documents' then
  select exists(select 1 from public.document_sources link join public.historical_sources s on s.id=link.source_id where link.document_id=new.id and s.status<>'published') into bad;
 when 'media_assets' then
  select exists(select 1 from public.media_sources link join public.historical_sources s on s.id=link.source_id where link.media_asset_id=new.id and s.status<>'published') into bad;
 when 'questions' then
  select exists(select 1 from public.question_sources link join public.historical_sources s on s.id=link.source_id where link.question_id=new.id and s.status<>'published') into bad;
 when 'question_sets' then
  select exists(select 1 from public.question_set_objectives link join public.learning_objectives o on o.id=link.objective_id where link.question_set_id=new.id and o.status<>'published') into bad;
  if new.reward_scope_id<>new.id and not exists(select 1 from public.question_sets where id=new.reward_scope_id and status='published') then bad:=true; end if;
 when 'chapters' then
  select exists(select 1 from public.chapter_objectives link join public.learning_objectives o on o.id=link.objective_id where link.chapter_id=new.id and o.status<>'published') into bad;
  if new.cover_media_id is not null and not exists(select 1 from public.media_assets where id=new.cover_media_id and review_status='published') then bad:=true; end if;
 when 'lessons' then
  select exists(select 1 from public.lesson_objectives link join public.learning_objectives o on o.id=link.objective_id where link.lesson_id=new.id and o.status<>'published') into bad;
  if new.reward_scope_id<>new.id and not exists(select 1 from public.lessons where id=new.reward_scope_id and status='published') then bad:=true; end if;
  if exists(select 1 from public.lesson_prerequisites pr join public.lessons l on l.id=pr.prerequisite_lesson_id where pr.lesson_id=new.id and l.status<>'published') then bad:=true; end if;
  if exists(with recursive prior(id,path) as (
   select prerequisite_lesson_id,array[new.id,prerequisite_lesson_id] from public.lesson_prerequisites where lesson_id=new.id
   union all select pr.prerequisite_lesson_id,path||pr.prerequisite_lesson_id from prior p join public.lesson_prerequisites pr on pr.lesson_id=p.id where not p.id=any(path[1:cardinality(path)-1])
  ) select 1 from prior where id=new.id) then bad:=true; end if;
 when 'story_versions' then
  if exists(select 1 from public.story_sources link join public.historical_sources s on s.id=link.source_id where link.story_version_id=new.id and s.status<>'published')
   or exists(select 1 from public.story_objectives link join public.learning_objectives o on o.id=link.objective_id where link.story_version_id=new.id and o.status<>'published')
   or exists(select 1 from public.scenes sc join public.scene_sources link on link.scene_id=sc.id join public.historical_sources s on s.id=link.source_id where sc.story_version_id=new.id and s.status<>'published')
   or exists(select 1 from public.scenes sc join public.scene_claims link on link.scene_id=sc.id join public.historical_claims c on c.id=link.claim_id where sc.story_version_id=new.id and c.review_status<>'published') then bad:=true; end if;
 else null;
 end case;
 if bad then raise exception 'Published content references unapproved source, objective, reward scope or prerequisite' using errcode='22023'; end if;
 return new;
end $$;
do $$ declare t text; begin
 foreach t in array array['historical_claims','learning_documents','media_assets','questions','question_sets','chapters','lessons','story_versions'] loop
  execute format('create trigger validate_links before insert or update on public.%I for each row execute function private.validate_publication_links()',t);
 end loop;
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
