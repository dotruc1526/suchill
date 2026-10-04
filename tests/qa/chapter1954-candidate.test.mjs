import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: 'custom' })
after(() => vite.close())
const { candidateLessons, lessonOneCandidate, lessonSixCandidate } = await vite.ssrLoadModule('/src/services/reference1954/candidateLessons.ts')
const allLessons = { draft01: lessonOneCandidate, ...candidateLessons, draft06: lessonSixCandidate }
const { sources } = JSON.parse(await readFile('docs/content/chapter1954/SOURCE-REGISTER.json', 'utf8'))
const { claims } = JSON.parse(await readFile('docs/content/chapter1954/CLAIM-REGISTER.json', 'utf8'))
const sourceMap = new Map(sources.map(source => [source.id, source]))

test('every study and assessment binds to a registered source supporting its episode', () => {
  const ids = new Set()
  assert.deepEqual(Object.keys(candidateLessons).sort(), ['draft02', 'draft03', 'draft04', 'draft05', 'draft07'])
  assert.equal(Object.keys(allLessons).length, 7)
  for (const [view, lesson] of Object.entries(allLessons)) {
    const episode = Number(view.slice(-2))
    const supported = new Set(claims.filter(claim => claim.episode === episode).flatMap(claim => claim.sourceIds))
    for (const block of [...lesson.sections, ...lesson.checks]) {
      assert.ok(!ids.has(block.id), `duplicate identity ${block.id}`)
      ids.add(block.id)
      assert.ok(block.sourceIds.length > 0)
      assert.ok(block.sourceIds.some(id => supported.has(id)), `${block.id} has no episode source`)
      for (const id of block.sourceIds) assert.ok(sourceMap.has(id), `unknown source ${id}`)
    }
    for (const check of lesson.checks) {
      const choices = check.choices.map(choice => choice.id)
      assert.equal(new Set(choices).size, choices.length, check.id)
      assert.equal(choices.filter(id => id === check.answerId).length, 1, `broken answer ${check.id}`)
      assert.ok(check.explanation.trim().length > 20)
    }
  }
})

test('candidate learning preserves phase, location, plan and implementation boundaries', () => {
  const content = view => candidateLessons[view].sections.flatMap(section => section.paragraphs).join(' ')
  assert.match(content('draft02'), /20–22\/11\/1953/)
  assert.match(content('draft02'), /dự tính.*chưa phải kết quả chắc chắn/)
  assert.match(content('draft04'), /Đợt III bắt đầu ngày 1\/5.*Ngày 7\/5, cuộc tổng công kích/)
  assert.match(content('draft05'), /phân khu Nam còn tiếp diễn trong đêm/)
  assert.match(content('draft07'), /miền Bắc ngày 27\/7, miền Trung ngày 1\/8 và miền Nam ngày 11\/8/)
  assert.match(content('draft07'), /không phải biên giới chính trị hay lãnh thổ/)
  assert.match(content('draft07'), /dự kiến tổng tuyển cử/)
  assert.match(lessonSixCandidate.sections.flatMap(section => section.paragraphs).join(' '), /20\/7\/1954.*21\/7\/1954/)
  const assessments = Object.values(allLessons).flatMap(lesson => lesson.checks)
  assert.ok(!assessments.some(check => /55|56 ngày|261[.,]453|25[.,]0/.test(check.prompt)))
  assert.ok(claims.every(claim => claim.canonicalUseAllowed === false && claim.reviewer === null))
})
