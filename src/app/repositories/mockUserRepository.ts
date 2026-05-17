import { STORAGE_KEYS } from '../constants';
import type { User } from '../types';
import { readStorage, removeStorage, writeStorage } from '../services/localStorageClient';
import type { UserRepository } from './repositoryTypes';

export const mockUserRepository: UserRepository = {
  async getCurrentUser() {
    return readStorage<User | null>(STORAGE_KEYS.user, null, STORAGE_KEYS.legacyUser);
  },

  async upsertUser(user) {
    writeStorage(STORAGE_KEYS.user, user);
    return user;
  },

  async clearCurrentUser() {
    removeStorage(STORAGE_KEYS.user, STORAGE_KEYS.legacyUser);
  },
};
