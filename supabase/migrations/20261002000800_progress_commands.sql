create function private.save_lesson_checkpoint(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare lid uuid:=(p_input->>'lessonId')::uuid; bid uuid:=(p_input->>'currentBlockId')::uuid; ids jsonb:=coalesce(p_input->'completedBlockIds','[]');
begin
 perform private.require_lesson(p_user,lid);
 if bid is null then select id into bid from public.lesson_blocks where lesson_id=lid order by order_index limit 1; end if;
 perform private.require_block(p_user,lid,bid);
 if jsonb_typeof(ids)<>'array' or exists(select 1 from jsonb_array_elements_text(ids) j(id) where not exists(select 1 from public.user_block_completions c where c.user_id=p_user and c.lesson_id=lid and c.block_id=j.id::uuid)) then
  raise exception 'Checkpoint cannot grant block completion' using errcode='22023';
 end if;
 perform private.touch_lesson(p_user,lid,bid,(p_input->>'expectedRevision')::bigint);
 return private.lesson_progress_json(p_user,lid);
end $$;
create function private.save_episode_checkpoint(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare lid uuid:=(p_input->>'lessonId')::uuid; bid uuid:=(p_input->>'blockId')::uuid; vid uuid:=(p_input->>'storyVersionId')::uuid;
 sid uuid:=(p_input->>'currentSceneId')::uuid; b public.lesson_blocks; v public.story_versions; prior public.user_episode_progress; expected bigint:=(p_input->>'expectedRevision')::bigint;
begin
 b:=private.require_block(p_user,lid,bid);
 select * into v from public.story_versions where id=vid and status='published';
 if b.kind<>'visual_novel' or b.story_version_id<>vid or v.id is null then raise exception 'Story block mismatch' using errcode='22023'; end if;
 if not exists(select 1 from public.scenes where id=sid and story_version_id=vid) then raise exception 'Scene mismatch' using errcode='22023'; end if;
 if jsonb_typeof(p_input->'visitedSceneIds') is distinct from 'array' or exists(select 1 from jsonb_array_elements_text(p_input->'visitedSceneIds') j(id) where not exists(select 1 from public.scenes where id=j.id::uuid and story_version_id=vid)) then raise exception 'Visited scenes invalid' using errcode='22023'; end if;
 select * into prior from public.user_episode_progress where user_id=p_user and story_version_id=vid for update;
 if expected is not null and expected<>coalesce(prior.revision,0) then raise exception 'Stale checkpoint' using errcode='40001'; end if;
 if prior.user_id is null then
  if sid<>v.start_scene_id then raise exception 'Begin at start scene' using errcode='22023'; end if;
  insert into public.user_episode_progress(user_id,story_version_id,current_scene_id,revision) values(p_user,vid,sid,1);
 elsif sid<>prior.current_scene_id and not exists(select 1 from public.user_scene_visits where user_id=p_user and story_version_id=vid and scene_id=sid) then
  if not exists(select 1 from public.scenes where id=prior.current_scene_id and story_version_id=vid and kind<>'choice' and next_scene_id=sid) then raise exception 'Invalid scene transition' using errcode='22023'; end if;
  update public.user_episode_progress set current_scene_id=sid,updated_at=now(),revision=revision+1 where user_id=p_user and story_version_id=vid and status<>'completed';
 end if;
 -- A review of an already visited scene does not rewind the authoritative resume cursor.
 insert into public.user_scene_visits(user_id,story_version_id,scene_id) values(p_user,vid,sid) on conflict do nothing;
 perform private.touch_lesson(p_user,lid,bid);
 return private.episode_progress_json(p_user,vid);
end $$;
create function private.record_choice(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare lid uuid:=(p_input->>'lessonId')::uuid; bid uuid:=(p_input->>'blockId')::uuid; vid uuid:=(p_input->>'storyVersionId')::uuid;
 sid uuid:=(p_input->>'sceneId')::uuid; cid uuid:=(p_input->>'choiceId')::uuid; b public.lesson_blocks; s public.scenes; ch public.scene_choices;
 prior public.user_episode_progress; answer private.scene_answer_keys; locked uuid; next_id uuid; is_retry boolean; feedback jsonb;
begin
 b:=private.require_block(p_user,lid,bid);
 if b.kind<>'visual_novel' or b.story_version_id<>vid or private.story_json(vid) is null then raise exception 'Story mismatch' using errcode='22023'; end if;
 select * into s from public.scenes where id=sid and story_version_id=vid and kind='choice';
 select * into ch from public.scene_choices where id=cid and scene_id=sid;
 if s.id is null or ch.id is null then raise exception 'Choice mismatch' using errcode='22023'; end if;
 select * into answer from private.scene_answer_keys where choice_id=cid;
 feedback:=jsonb_build_object('choiceId',cid,'outcome',case when ch.kind<>'knowledge_check' then 'neutral' when answer.is_correct then 'correct' else 'incorrect' end,
   'message',case when ch.kind='knowledge_check' then answer.explanation else coalesce(ch.response,'') end);
 select * into prior from public.user_episode_progress where user_id=p_user and story_version_id=vid for update;
 if coalesce((p_input->>'replay')::boolean,false) then
  if coalesce(prior.status,'')<>'completed' and (ch.kind='knowledge_check' and not exists(select 1 from public.learning_attempts where user_id=p_user and activity_type='knowledge_check' and activity_id=sid and activity_version=vid::text and submission @> jsonb_build_array(cid))
    or ch.kind<>'knowledge_check' and not exists(select 1 from public.user_choice_selections where user_id=p_user and story_version_id=vid and scene_id=sid and choice_id=cid)) then raise exception 'Choice feedback unavailable before submission' using errcode='22023'; end if;
  return private.episode_progress_json(p_user,vid)||jsonb_build_object('choiceFeedback',feedback);
 end if;
 if prior.user_id is null or prior.current_scene_id<>sid or prior.status='completed' then raise exception 'Choice scene not active' using errcode='40001'; end if;
 if p_input ? 'expectedRevision' and (p_input->>'expectedRevision')::bigint<>prior.revision then raise exception 'Stale choice revision' using errcode='40001'; end if;
 select choice_id into locked from public.user_choice_selections where user_id=p_user and story_version_id=vid and scene_id=sid;
 if locked is not null and locked<>cid then raise exception 'Choice is locked' using errcode='40001'; end if;
 if ch.kind='knowledge_check' then
  if answer.choice_id is null then raise exception 'Knowledge check unavailable' using errcode='P0002'; end if;
  insert into public.learning_attempts(user_id,activity_type,activity_id,activity_version,submission,score,total,passed,retry_index,feedback)
  values(p_user,'knowledge_check',sid,vid::text,jsonb_build_array(cid),case when answer.is_correct then 1 else 0 end,1,answer.is_correct,
   (select count(*) from public.learning_attempts where user_id=p_user and activity_id=sid),jsonb_build_array(feedback));
 end if;
 is_retry:=ch.kind='knowledge_check' and not answer.is_correct and s.payload->>'policy'='retry_until_correct';
 next_id:=case when is_retry then sid else coalesce(ch.next_scene_id,s.next_scene_id,sid) end;
 if not exists(select 1 from public.scenes where id=next_id and story_version_id=vid) then raise exception 'Invalid target scene' using errcode='22023'; end if;
 if not is_retry then insert into public.user_choice_selections(user_id,story_version_id,scene_id,choice_id) values(p_user,vid,sid,cid) on conflict do nothing; end if;
 insert into public.user_scene_visits(user_id,story_version_id,scene_id) values(p_user,vid,next_id) on conflict do nothing;
 update public.user_episode_progress set current_scene_id=next_id,updated_at=now(),revision=revision+1 where user_id=p_user and story_version_id=vid;
 perform private.touch_lesson(p_user,lid,bid);
 return private.episode_progress_json(p_user,vid)||jsonb_build_object('choiceFeedback',feedback);
end $$;
create function private.save_video_position(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare lid uuid:=(p_input->>'lessonId')::uuid; bid uuid:=(p_input->>'blockId')::uuid; b public.lesson_blocks; duration numeric;
 pos numeric:=(p_input->>'positionSeconds')::numeric; prior public.user_video_progress; ranges jsonb; expected bigint:=(p_input->>'expectedRevision')::bigint; watched numeric; elapsed numeric;
begin
 b:=private.require_block(p_user,lid,bid);
 select duration_seconds into duration from public.media_assets where id=b.media_asset_id and kind='video' and review_status='published';
 if b.kind<>'video' or duration is null then raise exception 'Video unavailable' using errcode='P0002'; end if;
 if pos is null or pos<0 or pos>duration or pos='NaN'::numeric then raise exception 'Invalid video position' using errcode='22023'; end if;
 select * into prior from public.user_video_progress where user_id=p_user and lesson_id=lid and block_id=bid for update;
 if expected is not null and expected<>coalesce(prior.revision,0) then raise exception 'Stale video revision' using errcode='40001'; end if;
 ranges:=private.merge_ranges(coalesce(prior.watched_ranges,'[]')||coalesce(p_input->'watchedRanges','[]'),duration);
 if prior.user_id is null and jsonb_array_length(ranges)>0 then raise exception 'Initialize video playback before reporting watched ranges' using errcode='22023'; end if;
 select coalesce(sum((value->>'end')::numeric-(value->>'start')::numeric),0) into watched from jsonb_array_elements(ranges);
 elapsed:=greatest(0,extract(epoch from now()-coalesce(prior.telemetry_started_at,now())));
 if watched>elapsed*2+5 then raise exception 'Watched duration exceeds server playback budget' using errcode='22023'; end if;
 insert into public.user_video_progress(user_id,lesson_id,block_id,position_seconds,watched_ranges,revision) values(p_user,lid,bid,pos,ranges,1)
 on conflict(user_id,lesson_id,block_id) do update set watched_ranges=excluded.watched_ranges,
 position_seconds=case when public.user_video_progress.completed then public.user_video_progress.position_seconds when expected is null then greatest(public.user_video_progress.position_seconds,excluded.position_seconds) else excluded.position_seconds end,
 updated_at=now(),revision=public.user_video_progress.revision+1;
 perform private.touch_lesson(p_user,lid,bid);
 return private.video_progress_json(p_user,lid,bid);
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
