create function private.update_settings(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare tz text:=p_input->>'timezone'; prior public.user_settings; key text;
begin
 for key in select jsonb_object_keys(p_input) loop
  if key not in ('operationId','soundMuted','reducedMotion','locale','timezone','analyticsEnabled','displayName') then raise exception 'Unknown settings field' using errcode='22023'; end if;
 end loop;
 if p_input ? 'locale' and p_input->>'locale'<>'vi-VN' then raise exception 'Unsupported locale' using errcode='22023'; end if;
 if p_input ? 'displayName' and (jsonb_typeof(p_input->'displayName')<>'string' or length(p_input->>'displayName')>100) then raise exception 'Invalid display name' using errcode='22023'; end if;
 if exists(select 1 from jsonb_each(p_input) e where e.key in ('soundMuted','reducedMotion','analyticsEnabled') and jsonb_typeof(e.value)<>'boolean') then raise exception 'Settings flags must be booleans' using errcode='22023'; end if;
 select * into prior from public.user_settings where user_id=p_user for update;
 if tz is not null and tz<>prior.account_timezone then
  if not exists(select 1 from pg_timezone_names where name=tz) then raise exception 'Invalid IANA timezone' using errcode='22023'; end if;
  if prior.timezone_changed_at>now()-interval '7 days' then raise exception 'Timezone change cooldown is seven days' using errcode='40001'; end if;
  insert into private.audit_events(user_id,kind,payload) values(p_user,'timezone_changed',jsonb_build_object('from',prior.account_timezone,'to',tz));
 end if;
 update public.user_settings set sound_enabled=coalesce(not (p_input->>'soundMuted')::boolean,sound_enabled),
 reduced_motion=coalesce((p_input->>'reducedMotion')::boolean,reduced_motion),analytics_enabled=coalesce((p_input->>'analyticsEnabled')::boolean,analytics_enabled),
 account_timezone=coalesce(tz,account_timezone),timezone_changed_at=case when tz is not null and tz<>prior.account_timezone then now() else timezone_changed_at end,
 updated_at=now() where user_id=p_user;
 update public.profiles set display_name=coalesce(p_input->>'displayName',display_name),updated_at=now() where id=p_user;
 return private.settings_json(p_user);
end $$;
create function private.track_event(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare event_name text:=p_input->>'name'; props jsonb:=coalesce(p_input->'properties','{}'); kv record;
begin
 if event_name not in ('lesson_started','lesson_resumed','block_completed','episode_started','scene_viewed','choice_selected',
 'knowledge_check_submitted','video_started','video_completed','media_error','fallback_used','lesson_completed','reward_granted','streak_qualified') then raise exception 'Unknown analytics event' using errcode='22023'; end if;
 if jsonb_typeof(props)<>'object' or pg_column_size(props)>2048 then raise exception 'Invalid analytics payload' using errcode='22023'; end if;
 for kv in select * from jsonb_each(props) loop
  if kv.key not in ('lesson_id','version','block_id','kind','story_version_id','scene_id','choice_id','choice_kind','activity_id','attempt_index','result','media_id',
    'method','error_category','fallback_type','completion_method','reward_type','xp_delta','local_date','current_streak',
    'lessonId','blockId','storyVersionId','sceneId','choiceId','choiceKind','activityId','attemptIndex','mediaId','errorCategory','fallbackType','completionMethod','rewardType','xpDelta','localDate','currentStreak')
    or jsonb_typeof(kv.value) not in ('string','number','boolean') or length(kv.value::text)>202 then raise exception 'Analytics field disallowed' using errcode='22023'; end if;
 end loop;
 if (select analytics_enabled from public.user_settings where user_id=p_user) then
  insert into public.analytics_events(user_id,event_name,properties) values(p_user,event_name,props);
 end if;
 return jsonb_build_object('accepted',true);
end $$;
create function private.complete_daily_review(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare aid uuid:=(p_input->>'attemptId')::uuid; day text; before_xp bigint; fresh boolean;
begin
 select (now() at time zone account_timezone)::date::text into day from public.user_settings where user_id=p_user;
 if not exists(select 1 from public.learning_attempts a join public.question_sets q on q.id=a.activity_id join public.user_settings s on s.user_id=a.user_id
  where a.id=aid and a.user_id=p_user and a.activity_type='quiz' and q.mode='practice' and q.status='published'
  and a.total>=3 and a.activity_version=q.eligibility_version and (a.attempted_at at time zone s.account_timezone)::date=day::date) then
  raise exception 'Daily review requires a same-day practice attempt of at least three questions' using errcode='22023';
 end if;
 select coalesce(sum(xp_delta),0) into before_xp from public.reward_ledger where user_id=p_user;
 fresh:=private.complete_activity(p_user,'daily_review','00000000-0000-0000-0000-000000000000',day,5);
 return jsonb_build_object('status','confirmed','xpGranted',(private.account_json(p_user)->>'totalXp')::bigint-before_xp,
  'totalXp',(private.account_json(p_user)->>'totalXp')::bigint,'alreadyCompleted',not fresh);
end $$;
create function public.learning_command(p_kind text,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); op text:=p_input->>'operationId'; prior private.operations; result jsonb; signature_value jsonb;
begin
 if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if jsonb_typeof(p_input)<>'object' or p_input ? 'userId' or p_input ? 'user_id' then raise exception 'Invalid command input' using errcode='22023'; end if;
 if p_input ? 'expectedSubject' and ((p_input->>'expectedSubject')::uuid is distinct from uid) then raise exception 'Session changed before command dispatch' using errcode='42501'; end if;
 p_input:=p_input-'expectedSubject';
 if op is null and p_kind in ('update_settings','track') then op:=gen_random_uuid()::text; end if;
 if op is null or length(op) not between 1 and 200 then raise exception 'Operation identity required' using errcode='22023'; end if;
 -- The account row serializes all operations for a user. Unique operation and ledger keys remain authoritative.
 perform 1 from public.profiles where id=uid for update;
 if not found then raise exception 'Profile unavailable' using errcode='42501'; end if;
 signature_value:=jsonb_build_object('kind',p_kind,'input',p_input-'operationId');
 select * into prior from private.operations where user_id=uid and operation_id=op;
 if prior.user_id is not null then
  if prior.signature<>signature_value then raise exception 'Operation ID already used for another payload' using errcode='40001'; end if;
  return prior.receipt;
 end if;
 insert into private.operations(user_id,operation_id,signature) values(uid,op,signature_value);
 case p_kind
 when 'save_lesson_checkpoint' then result:=private.save_lesson_checkpoint(uid,p_input);
 when 'save_episode_checkpoint' then result:=private.save_episode_checkpoint(uid,p_input);
 when 'record_choice' then result:=private.record_choice(uid,p_input);
 when 'save_video_position' then result:=private.save_video_position(uid,p_input);
 when 'complete_block' then result:=private.complete_block(uid,p_input);
 when 'complete_lesson' then result:=private.complete_lesson(uid,p_input);
 when 'submit_practice' then result:=private.submit_quiz(uid,p_input,'practice');
 when 'submit_scored' then result:=private.submit_quiz(uid,p_input,'scored');
 when 'update_settings' then result:=private.update_settings(uid,p_input);
 when 'track' then result:=private.track_event(uid,p_input);
 when 'complete_daily_review' then result:=private.complete_daily_review(uid,p_input);
 else raise exception 'Unknown command kind' using errcode='22023';
 end case;
 update private.operations set receipt=result where user_id=uid and operation_id=op;
 return result;
exception when invalid_text_representation or numeric_value_out_of_range or not_null_violation then
 raise exception 'Invalid command value' using errcode='22023';
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
revoke all on function public.learning_command(text,jsonb) from public,anon;
grant execute on function public.learning_command(text,jsonb) to authenticated;
