import { loadingStepLabels } from '../constants';
import { defaultTryOn } from '../data/mockData';
import type { TryOnApi } from './serviceTypes';
import { ServiceError, type TryOnResult } from '../types';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export const mockTryOnApi: TryOnApi = {
  async generate(request, options) {
    if (!request.userId) {
      throw new ServiceError('missing_user', 'Please log in before generating a try-on.');
    }
    if (!request.selfie || !request.clothing) {
      throw new ServiceError('generation_failed', 'Selfie and clothing images are required.');
    }

    for (const [index, step] of loadingStepLabels.entries()) {
      options?.onProgress?.(step, index);
      await wait(850);
    }

    if (options?.shouldFail) {
      throw new ServiceError('generation_failed', 'Try-on generation failed. Please try again.');
    }

    const result: TryOnResult = {
      id: `tryon-${Date.now()}`,
      title: request.clothing.label,
      selfie: request.selfie,
      clothing: request.clothing,
      resultImage: defaultTryOn.resultImage,
      createdAt: new Date().toISOString(),
      isFavorite: true,
    };

    return result;
  },
};
