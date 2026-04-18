# Damacchi UI — Implementation Plan — Phase 1 + 2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffoldare il monorepo `damacchi-ui` (pnpm workspace con `packages/ui`, `apps/playground`, `e2e`) e implementare il Design System base (CSS token, theme/palette/density switchers, pagina `/tokens` del playground che mostra tutto).

**Architecture:** pnpm workspace monorepo leggero. La lib `@damacchi/ui` contiene solo token + utilities + Ladle setup (nessun componente ancora — arrivano in Plan 2+). Il playground Next 15 importa la lib via `workspace:*`, mostra i token in una pagina showcase e permette di switchare tema/palette/density. L'e2e workspace Playwright è presente ma vuoto (0 test).

**Tech Stack:** pnpm 9+, Node 20 LTS, TypeScript 5.5+ strict, React 19, Tailwind v4, tsup, Ladle, Next 15 (App Router), Playwright (Chromium + WebKit), Vitest, ESLint flat, Prettier.

**Rif. spec:** `/Users/simoneschioppo/Documents/damacchi-design/docs/superpowers/specs/2026-04-18-damacchi-ui-design.md`

---

## File Structure di questo Plan

File creati/modificati in questo plan (tutti relativi a `~/Documents/damacchi-ui/`):

**Radice monorepo:**

- `pnpm-workspace.yaml`
- `package.json` (root)
- `tsconfig.base.json`
- `.gitignore`
- `.npmrc`
- `README.md`
- `.prettierrc.json`
- `.eslintrc.json`
- `.github/workflows/ci.yml`

**packages/ui:**

- `packages/ui/package.json`
- `packages/ui/tsconfig.json`
- `packages/ui/tsup.config.ts`
- `packages/ui/tailwind.preset.ts`
- `packages/ui/tailwind.config.ts`
- `packages/ui/vitest.config.ts`
- `packages/ui/.ladle/config.mjs`
- `packages/ui/src/index.ts`
- `packages/ui/src/styles/tokens.css`
- `packages/ui/src/styles/themes.css`
- `packages/ui/src/styles/patterns.css`
- `packages/ui/src/styles/globals.css`
- `packages/ui/src/lib/cn.ts`
- `packages/ui/src/lib/cn.test.ts`
- `packages/ui/src/lib/types.ts`

**apps/playground:**

- `apps/playground/package.json`
- `apps/playground/tsconfig.json`
- `apps/playground/next.config.ts`
- `apps/playground/tailwind.config.ts`
- `apps/playground/postcss.config.js`
- `apps/playground/app/layout.tsx`
- `apps/playground/app/page.tsx`
- `apps/playground/app/tokens/page.tsx`
- `apps/playground/components/TopBar.tsx`
- `apps/playground/components/ThemeSwitcher.tsx`
- `apps/playground/components/PaletteSwitcher.tsx`
- `apps/playground/components/DensitySwitcher.tsx`
- `apps/playground/lib/use-persisted-attr.ts`
- `apps/playground/lib/use-persisted-attr.test.tsx`

**e2e:**

- `e2e/package.json`
- `e2e/tsconfig.json`
- `e2e/playwright.config.ts`
- `e2e/tests/.gitkeep`

**docs:**

- `docs/specs/2026-04-18-damacchi-ui-design.md` (copia dello spec esistente)
- `docs/plans/2026-04-18-damacchi-ui-phase-1-2.md` (copia di questo plan)

---

# PHASE 1 — Scaffold monorepo

## Task 1: Creare repo GitHub privato

**Files:** nessuno (azione remota + clonazione).

- [ ] **Step 1: Creare il repo privato su GitHub**

Run:

```bash
gh repo create simoneschioppo/damacchi-ui \
  --private \
  --description "Damacchi UI — Memphis-inspired React component library" \
  --add-readme=false \
  --license=""
```

Expected: output `✓ Created repository simoneschioppo/damacchi-ui on GitHub`.

- [ ] **Step 2: Clonare localmente**

Run:

```bash
cd ~/Documents
gh repo clone simoneschioppo/damacchi-ui
cd damacchi-ui
```

Expected: cartella `~/Documents/damacchi-ui/` esiste, è un repo git con remote `origin` configurato.

- [ ] **Step 3: Verificare**

Run: `git remote -v && pwd`

Expected: `origin  https://github.com/simoneschioppo/damacchi-ui.git` e working dir `~/Documents/damacchi-ui`.

---

## Task 2: Setup root monorepo — package.json, workspace, gitignore

**Files:**

- Create: `~/Documents/damacchi-ui/pnpm-workspace.yaml`
- Create: `~/Documents/damacchi-ui/package.json`
- Create: `~/Documents/damacchi-ui/.gitignore`
- Create: `~/Documents/damacchi-ui/.npmrc`
- Create: `~/Documents/damacchi-ui/README.md`

- [ ] **Step 1: Scrivere `pnpm-workspace.yaml`**

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'e2e'
```

- [ ] **Step 2: Scrivere `package.json` root**

```json
{
  "name": "damacchi-ui-monorepo",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev:lib": "pnpm --filter @damacchi/ui dev",
    "dev:playground": "pnpm --filter @damacchi/playground dev",
    "dev": "pnpm run --parallel --filter=\"./packages/*\" --filter=\"./apps/*\" dev",
    "build": "pnpm --filter @damacchi/ui build",
    "test": "pnpm --filter @damacchi/ui test",
    "test:e2e": "pnpm --filter @damacchi/e2e test",
    "lint": "pnpm -r lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,mjs,json,md,css}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,mjs,json,md,css}\""
  },
  "devDependencies": {
    "prettier": "^3.3.3",
    "typescript": "^5.6.2"
  }
}
```

- [ ] **Step 3: Scrivere `.gitignore`**

```
# Deps
node_modules/
.pnpm-store/

# Build
dist/
.next/
build/
out/

# Testing
coverage/
playwright-report/
test-results/

# Env
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp

# macOS
.DS_Store

# Logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
```

- [ ] **Step 4: Scrivere `.npmrc`**

```
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
prefer-workspace-packages=true
```

- [ ] **Step 5: Scrivere `README.md`**

```markdown
# Damacchi UI

Memphis-inspired React component library for the Damacchi app.

**Status:** pre-alpha (v0.0.0) — under active development.

## Monorepo structure

- `packages/ui` — the library, published as `@damacchi/ui` to GitHub Packages
- `apps/playground` — Next 15 showcase app (private, not published)
- `e2e` — Playwright end-to-end tests (private)

## Setup

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

- Playground → http://localhost:3000
- Ladle → http://localhost:61000

## Scripts

- `pnpm dev` — both Ladle and Playground in parallel
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright E2E tests (requires playground running)
- `pnpm build` — build the library

## Design Spec

See `docs/specs/2026-04-18-damacchi-ui-design.md`.
```

- [ ] **Step 6: Inizializzare pnpm + install root deps**

Run:

```bash
cd ~/Documents/damacchi-ui
pnpm install
```

Expected: nessun errore, crea `node_modules/` e `pnpm-lock.yaml`.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: scaffold root monorepo workspace"
```

---

## Task 3: Configurare TypeScript base

**Files:**

- Create: `~/Documents/damacchi-ui/tsconfig.base.json`

- [ ] **Step 1: Scrivere `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "verbatimModuleSyntax": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.base.json
git commit -m "chore: add shared TypeScript base config"
```

---

## Task 4: Setup formatting & linting (Prettier + ESLint flat)

**Files:**

- Create: `~/Documents/damacchi-ui/.prettierrc.json`
- Create: `~/Documents/damacchi-ui/.prettierignore`
- Create: `~/Documents/damacchi-ui/eslint.config.mjs`

- [ ] **Step 1: Scrivere `.prettierrc.json`**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

- [ ] **Step 2: Scrivere `.prettierignore`**

```
node_modules/
dist/
.next/
coverage/
pnpm-lock.yaml
*.min.js
*.min.css
```

- [ ] **Step 3: Installare ESLint flat config + deps**

Run:

```bash
pnpm add -D -w eslint@^9 @eslint/js typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

Expected: install without errors, package.json root aggiornato.

- [ ] **Step 4: Scrivere `eslint.config.mjs`**

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
)
```

- [ ] **Step 5: Verificare formatter**

Run: `pnpm format:check`
Expected: warning "No files matched" o checkpoint sui file scritti. Nessun error.

- [ ] **Step 6: Commit**

```bash
git add .prettierrc.json .prettierignore eslint.config.mjs package.json pnpm-lock.yaml
git commit -m "chore: setup prettier + eslint flat config"
```

---

## Task 5: Setup `packages/ui` — package.json + tsconfig + tsup

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/package.json`
- Create: `~/Documents/damacchi-ui/packages/ui/tsconfig.json`
- Create: `~/Documents/damacchi-ui/packages/ui/tsup.config.ts`
- Create: `~/Documents/damacchi-ui/packages/ui/src/index.ts`

- [ ] **Step 1: Creare la cartella e il package.json**

Run:

```bash
mkdir -p ~/Documents/damacchi-ui/packages/ui/src/styles
mkdir -p ~/Documents/damacchi-ui/packages/ui/src/lib
mkdir -p ~/Documents/damacchi-ui/packages/ui/src/components
mkdir -p ~/Documents/damacchi-ui/packages/ui/src/icons
mkdir -p ~/Documents/damacchi-ui/packages/ui/.ladle
```

Scrivere `packages/ui/package.json`:

```json
{
  "name": "@damacchi/ui",
  "version": "0.0.0",
  "private": false,
  "type": "module",
  "description": "Memphis-inspired React component library",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/simoneschioppo/damacchi-ui.git",
    "directory": "packages/ui"
  },
  "files": ["dist", "README.md"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles/tokens.css": "./dist/styles/tokens.css",
    "./styles/themes.css": "./dist/styles/themes.css",
    "./styles/patterns.css": "./dist/styles/patterns.css",
    "./styles/globals.css": "./dist/styles/globals.css",
    "./tailwind.preset": {
      "types": "./dist/tailwind.preset.d.ts",
      "import": "./dist/tailwind.preset.js"
    }
  },
  "scripts": {
    "dev": "ladle serve",
    "build": "tsup && pnpm run build:css && pnpm run build:preset",
    "build:css": "mkdir -p dist/styles && cp src/styles/*.css dist/styles/",
    "build:preset": "tsup tailwind.preset.ts --format esm --dts --out-dir dist",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "tailwindcss": ">=4"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@ladle/react": "^4.1.2",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@types/node": "^20.16.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "tsup": "^8.3.0",
    "typescript": "^5.6.2",
    "vitest": "^2.1.1"
  }
}
```

- [ ] **Step 2: Scrivere `packages/ui/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
    "noEmit": true
  },
  "include": ["src/**/*", "*.config.ts", "*.preset.ts", ".ladle/**/*"]
}
```

- [ ] **Step 3: Scrivere `packages/ui/tsup.config.ts`**

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: false,
  minify: false,
})
```

- [ ] **Step 4: Scrivere placeholder `packages/ui/src/index.ts`**

```ts
export const __version = '0.0.0'
```

- [ ] **Step 5: Installare deps**

Run:

```bash
cd ~/Documents/damacchi-ui
pnpm install
```

Expected: install succeeds. `packages/ui/node_modules/` popolato.

- [ ] **Step 6: Verificare build passa**

Run: `pnpm --filter @damacchi/ui build`
Expected: crea `packages/ui/dist/index.js` e `index.d.ts`. Nessun errore.

- [ ] **Step 7: Commit**

```bash
git add packages/ui/ pnpm-lock.yaml package.json
git commit -m "chore(ui): scaffold packages/ui with tsup build"
```

---

## Task 6: Setup Ladle in `packages/ui`

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/.ladle/config.mjs`
- Create: `~/Documents/damacchi-ui/packages/ui/.ladle/components.tsx`
- Create: `~/Documents/damacchi-ui/packages/ui/src/__placeholder.stories.tsx`

- [ ] **Step 1: Scrivere `.ladle/config.mjs`**

```js
export default {
  stories: 'src/**/*.stories.{js,jsx,ts,tsx}',
  port: 61000,
  defaultStory: 'placeholder--welcome',
  addons: {
    theme: {
      enabled: true,
      defaultState: 'light',
    },
  },
}
```

- [ ] **Step 2: Scrivere `.ladle/components.tsx` (Provider con import dei CSS)**

```tsx
import type { GlobalProvider } from '@ladle/react'
import '../src/styles/tokens.css'
import '../src/styles/themes.css'
import '../src/styles/globals.css'
import '../src/styles/patterns.css'

export const Provider: GlobalProvider = ({ children, globalState }) => {
  return (
    <div data-theme={globalState.theme} style={{ minHeight: '100vh', padding: 24 }}>
      {children}
    </div>
  )
}
```

**NOTE:** i file CSS non esistono ancora — verranno creati in Phase 2. L'import fallirà finché non li scriviamo. Ladle `serve` mostrerà un errore. Questo è atteso ora: nel Task 12+ creeremo i CSS e sparirà.

- [ ] **Step 3: Scrivere placeholder story `src/__placeholder.stories.tsx`**

```tsx
export const Welcome = () => (
  <div style={{ fontFamily: 'system-ui', padding: 24 }}>
    <h1>Damacchi UI — Ladle</h1>
    <p>Placeholder: qui saranno visibili tutte le storie dei componenti.</p>
  </div>
)

Welcome.storyName = 'Welcome'
```

- [ ] **Step 4: Verificare Ladle parte**

Run:

```bash
cd ~/Documents/damacchi-ui
pnpm --filter @damacchi/ui dev
```

Expected: Ladle sale su `http://localhost:61000`, mostra error sul CSS import mancante. È OK — si risolverà al Task 12. Fermare con Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/.ladle packages/ui/src/__placeholder.stories.tsx
git commit -m "chore(ui): scaffold Ladle config + placeholder story"
```

---

## Task 7: Setup Vitest in `packages/ui`

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/vitest.config.ts`
- Create: `~/Documents/damacchi-ui/packages/ui/vitest.setup.ts`

- [ ] **Step 1: Scrivere `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 2: Scrivere `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Installare `@vitejs/plugin-react`**

Run:

```bash
pnpm --filter @damacchi/ui add -D @vitejs/plugin-react@^4.3.0 @vitest/coverage-v8@^2.1.1
```

- [ ] **Step 4: Verificare Vitest gira (0 test)**

Run: `pnpm --filter @damacchi/ui test`
Expected: output `No test files found`. Exit code 0 OK.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/vitest.config.ts packages/ui/vitest.setup.ts packages/ui/package.json pnpm-lock.yaml
git commit -m "chore(ui): setup Vitest with jsdom + coverage"
```

---

## Task 8: Setup `apps/playground` — Next 15 app

**Files:**

- Create: `~/Documents/damacchi-ui/apps/playground/package.json`
- Create: `~/Documents/damacchi-ui/apps/playground/tsconfig.json`
- Create: `~/Documents/damacchi-ui/apps/playground/next.config.ts`
- Create: `~/Documents/damacchi-ui/apps/playground/postcss.config.js`
- Create: `~/Documents/damacchi-ui/apps/playground/app/layout.tsx`
- Create: `~/Documents/damacchi-ui/apps/playground/app/page.tsx`

- [ ] **Step 1: Creare cartelle**

Run:

```bash
mkdir -p ~/Documents/damacchi-ui/apps/playground/app
mkdir -p ~/Documents/damacchi-ui/apps/playground/components
mkdir -p ~/Documents/damacchi-ui/apps/playground/lib
mkdir -p ~/Documents/damacchi-ui/apps/playground/public
```

- [ ] **Step 2: Scrivere `apps/playground/package.json`**

```json
{
  "name": "@damacchi/playground",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@damacchi/ui": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^20.16.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.2"
  }
}
```

- [ ] **Step 3: Scrivere `apps/playground/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Scrivere `apps/playground/next.config.ts`**

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@damacchi/ui'],
}

export default config
```

- [ ] **Step 5: Scrivere `apps/playground/postcss.config.js`**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Scrivere `apps/playground/tailwind.config.ts` (stub, verrà completato in Task 17)**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

- [ ] **Step 7: Scrivere `apps/playground/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Damacchi UI — Playground',
  description: 'Showcase of the Damacchi UI component library',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" data-theme="light" data-palette="plum-gold" data-density="normal">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 8: Scrivere `apps/playground/app/page.tsx`**

```tsx
export default function IndexPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'system-ui' }}>
      <h1>Damacchi UI — Playground</h1>
      <p>Work in progress. Verrà popolato con showcase di token e componenti.</p>
    </main>
  )
}
```

- [ ] **Step 9: Installare**

Run:

```bash
cd ~/Documents/damacchi-ui
pnpm install
```

Expected: `apps/playground/node_modules/` creato; `@damacchi/ui` linkato come workspace.

- [ ] **Step 10: Verificare Next parte**

Run:

```bash
pnpm --filter @damacchi/playground dev
```

Expected: Next su `http://localhost:3000`, pagina "Work in progress" visibile. Ctrl+C.

- [ ] **Step 11: Commit**

```bash
git add apps/playground/ package.json pnpm-lock.yaml
git commit -m "chore(playground): scaffold Next 15 app"
```

---

## Task 9: Setup `e2e` workspace — Playwright

**Files:**

- Create: `~/Documents/damacchi-ui/e2e/package.json`
- Create: `~/Documents/damacchi-ui/e2e/tsconfig.json`
- Create: `~/Documents/damacchi-ui/e2e/playwright.config.ts`
- Create: `~/Documents/damacchi-ui/e2e/tests/.gitkeep`

- [ ] **Step 1: Creare cartelle**

Run:

```bash
mkdir -p ~/Documents/damacchi-ui/e2e/tests/components
mkdir -p ~/Documents/damacchi-ui/e2e/tests/scenarios
touch ~/Documents/damacchi-ui/e2e/tests/.gitkeep
```

- [ ] **Step 2: Scrivere `e2e/package.json`**

```json
{
  "name": "@damacchi/e2e",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "install-browsers": "playwright install chromium webkit"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "@types/node": "^20.16.5",
    "typescript": "^5.6.2"
  }
}
```

- [ ] **Step 3: Scrivere `e2e/tsconfig.json`**

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "types": ["@playwright/test", "node"],
    "noEmit": true
  },
  "include": ["tests/**/*", "*.config.ts"]
}
```

- [ ] **Step 4: Scrivere `e2e/playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'pnpm --filter @damacchi/playground dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 5: Installare + browsers**

Run:

```bash
cd ~/Documents/damacchi-ui
pnpm install
pnpm --filter @damacchi/e2e install-browsers
```

Expected: chromium + webkit scaricati (~200MB).

- [ ] **Step 6: Verificare Playwright gira (0 test)**

Run: `pnpm --filter @damacchi/e2e test`
Expected: output `No tests found`. Exit 0.

- [ ] **Step 7: Commit**

```bash
git add e2e/ package.json pnpm-lock.yaml
git commit -m "chore(e2e): scaffold Playwright workspace"
```

---

## Task 10: Setup GitHub Actions CI di base

**Files:**

- Create: `~/Documents/damacchi-ui/.github/workflows/ci.yml`

- [ ] **Step 1: Creare cartella**

Run: `mkdir -p ~/Documents/damacchi-ui/.github/workflows`

- [ ] **Step 2: Scrivere `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Format check
        run: pnpm format:check

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm --filter @damacchi/ui typecheck && pnpm --filter @damacchi/playground typecheck

      - name: Unit tests
        run: pnpm test

      - name: Build lib
        run: pnpm build

  e2e:
    runs-on: ubuntu-latest
    needs: lint-and-test
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm --filter @damacchi/e2e exec playwright install --with-deps chromium webkit

      - name: Run e2e
        run: pnpm test:e2e

      - name: Upload Playwright artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: e2e/playwright-report/
          retention-days: 7
```

- [ ] **Step 3: Commit + push iniziale**

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow (lint, typecheck, test, build, e2e)"
git push -u origin main
```

Expected: push succeeds, GH Action parte su https://github.com/simoneschioppo/damacchi-ui/actions

---

## Task 11: Copiare spec e plan dentro il repo

**Files:**

- Create: `~/Documents/damacchi-ui/docs/specs/2026-04-18-damacchi-ui-design.md`
- Create: `~/Documents/damacchi-ui/docs/plans/2026-04-18-damacchi-ui-phase-1-2.md`

- [ ] **Step 1: Copiare spec**

Run:

```bash
mkdir -p ~/Documents/damacchi-ui/docs/specs
mkdir -p ~/Documents/damacchi-ui/docs/plans
cp ~/Documents/damacchi-design/docs/superpowers/specs/2026-04-18-damacchi-ui-design.md \
   ~/Documents/damacchi-ui/docs/specs/
cp ~/Documents/damacchi-design/docs/superpowers/plans/2026-04-18-damacchi-ui-phase-1-2.md \
   ~/Documents/damacchi-ui/docs/plans/
```

- [ ] **Step 2: Commit**

```bash
cd ~/Documents/damacchi-ui
git add docs/
git commit -m "docs: add design spec and Phase 1-2 implementation plan"
git push
```

**Phase 1 — DONE** ✓

---

# PHASE 2 — Design System base

## Task 12: Scrivere `tokens.css`

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/src/styles/tokens.css`

- [ ] **Step 1: Scrivere il file**

```css
/* Damacchi UI — Design Tokens
 * CSS variables che definiscono palette, typography, radius, shadow, spacing, motion, z-index.
 * Sorgente unica di verità: override queste per customizzare (vedi themes.css per dark + palette alt).
 */

:root,
:root[data-theme='light'] {
  /* ── Raw palette: Plum ─────────────────────────── */
  --plum-100: #e0c6e2;
  --plum-300: #b17cb5;
  --plum-500: #7a3980;
  --plum-700: #522357;
  --plum-800: #3d1a40;
  --plum-900: #2a0f2d;

  /* ── Raw palette: Gold ─────────────────────────── */
  --gold-100: #f8e5bc;
  --gold-200: #f0d49a;
  --gold-300: #e5bc6d;
  --gold-400: #d5a845;
  --gold-500: #c4942a;

  /* ── Raw palette: Paper (neutri) ──────────────── */
  --paper-50: #ffffff;
  --paper-100: #f6f4f8;
  --paper-200: #ece8ef;
  --paper-300: #d6cfdb;

  /* ── Black & white ─────────────────────────────── */
  --white: #ffffff;
  --black: #000000;

  /* ── Status ────────────────────────────────────── */
  --success: #4f8a3c;
  --danger: #a13a2c;
  --warning: #8a6326;
  --rage: #c94a2f;
  --info: var(--plum-500);

  /* ── Semantic aliases (componenti leggono questi) ─ */
  --bg: var(--paper-50);
  --surface: var(--white);
  --surface-2: var(--paper-100);
  --ink: var(--plum-900);
  --ink-soft: var(--plum-700);
  --ink-muted: var(--plum-300);
  --border: color-mix(in oklab, var(--plum-900) 12%, transparent);
  --border-strong: color-mix(in oklab, var(--plum-900) 22%, transparent);
  --border-memphis: var(--black);
  --accent: var(--gold-500);
  --accent-strong: var(--gold-400);
  --ring: var(--gold-500);

  /* ── Typography: families ──────────────────────── */
  --font-display: 'Audiowide', system-ui, sans-serif;
  --font-body: 'Exo 2', system-ui, sans-serif;
  --font-mono: 'Exo 2', ui-monospace, monospace;

  /* ── Radius ────────────────────────────────────── */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-pill: 999px;
  --radius-full: 50%;

  /* ── Shadow: soft (tier 2) ─────────────────────── */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* ── Shadow: memphis (tier 1 signature) ───────── */
  --shadow-memphis-color: var(--black);
  --shadow-memphis-sm: 2px 2px 0 var(--shadow-memphis-color);
  --shadow-memphis: 4px 4px 0 var(--shadow-memphis-color);
  --shadow-memphis-lg: 6px 6px 0 var(--shadow-memphis-color);
  --shadow-memphis-hover: 5px 5px 0 var(--shadow-memphis-color);
  --shadow-memphis-active: 1px 1px 0 var(--shadow-memphis-color);

  /* ── Spacing (4px grid) ────────────────────────── */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* ── Border width ──────────────────────────────── */
  --border-thin: 1px;
  --border-base: 2px;
  --border-thick: 3px;

  /* ── Motion ────────────────────────────────────── */
  --duration-snap: 80ms;
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --ease-memphis: cubic-bezier(0.4, 1.3, 0.5, 1);
  --ease-out: cubic-bezier(0.2, 0.9, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* ── Z-index ───────────────────────────────────── */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 500;
  --z-modal: 1000;
  --z-toast: 2000;
  --z-tooltip: 3000;

  /* ── Density (hook trasversale) ────────────────── */
  --density-scale-y: 1;
  --density-scale-x: 1;
}

:root[data-density='compact'] {
  --density-scale-y: 0.75;
  --density-scale-x: 0.85;
}

:root[data-density='comfortable'] {
  --density-scale-y: 1.25;
  --density-scale-x: 1.15;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/styles/tokens.css
git commit -m "feat(ui): add design tokens (colors, type, radius, shadow, spacing, motion)"
```

---

## Task 13: Scrivere `themes.css` (dark + palette alt)

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/src/styles/themes.css`

- [ ] **Step 1: Scrivere il file**

```css
/* Damacchi UI — Theme Overrides
 * Dark mode e palette alternative. Si attivano con data-attributes sul <html>.
 *   <html data-theme="dark">
 *   <html data-palette="frost">
 *   <html data-theme="dark" data-palette="circuit">
 */

/* ── Dark theme (riassegna semantici, palette resta) ── */
:root[data-theme='dark'] {
  --bg: var(--plum-900);
  --surface: var(--plum-800);
  --surface-2: var(--plum-700);
  --ink: var(--paper-50);
  --ink-soft: var(--paper-100);
  --ink-muted: var(--plum-300);
  --border: color-mix(in oklab, var(--paper-50) 12%, transparent);
  --border-strong: color-mix(in oklab, var(--paper-50) 22%, transparent);
  --border-memphis: var(--paper-50);
  --shadow-memphis-color: var(--paper-50);
}

/* ── Palette: Frost (blu ghiaccio) ─────────────────── */
:root[data-palette='frost'] {
  --plum-100: #c6e0e2;
  --plum-300: #7cadb5;
  --plum-500: #398080;
  --plum-700: #235757;
  --plum-800: #1a4040;
  --plum-900: #0f2d2d;

  --gold-100: #bcf8e5;
  --gold-200: #9af0d4;
  --gold-300: #6de5bc;
  --gold-400: #45d5a8;
  --gold-500: #2ac494;
}

/* ── Palette: Circuit (neon cyber) ─────────────────── */
:root[data-palette='circuit'] {
  --plum-100: #d8c6e2;
  --plum-300: #8f7cb5;
  --plum-500: #5a39a0;
  --plum-700: #3e2370;
  --plum-800: #2a1a50;
  --plum-900: #160f30;

  --gold-100: #bcd5f8;
  --gold-200: #9abaf0;
  --gold-300: #6d9ae5;
  --gold-400: #457bd5;
  --gold-500: #2a62c4;
}

/* ── Reduced motion ───────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/styles/themes.css
git commit -m "feat(ui): add dark mode + frost + circuit palette overrides"
```

---

## Task 14: Scrivere `patterns.css`

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/src/styles/patterns.css`

- [ ] **Step 1: Scrivere il file**

```css
/* Damacchi UI — Memphis Background Pattern
 * Si attiva con [data-app-pattern="on"] sull'elemento contenitore.
 */

:root {
  --app-pattern-color-1: var(--gold-500);
  --app-pattern-color-2: var(--plum-500);
  --app-pattern-color-3: var(--plum-700);
  --app-pattern-size: 140px;
}

[data-app-pattern='on'] {
  background-image:
    radial-gradient(
      circle at 20% 30%,
      var(--app-pattern-color-1) 0,
      var(--app-pattern-color-1) 4px,
      transparent 4px
    ),
    radial-gradient(
      circle at 80% 60%,
      var(--app-pattern-color-2) 0,
      var(--app-pattern-color-2) 4px,
      transparent 4px
    ),
    radial-gradient(
      circle at 40% 80%,
      var(--app-pattern-color-3) 0,
      var(--app-pattern-color-3) 4px,
      transparent 4px
    );
  background-size:
    var(--app-pattern-size) var(--app-pattern-size),
    calc(var(--app-pattern-size) * 1.3) calc(var(--app-pattern-size) * 1.3),
    calc(var(--app-pattern-size) * 1.6) calc(var(--app-pattern-size) * 1.6);
  background-attachment: fixed;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/styles/patterns.css
git commit -m "feat(ui): add Memphis radial-gradient background pattern"
```

---

## Task 15: Scrivere `globals.css`

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/src/styles/globals.css`

- [ ] **Step 1: Scrivere il file**

```css
/* Damacchi UI — Global Base Styles
 * Reset + base styles + typography utility classes.
 * Importare UNA VOLTA nel layout root del consumer.
 */

/* ── Minimal reset ─────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  font-optical-sizing: auto;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

input,
select,
textarea {
  font-family: inherit;
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ── Typography utilities ──────────────────────── */
.display {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.mono {
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
}

/* ── Scrollbars (Memphis style) ────────────────── */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: var(--radius-pill);
  border: 3px solid var(--bg);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--ink-muted);
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/styles/globals.css
git commit -m "feat(ui): add global base styles + typography utilities"
```

---

## Task 16: Implementare `cn()` utility con TDD

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/src/lib/cn.test.ts`
- Create: `~/Documents/damacchi-ui/packages/ui/src/lib/cn.ts`

- [ ] **Step 1: Scrivere il test che fallisce**

`packages/ui/src/lib/cn.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters falsy values', () => {
    expect(cn('foo', false, null, undefined, '', 'bar')).toBe('foo bar')
  })

  it('handles conditional objects (clsx)', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
  })

  it('handles arrays (clsx)', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('merges conflicting tailwind classes keeping the last (tailwind-merge)', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('merges conflicting color utilities', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('returns empty string when nothing passed', () => {
    expect(cn()).toBe('')
  })
})
```

- [ ] **Step 2: Run test — verificare FAIL**

Run: `pnpm --filter @damacchi/ui test`
Expected: FAIL con errore `Cannot find module './cn'` o simile.

- [ ] **Step 3: Implementare `cn.ts`**

`packages/ui/src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Run test — verificare PASS**

Run: `pnpm --filter @damacchi/ui test`
Expected: tutti e 7 i test passano.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/lib/cn.ts packages/ui/src/lib/cn.test.ts
git commit -m "feat(ui): add cn() utility (clsx + tailwind-merge) with tests"
```

---

## Task 17: Scrivere `tailwind.preset.ts` della lib

**Files:**

- Create: `~/Documents/damacchi-ui/packages/ui/tailwind.preset.ts`

- [ ] **Step 1: Scrivere il preset**

Il preset mappa le CSS variables in token Tailwind. Così il consumer scrive `bg-plum-500` e sotto è `background-color: var(--plum-500)`.

```ts
import type { Config } from 'tailwindcss'

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        plum: {
          100: 'var(--plum-100)',
          300: 'var(--plum-300)',
          500: 'var(--plum-500)',
          700: 'var(--plum-700)',
          800: 'var(--plum-800)',
          900: 'var(--plum-900)',
        },
        gold: {
          100: 'var(--gold-100)',
          200: 'var(--gold-200)',
          300: 'var(--gold-300)',
          400: 'var(--gold-400)',
          500: 'var(--gold-500)',
        },
        paper: {
          50: 'var(--paper-50)',
          100: 'var(--paper-100)',
          200: 'var(--paper-200)',
          300: 'var(--paper-300)',
        },
        // Semantic
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'border-memphis': 'var(--border-memphis)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        ring: 'var(--ring)',
        // Status
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        rage: 'var(--rage)',
        info: 'var(--info)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
        full: 'var(--radius-full)',
      },
      borderWidth: {
        thin: 'var(--border-thin)',
        base: 'var(--border-base)',
        thick: 'var(--border-thick)',
      },
      boxShadow: {
        'm-sm': 'var(--shadow-memphis-sm)',
        memphis: 'var(--shadow-memphis)',
        'm-lg': 'var(--shadow-memphis-lg)',
        'm-hover': 'var(--shadow-memphis-hover)',
        'm-active': 'var(--shadow-memphis-active)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
      },
      transitionDuration: {
        snap: 'var(--duration-snap)',
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        memphis: 'var(--ease-memphis)',
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
}

export default preset
```

- [ ] **Step 2: Build la lib e verificare preset esportato**

Run: `pnpm --filter @damacchi/ui build`
Expected: `packages/ui/dist/tailwind.preset.js` esiste. Nessun errore.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/tailwind.preset.ts packages/ui/dist
git commit -m "feat(ui): add Tailwind preset mapping tokens to Tailwind classes"
```

---

## Task 18: Collegare tokens e preset al Playground

**Files:**

- Modify: `~/Documents/damacchi-ui/apps/playground/app/layout.tsx`
- Modify: `~/Documents/damacchi-ui/apps/playground/tailwind.config.ts`
- Create: `~/Documents/damacchi-ui/apps/playground/app/globals.css`

- [ ] **Step 1: Scrivere `app/globals.css` con import dei CSS della lib + Tailwind v4 entry**

```css
@import '@damacchi/ui/styles/tokens.css';
@import '@damacchi/ui/styles/themes.css';
@import '@damacchi/ui/styles/globals.css';
@import '@damacchi/ui/styles/patterns.css';

@import 'tailwindcss';
```

- [ ] **Step 2: Aggiornare `app/layout.tsx` per importare globals.css**

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Damacchi UI — Playground',
  description: 'Showcase of the Damacchi UI component library',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="it"
      data-theme="light"
      data-palette="plum-gold"
      data-density="normal"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Aggiornare `tailwind.config.ts` per usare il preset**

```ts
import type { Config } from 'tailwindcss'
import damacchi from '@damacchi/ui/tailwind.preset'

const config: Config = {
  presets: [damacchi as Config],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/dist/**/*.js'],
}

export default config
```

- [ ] **Step 4: Verificare dev server**

Run: `pnpm --filter @damacchi/playground dev`
Expected: pagina home renderizza con font Exo 2 applicato (se presente), nessun errore console. Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/app/globals.css apps/playground/app/layout.tsx apps/playground/tailwind.config.ts
git commit -m "feat(playground): wire Damacchi UI tokens + Tailwind preset + Google Fonts"
```

---

## Task 19: Implementare `usePersistedAttr` hook con TDD

Utility hook riutilizzato dai 3 switcher. Legge/scrive `data-*` su `<html>` + persiste in `localStorage`.

**Files:**

- Create: `~/Documents/damacchi-ui/apps/playground/lib/use-persisted-attr.test.tsx`
- Create: `~/Documents/damacchi-ui/apps/playground/lib/use-persisted-attr.ts`

- [ ] **Step 1: Aggiungere vitest al playground**

Per ora il playground non ha vitest. Aggiungere:

Run:

```bash
pnpm --filter @damacchi/playground add -D vitest@^2.1.1 @vitejs/plugin-react@^4.3.0 @testing-library/react@^16.0.1 @testing-library/jest-dom@^6.5.0 jsdom@^25.0.0 @vitest/coverage-v8@^2.1.1
```

Creare `apps/playground/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

Creare `apps/playground/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Aggiornare script in `apps/playground/package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
```

- [ ] **Step 2: Scrivere test — FAIL**

`apps/playground/lib/use-persisted-attr.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePersistedAttr } from './use-persisted-attr'

describe('usePersistedAttr', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('returns the default when localStorage is empty', () => {
    const { result } = renderHook(() => usePersistedAttr('theme', 'data-theme', 'light'))
    expect(result.current[0]).toBe('light')
  })

  it('reads initial value from localStorage if present', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => usePersistedAttr('theme', 'data-theme', 'light'))
    expect(result.current[0]).toBe('dark')
  })

  it('sets data-attribute on html when value changes', () => {
    const { result } = renderHook(() => usePersistedAttr('theme', 'data-theme', 'light'))
    act(() => {
      result.current[1]('dark')
    })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists value to localStorage when changed', () => {
    const { result } = renderHook(() => usePersistedAttr('theme', 'data-theme', 'light'))
    act(() => {
      result.current[1]('dark')
    })
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('sets attribute on mount to synchronize DOM with state', () => {
    localStorage.setItem('theme', 'dark')
    renderHook(() => usePersistedAttr('theme', 'data-theme', 'light'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
```

- [ ] **Step 3: Run test — FAIL**

Run: `pnpm --filter @damacchi/playground test`
Expected: FAIL con `Cannot find module './use-persisted-attr'`.

- [ ] **Step 4: Implementare `use-persisted-attr.ts`**

```ts
'use client'

import { useEffect, useState } from 'react'

export function usePersistedAttr<T extends string>(
  storageKey: string,
  htmlAttr: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValueState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    const stored = localStorage.getItem(storageKey)
    return (stored as T) ?? defaultValue
  })

  useEffect(() => {
    document.documentElement.setAttribute(htmlAttr, value)
  }, [htmlAttr, value])

  const setValue = (next: T) => {
    setValueState(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, next)
    }
  }

  return [value, setValue]
}
```

- [ ] **Step 5: Run test — PASS**

Run: `pnpm --filter @damacchi/playground test`
Expected: tutti i 5 test passano.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/lib apps/playground/vitest.config.ts apps/playground/vitest.setup.ts apps/playground/package.json pnpm-lock.yaml
git commit -m "feat(playground): add usePersistedAttr hook (localStorage + html data-attr)"
```

---

## Task 20: Implementare `ThemeSwitcher`

**Files:**

- Create: `~/Documents/damacchi-ui/apps/playground/components/ThemeSwitcher.tsx`

- [ ] **Step 1: Scrivere componente**

```tsx
'use client'

import { usePersistedAttr } from '@/lib/use-persisted-attr'

type Theme = 'light' | 'dark'

export function ThemeSwitcher() {
  const [theme, setTheme] = usePersistedAttr<Theme>('theme', 'data-theme', 'light')

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span className="eyebrow">Theme</span>
      <div style={{ display: 'inline-flex', border: '2px solid var(--border-memphis)' }}>
        {(['light', 'dark'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: '6px 12px',
              background: theme === t ? 'var(--plum-500)' : 'var(--surface)',
              color: theme === t ? 'var(--paper-50)' : 'var(--ink)',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/playground/components/ThemeSwitcher.tsx
git commit -m "feat(playground): add ThemeSwitcher component"
```

---

## Task 21: Implementare `PaletteSwitcher`

**Files:**

- Create: `~/Documents/damacchi-ui/apps/playground/components/PaletteSwitcher.tsx`

- [ ] **Step 1: Scrivere componente**

```tsx
'use client'

import { usePersistedAttr } from '@/lib/use-persisted-attr'

type Palette = 'plum-gold' | 'frost' | 'circuit'

const LABELS: Record<Palette, string> = {
  'plum-gold': 'Plum+Gold',
  frost: 'Frost',
  circuit: 'Circuit',
}

export function PaletteSwitcher() {
  const [palette, setPalette] = usePersistedAttr<Palette>('palette', 'data-palette', 'plum-gold')

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span className="eyebrow">Palette</span>
      <select
        value={palette}
        onChange={(e) => setPalette(e.target.value as Palette)}
        style={{
          padding: '6px 10px',
          border: '2px solid var(--border-memphis)',
          background: 'var(--surface)',
          color: 'var(--ink)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {(Object.keys(LABELS) as Palette[]).map((p) => (
          <option key={p} value={p}>
            {LABELS[p]}
          </option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/playground/components/PaletteSwitcher.tsx
git commit -m "feat(playground): add PaletteSwitcher component"
```

---

## Task 22: Implementare `DensitySwitcher`

**Files:**

- Create: `~/Documents/damacchi-ui/apps/playground/components/DensitySwitcher.tsx`

- [ ] **Step 1: Scrivere componente**

```tsx
'use client'

import { usePersistedAttr } from '@/lib/use-persisted-attr'

type Density = 'compact' | 'normal' | 'comfortable'

export function DensitySwitcher() {
  const [density, setDensity] = usePersistedAttr<Density>('density', 'data-density', 'normal')

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span className="eyebrow">Density</span>
      <div style={{ display: 'inline-flex', border: '2px solid var(--border-memphis)' }}>
        {(['compact', 'normal', 'comfortable'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            style={{
              padding: '6px 10px',
              background: density === d ? 'var(--gold-500)' : 'var(--surface)',
              color: 'var(--ink)',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              border: 'none',
              borderLeft: d !== 'compact' ? '2px solid var(--border-memphis)' : 'none',
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/playground/components/DensitySwitcher.tsx
git commit -m "feat(playground): add DensitySwitcher component"
```

---

## Task 23: Implementare `TopBar`

**Files:**

- Create: `~/Documents/damacchi-ui/apps/playground/components/TopBar.tsx`

- [ ] **Step 1: Scrivere componente**

```tsx
import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'
import { PaletteSwitcher } from './PaletteSwitcher'
import { DensitySwitcher } from './DensitySwitcher'

export function TopBar() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '2px solid var(--border-memphis)',
        background: 'var(--surface)',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          letterSpacing: '0.08em',
          color: 'var(--ink)',
        }}
      >
        DAMACCHI · UI
      </Link>

      <nav style={{ display: 'flex', gap: 16 }}>
        <Link href="/tokens" style={{ fontSize: 14, fontWeight: 600 }}>
          Tokens
        </Link>
      </nav>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <ThemeSwitcher />
        <PaletteSwitcher />
        <DensitySwitcher />
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Aggiungere `TopBar` al layout**

Modify `apps/playground/app/layout.tsx` — aggiungere import + render:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { TopBar } from '@/components/TopBar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Damacchi UI — Playground',
  description: 'Showcase of the Damacchi UI component library',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="it"
      data-theme="light"
      data-palette="plum-gold"
      data-density="normal"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verificare**

Run: `pnpm --filter @damacchi/playground dev`
Expected:

- Top bar visibile con DAMACCHI·UI + link Tokens + 3 switcher
- Click Theme → html ottiene `data-theme="dark"`, colori cambiano (ma la pagina body è ancora mostly vuota)
- Refresh browser: stato persiste.

Verificare sia in Chrome dev tools che `<html>` ha i data-attributes giusti.

Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/components/TopBar.tsx apps/playground/app/layout.tsx
git commit -m "feat(playground): wire TopBar with Theme/Palette/Density switchers"
```

---

## Task 24: Implementare pagina `/tokens` del playground

**Files:**

- Create: `~/Documents/damacchi-ui/apps/playground/app/tokens/page.tsx`

Pagina che mostra tutte le scale di token (colori, typography, radius, shadow, spacing) in modo visivo. È la "DS page" moderna, aggiornata in tempo reale dai switcher nella top bar.

- [ ] **Step 1: Scrivere la pagina**

```tsx
import type { ReactNode } from 'react'

const PAGE_STYLE = {
  padding: '32px 48px 64px',
  maxWidth: 1280,
  margin: '0 auto',
}

const PLUM_STOPS = [100, 300, 500, 700, 800, 900] as const
const GOLD_STOPS = [100, 200, 300, 400, 500] as const
const PAPER_STOPS = [50, 100, 200, 300] as const

const SEMANTIC = [
  ['--bg', 'Background'],
  ['--surface', 'Surface'],
  ['--surface-2', 'Surface 2'],
  ['--ink', 'Ink'],
  ['--ink-soft', 'Ink Soft'],
  ['--ink-muted', 'Ink Muted'],
  ['--border-memphis', 'Border Memphis'],
  ['--accent', 'Accent'],
] as const

const TYPE_SCALE = [
  { label: 'text-7xl', size: 80 },
  { label: 'text-6xl', size: 64 },
  { label: 'text-5xl', size: 48 },
  { label: 'text-4xl', size: 40 },
  { label: 'text-3xl', size: 32 },
  { label: 'text-2xl', size: 24 },
  { label: 'text-xl', size: 20 },
  { label: 'text-lg', size: 18 },
  { label: 'text-base', size: 16 },
  { label: 'text-sm', size: 14 },
  { label: 'text-xs', size: 12 },
] as const

const RADIUS_SCALE = [
  ['--radius-none', 'none'],
  ['--radius-sm', 'sm'],
  ['--radius-md', 'md'],
  ['--radius-lg', 'lg'],
  ['--radius-pill', 'pill'],
] as const

const SHADOW_SCALE = [
  ['--shadow-memphis-sm', 'memphis-sm'],
  ['--shadow-memphis', 'memphis'],
  ['--shadow-memphis-lg', 'memphis-lg'],
  ['--shadow-sm', 'shadow-sm'],
  ['--shadow-md', 'shadow-md'],
  ['--shadow-lg', 'shadow-lg'],
] as const

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 className="display" style={{ fontSize: 32, margin: '0 0 16px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Swatch({ varName, label }: { varName: string; label: string }) {
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        padding: 12,
        minWidth: 140,
        background: 'var(--surface)',
      }}
    >
      <div
        style={{
          height: 48,
          background: `var(${varName})`,
          marginBottom: 8,
          border: '1px solid var(--border)',
        }}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-muted)' }}>
        {varName}
      </div>
    </div>
  )
}

export default function TokensPage() {
  return (
    <main style={PAGE_STYLE}>
      <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
        Design Tokens
      </h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
        Tutti i token rispondono ai switcher theme/palette/density in alto.
      </p>

      <Section title="Plum scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {PLUM_STOPS.map((k) => (
            <Swatch key={k} varName={`--plum-${k}`} label={`plum-${k}`} />
          ))}
        </div>
      </Section>

      <Section title="Gold scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {GOLD_STOPS.map((k) => (
            <Swatch key={k} varName={`--gold-${k}`} label={`gold-${k}`} />
          ))}
        </div>
      </Section>

      <Section title="Paper scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {PAPER_STOPS.map((k) => (
            <Swatch key={k} varName={`--paper-${k}`} label={`paper-${k}`} />
          ))}
        </div>
      </Section>

      <Section title="Semantic tokens">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {SEMANTIC.map(([v, l]) => (
            <Swatch key={v} varName={v} label={l} />
          ))}
        </div>
      </Section>

      <Section title="Typography scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TYPE_SCALE.map((t) => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
              <span
                className="mono"
                style={{ fontSize: 11, color: 'var(--ink-muted)', minWidth: 80 }}
              >
                {t.label} · {t.size}
              </span>
              <span style={{ fontSize: t.size, fontWeight: 500 }}>Damacchi · regina e cavallo</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Display font — Audiowide">
        <div className="display" style={{ fontSize: 72 }}>
          Damacchi
        </div>
      </Section>

      <Section title="Eyebrow utility">
        <div className="eyebrow">Finalmente una dama con le palle</div>
      </Section>

      <Section title="Radius scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {RADIUS_SCALE.map(([v, l]) => (
            <div
              key={v}
              style={{
                width: 120,
                height: 80,
                background: 'var(--plum-500)',
                borderRadius: `var(${v})`,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--paper-50)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow scale (Memphis + soft)">
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: 24 }}>
          {SHADOW_SCALE.map(([v, l]) => (
            <div
              key={v}
              style={{
                width: 120,
                height: 80,
                background: 'var(--surface)',
                border: '2px solid var(--border-memphis)',
                boxShadow: `var(${v})`,
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing (4px grid)">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map((n) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: `var(--space-${n})`,
                  height: `var(--space-${n})`,
                  background: 'var(--gold-500)',
                  border: '1px solid var(--border-memphis)',
                }}
              />
              <div className="mono" style={{ fontSize: 10, marginTop: 4 }}>
                {n}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
```

- [ ] **Step 2: Verificare in browser**

Run: `pnpm --filter @damacchi/playground dev`
Browse: `http://localhost:3000/tokens`

Expected:

- Pagina showcase renderizza con tutte le scale visibili
- Cambio theme → colori semantici cambiano (bg, surface, ink)
- Cambio palette frost → scale plum diventano blu ghiaccio, gold diventa verde
- Cambio density → non visibile in questa pagina (servirà per componenti con padding)

Ctrl+C.

- [ ] **Step 3: Aggiornare home page per linkare /tokens**

Modify `apps/playground/app/page.tsx`:

```tsx
import Link from 'next/link'

export default function IndexPage() {
  return (
    <main style={{ padding: 48, maxWidth: 800, margin: '0 auto' }}>
      <h1 className="display" style={{ fontSize: 56, marginBottom: 16 }}>
        Damacchi UI
      </h1>
      <p style={{ fontSize: 18, color: 'var(--ink-muted)', marginBottom: 32 }}>
        Showcase di componenti in stile Memphis. Usa la top bar per cambiare tema, palette e density
        in live preview.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        <li>
          <Link
            href="/tokens"
            style={{
              display: 'block',
              padding: 16,
              border: '2px solid var(--border-memphis)',
              boxShadow: 'var(--shadow-memphis)',
              background: 'var(--surface)',
              fontWeight: 600,
            }}
          >
            → Design Tokens
          </Link>
        </li>
      </ul>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/playground/app/tokens apps/playground/app/page.tsx
git commit -m "feat(playground): add /tokens showcase page"
```

---

## Task 25: Aggiornare `packages/ui/src/index.ts` per esportare `cn`

**Files:**

- Modify: `~/Documents/damacchi-ui/packages/ui/src/index.ts`

- [ ] **Step 1: Aggiornare il barrel**

```ts
export { cn } from './lib/cn'
export const __version = '0.0.0'
```

- [ ] **Step 2: Rebuild lib**

Run: `pnpm --filter @damacchi/ui build`
Expected: `dist/index.js` aggiornato, esporta `cn`.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/index.ts packages/ui/dist
git commit -m "feat(ui): export cn() from root barrel"
```

---

## Task 26: Push finale Phase 1+2 + verifica CI

- [ ] **Step 1: Verificare stato repo**

Run:

```bash
cd ~/Documents/damacchi-ui
git status
git log --oneline | head -30
```

Expected: working tree clean, ~25 commit sul branch main.

- [ ] **Step 2: Push**

Run: `git push`

Expected: push succeeds.

- [ ] **Step 3: Verificare CI GitHub Actions**

Browse: https://github.com/simoneschioppo/damacchi-ui/actions

Expected: ultimo workflow **verde** su tutti gli step (lint, format-check, typecheck, unit test, build, e2e 0 test OK).

Se fallisce → investigare il failing step localmente, fixare, commit, push, re-run.

---

# Self-review check

Checklist da far girare a fine esecuzione del plan:

- [ ] `pnpm install` funziona da clean clone
- [ ] `pnpm dev` avvia Ladle (61000) + Playground (3000) in parallelo
- [ ] `pnpm test` gira (7+ test passano — cn + usePersistedAttr)
- [ ] `pnpm test:e2e` gira (0 test OK)
- [ ] `pnpm build` produce `packages/ui/dist/` completo: `index.js`, `index.d.ts`, `styles/*.css`, `tailwind.preset.js`
- [ ] `pnpm lint` passa
- [ ] `pnpm format:check` passa
- [ ] `pnpm typecheck` passa su ui + playground
- [ ] Playground `/tokens`: tutte le scale visibili
- [ ] Switcher theme/palette/density funzionano e persistono in localStorage
- [ ] GitHub Actions CI verde

---

# Prossimi plan

Al completamento di questo plan:

- **Plan 2** — Phase 3 Foundations (Icon set 30 icone, Box, Container, AspectRatio, ScrollArea, Separator, Ornament, FormField + pagine playground)
- **Plan 3** — Phase 4 Tier 1 core (Button, IconButton, Card 5 var, Dialog, AlertDialog, Drawer, Banner)
- **Plan 4+** — form inputs, feedback, navigation, data display, layout, e2e suite, release v0.1.0

Ogni plan sarà scritto a completion del precedente per restare aderenti allo stato reale del codice.
