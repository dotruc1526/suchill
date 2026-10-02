import test from 'node:test'
import assert from 'node:assert/strict'
import { nativeTestConnectionConfig, nativeBootstrap } from './nativeHarness.mjs'

test('native harness validates dedicated cluster and normalizes config before any connection',()=>{
 const valid='postgresql://postgres@127.0.0.1:54329/postgres'
 assert.deepEqual(nativeTestConnectionConfig(valid,'1'),{host:'127.0.0.1',port:54329,user:'postgres',password:'',database:'postgres',ssl:false})
 assert.throws(()=>nativeTestConnectionConfig(valid,undefined),/dedicated disposable test cluster/)
 for(const url of [
  `${valid}?host=remote.example`,`${valid}?host=127.0.0.1&port=5432`,`${valid}?sslmode=require`,`${valid}#host=remote.example`,
  'postgresql://postgres@remote.example:54329/postgres','postgresql://postgres@127.0.0.1:5432/postgres',
  'postgresql://postgres@127.0.0.1:54329/production','postgresql://service_role@127.0.0.1:54329/postgres',
  'https://postgres@127.0.0.1:54329/postgres','invalid-config-with-private-value',
 ]) assert.throws(()=>nativeTestConnectionConfig(url,'1'),error=>!error.message.includes(url) && /native|Native/.test(error.message))
})

test('native bootstrap preserves PostgreSQL dollar quoting while adapting cluster roles',()=>{
 assert.match(nativeBootstrap,/do \$\$ begin/)
 assert.match(nativeBootstrap,/end \$\$;/)
 assert.match(nativeBootstrap,/auth\.uid\(\).*as \$\$/)
 assert.equal((nativeBootstrap.match(/\$\$/g)??[]).length,6)
})
