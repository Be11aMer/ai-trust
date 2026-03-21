import { describe, it, expect, beforeEach } from 'vitest';

import { InMemoryStorageService } from '@/services/storage/InMemoryStorageService';
import { createLearningStore } from '@/store/useLearningStore';
import type { LearningStore } from '@/store/useLearningStore';

const STORE_KEY = 'ai-trust-unified-v1';

function createStore() {
  const storage = new InMemoryStorageService();
  const useStore = createLearningStore(storage);
  const store = useStore.getState() as LearningStore;
  return { storage, useStore, store };
}

type StoreContext = ReturnType<typeof createStore>;

describe('useLearningStore', () => {
  let ctx: StoreContext;

  beforeEach(() => {
    ctx = createStore();
  });

  describe('toggleDone', () => {
    it('marks undone step as done', () => {
      ctx.store.toggleDone(1);
      const state = ctx.useStore.getState() as LearningStore;
      expect(state.progress[1]).toBe(true);
    });

    it('marks done step as undone', () => {
      ctx.store.toggleDone(1);
      (ctx.useStore.getState() as LearningStore).toggleDone(1);
      expect((ctx.useStore.getState() as LearningStore).progress[1]).toBe(false);
    });
  });

  describe('saveNote', () => {
    it('persists note for given step id', () => {
      ctx.store.saveNote(5, 'My note');
      expect((ctx.useStore.getState() as LearningStore).notes[5]).toBe('My note');
    });
  });

  describe('addLink', () => {
    it('appends link to step', () => {
      ctx.store.addLink(3, 'https://example.com');
      expect((ctx.useStore.getState() as LearningStore).links[3]).toContain('https://example.com');
    });

    it('deduplicates links', () => {
      ctx.store.addLink(3, 'https://example.com');
      (ctx.useStore.getState() as LearningStore).addLink(3, 'https://example.com');
      expect((ctx.useStore.getState() as LearningStore).links[3]).toHaveLength(1);
    });

    it('trims whitespace before adding', () => {
      ctx.store.addLink(3, '  https://example.com  ');
      expect((ctx.useStore.getState() as LearningStore).links[3]).toContain('https://example.com');
    });

    it('ignores empty strings', () => {
      ctx.store.addLink(3, '   ');
      expect((ctx.useStore.getState() as LearningStore).links[3]).toBeUndefined();
    });
  });

  describe('removeLink', () => {
    it('removes specific link, leaves others intact', () => {
      ctx.store.addLink(3, 'https://a.com');
      (ctx.useStore.getState() as LearningStore).addLink(3, 'https://b.com');
      (ctx.useStore.getState() as LearningStore).removeLink(3, 'https://a.com');
      expect((ctx.useStore.getState() as LearningStore).links[3]).not.toContain('https://a.com');
      expect((ctx.useStore.getState() as LearningStore).links[3]).toContain('https://b.com');
    });
  });

  describe('state persistence', () => {
    it('persists to storage after toggleDone', () => {
      ctx.store.toggleDone(1);
      const raw = ctx.storage.get(STORE_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!) as { progress: Record<number, boolean> };
      expect(parsed.progress[1]).toBe(true);
    });

    it('rehydrates from storage on init', async () => {
      const storage = new InMemoryStorageService();
      storage.set(STORE_KEY, JSON.stringify({ progress: { 2: true }, notes: {}, links: {} }));
      const useStore2 = createLearningStore(storage);
      await (useStore2.getState() as LearningStore).hydrate(storage);
      expect((useStore2.getState() as LearningStore).progress[2]).toBe(true);
    });
  });

  describe('storage failure', () => {
    it('initialises with empty state if storage throws', async () => {
      const badStorage = {
        get: (): string | null => { throw new Error('storage error'); },
        set: (): void => undefined,
        delete: (): void => undefined,
      };
      const useStore3 = createLearningStore(badStorage);
      await (useStore3.getState() as LearningStore).hydrate(badStorage);
      expect((useStore3.getState() as LearningStore).progress).toEqual({});
      expect((useStore3.getState() as LearningStore).loaded).toBe(true);
    });
  });
});
