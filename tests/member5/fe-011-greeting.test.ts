import assert from 'node:assert/strict'
import test from 'node:test'
import { formatHomeGreeting, loadHomeGreeting } from '../../src/features/home/greetingModel.ts'
import { failure, success, type UserService } from '../../src/services/next/contracts.ts'

test('FE-011 formats the domain display name and trims surrounding whitespace', () => {
  assert.equal(formatHomeGreeting({ id: 'u1', displayName: '  Nguyễn Thị Dương Anh  ', locale: 'vi-VN' }), 'XIN CHÀO, Nguyễn Thị Dương Anh')
  assert.equal(formatHomeGreeting({ id: 'u1', displayName: '   ', locale: 'vi-VN' }), 'XIN CHÀO')
  assert.equal(formatHomeGreeting(null), 'XIN CHÀO')
})

test('FE-011 reads the user service and falls back without blocking Home', async () => {
  const users = (getCurrentProfile: UserService['getCurrentProfile']): UserService => ({ getCurrentProfile, getAccountSummary: async () => success(null) })
  assert.equal(await loadHomeGreeting(users(async () => success({ id: 'u1', displayName: 'Dương', locale: 'vi-VN' }))), 'XIN CHÀO, Dương')
  assert.equal(await loadHomeGreeting(users(async () => success(null))), 'XIN CHÀO')
  assert.equal(await loadHomeGreeting(users(async () => failure('unauthorized'))), 'XIN CHÀO')
  assert.equal(await loadHomeGreeting(users(async () => { throw new Error('offline') })), 'XIN CHÀO')
})
