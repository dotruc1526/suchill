create function private.chapter_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_strip_nulls(jsonb_build_object('id',c.id,'slug',c.slug,'title',c.title,'subtitle',c.subtitle,'summary',c.summary,
 'historicalPeriodLabel',c.historical_period_label,'coverMediaId',c.cover_media_id,'estimatedMinutes',c.estimated_minutes,'status',c.status,
 'learningObjectiveIds',coalesce((select jsonb_agg(objective_id order by objective_id) from public.chapter_objectives where chapter_id=c.id),'[]'),
 'lessonRefs',coalesce((select jsonb_agg(jsonb_build_object('id',id,'order',order_index) order by order_index) from public.lessons where chapter_id=c.id and status='published'),'[]')))
 from public.chapters c where c.id=p_id and c.status='published'
$$;
create function private.lesson_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('id',l.id,'chapterId',l.chapter_id,'slug',l.slug,'title',l.title,'summary',l.summary,'format',l.format,
 'estimatedMinutes',l.estimated_minutes,'status',l.status,
 'learningObjectiveIds',coalesce((select jsonb_agg(objective_id order by objective_id) from public.lesson_objectives where lesson_id=l.id),'[]'),
 'prerequisites',coalesce((select jsonb_agg(prerequisite_lesson_id order by prerequisite_lesson_id) from public.lesson_prerequisites where lesson_id=l.id),'[]'),
 'blocks',coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object('id',b.id,'order',b.order_index,'required',b.required,'kind',b.kind,
 'documentId',b.document_id,'storyVersionId',b.story_version_id,'mediaAssetId',b.media_asset_id,'questionSetId',b.question_set_id,
 'completionPolicy',b.completion_policy,'assessmentMode',b.assessment_mode,'knowledgeCheckSetId',b.knowledge_check_set_id)) order by b.order_index)
 from public.lesson_blocks b where b.lesson_id=l.id),'[]'))
 from public.lessons l join public.chapters c on c.id=l.chapter_id where l.id=p_id and l.status='published' and c.status='published'
$$;
create function private.document_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('id',d.id,'title',d.title,'locale',d.locale,'status',d.status,
 'sections',coalesce((select jsonb_agg(s.payload||jsonb_build_object('id',s.id,'kind',s.kind) order by s.order_index) from public.document_sections s where document_id=d.id),'[]'),
 'sourceIds',coalesce((select jsonb_agg(source_id order by source_id) from public.document_sources where document_id=d.id),'[]'))
 from public.learning_documents d where d.id=p_id and d.status='published'
$$;
create function private.story_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_strip_nulls(jsonb_build_object('id',v.id,'storyId',v.story_id,'versionNumber',v.version_number,'status',v.status,
 'startSceneId',v.start_scene_id,'createdAt',v.created_at,'publishedAt',v.published_at,
 'learningObjectiveIds',coalesce((select jsonb_agg(objective_id order by objective_id) from public.story_objectives where story_version_id=v.id),'[]'),
 'sourceIds',coalesce((select jsonb_agg(source_id order by source_id) from public.story_sources where story_version_id=v.id),'[]'),
 'scenes',coalesce((select jsonb_agg((s.payload-'isCorrect'-'explanation'-'choices')||jsonb_strip_nulls(jsonb_build_object(
 'id',s.id,'kind',s.kind,'title',s.title,'backdropMediaId',s.backdrop_media_id,'nextSceneId',s.next_scene_id,
 'sourceIds',coalesce((select jsonb_agg(source_id order by source_id) from public.scene_sources where scene_id=s.id),'[]'),
 'claimIds',coalesce((select jsonb_agg(claim_id order by claim_id) from public.scene_claims where scene_id=s.id),'[]')))||
 case when s.kind='choice' then jsonb_build_object('choices',coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
 'id',ch.id,'kind',ch.kind,'label',ch.label,'response',ch.response,'nextSceneId',ch.next_scene_id)) order by ch.order_index)
 from public.scene_choices ch where ch.scene_id=s.id),'[]')) else '{}'::jsonb end order by s.order_index)
 from public.scenes s where s.story_version_id=v.id),'[]')))
 from public.story_versions v where v.id=p_id and v.status='published'
$$;
create function private.media_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_strip_nulls(jsonb_build_object('id',m.id,'kind',m.kind,'title',m.title,'storageRef',m.storage_ref,
 'posterMediaId',m.poster_media_id,'caption',m.caption,'altText',m.alt_text,'durationSeconds',m.duration_seconds,
 'aspectRatio',m.aspect_ratio,'attribution',m.attribution,'license',m.license,'reviewStatus',m.review_status,
 'sourceIds',coalesce((select jsonb_agg(source_id order by source_id) from public.media_sources where media_asset_id=m.id),'[]'),
 'poster',(select jsonb_build_object('id',p.id,'storageRef',p.storage_ref,'altText',p.alt_text) from public.media_assets p where p.id=m.poster_media_id and p.review_status='published'),
 'captionTrackRefs',coalesce((select jsonb_agg(id order by id) from public.caption_tracks where media_asset_id=m.id),'[]'),
 'captionTracks',coalesce((select jsonb_agg(jsonb_build_object('id',id,'storageRef',storage_ref,'locale',locale,'label',label) order by id) from public.caption_tracks where media_asset_id=m.id),'[]'),
 'transcriptRef',(select id from public.transcripts where media_asset_id=m.id),
 'transcript',(select jsonb_build_object('id',id,'storageRef',storage_ref,'locale',locale,'label',label) from public.transcripts where media_asset_id=m.id)))
 from public.media_assets m where m.id=p_id and m.review_status='published'
$$;
create function private.quiz_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('set',jsonb_build_object('id',qs.id,'title',qs.title,'mode',qs.mode,
 'questionIds',coalesce((select jsonb_agg(i.question_id order by i.order_index) from public.question_set_items i where i.question_set_id=qs.id),'[]'),
 'learningObjectiveIds',coalesce((select jsonb_agg(objective_id order by objective_id) from public.question_set_objectives where question_set_id=qs.id),'[]')),
 'questions',coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'prompt',q.prompt,'difficulty',q.difficulty,
 'optionIds',coalesce((select jsonb_agg(o.id order by o.order_index) from public.question_options o where o.question_id=q.id),'[]'),
 'options',coalesce((select jsonb_agg(jsonb_build_object('id',o.id,'label',o.label) order by o.order_index) from public.question_options o where o.question_id=q.id),'[]'),
 'sourceIds',coalesce((select jsonb_agg(source_id order by source_id) from public.question_sources where question_id=q.id),'[]')) order by i.order_index)
 from public.question_set_items i join public.questions q on q.id=i.question_id where i.question_set_id=qs.id and q.status='published'),'[]'))
 from public.question_sets qs where qs.id=p_id and qs.status='published'
$$;
