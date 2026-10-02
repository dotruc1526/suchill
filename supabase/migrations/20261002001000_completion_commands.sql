create function private.complete_block(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare lid uuid:=(p_input->>'lessonId')::uuid; bid uuid:=(p_input->>'blockId')::uuid; method text:=coalesce(p_input->>'method','standard');
 b public.lesson_blocks; ep public.user_episode_progress; vp public.user_video_progress; v public.story_versions;
 qs public.question_sets; duration numeric; watched numeric; before_xp bigint; already boolean; reason_value text:='policy';
begin
 b:=private.require_block(p_user,lid,bid);
 if method not in ('standard','accessible_fallback','media_fallback') then raise exception 'Unknown completion method' using errcode='22023'; end if;
 select coalesce(sum(xp_delta),0) into before_xp from public.reward_ledger where user_id=p_user;
 select exists(select 1 from public.user_block_completions where user_id=p_user and block_id=bid) into already;
 if already then return private.completion_receipt(p_user,lid,before_xp,true)||jsonb_build_object('blockId',bid,'method',method); end if;
 case b.kind
 when 'text','recap' then
  if method<>'standard' or private.document_json(b.document_id) is null then raise exception 'Document completion invalid' using errcode='22023'; end if;
  reason_value:='explicit';
 when 'visual_novel' then
  if method<>'standard' then raise exception 'Story completion invalid' using errcode='22023'; end if;
  select * into v from public.story_versions where id=b.story_version_id and status='published';
  select * into ep from public.user_episode_progress where user_id=p_user and story_version_id=v.id;
  if ep.user_id is null or not exists(select 1 from public.scenes where id=ep.current_scene_id and story_version_id=v.id and kind='end') then raise exception 'Reach story end first' using errcode='22023'; end if;
  if exists(select 1 from public.scenes s where s.story_version_id=v.id and s.required_check
    and exists(select 1 from public.user_scene_visits visit where visit.user_id=p_user and visit.story_version_id=v.id and visit.scene_id=s.id) and
    not exists(select 1 from public.learning_attempts a where a.user_id=p_user and a.activity_type='knowledge_check' and a.activity_id=s.id and a.activity_version=v.id::text
      and (s.payload->>'policy'<>'retry_until_correct' or a.passed))) then raise exception 'Required story check missing' using errcode='22023'; end if;
  update public.user_episode_progress set status='completed',completed_at=coalesce(completed_at,now()),updated_at=now(),revision=revision+1 where user_id=p_user and story_version_id=v.id;
  perform private.complete_activity(p_user,'episode',v.story_id,v.eligibility_version,20);
 when 'quiz' then
  select * into qs from public.question_sets where id=b.question_set_id and status='published' and mode=b.assessment_mode;
  if qs.id is null or method<>'standard' or not exists(select 1 from public.learning_attempts where user_id=p_user and activity_type='quiz' and activity_id=qs.id and activity_version=qs.eligibility_version and (qs.mode='practice' or passed)) then raise exception 'Required quiz not completed' using errcode='22023'; end if;
  perform private.complete_activity(p_user,'quiz',qs.reward_scope_id,qs.eligibility_version,case when qs.mode='scored' then 20 else 0 end);
 when 'video' then
  select duration_seconds into duration from public.media_assets where id=b.media_asset_id and kind='video' and review_status='published';
  if duration is null then raise exception 'Video unavailable' using errcode='P0002'; end if;
  if method<>'standard' then
   if not exists(select 1 from public.transcripts where media_asset_id=b.media_asset_id) then raise exception 'Approved transcript unavailable' using errcode='22023'; end if;
   if b.knowledge_check_set_id is not null then
    if not exists(select 1 from public.learning_attempts a join public.question_sets q on q.id=a.activity_id where a.user_id=p_user and q.id=b.knowledge_check_set_id and q.status='published' and a.activity_version=q.eligibility_version and (q.mode='practice' or a.passed)) then raise exception 'Fallback check incomplete' using errcode='22023'; end if;
   elsif not exists(select 1 from public.lesson_blocks rb join public.user_block_completions c on c.block_id=rb.id where rb.lesson_id=lid and rb.required and rb.kind='recap' and c.user_id=p_user) then raise exception 'Fallback requires authored recap or check' using errcode='22023'; end if;
   reason_value:=method;
  else
   select * into vp from public.user_video_progress where user_id=p_user and lesson_id=lid and block_id=bid;
   if b.completion_policy<>'optional' and vp.user_id is null then raise exception 'Video not watched' using errcode='22023'; end if;
   select coalesce(sum((value->>'end')::numeric-(value->>'start')::numeric),0) into watched from jsonb_array_elements(coalesce(vp.watched_ranges,'[]'));
   if b.completion_policy='watch_threshold' and watched/duration<0.9 then raise exception 'Watch 90 percent unique duration' using errcode='22023'; end if;
   if b.completion_policy='reach_end' and (coalesce(vp.position_seconds,0)<greatest(0,duration-1) or not exists(select 1 from jsonb_array_elements(vp.watched_ranges) where (value->>'end')::numeric>=greatest(0,duration-1))) then raise exception 'Video end not reached through playback' using errcode='22023'; end if;
  end if;
  if b.knowledge_check_set_id is not null and not exists(select 1 from public.learning_attempts a join public.question_sets q on q.id=a.activity_id where a.user_id=p_user and q.id=b.knowledge_check_set_id and a.activity_version=q.eligibility_version and (q.mode='practice' or a.passed)) then raise exception 'Video knowledge check incomplete' using errcode='22023'; end if;
  update public.user_video_progress set completed=true,updated_at=now(),revision=revision+1 where user_id=p_user and lesson_id=lid and block_id=bid;
 else raise exception 'Unsupported block' using errcode='22023';
 end case;
 insert into public.user_block_completions(user_id,lesson_id,block_id,reason) values(p_user,lid,bid,reason_value);
 perform private.touch_lesson(p_user,lid,bid);
 return private.completion_receipt(p_user,lid,before_xp,false)||jsonb_build_object('blockId',bid,'method',method);
end $$;
create function private.complete_lesson(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare lid uuid:=(p_input->>'lessonId')::uuid; l public.lessons; before_xp bigint; already boolean; xp integer;
begin
 l:=private.require_lesson(p_user,lid);
 select coalesce(sum(xp_delta),0) into before_xp from public.reward_ledger where user_id=p_user;
 select coalesce(status='completed',false) into already from public.user_lesson_progress where user_id=p_user and lesson_id=lid;
 already:=coalesce(already,false);
 if exists(select 1 from public.lesson_blocks b where b.lesson_id=lid and b.required and not (b.kind='video' and b.completion_policy='optional') and not exists(select 1 from public.user_block_completions c where c.block_id=b.id and c.user_id=p_user))
  or not exists(select 1 from public.lesson_blocks where lesson_id=lid) then raise exception 'Required blocks incomplete' using errcode='22023'; end if;
 xp:=case when l.format in ('standard','video','mixed') then 10 else 0 end;
 perform private.complete_activity(p_user,'lesson',l.reward_scope_id,l.eligibility_version,xp,l.required);
 insert into public.user_lesson_progress(user_id,lesson_id,status,completed_at,revision) values(p_user,lid,'completed',now(),1)
 on conflict(user_id,lesson_id) do update set status='completed',completed_at=coalesce(public.user_lesson_progress.completed_at,now()),updated_at=now(),revision=public.user_lesson_progress.revision+1;
 return private.completion_receipt(p_user,lid,before_xp,already);
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
