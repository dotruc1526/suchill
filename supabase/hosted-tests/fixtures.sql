-- SUPABASE-HOSTED-001 technical fixture, never canonical historical content.
-- Apply only to the authorized fresh test project kyfqlhpweetsridmqkvl after migrations 001–025.
-- No auth/storage bootstrap. Real objects are uploaded through Storage API by the hosted suite.
begin;
select pg_advisory_xact_lock(hashtext('suchill-hosted-technical-fixture-v1'));
do $fixture$
begin
  if exists(select 1 from public.chapters where id='70000000-0000-4000-8000-000000000010') then
    if not exists(select 1 from public.chapters where id='70000000-0000-4000-8000-000000000010' and status='published'
      and title='Fixture kỹ thuật') then raise exception 'Hosted fixture namespace is incomplete or occupied'; end if;
    return;
  end if;
  insert into public.learning_documents(id,title) values('70000000-0000-4000-8000-000000000040','Fixture kỹ thuật — không phải nội dung canonical');
  insert into public.document_sections(document_id,order_index,kind,payload) values('70000000-0000-4000-8000-000000000040',0,'paragraph','{"text":"Nội dung kiểm thử kỹ thuật."}'::jsonb);
  update public.learning_documents set status='published' where id='70000000-0000-4000-8000-000000000040';
  insert into public.learning_documents(id,title) values('70000000-0000-4000-8000-000000000041','Fixture kỹ thuật — không phải nội dung canonical');
  insert into public.document_sections(document_id,order_index,kind,payload) values('70000000-0000-4000-8000-000000000041',0,'paragraph','{"text":"Nội dung kiểm thử kỹ thuật."}'::jsonb);
  update public.learning_documents set status='published' where id='70000000-0000-4000-8000-000000000041';
  insert into public.learning_documents(id,title) values('70000000-0000-4000-8000-000000000042','Fixture kỹ thuật — không phải nội dung canonical');
  insert into public.document_sections(document_id,order_index,kind,payload) values('70000000-0000-4000-8000-000000000042',0,'paragraph','{"text":"Nội dung kiểm thử kỹ thuật."}'::jsonb);
  insert into public.media_assets(id,kind,title,storage_ref,alt_text) values('70000000-0000-4000-8000-000000000061','image','Fixture poster','published-media/hosted-technical/v1/fixture-poster.webp','Fixture kỹ thuật');
  update public.media_assets set review_status='published' where id='70000000-0000-4000-8000-000000000061';
  insert into public.media_assets(id,kind,title,storage_ref,poster_media_id,duration_seconds) values('70000000-0000-4000-8000-000000000060','video','Fixture video','published-media/hosted-technical/v1/fixture-video.mp4','70000000-0000-4000-8000-000000000061',100);
  insert into public.caption_tracks(id,media_asset_id,label,storage_ref) values('70000000-0000-4000-8000-000000000062','70000000-0000-4000-8000-000000000060','Tiếng Việt','published-media/hosted-technical/v1/fixture.vtt');
  insert into public.transcripts(id,media_asset_id,label,storage_ref,document_id) values('70000000-0000-4000-8000-000000000063','70000000-0000-4000-8000-000000000060','Bản chép lời','published-media/hosted-technical/v1/fixture.txt','70000000-0000-4000-8000-000000000040');
  update public.media_assets set review_status='published' where id='70000000-0000-4000-8000-000000000060';
  insert into public.media_assets(id,kind,title,storage_ref) values('70000000-0000-4000-8000-000000000064','image','DRAFT','draft-media/hosted-technical/v1/private.webp');
  insert into public.questions(id,prompt,difficulty) values('70000000-0000-4000-8000-000000000073','Câu hỏi fixture kỹ thuật','intro');
  insert into public.question_options(id,question_id,order_index,label) values('70000000-0000-4000-8000-000000000076','70000000-0000-4000-8000-000000000073',0,'Lựa chọn A'),('70000000-0000-4000-8000-000000000077','70000000-0000-4000-8000-000000000073',1,'Lựa chọn B');
  insert into private.question_answer_keys(question_id,correct_option_ids,explanation) values('70000000-0000-4000-8000-000000000073',ARRAY['70000000-0000-4000-8000-000000000076']::uuid[],'Feedback fixture sau submit.');
  update public.questions set status='published' where id='70000000-0000-4000-8000-000000000073';
  insert into public.questions(id,prompt,difficulty) values('70000000-0000-4000-8000-000000000074','Câu hỏi fixture kỹ thuật','intro');
  insert into public.question_options(id,question_id,order_index,label) values('70000000-0000-4000-8000-000000000078','70000000-0000-4000-8000-000000000074',0,'Lựa chọn A'),('70000000-0000-4000-8000-000000000079','70000000-0000-4000-8000-000000000074',1,'Lựa chọn B');
  insert into private.question_answer_keys(question_id,correct_option_ids,explanation) values('70000000-0000-4000-8000-000000000074',ARRAY['70000000-0000-4000-8000-000000000078']::uuid[],'Feedback fixture sau submit.');
  update public.questions set status='published' where id='70000000-0000-4000-8000-000000000074';
  insert into public.questions(id,prompt,difficulty) values('70000000-0000-4000-8000-000000000075','Câu hỏi fixture kỹ thuật','intro');
  insert into public.question_options(id,question_id,order_index,label) values('70000000-0000-4000-8000-000000000080','70000000-0000-4000-8000-000000000075',0,'Lựa chọn A'),('70000000-0000-4000-8000-000000000081','70000000-0000-4000-8000-000000000075',1,'Lựa chọn B');
  insert into private.question_answer_keys(question_id,correct_option_ids,explanation) values('70000000-0000-4000-8000-000000000075',ARRAY['70000000-0000-4000-8000-000000000080']::uuid[],'Feedback fixture sau submit.');
  update public.questions set status='published' where id='70000000-0000-4000-8000-000000000075';
  insert into public.question_sets(id,title,mode,daily_review_enabled) values('70000000-0000-4000-8000-000000000070','Fixture quiz','scored',false);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000070','70000000-0000-4000-8000-000000000073',0);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000070','70000000-0000-4000-8000-000000000074',1);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000070','70000000-0000-4000-8000-000000000075',2);
  update public.question_sets set status='published' where id='70000000-0000-4000-8000-000000000070';
  insert into public.question_sets(id,title,mode,daily_review_enabled) values('70000000-0000-4000-8000-000000000071','Fixture quiz','practice',true);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000071','70000000-0000-4000-8000-000000000073',0);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000071','70000000-0000-4000-8000-000000000074',1);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000071','70000000-0000-4000-8000-000000000075',2);
  update public.question_sets set status='published' where id='70000000-0000-4000-8000-000000000071';
  insert into public.question_sets(id,title,mode,daily_review_enabled) values('70000000-0000-4000-8000-000000000072','Fixture quiz','practice',false);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000072','70000000-0000-4000-8000-000000000073',0);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000072','70000000-0000-4000-8000-000000000074',1);
  insert into public.question_set_items(question_set_id,question_id,order_index) values('70000000-0000-4000-8000-000000000072','70000000-0000-4000-8000-000000000075',2);
  update public.question_sets set status='published' where id='70000000-0000-4000-8000-000000000072';
  insert into public.visual_novel_stories(id,slug,title,summary) values('70000000-0000-4000-8000-000000000050','hosted-technical-fixture-v1','Fixture VN','Không phải canonical');
  insert into public.story_versions(id,story_id,version_number) values('70000000-0000-4000-8000-000000000051','70000000-0000-4000-8000-000000000050',1);
  insert into public.scenes(id,story_version_id,order_index,kind,next_scene_id,payload) values('70000000-0000-4000-8000-000000000052','70000000-0000-4000-8000-000000000051',0,'narration','70000000-0000-4000-8000-000000000053','{"text":"Fixture kỹ thuật."}'::jsonb),('70000000-0000-4000-8000-000000000053','70000000-0000-4000-8000-000000000051',1,'choice',null,'{"prompt":"Lựa chọn fixture","policy":"retry_until_correct"}'::jsonb),('70000000-0000-4000-8000-000000000054','70000000-0000-4000-8000-000000000051',2,'end',null,'{"summary":"Kết thúc fixture."}'::jsonb);
  update public.scenes set required_check=true where id='70000000-0000-4000-8000-000000000053';
  insert into public.scene_choices(id,scene_id,order_index,kind,label,next_scene_id) values('70000000-0000-4000-8000-000000000056','70000000-0000-4000-8000-000000000053',0,'knowledge_check','A','70000000-0000-4000-8000-000000000054'),('70000000-0000-4000-8000-000000000055','70000000-0000-4000-8000-000000000053',1,'knowledge_check','B','70000000-0000-4000-8000-000000000054');
  insert into private.scene_answer_keys(choice_id,is_correct,explanation) values('70000000-0000-4000-8000-000000000056',true,'Đã xác nhận sau submit.'),('70000000-0000-4000-8000-000000000055',false,'Thử lại theo feedback.');
  update public.story_versions set start_scene_id='70000000-0000-4000-8000-000000000052',status='published',published_at=now() where id='70000000-0000-4000-8000-000000000051';
  insert into public.chapters(id,slug,title,summary,historical_period_label,estimated_minutes) values('70000000-0000-4000-8000-000000000010','70000000-0000-4000-8000-000000000010','Fixture kỹ thuật','Không phải canonical','Fixture',10);
  insert into public.chapters(id,slug,title,summary,historical_period_label,estimated_minutes) values('70000000-0000-4000-8000-000000000011','70000000-0000-4000-8000-000000000011','Fixture kỹ thuật','Không phải canonical','Fixture',10);
  insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values('70000000-0000-4000-8000-000000000020','70000000-0000-4000-8000-000000000010',0,'70000000-0000-4000-8000-000000000020','Fixture lesson','Không phải canonical','standard',5);
  insert into public.lesson_blocks(id,lesson_id,order_index,kind,document_id,completion_policy,assessment_mode) values('70000000-0000-4000-8000-000000000030','70000000-0000-4000-8000-000000000020',0,'text','70000000-0000-4000-8000-000000000040',null,null);
  update public.lessons set status='published' where id='70000000-0000-4000-8000-000000000020';
  insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values('70000000-0000-4000-8000-000000000021','70000000-0000-4000-8000-000000000010',1,'70000000-0000-4000-8000-000000000021','Fixture lesson','Không phải canonical','visual_novel',5);
  insert into public.lesson_blocks(id,lesson_id,order_index,kind,story_version_id,completion_policy,assessment_mode) values('70000000-0000-4000-8000-000000000031','70000000-0000-4000-8000-000000000021',0,'visual_novel','70000000-0000-4000-8000-000000000051',null,null);
  update public.lessons set status='published' where id='70000000-0000-4000-8000-000000000021';
  insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values('70000000-0000-4000-8000-000000000022','70000000-0000-4000-8000-000000000010',2,'70000000-0000-4000-8000-000000000022','Fixture lesson','Không phải canonical','video',5);
  insert into public.lesson_blocks(id,lesson_id,order_index,kind,media_asset_id,completion_policy,assessment_mode) values('70000000-0000-4000-8000-000000000032','70000000-0000-4000-8000-000000000022',0,'video','70000000-0000-4000-8000-000000000060','watch_threshold',null);
  update public.lessons set status='published' where id='70000000-0000-4000-8000-000000000022';
  insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values('70000000-0000-4000-8000-000000000023','70000000-0000-4000-8000-000000000010',3,'70000000-0000-4000-8000-000000000023','Fixture lesson','Không phải canonical','quiz',5);
  insert into public.lesson_blocks(id,lesson_id,order_index,kind,question_set_id,completion_policy,assessment_mode) values('70000000-0000-4000-8000-000000000033','70000000-0000-4000-8000-000000000023',0,'quiz','70000000-0000-4000-8000-000000000070',null,'scored');
  update public.lessons set status='published' where id='70000000-0000-4000-8000-000000000023';
  insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values('70000000-0000-4000-8000-000000000024','70000000-0000-4000-8000-000000000010',4,'70000000-0000-4000-8000-000000000024','Fixture lesson','Không phải canonical','mixed',5);
  insert into public.lesson_blocks(id,lesson_id,order_index,kind,document_id,completion_policy,assessment_mode) values('70000000-0000-4000-8000-000000000034','70000000-0000-4000-8000-000000000024',0,'recap','70000000-0000-4000-8000-000000000041',null,null);
  insert into public.lesson_blocks(id,lesson_id,order_index,kind,media_asset_id,completion_policy) values('70000000-0000-4000-8000-000000000035','70000000-0000-4000-8000-000000000024',1,'video','70000000-0000-4000-8000-000000000060','watch_threshold');
  update public.lessons set status='published' where id='70000000-0000-4000-8000-000000000024';
  insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values('70000000-0000-4000-8000-000000000025','70000000-0000-4000-8000-000000000011',5,'70000000-0000-4000-8000-000000000025','Fixture lesson','Không phải canonical','standard',5);
  insert into public.lesson_blocks(id,lesson_id,order_index,kind,document_id,completion_policy,assessment_mode) values('70000000-0000-4000-8000-000000000036','70000000-0000-4000-8000-000000000025',0,'text','70000000-0000-4000-8000-000000000042',null,null);
  update public.chapters set status='published' where id='70000000-0000-4000-8000-000000000010';
end
$fixture$;
commit;
