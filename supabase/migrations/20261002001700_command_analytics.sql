create function private.command_analytics(p_user uuid,p_kind text,p_input jsonb,p_result jsonb,p_started boolean,p_reward_before bigint,p_streak_before bigint) returns void language plpgsql set search_path='' as $$
declare b public.lesson_blocks; row_record record; summary jsonb;
begin
 case p_kind
 when 'save_lesson_checkpoint' then
  perform private.track_event(p_user,jsonb_build_object('name',case when p_started then 'lesson_resumed' else 'lesson_started' end,
   'properties',case when p_started then jsonb_build_object('lesson_id',p_input->>'lessonId','block_id',p_result->>'currentBlockId') else jsonb_build_object('lesson_id',p_input->>'lessonId','version','1') end));
 when 'save_episode_checkpoint' then
  if not p_started then perform private.track_event(p_user,jsonb_build_object('name','episode_started','properties',jsonb_build_object('story_version_id',p_input->>'storyVersionId'))); end if;
  perform private.track_event(p_user,jsonb_build_object('name','scene_viewed','properties',jsonb_build_object('story_version_id',p_input->>'storyVersionId','scene_id',p_input->>'currentSceneId','kind',(select kind from public.scenes where id=(p_input->>'currentSceneId')::uuid))));
 when 'record_choice' then
  if not coalesce((p_input->>'replay')::boolean,false) then
   perform private.track_event(p_user,jsonb_build_object('name','choice_selected','properties',jsonb_build_object('scene_id',p_input->>'sceneId','choice_id',p_input->>'choiceId','choice_kind',(select kind from public.scene_choices where id=(p_input->>'choiceId')::uuid))));
   if p_result->'choiceFeedback'->>'outcome'<>'neutral' then
    perform private.track_event(p_user,jsonb_build_object('name','knowledge_check_submitted','properties',jsonb_build_object('activity_id',p_input->>'sceneId','attempt_index',(select count(*)-1 from public.learning_attempts where user_id=p_user and activity_id=(p_input->>'sceneId')::uuid),'result',p_result->'choiceFeedback'->>'outcome')));
   end if;
  end if;
 when 'save_video_position' then
  if not p_started then perform private.track_event(p_user,jsonb_build_object('name','video_started','properties',jsonb_build_object('media_id',(select media_asset_id from public.lesson_blocks where id=(p_input->>'blockId')::uuid),'block_id',p_input->>'blockId'))); end if;
 when 'complete_block' then
  if not (p_result->>'alreadyCompleted')::boolean then
   select * into b from public.lesson_blocks where id=(p_input->>'blockId')::uuid;
   perform private.track_event(p_user,jsonb_build_object('name','block_completed','properties',jsonb_build_object('lesson_id',b.lesson_id,'block_id',b.id,'kind',b.kind)));
   if b.kind='video' then perform private.track_event(p_user,jsonb_build_object('name','video_completed','properties',jsonb_build_object('media_id',b.media_asset_id,'method',p_result->>'method'))); end if;
   if p_result->>'method'<>'standard' then perform private.track_event(p_user,jsonb_build_object('name','fallback_used','properties',jsonb_build_object('block_id',b.id,'fallback_type',p_result->>'method'))); end if;
  end if;
 when 'complete_lesson' then
  if not (p_result->>'alreadyCompleted')::boolean then perform private.track_event(p_user,jsonb_build_object('name','lesson_completed','properties',jsonb_build_object('lesson_id',p_input->>'lessonId','completion_method','trusted'))); end if;
 when 'submit_practice','submit_scored' then
  perform private.track_event(p_user,jsonb_build_object('name','knowledge_check_submitted','properties',jsonb_build_object('activity_id',p_input->>'questionSetId','attempt_index',(select retry_index from public.learning_attempts where id=(p_result->>'attemptId')::uuid),'result',case when coalesce((p_result->>'passed')::boolean,true) then 'completed' else 'retry' end)));
 else null;
 end case;
 for row_record in select reward_type,xp_delta from public.reward_ledger where user_id=p_user order by occurred_at desc,id desc limit greatest(0,(select count(*) from public.reward_ledger where user_id=p_user)-p_reward_before) loop
  perform private.track_event(p_user,jsonb_build_object('name','reward_granted','properties',jsonb_build_object('reward_type',row_record.reward_type,'xp_delta',row_record.xp_delta)));
 end loop;
 if (select count(*) from public.streak_days where user_id=p_user)>p_streak_before then
  summary:=private.account_json(p_user);
  perform private.track_event(p_user,jsonb_build_object('name','streak_qualified','properties',jsonb_build_object('local_date',(select last_qualified_local_date from public.user_streaks where user_id=p_user),'current_streak',(summary->>'currentStreak')::integer)));
 end if;
end $$;
create or replace function public.learning_command(p_kind text,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); op text:=p_input->>'operationId'; prior private.operations; result jsonb; signature_value jsonb;
 reward_before bigint; streak_before bigint; started boolean:=false;
begin
 if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if jsonb_typeof(p_input) is distinct from 'object' or p_input ? 'userId' or p_input ? 'user_id' then raise exception 'Invalid command input' using errcode='22023'; end if;
 if p_input ? 'expectedSubject' and ((p_input->>'expectedSubject')::uuid is distinct from uid) then raise exception 'Session changed before command dispatch' using errcode='42501'; end if;
 p_input:=p_input-'expectedSubject';
 if op is null and p_kind in ('update_settings','track') then op:=gen_random_uuid()::text; end if;
 if op is null or length(op) not between 1 and 200 then raise exception 'Operation identity required' using errcode='22023'; end if;
 perform 1 from public.profiles where id=uid for update;
 if not found then raise exception 'Profile unavailable' using errcode='42501'; end if;
 signature_value:=jsonb_build_object('kind',p_kind,'input',p_input-'operationId');
 select * into prior from private.operations where user_id=uid and operation_id=op;
 if prior.user_id is not null then
  if prior.signature<>signature_value then raise exception 'Operation ID already used for another payload' using errcode='40001'; end if;
  return prior.receipt;
 end if;
 insert into private.operations(user_id,operation_id,signature) values(uid,op,signature_value);
 select count(*) into reward_before from public.reward_ledger where user_id=uid;
 select count(*) into streak_before from public.streak_days where user_id=uid;
 case p_kind
 when 'save_lesson_checkpoint' then
  select exists(select 1 from public.user_lesson_progress where user_id=uid and lesson_id=(p_input->>'lessonId')::uuid) into started;
  result:=private.save_lesson_checkpoint(uid,p_input);
 when 'save_episode_checkpoint' then
  select exists(select 1 from public.user_episode_progress where user_id=uid and story_version_id=(p_input->>'storyVersionId')::uuid) into started;
  result:=private.save_episode_checkpoint(uid,p_input);
 when 'record_choice' then result:=private.record_choice(uid,p_input);
 when 'save_video_position' then
  select exists(select 1 from public.user_video_progress where user_id=uid and lesson_id=(p_input->>'lessonId')::uuid and block_id=(p_input->>'blockId')::uuid) into started;
  result:=private.save_video_position(uid,p_input);
 when 'complete_block' then result:=private.complete_block(uid,p_input);
 when 'complete_lesson' then result:=private.complete_lesson(uid,p_input);
 when 'submit_practice' then result:=private.submit_quiz(uid,p_input,'practice');
 when 'submit_scored' then result:=private.submit_quiz(uid,p_input,'scored');
 when 'update_settings' then result:=private.update_settings(uid,p_input);
 when 'track' then
  if p_input->>'name' in ('reward_granted','streak_qualified') then raise exception 'Trusted analytics event cannot be client-authored' using errcode='22023'; end if;
  result:=private.track_event(uid,p_input);
 when 'complete_daily_review' then result:=private.complete_daily_review(uid,p_input);
 else raise exception 'Unknown command kind' using errcode='22023';
 end case;
 -- Analytics has its own subtransaction. Failure never reverses completion/reward or prevents receipt replay.
 begin perform private.command_analytics(uid,p_kind,p_input,result,started,reward_before,streak_before); exception when others then null; end;
 update private.operations set receipt=result where user_id=uid and operation_id=op;
 return result;
exception when invalid_text_representation or numeric_value_out_of_range or not_null_violation then raise exception 'Invalid command value' using errcode='22023';
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
revoke all on function public.learning_command(text,jsonb) from public,anon;
grant execute on function public.learning_command(text,jsonb) to authenticated;
