-- Practice UI must receive the authored daily-review eligibility flag from the
-- same trusted question-set projection that supplies its questions.
alter function private.quiz_json(uuid) rename to quiz_json_without_daily_review;
create function private.quiz_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select private.quiz_json_without_daily_review(p_id)||jsonb_build_object('dailyReviewEligible',q.daily_review_enabled)
 from public.question_sets q where q.id=p_id and q.status='published'
$$;
revoke all on function private.quiz_json(uuid),private.quiz_json_without_daily_review(uuid) from public,anon,authenticated;
