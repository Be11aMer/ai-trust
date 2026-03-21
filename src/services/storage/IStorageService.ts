/**
 * Read-only storage contract.
 * Consumers that only need to fetch values depend on this interface.
 */
export interface IReadableStorage {
  /** Retrieve a value by key. Returns null if the key does not exist. */
  get(key: string): string | null;
}

/**
 * Write-only storage contract.
 * Consumers that only need to persist values depend on this interface.
 */
export interface IWritableStorage {
  /** Persist a string value under the given key. */
  set(key: string, value: string): void;
}

/**
 * Deletion storage contract.
 * Consumers that only need to remove values depend on this interface.
 */
export interface IDeletableStorage {
  /** Remove a key and its associated value. */
  delete(key: string): void;
}

/**
 * Full storage service — composes all three granular interfaces.
 * Pass this to production code; in tests use InMemoryStorageService.
 */
export interface IStorageService extends IReadableStorage, IWritableStorage, IDeletableStorage {}
