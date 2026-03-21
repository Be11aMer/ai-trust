import { describe, it, expect, beforeEach } from 'vitest';

import { InMemoryStorageService } from '@/services/storage/InMemoryStorageService';
import { LocalStorageService } from '@/services/storage/LocalStorageService';

describe('InMemoryStorageService (as LocalStorageService substitute)', () => {
  let storage: InMemoryStorageService;

  beforeEach(() => {
    storage = new InMemoryStorageService();
  });

  it('get returns null for missing key', () => {
    expect(storage.get('nonexistent')).toBeNull();
  });

  it('set persists value, get retrieves it', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toBe('value');
  });

  it('set then get round-trip with JSON payload', () => {
    const payload = { progress: { 1: true }, notes: {}, links: {} };
    storage.set('test', JSON.stringify(payload));
    const raw = storage.get('test');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as { progress: Record<number, boolean> };
    expect(parsed.progress[1]).toBe(true);
  });

  it('delete removes key', () => {
    storage.set('key', 'value');
    storage.delete('key');
    expect(storage.get('key')).toBeNull();
  });

  it('clear removes all keys', () => {
    storage.set('a', '1');
    storage.set('b', '2');
    storage.clear();
    expect(storage.get('a')).toBeNull();
    expect(storage.get('b')).toBeNull();
  });
});

describe('LocalStorageService', () => {
  it('get returns null for missing key', () => {
    const svc = new LocalStorageService();
    expect(svc.get('nonexistent-key-xyz')).toBeNull();
  });

  it('set then get round-trip', () => {
    const svc = new LocalStorageService();
    svc.set('test-key', 'test-value');
    expect(svc.get('test-key')).toBe('test-value');
    svc.delete('test-key');
  });

  it('set then delete removes key', () => {
    const svc = new LocalStorageService();
    svc.set('del-key', 'val');
    svc.delete('del-key');
    expect(svc.get('del-key')).toBeNull();
  });

  it('handles localStorage.setItem throwing gracefully', () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('QuotaExceededError'); };
    const svc = new LocalStorageService();
    expect(() => svc.set('x', 'y')).not.toThrow();
    Storage.prototype.setItem = orig;
  });
});
