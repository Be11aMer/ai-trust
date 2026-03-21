/**
 * Design tokens — colour palette referenced throughout the application.
 * All colors use the same values as the CSS custom properties in tokens.css.
 */
export const C = {
  bg: '#060810',
  surface: '#0d1117',
  surfaceHi: '#111820',
  border: '#1a2030',
  cyan: '#00e5ff',
  orange: '#ff6b35',
  violet: '#a78bfa',
  green: '#34d399',
  pink: '#f472b6',
  yellow: '#fbbf24',
  lime: '#86efac',
  sky: '#38bdf8',
  red: '#f87171',
  text: '#e2e8f0',
  muted: '#64748b',
  dim: '#1e2a38',
} as const;

/** Per-phase accent colors keyed by phase id. */
export const PHASE_COLORS = {
  foundation: C.sky,
  classical_ml: C.violet,
  deep_learning: C.cyan,
  nlp: C.green,
  ai_trust: C.orange,
  infra: C.yellow,
  advanced: C.lime,
} as const;

/** Human-readable labels for each phase. */
export const PHASE_LABELS: Record<string, string> = {
  foundation: 'Foundation',
  classical_ml: 'Classical ML',
  deep_learning: 'Deep Learning',
  nlp: 'NLP & LLMs',
  ai_trust: 'AI Trust Core',
  infra: 'MLOps & Infra',
  advanced: 'Advanced',
};

/** Tag-to-colour mapping. Tags ending with ★ are trust-critical. */
export const TAG_COLORS: Record<string, string> = {
  Python: C.sky,
  CS: C.sky,
  Math: C.violet,
  ML: C.cyan,
  DL: C.cyan,
  CV: C.lime,
  NLP: C.green,
  LLM: C.green,
  'LLM ★': C.orange,
  GenAI: C.pink,
  Data: C.muted,
  Project: C.yellow,
  'Trust ★': C.orange,
  'Ethics ★': C.red,
  'Regulation ★': C.red,
  'Safety ★': C.red,
  'Edge ★': C.lime,
  'MLOps ★': C.yellow,
  Cloud: C.sky,
  Infra: C.sky,
  RL: C.violet,
  'Research ★': C.cyan,
  Domain: C.muted,
  'Community ★': C.green,
};
