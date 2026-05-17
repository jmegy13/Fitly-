import type { WardrobeItem } from '../types';
import { ServiceError } from '../types';
import { serviceRegistry } from './serviceRegistry';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export const wardrobeService = {
  async listItems(userId: string) {
    if (!userId) {
      throw new ServiceError('missing_user', 'Please log in to view your wardrobe.');
    }

    await wait(150);
    return serviceRegistry.wardrobeRepository.listByUser(userId);
  },

  async saveItem(userId: string, item: WardrobeItem) {
    if (!userId) {
      throw new ServiceError('missing_user', 'Please log in to save outfits.');
    }

    try {
      await wait(300);
      return serviceRegistry.wardrobeRepository.saveForUser(userId, item);
    } catch {
      throw new ServiceError('storage_save_failed', 'Could not save this outfit. Please try again.');
    }
  },
};
