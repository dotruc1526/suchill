import { pwaController } from '../../../src/services/pwa/controller'
import { OFFLINE_QUEUE_LOCK } from '../../../src/services/offline/queue'
declare const __PWA_QA_VERSION__: string
const version = __PWA_QA_VERSION__
const pending = '[{"userId":"owned-synthetic-user","kind":"complete_lesson","input":{"operationId":"owned-fixed-operation","lessonId":"owned-fixture"}}]'
const auth = '{"access_token":"synthetic-owned-session","user":{"id":"owned-synthetic-user"}}'
if (!localStorage.getItem(OFFLINE_QUEUE_LOCK)) localStorage.setItem(OFFLINE_QUEUE_LOCK, pending)
if (!localStorage.getItem('owned-auth-session')) localStorage.setItem('owned-auth-session', auth)
let safe = false, release: (() => void) | undefined, held = false
let result: boolean | 'pending' | undefined
const render = () => {
  document.getElementById('root')!.innerHTML = '<h1>Sử Chill PWA '+version+'</h1><p>Trang kiểm thử riêng, không kết nối tài khoản thật.</p><p id="status">'+pwaController.getSnapshot().status+'</p>'
}
pwaController.subscribe(render)
Object.assign(window, { __pwaQA: {
  version, snapshot: pwaController.getSnapshot, setSafe(value: boolean) { safe=value },
  activate() { result='pending'; void pwaController.activate(()=>safe).then(value=>{result=value}) },
  result: () => result, held: () => held,
  holdQueue() {
    void navigator.locks.request(OFFLINE_QUEUE_LOCK, async()=> {
      held=true; await new Promise<void>(resolve=>{release=resolve}); held=false
    })
  },
  releaseQueue() { release?.(); release=undefined },
  loadDeferred: () => import('./pwa-deferred').then(value=>value.content),
  async update() { await (await navigator.serviceWorker.getRegistration())?.update() },
} })
render()
void pwaController.start(true)
