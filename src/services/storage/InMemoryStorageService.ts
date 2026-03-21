import type { IStorageService } from './IStorageService';

/**
 * In-memory storage implementation for use in tests.
 * Drop-in replacement for LocalStorageService — satisfies LSP.
 *
 * @example
 * const storage = new InMemoryStorageService();
 * storage.set('key', 'value');
 * expect(storage.get('key')).toBe('value');
 */
export class InMemoryStorageService implements IStorageService {
  private readonly store = new Map<string, string>();

  /** @inheritdoc */
  public get(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  /** @inheritdoc */
  public set(key: string, value: string): void {
    this.store.set(key, value);
  }

  /** @inheritdoc */
  public delete(key: string): void {
    this.store.delete(key);
  }

  /** Clear all stored values — useful in test beforeEach hooks. */
  public clear(): void {
    this.store.clear();
  }
}
