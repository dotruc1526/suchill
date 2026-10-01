import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { withChrome } from './chrome.mjs'
import { serve } from './serve.mjs'

const root = new URL('evidence/', import.meta.url)
await mkdir(root, { recursive: true })
const results = []
const { server, url } = await serve()
try {
  await withChrome(url, async cdp => {
    const evaluate = async expression => {
      const response = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
      if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails))
      return response.result.value
    }
    for (let i = 0; i < 100; i++) {
      if (await evaluate('!!document.querySelector("#start")')) break
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    assert.ok(await evaluate('!!document.querySelector("#start")'))
    const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
    const choose = (selector, value) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('change', { bubbles: true })); })()`)
    const key = async (key, code = key, modifiers = 0) => {
      const windowsVirtualKeyCode = { Tab: 9, Enter: 13, Escape: 27 }[key]
      await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers, windowsVirtualKeyCode, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) })
      await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers, windowsVirtualKeyCode })
    }
    const shot = async filename => {
      await evaluate('window.scrollTo(0,0)')
      const rect = await evaluate(`(() => { const r = document.querySelector('.phone').getBoundingClientRect(); return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height,scale:1}; })()`)
      const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: rect })
      await writeFile(new URL(filename, root), Buffer.from(data, 'base64'))
    }
    for (const width of [375, 430]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 932, deviceScaleFactor: 1, mobile: true })
      for (const screen of ['chapter', 'lesson', 'vn', 'video', 'quiz', 'complete']) {
        await choose('#screen-select', screen)
        assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `${screen} ${width}: horizontal overflow`)
        const smallTargets = await evaluate(`Array.from(document.querySelectorAll('button,select,input,summary')).filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.height < 44 || r.width < 44) }).map(el => el.id || el.tagName)`)
        assert.deepEqual(smallTargets, [], `${screen} ${width}: touch target`)
        await shot(`${screen}-${width}.png`)
        for (const state of ['loading', 'error', 'offline', 'empty']) {
          await choose('#state-select', state)
          assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
          assert.ok(await evaluate('!!document.querySelector("[role=status]")'))
        }
        results.push(`${screen} ${width}px: layout, 44px targets, four failure/loading states PASS`)
      }
    }
    await choose('#screen-select', 'chapter'); await click('#start'); await click('#next-vn')
    await evaluate('document.querySelector("[data-choice=observe]").focus()'); await key('Enter')
    assert.equal(await evaluate('document.activeElement.dataset.choice'), 'observe')
    assert.equal(await evaluate('document.querySelector("[data-choice=observe]").getAttribute("aria-pressed")'), 'true')
    await click('#lock')
    assert.equal(await evaluate('document.querySelector("[data-choice=observe]").disabled'), true)
    assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-choice=observe]")).backgroundColor'), 'rgb(245, 230, 208)')
    await shot('vn-selected-430.png')
    await click('#review-lesson'); await click('#next-vn')
    assert.equal(await evaluate('document.querySelector("[data-choice=observe]").disabled'), true)
    await evaluate('document.querySelector("#restart").focus()'); await key('Enter')
    assert.equal(await evaluate('document.activeElement.id'), 'restart-cancel')
    await key('Tab', 'Tab', 8)
    assert.equal(await evaluate('document.activeElement.id'), 'restart-confirm')
    await key('Escape')
    assert.equal(await evaluate('document.activeElement.id'), 'restart')
    await click('#restart'); await click('#restart-confirm')
    assert.equal(await evaluate('document.querySelector("[data-choice=observe]").disabled'), false)
    results.push('VN: keyboard select/focus, neutral state, locked review, dialog trap/Escape/restore/restart PASS')
    await click('[data-choice=context]'); await click('#lock'); await click('#next-video')
    await evaluate('const seek = document.querySelector("#seek"); seek.value=24; seek.dispatchEvent(new Event("input",{bubbles:true}))')
    await click('#exit'); await click('#start')
    assert.equal(await evaluate('document.querySelector("#seek").value'), '24')
    await cdp('Page.reload')
    for (let i = 0; i < 100; i++) {
      if (await evaluate('!!document.querySelector("#seek")')) break
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    assert.equal(await evaluate('document.querySelector("#seek").value'), '24')
    await click('#captions')
    assert.equal(await evaluate('!!document.querySelector(".caption")'), false)
    await choose('#state-select', 'error')
    assert.ok(await evaluate('!!document.querySelector(".poster") && !!document.querySelector("details[open]")'))
    await shot('video-error-430.png'); await click('#state-action')
    assert.equal(await evaluate('document.querySelector("#seek").value'), '24')
    await click('#play')
    await evaluate('new Promise(resolve => setTimeout(resolve,1100))')
    await click('#play')
    assert.equal(await evaluate('document.querySelector("#seek").value'), '25')
    results.push('Video: seek, exit/resume/reload, captions, play/pause, poster/transcript fallback and retry PASS')
    await click('#next-quiz')
    assert.equal(await evaluate('document.querySelector("#submit").disabled'), true)
    await click('[data-choice=color]')
    assert.equal(await evaluate('document.querySelector("#submit").disabled'), true)
    await click('[data-choice=show]'); await click('#submit')
    assert.equal(await evaluate('document.querySelectorAll(".feedback.correct").length'), 1)
    assert.equal(await evaluate('document.querySelectorAll(".feedback.incorrect").length'), 1)
    await shot('quiz-feedback-430.png'); await click('#retry-quiz')
    await click('[data-choice=author]'); await click('[data-choice=show]'); await click('#submit'); await click('#next-complete')
    assert.ok(await evaluate('document.querySelector("main").textContent.includes("Đang chờ xác nhận")'))
    await choose('#state-select', 'confirmed'); await shot('completion-confirmed-430.png')
    results.push('Quiz: complete-set submission, per-question feedback, retry; completion pending/confirmed fixture PASS')
    const before = await evaluate('document.querySelector("#mute").getAttribute("aria-pressed")')
    await click('#mute'); await cdp('Page.reload')
    for (let i = 0; i < 100; i++) {
      if (await evaluate('!!document.querySelector("main h1")')) break
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    assert.notEqual(await evaluate('document.querySelector("#mute").getAttribute("aria-pressed")'), before)
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await choose('#state-select', 'loading')
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".busy")).animationName'), 'none')
    await choose('#screen-select', 'vn')
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".paper")).transform'), 'none')
    await evaluate('document.querySelector("[data-choice=observe]").focus()')
    await key('Tab'); await key('Tab')
    assert.notEqual(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'none')
    results.push('Mute persistence, reduced motion, visible keyboard focus PASS')
    for (const width of [375, 430]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 932, deviceScaleFactor: 1, mobile: true })
      await choose('#screen-select', 'lesson')
      await evaluate('document.querySelector("h1").textContent="Kháng chiến chống Mỹ ở Việt Nam: những câu hỏi, góc nhìn và tư liệu cần được đối chiếu trước khi kết luận"')
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
      await shot(`long-vietnamese-${width}.png`)
    }
    results.push('Long Vietnamese title wraps at 375px/430px without horizontal overflow PASS')
  })
} finally { await new Promise(resolve => server.close(resolve)) }
await writeFile(new URL('checks.json', root), JSON.stringify({ date: '2026-10-01', scope: 'Design prototype only; no production runtime or backend verification', results }, null, 2))
console.log(results.join('\n'))
