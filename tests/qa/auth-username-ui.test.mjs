import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const vite = await createServer({
  configFile: false, resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  server: { middlewareMode: true, hmr: false }, appType: 'custom',
})
after(async () => vite.close())
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props))
const input = (html, name) => (html.match(/<input\b[^>]*>/g) ?? []).find(tag => tag.includes(`name="${name}"`)) ?? ''
const submit = async () => true
const noop = async () => ({ ok: true, value: null })

test('sign-in accepts username or legacy email and supports password managers', async () => {
  const { AccessCredentialsForm } = await vite.ssrLoadModule('/src/features/auth/AccessCredentialsForm.tsx')
  const html = render(AccessCredentialsForm, { mode: 'signIn', busy: false, onSubmit: submit })
  assert.match(html, /Tên đăng nhập hoặc email/)
  assert.match(input(html, 'email'), /type="text"/)
  assert.match(input(html, 'email'), /autoComplete="username"/)
  assert.match(input(html, 'password'), /autoComplete="current-password"/)
  assert.match(html, /aria-label="Hiện mật khẩu"/)
})

test('username signup requires no mailbox and validates a repeated new password', async () => {
  const { AccessCredentialsForm } = await vite.ssrLoadModule('/src/features/auth/AccessCredentialsForm.tsx')
  const html = render(AccessCredentialsForm, { mode: 'signUp', busy: false, onSubmit: submit })
  assert.match(html, /Không cần email để bắt đầu học/)
  assert.equal(input(html, 'email'), '')
  assert.equal(input(html, 'recoveryEmail'), '')
  assert.match(input(html, 'username'), /pattern="\[A-Za-z0-9_\]\{3,32\}"/)
  for (const name of ['password', 'passwordConfirm']) {
    assert.match(input(html, name), /autoComplete="new-password"/)
    assert.match(input(html, name), /minLength="8"/)
  }
})

test('forgotten-password form asks for a confirmed real recovery email', async () => {
  const { AccessCredentialsForm } = await vite.ssrLoadModule('/src/features/auth/AccessCredentialsForm.tsx')
  const html = render(AccessCredentialsForm, { mode: 'forgotPassword', busy: false, onSubmit: submit })
  assert.match(html, /email khôi phục đã xác nhận/)
  assert.match(input(html, 'recoveryEmail'), /type="email"/)
  assert.equal(input(html, 'password'), '')
})

test('existing verified email and claimed username cannot be changed by enrollment forms', async () => {
  const { AccountSecurity } = await vite.ssrLoadModule('/src/features/auth/AccountSecurity.tsx')
  const html = render(AccountSecurity, {
    auth: { getSession: noop, claimUsername: noop, setRecoveryEmail: noop, updatePassword: noop },
    session: { userId: 'fixture', displayName: 'Fixture', username: 'stable_name', recoveryEmail: 'fixture@example.invalid' },
    busy: false, onSubmit: submit, onSessionChange() {},
  })
  assert.match(html, /stable_name/)
  assert.equal(input(html, 'username'), '')
  assert.equal(input(html, 'recoveryEmail'), '')
  assert.match(html, /Email đã xác nhận/)
  assert.match(input(html, 'password'), /autoComplete="new-password"/)
})

test('pending recovery stays optional and active requests disable editing', async () => {
  const { AccountSecurity } = await vite.ssrLoadModule('/src/features/auth/AccountSecurity.tsx')
  const html = render(AccountSecurity, {
    auth: { getSession: noop, claimUsername: noop, setRecoveryEmail: noop, updatePassword: noop },
    session: { userId: 'fixture', displayName: 'Fixture', pendingRecoveryEmail: 'fixture@example.invalid' },
    busy: true, onSubmit: submit, onSessionChange() {},
  })
  assert.match(html, /Bạn vẫn có thể học/)
  assert.match(html, /chưa dùng được để khôi phục/)
  assert.doesNotMatch(html, /Email đã xác nhận/)
  for (const name of ['username', 'recoveryEmail', 'password', 'passwordConfirm']) {
    assert.match(input(html, name), /disabled=""/)
  }
})

test('auth field links visible label, helper and error without hiding password controls', async () => {
  const { AuthField } = await vite.ssrLoadModule('/src/features/auth/AuthField.tsx')
  const html = render(AuthField, { name: 'password', label: 'Mật khẩu', type: 'password', error: 'Lỗi cụ thể', hint: 'Hướng dẫn' })
  const field = input(html, 'password')
  const id = field.match(/id="([^"]+)"/)[1]
  assert.ok(html.includes(`for="${id}"`))
  assert.ok(field.includes(`aria-describedby="${id}-hint ${id}-error"`))
  assert.match(field, /aria-invalid="true"/)
  assert.match(html, /role="alert"/)
  assert.match(html, /aria-label="Hiện mật khẩu"/)
})
