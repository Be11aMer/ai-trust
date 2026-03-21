import type { IStorageService } from './IStorageService';

/**
 * Production storage implementation backed by `localStorage`.
 * All errors (e.g. quota exceeded, private browsing) are swallowed gracefully.
 *
 * @example
 * const storage = new LocalStorageService();
 * storage.set('my-key', JSON.stringify(data));
 * const raw = storage.get('my-key');
 */
export class LocalStorageService implements IStorageService {
  /**
   * Retrieve a serialised value from localStorage.
   * @returns The stored string or null if the key is absent.
   */
  public get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * Persist a string value in localStorage.
   * Silently swallows quota or security errors.
   */
  public set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // quota exceeded or private browsing — silently ignore
    }
  }

  /**
   * Remove a key from localStorage.
   */
  public delete(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // silently ignore
    }
  }
}
