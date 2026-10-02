import { useState, useSyncExternalStore } from 'react'
import { Button } from '../../components/ui'
import { theme } from '../../theme/tokens'
import { pwaController } from '../../services/pwa/controller'

export function PwaStatus({ canUpdate }: { canUpdate: () => boolean }) {
 const state=useSyncExternalStore(pwaController.subscribe,pwaController.getSnapshot,pwaController.getSnapshot)
 const [deferred,setDeferred]=useState(false)
 const [busy,setBusy]=useState(false)
 const [failed,setFailed]=useState(false)
 const perform=async(reload=false)=>{
  if(busy)return
  setBusy(true); setFailed(false)
  try { const accepted = await (reload ? pwaController.reloadSafely(canUpdate) : pwaController.activate(canUpdate)); setFailed(!accepted && canUpdate()) }
  catch { setFailed(true) }
  finally { setBusy(false) }
 }
 if(!state.reloadNeeded&&!state.offline&&!state.waitingVersion&&state.status!=='error'&&!failed)return null
 return <section aria-label="Trạng thái ứng dụng" className="space-y-2 px-4 py-2 text-sm"
  style={{color:theme.colors.textPrimary,background:theme.colors.cardBg,borderBottom:'1px solid '+theme.colors.borderLight}}>
  {failed&&<p role="alert">Chưa hoàn tất được thao tác. Hãy đợi tiến độ được lưu rồi thử lại khi có kết nối.</p>}
  {state.offline&&<p role="status">Bạn đang ngoại tuyến. Nội dung chưa tải có thể cần mạng; XP chờ máy chủ xác nhận.</p>}
  {state.status==='error'&&<p role="status">Chưa kiểm tra hoặc cập nhật được ứng dụng. Bạn vẫn có thể tiếp tục học và thử lại sau.</p>}
  {state.reloadNeeded&&!state.waitingVersion&&<>
   <p role="status">Một màn hình chưa tải được. Hoàn tất thao tác rồi quay về Học để tải lại khi có mạng.</p>
   {canUpdate()&&state.manualSupported&&!state.offline
    ?<Button disabled={busy} onClick={()=>void perform(true)}>{busy?'ĐANG TẢI LẠI…':'TẢI LẠI ỨNG DỤNG'}</Button>
    :!state.manualSupported&&<p>Hoàn tất thao tác, đóng các tab Sử Chill rồi mở lại khi có mạng.</p>}
  </>}
  {state.waitingVersion&&<>
   <p role="status">Có phiên bản Sử Chill mới. Tiến độ đang chờ đồng bộ sẽ được giữ nguyên.</p>
   {!state.manualSupported?<p>Hoàn tất thao tác, đóng các tab Sử Chill rồi mở lại để dùng phiên bản mới.</p>
    :!canUpdate()?<p>Hoàn tất thao tác và quay về màn hình Học để cập nhật.</p>
    :<div className="flex flex-wrap gap-2">
      <Button disabled={busy} onClick={()=>void perform()}>{busy?'ĐANG CẬP NHẬT…':deferred?'CẬP NHẬT KHI SẴN SÀNG':'CẬP NHẬT ỨNG DỤNG'}</Button>
      {!deferred&&<Button variant="outline" disabled={busy} onClick={()=>setDeferred(true)}>ĐỂ SAU</Button>}
     </div>}
  </>}
 </section>
}
