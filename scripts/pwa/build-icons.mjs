import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { theme } from '../../src/theme/tokens.ts'

// Original vector artwork, generated locally. No stock/source-media asset is used.
// A caller may supply the installed workspace runtime's Sharp module path; no global install is required.
const require = createRequire(import.meta.url)
const sharp = require(process.env.PWA_SHARP_MODULE || 'sharp')
const icons = fileURLToPath(new URL('../../public/icons/', import.meta.url))
await mkdir(icons, { recursive: true })
const { primary, appBg, primaryText } = theme.colors
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="' + appBg + '"/><circle cx="256" cy="256" r="198" fill="' + primary + '"/><circle cx="256" cy="256" r="177" fill="none" stroke="' + primaryText + '" stroke-width="7"/><g fill="none" stroke="' + primaryText + '" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path d="M151 211q55-25 105 0q50-25 105 0v117q-55-25-105 0q-50-25-105 0zM256 211v117M176 238q25-8 51 0M176 264q25-8 51 0M285 238q25-8 51 0M285 264q25-8 51 0"/><path d="M197 177h118M227 151h58M211 365h90"/></g></svg>'
await writeFile(icons + '/icon.svg', svg)
for (const [name, size] of [['icon-192', 192], ['icon-512', 512], ['maskable-512', 512], ['apple-touch-icon', 180]]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(icons + '/' + name + '.png')
}
console.log('Owned vector and install icons generated from canonical brand tokens.')
