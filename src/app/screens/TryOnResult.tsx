import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, Heart, RotateCcw, Share2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { defaultTryOn } from '../data/mockData';
import { useTryOn, type TryOnResultItem } from '../hooks/useTryOn';

function fallbackResult(): TryOnResultItem {
  return {
    id: 'fallback-result',
    title: defaultTryOn.clothing.name,
    selfie: {
      id: defaultTryOn.selfie.id,
      type: 'selfie',
      image: defaultTryOn.selfie.image,
      label: defaultTryOn.selfie.label,
      source: 'example',
    },
    clothing: {
      id: defaultTryOn.clothing.id,
      type: 'clothing',
      image: defaultTryOn.clothing.image,
      label: defaultTryOn.clothing.name,
      source: 'catalog',
      brand: defaultTryOn.clothing.brand,
      category: defaultTryOn.clothing.category,
      price: defaultTryOn.clothing.price,
    },
    resultImage: defaultTryOn.resultImage,
    createdAt: new Date().toISOString(),
    isFavorite: true,
  };
}

export function TryOnResult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, saveCurrentResult, resetDraft, isSavingOutfit, lastError } = useTryOn();
  const result = useMemo(() => draft.result ?? fallbackResult(), [draft.result]);
  const [sliderPosition, setSliderPosition] = useState(56);
  const [isSaved, setIsSaved] = useState(draft.status === 'saved_to_wardrobe');
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const updateSlider = (clientX: number, container: HTMLElement | null) => {
    const rect = container?.getBoundingClientRect();
    if (!rect) return;

    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(8, Math.min(92, percentage)));
  };

  const handleSave = async () => {
    const saved = await saveCurrentResult(user?.id);
    if (saved) {
      setIsSaved(true);
      setShareMessage('Saved to My Wardrobe.');
      return;
    }
    setShareMessage('Could not save this outfit. Please try again.');
  };

  const handleShare = async () => {
    const text = `Check out my Fitly try-on: ${result.title}`;
    if (navigator.share) {
      await navigator.share({ title: 'Fitly Try-On', text });
      return;
    }

    await navigator.clipboard?.writeText(text);
    setShareMessage('Share text copied.');
  };

  const handleTryAnother = () => {
    resetDraft();
    navigate('/try-on/upload-photo');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-white">
      <ScreenHeader title="Your Try-On" backTo="/try-on/upload-clothing" />

      <main className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="mx-auto max-w-md">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-white/50">Mock result ready</p>
                <h2 className="truncate text-2xl font-bold">{result.title}</h2>
              </div>
              <div className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
                {result.clothing.price ?? 'Try-on'}
              </div>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-900">
              <ImageWithFallback src={result.selfie.image} alt="Before try-on" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <ImageWithFallback src={result.resultImage} alt="Mock try-on result" className="h-full w-full object-cover" />
              </div>

              <div
                className="absolute bottom-0 top-0 w-1 cursor-ew-resize bg-white"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={(event) => {
                  const container = event.currentTarget.parentElement;
                  const handleMove = (moveEvent: MouseEvent) => updateSlider(moveEvent.clientX, container);
                  const handleUp = () => {
                    document.removeEventListener('mousemove', handleMove);
                    document.removeEventListener('mouseup', handleUp);
                  };
                  document.addEventListener('mousemove', handleMove);
                  document.addEventListener('mouseup', handleUp);
                }}
                onTouchMove={(event) => updateSlider(event.touches[0].clientX, event.currentTarget.parentElement)}
              >
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-500 shadow-xl">
                  <div className="flex gap-1">
                    <div className="h-4 w-0.5 bg-current" />
                    <div className="h-4 w-0.5 bg-current" />
                  </div>
                </div>
              </div>

              <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium backdrop-blur">Before</div>
              <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black">After</div>
            </div>
          </motion.div>

          <div className="mt-5 rounded-[1.5rem] bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white/10">
                <ImageWithFallback src={result.clothing.image} alt={result.clothing.label} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{result.clothing.brand ?? 'Selected item'}</p>
                <p className="truncate text-sm text-white/60">{result.clothing.category ?? 'Clothing'} matched to your selfie.</p>
              </div>
            </div>
          </div>

          {shareMessage && (
            <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black">
              {shareMessage}
            </div>
          )}
          {lastError && (
            <div className="mt-4 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100">
              {lastError}
            </div>
          )}

          <div className="mt-5 grid grid-cols-3 gap-3">
            <button
              onClick={handleSave}
              disabled={isSavingOutfit}
              className={`flex flex-col items-center gap-2 rounded-2xl py-3 transition-colors ${
                isSaved ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
              }`}
              type="button"
            >
              {isSaved ? <Check className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
              <span className="text-xs">{isSavingOutfit ? 'Saving' : isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button onClick={handleShare} className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 py-3 transition-colors hover:bg-white/15" type="button">
              <Share2 className="h-5 w-5" />
              <span className="text-xs">Share</span>
            </button>
            <button
              onClick={handleTryAnother}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 py-3 transition-colors hover:bg-white/15"
              type="button"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="text-xs">Try another</span>
            </button>
          </div>
        </div>
      </main>

      <div className="border-t border-white/10 bg-black px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <button
          onClick={() => navigate('/wardrobe')}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-white py-4 font-semibold text-black transition-transform hover:scale-[1.02]"
          type="button"
        >
          <ShoppingBag className="h-5 w-5" />
          View in Wardrobe
        </button>
      </div>
    </div>
  );
}
