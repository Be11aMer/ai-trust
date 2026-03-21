# AI Trust Learning Path — User Manual

> A personal learning tracker for the 50-step journey from Python fundamentals to AI safety, LLM interpretability, and EU AI Act compliance.

---

## What Is This App?

The AI Trust Learning Path is a private, browser-based learning tracker. It helps you navigate a structured 50-step curriculum spanning seven phases — from Python and maths foundations all the way to cutting-edge AI safety and regulatory knowledge.

**Everything is stored on your own computer.** No account, no cloud sync, no data leaves your browser.

---

## Getting Started

Open the app in your browser. You'll land on the **Path View** — a scrollable list of all 50 learning steps organised by phase.

### The two views

The top bar has two view buttons:

| Button | What it shows |
|--------|---------------|
| **≡ Path** | Every step as a card, grouped by phase |
| **◈ Graph** | A force-directed diagram showing how steps connect to each other |

Switch between them at any time — your progress is preserved.

---

## Path View

### Reading a step card

Each card shows:
- **Step number** (01–50) — in the phase's colour when complete
- **Title** — the topic name
- **Tag badge** — the subject area (ML, DL, Trust ★, etc.)
- **⭐** — this step is trust-critical (part of the AI safety track)
- **Yellow dot** — you've added notes or links to this step
- **Description preview** — the first few words of the description

### Marking a step complete

Click the **square checkbox** on the left of any card. It turns to a coloured ✓. Click again to un-check it.

Your completion percentage updates immediately in the top bar.

### Expanding a step

Click anywhere on the card (except the checkbox) to **expand** it. You'll see:

- **Full description**
- **Curator note** — a highlighted box with extra context (if present)
- **Origin badge** — shows if a step was added specifically for the AI Trust path, or moved earlier compared to a standard curriculum
- **REQUIRES** — steps you should complete first (shown as colour-coded chips)
- **YOUR NOTES** — a free-text area for your personal notes
- **ARTIFACTS & LINKS** — a list of URLs you can attach (notebooks, papers, code)

Click the card again to collapse it.

### Writing notes

Inside an expanded card, click the **YOUR NOTES** textarea and type anything. Notes are saved **automatically when you click away** (on blur). There is no save button.

### Adding an artifact link

Inside an expanded card, find the **ARTIFACTS & LINKS** section:

1. Type or paste a URL into the input box (e.g. `github.com/my-notebook`)
2. Press **Enter** or click **+ ADD**

The link appears in the list. Click **×** to remove it.

> ⚠️ Only `https://` and `http://` URLs are accepted. `javascript:` and other unsafe URLs are blocked for your protection.

### Show a step in the graph

Each card has a **◈** button on its right side. Clicking it switches to the Graph view and highlights that exact step.

---

## Filters (Path View)

Above the step list, you'll find filter and navigation controls:

### Step filter tabs

| Filter | What it shows |
|--------|---------------|
| **All** | All 50 steps |
| **★ Trust** | Only the trust-critical steps (tagged with ★) |
| **Done** | Steps you've marked complete |
| **Active** | Steps you haven't done yet, but all prerequisites are complete |

### Phase selector

A row of phase name buttons lets you jump straight to a specific phase. Click a phase name to scroll to it. The **mini-map strips** below the buttons show per-phase completion as a coloured bar.

---

## Graph View

The graph shows all 50 steps as circular nodes connected by lines (edges) that represent prerequisites. Nodes are grouped into vertical **phase columns**.

### Reading the graph

| Visual | Meaning |
|--------|---------|
| **Filled circle** (phase colour) | Step is complete |
| **Dim ring** | Step not yet done |
| **⭐ star badge** | Trust-critical step |
| **Yellow dot** (top-right of node) | You have notes or links on this step |
| **Connecting line** | Prerequisite relationship |
| **Bright line** | Both endpoints are complete |

### Navigating the graph

| Action | How |
|--------|-----|
| **Pan** (move around) | Click and drag on empty space |
| **Zoom** | Scroll the mouse wheel |
| **Select a node** | Click on any circle |
| **Close the detail panel** | Click × in the top-right of the panel |

### Graph filters (bottom-right buttons)

| Button | What it shows |
|--------|---------------|
| **All** | All 50 nodes |
| **★ Trust** | Only trust-critical nodes; others are dimmed |
| **Done** | Only completed nodes; others are dimmed |
| **Unlocked** | Steps whose prerequisites are all done |

### Node detail panel

Clicking a node opens a panel on the right showing:

- Step number, title, tag, and phase
- Full description
- **MARK COMPLETE / undo** button
- **≡ Path** button — switches to Path view and scrolls to this step
- **CONNECTIONS** — prerequisite chips (click to jump to that node)
- **NOTES** and **ARTIFACTS & LINKS** (same as path view)

---

## Top Bar

| Element | What it means |
|---------|---------------|
| **AI Trust Learning Path** | App name (click to go to path view) |
| **X / 50 DONE** | Your total completion count |
| **X / 10 TRUST ★** | How many trust-critical steps you've completed |
| **NEXT UP: XX · Title** | The next incomplete step |

---

## Your Progress Is Private

All data — progress, notes, and links — is stored exclusively in your browser's `localStorage`. It:

- **Never leaves your device**
- **Persists between browser sessions** (unless you clear browser data)
- **Is not backed up automatically**

### Backing up your data

Open browser developer tools (F12) → **Application** tab → **Local Storage** → `localhost` (or your domain) → find the key `ai-trust-unified-v1`. Copy the JSON value and save it to a file.

### Restoring data

Paste the JSON back into the same localStorage key via the developer tools console:
```javascript
localStorage.setItem('ai-trust-unified-v1', '<paste your JSON here>');
location.reload();
```

### Resetting all progress

To clear everything and start fresh:
```javascript
localStorage.removeItem('ai-trust-unified-v1');
location.reload();
```

---

## The Seven Phases

| # | Phase | Description |
|---|-------|-------------|
| 1 | **Foundation** | Python, maths (linear algebra, stats, calculus), Git, data tools |
| 2 | **Classical ML** | Supervised/unsupervised learning, evaluation, regularisation |
| 3 | **Deep Learning** | Neural nets, CNNs, training techniques, production basics |
| 4 | **NLP & LLMs** | Transformers, BERT, GPT, RAG, fine-tuning, agents |
| 5 | **AI Trust Core** | Safety, alignment, interpretability, red-teaming, uncertainy |
| 6 | **MLOps & Infra** | CI/CD for ML, monitoring, deployment, model registries |
| 7 | **Advanced & Research** | Frontier safety, mechanistic interpretability, EU AI Act, auditing |

---

## Trust-Critical Steps (★)

Ten steps are marked as trust-critical — they are the core of the AI safety and regulation track:

| # | Step | Tag |
|---|------|-----|
| 26 | BitNet / Efficient LLMs | LLM ★ |
| 27 | Constitutional AI | Trust ★ |
| 28 | RLHF & DPO | Trust ★ |
| 29 | Red-Teaming & Adversarial | Trust ★ |
| 30 | Mechanistic Interpretability | Trust ★ |
| 36 | Uncertainty & Conformal Prediction | Trust ★ |
| 41 | AI Safety Frameworks | Trust ★ |
| 44 | EU AI Act & Compliance | Policy ★ |
| 47 | Frontier Safety Research | Trust ★ |
| 50 | AI Auditing & Certification | Policy ★ |

Use the **★ Trust** filter in either view to see only these steps.

---

## Keyboard Accessibility

| Key | Action |
|-----|--------|
| **Tab** | Move between interactive elements |
| **Enter** | Toggle a step complete / expand a card / activate a button |
| **Space** | Click checkboxes and buttons |

---

## Frequently Asked Questions

**Q: My progress disappeared after clearing browser history.**  
A: Clearing browser data removes localStorage. Back up your data regularly using the method described in [Backing up your data](#backing-up-your-data).

**Q: Can I use this on my phone?**  
A: Yes — the app is responsive. The Path view works well on mobile. The Graph view is best on a larger screen due to the drag-to-pan interaction.

**Q: Can two people share progress?**  
A: Not currently — each browser instance has its own localStorage. This is by design for privacy.

**Q: The graph looks different every time I reload.**  
A: The force layout uses a fixed seed so positions are always identical between reloads. If you see a different layout, try clearing your browser cache.

**Q: Can I add my own steps?**  
A: Not via the UI — the step list is defined in code. See the [Developer Guide](./DEVELOPER_GUIDE.md) for how to add steps in `src/constants/phases.ts`.
