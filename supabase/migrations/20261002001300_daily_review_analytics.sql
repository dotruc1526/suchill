create or replace function private.complete_daily_review(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare aid uuid:=(p_input->>'attemptId')::uuid; qid uuid:=(p_input->>'questionSetId')::uuid; day text; before_xp bigint; fresh boolean; summary jsonb;
begin
 select (now() at time zone account_timezone)::date::text into day from public.user_settings where user_id=p_user;
 if not exists(select 1 from public.learning_attempts a join public.question_sets q on q.id=a.activity_id join public.user_settings s on s.user_id=a.user_id
  where a.id=aid and a.user_id=p_user and a.activity_type='quiz' and q.id=qid and q.mode='practice' and q.daily_review_enabled and q.status='published'
  and a.total>=3 and a.activity_version=q.eligibility_version and (a.attempted_at at time zone s.account_timezone)::date=day::date) then
  raise exception 'Daily review requires an enabled practice set and same-day attempt of at least three questions' using errcode='22023';
 end if;
 select coalesce(sum(xp_delta),0) into before_xp from public.reward_ledger where user_id=p_user;
 fresh:=private.complete_activity(p_user,'daily_review','00000000-0000-0000-0000-000000000000',day,5);
 summary:=private.account_json(p_user);
 return jsonb_build_object('status','confirmed','xpGranted',(summary->>'totalXp')::bigint-before_xp,
  'totalXp',(summary->>'totalXp')::bigint,'currentStreak',(summary->>'currentStreak')::integer,'alreadyCompleted',not fresh,'localDate',day);
end $$;
create or replace function private.track_event(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare event_name text:=p_input->>'name'; props jsonb:=coalesce(p_input->'properties','{}'); kv record; allowed text[];
begin
 allowed:=case event_name
 when 'lesson_started' then array['lesson_id','version'] when 'lesson_resumed' then array['lesson_id','block_id']
 when 'block_completed' then array['lesson_id','block_id','kind'] when 'episode_started' then array['story_version_id']
 when 'scene_viewed' then array['story_version_id','scene_id','kind'] when 'choice_selected' then array['scene_id','choice_id','choice_kind']
 when 'knowledge_check_submitted' then array['activity_id','attempt_index','result'] when 'video_started' then array['media_id','block_id']
 when 'video_completed' then array['media_id','method'] when 'media_error' then array['media_id','error_category']
 when 'fallback_used' then array['block_id','fallback_type'] when 'lesson_completed' then array['lesson_id','completion_method']
 when 'reward_granted' then array['reward_type','xp_delta'] when 'streak_qualified' then array['local_date','current_streak']
 else null end;
 if allowed is null then raise exception 'Unknown analytics event' using errcode='22023'; end if;
 if jsonb_typeof(props)<>'object' or pg_column_size(props)>2048 then raise exception 'Invalid analytics payload' using errcode='22023'; end if;
 for kv in select * from jsonb_each(props) loop
  if not(kv.key=any(allowed)) or jsonb_typeof(kv.value) not in ('string','number','boolean')
   or jsonb_typeof(kv.value)='string' and (length(kv.value#>>'{}')>128 or (kv.value#>>'{}')~E'[\r\n@]') then raise exception 'Analytics field disallowed' using errcode='22023'; end if;
 end loop;
 if (select analytics_enabled from public.user_settings where user_id=p_user) then insert into public.analytics_events(user_id,event_name,properties) values(p_user,event_name,props); end if;
 return jsonb_build_object('accepted',true);
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
