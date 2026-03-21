import { InMemoryStorageService } from '@/services/storage/InMemoryStorageService';

/**
 * Factory for fresh in-memory storage instances.
 * Use in beforeEach to guarantee isolation between tests.
 */
export function createTestStorage(): InMemoryStorageService {
  return new InMemoryStorageService();
}
