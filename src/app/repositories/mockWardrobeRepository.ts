import { STORAGE_KEYS } from '../constants';
import type { WardrobeItem } from '../types';
import { readStorage, writeStorage } from '../services/localStorageClient';
import type { WardrobeRepository } from './repositoryTypes';

function wardrobeKey(userId: string) {
  return `${STORAGE_KEYS.wardrobe}.${userId}`;
}

export const mockWardrobeRepository: WardrobeRepository = {
  async listByUser(userId) {
    return readStorage<WardrobeItem[]>(wardrobeKey(userId), [], STORAGE_KEYS.legacyWardrobe);
  },

  async saveForUser(userId, item) {
    const currentItems = await this.listByUser(userId);
    const alreadySaved = currentItems.some((currentItem) => currentItem.id === item.id);
    const nextItems = alreadySaved ? currentItems : [item, ...currentItems];
    writeStorage(wardrobeKey(userId), nextItems);
    writeStorage(STORAGE_KEYS.wardrobe, nextItems);
    return nextItems;
  },
};
