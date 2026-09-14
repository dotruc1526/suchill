# figma-make-app — Sử Chill Project Guidelines

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

## Canonical Project Architecture

This project follows a **Feature-Based & Layered Architecture**. Every new feature, screen, component, or data service MUST strictly adhere to this layout:

- `src/theme/tokens.ts` - Centralized Design Tokens (Color Palette, Typography, Feedback Colors). MUST be referenced for all styling.
- `src/components/ui/` - Atomic UI Primitives (`Button`, `Card`, `ChoiceOption`). MUST be reused across features.
- `src/components/layout/` - Global layout elements (`TopBar`, `BottomNav`).
- `src/features/` - Feature modules (`home`, `learning`, `quiz`, `practice`, `ai-assistant`, `profile`, `visual-novel`).
  - Each feature MUST contain its own screen components and sub-components.
- `src/services/` - Data Service Abstraction Layer (`chapterService.ts`, `visualNovelService.ts`, `userService.ts`). ALL data fetching & DB integration MUST go through services.
- `src/types/index.ts` - Centralized TypeScript type definitions.
- `src/data/index.ts` - Centralized static data repository (Chapters, Lessons, Quiz, Achievements).
- `src/App.tsx` - Master Router / App Shell (Must remain lightweight < 150 lines).

## Design System & Styling Rules (STRICT ENFORCEMENT)

1. **Color Palette Compliance**:
   - Page Outer Background: `#C8A882`
   - App Parchment Background: `#F5E6D0` (`theme.colors.appBg`)
   - Stamp Burgundy Accent: `#8B1A1A` (`theme.colors.primary`)
   - Deep Ink Brown Text: `#3D1A00` (`theme.colors.textPrimary`)
   - Cream Card Background: `#FBF4E8` (`theme.colors.cardBg`)
   - Correct Option Highlight: Green `#E8F5E2` / Border `#3A5A2A` / Text `#3A5A2A`
   - Incorrect Option Highlight: Red `#FDE8E4` / Border `#C4341A` / Text `#C4341A`
   - **NEVER** invent arbitrary colors or dark blue/purple backgrounds that violate the vintage parchment theme.

2. **Feedback State Conventions**:
   - Any quiz or visual novel option selection MUST highlight **GREEN** when correct/selected and **RED** when incorrect, using `ChoiceOption` or standard feedback styles.

3. **Data & Database Abstraction**:
   - Never write raw database or HTTP fetch calls directly inside React UI components. Always wrap them inside `src/services/`.

4. **Historical Accuracy & Media**:
   - Use authentic historical photos (e.g., Wikimedia Commons 1954 photos for Geneva Accords) or vintage parchment SVG illustrations.
   - **NEVER** use modern, unrelated stock photos or inaccurate historical figures.

## Code Quality Rules

- Use double quotes for strings containing apostrophes (`"We're here to help"`).
- Keep component contracts clean and modular. Export components from `src/components/` or `src/features/`.
- Keep `src/App.tsx` focused on application composition and screen routing.
- Keep production source files under 200 lines where practical.
