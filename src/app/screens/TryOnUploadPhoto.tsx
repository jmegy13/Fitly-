import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ScreenHeader } from '../components/ScreenHeader';
import { UploadCard } from '../components/UploadCard';
import { examplePhotos, type MockPhoto } from '../data/mockData';
import { useTryOn, type TryOnAsset } from '../hooks/useTryOn';

function photoToAsset(photo: MockPhoto): TryOnAsset {
  return {
    id: photo.id,
    type: 'selfie',
    image: photo.image,
    label: photo.label,
    source: 'example',
  };
}

export function TryOnUploadPhoto() {
  const navigate = useNavigate();
  const { draft, selectSelfie } = useTryOn();
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (image: string, fileName: string) => {
    selectSelfie({
      id: `selfie-upload-${Date.now()}`,
      type: 'selfie',
      image,
      label: fileName,
      source: 'upload',
    });
    setError(null);
  };

  const handleExampleSelect = (photo: MockPhoto) => {
    selectSelfie(photoToAsset(photo));
    setError(null);
  };

  const handleContinue = () => {
    if (!draft.selfie) {
      setError('Choose or upload a selfie first. One clear photo is all we need.');
      return;
    }

    navigate('/try-on/upload-clothing');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-stone-50 text-black">
      <ScreenHeader title="Upload Selfie" backTo="/home" />

      <main className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="mx-auto max-w-md space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">Step 1 of 3</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">Start with your photo.</h2>
            <p className="mt-2 text-gray-600">
              Upload a selfie or use a sample. Fitly will keep the preview local in this mock MVP.
            </p>
          </div>

          <UploadCard
            title="Upload your selfie"
            description="JPG or PNG works best"
            preview={draft.selfie?.image}
            previewAlt={draft.selfie?.label}
            onUpload={handleUpload}
            onMockSelect={() => handleExampleSelect(examplePhotos[1])}
            mockLabel="Use sample"
          />

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Sample selfies</p>
            <div className="grid grid-cols-3 gap-3">
              {examplePhotos.map((photo) => (
                <motion.button
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => handleExampleSelect(photo)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 transition-all ${
                    draft.selfie?.id === photo.id ? 'scale-95 ring-4 ring-black' : 'hover:scale-105'
                  }`}
                  type="button"
                >
                  <ImageWithFallback src={photo.image} alt={photo.label} className="h-full w-full object-cover" />
                  {draft.selfie?.id === photo.id && (
                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
        </div>
      </main>

      <div className="border-t border-black/10 bg-white px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        <button
          onClick={handleContinue}
          className="mx-auto block w-full max-w-md rounded-full bg-black py-4 font-semibold text-white transition-transform hover:scale-[1.02]"
          type="button"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
