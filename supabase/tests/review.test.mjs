import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createTestDatabase, read, command, quizAnswers, ids, uuid } from './harness.mjs'

test('pre-existing Auth accounts are initialized without replacing account settings',async t=>{
 const db=await createTestDatabase({existingUsers:true})
 t.after(()=>db.close())
 const user=uuid(8001),invalid=uuid(8002)
 assert.equal((await read(db,'account',null,null,user)).displayName,'Existing A')
 assert.equal((await read(db,'settings',null,null,user)).timezone,'Europe/Paris')
 assert.equal((await read(db,'settings',null,null,invalid)).timezone,'Asia/Ho_Chi_Minh')
 assert.equal((await read(db,'account',null,null,invalid)).totalXp,0)
 await command(db,'update_settings',{soundMuted:true,analyticsEnabled:true,operationId:'existing-settings'},user)
 await command(db,'complete_block',{lessonId:ids.lesson,blockId:ids.textBlock,operationId:'existing-block'},user)
 await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'existing-lesson'},user)
 const before=await read(db,'settings',null,null,user)
 await db.exec(await readFile(new URL('../migrations/20261002002100_existing_auth_accounts.sql',import.meta.url),'utf8'))
 assert.deepEqual(await read(db,'settings',null,null,user),before)
 assert.equal((await read(db,'account',null,null,user)).totalXp,10)
 const roles=(await db.query("select column_name from information_schema.columns where table_schema='public' and table_name='profiles' and column_name in ('role','is_admin')")).rows
 assert.deepEqual(roles,[])
})

test('question-set delivery exposes authored daily eligibility without grading keys',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 for(const user of [null,ids.userA,ids.userB]) {
  const daily=await read(db,'quiz',ids.practice,null,user)
  assert.equal(daily.dailyReviewEligible,true)
  assert.equal((await read(db,'quiz',ids.unflaggedPractice,null,user)).dailyReviewEligible,false)
  assert.equal((await read(db,'quiz',ids.quiz,null,user)).dailyReviewEligible,false)
  assert.ok(daily.questions.every(q=>!('explanation' in q) && q.options.every(o=>!('isCorrect' in o))))
 }
 const helpers=(await db.query("select proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='private' and has_function_privilege('authenticated',p.oid,'EXECUTE')")).rows
 assert.deepEqual(helpers,[])
})

test('publication rejects knowledge checks that cannot advance or pass',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 const [story,version,start,end,choice]=[uuid(8101),uuid(8102),uuid(8103),uuid(8104),uuid(8105)]
 await db.query("insert into public.visual_novel_stories(id,slug,title,summary) values($1,$2,'Invalid check fixture','Technical fixture')",[story,story])
 await db.query('insert into public.story_versions(id,story_id,version_number) values($1,$2,1)',[version,story])
 await db.query("insert into public.scenes(id,story_version_id,order_index,kind,payload) values($1,$2,0,'choice',$3),($4,$2,1,'end',$5)",[start,version,{prompt:'Technical check',policy:'retry_until_correct'},end,{summary:'Technical end'}])
 await db.query("insert into public.scene_choices(id,scene_id,order_index,kind,label,next_scene_id) values($1,$2,0,'knowledge_check','Only wrong option',$3)",[choice,start,end])
 await db.query("insert into private.scene_answer_keys(choice_id,is_correct,explanation) values($1,false,'Technical feedback')",[choice])
 const publish=()=>db.query("update public.story_versions set start_scene_id=$1,status='published' where id=$2",[start,version])
 await assert.rejects(publish(),e=>e.code==='22023')
 await db.query('update private.scene_answer_keys set is_correct=true where choice_id=$1',[choice])
 // A valid end remains reachable through the extra narration edge, but the
 // correct choice itself has no domain transition and therefore cannot publish.
 await db.transaction(async tx=>{
  await tx.query('update public.scenes set next_scene_id=$1 where id=$2',[end,start])
  await tx.query('update public.scene_choices set next_scene_id=null where id=$1',[choice])
 })
 await assert.rejects(publish(),e=>e.code==='22023')
 await db.query('update public.scene_choices set next_scene_id=$1 where id=$2',[end,choice])
 await publish()
 assert.equal((await read(db,'story',version,null,null)).scenes[0].choices[0].nextSceneId,end)
})

test('publication rejects duplicate grading keys and unsafe or non-finite media metadata',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 const [question,option]=[uuid(8201),uuid(8202)]
 await db.query("insert into public.questions(id,prompt,difficulty) values($1,'Technical question','intro')",[question])
 await db.query("insert into public.question_options(id,question_id,order_index,label) values($1,$2,0,'Technical option')",[option,question])
 await db.query("insert into private.question_answer_keys(question_id,correct_option_ids,explanation) values($1,$2,'Technical feedback')",[question,[option,option]])
 await assert.rejects(db.query("update public.questions set status='published' where id=$1",[question]),e=>e.code==='22023')
 await db.query('update private.question_answer_keys set correct_option_ids=$1 where question_id=$2',[[option],question])
 await db.query("update public.questions set status='published' where id=$1",[question])
 for(const [i,path,duration] of [
  [0,'published-media/../private.mp4',10],[1,'published-media/a//b.mp4',10],[2,'published-media/a\\b.mp4',10],
  [3,'published-media/finite.mp4','NaN'],[4,'published-media/infinite.mp4','Infinity'],
 ].map((entry,i)=>[i,...entry.slice(1)])) {
  const media=uuid(8210+i)
  await db.query("insert into public.media_assets(id,kind,title,storage_ref,duration_seconds) values($1,'video','Technical invalid media',$2,$3)",[media,path,duration])
  await assert.rejects(db.query("update public.media_assets set review_status='published' where id=$1",[media]),e=>e.code==='22023')
 }
 const valid=uuid(8220)
 await db.query("insert into public.media_assets(id,kind,title,storage_ref,duration_seconds) values($1,'video','Technical valid media','published-media/safe/video.mp4',10)",[valid])
 await db.query("update public.media_assets set review_status='published' where id=$1",[valid])
 assert.equal((await read(db,'media',valid,null,null)).durationSeconds,10)
})

test('every published VN branch must have a playable end route',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 const [story,version,start,end,cycle,good,bad]=[uuid(8301),uuid(8302),uuid(8303),uuid(8304),uuid(8305),uuid(8306),uuid(8307)]
 await db.query("insert into public.visual_novel_stories(id,slug,title,summary) values($1,$2,'Cycle fixture','Technical fixture')",[story,story])
 await db.query('insert into public.story_versions(id,story_id,version_number) values($1,$2,1)',[version,story])
 await db.transaction(async tx=>{
  await tx.query("insert into public.scenes(id,story_version_id,order_index,kind,next_scene_id,payload) values($1,$2,0,'choice',null,$3),($4,$2,1,'end',null,$5),($6,$2,2,'narration',$6,$7)",[start,version,{prompt:'Choose technical branch',policy:'continue_after_feedback'},end,{summary:'Technical end'},cycle,{text:'Technical closed cycle'}])
  await tx.query("insert into public.scene_choices(id,scene_id,order_index,kind,label,next_scene_id) values($1,$2,0,'branching','End route',$3),($4,$2,1,'branching','Closed cycle',$5)",[good,start,end,bad,cycle])
 })
 const publish=()=>db.query("update public.story_versions set start_scene_id=$1,status='published' where id=$2",[start,version])
 await assert.rejects(publish(),e=>e.code==='22023')
 await db.query('update public.scenes set next_scene_id=$1 where id=$2',[end,cycle])
 await publish()
 assert.equal((await read(db,'story',version,null,null)).scenes.find(s=>s.id===cycle).nextSceneId,end)
})

test('a confirmed zero-XP daily attempt cannot become fresh after timezone reinterpretation',async t=>{
 const db=await createTestDatabase({throughMigration:'20261002002400_story_end_reachability.sql'})
 t.after(()=>db.close())
 await command(db,'update_settings',{timezone:'America/Adak',operationId:'zero-receipt-initial-zone'})
 const attempt=async op=>command(db,'submit_practice',{questionSetId:ids.practice,answers:quizAnswers(),operationId:op})
 const claim=async(a,op)=>command(db,'complete_daily_review',{questionSetId:ids.practice,attemptId:a.attemptId,operationId:op})
 const first=await attempt('zero-receipt-first-attempt')
 assert.equal((await claim(first,'zero-receipt-first-claim')).xpGranted,5)
 const second=await attempt('zero-receipt-second-attempt')
 const original=await claim(second,'zero-receipt-second-claim')
 assert.equal(original.xpGranted,0)
 assert.equal(original.alreadyCompleted,true)
 assert.equal((await db.query("select to_regclass('private.daily_review_attempt_claims') relation")).rows[0].relation,null)
 // This is a genuine upgrade of an older database containing first and zero-XP
 // receipts, rather than re-running only an isolated backfill statement.
 await db.exec(await readFile(new URL('../migrations/20261002002500_daily_attempt_receipts.sql',import.meta.url),'utf8'))
 assert.equal((await db.query('select count(*) count from private.daily_review_attempt_claims where user_id=$1',[ids.userA])).rows[0].count,2)
 // Trusted time fixture represents the previous account day having ended and
 // cooldown having elapsed. The second receipt's day itself must remain fixed.
 await db.query("update private.daily_review_claims set local_date=local_date-1 where user_id=$1",[ids.userA])
 await db.query("update public.user_settings set timezone_changed_at=now()-interval '8 days' where user_id=$1",[ids.userA])
 await command(db,'update_settings',{timezone:'Pacific/Kiritimati',operationId:'zero-receipt-new-zone'})
 const replay=await claim(second,'zero-receipt-later-claim')
 assert.equal(replay.xpGranted,0)
 assert.equal(replay.localDate,original.localDate)
 assert.equal((await read(db,'account')).totalXp,5)
 const fresh=await attempt('zero-receipt-fresh-attempt')
 assert.equal((await claim(fresh,'zero-receipt-fresh-claim')).xpGranted,5)
 assert.equal((await read(db,'account')).totalXp,10)
 // Zero-XP historical receipts are bound by the roll-forward upgrade as well.
 await db.query('delete from private.daily_review_attempt_claims where user_id=$1 and attempt_id=$2',[ids.userA,second.attemptId])
 await db.exec(await readFile(new URL('../migrations/20261002002500_daily_attempt_receipts.sql',import.meta.url),'utf8').then(sql=>sql.substring(sql.indexOf('insert into private.daily_review_attempt_claims'),sql.indexOf('create or replace function'))))
 assert.equal((await claim(second,'zero-receipt-upgraded-claim')).xpGranted,0)
 assert.equal((await claim(second,'zero-receipt-upgraded-repeat')).localDate,original.localDate)
})
