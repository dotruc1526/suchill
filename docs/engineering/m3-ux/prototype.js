import * as screens from './screens.js'
import { icon } from './icons.js'

const key = 'suchill.m3-ux.prototype.v1'
const initial = { screen: 'chapter', state: 'ready', started: false, bookmark: 'lesson', reflection: null, locked: false, answers: {}, submitted: false, position: 0, volume: 40, captions: true, muted: true, playing: false }
let stored = {}
try { stored = JSON.parse(localStorage.getItem(key) || '{}') } catch { /* Private storage may be unavailable. */ }
const s = { ...initial, ...stored, playing: false, state: 'ready' }
if (!['chapter', 'lesson', 'vn', 'video', 'quiz', 'complete'].includes(s.screen)) s.screen = 'chapter'
let timer, audio
const main = document.querySelector('#content')
const dialog = document.querySelector('#restart-dialog')
const screenSelect = document.querySelector('#screen-select')
const stateSelect = document.querySelector('#state-select')
const mute = document.querySelector('#mute')
document.querySelector('#back').innerHTML = icon('back')
document.querySelector('#brand-icon').innerHTML = icon('book')
document.querySelector('#review-settings').open = !matchMedia('(max-width: 760px)').matches
function save() {
  try { localStorage.setItem(key, JSON.stringify({ ...s, playing: false, state: 'ready' })) } catch { /* Prototype can run without persistence. */ }
}
function render(focus = true, restore) {
  main.innerHTML = ['loading', 'error', 'offline', 'empty'].includes(s.state) ? screens.stateView(s.state, s.screen) : screens[s.screen](s)
  screenSelect.value = s.screen; stateSelect.value = s.state
  mute.setAttribute('aria-pressed', String(s.muted))
  mute.setAttribute('aria-label', s.muted ? 'Bật âm thanh' : 'Tắt âm thanh')
  mute.title = s.muted ? 'Âm thanh đang tắt' : 'Âm thanh đang bật'
  mute.innerHTML = icon(s.muted ? 'mute' : 'sound')
  main.setAttribute('aria-busy', String(s.state === 'loading'))
  document.querySelector('.phone').dataset.screen = s.screen
  if (focus) (restore ? main.querySelector(restore) || main : main).focus()
  save()
}
function navigate(screen, bookmark = true) {
  clearInterval(timer); s.playing = false; s.screen = screen; s.state = 'ready'
  if (bookmark && screen !== 'chapter') { s.started = true; s.bookmark = screen }
  render()
}
function tap() {
  if (s.muted) return
  try {
    audio ||= new AudioContext(); void audio.resume()
    const oscillator = audio.createOscillator(), gain = audio.createGain()
    oscillator.frequency.value = 800; gain.gain.value = .025
    oscillator.connect(gain); gain.connect(audio.destination)
    oscillator.start(); oscillator.stop(audio.currentTime + .03)
  } catch { /* Sound is optional. Text and visuals carry feedback. */ }
}
screenSelect.addEventListener('change', () => navigate(screenSelect.value, false))
stateSelect.addEventListener('change', () => { clearInterval(timer); s.playing = false; s.state = stateSelect.value; render() })
document.querySelector('#width-select').addEventListener('change', event => document.documentElement.style.setProperty('--preview-width', `${event.target.value}px`))
document.querySelector('#reset-preview').addEventListener('click', () => { clearInterval(timer); Object.assign(s, initial, { answers: {} }); render() })
mute.addEventListener('click', () => { s.muted = !s.muted; render(false); tap() })
document.querySelector('#back').addEventListener('click', () => {
  const prior = { chapter: 'chapter', lesson: 'chapter', vn: 'lesson', video: 'vn', quiz: 'video', complete: 'quiz' }
  navigate(prior[s.screen], false)
})
main.addEventListener('click', event => {
  const target = event.target.closest('button')
  if (!target || target.disabled) return
  tap()
  if (target.dataset.choice) {
    if (s.screen === 'vn') {
      s.reflection = target.dataset.choice
      render(true, `[data-choice="${s.reflection}"]`)
    } else if (s.screen === 'quiz') {
      const question = target.closest('[data-question]').dataset.question
      s.answers[question] = target.dataset.choice
      render(true, `[data-question="${question}"] [data-choice="${target.dataset.choice}"]`)
    }
    return
  }
  const actions = {
    start: () => navigate(s.started ? s.bookmark : 'lesson'),
    'next-vn': () => navigate('vn'),
    lock: () => { s.locked = true; render() },
    'next-video': () => navigate('video'),
    'review-lesson': () => navigate('lesson', false),
    'next-quiz': () => navigate('quiz'),
    exit: () => navigate('chapter', false),
    restart: () => dialog.showModal(),
    submit: () => { s.submitted = true; render() },
    'retry-quiz': () => { s.submitted = false; s.answers = {}; render() },
    'next-complete': () => navigate('complete'),
    captions: () => { s.captions = !s.captions; render(true, '#captions') },
    'state-action': () => ['empty', 'loading'].includes(s.state) ? navigate('chapter', false) : (s.state = 'ready', render()),
    play: () => {
      s.playing = !s.playing; clearInterval(timer); render(true, '#play')
      if (s.playing) timer = setInterval(() => {
        s.position = Math.min(60, s.position + 1); save()
        main.querySelector('#time').textContent = `${screens.formatTime(s.position)} / 1:00`
        main.querySelector('#seek').value = s.position
        main.querySelector('#seek').setAttribute('aria-valuetext', screens.formatTime(s.position))
        if (s.position === 60) { s.playing = false; clearInterval(timer); render(true, '#play') }
      }, 1000)
    },
  }
  actions[target.id]?.()
})
main.addEventListener('input', event => {
  if (event.target.id === 'seek') { s.position = Number(event.target.value); main.querySelector('#time').textContent = `${screens.formatTime(s.position)} / 1:00`; event.target.setAttribute('aria-valuetext', screens.formatTime(s.position)); save() }
  if (event.target.id === 'volume') { s.volume = Number(event.target.value); save() }
})
document.querySelector('#restart-cancel').addEventListener('click', () => dialog.close())
document.querySelector('#restart-confirm').addEventListener('click', () => {
  s.locked = false; s.reflection = null; dialog.close(); navigate('vn')
})
dialog.addEventListener('close', () => main.querySelector('#restart')?.focus())
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return
  const first = document.querySelector('#restart-cancel'), last = document.querySelector('#restart-confirm')
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
})
window.addEventListener('pagehide', () => { clearInterval(timer); save() })
render(false)
