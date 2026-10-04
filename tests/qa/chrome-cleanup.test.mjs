import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { test } from 'node:test'
import { terminateChild } from './chromeHarness.mjs'

test('Windows cleanup targets only the recorded owned PID tree and never a browser name', async () => {
  const child = Object.assign(new EventEmitter(), { pid: 45678, exitCode: null, signalCode: null,
    kill: () => assert.fail('Owned tree exits through the PID-specific command') })
  const calls = []
  await terminateChild(child, { platform: 'win32', spawnProcess(command, args, options) {
    calls.push({ command, args, options })
    const killer = new EventEmitter()
    queueMicrotask(() => { child.exitCode = 0; child.emit('exit', 0); killer.emit('exit', 0) })
    return killer
  }, wait: () => new Promise(() => {}) })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].command, 'taskkill')
  assert.deepEqual(calls[0].args, ['/PID', '45678', '/T', '/F'])
  assert.equal(calls[0].options.windowsHide, true)
})

test('an already exited child triggers no kill or process command', async () => {
  await terminateChild({ exitCode: 0, signalCode: null, kill: () => assert.fail('No kill after exit') }, {
    platform: 'win32', spawnProcess: () => assert.fail('No extra process after exit'),
  })
})

test('missing or unsafe PID never constructs a Windows tree command', async () => {
  for (const pid of [undefined, -1, 0, '45678']) {
    const child = Object.assign(new EventEmitter(), { pid, exitCode: null, signalCode: null,
      kill() { queueMicrotask(() => { this.exitCode = 0; this.emit('exit', 0) }) } })
    await terminateChild(child, { platform: 'win32', spawnProcess: () => assert.fail('Unsafe PID must not reach taskkill'),
      wait: () => new Promise(() => {}) })
  }
})
