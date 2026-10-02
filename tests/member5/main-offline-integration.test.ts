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
