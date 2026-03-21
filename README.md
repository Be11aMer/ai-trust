# AI Trust Learning Path

A production-grade, fully-deployable React SPA for tracking a 50-step AI skills curriculum mapping foundational ML to AI safety, interpretability, and EU regulation — built for the BELLAMER / CDDBS research trajectory.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  index.html  →  main.tsx (Composition Root)                         │
│                  │                                                   │
│                  ├── LocalStorageService (IStorageService)           │
│                  ├── createLearningStore(storage)                    │
│                  └── <App store={store} />                           │
│                         │                                            │
│            ┌────────────┼────────────┐                               │
│            │            │            │                               │
│      <TopBar>    <PathView>    <GraphView>    <PhaseLegend>          │
│                      │              │                                │
│               PathFilters    LayoutEngineContext                     │
│               PhaseMiniMap   (ForceLayoutEngine injected)            │
│               PhaseBlock      ├─ useGraphLayout                     │
│               StepCard        ├─ useGraphInteraction                 │
│                               ├─ useGraphFilter                     │
│                               ├─ PhaseBands                         │
│                               ├─ EdgeLayer                          │
│                               ├─ NodeLayer → NodeGlyph              │
│                               ├─ NodeDetailPanel                    │
│                               └─ GraphFilters                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

```bash
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm test          # Vitest unit + integration tests with coverage
npm run typecheck # tsc --noEmit
npm run lint      # ESLint + Prettier check
```

## Docker

```bash
docker compose up dev    # Hot-reload dev server on :5173
docker compose up prod   # Nginx production image on :80
docker compose up test   # Run tests then exit
```

Build and run production image manually:

```bash
docker build --target production -t ai-trust-app .
docker run -p 8080:80 ai-trust-app
# App available at http://localhost:8080
```

---

## Project Structure

```
src/
├── main.tsx               # Composition root — wires concrete deps
├── App.tsx                # View router — path | graph
├── constants/             # Design tokens, phases data, edges
├── types/                 # TypeScript interfaces and enums
├── services/
│   ├── storage/           # IStorageService, LocalStorage, InMemory
│   └── graph/             # ILayoutEngine, ForceLayoutEngine
├── store/                 # Zustand learning store (factory pattern)
├── hooks/                 # useGraphLayout, useGraphInteraction, useGraphFilter, useStepFilter
├── components/
│   ├── common/            # Tag, MiniBar, NoteArea, LinkInput
│   ├── layout/            # TopBar, PhaseLegend
│   ├── path/              # PathView, PhaseBlock, StepCard, PathFilters, PhaseMiniMap
│   └── graph/             # GraphView, GraphCanvas, PhaseBands, EdgeLayer, NodeLayer, NodeDetailPanel
└── test/
    ├── setup.ts           # RTL + Vitest config
    ├── mocks/             # InMemory storage factories
    └── e2e/               # Playwright E2E specs
```

---

## SOLID Principles

**Single Responsibility** — Every module does exactly one thing. `PathView.tsx` and `GraphView.tsx` are pure orchestrators with zero business logic. `ForceLayoutEngine.ts` computes positions only — no React, no DOM, no state. `useLearningStore.ts` manages state only — no layout or rendering.

**Open/Closed** — `IStorageService` and `ILayoutEngine` are interfaces. Adding a new storage backend (IndexedDB, Supabase) means implementing the interface — zero changes to existing code. Adding a new layout algorithm requires only a new class, not modifications to `GraphView`.

**Liskov Substitution** — `InMemoryStorageService` is a complete drop-in replacement for `LocalStorageService` in all tests. No mocking of globals required. All behaviour is identical from the consumer's perspective.

**Interface Segregation** — Storage is split into `IReadableStorage`, `IWritableStorage`, and `IDeletableStorage`. Consumers import only what they need. Graph hooks are separate: `useGraphLayout` (positions), `useGraphInteraction` (pan/zoom), `useGraphFilter` (visibility) — no single hook does multiple concerns.

**Dependency Inversion** — `useLearningStore` receives its storage service via factory parameter, not import. `GraphView` receives `ILayoutEngine` via React context (`LayoutEngineContext`) — never imports `ForceLayoutEngine` directly. Concrete dependencies are wired exclusively in `main.tsx` (the composition root).

---

## Testing Strategy

| Layer       | Tool                       | Target Coverage |
|-------------|----------------------------|-----------------|
| Unit        | Vitest + RTL               | ≥ 80% overall   |
| Store       | Vitest                     | 100%            |
| Services    | Vitest                     | 100%            |
| E2E         | Playwright (Chromium)      | Key user flows  |

Run all tests:

```bash
npm test                  # Vitest unit + integration
npm run test:e2e          # Playwright (requires dev server)
```

---

## CI/CD Flow

```
push to branch
    │
    ▼
lint + typecheck
    │
    ▼
vitest --coverage (≥80%) → Upload to Codecov
    │
    ▼
vite build → Upload dist/ artifact
    │
    ▼
docker build --target production → Health check

push to main
    │
    ▼
trigger Deploy via Cloudflare Workers (Wrangler)
    │
    ▼
Wait for deploy → Health check URL
```

---

## Deployment — Cloudflare Workers

The application is configured to deploy automatically to **Cloudflare Workers**. Since it is a Single Page Application (SPA), the `wrangler.jsonc` file configures the `not_found_handling` to serve `index.html` natively.

### Automated Setup

The repository utilizes the Cloudflare Workers GitHub automation.
Any push to the `main` branch is picked up by the Cloudflare integration and deployed to production. 

### Branch Protection (document and enforce in GitHub settings)

- `main` requires: CI workflow passing, 1 approving review
- Direct pushes to `main` are blocked
- Delete branch on merge is enabled

---

## Contributing

### Branch Naming

```
feat/short-description
fix/short-description
docs/short-description
chore/short-description
```

### Commit Format (Conventional Commits)

```
feat: add conformal prediction to calibration step
fix: prevent duplicate links in store
docs: document SOLID principles in README
style: format StepCard with prettier
refactor: extract EdgeLayer from GraphView
test: add ForceLayoutEngine determinism test
chore: upgrade vite to 5.4
ci: add Codecov integration
```

### PR Checklist

- [ ] `npm run lint` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] `npm test` exits 0 with ≥80% coverage
- [ ] New components have a `.test.tsx` file
- [ ] New `services/` or `store/` code has 100% coverage
- [ ] Common components have a `.stories.tsx` file
- [ ] README updated if architecture changes
