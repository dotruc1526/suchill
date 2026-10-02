-- A reachable branch may still trap the learner in a closed cycle. Every
-- published scene needs a playable route to an end, using actual choice policy.
create function private.validate_story_end_routes() returns trigger language plpgsql set search_path='' as $$
declare blocked boolean;
begin
 if new.status<>'published' then return new; end if;
 with recursive edges(source,target) as (
  select s.id,s.next_scene_id from public.scenes s where s.story_version_id=new.id and s.kind not in ('choice','end') and s.next_scene_id is not null
  union
  select c.scene_id,c.next_scene_id from public.scene_choices c join public.scenes s on s.id=c.scene_id
   left join private.scene_answer_keys a on a.choice_id=c.id
   where s.story_version_id=new.id and c.next_scene_id is not null
    and (c.kind<>'knowledge_check' or s.payload->>'policy'='continue_after_feedback' or a.is_correct)
 ), can_end(id) as (
  select s.id from public.scenes s where s.story_version_id=new.id and s.kind='end'
  union select e.source from edges e join can_end p on p.id=e.target
 ) select exists(select 1 from public.scenes s where s.story_version_id=new.id and not exists(select 1 from can_end p where p.id=s.id)) into blocked;
 if blocked then raise exception 'Every published scene needs a playable route to an end' using errcode='22023'; end if;
 return new;
end $$;
create trigger validate_end_routes before insert or update on public.story_versions for each row execute function private.validate_story_end_routes();
revoke all on function private.validate_story_end_routes() from public,anon,authenticated;
