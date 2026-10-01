import { writeFile } from 'node:fs/promises'
import { theme } from '../../../src/theme/tokens.ts'

// A generated handoff snapshot, not a second design-token authority.
function flatten(value, path = []) {
  return Object.entries(value).flatMap(([key, item]) =>
    typeof item === 'object' ? flatten(item, [...path, key]) :
      [`  --${[...path, key].join('-')}: ${typeof item === 'number' ? `${item}px` : item};`])
}
await writeFile(new URL('tokens.css', import.meta.url),
  `/* Generated from src/theme/tokens.ts. Run node docs/engineering/m3-ux/generate-tokens.mjs */\n:root {\n${flatten(theme).join('\n')}\n}\n`)
