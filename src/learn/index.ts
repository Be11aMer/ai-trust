/**
 * Phase registry — maps phase IDs to their content via dynamic import.
 *
 * Add a new entry here when a new phase content file is ready.
 * All imports are lazy so only the active phase is loaded.
 */
import type { LearnPhase } from './types';

export type { LearnPhase };

// ─── Phase metadata (no content — used for navigation before content loads) ──
export interface PhaseEntry {
  id: string;
  title: string;
  stepRange: string;
  color: string;
  available: boolean;
  load: () => Promise<{ default: LearnPhase }>;
}

export const PHASE_REGISTRY: PhaseEntry[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    stepRange: '01–07',
    color: '#38bdf8',
    available: true,
    load: () => import('./content/foundation').then((m) => ({ default: m.foundationPhase })),
  },
  {
    id: 'classical-ml',
    title: 'Classical ML',
    stepRange: '08–13',
    color: '#34d399',
    available: false,
    load: () => Promise.reject(new Error('classical-ml not yet available')),
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    stepRange: '14–20',
    color: '#00e5ff',
    available: false,
    load: () => Promise.reject(new Error('deep-learning not yet available')),
  },
  {
    id: 'nlp-llms',
    title: 'NLP & LLMs',
    stepRange: '21–28',
    color: '#f472b6',
    available: false,
    load: () => Promise.reject(new Error('nlp-llms not yet available')),
  },
  {
    id: 'ai-trust-core',
    title: 'AI Trust Core',
    stepRange: '29–35',
    color: '#ff6b35',
    available: false,
    load: () => Promise.reject(new Error('ai-trust-core not yet available')),
  },
  {
    id: 'mlops-infra',
    title: 'MLOps & Infra',
    stepRange: '36–43',
    color: '#fbbf24',
    available: false,
    load: () => Promise.reject(new Error('mlops-infra not yet available')),
  },
  {
    id: 'advanced',
    title: 'Advanced & Research',
    stepRange: '44–50',
    color: '#a78bfa',
    available: false,
    load: () => Promise.reject(new Error('advanced not yet available')),
  },
];
