/** A private reply port binds metadata to the exact worker that receives the request. */
export function workerVersion(worker: ServiceWorker, channel: () => MessageChannel, timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const ports = channel()
    const finish = (version?: string) => {
      clearTimeout(timer); ports.port1.close(); ports.port2.close()
      version ? resolve(version) : reject(new Error('Worker metadata unavailable'))
    }
    const timer = setTimeout(() => finish(), timeout)
    ports.port1.onmessage = event => {
      const version = event.data?.version
      finish(typeof version === 'string' && /^[a-f0-9]{20}$/.test(version) ? version : undefined)
    }
    ports.port1.onmessageerror = () => finish()
    try { worker.postMessage({ type: 'GET_VERSION' }, [ports.port2]) } catch { finish() }
  })
}

/** A foreign controller change cannot satisfy this activation request or trigger a reload. */
export function activateWorker(container: ServiceWorkerContainer, worker: ServiceWorker, version: string, timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const finish = (accepted: boolean) => {
      clearTimeout(timer); container.removeEventListener('controllerchange', changed)
      accepted ? resolve() : reject(new Error('Worker activation unavailable'))
    }
    const changed = () => { if (container.controller === worker) finish(true) }
    const timer = setTimeout(() => finish(false), timeout)
    container.addEventListener('controllerchange', changed)
    try { worker.postMessage({ type: 'ACTIVATE_UPDATE', version }); changed() } catch { finish(false) }
  })
}
