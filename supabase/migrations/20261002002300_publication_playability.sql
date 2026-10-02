-- Published contracts must be playable and resolve through the same safe Storage
-- path rules as the adapter. Reject invalid drafts instead of publishing a trap.
create function private.valid_published_storage_ref(p_ref text) returns boolean language sql immutable set search_path='' as $$
 select p_ref is not null and p_ref like 'published-media/%'
  and p_ref !~ E'\\\\' and not exists(select 1 from unnest(string_to_array(substring(p_ref from 17),'/')) segment where segment in ('','.','..'))
$$;
create function private.validate_playability() returns trigger language plpgsql set search_path='' as $$
begin
 if coalesce(to_jsonb(new)->>'status',to_jsonb(new)->>'review_status')<>'published' then return new; end if;
 case tg_table_name
 when 'story_versions' then
  if exists(select 1 from public.scenes s where s.story_version_id=new.id and s.kind='choice'
   and exists(select 1 from public.scene_choices c where c.scene_id=s.id and c.kind='knowledge_check')
   and not exists(select 1 from public.scene_choices c join private.scene_answer_keys a on a.choice_id=c.id where c.scene_id=s.id and a.is_correct))
   or exists(select 1 from public.scenes s join public.scene_choices c on c.scene_id=s.id
    left join private.scene_answer_keys a on a.choice_id=c.id where s.story_version_id=new.id
    and c.next_scene_id is null and (s.payload->>'policy'='continue_after_feedback' or c.kind<>'knowledge_check' or a.is_correct)) then
   raise exception 'Knowledge check needs a correct option and advancing choices need targets' using errcode='22023';
  end if;
 when 'questions' then
  if exists(select 1 from private.question_answer_keys a where a.question_id=new.id
   and cardinality(a.correct_option_ids)<>(select count(distinct option_id) from unnest(a.correct_option_ids) option_id)) then
   raise exception 'Answer key cannot repeat an option' using errcode='22023';
  end if;
 when 'media_assets' then
  if not private.valid_published_storage_ref(new.storage_ref)
   or new.duration_seconds is not null and new.duration_seconds::text in ('NaN','Infinity','-Infinity')
   or exists(select 1 from public.caption_tracks c where c.media_asset_id=new.id and not private.valid_published_storage_ref(c.storage_ref))
   or exists(select 1 from public.transcripts tr where tr.media_asset_id=new.id and not private.valid_published_storage_ref(tr.storage_ref)) then
   raise exception 'Published media requires normalized paths and finite duration' using errcode='22023';
  end if;
 else null;
 end case;
 return new;
end $$;
create trigger validate_playability before insert or update on public.story_versions for each row execute function private.validate_playability();
create trigger validate_playability before insert or update on public.questions for each row execute function private.validate_playability();
create trigger validate_playability before insert or update on public.media_assets for each row execute function private.validate_playability();
revoke all on function private.valid_published_storage_ref(text),private.validate_playability() from public,anon,authenticated;
