create table private.daily_review_claims (
 user_id uuid not null references auth.users(id) on delete cascade, local_date date not null, timezone text not null,
 attempt_id uuid not null references public.learning_attempts(id) on delete cascade, claimed_at timestamptz not null default now(),
 primary key(user_id,local_date), unique(user_id,attempt_id)
);
create or replace function private.complete_daily_review(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare aid uuid:=(p_input->>'attemptId')::uuid; qid uuid:=(p_input->>'questionSetId')::uuid; day date; tz text;
 before_xp bigint; fresh boolean; summary jsonb; prior private.daily_review_claims; used private.daily_review_claims;
begin
 select account_timezone into tz from public.user_settings where user_id=p_user;
 day:=(now() at time zone tz)::date;
 if not exists(select 1 from public.learning_attempts a join public.question_sets q on q.id=a.activity_id join public.user_settings s on s.user_id=a.user_id
  where a.id=aid and a.user_id=p_user and a.activity_type='quiz' and q.id=qid and q.mode='practice' and q.daily_review_enabled and q.status='published'
  and a.total>=3 and a.activity_version=q.eligibility_version) then
  raise exception 'Daily review requires an enabled practice set and owned attempt of at least three questions' using errcode='22023';
 end if;
 select coalesce(sum(xp_delta),0) into before_xp from public.reward_ledger where user_id=p_user;
 select * into used from private.daily_review_claims where user_id=p_user and attempt_id=aid;
 if used.user_id is not null then
  summary:=private.account_json(p_user);
  return jsonb_build_object('status','confirmed','xpGranted',0,'totalXp',(summary->>'totalXp')::bigint,'currentStreak',(summary->>'currentStreak')::integer,'alreadyCompleted',true,'localDate',used.local_date);
 end if;
 if not exists(select 1 from public.learning_attempts where id=aid and (attempted_at at time zone tz)::date=day) then raise exception 'Daily review attempt must be from the current account day' using errcode='22023'; end if;
 select * into prior from private.daily_review_claims where user_id=p_user order by claimed_at desc limit 1;
 if prior.user_id is not null and prior.timezone<>tz and (now() at time zone prior.timezone)::date<=prior.local_date then raise exception 'Timezone change cannot create another daily review day' using errcode='40001'; end if;
 insert into private.daily_review_claims(user_id,local_date,timezone,attempt_id) values(p_user,day,tz,aid) on conflict(user_id,local_date) do nothing;
 fresh:=private.complete_activity(p_user,'daily_review','00000000-0000-0000-0000-000000000000',day::text,5);
 summary:=private.account_json(p_user);
 return jsonb_build_object('status','confirmed','xpGranted',(summary->>'totalXp')::bigint-before_xp,
  'totalXp',(summary->>'totalXp')::bigint,'currentStreak',(summary->>'currentStreak')::integer,'alreadyCompleted',not fresh,'localDate',day);
end $$;
revoke all on all tables in schema private from public,anon,authenticated;
revoke all on all functions in schema private from public,anon,authenticated;
