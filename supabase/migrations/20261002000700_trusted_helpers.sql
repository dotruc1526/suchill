create function private.require_lesson(p_user uuid,p_lesson uuid) returns public.lessons language plpgsql set search_path='' as $$
declare l public.lessons;
begin
 select * into l from public.lessons where id=p_lesson and status='published';
 if l.id is null or not exists(select 1 from public.chapters where id=l.chapter_id and status='published') then raise exception 'Lesson unavailable' using errcode='P0002'; end if;
 if exists(select 1 from public.lesson_prerequisites pr where pr.lesson_id=l.id and not exists(select 1 from public.user_lesson_progress p where p.user_id=p_user and p.lesson_id=pr.prerequisite_lesson_id and p.status='completed')) then
   raise exception 'Prerequisite incomplete' using errcode='22023';
 end if;
 return l;
end $$;
create function private.require_block(p_user uuid,p_lesson uuid,p_block uuid) returns public.lesson_blocks language plpgsql set search_path='' as $$
declare b public.lesson_blocks;
begin
 perform private.require_lesson(p_user,p_lesson);
 select * into b from public.lesson_blocks where id=p_block and lesson_id=p_lesson;
 if b.id is null then raise exception 'Block unavailable' using errcode='P0002'; end if;
 return b;
end $$;
create function private.touch_lesson(p_user uuid,p_lesson uuid,p_block uuid,p_expected bigint default null) returns void language plpgsql set search_path='' as $$
declare old_order integer; new_order integer; prior public.user_lesson_progress;
begin
 select * into prior from public.user_lesson_progress where user_id=p_user and lesson_id=p_lesson for update;
 if p_expected is not null and p_expected<>coalesce(prior.revision,0) then raise exception 'Stale checkpoint revision' using errcode='40001'; end if;
 select order_index into old_order from public.lesson_blocks where id=prior.current_block_id;
 select order_index into new_order from public.lesson_blocks where id=p_block and lesson_id=p_lesson;
 insert into public.user_lesson_progress(user_id,lesson_id,current_block_id,revision) values(p_user,p_lesson,p_block,1)
 on conflict(user_id,lesson_id) do update set
 current_block_id=case when public.user_lesson_progress.status='completed' then public.user_lesson_progress.current_block_id
   when p_expected is not null or old_order is null or new_order>=old_order then excluded.current_block_id else public.user_lesson_progress.current_block_id end,
 updated_at=now(),revision=public.user_lesson_progress.revision+1;
end $$;
create function private.grant_reward(p_user uuid,p_type text,p_activity uuid,p_version text,p_xp integer) returns integer language plpgsql set search_path='' as $$
declare granted integer;
begin
 insert into public.reward_ledger(user_id,reward_type,activity_id,eligibility_version,xp_delta,idempotency_key)
 values(p_user,p_type,p_activity,p_version,p_xp,jsonb_build_array(p_user,p_type,p_activity,p_version)::text)
 on conflict(user_id,reward_type,activity_id,eligibility_version) do nothing returning xp_delta into granted;
 return coalesce(granted,0);
end $$;
create function private.qualify_streak(p_user uuid,p_activity uuid) returns void language plpgsql set search_path='' as $$
declare tz text; day date; prior public.user_streaks; latest public.streak_days; added date; current_value integer;
begin
 select account_timezone into tz from public.user_settings where user_id=p_user;
 day:=(now() at time zone tz)::date;
 select * into prior from public.user_streaks where user_id=p_user for update;
 select * into latest from public.streak_days where user_id=p_user order by qualified_at desc limit 1;
 -- A timezone change cannot qualify twice while the previous timezone is still on the qualified day.
 if latest.user_id is not null and latest.timezone<>tz and (now() at time zone latest.timezone)::date<=latest.local_date then return; end if;
 if prior.last_qualified_local_date is not null and day<=prior.last_qualified_local_date then return; end if;
 insert into public.streak_days(user_id,local_date,timezone,activity_id) values(p_user,day,tz,p_activity)
 on conflict(user_id,local_date) do nothing returning local_date into added;
 if added is null then return; end if;
 current_value:=case when prior.last_qualified_local_date=day-1 then prior.current_streak+1 else 1 end;
 update public.user_streaks set current_streak=current_value,longest_streak=greatest(longest_streak,current_value),last_qualified_local_date=day,updated_at=now() where user_id=p_user;
end $$;
create function private.complete_activity(p_user uuid,p_type text,p_activity uuid,p_version text,p_xp integer,p_qualifies boolean default true) returns boolean language plpgsql set search_path='' as $$
declare inserted uuid;
begin
 insert into public.activity_completions(user_id,activity_type,activity_id,eligibility_version) values(p_user,p_type,p_activity,p_version)
 on conflict(user_id,activity_type,activity_id,eligibility_version) do nothing returning activity_id into inserted;
 if inserted is null then return false; end if;
 if p_xp>0 then perform private.grant_reward(p_user,p_type,p_activity,p_version,p_xp); end if;
 if p_qualifies then perform private.qualify_streak(p_user,p_activity); end if;
 return true;
end $$;
create function private.completion_receipt(p_user uuid,p_lesson uuid,p_before bigint,p_already boolean) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('status','confirmed','lessonId',p_lesson,'xpGranted',(a->>'totalXp')::bigint-p_before,
 'totalXp',(a->>'totalXp')::bigint,'currentStreak',(a->>'currentStreak')::integer,'alreadyCompleted',p_already)
 from (select private.account_json(p_user) a) s
$$;
create function private.merge_ranges(p_ranges jsonb,p_duration numeric) returns jsonb language plpgsql set search_path='' as $$
declare r record; current_start numeric; current_end numeric; result jsonb:='[]';
begin
 if jsonb_typeof(p_ranges)<>'array' then raise exception 'Watched ranges must be an array' using errcode='22023'; end if;
 for r in select (value->>'start')::numeric s,(value->>'end')::numeric e from jsonb_array_elements(p_ranges) order by (value->>'start')::numeric,(value->>'end')::numeric loop
  if r.s is null or r.e is null or r.s<0 or r.e<=r.s or r.e>p_duration or r.s='NaN'::numeric or r.e='NaN'::numeric then raise exception 'Invalid watched range' using errcode='22023'; end if;
  if current_start is null then current_start:=r.s; current_end:=r.e;
  elsif r.s<=current_end then current_end:=greatest(current_end,r.e);
  else result:=result||jsonb_build_array(jsonb_build_object('start',current_start,'end',current_end)); current_start:=r.s; current_end:=r.e;
  end if;
 end loop;
 if current_start is not null then result:=result||jsonb_build_array(jsonb_build_object('start',current_start,'end',current_end)); end if;
 return result;
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
