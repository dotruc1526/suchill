import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { theme } from '../../src/theme/tokens.ts'

test('PWA metadata is Vietnamese, same-origin and coherent with brand tokens', () => {
 const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'))
 assert.equal(manifest.name, 'Sử Chill'); assert.equal(manifest.lang, 'vi')
 assert.equal(manifest.id, '/'); assert.equal(manifest.scope, '/'); assert.equal(manifest.start_url, '/')
 assert.equal(manifest.display, 'standalone'); assert.equal(manifest.theme_color, theme.colors.primary)
 assert.equal(manifest.background_color, theme.colors.appBg)
 const site = JSON.parse(readFileSync('.figma/make/site.json', 'utf8'))
 assert.equal(site.title, 'Sử Chill'); assert.equal(site.language, 'vi')
 for (const size of [192,512]) assert.ok(manifest.icons.some((icon: { sizes: string; purpose: string }) => icon.sizes === size+'x'+size && icon.purpose === 'any'))
 assert.ok(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'maskable'))
 for (const icon of manifest.icons) {
  assert.match(icon.src, /^\/icons\/[a-z0-9-]+\.png$/)
  const png = readFileSync('public' + icon.src)
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a')
  const width=png.readUInt32BE(16), height=png.readUInt32BE(20)
  assert.equal(icon.sizes,width+'x'+height); assert.equal(width,height)
 }
 const apple = readFileSync('public/icons/apple-touch-icon.png')
 assert.equal(apple.readUInt32BE(16),180); assert.equal(apple.readUInt32BE(20),180)
})
