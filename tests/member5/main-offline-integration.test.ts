import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createMockLearningServices} from '../../src/services/next/backendMock.ts'
import {createOfflineLearningServices} from '../../src/services/offline/services.ts'
import {OfflineQueue} from '../../src/services/offline/queue.ts'
import {scopeLearningServices} from '../../src/services/offline/accountScope.ts'
import {createMainLearningServices} from '../../src/services/mainServices.ts'
import {success} from '../../src/services/next/backendContracts.ts'
function fixture(initialOnline=true){
 let online=initialOnline
 const values=new Map<string,string>()
 const queue=new OfflineQueue({getItem:key=>values.get(key)??null,setItem:(key,value)=>{values.set(key,value)}},()=>online)
 const base=createMockLearningServices({chapters:[],lessons:[],storyVersions:[],mediaAssets:[]},{userId:'A'})
 const calls:Array<Record<string,unknown>>=[]
 base.completion.completeBlock=async input=>{
  calls.push({...input})
  return success({status:'confirmed',lessonId:input.lessonId,blockId:input.blockId,method:input.method??'standard',alreadyCompleted:false,xpGranted:0,totalXp:0,currentStreak:0})
 }
 const runtime=createOfflineLearningServices(base,queue)
 const main=createMainLearningServices(scopeLearningServices(runtime.services,'A'),'A')
 return {main,queue,runtime,calls,setOnline:(next:boolean)=>{online=next}}
}
test('canonical block actions translate before strict offline DTO validation',async()=>{
 const ctx=fixture()
 for(const action of ['acknowledge','accessible_fallback','media_fallback'] as const){
  assert.deepEqual(await ctx.main.completion.recordBlockAction({lessonId:'lesson',blockId:'block',operationId:action,action}),{ok:true,value:null})
 }
 assert.deepEqual(ctx.calls.map(call=>call.method),['standard','accessible_fallback','media_fallback'])
 assert.ok(ctx.calls.every(call=>!('action' in call)&&call.expectedSubject==='A'))
 assert.deepEqual(ctx.queue.list('A'),[])
})
test('canonical acknowledgement queues safely and syncs the same intent after reconnect',async()=>{
 const ctx=fixture(false),input={lessonId:'lesson',blockId:'block',operationId:'stable-action',action:'acknowledge' as const}
 assert.deepEqual(await ctx.main.completion.recordBlockAction(input),{ok:false,error:'offline'})
 assert.equal(ctx.calls.length,0)
 assert.deepEqual(ctx.queue.list('A'),[{userId:'A',kind:'complete_block',input:{lessonId:'lesson',blockId:'block',operationId:'stable-action',method:'standard'}}])
 ctx.setOnline(true);await ctx.runtime.sync()
 assert.equal(ctx.calls.length,1);assert.equal(ctx.calls[0].operationId,'stable-action');assert.equal(ctx.calls[0].expectedSubject,'A')
 assert.deepEqual(ctx.queue.list('A'),[])
})

import {createCompletionController} from '../../src/features/learning/completion/completionController.ts'
import {createSummaryController} from '../../src/features/profile/summaryController.ts'
import type {CompletionReceipt} from '../../src/services/next/completionContracts.ts'
function canonicalFixture() {
 let online=false,actor='A',confirmed:CompletionReceipt|null=null
 const values=new Map<string,string>(),calls:Array<{lessonId:string;operationId:string;expectedSubject:string}>=[]
 const base=createMockLearningServices({chapters:[],lessons:[],storyVersions:[],mediaAssets:[]},{userId:'A'})
 const originalSession=base.auth.getSession
 base.auth.getSession=async()=>{const result=await originalSession();return result.ok&&result.value?success({...result.value,userId:actor}):result}
 base.mainContract={
  getSummary:async()=>success({userId:actor,displayName:'QA',locale:'vi-VN',timezone:'Asia/Ho_Chi_Minh',totalXp:confirmed?10:0,currentStreak:confirmed?1:0,longestStreak:confirmed?1:0,requiredLessonCount:confirmed?1:0,achievements:[]}),
  getCompletion:async()=>success(confirmed),
  completeLesson:async input=>{
   calls.push({...input})
   if(input.expectedSubject!==actor) return {ok:false,error:'unauthorized'}
   const already=!!confirmed
   confirmed??={userId:actor,lessonId:input.lessonId,contentVersionId:'v1',confirmedAt:'2026-10-02T10:00:00Z',method:'standard',reason:'required_blocks_satisfied',rewards:[]}
   return success({kind:already?'already_completed':'completed',receipt:confirmed})
  },
 }
 const attach=()=>{
  const queue=new OfflineQueue({getItem:key=>values.get(key)??null,setItem:(key,value)=>{values.set(key,value)}},()=>online)
  const runtime=createOfflineLearningServices(base,queue)
  const main=createMainLearningServices(scopeLearningServices(runtime.services,'A'),'A')
  return {queue,runtime,main}
 }
 return {...attach(),attach,calls,setOnline:(value:boolean)=>{online=value},setActor:(value:string)=>{actor=value}}
}
test('canonical completion persists original intent across reload and confirms only after owner sync',async()=>{
 const ctx=canonicalFixture(),summary=createSummaryController(ctx.main,'A')
 const controller=createCompletionController(ctx.main,{userId:'A',lessonId:'lesson',contentVersionId:'v1'},summary,()=> 'same-completion')
 await controller.restore()
 // A browser offline hint must reach the service queue instead of skipping it.
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'navigator')
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{onLine:false}})
 try {await controller.submit();await controller.submit()} finally {
  if(descriptor)Object.defineProperty(globalThis,'navigator',descriptor);else delete (globalThis as {navigator?:unknown}).navigator
 }
 assert.equal(ctx.calls.length,0)
 assert.equal(controller.getSnapshot().error,'offline')
 assert.equal(summary.getSnapshot().value,undefined)
 assert.deepEqual(ctx.queue.list('A'),[{userId:'A',kind:'complete_main_lesson',input:{lessonId:'lesson',operationId:'same-completion'}}])
 const restored=ctx.attach();ctx.setOnline(true);await restored.runtime.sync()
 assert.deepEqual(ctx.calls,[{lessonId:'lesson',operationId:'same-completion',expectedSubject:'A'}])
 assert.deepEqual(restored.queue.list('A'),[])
 await controller.restore();assert.equal(controller.getSnapshot().status,'confirmed')
 await summary.refresh();assert.equal(summary.getSnapshot().value?.totalXp,10)
})
test('queued canonical completion cannot be rewritten or replayed as another account',async()=>{
 const ctx=canonicalFixture()
 await ctx.main.completion.completeLesson({lessonId:'lesson',operationId:'fixed'})
 assert.deepEqual(await ctx.main.completion.completeLesson({lessonId:'other',operationId:'fixed'}),{ok:false,error:'conflict'})
 ctx.setOnline(true);ctx.setActor('B');await ctx.runtime.sync()
 assert.equal(ctx.calls.length,0);assert.equal(ctx.queue.list('A').length,1)
 assert.deepEqual(await ctx.main.completion.completeLesson({lessonId:'lesson',operationId:'new'}),{ok:false,error:'unauthorized'})
 assert.deepEqual(ctx.queue.list('B'),[])
 ctx.setActor('A');await ctx.runtime.sync();assert.equal(ctx.calls.length,1)
 assert.equal(ctx.calls[0].expectedSubject,'A');assert.equal(ctx.calls[0].operationId,'fixed')
})
test('ambiguous canonical response queues its original ID and server-confirmed retry clears pending',async()=>{
 const ctx=canonicalFixture();ctx.setOnline(true)
 const port=ctx.runtime.services.mainContract!
 // Use a separate runtime with an adapter reporting a lost response once.
 let first=true
 const base={...ctx.runtime.services,mainContract:{...port,completeLesson:async(input:{lessonId:string;operationId:string;expectedSubject:string})=>{
  if(first){first=false;return {ok:false,error:'server_error'} as const}
  return success({kind:'completed' as const,receipt:{userId:'A',lessonId:input.lessonId,contentVersionId:'v1',confirmedAt:'2026-10-02T10:00:00Z',method:'standard' as const,reason:'required_blocks_satisfied' as const,rewards:[]}})
 }}}
 const store=new Map<string,string>(),queue=new OfflineQueue({getItem:key=>store.get(key)??null,setItem:(key,value)=>{store.set(key,value)}})
 const runtime=createOfflineLearningServices(base,queue),main=createMainLearningServices(runtime.services,'A')
 const input={lessonId:'lesson',operationId:'ambiguous'}
 assert.deepEqual(await main.completion.completeLesson(input),{ok:false,error:'offline'})
 assert.equal(queue.list('A')[0].input.operationId,'ambiguous')
 assert.equal((await main.completion.completeLesson(input)).ok,true);assert.deepEqual(queue.list('A'),[])
})

test('ineligible queued canonical completion retains its ID, rejection and ordering until evidence is confirmed',async()=>{
 const ctx=canonicalFixture()
 let eligible=false,attempts=0
 const port=ctx.runtime.services.mainContract!
 const base={...ctx.runtime.services,mainContract:{...port,completeLesson:async(input:{lessonId:string;operationId:string;expectedSubject:string})=>{
  attempts++
  return eligible?success({kind:'completed' as const,receipt:{userId:'A',lessonId:input.lessonId,contentVersionId:'v1',confirmedAt:'2026-10-02T10:00:00Z',method:'standard' as const,reason:'required_blocks_satisfied' as const,rewards:[]}})
   :success({kind:'ineligible' as const,reasons:[{blockId:'missing',reason:'required_evidence_missing'}]})
 }}}
 let online=false
 const store=new Map<string,string>(),queue=new OfflineQueue({getItem:key=>store.get(key)??null,setItem:(key,value)=>{store.set(key,value)}},()=>online)
 const runtime=createOfflineLearningServices(base,queue),main=createMainLearningServices(runtime.services,'A')
 const input={lessonId:'lesson',operationId:'finish-before-evidence'}
 await main.completion.completeLesson(input)
 await main.completion.completeLesson({lessonId:'later',operationId:'later'})
 online=true;await runtime.sync()
 assert.equal(attempts,1);assert.equal(queue.list('A').length,2)
 assert.equal(queue.list('A')[0].error,'validation');assert.equal(queue.list('A')[0].input.operationId,input.operationId)
 const result=await main.completion.completeLesson(input)
 assert.equal(result.ok&&result.value.kind,'ineligible');assert.equal(queue.list('A').length,2)
 assert.equal(queue.list('A')[0].error,'validation')
 eligible=true;await runtime.sync();assert.deepEqual(queue.list('A'),[])
})
