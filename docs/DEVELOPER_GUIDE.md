# Developer Guide — AI Trust Learning Path

> Technical reference for engineers who want to extend, customise, or deploy the application.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [Core Data Model](#3-core-data-model)
4. [Services Layer](#4-services-layer)
5. [State Management](#5-state-management)
6. [Custom Hooks](#6-custom-hooks)
7. [Component Hierarchy](#7-component-hierarchy)
8. [Security Utilities](#8-security-utilities)
9. [Adding Content — Steps, Phases, Edges](#9-adding-content)
10. [Customising the Graph Layout](#10-customising-the-graph-layout)
11. [Swapping Storage Backends](#11-swapping-storage-backends)
12. [Testing Strategy](#12-testing-strategy)
13. [CI/CD and Deployment](#13-cicd-and-deployment)
14. [Deploying to Cloudflare Pages (Recommended)](#14-cloudflare-pages)
15. [Docker / Self-Hosted](#15-docker--self-hosted)

---

## 1. Architecture Overview

This is a **client-side-only React SPA** with zero backend. All data lives in the user's `localStorage`. The architecture follows strict SOLID principles — every module has a single job and communicates via interfaces, not concrete types.

```
main.tsx  (Composition Root)
  │
  ├─ LocalStorageService  ──→  IStorageService
  ├─ createLearningStore(storage)  ──→  Zustand store
  └─ <App store={store}>
       │
       ├─ ForceLayoutEngine  ──→  ILayoutEngine  (via LayoutEngineContext)
       ├─ <TopBar>
       ├─ <PathView>   or   <GraphView>
       └─ <PhaseLegend>
```

**Key design rule:** `main.tsx` is the **only** file that imports concrete classes. Every other file imports interfaces (`IStorageService`, `ILayoutEngine`) or receives dependencies via props or React context.

---

## 2. Project Structure

```
src/
├── main.tsx                    # Composition root — wire deps, mount app
├── App.tsx                     # View router (path | graph)
│
├── constants/
│   ├── phases.ts               # ★ ALL 50 STEPS defined here ★
│   ├── edges.ts                # Prerequisite edges [fromId, toId]
│   ├── colors.ts               # Design tokens & tag colours
│   └── index.ts
│
├── types/
│   ├── learning.ts             # Step, Phase, FilterMode, ViewMode …
│   ├── graph.ts                # NodePosition, GraphTransform, EdgeTuple
│   └── storage.ts              # ProgressMap, NotesMap, LinksMap
│
├── services/
│   ├── storage/
│   │   ├── IStorageService.ts          # Interface (ISP-split)
│   │   ├── LocalStorageService.ts      # Production implementation
│   │   └── InMemoryStorageService.ts   # Test double
│   └── graph/
│       ├── ILayoutEngine.ts            # Interface
│       └── ForceLayoutEngine.ts        # Seeded mulberry32 force layout
│
├── store/
│   └── useLearningStore.ts     # Zustand factory — all CRUD + persist
│
├── hooks/
│   ├── useGraphLayout.ts       # Compute + memoize node positions
│   ├── useGraphInteraction.ts  # Pan / zoom / drag state
│   ├── useGraphFilter.ts       # Graph node visibility
│   └── useStepFilter.ts        # Path view phase + step filtering
│
├── utils/
│   └── sanitiseUrl.ts          # URL XSS protection — must use on all hrefs
│
├── components/
│   ├── common/
│   │   ├── Tag/                # Tag badge
│   │   ├── MiniBar/            # Progress bar
│   │   ├── NoteArea/           # Note textarea
│   │   └── LinkInput/          # URL input with sanitisation
│   ├── layout/
│   │   ├── TopBar/             # Header, view toggle, stats
│   │   └── PhaseLegend/        # Bottom phase counts
│   ├── path/
│   │   ├── PathView/           # Path view orchestrator
│   │   ├── PathFilters/        # Filter tabs
│   │   ├── PhaseMiniMap/       # Phase progress strips
│   │   ├── PhaseBlock/         # Phase header + step list
│   │   └── StepCard/           # Individual step card
│   └── graph/
│       ├── GraphView/          # Graph view orchestrator
│       ├── PhaseBands/         # Background column bands
│       ├── EdgeLayer/          # SVG dependency edges
│       ├── NodeLayer/          # SVG node glyphs
│       ├── NodeDetailPanel/    # Slide-in node detail
│       └── GraphFilters/       # Graph filter buttons
│
├── test/
│   ├── setup.ts                # Vitest + jest-dom setup
│   ├── mocks/                  # Storage factory for tests
│   └── e2e/                    # Playwright E2E specs
│
└── styles/
    └── tokens.css              # Global CSS variables
```

---

## 3. Core Data Model

### Defining a Step

All steps live in `src/constants/phases.ts` inside the `PHASES` array:

```typescript
// src/constants/phases.ts
{
  id: 51,                           // Unique numeric ID (1–50 used; extend from 51)
  title: 'Your New Step Title',
  short: 'ShortName',               // ≤12 chars, shown in graph glyph tooltip
  tag: 'ML',                        // see TAG_COLORS in colors.ts
  desc: 'One-sentence description visible in the expanded card.',
  note: 'Optional curator note shown in a highlighted box.',
  origin: 'added',                  // 'original' | 'added' | 'moved-earlier'
  phaseId: 'foundation',            // Must match an existing phase id
  phaseColor: PHASE_COLORS.foundation,  // Import from colors.ts
}
```

**Valid tags** (defined in `src/constants/colors.ts` → `TAG_COLORS`):

| Tag string | Colour | Meaning |
|------------|--------|---------|
| `Python` | sky blue | Python programming |
| `Math` | purple | Mathematics |
| `ML` | green | Machine Learning |
| `DL` | indigo | Deep Learning |
| `NLP` | teal | Language models |
| `LLM ★` | orange | LLMs (trust-critical) |
| `Trust ★` | orange-red | AI safety/trust (trust-critical) |
| `Policy ★` | red | Regulation/policy |
| `MLOps` | slate | ML engineering |
| `Research` | violet | Research topics |

Tags containing `★` are highlighted with a star badge and included in the "Trust" filter.

### Adding a new tag

1. Add it to `TAG_COLORS` in `src/constants/colors.ts`
2. Use the exact string in your step's `tag` field

### Defining prerequisite edges

```typescript
// src/constants/edges.ts
export const EDGES = [
  // [prerequisiteId, dependentId]
  [1, 2],   // "Complete step 1 before step 2"
  [51, 52], // Add your new edges here
] as const;
```

---

## 4. Services Layer

### Storage Service

The storage interface (`IStorageService`) has three composable parts:

```typescript
interface IReadableStorage  { get(key: string): string | null }
interface IWritableStorage  { set(key: string, value: string): void }
interface IDeletableStorage { delete(key: string): void }
type IStorageService = IReadableStorage & IWritableStorage & IDeletableStorage
```

**Production** uses `LocalStorageService`. Tests use `InMemoryStorageService`.

To plug in a different backend (e.g. IndexedDB, Supabase):

```typescript
// src/services/storage/IndexedDBService.ts
export class IndexedDBService implements IStorageService {
  get(key: string): string | null { /* … */ }
  set(key: string, value: string): void { /* … */ }
  delete(key: string): void { /* … */ }
}

// src/main.tsx — change only this one line:
const storage = new IndexedDBService();
```

**Zero other files change.**

### Graph Layout Engine

```typescript
interface ILayoutEngine {
  compute(seed?: number): PositionMap;  // PositionMap = Record<stepId, { x, y, vx, vy }>
}
```

The `ForceLayoutEngine` runs a mulberry32-seeded iterative force simulation. The virtual canvas is 1800×1200 pixels. Pan/zoom maps this to the actual viewport.

---

## 5. State Management

The Zustand store is created by a **factory function** (not a global singleton):

```typescript
// src/store/useLearningStore.ts
export function createLearningStore(storage: IStorageService): UseBoundStore<StoreApi<LearningStore>>
```

**Store shape:**

```typescript
interface LearningStore {
  loaded: boolean               // true after hydrate() completes
  progress: ProgressMap         // { [stepId]: boolean }
  notes: NotesMap               // { [stepId]: string }
  links: LinksMap               // { [stepId]: string[] }

  toggleDone(id: StepId): void
  saveNote(id: StepId, text: string): void
  addLink(id: StepId, url: string): void      // deduplicates, trims whitespace
  removeLink(id: StepId, url: string): void
  hydrate(storage: IStorageService): Promise<void>  // called once on mount
}
```

**localStorage key:** `ai-trust-unified-v1` (changing this resets all user data)

**Persistence:** every action automatically serialises `{ progress, notes, links }` to localStorage via `JSON.stringify`.

---

## 6. Custom Hooks

| Hook | Returns | When to use |
|------|---------|-------------|
| `useGraphLayout()` | `{ positions, computePositions }` | Trigger layout computation, read node positions |
| `useGraphInteraction(initialTransform?)` | `{ transform, dragging, handleMouseDown, … }` | Wire pan/zoom to SVG `<g transform>` |
| `useGraphFilter(mode, progress)` | `Set<number>` of visible node IDs | Dim non-matching nodes |
| `useStepFilter(mode, activePhase, progress)` | `Phase[]` | Filter the step list in PathView |

**Layout engine** is injected via `LayoutEngineContext`:
```typescript
// App.tsx (already done)
<LayoutEngineContext.Provider value={new ForceLayoutEngine()}>
  ...
</LayoutEngineContext.Provider>
```

To swap layout engines in a test:
```typescript
render(
  <LayoutEngineContext.Provider value={myMockEngine}>
    <GraphView ... />
  </LayoutEngineContext.Provider>
)
```

---

## 7. Component Hierarchy

```
App
├── TopBar          [view, onViewChange, progress]
├── PathView        [progress, notes, links, callbacks]
│   ├── PathFilters [filterMode, activePhase, onFilterChange, onPhaseChange]
│   ├── PhaseMiniMap[progress, activePhase, onPhaseClick]
│   └── PhaseBlock  [phase, enrichedSteps, …] (one per visible phase)
│       └── StepCard[step, done, note, links, expanded, callbacks]
│           ├── Tag
│           ├── NoteArea
│           └── LinkInput
├── GraphView       [progress, notes, links, focusNodeId, callbacks]
│   ├── PhaseBands  (SVG, no props)
│   ├── EdgeLayer   [edges, positions, visibleIds, progress, selectedNode]
│   ├── NodeLayer   [nodes, positions, …]
│   │   └── NodeGlyph [node, position, done, isSelected, …]
│   ├── NodeDetailPanel [node, progress, notes, links, callbacks]
│   └── GraphFilters[filterMode, onChange]
└── PhaseLegend     [progress]
```

All callbacks follow the pattern `on<Action>: (id: number, …) => void` and are sourced from the store.

---

## 8. Security Utilities

### `sanitiseUrl(raw: string): string`

**Always use this function before setting any user-entered URL on an `href` attribute.**

```typescript
import { sanitiseUrl } from '@/utils/sanitiseUrl';

// ✅ Safe
<a href={sanitiseUrl(userLink) || '#'} rel="noopener noreferrer">

// ❌ Never do this with user input
<a href={userLink}>
```

The function:
- Prepends `https://` if no protocol is present
- Allows only `https:` and `http:` protocols
- Returns `''` for `javascript:`, `data:`, `vbscript:`, and malformed URLs

Validation also runs in `LinkInput` at the time the user presses **+ ADD**, so dangerous URLs are rejected before they reach the store.

---

## 9. Adding Content

### New step

1. Open `src/constants/phases.ts`
2. Add an object to the appropriate phase's `steps` array (or create a new phase)
3. Add any prerequisite edges in `src/constants/edges.ts`
4. Run `npm test` — the ForceLayoutEngine tests will validate bounds for all nodes including yours

### New phase

```typescript
// src/constants/phases.ts
{
  id: 'my-phase' as const,
  label: 'My Phase',
  icon: '🔬',
  desc: 'Short description shown under the phase label',
  color: '#7c3aed',    // choose a colour not yet used
  steps: [ /* your steps */ ],
}
```

Also add the ID to `PHASE_ORDER` and add a matching entry in `PHASE_COLORS` and `PHASE_LABELS` in `colors.ts`.

### New tag

```typescript
// src/constants/colors.ts
export const TAG_COLORS: Record<string, string> = {
  // … existing tags …
  'MyTag': '#your-hex-color',
};
```

---

## 10. Customising the Graph Layout

`ForceLayoutEngine.ts` exposes named constants at the top of the file:

```typescript
const ITERATIONS    = 300;    // More = more stable, slower to compute
const REPULSION     = 3200;   // Higher = nodes spread further apart
const EDGE_LENGTH   = 160;    // Ideal spring length in virtual pixels
const SPRING_K      = 0.022;  // Spring stiffness
const CENTRE_GRAVITY = 0.005; // Pull towards vertical centre
const DAMPING       = 0.7;    // Velocity decay per tick
const BOUNDARY_PAD  = 50;     // Min distance from virtual canvas edge
```

Change these constants in `ForceLayoutEngine.ts` and run `npm test` — the existing tests will catch if positions go out of bounds.

---

## 11. Swapping Storage Backends

Any class implementing `IStorageService` can be dropped into `main.tsx`:

```typescript
const storage = new MyCustomService(); // implements IStorageService
const useLearningStore = createLearningStore(storage);
```

The `InMemoryStorageService` also exposes a `clear()` method for test teardown.

---

## 12. Testing Strategy

```bash
npm test              # Vitest unit + integration (runs --coverage)
npm run test:watch    # Watch mode during development
npm run test:e2e      # Playwright E2E (requires npm run dev running)
npm run typecheck     # tsc --noEmit
```

**Test isolation rule:** every test that touches the store must create its own `InMemoryStorageService` and `createLearningStore(storage)` instance — never use a shared singleton.

**Coverage thresholds** (`vitest.config.ts`):

| Pattern | Lines |
|---------|-------|
| Global | ≥ 80% |
| `src/store/**` | ≥ 90% |
| `src/services/**` | ≥ 85% |

---

## 13. CI/CD and Deployment

### GitHub Actions workflows

| Workflow | Triggers on | Steps |
|----------|-------------|-------|
| `ci.yml` | Every non-main push/PR | lint → typecheck → test+coverage → build → Docker health check |
| `deploy.yml` | Push to `main` | Triggers Render/Cloudflare deploy hook → health check |

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `RENDER_DEPLOY_HOOK_URL` | Render deploy hook (if using Render) |
| `RENDER_DEPLOY_URL` | Public Render URL for health check |
| `CF_API_TOKEN` | Cloudflare API token (if using Cloudflare Pages) |
| `CF_ACCOUNT_ID` | Cloudflare account ID |

---

## 14. Cloudflare Pages (Recommended Free Deployment)

> **Recommended over Render** for this app. Serves from Cloudflare's global edge — no cold starts, free forever for static sites, custom domain with free SSL.

### One-time setup

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → **Create a project** → **Connect to Git**
3. Select your repo
4. Set build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `20`
5. Click **Save and Deploy**

Every push to `main` auto-deploys. PRs get preview URLs automatically.

### Custom domain

Dashboard → your project → **Custom domains** → Add domain → follow DNS instructions.

### Update `deploy.yml` for Cloudflare

Replace the Render step with:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CF_API_TOKEN }}
    accountId: ${{ secrets.CF_ACCOUNT_ID }}
    projectName: ai-trust-learning-path
    directory: dist
    gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

> **Note:** Cloudflare Pages doesn't use `nginx.conf` — security headers must be added via `public/_headers` (see below).

### `public/_headers` for Cloudflare Pages security headers

Create this file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';

/index.html
  Cache-Control: no-store, no-cache, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## 15. Docker / Self-Hosted

```bash
# Build production image
docker build --target production -t ai-trust-app .

# Run on port 8080
docker run -p 8080:80 ai-trust-app

# Dev server with hot reload
docker compose up dev

# Production
docker compose up prod

# Run tests in container
docker compose up test
```

The Dockerfile uses a multi-stage build: `deps → build → nginx:1.25-alpine`. The final image is ~25 MB.

nginx security headers are configured in `nginx.conf`. The Content-Security-Policy covers:
- No `unsafe-eval`
- `'unsafe-inline'` only on `style-src` (required for Vite's CSS injection)
- External fonts from `fonts.googleapis.com` / `fonts.gstatic.com` only
- `frame-ancestors 'none'` (blocks embedding in iframes)
