import {test,before,after} from 'node:test'
import assert from 'node:assert/strict'
import {createSupabaseLearningServices} from '../../src/services/supabase/services.ts'
import {scopeLearningServices} from '../../src/services/offline/accountScope.ts'
import {createMainLearningServices} from '../../src/services/mainServices.ts'
import {loadVisualNovel,advanceVisualNovel,chooseVisualNovel} from '../../src/features/visual-novel/v2/visualNovelModel.ts'
import {createTestDatabase,ids,uuid,read,command,asRole,quizAnswers} from './harness.mjs'
let db
before(async()=>{db=await createTestDatabase()})
after(async()=>{await db?.close()})
function adapter(initial=ids.userA){
 let actor=initial; const listeners=new Set()
 const client={rpc:async(name,args)=>{
  try{
   let value
   if(name==='learning_read')value=await read(db,args.p_kind,args.p_id,args.p_secondary_id,actor)
   else if(name==='learning_command')value=await command(db,args.p_kind,args.p_input,actor)
   else value=await asRole(db,actor?'authenticated':'anon',actor,async tx=>{
    const sql=name==='learning_m3_read'?'select public.learning_m3_read($1,$2::uuid,$3::uuid) value':'select public.learning_m3_complete($1::jsonb) value'
    const input=name==='learning_m3_read'?[args.p_kind,args.p_id??null,args.p_expected_subject]:[JSON.stringify(args.p_input)]
    return(await tx.query(sql,input)).rows[0].value
   })
   return {data:value,error:null}
  }catch(error){return {data:null,error:{code:error.code}}}
 },auth:{getSession:async()=>({data:{session:actor?{user:{id:actor,user_metadata:{}}}:null},error:null}),
 onAuthStateChange:listener=>{listeners.add(listener);return {data:{subscription:{unsubscribe:()=>listeners.delete(listener)}}}}},
 storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'https://fixture.invalid/media'},error:null})})}}
 const backend=createSupabaseLearningServices(client,{url:'https://fixture.supabase.co',publishableKey:'sb_publishable_fixture'})
 return {backend,main:createMainLearningServices(scopeLearningServices(backend,initial),initial),
  switchUser(id){actor=id;for(const listener of listeners)listener('SIGNED_IN',id?{user:{id,user_metadata:{}}}:null)}}
}
test('accepted main completion shape: ineligible retry, explicit acknowledgement, replay, restore and summary',async()=>{
 const {main}=adapter();const input={lessonId:ids.lesson,operationId:'main-text-completion'}
 const lesson=await main.lessons.getById(ids.lesson);assert.equal(lesson.value.contentVersionId,ids.lesson)
 assert.equal((await main.completion.getLessonCompletion(ids.lesson)).value,null)
 const missing=await main.completion.completeLesson(input);assert.equal(missing.value.kind,'ineligible')
 assert.deepEqual(missing.value.reasons,[{blockId:ids.textBlock,reason:'required_evidence_missing'}])
 assert.deepEqual(await main.completion.recordBlockAction({lessonId:ids.lesson,blockId:ids.textBlock,operationId:'main-text-ack',action:'acknowledge'}),{ok:true,value:null})
 const completed=await main.completion.completeLesson(input);assert.equal(completed.value.kind,'completed')
 const receipt=completed.value.receipt;assert.equal(receipt.userId,ids.userA);assert.equal(receipt.contentVersionId,ids.lesson)
 assert.ok(Number.isFinite(Date.parse(receipt.confirmedAt)));assert.equal(receipt.rewards[0].xpDelta,10)
 assert.deepEqual(await main.completion.completeLesson(input),completed)
 assert.deepEqual((await main.completion.getLessonCompletion(ids.lesson)).value,receipt)
 const retry=await main.completion.completeLesson({...input,operationId:'main-text-another'});assert.equal(retry.value.kind,'already_completed')
 assert.equal(retry.value.receipt.rewards[0].xpDelta,0)
 const summary=await main.users.getAccountSummary();assert.equal(summary.value.totalXp,10);assert.equal(summary.value.requiredLessonCount,1)
 assert.equal(summary.value.locale,'vi-VN');assert.deepEqual(summary.value.achievements,[])
})
test('main RPC rejects account substitution, operation reuse and direct receipt access',async()=>{
 const {backend,main,switchUser}=adapter(ids.userB)
 assert.deepEqual(await backend.mainContract.getCompletion(ids.lesson,ids.userA),{ok:false,error:'unauthorized'})
 assert.equal((await main.completion.getLessonCompletion(ids.lesson)).value,null)
 switchUser(ids.userA)
 assert.deepEqual(await main.users.getAccountSummary(),{ok:false,error:'unauthorized'})
 await assert.rejects(asRole(db,'authenticated',ids.userA,tx=>tx.query('select * from private.m3_completion_receipts')))
 const own=adapter();assert.deepEqual(await own.main.completion.completeLesson({lessonId:ids.vnLesson,operationId:'main-text-completion'}),{ok:false,error:'conflict'})
 assert.deepEqual(await own.backend.mainContract.completeLesson({lessonId:ids.lesson,operationId:'spoof',expectedSubject:ids.userA,xp:999}),{ok:false,error:'validation'})
})
test('main Visual Novel uses trusted feedback and server verifies episode before completion',async()=>{
 const {main}=adapter();const context={lessonId:ids.vnLesson,blockId:ids.vnBlock,storyVersionId:ids.version}
 const loaded=await loadVisualNovel(main,context);assert.ok(loaded.ok)
 const choiceScene=loaded.value.story.scenes.find(scene=>scene.id===ids.check)
 assert.equal('isCorrect' in choiceScene.choices[0],false)
 const advanced=await advanceVisualNovel(main,context,loaded.value,'main-vn-advance');assert.ok(advanced.ok)
 const wrong=await chooseVisualNovel(main,context,advanced.value,ids.wrong,'main-vn-wrong');assert.equal(wrong.value.feedback.outcome,'incorrect')
 const correct=await chooseVisualNovel(main,context,advanced.value,ids.correct,'main-vn-correct')
 // Wrong submission advances revision, so restore before another device submits.
 assert.equal(correct.ok,false);assert.equal(correct.error,'conflict')
 const restored=await loadVisualNovel(main,context)
 const approved=await chooseVisualNovel(main,context,restored.value,ids.correct,'main-vn-correct-restored');assert.equal(approved.value.feedback.outcome,'correct')
 const completed=await main.completion.completeLesson({lessonId:ids.vnLesson,operationId:'main-vn-complete'});assert.equal(completed.value.kind,'completed')
 assert.ok(completed.value.receipt.rewards.some(reward=>reward.rewardType==='episode'&&reward.xpDelta===20))
})
test('main scored quiz completion retains authoritative reward scopes and no farming',async()=>{
 const {main}=adapter();const input={lessonId:ids.quizLesson,operationId:'main-quiz-complete'}
 assert.equal((await main.completion.completeLesson(input)).value.kind,'ineligible')
 assert.ok((await main.quiz.submitScoredAttempt({questionSetId:ids.quiz,operationId:'main-quiz-grade',answers:quizAnswers()})).ok)
 const completed=await main.completion.completeLesson(input);assert.equal(completed.value.kind,'completed')
 assert.ok(completed.value.receipt.rewards.some(reward=>reward.rewardType==='quiz'))
 assert.deepEqual(await main.completion.completeLesson(input),completed)
})

test('native main independent requests serialize canonical receipts and grant XP once',async t=>{
 if(!db.native){t.skip('Requires dedicated native PostgreSQL cluster');return}
 const a=adapter(ids.userB),b=adapter(ids.userB)
 assert.ok((await a.main.completion.recordBlockAction({lessonId:ids.lesson,blockId:ids.textBlock,operationId:'native-main-ack',action:'acknowledge'})).ok)
 const input={lessonId:ids.lesson,operationId:'native-main-race'}
 const results=await Promise.all([a.main.completion.completeLesson(input),b.main.completion.completeLesson(input)])
 assert.equal(results[0].value.kind,'completed');assert.deepEqual(results[1],results[0])
 const different=await Promise.all([a.main.completion.completeLesson({...input,operationId:'native-main-again-a'}),b.main.completion.completeLesson({...input,operationId:'native-main-again-b'})])
 assert.ok(different.every(result=>result.value.kind==='already_completed'&&result.value.receipt.rewards.every(reward=>reward.xpDelta===0)))
 assert.equal((await a.main.users.getAccountSummary()).value.totalXp,10)
})

test('receipt RLS default-deny and optional video fallback does not change required lesson method',async()=>{
 const lid=uuid(9900),recap=uuid(9901),video=uuid(9902),chapter=uuid(9903)
 assert.equal((await db.query("select relrowsecurity from pg_class where oid='private.m3_completion_receipts'::regclass")).rows[0].relrowsecurity,true)
 assert.equal((await db.query("select count(*)::int n from pg_policies where schemaname='private' and tablename='m3_completion_receipts'")).rows[0].n,0)
 await db.query("insert into public.chapters(id,slug,title,summary,historical_period_label,estimated_minutes) values($1,'optional-fallback-fixture','Technical fixture','Not canonical','Fixture',5)",[chapter])
 await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,99,'optional-fallback-fixture','Technical fixture','Not canonical','mixed',5)",[lid,chapter])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,kind,document_id,required) values($1,$2,0,'recap',$3,true)",[recap,lid,ids.recapDocument])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,kind,media_asset_id,required,completion_policy) values($1,$2,1,'video',$3,false,'watch_threshold')",[video,lid,ids.video])
 await db.query("update public.lessons set status='published' where id=$1",[lid])
 await db.query("update public.chapters set status='published' where id=$1",[chapter])
 const {main}=adapter()
 assert.ok((await main.completion.recordBlockAction({lessonId:lid,blockId:recap,action:'acknowledge',operationId:'optional-recap-ack'})).ok)
 assert.ok((await main.completion.recordBlockAction({lessonId:lid,blockId:video,action:'accessible_fallback',operationId:'optional-video-fallback'})).ok)
 const completed=await main.completion.completeLesson({lessonId:lid,operationId:'optional-video-lesson'})
 assert.ok(completed.ok);assert.equal(completed.value.kind,'completed');assert.equal(completed.value.receipt.method,'standard')
})
