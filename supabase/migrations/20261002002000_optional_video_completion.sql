-- Roll forward the optional video policy for stacks that applied the earlier completion RPC.
-- Optional media may record engagement, but cannot prevent its parent lesson from completing.
create or replace function private.complete_lesson(p_user uuid,p_input jsonb) returns jsonb language plpgsql set search_path='' as $$
declare lid uuid:=(p_input->>'lessonId')::uuid; l public.lessons; before_xp bigint; already boolean; xp integer;
begin
 l:=private.require_lesson(p_user,lid);
 select coalesce(sum(xp_delta),0) into before_xp from public.reward_ledger where user_id=p_user;
 select coalesce(status='completed',false) into already from public.user_lesson_progress where user_id=p_user and lesson_id=lid;
 already:=coalesce(already,false);
 if exists(select 1 from public.lesson_blocks b where b.lesson_id=lid and b.required
   and not (b.kind='video' and b.completion_policy='optional')
   and not exists(select 1 from public.user_block_completions c where c.block_id=b.id and c.user_id=p_user))
  or not exists(select 1 from public.lesson_blocks where lesson_id=lid) then raise exception 'Required blocks incomplete' using errcode='22023'; end if;
 xp:=case when l.format in ('standard','video','mixed') then 10 else 0 end;
 perform private.complete_activity(p_user,'lesson',l.reward_scope_id,l.eligibility_version,xp,l.required);
 insert into public.user_lesson_progress(user_id,lesson_id,status,completed_at,revision) values(p_user,lid,'completed',now(),1)
 on conflict(user_id,lesson_id) do update set status='completed',completed_at=coalesce(public.user_lesson_progress.completed_at,now()),updated_at=now(),revision=public.user_lesson_progress.revision+1;
 return private.completion_receipt(p_user,lid,before_xp,already);
end $$;
revoke all on function private.complete_lesson(uuid,jsonb) from public,anon,authenticated;
