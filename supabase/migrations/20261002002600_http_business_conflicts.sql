-- Business rejection is final for its original input, not a serialization retry.
-- PostgREST14 retries SQLSTATE40001 indefinitely. Keep genuine engine-level
-- serialization failures unchanged and replace only our intentional RAISE codes.
do $business_conflicts$
declare
  function_id regprocedure;
  definition text;
  patched text;
begin
  foreach function_id in array array[
    'private.touch_lesson(uuid,uuid,uuid,bigint)'::regprocedure,
    'private.save_episode_checkpoint(uuid,jsonb)'::regprocedure,
    'private.record_choice(uuid,jsonb)'::regprocedure,
    'private.save_video_position(uuid,jsonb)'::regprocedure,
    'private.update_settings(uuid,jsonb)'::regprocedure,
    'private.complete_daily_review(uuid,jsonb)'::regprocedure,
    'public.learning_command(text,jsonb)'::regprocedure
  ] loop
    definition := pg_get_functiondef(function_id);
    patched := replace(definition, 'errcode=''40001''', 'errcode=''PT409''');
    if patched = definition then
      if strpos(definition, 'errcode=''PT409''') = 0 then
        raise exception 'Expected business conflict declaration absent in %', function_id;
      end if;
    else
      -- CREATE OR REPLACE preserves identity, owner, ACLs, SECURITY DEFINER
      -- and search_path. No ownership, data or reward policy changes.
      execute patched;
    end if;
  end loop;
end
$business_conflicts$;
notify pgrst, 'reload schema';
