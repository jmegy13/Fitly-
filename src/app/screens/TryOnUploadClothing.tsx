import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ScreenHeader } from '../components/ScreenHeader';
import { UploadCard } from '../components/UploadCard';
import { clothingItems, type ClothingItem } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useTryOn, type TryOnAsset } from '../hooks/useTryOn';

function clothingToAsset(item: ClothingItem): TryOnAsset {
  return {
    id: item.id,
    type: 'clothing',
    image: item.image,
    label: item.name,
    source: 'catalog',
    brand: item.brand,
    category: item.category,
    price: item.price,
  };
}

export function TryOnUploadClothing() {
  const navigate = useNavigate();
  const { draft, selectClothing, startGenerating, validationMessage } = useTryOn();
  const { canUseTryOn, consumeTryOnCredit, remainingTryOns, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isStartingGeneration, setIsStartingGeneration] = useState(false);

  const handleUpload = (image: string, fileName: string) => {
    selectClothing({
      id: `clothing-upload-${Date.now()}`,
      type: 'clothing',
      image,
      label: fileName,
      source: 'upload',
      brand: 'Your Closet',
      category: 'Uploaded item',
      price: 'Personal item',
    });
    setError(null);
  };

  const handleGenerateTryOn = async () => {
    if (!canUseTryOn) {
      setShowUpgradeModal(true);
      return;
    }

    if (!startGenerating()) {
      setError(validationMessage);
      return;
    }

    setIsStartingGeneration(true);
    try {
      await consumeTryOnCredit();
    } catch (creditError) {
      setError(creditError instanceof Error ? creditError.message : 'Usage limit reached.');
      setShowUpgradeModal(true);
      setIsStartingGeneration(false);
      return;
    }

    navigate('/try-on/generating');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-stone-50 text-black">
      <ScreenHeader title="Choose Clothing" backTo="/try-on/upload-photo" />

      <main className="flex-1 overflow-y-auto px-6 pb-28">
        <div className="mx-auto max-w-md space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">Step 2 of 3</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">Add the item.</h2>
            <p className="mt-2 text-gray-600">
              Upload a garment or choose a catalog item. You can replace either image before generating.
            </p>
          </div>

          <div className="rounded-3xl bg-black p-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/50">{user?.plan === 'premium' ? 'Premium plan' : 'Free plan'}</p>
                <p className="font-semibold">
                  {remainingTryOns === 'unlimited' ? 'Unlimited try-ons available' : `${remainingTryOns} try-ons left this month`}
                </p>
              </div>
              {user?.plan === 'free' && (
                <button
                  onClick={() => navigate('/premium')}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                  type="button"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {draft.selfie && (
            <div className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-gray-100">
                <ImageWithFallback src={draft.selfie.image} alt={draft.selfie.label} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-950">Selfie selected</p>
                <p className="truncate text-sm text-gray-500">{draft.selfie.label}</p>
              </div>
              <button
                onClick={() => navigate('/try-on/upload-photo')}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700"
                type="button"
              >
                Replace
              </button>
            </div>
          )}

          <UploadCard
            title="Upload clothing item"
            description="Flat product photos work best"
            preview={draft.clothing?.image}
            previewAlt={draft.clothing?.label}
            onUpload={handleUpload}
            onMockSelect={() => selectClothing(clothingToAsset(clothingItems[2]))}
            mockLabel="Use sample"
          />

          <div>
            <p className="mb-4 text-sm font-semibold text-gray-700">Popular items</p>
            <div className="grid grid-cols-2 gap-4">
              {clothingItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    selectClothing(clothingToAsset(item));
                    setError(null);
                  }}
                  className="text-left"
                  type="button"
                >
                  <div
                    className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 ${
                      draft.clothing?.id === item.id ? 'ring-4 ring-black' : ''
                    }`}
                  >
                    <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    {draft.clothing?.id === item.id && (
                      <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.brand}</p>
                    <p className="text-sm text-gray-700">{item.price}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {(error || draft.error) && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error ?? draft.error}
            </div>
          )}
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 border-t border-black/10 bg-white px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <button
          onClick={handleGenerateTryOn}
          disabled={isStartingGeneration}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-black py-4 font-semibold text-white transition-transform hover:scale-[1.02]"
          type="button"
        >
          <Sparkles className="h-5 w-5" />
          {isStartingGeneration ? 'Preparing...' : 'Generate Try-On'}
        </button>
      </div>

      {showUpgradeModal && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/50 px-4 pb-4 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-6 text-black shadow-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">Limit reached</p>
            <h3 className="mt-2 text-2xl font-bold">You used your 5 free try-ons.</h3>
            <p className="mt-2 text-gray-600">
              Upgrade to Premium for unlimited mock generations, HD exports, and faster processing.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="rounded-full bg-gray-100 py-3 font-semibold text-gray-800"
                type="button"
              >
                Not now
              </button>
              <button
                onClick={() => navigate('/premium')}
                className="rounded-full bg-black py-3 font-semibold text-white"
                type="button"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
