import test from 'node:test'
import assert from 'node:assert/strict'
import { PGlite } from '@electric-sql/pglite'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, dirname, basename } from 'node:path'
import { createTestDatabase, read, command, quizAnswers, ids, uuid } from './harness.mjs'

const fail=(promise,code='22023')=>assert.rejects(promise,error=>error.code===code)
async function draftChapter(db,n) {
 const cid=uuid(n)
 await db.query("insert into public.chapters(id,slug,title,summary,historical_period_label,estimated_minutes) values($1,$2,'Correction fixture','Technical fixture','Fixture',1)",[cid,cid])
 return cid
}
async function correctedLesson(db,cid,lid,bid,source=ids.lesson) {
 await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes,reward_scope_id) values($1,$2,0,$3,'Correction fixture','Technical fixture','standard',1,$4)",[lid,cid,lid,source])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,kind,document_id) values($1,$2,0,'text',$3)",[bid,lid,ids.document])
 await db.query("update public.lessons set status='published' where id=$1",[lid])
 await db.query("update public.chapters set status='published' where id=$1",[cid])
}

test('minor immutable corrections reuse reward identity and existing buckets become safe',async t=>{
 const db=await createTestDatabase({existingBuckets:true})
 t.after(()=>db.close())
 await command(db,'complete_block',{lessonId:ids.lesson,blockId:ids.textBlock,operationId:'original-block'})
 await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'original-lesson'})
 const cid=await draftChapter(db,910),lid=uuid(911),bid=uuid(912)
 await correctedLesson(db,cid,lid,bid)
 await command(db,'complete_block',{lessonId:lid,blockId:bid,operationId:'correction-block'})
 assert.equal((await command(db,'complete_lesson',{lessonId:lid,operationId:'correction-lesson'})).xpGranted,0)
 assert.equal((await read(db,'account')).totalXp,10)
 assert.equal((await read(db,'account')).completedLessons,2)
 const buckets=(await db.query('select public,file_size_limit,allowed_mime_types from storage.buckets')).rows
 assert.ok(buckets.every(b=>b.public===false && Number(b.file_size_limit)>0 && b.allowed_mime_types.length>0))
 await fail(db.query("insert into public.lessons(chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,100,'new','new','new','standard',1)",[ids.chapter]))
})

test('scored attempts respect prerequisites, incremental bonus and corrected assessment scopes',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 const cid=await draftChapter(db,920),lid=uuid(921),bid=uuid(922),set=uuid(923),q4=uuid(924),o4=uuid(925),wrong4=uuid(926)
 await db.query("insert into public.questions(id,prompt,difficulty) values($1,'Fourth technical question','intro')",[q4])
 await db.query("insert into public.question_options(id,question_id,order_index,label) values($1,$2,0,'A'),($3,$2,1,'B')",[o4,q4,wrong4])
 await db.query("insert into private.question_answer_keys(question_id,correct_option_ids,explanation) values($1,$2,'Trusted feedback')",[q4,[o4]])
 await db.query("update public.questions set status='published' where id=$1",[q4])
 await db.query("insert into public.question_sets(id,title,mode) values($1,'Four question fixture','scored')",[set])
 for(const [index,qid] of [ids.question1,ids.question2,ids.question3,q4].entries()) await db.query('insert into public.question_set_items(question_set_id,question_id,order_index) values($1,$2,$3)',[set,qid,index])
 await db.query("update public.question_sets set status='published' where id=$1",[set])
 await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,0,$3,'Locked fixture','Technical fixture','quiz',1)",[lid,cid,lid])
 await db.query('insert into public.lesson_prerequisites(lesson_id,prerequisite_lesson_id) values($1,$2)',[lid,ids.lesson])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,kind,question_set_id,assessment_mode) values($1,$2,0,'quiz',$3,'scored')",[bid,lid,set])
 await db.query("update public.lessons set status='published' where id=$1",[lid])
 await db.query("update public.chapters set status='published' where id=$1",[cid])
 const threeOfFour=[...quizAnswers(),{questionId:q4,selectedOptionIds:[wrong4]}]
 await fail(command(db,'submit_scored',{questionSetId:set,answers:threeOfFour,operationId:'locked-quiz'}))
 await command(db,'complete_block',{lessonId:ids.lesson,blockId:ids.textBlock,operationId:'unlock-block'})
 await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'unlock-lesson'})
 const pass=await command(db,'submit_scored',{questionSetId:set,answers:threeOfFour,operationId:'75-percent'})
 assert.equal(pass.passed,true)
 assert.equal((await read(db,'account')).totalXp,30)
 const allCorrect=[...quizAnswers(),{questionId:q4,selectedOptionIds:[o4]}]
 await command(db,'submit_scored',{questionSetId:set,answers:allCorrect,operationId:'improved-100'})
 assert.equal((await read(db,'account')).totalXp,35)
 await command(db,'submit_scored',{questionSetId:set,answers:allCorrect,operationId:'repeat-100'})
 assert.equal((await read(db,'account')).totalXp,35)
 // Corrected assessment uses a new immutable row but the same stable scope/eligibility.
 const fixedSet=uuid(927),fixedChapter=await draftChapter(db,928),fixedLesson=uuid(929),fixedBlock=uuid(930)
 await db.query("insert into public.question_sets(id,title,mode,reward_scope_id) values($1,'Corrected fixture','scored',$2)",[fixedSet,set])
 for(const [index,qid] of [ids.question1,ids.question2,ids.question3,q4].entries()) await db.query('insert into public.question_set_items(question_set_id,question_id,order_index) values($1,$2,$3)',[fixedSet,qid,index])
 await db.query("update public.question_sets set status='published' where id=$1",[fixedSet])
 await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,0,$3,'Corrected fixture','Technical fixture','quiz',1)",[fixedLesson,fixedChapter,fixedLesson])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,kind,question_set_id,assessment_mode) values($1,$2,0,'quiz',$3,'scored')",[fixedBlock,fixedLesson,fixedSet])
 await db.query("update public.lessons set status='published' where id=$1",[fixedLesson])
 await db.query("update public.chapters set status='published' where id=$1",[fixedChapter])
 await command(db,'submit_scored',{questionSetId:fixedSet,answers:allCorrect,operationId:'corrected-assessment'})
 assert.equal((await read(db,'account')).totalXp,35)
})

test('analytics failure cannot roll back completion and successful commands emit minimal events once',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 await command(db,'update_settings',{analyticsEnabled:true,operationId:'enable'})
 await command(db,'save_lesson_checkpoint',{lessonId:ids.lesson,currentBlockId:ids.textBlock,completedBlockIds:[],operationId:'learning-start'})
 await command(db,'complete_block',{lessonId:ids.lesson,blockId:ids.textBlock,operationId:'learning-block'})
 const receipt=await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'learning-done'})
 assert.equal(receipt.xpGranted,10)
 const names=(await db.query('select event_name from public.analytics_events')).rows.map(r=>r.event_name)
 for(const name of ['lesson_started','block_completed','lesson_completed','reward_granted','streak_qualified']) assert.ok(names.includes(name))
 await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'learning-done'})
 assert.equal((await db.query('select count(*) count from public.analytics_events')).rows[0].count,names.length)
 await fail(command(db,'track',{name:'reward_granted',properties:{reward_type:'lesson',xp_delta:999},operationId:'spoof-reward-event'}))
 await db.exec("create function private.fail_analytics() returns trigger language plpgsql as $$ begin raise exception 'Synthetic analytics failure'; end $$; create trigger fail_analytics before insert on public.analytics_events for each row execute function private.fail_analytics()")
 const cid=await draftChapter(db,940),lid=uuid(941),bid=uuid(942)
 await correctedLesson(db,cid,lid,bid,lid)
 await command(db,'complete_block',{lessonId:lid,blockId:bid,operationId:'failure-block'})
 const failureInput={lessonId:lid,operationId:'failure-done'}
 const failureReceipt=await command(db,'complete_lesson',failureInput)
 assert.equal(failureReceipt.status,'confirmed')
 assert.equal(failureReceipt.xpGranted,10)
 assert.equal(failureReceipt.totalXp,20)
 assert.deepEqual(await command(db,'complete_lesson',failureInput),failureReceipt)
 assert.equal((await db.query('select count(*) count from public.reward_ledger where user_id=$1',[ids.userA])).rows[0].count,2)
 assert.equal((await read(db,'lesson_progress',lid)).status,'completed')
})

test('optional-policy video never blocks lesson completion even when the block flag is required',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 const chapter=await draftChapter(db,950),lesson=uuid(951),block=uuid(952)
 await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,0,$3,'Optional video fixture','Technical fixture','video',1)",[lesson,chapter,lesson])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,required,kind,media_asset_id,completion_policy) values($1,$2,0,true,'video',$3,'optional')",[block,lesson,ids.video])
 await db.query("update public.lessons set status='published' where id=$1",[lesson])
 await db.query("update public.chapters set status='published' where id=$1",[chapter])
 const receipt=await command(db,'complete_lesson',{lessonId:lesson,operationId:'optional-video-lesson'})
 assert.equal(receipt.status,'confirmed')
 assert.equal(receipt.xpGranted,10)
 assert.deepEqual((await read(db,'lesson_progress',lesson)).confirmedCompletedBlockIds,[])
 // Other required blocks and non-optional video policies remain completion gates.
 await fail(command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'required-text-still-gated'}))
 await fail(command(db,'complete_lesson',{lessonId:ids.videoLesson,operationId:'required-video-still-gated'}))
 assert.equal((await read(db,'account')).totalXp,10)
})

test('roll-forward completion migration repairs an already-applied optional-video gate',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 const chapter=await draftChapter(db,960),lesson=uuid(961),video=uuid(962),text=uuid(963)
 await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,0,$3,'Mixed optional fixture','Technical fixture','mixed',1)",[lesson,chapter,lesson])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,required,kind,document_id) values($1,$2,0,true,'text',$3)",[text,lesson,ids.document])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,required,kind,media_asset_id,completion_policy) values($1,$2,1,true,'video',$3,'optional')",[video,lesson,ids.video])
 await db.query("update public.lessons set status='published' where id=$1",[lesson])
 await db.query("update public.chapters set status='published' where id=$1",[chapter])
 const repair=await readFile(new URL('../migrations/20261002002000_optional_video_completion.sql',import.meta.url),'utf8')
 // Simulate a stack with the earlier incompatible guard, without rewriting migration history.
 await db.exec(repair.replace("and not (b.kind='video' and b.completion_policy='optional')",''))
 await command(db,'complete_block',{lessonId:lesson,blockId:text,operationId:'upgrade-text'})
 await fail(command(db,'complete_lesson',{lessonId:lesson,operationId:'before-policy-upgrade'}))
 await db.exec(repair)
 const input={lessonId:lesson,operationId:'after-policy-upgrade'}
 const receipt=await command(db,'complete_lesson',input)
 assert.equal(receipt.xpGranted,10)
 assert.deepEqual(await command(db,'complete_lesson',input),receipt)
 assert.equal((await command(db,'complete_lesson',{...input,operationId:'upgrade-revisit'})).xpGranted,0)
 assert.deepEqual((await read(db,'lesson_progress',lesson)).confirmedCompletedBlockIds,[text])
})

test('persisted PostgreSQL reopen preserves operation receipts and reward uniqueness',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'suchill-pg-'))
 let db
 try {
  db=await createTestDatabase({dataDir:dir})
  await command(db,'complete_block',{lessonId:ids.lesson,blockId:ids.textBlock,operationId:'persisted-block'})
  const original=await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'persisted-lesson'})
  await db.close()
  db=new PGlite(dir)
  assert.deepEqual(await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'persisted-lesson'}),original)
  assert.equal((await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'new-device-lesson'})).xpGranted,0)
  assert.equal((await read(db,'account')).totalXp,10)
 } finally {
  if(db) await db.close()
  const resolved=resolve(dir)
  if(dirname(resolved)!==resolve(tmpdir()) || !basename(resolved).startsWith('suchill-pg-')) throw new Error('Unexpected temporary test directory')
  await rm(resolved,{recursive:true,force:true})
 }
})
