export type WorkerBuild = { version: string; allowed: string[]; precache: string[] }

/** All cache keys come from this build or previous caches created by this same static-only worker. */
export function workerSource(build: WorkerBuild): string {
 return `'use strict';
const VERSION = ${JSON.stringify(build.version)};
const PREFIX = 'suchill-static-';
const CACHE = PREFIX + VERSION;
const ALLOWED = new Set(${JSON.stringify(build.allowed)});
const PRECACHE = ${JSON.stringify(build.precache)};
const ORIGIN = self.location.origin;
const staticAsset = /^\\/assets\\/[A-Za-z0-9_.-]+\\.(?:js|css|png|svg|webp|avif|woff2)$/;
const privatePath = /^\\/(?:auth|api|rest|functions|storage)(?:\\/|$)/;
const publicRequest = path => new Request(new URL(path, ORIGIN), {credentials:'omit',cache:'reload'});
function cacheable(response) { return response.ok && response.type === 'basic' && !response.redirected; }
self.addEventListener('install', event => event.waitUntil((async () => {
 const cache = await caches.open(CACHE);
 try {
  await Promise.all(PRECACHE.map(async path => {
   const response = await fetch(publicRequest(path));
   if (!cacheable(response)) throw new Error('Static install failed');
   await cache.put(path, response);
  }));
 } catch (error) { await caches.delete(CACHE); throw error; }
 // Update workers wait for an explicit safe-state message. Initial installation activates normally.
})()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
 if (event.data?.type === 'GET_VERSION') { event.ports?.[0]?.postMessage({version:VERSION}); return; }
 if (event.data?.type !== 'ACTIVATE_UPDATE' || event.data?.version !== VERSION || !event.source?.id) return;
 event.waitUntil((async () => {
  const client = await self.clients.get(event.source.id);
  if (!client || client.type !== 'window') return;
  const url = new URL(client.url);
  if (url.origin !== ORIGIN || url.search || url.hash) return;
  await self.skipWaiting();
 })());
});
async function cachedAsset(path) {
 const current = await caches.open(CACHE);
 const found = await current.match(path);
 if (found) return found;
 // Old hashed resources remain available to another open tab; no unrelated caches are searched.
 if (staticAsset.test(path)) {
  const names = await caches.keys();
  for (const name of names.filter(name => name.startsWith(PREFIX) && name !== CACHE)) {
   const cache = await caches.open(name), old = await cache.match(path);
   if (old) return old;
  }
 }
 if (!ALLOWED.has(path)) return fetch(publicRequest(path));
 const response = await fetch(publicRequest(path));
 if (cacheable(response)) await current.put(path, response.clone());
 return response;
}
async function navigation(request, url) {
 const cache = await caches.open(CACHE);
 if (!url.search && !url.hash) {
  const shell = await cache.match('/index.html');
  if (shell) return shell;
 }
 // Callback/query pages must reach the network and never become cache entries.
 try { return await fetch(request); }
 catch {
  const offline = await cache.match('/offline.html');
  return offline || new Response('Chưa có kết nối. Hãy kết nối mạng rồi tải lại.', {status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
 }
}
self.addEventListener('fetch', event => {
 const request = event.request, url = new URL(request.url);
 if (request.method !== 'GET' || url.origin !== ORIGIN || request.headers.has('Authorization') || privatePath.test(url.pathname)) return;
 if (request.mode === 'navigate') { event.respondWith(navigation(request,url)); return; }
 if (url.search || url.hash) return;
 if (ALLOWED.has(url.pathname) || staticAsset.test(url.pathname)) event.respondWith(cachedAsset(url.pathname));
});
`
}
