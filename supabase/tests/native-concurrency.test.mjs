import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDatabase, command, read, quizAnswers, ids, uuid } from './harness.mjs'

async function contenders(db,user,work) {
 const lock=await db.connect()
 let pending
 try {
  await lock.query('begin')
  await lock.query('select id from public.profiles where id=$1 for update',[user])
  pending=work.map(run=>run())
  const deadline=Date.now()+5000
  let blocked=[]
  while(Date.now()<deadline) {
   blocked=(await db.query("select pid from pg_stat_activity where datname=current_database() and application_name='suchill-native-review' and wait_event_type='Lock' and query like '%learning_command%' ")).rows
   if(blocked.length>=work.length) break
   await new Promise(resolve=>setTimeout(resolve,25))
  }
  assert.equal(new Set(blocked.map(row=>row.pid)).size,work.length,'all contenders must overlap on independent blocked native sessions')
 } finally {await lock.query('commit');lock.release()}
 return Promise.allSettled(pending)
}
const values=results=>results.map(r=>{assert.equal(r.status,'fulfilled',r.reason?.message);return r.value})
const count=async(db,sql,params=[])=>Number((await db.query(sql,params)).rows[0].count)

test('native PostgreSQL independent overlapping sessions preserve authority and atomicity',{
 skip:process.env.SUCHILL_NATIVE_PG_URL?false:'Set SUCHILL_NATIVE_PG_URL to a disposable loopback PostgreSQL17 cluster',
},async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 assert.ok(db.native)
 const version=(await db.query("select current_setting('server_version_num')::integer version")).rows[0].version
 assert.ok(version>=170000 && version<180000,`Expected PostgreSQL17, received ${version}`)
 const jobs=8
 await t.test('same operation at eight simultaneous sessions returns one exact immutable receipt',async()=>{
  await command(db,'complete_block',{lessonId:ids.lesson,blockId:ids.textBlock,operationId:'native-text'})
  const input={lessonId:ids.lesson,operationId:'native-same-completion'}
  const receipts=values(await contenders(db,ids.userA,Array.from({length:jobs},()=>()=>command(db,'complete_lesson',input))))
  receipts.forEach(receipt=>assert.deepEqual(receipt,receipts[0]))
  assert.equal(receipts[0].xpGranted,10)
  assert.equal(await count(db,'select count(*) count from public.reward_ledger where user_id=$1',[ids.userA]),1)
  assert.equal(await count(db,'select count(*) count from private.operations where user_id=$1 and operation_id=$2',[ids.userA,input.operationId]),1)
 })
 await t.test('different operation IDs for the same reward grant10 once and qualify one account day',async()=>{
  const [chapter,lesson,block]=[uuid(8801),uuid(8802),uuid(8803)]
  await db.query("insert into public.chapters(id,slug,title,summary,historical_period_label,estimated_minutes) values($1,$2,'Race fixture','Technical fixture','Fixture',1)",[chapter,chapter])
  await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,0,$3,'Race fixture','Technical fixture','standard',1)",[lesson,chapter,lesson])
  await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,kind,document_id) values($1,$2,0,'text',$3)",[block,lesson,ids.document])
  await db.query("update public.lessons set status='published' where id=$1",[lesson])
  await db.query("update public.chapters set status='published' where id=$1",[chapter])
  await command(db,'complete_block',{lessonId:lesson,blockId:block,operationId:'native-race-block'})
  const receipts=values(await contenders(db,ids.userA,Array.from({length:jobs},(_,i)=>()=>command(db,'complete_lesson',{lessonId:lesson,operationId:`native-reward-${i}`}))))
  assert.equal(receipts.reduce((sum,r)=>sum+r.xpGranted,0),10)
  assert.equal(receipts.filter(r=>!r.alreadyCompleted).length,1)
  assert.equal(await count(db,'select count(*) count from public.reward_ledger where user_id=$1 and activity_id=$2',[ids.userA,lesson]),1)
  assert.equal(await count(db,'select count(*) count from public.streak_days where user_id=$1',[ids.userA]),1)
 })
 await t.test('stale checkpoint contenders reject without persisting operation rows',async()=>{
  const results=await contenders(db,ids.userA,Array.from({length:jobs},(_,i)=>()=>command(db,'save_lesson_checkpoint',{lessonId:ids.mixedLesson,currentBlockId:ids.recapBlock,completedBlockIds:[],expectedRevision:0,operationId:`native-cursor-${i}`})))
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1)
  results.filter(r=>r.status==='rejected').forEach(r=>assert.equal(r.reason.code,'PT409'))
  assert.equal(await count(db,"select count(*) count from private.operations where user_id=$1 and operation_id like 'native-cursor-%'",[ids.userA]),1)
  assert.equal((await read(db,'lesson_progress',ids.mixedLesson)).revision,1)
 })
 await t.test('concurrent graded attempts produce unique indexes and one base/bonus reward',async()=>{
  const receipts=values(await contenders(db,ids.userA,Array.from({length:jobs},(_,i)=>()=>command(db,'submit_scored',{questionSetId:ids.quiz,answers:quizAnswers(),operationId:`native-quiz-${i}`}))))
  assert.equal(new Set(receipts.map(r=>r.attemptId)).size,jobs)
  assert.ok(receipts.every(r=>r.passed && r.score===3))
  assert.equal(await count(db,'select count(distinct retry_index) count from public.learning_attempts where user_id=$1 and activity_id=$2',[ids.userA,ids.quiz]),jobs)
  assert.equal(await count(db,'select count(*) count from public.reward_ledger where user_id=$1 and activity_id=$2',[ids.userA,ids.quiz]),2)
  assert.equal(Number((await db.query('select sum(xp_delta) xp from public.reward_ledger where user_id=$1 and activity_id=$2',[ids.userA,ids.quiz])).rows[0].xp),25)
  assert.equal(await count(db,'select count(*) count from public.streak_days where user_id=$1',[ids.userA]),1)
 })
 await t.test('concurrent video checkpoints merge ranges and reject competing stale revisions',async()=>{
  const context={lessonId:ids.videoLesson,blockId:ids.videoBlock}
  await command(db,'save_video_position',{...context,positionSeconds:0,watchedRanges:[],operationId:'native-video-start'})
  await db.query("update public.user_video_progress set telemetry_started_at=now()-interval '100 seconds' where user_id=$1 and block_id=$2",[ids.userA,ids.videoBlock])
  values(await contenders(db,ids.userA,Array.from({length:jobs},(_,i)=>()=>command(db,'save_video_position',{...context,positionSeconds:(i+1)*10,watchedRanges:[{start:i*10,end:(i+1)*10}],operationId:`native-video-range-${i}`}))))
  const video=await read(db,'video_progress',ids.videoLesson,ids.videoBlock)
  assert.deepEqual(video.watchedRanges,[{start:0,end:80}])
  assert.equal(video.positionSeconds,80)
  const results=await contenders(db,ids.userA,Array.from({length:jobs},(_,i)=>()=>command(db,'save_video_position',{...context,positionSeconds:90,watchedRanges:[{start:80,end:90}],expectedRevision:video.revision,operationId:`native-video-stale-${i}`})))
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1)
  results.filter(r=>r.status==='rejected').forEach(r=>assert.equal(r.reason.code,'PT409'))
  assert.equal(await count(db,"select count(*) count from private.operations where user_id=$1 and operation_id like 'native-video-stale-%'",[ids.userA]),1)
  assert.deepEqual((await read(db,'video_progress',ids.videoLesson,ids.videoBlock)).watchedRanges,[{start:0,end:90}])
 })
 await t.test('daily claims overlap across attempts but grant5 exactly once',async()=>{
  const attempts=await Promise.all(Array.from({length:jobs},(_,i)=>command(db,'submit_practice',{questionSetId:ids.practice,answers:quizAnswers(),operationId:`native-daily-attempt-${i}`})))
  const receipts=values(await contenders(db,ids.userA,attempts.map((a,i)=>()=>command(db,'complete_daily_review',{questionSetId:ids.practice,attemptId:a.attemptId,operationId:`native-daily-claim-${i}`}))))
  assert.equal(receipts.reduce((sum,r)=>sum+r.xpGranted,0),5)
  assert.equal(await count(db,'select count(*) count from private.daily_review_claims where user_id=$1',[ids.userA]),1)
  assert.equal(await count(db,"select count(*) count from public.reward_ledger where user_id=$1 and reward_type='daily_review'",[ids.userA]),1)
 })
 await t.test('A locking cannot redirect B ownership, B progresses independently and changed subject rolls back',async()=>{
  const lock=await db.connect()
  try {
   await lock.query('begin');await lock.query('select id from public.profiles where id=$1 for update',[ids.userA])
   const bInput={lessonId:ids.lesson,blockId:ids.textBlock,operationId:'native-b-independent'}
   const result=await Promise.race([command(db,'complete_block',bInput,ids.userB),new Promise((_,reject)=>setTimeout(()=>reject(new Error('B was blocked by A')),2000))])
   assert.equal(result.status,'confirmed')
   await assert.rejects(command(db,'complete_lesson',{lessonId:ids.lesson,expectedSubject:ids.userA,operationId:'native-b-wrong-owner'},ids.userB),e=>e.code==='42501')
   assert.equal(await count(db,'select count(*) count from private.operations where user_id=$1 and operation_id=$2',[ids.userB,'native-b-wrong-owner']),0)
  } finally {await lock.query('commit');lock.release()}
  assert.equal((await read(db,'account',null,null,ids.userB)).totalXp,0)
  assert.equal((await read(db,'account')).totalXp,50)
  await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'native-same-completion'},ids.userB)
  assert.equal((await read(db,'account',null,null,ids.userB)).totalXp,10)
  assert.equal((await read(db,'account')).totalXp,50)
 })
})
