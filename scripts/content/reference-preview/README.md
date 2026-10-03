# Local reference preview

From repository root:

```powershell
node scripts/content/reference-preview/serve.mjs --package docs/content/preview1954-v1 --port 8444
```

Open `http://127.0.0.1:8444/`. Stop with Ctrl+C. The server binds only to loopback, checks four package files against their manifest hashes, supports video byte ranges, and serves no arbitrary package paths. Vite configuration, environment files, public directory, PWA registration and hosted application are not loaded.

This uses the actual `VideoLessonPlayer` through the existing service contract. Media remains `draft`/`INTERNAL_REFERENCE_ONLY`. Playback stores only a preview key scoped to the unchanged MP4 hash on the preview origin. Account progress, XP, completion and backend services are unavailable. Captions, transcript, poster and error fallback use the supplied package. Burned-in captions remain unchanged; native additional captions can be turned off using the player controls.

Focused checks:

```powershell
node --test scripts/content/reference-preview/preview.test.mjs
node node_modules/typescript/bin/tsc --noEmit --strict --jsx react-jsx --moduleResolution bundler --module ESNext --target ES2022 --lib ES2022,DOM --skipLibCheck --allowImportingTsExtensions --types node scripts/content/reference-preview/entry.tsx scripts/content/reference-preview/services.ts
```

The browser test uses an owned temporary Chrome profile and ephemeral server, then closes both. It checks actual media dimensions/duration, 28 native caption cues, play/pause, local resume after reload, unrelated storage preservation, transcript fallback/retry and three responsive viewports. This is technical preview evidence; historical/rights/device/publication acceptance remains separate.
