# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.

## Function organization

- Keep `src/App.tsx` focused on application composition and screen routing.
- Put reusable functions, shared UI components, data transformations, and business logic in dedicated files under `src/` (for example `src/components/`, `src/features/`, or `src/utils/`).
- Create a separate file when a function or component is reused, has meaningful standalone behavior, or makes the current file difficult to scan.
- Small event handlers that are used only once within a component may remain colocated with that component.
- Name files after their primary exported function or component so ownership and maintenance are clear.

## Application architecture

Organize new React/TypeScript code under `src/` using the following responsibilities. Adapt the JavaScript names in external examples to `.ts` or `.tsx` files.

- `src/config/`: non-secret app configuration such as theme tokens, routes, feature flags, and public constants. Do not put API keys or secrets here; use `.env` files instead.
- `src/models/`: TypeScript types and data contracts for users, learning-roadmap nodes, scenes, quizzes, and API payloads.
- `src/services/`: boundary code for APIs, authentication, persistence, and data loading. Services return typed models and must not render UI.
- `src/controllers/` or `src/state/`: feature state, game/learning flow, score calculation, unlock rules, and orchestration between models and services. Controllers must not contain JSX.
- `src/components/`: small reusable presentational UI pieces such as buttons, dialogs, badges, dialogue boxes, quiz cards, and progress indicators.
- `src/screens/`: routed or full-screen UI flows. Screens compose components and delegate business logic to controllers or state modules.
- `src/features/`: optional feature-local folders when a screen has multiple related components, controller/state, and types.
- `src/assets/images/`, `src/assets/audio/`, and `src/assets/fonts/`: project-owned static assets. Keep existing imports working when migrating assets.

## Layer boundaries

- Screens and components render UI only; do not place scoring, unlock, persistence, API, or data-transformation logic in JSX files.
- Controllers/state modules own learning and game-flow decisions, then call services to load or save data.
- Services own external communication and persistence only; they do not decide UI state or mutate UI components.
- Models define data shape only; do not put rendering, network requests, or feature state in model files.
- Pass typed data down to UI through props, and expose user actions as explicit callbacks.

## File size and extraction rules

- Keep production source files under 200 lines where practical. Split a file before it becomes difficult to scan; exceptions require a clear, local reason.
- Extract a standalone component when a screen contains a reusable card, control, dialog, or visual section.
- Extract a controller/state module when a screen coordinates multiple steps, questions, scores, choices, or persistence.
- Keep one primary responsibility per file. Avoid “utils” files that mix unrelated feature logic.
- Do not create empty placeholder folders or stub files. Every new file must have a real responsibility and be connected to the application.
