-- Restore optional trusted telemetry on canonical completion without rewriting029.
-- The public RPC keeps its OID/ACL; the original immutable behavior moves into a private helper.
do $migration$
declare body text;
begin
 select prosrc into body from pg_proc where oid='public.learning_m3_complete(jsonb)'::regprocedure;
 execute format('create function private.m3_complete_before_analytics(p_input jsonb) returns jsonb language plpgsql security definer set search_path = '''' as %L',body);
end $migration$;
revoke all on function private.m3_complete_before_analytics(jsonb) from public,anon,authenticated;

create or replace function public.learning_m3_complete(p_input jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); lid uuid:=(p_input->>'lessonId')::uuid; result jsonb;
 reward_before bigint; streak_before bigint; reward_after bigint; streak_after bigint;
 before_blocks uuid[]; replay boolean; completed_block record;
begin
 if actor is null or actor::text is distinct from p_input->>'expectedSubject' then
  raise exception 'Account required' using errcode='42501';
 end if;
 -- Snapshot after the same owner lock as029, so concurrent requests cannot author duplicate events.
 perform 1 from public.profiles where id=actor for update;
 if not found then raise exception 'Account required' using errcode='42501'; end if;
 select exists(select 1 from private.operations where user_id=actor
  and operation_id=p_input->>'operationId' and receipt is not null) into replay;
 select count(*) into reward_before from public.reward_ledger where user_id=actor;
 select count(*) into streak_before from public.streak_days where user_id=actor;
 select coalesce(array_agg(block_id),'{}'::uuid[]) into before_blocks
  from public.user_block_completions where user_id=actor and lesson_id=lid;
 result:=private.m3_complete_before_analytics(p_input);
 if result->>'kind'='completed' and not replay then
  -- One subtransaction covers only optional analytics. Its failure never reverses learning/XP/receipts.
  begin
   select count(*) into reward_after from public.reward_ledger where user_id=actor;
   select count(*) into streak_after from public.streak_days where user_id=actor;
   for completed_block in select block_id,reason from public.user_block_completions
    where user_id=actor and lesson_id=lid and not(block_id=any(before_blocks)) order by block_id loop
    perform private.command_analytics(actor,'complete_block',jsonb_build_object('lessonId',lid,'blockId',completed_block.block_id),
     jsonb_build_object('alreadyCompleted',false,'method',case when completed_block.reason in ('accessible_fallback','media_fallback')
      then completed_block.reason else 'standard' end),false,reward_after,streak_after);
   end loop;
   perform private.command_analytics(actor,'complete_lesson',p_input,jsonb_build_object('alreadyCompleted',false),
    false,reward_before,streak_before);
  exception when others then null;
  end;
 end if;
 return result;
end $$;
revoke all on function public.learning_m3_complete(jsonb) from public,anon;
grant execute on function public.learning_m3_complete(jsonb) to authenticated;
notify pgrst,'reload schema';
