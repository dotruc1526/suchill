import { PGlite } from '@electric-sql/pglite'
import { readdir, readFile } from 'node:fs/promises'

export const uuid = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
export const ids = Object.freeze({
  userA: uuid(1), userB: uuid(2), chapter: uuid(10), draftChapter: uuid(11),
  lesson: uuid(20), vnLesson: uuid(21), videoLesson: uuid(22), quizLesson: uuid(23), mixedLesson: uuid(24), draftLesson: uuid(25),
  textBlock: uuid(30), vnBlock: uuid(31), videoBlock: uuid(32), quizBlock: uuid(33), recapBlock: uuid(34), mixedVideoBlock: uuid(35), draftBlock: uuid(36),
  document: uuid(40), recapDocument: uuid(41), draftDocument: uuid(42),
  story: uuid(50), version: uuid(51), start: uuid(52), check: uuid(53), end: uuid(54), wrong: uuid(55), correct: uuid(56),
  video: uuid(60), poster: uuid(61), caption: uuid(62), transcript: uuid(63), draftMedia: uuid(64),
  quiz: uuid(70), practice: uuid(71), unflaggedPractice: uuid(72), question1: uuid(73), question2: uuid(74), question3: uuid(75),
  correct1: uuid(76), wrong1: uuid(77), correct2: uuid(78), wrong2: uuid(79), correct3: uuid(80), wrong3: uuid(81),
})

const bootstrap = `
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema auth; create schema storage;
create table auth.users(id uuid primary key, raw_user_meta_data jsonb not null default '{}');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema public,auth,storage to anon,authenticated,service_role;
grant execute on function auth.uid() to anon,authenticated,service_role;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets,name text not null,owner_id text);
alter table storage.objects enable row level security;
grant select on storage.objects to anon;
grant select,insert,update,delete on storage.objects to authenticated;
create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name,'/'))[1:array_length(string_to_array(name,'/'),1)-1] $$;
grant execute on function storage.foldername(text) to anon,authenticated;
`

/** Real PostgreSQL SQL/RLS harness. Auth and Storage HTTP/JWT services are deliberately outside this harness. */
export async function createTestDatabase({ seed = true, dataDir, existingBuckets = false } = {}) {
  const db = new PGlite(dataDir)
  await db.exec(bootstrap)
  if (existingBuckets) await db.exec("insert into storage.buckets(id,name,public) values('draft-media','draft-media',true),('published-media','published-media',true)")
  const migrations = (await readdir(new URL('../migrations/', import.meta.url))).filter(name => name.endsWith('.sql')).sort()
  for (const name of migrations) {
    try { await db.exec(await readFile(new URL(`../migrations/${name}`, import.meta.url), 'utf8')) }
    catch (error) { throw new Error(`Migration ${name}: ${error.message}`, { cause: error }) }
  }
  if (seed) await seedFixtures(db)
  return db
}

/** Each callback owns a transaction, so role/identity never escape into another request. */
export async function asRole(db, role, userId, callback) {
  if (!['anon', 'authenticated', 'service_role', 'postgres'].includes(role)) throw new Error('Unknown test role')
  return db.transaction(async tx => {
    await tx.exec(`set local role ${role}`)
    await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [userId ?? ''])
    return callback(tx)
  })
}
export async function read(db, kind, id = null, secondary = null, userId = ids.userA) {
  return asRole(db, userId ? 'authenticated' : 'anon', userId, async tx =>
    (await tx.query('select public.learning_read($1,$2::uuid,$3::uuid) value', [kind, id, secondary])).rows[0].value)
}
export async function command(db, kind, input, userId = ids.userA) {
  return asRole(db, userId ? 'authenticated' : 'anon', userId, async tx =>
    (await tx.query('select public.learning_command($1,$2::jsonb) value', [kind, JSON.stringify(input)])).rows[0].value)
}
export function quizAnswers(correct = true) {
  return [
    { questionId: ids.question1, selectedOptionIds: [correct ? ids.correct1 : ids.wrong1] },
    { questionId: ids.question2, selectedOptionIds: [correct ? ids.correct2 : ids.wrong2] },
    { questionId: ids.question3, selectedOptionIds: [correct ? ids.correct3 : ids.wrong3] },
  ]
}

export async function seedFixtures(db) {
  const id = ids
  // All content below is an explicit technical fixture. It contains no canonical historical claims.
  await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2),($3,$4)', [id.userA, { displayName: 'Fixture A', timezone: 'Asia/Ho_Chi_Minh', role: 'admin' }, id.userB, { displayName: 'Fixture B' }])
  const stmt = async (sql, params = []) => db.query(sql, params)
  for (const doc of [id.document, id.recapDocument, id.draftDocument]) {
    await stmt('insert into public.learning_documents(id,title) values($1,$2)', [doc, 'Fixture kỹ thuật — không phải nội dung canonical'])
    await stmt("insert into public.document_sections(document_id,order_index,kind,payload) values($1,0,'paragraph',$2)", [doc, { text: 'Nội dung kiểm thử kỹ thuật.' }])
    if (doc !== id.draftDocument) await stmt("update public.learning_documents set status='published' where id=$1", [doc])
  }
  await stmt("insert into public.media_assets(id,kind,title,storage_ref,alt_text) values($1,'image','Fixture poster','published-media/fixture-poster.webp','Fixture kỹ thuật')", [id.poster])
  await stmt("update public.media_assets set review_status='published' where id=$1", [id.poster])
  await stmt("insert into public.media_assets(id,kind,title,storage_ref,poster_media_id,duration_seconds) values($1,'video','Fixture video','published-media/fixture-video.mp4',$2,100)", [id.video, id.poster])
  await stmt('insert into public.caption_tracks(id,media_asset_id,label,storage_ref) values($1,$2,$3,$4)', [id.caption, id.video, 'Tiếng Việt', 'published-media/fixture.vtt'])
  await stmt('insert into public.transcripts(id,media_asset_id,label,storage_ref,document_id) values($1,$2,$3,$4,$5)', [id.transcript, id.video, 'Bản chép lời', 'published-media/fixture.txt', id.document])
  await stmt("update public.media_assets set review_status='published' where id=$1", [id.video])
  await stmt("insert into public.media_assets(id,kind,title,storage_ref) values($1,'image','DRAFT','draft-media/private.webp')", [id.draftMedia])
  for (const [qid, correctId, wrongId] of [[id.question1,id.correct1,id.wrong1], [id.question2,id.correct2,id.wrong2], [id.question3,id.correct3,id.wrong3]]) {
    await stmt("insert into public.questions(id,prompt,difficulty) values($1,'Câu hỏi fixture kỹ thuật','intro')", [qid])
    await stmt('insert into public.question_options(id,question_id,order_index,label) values($1,$2,0,$3),($4,$2,1,$5)', [correctId,qid,'Lựa chọn A',wrongId,'Lựa chọn B'])
    await stmt('insert into private.question_answer_keys(question_id,correct_option_ids,explanation) values($1,$2,$3)', [qid,[correctId],'Feedback fixture sau submit.'])
    await stmt("update public.questions set status='published' where id=$1", [qid])
  }
  for (const [set, mode, daily] of [[id.quiz,'scored',false],[id.practice,'practice',true],[id.unflaggedPractice,'practice',false]]) {
    await stmt('insert into public.question_sets(id,title,mode,daily_review_enabled) values($1,$2,$3,$4)', [set,'Fixture quiz',mode,daily])
    for (const [order,qid] of [id.question1,id.question2,id.question3].entries()) await stmt('insert into public.question_set_items(question_set_id,question_id,order_index) values($1,$2,$3)', [set,qid,order])
    await stmt("update public.question_sets set status='published' where id=$1", [set])
  }
  await stmt('insert into public.visual_novel_stories(id,slug,title,summary) values($1,$2,$3,$4)', [id.story,'technical-fixture','Fixture VN','Không phải canonical'])
  await stmt('insert into public.story_versions(id,story_id,version_number) values($1,$2,1)', [id.version,id.story])
  await db.transaction(async tx => {
    await tx.query("insert into public.scenes(id,story_version_id,order_index,kind,next_scene_id,payload) values($1,$2,0,'narration',$3,$4),($3,$2,1,'choice',null,$5),($6,$2,2,'end',null,$7)", [id.start,id.version,id.check,{ text:'Fixture kỹ thuật.' },{ prompt:'Lựa chọn fixture',policy:'retry_until_correct' },id.end,{ summary:'Kết thúc fixture.' }])
    await tx.query('update public.scenes set required_check=true where id=$1', [id.check])
    await tx.query("insert into public.scene_choices(id,scene_id,order_index,kind,label,next_scene_id) values($1,$2,0,'knowledge_check','A',$3),($4,$2,1,'knowledge_check','B',$3)", [id.correct,id.check,id.end,id.wrong])
    await tx.query('insert into private.scene_answer_keys(choice_id,is_correct,explanation) values($1,true,$2),($3,false,$4)', [id.correct,'Đã xác nhận sau submit.',id.wrong,'Thử lại theo feedback.'])
    await tx.query("update public.story_versions set start_scene_id=$1,status='published',published_at=now() where id=$2", [id.start,id.version])
  })
  for (const chapter of [id.chapter,id.draftChapter]) await stmt('insert into public.chapters(id,slug,title,summary,historical_period_label,estimated_minutes) values($1,$2,$3,$4,$5,10)', [chapter,chapter,'Fixture kỹ thuật','Không phải canonical','Fixture'])
  const lessonSpecs = [
    [id.lesson,'standard',id.textBlock,'text',id.document], [id.vnLesson,'visual_novel',id.vnBlock,'visual_novel',id.version],
    [id.videoLesson,'video',id.videoBlock,'video',id.video], [id.quizLesson,'quiz',id.quizBlock,'quiz',id.quiz],
    [id.mixedLesson,'mixed',id.recapBlock,'recap',id.recapDocument], [id.draftLesson,'standard',id.draftBlock,'text',id.draftDocument],
  ]
  for (const [order,[lesson,format,block,kind,ref]] of lessonSpecs.entries()) {
    await stmt('insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,$3,$4,$5,$6,$7,5)', [lesson,lesson===id.draftLesson?id.draftChapter:id.chapter,order,lesson,'Fixture lesson','Không phải canonical',format])
    const col = { text:'document_id',recap:'document_id',visual_novel:'story_version_id',video:'media_asset_id',quiz:'question_set_id' }[kind]
    await stmt(`insert into public.lesson_blocks(id,lesson_id,order_index,kind,${col},completion_policy,assessment_mode) values($1,$2,0,$3,$4,$5,$6)`, [block,lesson,kind,ref,kind==='video'?'watch_threshold':null,kind==='quiz'?'scored':null])
    if (lesson===id.mixedLesson) await stmt("insert into public.lesson_blocks(id,lesson_id,order_index,kind,media_asset_id,completion_policy) values($1,$2,1,'video',$3,'watch_threshold')", [id.mixedVideoBlock,lesson,id.video])
    if (lesson!==id.draftLesson) await stmt("update public.lessons set status='published' where id=$1", [lesson])
  }
  await stmt("update public.chapters set status='published' where id=$1", [id.chapter])
  for (const [bucket,name] of [['published-media','fixture-video.mp4'],['published-media','fixture.vtt'],['published-media','fixture.txt'],['published-media','unapproved.webp'],['draft-media','private.webp'],['user-avatars',`${id.userA}/avatar.webp`],['user-avatars',`${id.userB}/avatar.webp`]]) await stmt('insert into storage.objects(bucket_id,name) values($1,$2)', [bucket,name])
}
