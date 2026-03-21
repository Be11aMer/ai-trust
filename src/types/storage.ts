import type { StepId } from './learning';

/** Map from step id to completion boolean. */
export type ProgressMap = Record<StepId, boolean>;

/** Map from step id to user-written note text. */
export type NotesMap = Record<StepId, string>;

/** Map from step id to list of artifact/resource URLs. */
export type LinksMap = Record<StepId, string[]>;

/** The full shape of persisted storage data. */
export interface PersistedState {
  progress: ProgressMap;
  notes: NotesMap;
  links: LinksMap;
}
