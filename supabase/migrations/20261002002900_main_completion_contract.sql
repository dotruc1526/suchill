-- Preserve accepted M3 completion contract with server-owned receipts.
-- Published lesson row IDs identify immutable content versions; reward scopes remain separate.
create table private.m3_completion_receipts (
 user_id uuid not null references auth.users on delete cascade,
 lesson_id uuid not null references public.lessons on delete restrict,
 receipt jsonb not null, primary key(user_id,lesson_id)
);
alter table private.m3_completion_receipts enable row level security;
revoke all on private.m3_completion_receipts from public,anon,authenticated;
create function private.m3_receipt(p_user uuid,p_lesson uuid,p_granted uuid[] default '{}'::uuid[])
returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('userId',p_user,'lessonId',l.id,'contentVersionId',l.id,
 'confirmedAt',p.completed_at,'method',case
 when exists(select 1 from public.user_block_completions c join public.lesson_blocks b on b.id=c.block_id where c.user_id=p_user and c.lesson_id=l.id and b.required and c.reason='accessible_fallback') then 'accessible_fallback'
 when exists(select 1 from public.user_block_completions c join public.lesson_blocks b on b.id=c.block_id where c.user_id=p_user and c.lesson_id=l.id and b.required and c.reason='media_fallback') then 'media_fallback'
 else 'standard' end,'reason','required_blocks_satisfied',
 'rewards',coalesce((select jsonb_agg(jsonb_build_object('rewardType',q.reward_type,'activityId',q.activity_id,
 'eligibilityVersion',q.eligibility_version,'eligibilityKey',q.idempotency_key,
 'status',case when q.id=any(p_granted) then 'granted' else 'already_granted' end,
 'xpDelta',case when q.id=any(p_granted) then q.xp_delta else 0 end) order by q.id)
 from public.reward_ledger q where q.user_id=p_user and
 ((q.reward_type='lesson' and q.activity_id=l.reward_scope_id and q.eligibility_version=l.eligibility_version)
 or exists(select 1 from public.lesson_blocks b join public.story_versions v on v.id=b.story_version_id
 where b.lesson_id=l.id and b.required and q.reward_type='episode' and q.activity_id=v.story_id and q.eligibility_version=v.eligibility_version)
 or exists(select 1 from public.lesson_blocks b join public.question_sets qs on qs.id=b.question_set_id
 where b.lesson_id=l.id and b.required and b.assessment_mode='scored' and q.reward_type in ('quiz','quiz_bonus')
 and q.activity_id=qs.reward_scope_id and q.eligibility_version=qs.eligibility_version))), '[]'::jsonb))
 from public.lessons l join public.user_lesson_progress p on p.lesson_id=l.id and p.user_id=p_user
 where l.id=p_lesson and p.status='completed' and p.completed_at is not null
$$;
create function public.learning_m3_read(p_kind text,p_id uuid default null,p_expected_subject uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); result jsonb; a jsonb;
begin
 if actor is null or actor is distinct from p_expected_subject then raise exception 'Account required' using errcode='42501'; end if;
 if p_kind='completion' then
  perform private.require_lesson(actor,p_id);
  select receipt into result from private.m3_completion_receipts where user_id=actor and lesson_id=p_id;
  return coalesce(result,private.m3_receipt(actor,p_id));
 elsif p_kind='summary' then
  a:=private.account_json(actor);
  return a-'completedLessons'-'achievements'||jsonb_build_object('locale',(select locale from public.profiles where id=actor),
   'requiredLessonCount',(select count(*) from public.user_lesson_progress p join public.lessons l on l.id=p.lesson_id where p.user_id=actor and p.status='completed' and l.required),
   'achievements','[]'::jsonb);
 end if;
 raise exception 'Unknown read' using errcode='22023';
end $$;
create function public.learning_m3_complete(p_input jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); lid uuid:=(p_input->>'lessonId')::uuid; l public.lessons;
 prior private.operations; signature_value jsonb; v_receipt jsonb; before_ids uuid[]; granted uuid[]; current_block public.lesson_blocks; reasons jsonb; already boolean;
begin
 if actor is null or actor::text is distinct from p_input->>'expectedSubject' then raise exception 'Account required' using errcode='42501'; end if;
 perform 1 from public.profiles where id=actor for update;
 l:=private.require_lesson(actor,lid);
 if jsonb_typeof(p_input)<>'object' or exists(select 1 from jsonb_object_keys(p_input) k where k not in ('lessonId','operationId','expectedSubject'))
 or p_input->>'operationId' is null or length(p_input->>'operationId') not between 1 and 200 then
 raise exception 'Invalid command' using errcode='22023'; end if;
 signature_value:=jsonb_build_object('kind','m3_complete_lesson','input',p_input-'operationId'-'expectedSubject');
 select * into prior from private.operations where user_id=actor and operation_id=p_input->>'operationId';
 if prior.user_id is not null then
  if prior.signature<>signature_value then raise exception 'Operation conflict' using errcode='PT409'; end if;
  if prior.receipt is not null then return prior.receipt; end if;
 else
  insert into private.operations(user_id,operation_id,signature) values(actor,p_input->>'operationId',signature_value);
 end if;
 select exists(select 1 from public.user_lesson_progress where user_id=actor and lesson_id=lid and status='completed') into already;
 select coalesce(array_agg(id),'{}'::uuid[]) into before_ids from public.reward_ledger where user_id=actor;
 -- Text requires explicit acknowledgement. Other blocks are verified by trusted policies.
 select jsonb_agg(jsonb_build_object('blockId',b.id,'reason','required_evidence_missing')) into reasons
 from public.lesson_blocks b where b.lesson_id=lid and b.required and b.kind in ('text','recap')
 and not exists(select 1 from public.user_block_completions c where c.user_id=actor and c.block_id=b.id);
 if reasons is not null then return jsonb_build_object('kind','ineligible','reasons',reasons); end if;
 if not exists(select 1 from public.lesson_blocks where lesson_id=lid and required and not(kind='video' and completion_policy='optional')) then
  raise exception 'No required activity' using errcode='22023'; end if;
 begin
  for current_block in select * from public.lesson_blocks where lesson_id=lid and required and kind not in ('text','recap') and not(kind='video' and completion_policy='optional') loop
   if not exists(select 1 from public.user_block_completions c where c.user_id=actor and c.block_id=current_block.id) then
    perform private.complete_block(actor,jsonb_build_object('lessonId',lid,'blockId',current_block.id,'method','standard'));
   end if;
  end loop;
  perform private.complete_lesson(actor,jsonb_build_object('lessonId',lid));
 exception when sqlstate '22023' then
  select jsonb_agg(jsonb_build_object('blockId',id,'reason','required_evidence_missing')) into reasons
  from public.lesson_blocks where lesson_id=lid and required and kind not in ('text','recap') and not(kind='video' and completion_policy='optional');
  return jsonb_build_object('kind','ineligible','reasons',coalesce(reasons,'[]'::jsonb));
 end;
 select coalesce(array_agg(id),'{}'::uuid[]) into granted from public.reward_ledger where user_id=actor and not(id=any(before_ids));
 v_receipt:=private.m3_receipt(actor,lid,granted);
 insert into private.m3_completion_receipts values(actor,lid,v_receipt) on conflict(user_id,lesson_id) do nothing;
 v_receipt:=jsonb_build_object('kind',case when already then 'already_completed' else 'completed' end,'receipt',v_receipt);
 update private.operations set receipt=v_receipt where user_id=actor and operation_id=p_input->>'operationId';
 return v_receipt;
end $$;
revoke all on function private.m3_receipt(uuid,uuid,uuid[]) from public,anon,authenticated;
revoke all on function public.learning_m3_read(text,uuid,uuid),public.learning_m3_complete(jsonb) from public,anon;
grant execute on function public.learning_m3_read(text,uuid,uuid),public.learning_m3_complete(jsonb) to authenticated;
notify pgrst,'reload schema';

alter function private.lesson_json(uuid) rename to lesson_json_before_m3;
create function private.lesson_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select private.lesson_json_before_m3(p_id)||jsonb_build_object('contentVersionId',p_id)
$$;
revoke all on function private.lesson_json_before_m3(uuid),private.lesson_json(uuid) from public,anon,authenticated;
