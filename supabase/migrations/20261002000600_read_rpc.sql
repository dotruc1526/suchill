create function private.lesson_progress_json(p_user uuid,p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_strip_nulls(jsonb_build_object('userId',p.user_id,'lessonId',p.lesson_id,'status',p.status,'currentBlockId',p.current_block_id,
 'completedBlockIds',coalesce((select jsonb_agg(b.block_id order by lb.order_index) from public.user_block_completions b join public.lesson_blocks lb on lb.id=b.block_id where b.user_id=p.user_id and b.lesson_id=p.lesson_id),'[]'),
 'confirmedCompletedBlockIds',coalesce((select jsonb_agg(b.block_id order by lb.order_index) from public.user_block_completions b join public.lesson_blocks lb on lb.id=b.block_id where b.user_id=p.user_id and b.lesson_id=p.lesson_id),'[]'),
 'startedAt',p.started_at,'completedAt',p.completed_at,'updatedAt',p.updated_at,'revision',p.revision))
 from public.user_lesson_progress p where p.user_id=p_user and p.lesson_id=p_id
$$;
create function private.episode_progress_json(p_user uuid,p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_strip_nulls(jsonb_build_object('userId',p.user_id,'storyVersionId',p.story_version_id,'status',p.status,'currentSceneId',p.current_scene_id,
 'visitedSceneIds',coalesce((select jsonb_agg(v.scene_id order by v.visited_at,v.scene_id) from public.user_scene_visits v where v.user_id=p_user and v.story_version_id=p_id),'[]'),
 'lockedChoiceIds',coalesce((select jsonb_agg(c.choice_id order by c.selected_at,c.choice_id) from public.user_choice_selections c where c.user_id=p_user and c.story_version_id=p_id),'[]'),
 'startedAt',p.started_at,'completedAt',p.completed_at,'updatedAt',p.updated_at,'revision',p.revision))
 from public.user_episode_progress p where p.user_id=p_user and p.story_version_id=p_id
$$;
create function private.video_progress_json(p_user uuid,p_id uuid,p_block uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('userId',p.user_id,'lessonId',p.lesson_id,'blockId',p.block_id,'positionSeconds',p.position_seconds,
 'watchedRanges',p.watched_ranges,'completed',p.completed,'updatedAt',p.updated_at,'revision',p.revision)
 from public.user_video_progress p where p.user_id=p_user and p.lesson_id=p_id and p.block_id=p_block
$$;
create function private.settings_json(p_user uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('soundMuted',not s.sound_enabled,'reducedMotion',s.reduced_motion,'locale',p.locale,
 'timezone',s.account_timezone,'analyticsEnabled',s.analytics_enabled)
 from public.user_settings s join public.profiles p on p.id=s.user_id where s.user_id=p_user
$$;
create function private.account_json(p_user uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('userId',p.id,'displayName',p.display_name,
 'totalXp',coalesce((select sum(xp_delta) from public.reward_ledger where user_id=p.id),0),
 'completedLessons',(select count(*) from public.user_lesson_progress where user_id=p.id and status='completed'),
 'currentStreak',case when st.last_qualified_local_date>=((now() at time zone s.account_timezone)::date-1) then st.current_streak else 0 end,
 'longestStreak',st.longest_streak,'timezone',s.account_timezone,'achievements','[]'::jsonb)
 from public.profiles p join public.user_settings s on s.user_id=p.id join public.user_streaks st on st.user_id=p.id where p.id=p_user
$$;
create function private.resume_json(p_user uuid,p_id uuid) returns jsonb language plpgsql stable set search_path='' as $$
declare b public.lesson_blocks; cursor_id uuid; ep jsonb; vp jsonb;
begin
 select current_block_id into cursor_id from public.user_lesson_progress where user_id=p_user and lesson_id=p_id;
 select * into b from public.lesson_blocks where lesson_id=p_id order by (id=cursor_id) desc,order_index limit 1;
 if b.id is null then raise exception 'Lesson has no blocks' using errcode='P0002'; end if;
 if b.kind='visual_novel' then
   ep:=private.episode_progress_json(p_user,b.story_version_id);
   return jsonb_build_object('kind','visual_novel','lessonId',p_id,'blockId',b.id,'storyVersionId',b.story_version_id,
    'progress',ep,'sceneId',coalesce((ep->>'currentSceneId')::uuid,(select start_scene_id from public.story_versions where id=b.story_version_id)));
 elsif b.kind='video' then
   vp:=private.video_progress_json(p_user,p_id,b.id);
   return jsonb_build_object('kind','video','lessonId',p_id,'blockId',b.id,'progress',vp,'positionSeconds',coalesce((vp->>'positionSeconds')::numeric,0));
 end if;
 return jsonb_build_object('kind','block','lessonId',p_id,'blockId',b.id);
end $$;
create function public.learning_read(p_kind text,p_id uuid default null,p_secondary_id uuid default null) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare result jsonb; uid uuid:=auth.uid();
begin
 case p_kind
 when 'chapters' then select coalesce(jsonb_agg(private.chapter_json(id) order by created_at,id),'[]') into result from public.chapters where status='published';
 when 'chapter' then result:=private.chapter_json(p_id);
 when 'lesson' then result:=private.lesson_json(p_id);
 when 'document' then result:=private.document_json(p_id);
 when 'story' then result:=private.story_json(p_id);
 when 'media' then result:=private.media_json(p_id);
 when 'quiz' then result:=private.quiz_json(p_id);
 else
   if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
   case p_kind
   when 'profile' then select jsonb_build_object('id',id,'displayName',display_name,'locale',locale) into result from public.profiles where id=uid;
   when 'account' then result:=private.account_json(uid);
   when 'settings' then result:=private.settings_json(uid);
   when 'lesson_progress','resume','video_progress' then
     if private.lesson_json(p_id) is null then raise exception 'Lesson unavailable' using errcode='P0002'; end if;
     if p_kind='lesson_progress' then return private.lesson_progress_json(uid,p_id);
     elsif p_kind='resume' then return private.resume_json(uid,p_id);
     else
       if not exists(select 1 from public.lesson_blocks where id=p_secondary_id and lesson_id=p_id and kind='video') then raise exception 'Video block unavailable' using errcode='P0002'; end if;
       return private.video_progress_json(uid,p_id,p_secondary_id);
     end if;
   when 'episode_progress' then
     if private.story_json(p_id) is null then raise exception 'Story unavailable' using errcode='P0002'; end if;
     return private.episode_progress_json(uid,p_id);
   else raise exception 'Unknown read kind' using errcode='22023';
   end case;
 end case;
 if result is null then raise exception 'Resource unavailable' using errcode='P0002'; end if;
 return result;
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
revoke all on function public.learning_read(text,uuid,uuid) from public;
grant execute on function public.learning_read(text,uuid,uuid) to anon,authenticated;
