import { readdir, readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { bootstrap, seedFixtures, uuid } from './harness.mjs'

export const nativeBootstrap=bootstrap.replace('create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;',
 ()=>"do $$ begin if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if; if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if; if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if; end $$;")

export function nativeTestConnectionConfig(value,clusterOptIn) {
 if(clusterOptIn!=='1') throw new Error('Native tests require an explicitly dedicated disposable test cluster')
 let url
 try {url=new URL(value)} catch {throw new Error('Invalid native PostgreSQL test configuration')}
 if(url.protocol!=='postgresql:' || !['127.0.0.1','localhost','[::1]'].includes(url.hostname)
  || url.port!=='54329' || url.pathname!=='/postgres' || url.username!=='postgres' || url.search || url.hash) {
  throw new Error('Native tests require the dedicated loopback cluster on port54329 without URL overrides')
 }
 let password
 try {password=decodeURIComponent(url.password)} catch {throw new Error('Invalid native PostgreSQL test configuration')}
 return {host:url.hostname==='[::1]'?'::1':url.hostname,port:54329,user:'postgres',password,database:'postgres',ssl:false}
}

/** Disposable database on an explicitly selected loopback test cluster only. */
export async function createNativeTestDatabase({seed=true,existingBuckets=false,existingUsers=false,throughMigration}={}) {
 const config=nativeTestConnectionConfig(process.env.SUCHILL_NATIVE_PG_URL,process.env.SUCHILL_NATIVE_PG_TEST_CLUSTER)
 const {Client,Pool,types}=await import('pg')
 const parsers={getTypeParser(oid,format){return oid===20?value=>Number(value):types.getTypeParser(oid,format)}}
 const admin=new Client({...config,types:parsers,application_name:'suchill-native-test-admin'})
 const name=`suchill_review_${randomUUID().replaceAll('-','')}`
 if(!/^suchill_review_[a-f0-9]{32}$/.test(name)) throw new Error('Invalid disposable database identity')
 await admin.connect()
 let pool
 try {
  await admin.query(`create database ${name}`)
  pool=new Pool({...config,database:name,max:16,types:parsers,application_name:'suchill-native-review',connectionTimeoutMillis:5000})
  const wrap=client=>({exec:sql=>client.query(sql),query:(sql,params)=>client.query(sql,params)})
  const db={...wrap(pool),native:true,databaseName:name,connect:()=>pool.connect(),async transaction(callback){
   const client=await pool.connect()
   try {await client.query('begin');const result=await callback(wrap(client));await client.query('commit');return result}
   catch(error){await client.query('rollback');throw error}finally{client.release()}
  },async close(){
   await pool.end()
   await admin.query(`drop database ${name}`)
   await admin.end()
  }}
  // Roles belong to the disposable cluster; serialize their bootstrap across test databases.
  await admin.query('select pg_advisory_lock(20261002,54329)')
  try {
   await db.exec(nativeBootstrap)
  } finally {await admin.query('select pg_advisory_unlock(20261002,54329)')}
  if(existingBuckets) await db.exec("insert into storage.buckets(id,name,public) values('draft-media','draft-media',true),('published-media','published-media',true)")
  if(existingUsers) await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2),($3,$4)',[uuid(8001),{displayName:'Existing A',timezone:'Europe/Paris'},uuid(8002),{displayName:'Existing B',timezone:'invalid-zone',role:'admin'}])
  const migrations=(await readdir(new URL('../migrations/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort()
  if(throughMigration && !migrations.includes(throughMigration)) throw new Error('Unknown native migration checkpoint')
  for(const filename of migrations) {
   if(throughMigration && filename>throughMigration) break
   try {await db.exec(await readFile(new URL(`../migrations/${filename}`,import.meta.url),'utf8'))}
   catch(error){throw new Error(`Native migration ${filename}: ${error.message}`,{cause:error})}
  }
  if(seed) await seedFixtures(db)
  return db
 } catch(error) {
  if(pool) await pool.end()
  await admin.query(`drop database if exists ${name}`).catch(()=>{})
  await admin.end()
  throw error
 }
}
