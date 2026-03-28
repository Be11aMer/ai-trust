/**
 * Foundation Phase — Steps 01–07
 * "The non-negotiable substrate. Everything in later phases assumes this."
 *
 * Content generated per LEARN_CONTENT_SCHEMA.md and reviewed against
 * CONTEXT/FoundationPhaseExplainer.txt
 *
 * Additions vs original fundamentals01-07.txt:
 *  + Git & reproducibility (Step 01, section b)
 *  + venv & dependency management (Step 01, section b)
 *  + pandas (Step 01, section b)
 *  + SHA-256 / hash mechanics (Step 02, section a)
 *  + AP / AUC-PR metric (Step 06, section a)
 */
import type { LearnPhase } from '../types';

export const foundationPhase: LearnPhase = {
  id: 'foundation',
  title: 'Foundation',
  stepRange: '01–07',
  duration: '14–22 weeks',
  overview:
    'The non-negotiable substrate. No step in any later phase makes sense without these seven. Ordering is deliberate: language → reasoning tools → ML-specific application of those tools.',
  color: '#38bdf8',
  steps: [
    // ── STEP 01 ──────────────────────────────────────────────────────────────
    {
      id: '01',
      title: 'Python Mastery for AI',
      duration: '2–4 weeks',
      tagline: 'The language of the field. Everything else builds on this.',
      color: '#38bdf8',
      why:
        'Python is not optional for AI work — it is the medium. Every major ML framework (PyTorch, TensorFlow, scikit-learn, HuggingFace) and every production pipeline is Python-first. Your existing dev experience means you are remapping, not starting over. The goal is idiomatic Python written the way ML engineers write it. Auditability starts here: type hints, logging, and reproducibility seeds introduced from day one cost almost nothing now and enormous effort to retrofit later.',
      connections: [
        { label: '→ 02', desc: 'Core CS — all data structures implemented in Python' },
        { label: '→ 05', desc: 'ML Fundamentals — scikit-learn APIs are Python' },
        { label: '→ 15', desc: 'PyTorch hooks = Transparency Probe entry point' },
        { label: '→ MP-C', desc: 'Offline Audit Logger — Python + SQLite project' },
      ],
      sections: [
        {
          id: 's01a',
          title: 'Core Language Mechanics',
          color: '#38bdf8',
          icon: '◈',
          intro:
            'The patterns that differ most from other languages. Focus on idiomatic Python — the way ML engineers actually write it, not the way beginners are taught.',
          topics: [
            {
              title: 'Data Structures & Comprehensions',
              tag: 'Essential',
              tagColor: '#38bdf8',
              summary: "Python's built-in types are the vocabulary of every ML codebase.",
              points: [
                { label: 'list / dict / tuple / set', detail: 'Ordered mutable list, O(1) hash map, immutable sequence, unordered unique set. Every ML pipeline uses all four constantly.' },
                { label: 'List comprehension', detail: '`[f(x) for x in xs if cond(x)]` — the single most common Python pattern in ML. Master nested and filtered forms.' },
                { label: 'Dict comprehension', detail: '`{k: v for k, v in pairs}` — used for label encoding, config building, per-class metric dicts.' },
                { label: 'Generator / yield', detail: 'Lazy evaluation, constant memory. DataLoaders use this internally. Understanding yield is required before writing custom Dataset classes.' },
                { label: 'Unpacking & multiple return', detail: '`X_train, X_test, y_train, y_test = split(X, y)` — idiomatic Python, used in every sklearn example.' },
              ],
              code: `import numpy as np

rng = np.random.default_rng(42)  # always seed — reproducibility is an audit property

# List comprehension — most common ML pattern
embeddings = [str(i) for i in range(10) if i % 2 == 0]

# Dict comprehension — label encoding
labels = ['cat', 'dog', 'cat', 'bird']
label_map = {lbl: idx for idx, lbl in enumerate(sorted(set(labels)))}
print(label_map)  # {'bird': 0, 'cat': 1, 'dog': 2}

# Generator — stream large files without RAM spike
def batch_iter(data: list, size: int = 32):
    for i in range(0, len(data), size):
        yield data[i : i + size]

for batch in batch_iter(list(range(100)), size=10):
    pass  # process each batch — never loads all 100 at once

# Multiple return + unpacking
def split(X: list, y: list, ratio: float = 0.8):
    n = int(len(X) * ratio)
    return X[:n], X[n:], y[:n], y[n:]

X_train, X_test, y_train, y_test = split(list(range(100)), list(range(100)))`,
            },
            {
              title: 'OOP & Dunder Methods',
              tag: 'Essential',
              tagColor: '#38bdf8',
              summary:
                'Every ML framework is built on OOP. You extend nn.Module, implement Dataset with __len__/__getitem__, write context managers for audit loggers.',
              points: [
                { label: '__init__ / __repr__', detail: 'Constructor and string representation. Implement on all domain objects — essential for debugging and logging.' },
                { label: '__len__ / __getitem__', detail: 'The PyTorch Dataset protocol. Implement these two and your class works with DataLoader automatically.' },
                { label: '__enter__ / __exit__', detail: 'Context manager. `with AuditLogger() as log:` guarantees cleanup even on exception — critical for the TrustCanary.' },
                { label: '@property / @classmethod', detail: '`model.num_parameters` as property. `Model.from_pretrained(path)` as classmethod — the HuggingFace factory pattern.' },
                { label: '@dataclass(frozen=True)', detail: 'Auto-generates __init__, __repr__, __eq__. frozen=True makes config objects immutable — important for reproducible experiments.' },
              ],
              code: `from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)  # never print() in production

@dataclass(frozen=True)
class TrainingConfig:
    model_name: str
    learning_rate: float = 3e-4
    batch_size: int = 32

    def __post_init__(self) -> None:
        if self.learning_rate <= 0:
            raise ValueError(f"lr must be positive, got {self.learning_rate}")

class AuditLogger:
    """Context manager — guaranteed cleanup even on exception (MP-C prototype)."""
    def __init__(self, path: str) -> None:
        self._path = path
        self._entries: list[dict] = []

    def __enter__(self) -> "AuditLogger":
        return self

    def __exit__(self, *args: object) -> None:
        logger.info("Flushing %d audit entries to %s", len(self._entries), self._path)
        # flush to disk here

    def log(self, **kwargs: object) -> None:
        self._entries.append(kwargs)

with AuditLogger("audit.db") as log:
    log.log(event="prediction", model="v1", confidence=0.87)`,
            },
            {
              title: 'Type Hints & Error Handling',
              tag: 'Production',
              tagColor: '#a78bfa',
              summary:
                'Type hints are not optional in production AI code. A typed codebase is an auditable codebase — mypy strict catches bugs before they reach a deployed model.',
              points: [
                { label: 'Basic annotations', detail: '`x: int`, `name: str | None`, return `-> None`. Be explicit about nullability.' },
                { label: 'Protocol (structural typing)', detail: 'Defines interfaces without inheritance — more powerful than ABC for dependency inversion. Your IStorageService is a Protocol.' },
                { label: 'Callable / TypeVar', detail: '`Callable[[str], float]` for transform functions. Both appear in ML framework source code.' },
                { label: 'Custom exceptions', detail: '`class ModelLoadError(RuntimeError)`. Domain-specific exceptions make errors meaningful and catchable upstream.' },
                { label: 'logging not print', detail: '`logger = logging.getLogger(__name__)`. Never `print()` in production. Log levels: DEBUG, INFO, WARNING, ERROR.' },
              ],
              code: `from typing import Protocol, Callable
import logging

logger = logging.getLogger(__name__)

class Encodable(Protocol):
    def encode(self, text: str) -> list[float]: ...

class ModelLoadError(RuntimeError):
    """Raised when a model checkpoint cannot be loaded."""

Transform = Callable[[str], str]

def run_pipeline(
    texts: list[str],
    transforms: list[Transform],
    encoder: Encodable,
) -> list[list[float]]:
    try:
        processed = texts[:]
        for t in transforms:
            processed = [t(x) for x in processed]
        return [encoder.encode(x) for x in processed]
    except FileNotFoundError as e:
        raise ModelLoadError("Encoder model not found") from e
    except Exception:
        logger.exception("Pipeline failed unexpectedly")
        raise`,
            },
          ],
        },
        {
          id: 's01b',
          title: 'Ecosystem & Auditability Practices',
          color: '#34d399',
          icon: '⬡',
          intro:
            'NumPy, pandas, Git, and virtual environments are not optional extras — they are the substrate of every reproducible, auditable ML experiment.',
          topics: [
            {
              title: 'NumPy — Numerical Foundation',
              tag: 'Essential',
              tagColor: '#38bdf8',
              summary:
                'NumPy arrays are the universal currency of ML. PyTorch tensors are NumPy arrays with GPU support and autograd. Master broadcasting and vectorisation.',
              points: [
                { label: 'ndarray + dtype', detail: 'N-dimensional array, homogeneous dtype. float32 for ML (half float64 memory). uint8 for raw pixels.' },
                { label: 'Broadcasting', detail: 'Operations between arrays of different shapes. `(1000,1) + (1000,)` works without loops. Critical for loss computation.' },
                { label: 'Vectorisation', detail: 'Replace Python loops with array ops. `np.sum(arr > 0.5)` vs a loop — 100× speed difference on large arrays.' },
                { label: 'Boolean indexing', detail: '`arr[labels == 3]` — select all samples of class 3. The idiomatic way to filter arrays.' },
                { label: 'np.random.default_rng(seed)', detail: 'Always seed. Reproducibility is an auditability property — a run that cannot be reproduced is not auditable.' },
              ],
              code: `import numpy as np

rng = np.random.default_rng(seed=42)  # ← always seed

images = rng.integers(0, 256, size=(100, 28, 28), dtype=np.uint8)
labels = rng.integers(0, 10, size=(100,))

# Vectorised normalisation — no loop
images_f = images.astype(np.float32) / 255.0

# Boolean indexing
threes = images_f[labels == 3]   # shape: (N_threes, 28, 28)

# Broadcasting: subtract per-pixel mean
mean = images_f.mean(axis=0)     # shape: (28, 28)
normalised = images_f - mean     # (100,28,28) - (28,28) broadcasts correctly

print(f"Original shape: {images_f.shape}")
print(f"Threes: {threes.shape}, Normalised: {normalised.shape}")`,
            },
            {
              title: 'pandas — Tabular Data Entry Point',
              tag: 'Essential',
              tagColor: '#38bdf8',
              summary:
                'Every tabular ML dataset starts with pandas. sklearn, HuggingFace, and Kaggle all assume you can load, inspect, and clean a DataFrame before modelling.',
              points: [
                { label: 'DataFrame / Series', detail: 'Labelled 2D table and 1D column. `df = pd.read_csv("data.csv")` is line 1 of almost every ML notebook.' },
                { label: 'loc / iloc indexing', detail: '`df.loc[mask, "column"]` (label-based) vs `df.iloc[0:10, :]` (position-based). Know both.' },
                { label: 'groupby / value_counts / describe', detail: 'EDA before modelling. `df.groupby("label").size()` shows class imbalance — a trust-critical check.' },
                { label: 'Missing value handling', detail: '`df.isnull().sum()` to detect. `df.fillna(median)` or `df.dropna()` to handle. Document the choice — it affects auditability.' },
                { label: 'To NumPy: df.to_numpy()', detail: '`X = df.drop("label", axis=1).to_numpy(dtype=np.float32)` — the bridge from pandas EDA to sklearn/PyTorch.' },
              ],
              code: `import pandas as pd
import numpy as np

# Simulate a small CDDBS-style dataset
rng = np.random.default_rng(42)
df = pd.DataFrame({
    'text_length': rng.integers(50, 500, 200),
    'source_credibility': rng.uniform(0, 1, 200).round(2),
    'share_count': rng.integers(0, 10000, 200),
    'label': rng.choice(['disinfo', 'legit'], 200, p=[0.2, 0.8]),
})

# EDA — always do this before modelling
print(df.describe())
print("\\nClass balance:")
print(df['label'].value_counts())          # check for imbalance!
print("\\nMissing values:")
print(df.isnull().sum())                   # should be 0

# Filter and transform
high_share = df.loc[df['share_count'] > 5000, ['text_length', 'label']]
print(f"\\nHigh-share rows: {len(high_share)}")

# Bridge to sklearn
X = df.drop('label', axis=1).to_numpy(dtype=np.float32)
y = (df['label'] == 'disinfo').astype(int).to_numpy()
print(f"X shape: {X.shape}, y shape: {y.shape}")`,
            },
            {
              title: 'Git & Reproducibility for AI',
              tag: 'AI Trust ★',
              tagColor: '#ff6b35',
              summary:
                'A model experiment that cannot be re-run from a commit hash is not auditable. Git is not just version control — it is the foundation of reproducible, auditable AI systems.',
              points: [
                { label: 'Commit hash = experiment ID', detail: 'Every training run should be tagged with the git commit hash. `git rev-parse HEAD` gives you the exact code state. Log it alongside model metrics.' },
                { label: '.gitignore for ML projects', detail: 'Never commit: data/, checkpoints/, .env, __pycache__/, *.pyc, dist/, .venv/. Always commit: code, configs, requirements.txt, test results.' },
                { label: 'Branching for experiments', detail: '`git checkout -b exp/bitnet-v2-ternary`. Each experiment on its own branch. Merge only what you can reproduce and explain.' },
                { label: 'DVC — Data Version Control', detail: 'Git tracks code; DVC tracks data and model artefacts. `dvc run` logs the full pipeline (data → model → metrics) as a DAG. EU AI Act Article 12 requires this level of traceability.' },
                { label: 'Semantic commit messages', detail: '`feat: add calibration audit to pipeline` / `fix: normalisation leakage in preprocessing`. An auditor reading the git log should understand what changed and why.' },
              ],
              code: `# Shell commands — run in your project root

# Initialise git and DVC
# git init && dvc init

# Tag your training run with the commit hash
import subprocess, logging
logger = logging.getLogger(__name__)

def get_git_hash() -> str:
    """Returns the current commit hash for experiment provenance."""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        logger.warning("Not in a git repo — provenance unavailable")
        return "unknown"

git_hash = get_git_hash()
logger.info("Training run started | commit=%s", git_hash)

# Log alongside metrics — the full audit record
experiment_record = {
    "commit": git_hash,
    "model": "logistic_regression",
    "dataset_hash": "sha256:abc123...",   # hash your data too
    "val_f1": 0.847,
    "val_ece": 0.023,
}
print(experiment_record)
# Store this in SQLite (MP-C) or MLflow for full traceability`,
            },
            {
              title: 'Virtual Environments & Dependency Pinning',
              tag: 'AI Trust ★',
              tagColor: '#ff6b35',
              summary:
                '"It works on my machine" is the most common reason an AI experiment cannot be reproduced by an auditor or collaborator. Pinned environments are an auditability requirement.',
              points: [
                { label: 'python -m venv .venv', detail: 'Creates an isolated Python environment. Every project gets its own .venv. Never install ML packages into the system Python.' },
                { label: 'pip freeze > requirements.txt', detail: 'Exact pinned versions of every transitive dependency. `torch==2.3.0+cpu` not `torch>=2`. An auditor must be able to reproduce your environment.' },
                { label: 'pyproject.toml (modern)', detail: 'The modern standard. `[project.dependencies]` for runtime deps, `[project.optional-dependencies.dev]` for test/lint tools.' },
                { label: 'Why pinning matters for AI trust', detail: 'scikit-learn 1.3 and 1.4 produce different cross-validation results with the same code. An unpinned environment is a reproducibility hazard — equivalent to undisclosed model drift.' },
              ],
              code: `# Shell commands (not Python)
# python -m venv .venv
# source .venv/bin/activate          # Linux/Mac
# .venv\\Scripts\\activate             # Windows
# pip install -r requirements.txt

# Minimal requirements.txt for CDDBS pipeline
REQUIREMENTS = """
# Core ML
numpy==1.26.4
pandas==2.2.1
scikit-learn==1.4.2
matplotlib==3.8.4
scipy==1.13.0

# Dev tools
pytest==8.2.0
mypy==1.10.0
ruff==0.4.4
"""

# pyproject.toml approach (preferred for new projects)
PYPROJECT_SNIPPET = """
[project]
name = "cddbs"
requires-python = ">=3.11"
dependencies = [
    "numpy==1.26.4",
    "scikit-learn==1.4.2",
]

[project.optional-dependencies]
dev = ["pytest==8.2.0", "mypy==1.10.0"]
"""

print("Pin versions. Document why. An unpinned environment is not reproducible.")
print("An environment that is not reproducible is not auditable.")`,
            },
          ],
        },
      ],
    },

    // ── STEP 02 ──────────────────────────────────────────────────────────────
    {
      id: '02',
      title: 'Core CS Principles',
      duration: '2–3 weeks',
      tagline: "You don't run algorithms — you reason about them. That is the difference.",
      color: '#38bdf8',
      why:
        'Core CS gives you the vocabulary to reason about any algorithm: your force-directed graph layout, a hash chain audit logger, a KNN classifier. This is exactly the thinking required to design the CDDBS pipeline and evaluate BitNet\'s inference claims. Understanding O(n²) repulsion in your own graph code — and measuring it empirically — is a more direct learning path than any textbook. Hash functions are a central motif of your audit system: SHA-256 is how TrustCanary guarantees tamper-evident logs.',
      connections: [
        { label: '← 01', desc: 'Python — all structures implemented here' },
        { label: '→ 04', desc: 'Linear Algebra — matrix ops have well-defined complexity' },
        { label: '→ 08', desc: 'ML Algorithms — trees, kNN, SVMs all have cost profiles' },
        { label: '→ MP-C', desc: 'Hash chain audit logger — SHA-256, B-trees, SQLite' },
        { label: '→ Graph', desc: 'Force layout O(n²) repulsion — you built it, now reason about it' },
      ],
      sections: [
        {
          id: 's02a',
          title: 'Complexity & Data Structures',
          color: '#38bdf8',
          icon: '◈',
          intro:
            'Big-O is the vocabulary engineers use to discuss code quality. The goal is to look at your own code and identify bottlenecks — not to pass trivia tests.',
          topics: [
            {
              title: 'Time Complexity & Big-O',
              tag: 'Essential',
              tagColor: '#38bdf8',
              summary:
                'How does runtime grow as input size grows? The answer determines whether code works on 1,000 samples or crashes on 1,000,000.',
              points: [
                { label: 'O(1) Constant', detail: 'Dict lookup, list index. Your friends in hot training loops.' },
                { label: 'O(log n) Logarithmic', detail: 'Binary search, heap push/pop. Doubles input, adds one step.' },
                { label: 'O(n) Linear', detail: 'One pass through data. Computing mean/sum. Baseline for data processing.' },
                { label: 'O(n log n) Linearithmic', detail: "Sorting. Python's sorted() is Timsort — the best comparison-based sort." },
                { label: 'O(n²) Quadratic', detail: 'Nested loops. Your force layout repulsion is O(n²) — why 50 nodes is fine but 5,000 would freeze.' },
                { label: 'Adversarial complexity', detail: 'An adversary knowing your algorithm is O(n²) can craft worst-case inputs to degrade CDDBS pipeline throughput — a real attack vector.' },
              ],
              code: `import time, random, string

N = 100_000
vocab = ["".join(random.choices(string.ascii_lowercase, k=6)) for _ in range(N)]
queries = random.choices(vocab, k=10_000)

# O(n) per query — search the list
t0 = time.perf_counter()
for q in queries:
    _ = next((i for i, v in enumerate(vocab) if v == q), -1)
list_time = time.perf_counter() - t0

# O(1) per query — dict lookup
label_map = {v: i for i, v in enumerate(vocab)}
t0 = time.perf_counter()
for q in queries:
    _ = label_map[q]
dict_time = time.perf_counter() - t0

print(f"List O(n): {list_time:.2f}s  Dict O(1): {dict_time:.4f}s")
print(f"Speedup: {list_time / dict_time:.0f}×")  # typically ~2000×

# Verify your force layout is O(n²)
def time_repulsion(n: int) -> float:
    pos = [(random.random(), random.random()) for _ in range(n)]
    t = time.perf_counter()
    for i in range(n):
        for j in range(n):
            if i != j:
                dx, dy = pos[i][0]-pos[j][0], pos[i][1]-pos[j][1]
                _ = (dx**2 + dy**2) ** 0.5
    return time.perf_counter() - t

for n in [50, 100, 200]:
    print(f"n={n}: {time_repulsion(n)*1000:.1f}ms")
# 4× n → 16× time — confirms O(n²)`,
            },
            {
              title: 'Essential Data Structures',
              tag: 'Essential',
              tagColor: '#a78bfa',
              summary:
                'Not every textbook structure matters. These appear directly in ML frameworks, CDDBS pipeline code, and your audit system.',
              points: [
                { label: 'Hash table (dict/set)', detail: 'O(1) average get/set. Counter for frequency, defaultdict for auto-init. Most important structure in preprocessing.' },
                { label: 'deque(maxlen=N)', detail: 'O(1) at both ends. `deque(maxlen=100)` is a sliding window — exactly how streaming inference confidence buffers work.' },
                { label: 'heapq', detail: 'Min-heap. O(log n) push/pop. Top-k retrieval, priority queues.' },
                { label: 'DAG / topological sort', detail: 'Your learning path is a DAG. Topological sort gives a valid study order. BFS finds the shortest unlock path.' },
              ],
              code: `from collections import deque, defaultdict
import heapq

# Sliding window: rolling confidence for CDDBS stream
class RollingMean:
    def __init__(self, window: int = 100) -> None:
        self._q: deque[float] = deque(maxlen=window)
    def update(self, v: float) -> None: self._q.append(v)
    @property
    def mean(self) -> float:
        return sum(self._q) / len(self._q) if self._q else 0.0

rm = RollingMean(window=5)
for v in [0.9, 0.8, 0.6, 0.7, 0.85, 0.95]:
    rm.update(v)
    print(f"Rolling mean: {rm.mean:.3f}")

# Topological sort of your learning graph
EDGES = [(1,2),(1,3),(1,5),(2,4),(3,5),(4,14),(5,8),(8,13),(13,30)]

def topo_sort(edges: list[tuple[int,int]], n: int) -> list[int]:
    in_deg: dict[int,int] = defaultdict(int)
    adj: dict[int,list[int]] = defaultdict(list)
    for s, d in edges:
        adj[s].append(d)
        in_deg[d] += 1
    q: deque[int] = deque(i for i in range(1, n+1) if in_deg[i] == 0)
    order: list[int] = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                q.append(nb)
    return order

print(topo_sort(EDGES, 30)[:8])  # [1, 2, 3, 4, 5, 8, 13, 30]`,
            },
            {
              title: 'SHA-256 & Hash Chain Integrity',
              tag: 'AI Trust ★',
              tagColor: '#ff6b35',
              summary:
                'Hash functions are the mechanical foundation of TrustCanary (MP-C). Understanding SHA-256 at the implementation level — not just the API — lets you design tamper-evident audit logs and reason about their guarantees.',
              points: [
                { label: 'SHA-256 properties', detail: 'Deterministic (same input = same output), preimage-resistant (cannot reverse), collision-resistant (cannot find two inputs with same hash). These three properties make it suitable for audit chains.' },
                { label: 'Hash chain', detail: 'Each entry hashes its own data plus the previous entry\'s hash. Tampering entry N invalidates all subsequent hashes — tamper-evident by construction.' },
                { label: 'Content-addressable storage', detail: 'Hash the dataset file — `sha256(data.csv)`. Store the hash in your experiment record. If the hash changes, the data changed. EU AI Act traceability requirement.' },
                { label: 'Collision resistance in practice', detail: 'SHA-256 has 2^256 possible outputs. Birthday paradox: you need ~2^128 trials to find a collision. Computationally infeasible for any real adversary.' },
              ],
              code: `import hashlib, json, sqlite3
from pathlib import Path

def sha256(data: str | bytes) -> str:
    """Compute SHA-256 hex digest."""
    if isinstance(data, str):
        data = data.encode()
    return hashlib.sha256(data).hexdigest()

# Content-addressable dataset fingerprint
def file_hash(path: str) -> str:
    """Hash a file for experiment provenance."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

# Hash chain — the core of MP-C TrustCanary
class HashChain:
    """Tamper-evident audit log. Any modification breaks the chain."""
    def __init__(self) -> None:
        self._prev = "genesis"
        self._entries: list[dict] = []

    def append(self, **data: object) -> str:
        payload = json.dumps({**data, "prev": self._prev}, sort_keys=True)
        entry_hash = sha256(payload)
        self._entries.append({"hash": entry_hash, "prev": self._prev, **data})
        self._prev = entry_hash
        return entry_hash

    def verify(self) -> bool:
        """Returns False if any entry has been tampered with."""
        prev = "genesis"
        for entry in self._entries:
            payload = json.dumps(
                {k: v for k, v in entry.items() if k not in ("hash",)},
                sort_keys=True,
            )
            if sha256(payload) != entry["hash"]:
                return False
            prev = entry["hash"]
        return True

chain = HashChain()
h1 = chain.append(event="model_loaded", version="v1")
h2 = chain.append(event="prediction", confidence=0.87, label="disinfo")
print(f"Chain valid: {chain.verify()}")  # True`,
            },
          ],
        },
        {
          id: 's02b',
          title: 'Recursion & Memory',
          color: '#a78bfa',
          icon: '◇',
          intro:
            'Recursion is how dependency graphs are naturally traversed. Memoisation turns exponential algorithms polynomial — the same insight behind dynamic programming and model caching.',
          topics: [
            {
              title: 'Recursion, Memoisation & DP',
              tag: 'Essential',
              tagColor: '#34d399',
              summary:
                'Edit distance (fuzzy disinformation matching), prerequisite resolution, and cache design all use these patterns.',
              points: [
                { label: 'Base case + recursive case', detail: 'Missing base case = stack overflow. Python default limit ~1000 frames. Always convert deep recursion to iteration.' },
                { label: '@lru_cache', detail: 'One decorator, exponential → polynomial. Memo-ises results by arguments. Thread-safe in CPython.' },
                { label: 'Iterative DFS with explicit stack', detail: 'For deep graphs: `stack = []` instead of recursion. No depth limit, same result.' },
                { label: 'Edit distance (DP)', detail: 'O(m×n) DP. Used for fuzzy matching near-duplicate disinformation headlines — a real CDDBS preprocessing step.' },
              ],
              code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

print(fib(50))  # instant — would take 2^50 ops without memoisation

# Edit distance — O(m*n) DP for fuzzy disinfo headline matching
def edit_distance(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, n + 1):
            temp = dp[j]
            if s1[i-1] == s2[j-1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j-1])
            prev = temp
    return dp[n]

# Near-duplicate detection in CDDBS corpus
headlines = [
    "EU AI Act signed into law",
    "EU AI Act signed in law",   # near-duplicate
    "ChatGPT hallucinates facts",
]
for i, h1 in enumerate(headlines):
    for j, h2 in enumerate(headlines):
        if i < j:
            d = edit_distance(h1, h2)
            print(f"dist({i},{j}) = {d}  {'NEAR-DUP' if d < 5 else ''}")`,
            },
          ],
        },
      ],
    },

    // ── STEP 03 ──────────────────────────────────────────────────────────────
    {
      id: '03',
      title: 'Statistics & Probability',
      duration: '3–4 weeks',
      tagline: 'Every model output is a probability. Every training signal is a gradient. Both require this.',
      color: '#a78bfa',
      why:
        'Statistics is the language in which AI trust is expressed. Calibration, uncertainty quantification, bias detection, and p-values in fairness audits are all statistical. You cannot read an AI safety paper, evaluate a model, or argue about calibration in front of the CII without a solid statistical foundation. The ECE (Expected Calibration Error) you implement here is the exact metric in your MP-B Calibration Auditor. Hypothesis testing for fairness audits is a professional skill for AI practitioners under the EU AI Act.',
      connections: [
        { label: '← 01', desc: 'Python + NumPy implement all of this' },
        { label: '→ 06', desc: 'Evaluation Metrics — accuracy, F1, AUC are statistical' },
        { label: '→ 31', desc: 'Calibration & Uncertainty — direct application of this step' },
        { label: '→ 33', desc: 'Fairness Auditing — statistical tests for bias' },
        { label: '→ MP-B', desc: 'Calibration Auditor — ECE, reliability diagrams built here' },
      ],
      sections: [
        {
          id: 's03a',
          title: 'Probability Foundations',
          color: '#a78bfa',
          icon: '◈',
          intro:
            'Probability is the mathematical language of uncertainty. Every model prediction is a probability distribution, not a single answer — understanding the distribution is how you reason about model behaviour.',
          topics: [
            {
              title: 'Distributions & Random Variables',
              tag: 'Essential',
              tagColor: '#a78bfa',
              summary:
                "A model's output is a random variable over the input distribution. Know the distributions you'll encounter daily.",
              points: [
                { label: 'Normal N(μ,σ²)', detail: 'The most important distribution in ML. Weight initialisations, noise models, many statistical tests assume normality.' },
                { label: 'Bernoulli / Binomial', detail: 'Bernoulli: single binary trial (spam/not-spam). Binary classification output is Bernoulli.' },
                { label: 'Categorical (softmax output)', detail: 'Generalises Bernoulli to K classes. Softmax produces a categorical distribution. Cross-entropy is its negative log-likelihood.' },
                { label: 'Beta distribution', detail: 'Distribution over [0,1] — perfect for modelling confidence scores. Beta(a,b): a controls mass near 1, b near 0.' },
                { label: 'Expected value E[X]', detail: '`E[loss]` is what gradient descent minimises. `E[accuracy]` is what evaluation measures.' },
                { label: 'Variance σ²', detail: 'Spread. High variance predictions = uncertain model. The bias-variance tradeoff is literally about these two quantities.' },
              ],
              code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(42)
n = 1000

# Simulate CDDBS classifier confidence scores
y_true = (rng.random(n) < 0.15).astype(int)  # 15% disinfo

# Overconfident model — common failure mode
y_prob = np.where(
    y_true == 1,
    rng.beta(8, 2, n),   # confident on true positives
    rng.beta(1, 5, n),   # less confident on negatives
)

print(f"Mean confidence: {y_prob.mean():.3f}")
print(f"Std confidence:  {y_prob.std():.3f}")

# Calibration check: does 80% confidence = 80% accuracy?
for lo, hi in [(0.6, 0.7), (0.7, 0.8), (0.8, 0.9), (0.9, 1.0)]:
    mask = (y_prob >= lo) & (y_prob < hi)
    if mask.sum() > 0:
        actual = y_true[mask].mean()
        predicted = y_prob[mask].mean()
        print(f"Conf {lo:.1f}–{hi:.1f}: actual={actual:.3f} predicted={predicted:.3f} "
              f"gap={abs(actual-predicted):.3f}")`,
            },
            {
              title: "Bayes' Theorem",
              tag: 'Essential',
              tagColor: '#a78bfa',
              summary:
                "The most important formula in AI. P(hypothesis|evidence) = P(evidence|hypothesis) × P(hypothesis) / P(evidence). Every well-calibrated model's softmax output is a posterior.",
              points: [
                { label: 'P(A|B) = P(B|A)·P(A) / P(B)', detail: 'The fundamental update rule: posterior = likelihood × prior / evidence.' },
                { label: 'Prior P(A)', detail: 'Your belief before seeing data. L2 regularisation encodes a Gaussian prior on weights.' },
                { label: 'Likelihood P(B|A)', detail: 'How probable is the observed data given the hypothesis? This is what the model learns.' },
                { label: 'Posterior P(A|B)', detail: 'Updated belief after seeing data. A well-calibrated softmax output IS a posterior.' },
                { label: 'Naive Bayes', detail: 'Assumes feature independence given class. Fast, interpretable. Implementing from scratch forces you to apply Bayes in code.' },
              ],
              code: `import numpy as np
import math

# Bayesian spam classifier
p_spam = 0.3          # prior: 30% of emails are spam
p_bitcoin_spam = 0.8  # P("bitcoin" | spam)
p_bitcoin_ham = 0.05  # P("bitcoin" | not spam)

# P("bitcoin") = total probability
p_bitcoin = p_bitcoin_spam * p_spam + p_bitcoin_ham * (1 - p_spam)

# Posterior via Bayes' theorem
p_spam_given_bitcoin = (p_bitcoin_spam * p_spam) / p_bitcoin
print(f"P(spam | 'bitcoin') = {p_spam_given_bitcoin:.3f}")  # 0.821

# Naive Bayes text classifier (multi-class)
def naive_bayes_predict(
    doc: list[str],
    class_priors: dict[str, float],
    word_likelihoods: dict[str, dict[str, float]],
) -> str:
    scores = {}
    for cls, prior in class_priors.items():
        log_prob = math.log(prior)
        for word in doc:
            if word in word_likelihoods:
                prob = word_likelihoods[word].get(cls, 1e-10)
                log_prob += math.log(prob)
        scores[cls] = log_prob
    return max(scores, key=scores.__getitem__)

# Demo
priors = {"disinfo": 0.15, "legit": 0.85}
likelihoods = {
    "fabricated": {"disinfo": 0.7, "legit": 0.02},
    "confirmed": {"disinfo": 0.1, "legit": 0.6},
}
print(naive_bayes_predict(["fabricated"], priors, likelihoods))  # disinfo`,
            },
            {
              title: 'Hypothesis Testing for Fairness Audits',
              tag: 'AI Trust ★',
              tagColor: '#ff6b35',
              summary:
                'A/B tests on model versions, fairness audits (is error rate independent of demographic group?), and distribution shift detection all require hypothesis testing.',
              points: [
                { label: 'Null hypothesis H₀', detail: 'The default assumption (no effect). We test whether data gives sufficient evidence to reject it.' },
                { label: 'p-value', detail: 'Probability of observing results at least this extreme if H₀ is true. p < 0.05 is conventional threshold.' },
                { label: 'Type II error in safety', detail: 'False negative (accepting a false H₀). In safety testing: Type II errors are more dangerous than Type I — you fail to detect a real problem.' },
                { label: 'Chi-squared test', detail: 'Tests independence of categorical variables. "Is model error rate independent of demographic group?" — the core fairness audit.' },
                { label: 'KS test', detail: 'Kolmogorov-Smirnov: tests if two distributions are the same. Used for detecting data drift in production models.' },
                { label: 't-test', detail: 'Compare means of two groups. "Did model v2 perform significantly better than v1?" `scipy.stats.ttest_ind`.' },
              ],
              code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(42)

# A/B test: did model v2 improve?
v1_f1 = rng.normal(loc=0.78, scale=0.05, size=100)
v2_f1 = rng.normal(loc=0.82, scale=0.05, size=100)
t_stat, p_value = stats.ttest_ind(v1_f1, v2_f1)
print(f"t={t_stat:.3f}  p={p_value:.4f}")
print(f"v2 significantly better: {p_value < 0.05}")

# Fairness audit: is error rate independent of demographic group?
# Rows = group, columns = [correct, incorrect]
observed = np.array([
    [85, 15],   # Group A: 85% accuracy
    [70, 30],   # Group B: 70% accuracy — potential disparate impact
])
chi2, p, dof, expected = stats.chi2_contingency(observed)
print(f"\\nChi²={chi2:.3f}  p={p:.4f}")
print(f"Disparate impact detected: {p < 0.05}")

# Distribution shift detection — check if prod data drifted
prod_scores = rng.normal(0.75, 0.1, 500)   # baseline
new_scores  = rng.normal(0.65, 0.15, 500)  # possible shift
ks_stat, ks_p = stats.ks_2samp(prod_scores, new_scores)
print(f"\\nKS stat={ks_stat:.3f}  p={ks_p:.4f}")
print(f"Distribution shift detected: {ks_p < 0.05}")`,
            },
          ],
        },
        {
          id: 's03b',
          title: 'Information Theory',
          color: '#34d399',
          icon: '⬡',
          intro:
            'Entropy, cross-entropy, and KL divergence are the mathematical core of every modern loss function. Understanding them explains WHY cross-entropy is right for classification — not just that you call nn.CrossEntropyLoss().',
          topics: [
            {
              title: 'Entropy, Cross-Entropy & KL Divergence',
              tag: 'Essential',
              tagColor: '#a78bfa',
              summary:
                'These three quantities are the foundation of classification loss functions, knowledge distillation, and VAEs.',
              points: [
                { label: 'Entropy H(P)', detail: 'H(P) = -Σ p(x) log p(x). Measures uncertainty. Maximum for uniform distribution (most uncertain), zero for deterministic.' },
                { label: 'Cross-entropy H(P,Q)', detail: 'H(P,Q) = -Σ p(x) log q(x). THE loss function for classification. Minimising it maximises log-likelihood.' },
                { label: 'KL Divergence KL(P||Q)', detail: 'KL = H(P,Q) - H(P). Non-symmetric. "How different is Q from P?" Used in VAEs, knowledge distillation, RLHF.' },
                { label: 'Why cross-entropy for classification', detail: 'If P is the true label distribution (one-hot) and Q is the model output (softmax), then H(P,Q) = -log(q_true_class). Minimising this maximises confidence in the correct class.' },
              ],
              code: `import numpy as np

def entropy(p: np.ndarray) -> float:
    p = p[p > 0]
    return float(-np.sum(p * np.log2(p)))

def cross_entropy(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    eps = 1e-12
    return float(-np.sum(y_true * np.log(np.clip(y_pred, eps, 1))))

def kl_divergence(p: np.ndarray, q: np.ndarray) -> float:
    eps = 1e-12
    return float(np.sum(p * np.log((p + eps) / (q + eps))))

uniform  = np.array([0.25, 0.25, 0.25, 0.25])
certain  = np.array([1.0,  0.0,  0.0,  0.0])
model    = np.array([0.7,  0.1,  0.1,  0.1])
one_hot  = np.array([1.0,  0.0,  0.0,  0.0])

print(f"H(uniform) = {entropy(uniform):.3f} bits")   # 2.0 (max for 4 classes)
print(f"H(certain) = {entropy(certain):.3f} bits")    # 0.0

# Cross-entropy loss for a correct prediction with 70% confidence
ce = cross_entropy(one_hot, model)
print(f"CE loss (-log 0.7) = {ce:.4f}")  # ≈ 0.3567

# KL divergence
print(f"KL(true||model) = {kl_divergence(one_hot + 1e-9, model):.4f}")
# = CE - H(true) = 0.357 - 0 = 0.357 when true is one-hot`,
            },
          ],
        },
      ],
    },

    // ── STEP 04 ──────────────────────────────────────────────────────────────
    {
      id: '04',
      title: 'Linear Algebra for ML',
      duration: '3–4 weeks',
      tagline: 'Neural networks are function compositions. Functions on vectors are linear algebra.',
      color: '#00e5ff',
      why:
        'Every forward pass in a neural network is a sequence of matrix multiplications. Every attention mechanism is a dot-product operation. Every embedding space is a vector space. BitNet\'s efficiency claim — replacing float32 matmuls with INT8 additions — is a claim about matrix arithmetic. Understanding the shape algebra `(B, seq, d_k) @ (B, d_k, seq) → (B, seq, seq)` is the primary debugging skill when working with transformers. SVD and PCA let you visualise what your CDDBS model has learned by projecting 768-dimensional embeddings into 2D.',
      connections: [
        { label: '← 03', desc: 'Statistics — covariance matrix, PCA use both' },
        { label: '→ 14', desc: 'Neural Networks — forward pass = matrix multiply chain' },
        { label: '→ 15', desc: 'PyTorch — tensors are n-dimensional matrices' },
        { label: '→ 25', desc: 'Transformers — attention = scaled QKᵀV operations' },
        { label: '→ 26', desc: 'BitNet — ternary weight matrices, INT8 matmul efficiency' },
      ],
      sections: [
        {
          id: 's04a',
          title: 'Vectors, Matrices & Dot Products',
          color: '#00e5ff',
          icon: '◈',
          intro:
            'Get the geometric intuition first. A matrix is a transformation. A neural network layer applies a sequence of transformations. The dot product is the core operation of attention.',
          topics: [
            {
              title: 'Vectors, Dot Products & Cosine Similarity',
              tag: 'Essential',
              tagColor: '#00e5ff',
              summary:
                'The dot product is the workhorse of ML — it measures similarity and is the core op of every attention mechanism.',
              points: [
                { label: 'Vector', detail: 'Ordered list of numbers. An embedding is a vector in high-dimensional space. Similar meanings → similar vectors (small cosine distance).' },
                { label: 'Dot product a·b', detail: 'Σ aᵢbᵢ. Measures alignment. Attention scores are scaled dot products between query and key vectors.' },
                { label: 'L2 norm ‖x‖', detail: '√(Σ xᵢ²). Vector length. L2 regularisation penalises large norms. Gradient clipping clips the gradient norm.' },
                { label: 'Cosine similarity', detail: 'a·b / (‖a‖·‖b‖) ∈ [-1,1]. Direction similarity, magnitude-independent. How embedding similarity search works.' },
              ],
              code: `import numpy as np

# Embeddings as vectors — semantic similarity
word_a = np.array([0.2, 0.8, -0.3, 0.5])   # "king"
word_b = np.array([0.1, 0.7, -0.4, 0.6])   # "queen"
word_c = np.array([-0.9, 0.1, 0.8, -0.2])  # "car"

def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

print(f"king ~ queen: {cosine_sim(word_a, word_b):.3f}")  # high
print(f"king ~ car:   {cosine_sim(word_a, word_c):.3f}")  # low

# Scaled dot-product attention (the core of transformers)
rng = np.random.default_rng(42)
d_k = 64
Q = rng.standard_normal((8, d_k))   # 8 query tokens
K = rng.standard_normal((12, d_k))  # 12 key tokens
V = rng.standard_normal((12, d_k))  # 12 value vectors

# Attention scores: (8,64) @ (64,12) = (8,12)
scores = Q @ K.T / np.sqrt(d_k)
weights = np.exp(scores - scores.max(1, keepdims=True))
weights /= weights.sum(1, keepdims=True)  # softmax, shape (8,12)

# Weighted sum of values: (8,12) @ (12,64) = (8,64)
output = weights @ V
print(f"Attention output shape: {output.shape}")  # (8, 64)`,
            },
            {
              title: 'Matrix Multiply & Neural Network Forward Pass',
              tag: 'Essential',
              tagColor: '#00e5ff',
              summary:
                'A neural network layer is Wx + b. Understand matrix multiply, transpose, and batch dimensions from shape algebra.',
              points: [
                { label: 'Matrix multiply AB', detail: '(m×k) @ (k×n) → (m×n). The core operation of every neural network forward pass. O(mkn) — why GPU parallelism matters.' },
                { label: 'Transpose Aᵀ', detail: 'Rows become columns. QKᵀ in attention. Used differently in forward vs backward pass.' },
                { label: 'Batch matmul', detail: '(B,m,k) @ (B,k,n) → (B,m,n). How PyTorch processes batches of sequences simultaneously. Shape tracking is the primary debugging skill.' },
                { label: 'Forward pass = shape tracking', detail: 'Debug transformers by printing `.shape` at every layer. The shape algebra tells you exactly what each operation does.' },
              ],
              code: `import numpy as np

rng = np.random.default_rng(42)
B, input_dim, hidden_dim, output_dim = 32, 128, 64, 10

# Weight matrices
W1 = rng.standard_normal((input_dim, hidden_dim)) * 0.01
b1 = np.zeros(hidden_dim)
W2 = rng.standard_normal((hidden_dim, output_dim)) * 0.01
b2 = np.zeros(output_dim)

# Input batch
X = rng.standard_normal((B, input_dim))  # (32, 128)

# Forward pass — pure matrix algebra
h = np.maximum(0, X @ W1 + b1)   # (32,128)@(128,64) → (32,64) + ReLU
logits = h @ W2 + b2              # (32,64)@(64,10)  → (32,10)

# Softmax
exp_logits = np.exp(logits - logits.max(1, keepdims=True))  # numerically stable
probs = exp_logits / exp_logits.sum(1, keepdims=True)       # (32, 10)
print(f"Output shape: {probs.shape}")
print(f"Rows sum to 1: {probs.sum(1).round(6)[:3]}")

# Batch matmul: core transformer shape algebra
B, seq, d_k = 4, 10, 64
Q = rng.standard_normal((B, seq, d_k))
K = rng.standard_normal((B, seq, d_k))
scores = Q @ K.transpose(0, 2, 1)   # (4,10,64)@(4,64,10) → (4,10,10)
print(f"Batch attention shape: {scores.shape}")`,
            },
          ],
        },
        {
          id: 's04b',
          title: 'SVD, PCA & Eigenvalues',
          color: '#a78bfa',
          icon: '◇',
          intro:
            'PCA is SVD applied to the covariance matrix. Use it to visualise your 768-dim BERT embedding space in 2D and understand what your model has learned.',
          topics: [
            {
              title: 'PCA & Embedding Space Visualisation',
              tag: 'Essential',
              tagColor: '#a78bfa',
              summary:
                'PCA projects high-dimensional embedding spaces into 2D — the standard tool for understanding what your model encodes and detecting bias in representations.',
              points: [
                { label: 'Eigenvector / eigenvalue', detail: 'Av = λv. A vector that only scales under transformation A. Principal components are eigenvectors of the covariance matrix.' },
                { label: 'SVD: A = UΣVᵀ', detail: 'Every matrix decomposes into rotations and scaling. Truncate small singular values → compression, dimensionality reduction.' },
                { label: 'PCA from scratch', detail: 'Centre → covariance matrix → eigendecomposition → sort → project. Understanding each step lets you debug what sklearn.PCA is doing.' },
                { label: 'Explained variance', detail: 'eigenvalue / Σ eigenvalues. Tells you how much information each PC retains. Plot the curve to choose the right number of components.' },
              ],
              code: `import numpy as np

rng = np.random.default_rng(42)
n_samples, n_features = 200, 50
X = rng.standard_normal((n_samples, n_features))
X[:, 1] = X[:, 0] * 0.9 + rng.standard_normal(n_samples) * 0.1  # correlated

# Step 1: centre
X_c = X - X.mean(axis=0)

# Step 2: covariance matrix
cov = X_c.T @ X_c / (n_samples - 1)  # (50,50)

# Step 3: eigendecomposition
eigenvalues, eigenvectors = np.linalg.eigh(cov)

# Step 4: sort descending
idx = np.argsort(eigenvalues)[::-1]
eigenvalues, eigenvectors = eigenvalues[idx], eigenvectors[:, idx]

explained = eigenvalues / eigenvalues.sum()
print(f"PC1 explains {explained[0]:.1%}")
print(f"Top-2 explain {explained[:2].sum():.1%}")

# Project to 2D (same as sklearn PCA)
X_2d = X_c @ eigenvectors[:, :2]  # (200,50)@(50,2) → (200,2)
print(f"2D projection: {X_2d.shape}")

# SVD (numerically stable alternative)
U, S, Vt = np.linalg.svd(X_c, full_matrices=False)
X_2d_svd = X_c @ Vt[:2].T
print(f"SVD matches eig: {np.allclose(np.abs(X_2d), np.abs(X_2d_svd))}")`,
            },
          ],
        },
      ],
    },
    // ── STEP 05 ──────────────────────────────────────────────────────────────
    {
      id: '05',
      title: 'ML Fundamentals & Taxonomy',
      duration: '2–3 weeks',
      tagline: 'Know when each approach applies and why. API usage without this is cargo-cult ML.',
      color: '#34d399',
      why:
        'There are three fundamentally different learning paradigms. Choosing the wrong one is not a hyperparameter mistake — it is an architectural mistake. This step gives you the conceptual map. Every subsequent step is a deep-dive into a region of this map. Understanding the taxonomy also means knowing when you do NOT need a neural network — critical for AI trust systems where explainability often matters more than raw accuracy. Unsupervised clustering is a direct CDDBS tool for narrative-level disinformation analysis.',
      connections: [
        { label: '← 03/04', desc: 'Statistics + Linear Algebra — foundation of every algorithm' },
        { label: '→ 08', desc: 'Key ML Algorithms — classical methods in depth' },
        { label: '→ 09', desc: 'Ensemble Methods — Random Forest, XGBoost' },
        { label: '→ 13', desc: 'LIME/SHAP — interpretability of models learned here' },
      ],
      sections: [
        {
          id: 's05a',
          title: 'The Three Paradigms',
          color: '#34d399',
          icon: '◈',
          intro:
            'Every ML algorithm belongs to one of three paradigms. Know the paradigm before choosing the algorithm — wrong paradigm choice is an architectural error, not a tuning error.',
          topics: [
            {
              title: 'Supervised Learning',
              tag: 'Essential',
              tagColor: '#34d399',
              summary:
                'Learn a mapping from inputs to outputs using labelled examples. The dominant paradigm for CDDBS classification tasks.',
              points: [
                { label: 'Definition', detail: 'Given (X, y) pairs, learn f: X → y. Predict y for new X. Requires labelled data.' },
                { label: 'Classification', detail: 'y is discrete. Binary (disinfo/legit) or multiclass. Output: class probabilities from softmax.' },
                { label: 'Regression', detail: 'y is continuous. Predict credibility score. Loss: MSE, MAE, or Huber (robust to outliers).' },
                { label: 'Key algorithms', detail: 'Logistic regression, decision trees, SVMs, random forests, gradient boosting, neural networks.' },
                { label: 'When to use', detail: 'You have labelled training data and a well-defined input-output mapping. Most CDDBS classification tasks.' },
              ],
              code: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

X, y = make_classification(
    n_samples=1000, n_features=20, n_informative=10,
    n_classes=2, weights=[0.85, 0.15], random_state=42  # imbalanced: 15% disinfo
)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

train_acc = model.score(X_train, y_train)
test_acc  = model.score(X_test, y_test)
print(f"Train: {train_acc:.3f}  Test: {test_acc:.3f}  Gap: {train_acc-test_acc:.3f}")`,
            },
            {
              title: 'Unsupervised Learning',
              tag: 'Essential',
              tagColor: '#34d399',
              summary:
                'Find structure in unlabelled data. Used for disinformation narrative clustering, embedding visualisation, and anomaly detection in CDDBS.',
              points: [
                { label: 'Clustering', detail: 'Group similar data without labels. K-means, DBSCAN. Detect disinformation narrative clusters in a corpus without per-article labels.' },
                { label: 'Dimensionality reduction', detail: 'PCA, UMAP, t-SNE. Visualise 768-dim BERT embeddings in 2D. See what the model learned about your CDDBS corpus.' },
                { label: 'Anomaly detection', detail: 'Isolation Forest, One-class SVM. Detect unusual patterns without knowing what normal looks like.' },
                { label: 'When to use', detail: 'No labels, or too expensive to label. Exploration before supervised learning. Preprocessing for downstream tasks.' },
              ],
              code: `from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np

rng = np.random.default_rng(42)

# Simulated document embeddings (768-dim BERT → 50-dim for demo)
embeddings = np.vstack([
    rng.normal([2, 2], 0.5, (100, 50)),   # economic disinfo cluster
    rng.normal([-2, 2], 0.5, (100, 50)),  # health disinfo cluster
    rng.normal([0, -2], 0.5, (80, 50)),   # political disinfo cluster
    rng.normal([0, 0], 3.0, (20, 50)),    # noise / mixed
])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(embeddings)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)
print(f"Cluster sizes: {np.bincount(labels)}")

pca = PCA(n_components=2)
X_2d = pca.fit_transform(X_scaled)
print(f"2D projection explains {pca.explained_variance_ratio_.sum():.1%} variance")`,
            },
            {
              title: 'Bias-Variance Tradeoff',
              tag: 'Essential',
              tagColor: '#a78bfa',
              summary:
                'The single most important concept for understanding why models fail. Every regularisation technique is a tool for managing this tradeoff.',
              points: [
                { label: 'Bias', detail: 'Error from wrong assumptions (model too simple). High bias = underfitting. Linear model on non-linear data.' },
                { label: 'Variance', detail: 'Error from sensitivity to training data (model too complex). High variance = overfitting. Memorises training set.' },
                { label: 'Total error = Bias² + Variance + Noise', detail: 'You can reduce one by increasing the other. No free lunch — choose based on your data size and model capacity.' },
                { label: 'Overfitting symptoms', detail: 'Training accuracy >> test accuracy. Solution: regularisation, dropout, more data, simpler model.' },
                { label: 'Underfitting symptoms', detail: 'Training accuracy ≈ test accuracy, both low. Solution: more complex model, more features, fewer constraints.' },
              ],
              code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import Ridge
import numpy as np

rng = np.random.default_rng(42)
X = rng.uniform(-3, 3, 50).reshape(-1, 1)
y = np.sin(X.ravel()) + rng.normal(0, 0.3, 50)
X_train, X_test = X[:40], X[40:]
y_train, y_test = y[:40], y[40:]

for degree in [1, 3, 10, 20]:
    pipe = Pipeline([
        ("poly", PolynomialFeatures(degree)),
        ("ridge", Ridge(alpha=0.1)),
    ])
    pipe.fit(X_train, y_train)
    train_mse = ((pipe.predict(X_train) - y_train)**2).mean()
    test_mse  = ((pipe.predict(X_test)  - y_test)**2).mean()
    print(f"deg={degree:2d}  train={train_mse:.4f}  test={test_mse:.4f}  "
          f"gap={test_mse-train_mse:.4f}")
# deg= 1: train=0.24  test=0.28  gap=0.04  ← high bias (underfit)
# deg= 3: train=0.09  test=0.10  gap=0.01  ← sweet spot
# deg=20: train=0.01  test=4.21  gap=4.20  ← high variance (overfit)`,
            },
          ],
        },
      ],
    },

    // ── STEP 06 ──────────────────────────────────────────────────────────────
    {
      id: '06',
      title: 'Model Evaluation Metrics',
      duration: '1–2 weeks',
      tagline: 'A model with 99% accuracy can be completely useless. Metrics are where that sentence becomes clear.',
      color: '#fbbf24',
      why:
        'Metrics are the language in which model performance is communicated to stakeholders, clients, and regulators. Choosing the wrong metric is how disasters happen: a fraud detector optimised for accuracy on a 0.1% fraud dataset learns to always predict "not fraud." In AI trust work, you evaluate models for fairness, safety, and reliability — all requiring precise metric understanding. ECE (Expected Calibration Error) built here is the exact metric in your MP-B Calibration Auditor. AUC-PR (not AUC-ROC) is the metric to quote in CII meetings for the imbalanced CDDBS task.',
      connections: [
        { label: '← 03', desc: 'Statistics — all metrics are statistical estimators' },
        { label: '← 05', desc: 'ML Fundamentals — metrics evaluate the models learned there' },
        { label: '→ MP-B', desc: 'Calibration Auditor — ECE, reliability diagrams built here' },
        { label: '→ 31', desc: 'Calibration & Uncertainty — extends this step' },
        { label: '→ 33', desc: 'Fairness Auditing — per-group metric analysis' },
      ],
      sections: [
        {
          id: 's06a',
          title: 'Classification Metrics',
          color: '#fbbf24',
          icon: '◈',
          intro:
            'Every classification metric derives from the confusion matrix. Learn the matrix first — everything else follows from it.',
          topics: [
            {
              title: 'Confusion Matrix & Core Metrics',
              tag: 'Essential',
              tagColor: '#fbbf24',
              summary:
                'The confusion matrix is the ground truth of every classification metric. Accuracy is misleading on imbalanced data — always report precision, recall, and F-beta.',
              points: [
                { label: 'TP / TN / FP / FN', detail: 'True Positive (correct positive), True Negative (correct negative), False Positive (false alarm), False Negative (missed detection). FN = missed disinfo in CDDBS.' },
                { label: 'Accuracy', detail: '(TP+TN)/N. Useless on imbalanced data. 99% accuracy on 1% positive class = model always predicts negative.' },
                { label: 'Precision', detail: 'TP/(TP+FP). Of predicted positives, how many are actually positive? High precision = few false alarms.' },
                { label: 'Recall (Sensitivity)', detail: 'TP/(TP+FN). Of actual positives, how many did we catch? High recall = few missed detections. Critical for disinfo.' },
                { label: 'F-beta', detail: 'Fβ = (1+β²)×(P×R)/((β²×P)+R). β>1 weights recall higher. In disinfo detection, FN cost > FP cost → β=2 appropriate.' },
              ],
              code: `from sklearn.metrics import classification_report, roc_auc_score, f1_score
import numpy as np

rng = np.random.default_rng(42)
n = 1000
y_true = (rng.random(n) < 0.05).astype(int)  # 5% disinfo — highly imbalanced

y_prob = np.where(y_true == 1,
    rng.uniform(0.4, 0.95, n),  # model gives higher scores to true positives
    rng.uniform(0.01, 0.6, n),
)
y_pred = (y_prob >= 0.5).astype(int)

print(classification_report(y_true, y_pred, target_names=["legit", "disinfo"]))

acc = (y_pred == y_true).mean()
print(f"Accuracy: {acc:.3f}  ← misleadingly high on 5% positive class")
print(f"AUC-ROC:  {roc_auc_score(y_true, y_prob):.3f}")

# F2: weights recall twice as much as precision
from sklearn.metrics import fbeta_score
f2 = fbeta_score(y_true, y_pred, beta=2, zero_division=0)
print(f"F2 score: {f2:.3f}  ← more appropriate for disinfo detection")`,
            },
            {
              title: 'AUC-ROC vs AUC-PR & Calibration',
              tag: 'AI Trust ★',
              tagColor: '#ff6b35',
              summary:
                'AUC-PR is more informative than AUC-ROC for imbalanced problems. ECE measures whether model probabilities can be trusted — the core of MP-B.',
              points: [
                { label: 'ROC curve', detail: 'Plots TPR vs FPR at all thresholds. Area = P(positive ranked higher than negative). Threshold-independent.' },
                { label: 'AUC-PR (Precision-Recall)', detail: 'Better than ROC for imbalanced data. For 5% disinfo rate, AUC-PR is the metric to quote at CII — AUC-ROC is overly optimistic.' },
                { label: 'Average Precision (AP)', detail: 'Area under PR curve. `sklearn.metrics.average_precision_score`. This is the metric you report for CDDBS triage.' },
                { label: 'Expected Calibration Error (ECE)', detail: 'ECE = Σ (|B|/n) × |acc(B) - conf(B)|. Measures if 80% confidence = 80% accuracy. The MP-B metric.' },
                { label: 'Temperature scaling', detail: 'Post-hoc calibration: divide logits by T>1 to soften overconfident probabilities. Simplest calibration fix.' },
              ],
              code: `import numpy as np
from sklearn.metrics import average_precision_score, roc_auc_score

def expected_calibration_error(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    n_bins: int = 10,
) -> float:
    """ECE — the core metric of MP-B Calibration Auditor."""
    bins = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    n = len(y_true)
    for lo, hi in zip(bins[:-1], bins[1:]):
        mask = (y_prob >= lo) & (y_prob < hi)
        if mask.sum() == 0:
            continue
        ece += (mask.sum() / n) * abs(y_true[mask].mean() - y_prob[mask].mean())
    return ece

rng = np.random.default_rng(42)
n = 500
y_true = (rng.random(n) < 0.15).astype(int)

# Overconfident model
overconf = np.clip(y_true * 0.4 + rng.normal(0.7, 0.15, n), 0, 1)
# Better calibrated model
wellcal  = rng.beta(np.where(y_true==1, 5, 1), np.where(y_true==1, 1, 5), n)

print(f"AUC-ROC  (overconf): {roc_auc_score(y_true, overconf):.3f}")
print(f"AUC-PR   (overconf): {average_precision_score(y_true, overconf):.3f}")
print(f"ECE      (overconf): {expected_calibration_error(y_true, overconf):.4f}")
print(f"ECE      (wellcal):  {expected_calibration_error(y_true, wellcal):.4f}")

# Temperature scaling
logits = np.log(np.clip(overconf, 1e-9, 1-1e-9) / (1 - np.clip(overconf, 1e-9, 1-1e-9)))
for T in [1.0, 1.5, 2.0]:
    scaled = 1 / (1 + np.exp(-logits / T))
    print(f"T={T:.1f}  ECE={expected_calibration_error(y_true, scaled):.4f}")`,
            },
            {
              title: 'Cross-Validation',
              tag: 'Essential',
              tagColor: '#34d399',
              summary:
                'A single train/test split is a single noisy estimate. Stratified k-fold gives you a distribution of estimates — the only correct approach for imbalanced classification.',
              points: [
                { label: 'Stratified k-Fold', detail: 'Preserves class proportions in each fold. Always use for imbalanced classification (CDDBS: 5% disinfo). k=5 is the standard.' },
                { label: 'cross_validate', detail: 'Returns train AND test scores per fold — you can detect overfitting from the fold results alone.' },
                { label: 'Time-Series split', detail: 'Never shuffle time data. Use TimeSeriesSplit. Future cannot train on the past — critical if CDDBS processes sequential news.' },
                { label: 'Nested CV', detail: 'Outer loop for evaluation, inner loop for hyperparameter search. The only way to get unbiased performance estimates when also tuning.' },
              ],
              code: `from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
import numpy as np

X, y = make_classification(n_samples=500, n_features=20,
                            weights=[0.9, 0.1], random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

results = cross_validate(
    model, X, y, cv=cv,
    scoring=["f1", "roc_auc", "average_precision"],
    return_train_score=True,
)
for metric in ["f1", "roc_auc", "average_precision"]:
    test  = results[f"test_{metric}"]
    train = results[f"train_{metric}"]
    print(f"{metric:20s}: test={test.mean():.3f}±{test.std():.3f}  "
          f"train={train.mean():.3f}  "
          f"overfit={train.mean()-test.mean():.3f}")`,
            },
          ],
        },
      ],
    },

    // ── STEP 07 ──────────────────────────────────────────────────────────────
    {
      id: '07',
      title: 'Training vs Testing vs Overfitting',
      duration: '1–2 weeks',
      tagline: 'The train/test split is a contract. Break it once and all your metrics are lies.',
      color: '#ff6b35',
      why:
        'Data leakage is the most common source of falsely optimistic results in ML research. A model evaluation that leaked information is not just wrong — it is an audit failure, and the models it produced cannot be trusted. Understanding the information boundary between training and evaluation is an integrity property, not a technical detail. As an AI trust practitioner, you will be asked to audit reported model performance — leakage detection is a professional skill required by EU AI Act Article 15 (accuracy requirements for high-risk systems).',
      connections: [
        { label: '← 05/06', desc: 'ML Fundamentals + Metrics — this step validates them' },
        { label: '→ 08', desc: 'ML Algorithms — proper evaluation of each' },
        { label: '→ 41', desc: 'MLOps — production monitoring extends this thinking' },
        { label: '→ EU AI Act', desc: 'Art. 15 accuracy requirements — leakage = untrustworthy reported accuracy' },
      ],
      sections: [
        {
          id: 's07a',
          title: 'The Data Split Framework',
          color: '#ff6b35',
          icon: '◈',
          intro:
            'Every dataset has at most three roles: training, validation, and testing. Confusing these roles does not just produce wrong numbers — it produces unauditable models.',
          topics: [
            {
              title: 'Train / Validation / Test',
              tag: 'Essential',
              tagColor: '#ff6b35',
              summary:
                'Three datasets, three purposes. Evaluating the test set more than once makes it a validation set — and your final number is no longer trustworthy.',
              points: [
                { label: 'Training set', detail: 'Model sees and learns from this directly. Typically 60–80% of data.' },
                { label: 'Validation set', detail: 'Used to tune hyperparameters and make modelling decisions. Model does NOT train on this, but you DO use it to make choices. Typically 10–20%.' },
                { label: 'Test set', detail: 'Evaluated ONCE at the very end. If you evaluate multiple times and keep the best result, it is validation — your final number is inflated.' },
                { label: 'Pipeline prevents leakage', detail: "sklearn Pipeline fits preprocessing ONLY on training data and applies the fitted transform to val/test. The most important scikit-learn pattern." },
              ],
              code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=20, random_state=42)

# Split FIRST — then fit preprocessing only on train
X_trainval, X_test, y_trainval, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
X_train, X_val, y_train, y_val = train_test_split(
    X_trainval, y_trainval, test_size=0.25, random_state=42, stratify=y_trainval)

# Pipeline: scaler is fit ONLY on X_train, transform applied to val/test
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression()),
])
pipe.fit(X_train, y_train)

print(f"Train: {pipe.score(X_train, y_train):.3f}")
print(f"Val:   {pipe.score(X_val, y_val):.3f}")
print(f"Test:  {pipe.score(X_test, y_test):.3f}  ← evaluated ONCE, final honest number")`,
            },
            {
              title: 'Data Leakage — The Silent Killer',
              tag: 'AI Trust ★',
              tagColor: '#ff6b35',
              summary:
                'Leakage produces models that look excellent but fail in production. It is the most common cause of inflated ML benchmark results — and a core skill for AI auditors.',
              points: [
                { label: 'Normalisation leakage', detail: 'Computing mean/std on the entire dataset before splitting. Test statistics contaminate training. Always fit scaler ONLY on train.' },
                { label: 'Target leakage', detail: 'A feature contains information about the target unavailable at prediction time. e.g. "days to recovery" predicting "patient recovered".' },
                { label: 'Temporal leakage', detail: 'Using future data to predict the past. Always split time-series chronologically, never randomly.' },
                { label: 'Duplicate leakage', detail: 'Same sample in train and test. Near-duplicates in NLP corpora. Always deduplicate before splitting.' },
                { label: 'Preprocessing leakage', detail: 'Fitting PCA, feature selection, or imputation on the full dataset before splitting. Use Pipelines to prevent.' },
                { label: 'Multiple test evaluations', detail: 'Evaluating test set, adjusting model, re-evaluating. The test set becomes validation. EU AI Act: reported accuracy must be from a single held-out evaluation.' },
              ],
              code: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(42)
X = rng.standard_normal((1000, 20))
y = (X[:, 0] + rng.standard_normal(1000) > 0).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ❌ WRONG: scaler sees test data → leakage
scaler_leaky = StandardScaler()
X_all_scaled = scaler_leaky.fit_transform(X)  # ← fits on ALL data including test
X_tr_leaky, X_te_leaky = X_all_scaled[:800], X_all_scaled[800:]
clf_leaky = LogisticRegression().fit(X_tr_leaky, y_train)
leaky_score = clf_leaky.score(X_te_leaky, y_test)

# ✅ CORRECT: scaler fits on train only
scaler_clean = StandardScaler()
X_tr_clean = scaler_clean.fit_transform(X_train)   # fit on train only
X_te_clean = scaler_clean.transform(X_test)         # transform only
clf_clean = LogisticRegression().fit(X_tr_clean, y_train)
clean_score = clf_clean.score(X_te_clean, y_test)

print(f"Leaky score:  {leaky_score:.4f}  ← inflated, dishonest")
print(f"Clean score:  {clean_score:.4f}  ← honest")
print(f"Inflation:    {leaky_score - clean_score:.4f}")
# Even a tiny normalisation leak inflates results`,
            },
            {
              title: 'Regularisation in Depth',
              tag: 'Essential',
              tagColor: '#a78bfa',
              summary:
                'Every regularisation technique is a specific way of managing the bias-variance tradeoff. Understand the mechanism — not just the hyperparameter name.',
              points: [
                { label: 'L2 / Ridge / weight decay', detail: 'Adds λ‖w‖² to loss. Penalises large weights. Equivalent to Gaussian prior. Shrinks all weights toward zero. Standard in neural network training.' },
                { label: 'L1 / Lasso', detail: 'Adds λ‖w‖₁. Produces sparse solutions (exact zeros). Built-in feature selection. Equivalent to Laplace prior.' },
                { label: 'Elastic Net', detail: 'L1 + L2 combined. Sparsity + stability. Controls ratio via l1_ratio parameter.' },
                { label: 'Dropout', detail: 'During training, randomly zero p fraction of neurons. Forces redundant representations. Equivalent to model averaging at inference.' },
                { label: 'Early stopping', detail: 'Monitor validation loss; stop when it starts increasing. The simplest regulariser. Requires a validation set — another reason the 3-way split matters.' },
              ],
              code: `from sklearn.linear_model import Ridge, Lasso
from sklearn.model_selection import cross_val_score
import numpy as np

rng = np.random.default_rng(42)
n, p = 200, 100  # many features, only 10 are informative

w_true = np.zeros(p)
w_true[:10] = rng.normal(0, 2, 10)  # only first 10 features matter
X = rng.standard_normal((n, p))
y = X @ w_true + rng.normal(0, 1, n)

for name, model in [
    ("Ridge (L2)",  Ridge(alpha=1.0)),
    ("Lasso (L1)",  Lasso(alpha=0.1, max_iter=5000)),
]:
    scores = cross_val_score(model, X, y, cv=5, scoring="r2")
    model.fit(X, y)
    n_zero = (np.abs(model.coef_) < 1e-6).sum()
    print(f"{name:14s}: R²={scores.mean():.3f}±{scores.std():.3f}  "
          f"zero_coefs={n_zero}/{p}")

# Ridge: keeps all 100 features (small but non-zero)
# Lasso: zeros out ~85-90 irrelevant features ← feature selection!
# For an explainable CDDBS model, Lasso-selected features are more auditable`,
            },
          ],
        },
      ],
    },
  ],
} satisfies LearnPhase;
