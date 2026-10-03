import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HostedApp } from '../../../src/app/HostedApp'
import '../../../src/index.css'
localStorage.setItem('owned-hosted-pending','[{"operationId":"owned-hosted-stable"}]')
function Fixture() {
  const [mount,setMount]=useState(0)
  return <><button id="remount" onClick={()=>setMount(value=>value+1)}>Mở lại</button>
    <HostedApp key={mount}>{()=> <p id="learning-runtime-mounted">Learning/sync mounted</p>}</HostedApp></>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture /></React.StrictMode>)
