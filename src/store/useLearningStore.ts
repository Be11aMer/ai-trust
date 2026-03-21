import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';

import type { IStorageService } from '@/services/storage';
import type { ProgressMap, NotesMap, LinksMap, PersistedState, StepId } from '@/types';

/** Storage key — unchanged from prototype to preserve existing user data. */
const STORE_KEY = 'ai-trust-unified-v1';

/**
 * Full shape of the learning store — state + actions.
 * All actions are synchronous; persistence is handled as a side-effect.
 */
export interface LearningStore {
  /** Whether initial hydration from storage has completed. */
  loaded: boolean;
  /** Map of step id → completion status. */
  progress: ProgressMap;
  /** Map of step id → user-written note text. */
  notes: NotesMap;
  /** Map of step id → list of artifact/resource URLs. */
  links: LinksMap;

  /** Toggle completion state of a step. */
  toggleDone(id: StepId): void;
  /** Persist note text for a step. */
  saveNote(id: StepId, text: string): void;
  /** Add a URL to a step's artifact list (deduplicates, trims whitespace). */
  addLink(id: StepId, url: string): void;
  /** Remove a specific URL from a step's artifact list. */
  removeLink(id: StepId, url: string): void;
  /** Hydrate state from storage. Called once at app startup. */
  hydrate(storage: IStorageService): Promise<void>;
}

/**
 * Factory function creating the Zustand store with an injected storage service.
 * Composing the concrete storage in `main.tsx` (the composition root).
 *
 * @param storage - An IStorageService implementation (production or in-memory).
 * @returns A Zustand store bound to the provided storage.
 */
export function createLearningStore(storage: IStorageService): UseBoundStore<StoreApi<LearningStore>> {
  const persist = (state: Pick<LearningStore, 'progress' | 'notes' | 'links'>): void => {
    const data: PersistedState = {
      progress: state.progress,
      notes: state.notes,
      links: state.links,
    };
    storage.set(STORE_KEY, JSON.stringify(data));
  };

  return create<LearningStore>((set, get) => ({
    loaded: false,
    progress: {},
    notes: {},
    links: {},

    toggleDone(id: StepId): void {
      const { progress, notes, links } = get();
      const next = { ...progress, [id]: !progress[id] };
      set({ progress: next });
      persist({ progress: next, notes, links });
    },

    saveNote(id: StepId, text: string): void {
      const { progress, notes, links } = get();
      const next = { ...notes, [id]: text };
      set({ notes: next });
      persist({ progress, notes: next, links });
    },

    addLink(id: StepId, url: string): void {
      const trimmed = url.trim();
      if (!trimmed) return;
      const { progress, notes, links } = get();
      const prev = links[id] ?? [];
      if (prev.includes(trimmed)) return;
      const next = { ...links, [id]: [...prev, trimmed] };
      set({ links: next });
      persist({ progress, notes, links: next });
    },

    removeLink(id: StepId, url: string): void {
      const { progress, notes, links } = get();
      const next = { ...links, [id]: (links[id] ?? []).filter((l) => l !== url) };
      set({ links: next });
      persist({ progress, notes, links: next });
    },

    async hydrate(storageService: IStorageService): Promise<void> {
      try {
        const raw = storageService.get(STORE_KEY);
        if (raw) {
          const { progress = {}, notes = {}, links = {} } = JSON.parse(raw) as Partial<PersistedState>;
          set({ progress, notes, links, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
  }));
}
