/** Unique identifier for a learning step (1–50). */
export type StepId = number;

/** Phase identifiers — one per section of the learning path. */
export type PhaseId =
  | 'foundation'
  | 'classical_ml'
  | 'deep_learning'
  | 'nlp'
  | 'ai_trust'
  | 'infra'
  | 'advanced';

/**
 * Filter modes for the path view.
 * - `all`   — show every step
 * - `trust` — show only trust-★ tagged steps
 * - `todo`  — show only incomplete steps
 * - `done`  — show only completed steps
 */
export type FilterMode = 'all' | 'trust' | 'todo' | 'done';

/**
 * Active view in the top-level router.
 * - `path`  — the structured list view
 * - `graph` — the force-directed knowledge graph
 */
export type ViewMode = 'path' | 'graph';

/**
 * Filter modes for the graph view.
 * - `all`    — all nodes visible
 * - `trust`  — trust-★ nodes only
 * - `done`   — completed nodes only
 * - `active` — incomplete nodes where at least one prereq is done ("unlocked")
 */
export type GraphFilterMode = 'all' | 'trust' | 'done' | 'active';

/**
 * A single learning step — discriminated by its `origin` field.
 * This union lets TypeScript distinguish original curriculum entries
 * from steps that were added or repositioned specifically for the AI Trust path.
 */
export type Step =
  | {
      id: StepId;
      title: string;
      short: string;
      tag: string;
      desc: string;
      origin: 'original';
      note?: undefined;
    }
  | {
      id: StepId;
      title: string;
      short: string;
      tag: string;
      desc: string;
      origin: 'added';
      note: string;
    }
  | {
      id: StepId;
      title: string;
      short: string;
      tag: string;
      desc: string;
      origin: 'moved-earlier';
      note: string;
    };

/** A step enriched with the phase context it belongs to. */
export type EnrichedStep = Step & {
  phaseId: PhaseId;
  phaseColor: string;
  phaseLabel: string;
};

/** A single learning phase containing its steps. */
export interface Phase {
  id: PhaseId;
  label: string;
  color: string;
  icon: string;
  desc: string;
  steps: Step[];
}
