import {after,test} from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'
import {fileURLToPath} from 'node:url'
import {accountHomeActivity} from '../../src/features/learning/journey/accountHomeActivity.ts'
import {createMockLearningServices} from '../../src/services/next/mock.ts'
import {loadJourney} from '../../src/features/learning/journey/journeyModel.ts'
import type {LearningServices as BackendServices} from '../../src/services/next/backendContracts.ts'
const vite=await createServer({configFile:false,envDir:false,resolve:{alias:{'@':fileURLToPath(new URL('../../src',import.meta.url))}},optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,hmr:false},appType:'custom'})
after(()=>vite.close())
const {HostedSyncStatus}=await vite.ssrLoadModule('/src/app/HostedSyncStatus.tsx')
const {JourneyHome}=await vite.ssrLoadModule('/src/features/learning/journey/JourneyHome.tsx')
test('hosted Home uses confirmed account streak and omits unavailable goals and weekly evidence',async()=>{
 const main=createMockLearningServices({chapters:[],lessons:[],storyVersions:[],mediaAssets:[]},{userId:'fixture'})
 const backend={account:{getSummary:async()=>({ok:true,value:{currentStreak:0}})}} as BackendServices
 const result=await loadJourney(main,accountHomeActivity(backend));assert.ok(result.ok)
 const html=renderToStaticMarkup(React.createElement(JourneyHome,{...result.value,headingRef:null,chapterButtonRef:()=>{},onChapter:()=>{}}))
 assert.ok(html.includes('0 NGÀY LIÊN TIẾP'));assert.ok(!html.includes('7 NGÀY LIÊN TIẾP'))
 assert.ok(!html.includes('home-goal-card'));assert.ok(!html.includes('đã học'))
 const mock=renderToStaticMarkup(React.createElement(JourneyHome,{chapters:[],activity:{streakDays:7,week:[],studiedMinutes:6,goalMinutes:10},headingRef:null,chapterButtonRef:()=>{},onChapter:()=>{}}))
 assert.ok(mock.includes('7 NGÀY LIÊN TIẾP')&&mock.includes('home-goal-card'))
})
test('hosted rejected queue exposes recoverable owner actions and does not claim XP',()=>{
 const props={pending:2,rejected:1,syncError:true,onRetry:async()=>{},onDiscard:async()=>{}}
 const html=renderToStaticMarkup(React.createElement(HostedSyncStatus,props))
 assert.ok(html.includes('2 thay đổi đang chờ đồng bộ'));assert.ok(html.includes('1 thay đổi đã bị từ chối'))
 assert.ok(html.includes('THỬ ĐỒNG BỘ LẠI'));assert.ok(html.includes('BỎ THAY ĐỔI BỊ TỪ CHỐI'))
 assert.ok(html.includes('role="alert"')&&html.includes('role="status"'));assert.ok(!/\+[0-9]+ XP/.test(html))
 assert.equal(renderToStaticMarkup(React.createElement(HostedSyncStatus,{...props,pending:0,rejected:0,syncError:false})), '')
})
