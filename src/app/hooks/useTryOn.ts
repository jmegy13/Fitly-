import { useMemo, useState } from 'react';
import { emptyTryOnDraft } from '../constants';
import { savedOutfitToTryOnResult, tryOnService } from '../services/tryOnService';
import { wardrobeService } from '../services/wardrobeService';
import type { TryOnDraft, TryOnResult, UploadImage, WardrobeItem } from '../types';

export type TryOnFlowStatus = TryOnDraft['status'];
export type TryOnAsset = UploadImage;
export type TryOnResultItem = TryOnResult;

export function useTryOn() {
  const [draft, setDraft] = useState<TryOnDraft>(() => tryOnService.getDraft());
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [isWardrobeLoading, setIsWardrobeLoading] = useState(false);
  const [isSavingOutfit, setIsSavingOutfit] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const canGenerate = Boolean(draft.selfie && draft.clothing);
  const validationMessage = useMemo(() => tryOnService.validateDraft(draft), [draft]);

  const updateDraft = (nextDraft: TryOnDraft) => {
    setDraft(nextDraft);
    return nextDraft;
  };

  const loadWardrobe = async (userId: string) => {
    setIsWardrobeLoading(true);
    setLastError(null);
    try {
      const items = await wardrobeService.listItems(userId);
      setWardrobeItems(items);
      return items;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load wardrobe.';
      setLastError(message);
      return [];
    } finally {
      setIsWardrobeLoading(false);
    }
  };

  const selectSelfie = (selfie: UploadImage) => updateDraft(tryOnService.selectSelfie(draft, selfie));

  const selectClothing = (clothing: UploadImage) => updateDraft(tryOnService.selectClothing(draft, clothing));

  const startGenerating = () => {
    const nextDraft = tryOnService.startGenerating(draft);
    updateDraft(nextDraft);
    return nextDraft.status === 'generating';
  };

  const generateTryOn = async (userId: string, onProgress?: (step: string, index: number) => void) => {
    if (!draft.selfie || !draft.clothing) return null;

    setIsGenerating(true);
    setLastError(null);
    try {
      const result = await tryOnService.generateTryOn(
        { userId, selfie: draft.selfie, clothing: draft.clothing },
        { onProgress },
      );
      updateDraft(tryOnService.completeGeneration(draft, result));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Try-on generation failed. Please try again.';
      updateDraft(tryOnService.failGeneration(draft, message));
      setLastError(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCurrentResult = async (userId?: string) => {
    if (!draft.result || !userId) return null;

    setIsSavingOutfit(true);
    setLastError(null);
    try {
      const items = await wardrobeService.saveItem(userId, draft.result);
      setWardrobeItems(items);
      updateDraft(tryOnService.saveDraft({ ...draft, status: 'saved_to_wardrobe' }));
      return draft.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save this outfit. Please try again.';
      setLastError(message);
      return null;
    } finally {
      setIsSavingOutfit(false);
    }
  };

  const clearError = () => {
    if (draft.error) updateDraft(tryOnService.saveDraft({ ...draft, error: null }));
    setLastError(null);
  };

  const resetDraft = () => updateDraft(tryOnService.resetDraft());

  const openSavedResult = (result: TryOnResult) => {
    updateDraft(
      tryOnService.saveDraft({
        status: 'result_ready',
        selfie: result.selfie,
        clothing: result.clothing,
        result,
        error: null,
      }),
    );
  };

  return {
    draft,
    wardrobeItems,
    canGenerate,
    validationMessage,
    isWardrobeLoading,
    isSavingOutfit,
    isGenerating,
    lastError,
    loadWardrobe,
    selectSelfie,
    selectClothing,
    startGenerating,
    generateTryOn,
    saveCurrentResult,
    resetDraft,
    clearError,
    openSavedResult,
  };
}

export { savedOutfitToTryOnResult, emptyTryOnDraft };
