import { emptyTryOnDraft, loadingStepLabels, STORAGE_KEYS } from '../constants';
import { defaultTryOn, type SavedOutfit } from '../data/mockData';
import type { TryOnDraft, TryOnRequest, TryOnResult, UploadImage } from '../types';
import { readStorage, writeStorage } from './localStorageClient';
import { serviceRegistry } from './serviceRegistry';

function getStatus(selfie: UploadImage | null, clothing: UploadImage | null): TryOnDraft['status'] {
  if (selfie && clothing) return 'ready_to_generate';
  if (selfie) return 'selfie_selected';
  if (clothing) return 'clothing_item_selected';
  return 'no_images_selected';
}

export const tryOnService = {
  getLoadingSteps() {
    return loadingStepLabels;
  },

  getDraft() {
    return readStorage<TryOnDraft>(STORAGE_KEYS.tryOnDraft, emptyTryOnDraft, STORAGE_KEYS.legacyTryOnDraft);
  },

  saveDraft(draft: TryOnDraft) {
    writeStorage(STORAGE_KEYS.tryOnDraft, draft);
    return draft;
  },

  resetDraft() {
    return this.saveDraft(emptyTryOnDraft);
  },

  selectSelfie(draft: TryOnDraft, selfie: UploadImage) {
    return this.saveDraft({
      ...draft,
      selfie,
      result: null,
      error: null,
      status: getStatus(selfie, draft.clothing),
    });
  },

  selectClothing(draft: TryOnDraft, clothing: UploadImage) {
    return this.saveDraft({
      ...draft,
      clothing,
      result: null,
      error: null,
      status: getStatus(draft.selfie, clothing),
    });
  },

  validateDraft(draft: TryOnDraft) {
    if (draft.selfie && draft.clothing) return null;
    if (!draft.selfie && !draft.clothing) return 'Add a selfie and a clothing item to generate your fit.';
    if (!draft.selfie) return 'Add your selfie first so Fitly knows who to style.';
    return 'Choose or upload a clothing item to complete your try-on.';
  },

  startGenerating(draft: TryOnDraft) {
    const error = this.validateDraft(draft);
    if (error) {
      return this.saveDraft({ ...draft, error });
    }

    return this.saveDraft({ ...draft, status: 'generating', error: null });
  },

  async generateTryOn(
    request: TryOnRequest,
    options?: {
      onProgress?: (step: string, index: number) => void;
      shouldFail?: boolean;
    },
  ) {
    const job = await serviceRegistry.tryOnJobRepository.createJob(request);
    await serviceRegistry.tryOnJobRepository.updateJob(job.id, { status: 'processing' });

    try {
      const result = await serviceRegistry.tryOnApi.generate(request, options);
      await serviceRegistry.tryOnJobRepository.updateJob(job.id, { status: 'completed', resultId: result.id });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Try-on generation failed.';
      await serviceRegistry.tryOnJobRepository.updateJob(job.id, { status: 'failed', error: message });
      throw error;
    }
  },

  completeGeneration(draft: TryOnDraft, result: TryOnResult) {
    return this.saveDraft({ ...draft, result, status: 'result_ready', error: null });
  },

  failGeneration(draft: TryOnDraft, message: string) {
    return this.saveDraft({ ...draft, status: 'ready_to_generate', error: message });
  },
};

export function savedOutfitToTryOnResult(outfit: SavedOutfit): TryOnResult {
  return {
    id: `starter-${outfit.id}`,
    title: outfit.title,
    selfie: {
      id: `starter-selfie-${outfit.id}`,
      type: 'selfie',
      image: defaultTryOn.selfie.image,
      label: defaultTryOn.selfie.label,
      source: 'example',
    },
    clothing: {
      id: `starter-clothing-${outfit.id}`,
      type: 'clothing',
      image: defaultTryOn.clothing.image,
      label: defaultTryOn.clothing.name,
      source: 'catalog',
      brand: defaultTryOn.clothing.brand,
      category: defaultTryOn.clothing.category,
      price: defaultTryOn.clothing.price,
    },
    resultImage: outfit.image,
    createdAt: outfit.date,
    isFavorite: outfit.isFavorite,
  };
}
