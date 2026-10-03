import { passwordRecoveryFor } from '../../../src/services/supabase/passwordRecovery'
import { success } from '../../../src/services/next/backendContracts'
let created=0
const pendingProof='[{"operationId":"owned-hosted-stable"}]'
Object.assign(window,{hostedQA:{created:()=>created,pendingProof}})
export function createLearningRuntime() {
  created+=1
  const callbacks=new Set<(event:string,session:unknown)=>void>()
  const session={access_token:'owned-sdk-proof',refresh_token:'owned-refresh',user:{id:'owned-hosted-a',user_metadata:{username:'owned_hosted',display_name:'Tài khoản thử nghiệm'}}}
  const callbackPresent=new URL(location.href).searchParams.has('code')
  if(callbackPresent)history.replaceState(history.state,'','?account=recovery')
  const client={auth:{
    onAuthStateChange(callback:(event:string,session:unknown)=>void) {callbacks.add(callback);return{data:{subscription:{unsubscribe(){callbacks.delete(callback)}}}}},
    async initialize(){return{error:null}},async getSession(){return{data:{session},error:null}},
    async getUser(){return{data:{user:session.user},error:null}},
  },functions:{async invoke(){return{data:{updated:true},error:null}}}}
  if(callbackPresent)setTimeout(()=>callbacks.forEach(callback=>callback('PASSWORD_RECOVERY',session)),0)
  const auth={...passwordRecoveryFor(client as never),async getSession(){return success({userId:session.user.id,username:'owned_hosted'})},
    subscribe(){return()=>{}}}
  return{services:{auth},mode:'supabase'}
}
