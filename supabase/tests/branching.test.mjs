import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDatabase, command, read, ids, uuid } from './harness.mjs'

test('required VN checks apply to the visited branch; completed replay changes no records',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 const [chapter,lesson,block,story,version,start,branch,checkA,checkB,end,chooseA,chooseB,correctA,correctB]=Array.from({length:14},(_,i)=>uuid(1000+i))
 await db.query("insert into public.chapters(id,slug,title,summary,historical_period_label,estimated_minutes) values($1,$2,'Branch fixture','Technical fixture','Fixture',1)",[chapter,chapter])
 await db.query("insert into public.visual_novel_stories(id,slug,title,summary) values($1,$2,'Branch fixture','Technical fixture')",[story,story])
 await db.query('insert into public.story_versions(id,story_id,version_number) values($1,$2,1)',[version,story])
 await db.transaction(async tx=>{
  await tx.query("insert into public.scenes(id,story_version_id,order_index,kind,next_scene_id,payload,required_check) values($1,$2,0,'narration',$3,$4,false),($3,$2,1,'choice',null,$5,false),($6,$2,2,'choice',null,$7,true),($8,$2,3,'choice',null,$7,true),($9,$2,4,'end',null,$10,false)",
   [start,version,branch,{text:'Fixture branches'}, {prompt:'Choose a branch',policy:'continue_after_feedback'},checkA,{prompt:'Required branch check',policy:'retry_until_correct'},checkB,end,{summary:'Fixture end'}])
  await tx.query("insert into public.scene_choices(id,scene_id,order_index,kind,label,next_scene_id) values($1,$2,0,'branching','Branch A',$3),($4,$2,1,'branching','Branch B',$5),($6,$3,0,'knowledge_check','A',$7),($8,$5,0,'knowledge_check','B',$7)",[chooseA,branch,checkA,chooseB,checkB,correctA,end,correctB])
  await tx.query("insert into private.scene_answer_keys(choice_id,is_correct,explanation) values($1,true,'Trusted branch A feedback'),($2,true,'Trusted branch B feedback')",[correctA,correctB])
  await tx.query("update public.story_versions set start_scene_id=$1,status='published',published_at=now() where id=$2",[start,version])
 })
 await db.query("insert into public.lessons(id,chapter_id,order_index,slug,title,summary,format,estimated_minutes) values($1,$2,0,$3,'Branch fixture','Technical fixture','visual_novel',1)",[lesson,chapter,lesson])
 await db.query("insert into public.lesson_blocks(id,lesson_id,order_index,kind,story_version_id) values($1,$2,0,'visual_novel',$3)",[block,lesson,version])
 await db.query("update public.lessons set status='published' where id=$1",[lesson])
 await db.query("update public.chapters set status='published' where id=$1",[chapter])
 const context={lessonId:lesson,blockId:block,storyVersionId:version}
 await command(db,'save_episode_checkpoint',{...context,currentSceneId:start,visitedSceneIds:[start],operationId:'branch-start'})
 await command(db,'save_episode_checkpoint',{...context,currentSceneId:branch,visitedSceneIds:[start,branch],operationId:'branch-choice'})
 await command(db,'record_choice',{...context,sceneId:branch,choiceId:chooseA,operationId:'branch-a'})
 await command(db,'record_choice',{...context,sceneId:checkA,choiceId:correctA,operationId:'branch-a-check'})
 const completed=await command(db,'complete_block',{lessonId:lesson,blockId:block,operationId:'branch-end'})
 assert.equal(completed.xpGranted,20)
 const before=await read(db,'episode_progress',version)
 assert.ok(!before.visitedSceneIds.includes(checkB))
 const attemptCount=(await db.query('select count(*) count from public.learning_attempts where user_id=$1',[ids.userA])).rows[0].count
 const exploration=await command(db,'record_choice',{...context,sceneId:branch,choiceId:chooseB,replay:true,operationId:'replay-other-branch'})
 assert.equal(exploration.choiceFeedback.outcome,'neutral')
 const newFeedback=await command(db,'record_choice',{...context,sceneId:checkB,choiceId:correctB,replay:true,operationId:'replay-new-check'})
 assert.equal(newFeedback.choiceFeedback.outcome,'correct')
 assert.deepEqual(await read(db,'episode_progress',version),before)
 assert.equal((await db.query('select count(*) count from public.learning_attempts where user_id=$1',[ids.userA])).rows[0].count,attemptCount)
 assert.equal((await read(db,'account')).totalXp,20)
})

test('trusted account deletion removes personal learning data while ordinary ledger mutation fails',async t=>{
 const db=await createTestDatabase()
 t.after(()=>db.close())
 await command(db,'complete_block',{lessonId:ids.lesson,blockId:ids.textBlock,operationId:'delete-user-text'})
 await command(db,'complete_lesson',{lessonId:ids.lesson,operationId:'delete-user-lesson'})
 await assert.rejects(db.query('delete from public.reward_ledger where user_id=$1',[ids.userA]),e=>e.code==='42501')
 await db.query('delete from auth.users where id=$1',[ids.userA])
 for(const table of ['profiles','user_settings','user_lesson_progress','reward_ledger','streak_days']) {
  const field=table==='profiles'?'id':'user_id'
  assert.equal((await db.query(`select count(*) count from public.${table} where ${field}=$1`,[ids.userA])).rows[0].count,0)
 }
 const audit=(await db.query("select user_id,payload from private.audit_events where kind='account_deleted'")).rows
 assert.deepEqual(audit,[{user_id:null,payload:{}}])
})
