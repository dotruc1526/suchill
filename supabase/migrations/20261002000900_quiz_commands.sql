create function private.submit_quiz(p_user uuid,p_input jsonb,p_mode text) returns jsonb language plpgsql set search_path='' as $$
declare qid uuid:=(p_input->>'questionSetId')::uuid; qs public.question_sets; item record; selected uuid[]; correct uuid[];
 answers jsonb:=p_input->'answers'; answer jsonb; score_value integer:=0; total_value integer; feedback_value jsonb:='[]';
 aid uuid; passed_value boolean; attempt_index integer; explanation_value text;
begin
 select * into qs from public.question_sets where id=qid and status='published' and mode=p_mode;
 if qs.id is null then raise exception 'Question set unavailable' using errcode='P0002'; end if;
 if p_mode='scored' and not exists(select 1 from public.lesson_blocks b join public.lessons l on l.id=b.lesson_id join public.chapters c on c.id=l.chapter_id
  where b.question_set_id=qid and b.kind='quiz' and l.status='published' and c.status='published'
    and not exists(select 1 from public.lesson_prerequisites pr where pr.lesson_id=l.id and not exists(select 1 from public.user_lesson_progress progress where progress.user_id=p_user and progress.lesson_id=pr.prerequisite_lesson_id and progress.status='completed')))
    then raise exception 'Assessment not attached to an unlocked published lesson' using errcode='22023'; end if;
 select count(*) into total_value from public.question_set_items where question_set_id=qid;
 if total_value=0 or jsonb_typeof(answers)<>'array' or jsonb_array_length(answers)<>total_value then raise exception 'Submit exactly all questions' using errcode='22023'; end if;
 if (select count(distinct value->>'questionId') from jsonb_array_elements(answers))<>total_value then raise exception 'Duplicate question answer' using errcode='22023'; end if;
 for item in select q.*,i.order_index from public.question_set_items i join public.questions q on q.id=i.question_id where i.question_set_id=qid order by i.order_index loop
  if item.status<>'published' then raise exception 'Question unavailable' using errcode='P0002'; end if;
  select value into answer from jsonb_array_elements(answers) where (value->>'questionId')::uuid=item.id;
  if answer is null or jsonb_typeof(answer->'selectedOptionIds')<>'array' or jsonb_array_length(answer->'selectedOptionIds')=0 then raise exception 'Missing selected option' using errcode='22023'; end if;
  select array_agg(id order by id) into selected from (select value::uuid id from jsonb_array_elements_text(answer->'selectedOptionIds')) x;
  if cardinality(selected)<>(select count(distinct id) from unnest(selected) x(id)) or exists(select 1 from unnest(selected) x(id) where not exists(select 1 from public.question_options o where o.id=x.id and o.question_id=item.id)) then raise exception 'Invalid option selection' using errcode='22023'; end if;
  select array(select unnest(correct_option_ids) order by 1),explanation into correct,explanation_value from private.question_answer_keys where question_id=item.id;
  if correct is null then raise exception 'Answer key unavailable' using errcode='P0002'; end if;
  if selected=correct then score_value:=score_value+1; end if;
  feedback_value:=feedback_value||jsonb_build_array(jsonb_build_object('questionId',item.id,'outcome',case when selected=correct then 'correct' else 'incorrect' end,'explanation',explanation_value));
 end loop;
 passed_value:=case when p_mode='practice' then true else score_value::numeric/total_value>=qs.pass_threshold end;
 select count(*) into attempt_index from public.learning_attempts where user_id=p_user and activity_id=qid;
 insert into public.learning_attempts(user_id,activity_type,activity_id,activity_version,submission,score,total,passed,retry_index,feedback)
 values(p_user,'quiz',qid,qs.eligibility_version,answers,score_value,total_value,passed_value,attempt_index,feedback_value) returning id into aid;
 insert into public.user_quiz_mastery(user_id,question_set_id,best_score,total,attempts,passed) values(p_user,qid,score_value,total_value,1,passed_value)
 on conflict(user_id,question_set_id) do update set best_score=greatest(public.user_quiz_mastery.best_score,excluded.best_score),
 attempts=public.user_quiz_mastery.attempts+1,passed=public.user_quiz_mastery.passed or excluded.passed,updated_at=now();
 if p_mode='scored' and passed_value then
  perform private.complete_activity(p_user,'quiz',qs.reward_scope_id,qs.eligibility_version,20);
  if score_value::numeric/total_value>=0.8 then perform private.grant_reward(p_user,'quiz_bonus',qs.reward_scope_id,qs.eligibility_version,5); end if;
 end if;
 if p_mode='practice' then return jsonb_build_object('attemptId',aid,'feedback',feedback_value); end if;
 return jsonb_build_object('attemptId',aid,'score',score_value,'total',total_value,'passed',passed_value,'feedback',feedback_value);
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
