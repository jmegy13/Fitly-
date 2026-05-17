import { Check, ImagePlus, RefreshCw, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { storageService } from '../services/storageService';

type UploadCardProps = {
  title: string;
  description: string;
  preview?: string | null;
  previewAlt?: string;
  onUpload: (image: string, fileName: string) => void;
  onMockSelect?: () => void;
  mockLabel?: string;
};

export function UploadCard({
  title,
  description,
  preview,
  previewAlt = 'Selected image',
  onUpload,
  onMockSelect,
  mockLabel = 'Use sample',
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await storageService.uploadImage(file);
      onUpload(image, file.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Image upload failed. Try again.';
      window.alert(message);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
      <div className="relative aspect-[4/5] bg-gray-100">
        {preview ? (
          <>
            <ImageWithFallback src={preview} alt={previewAlt} className="h-full w-full object-cover" />
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <Check className="h-5 w-5" />
            </div>
          </>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center px-6 text-center"
            type="button"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
              <ImagePlus className="h-8 w-8" />
            </div>
            <p className="font-semibold text-gray-950">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white"
          type="button"
        >
          {preview ? <RefreshCw className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          {preview ? 'Replace' : 'Upload'}
        </button>
        <button
          onClick={onMockSelect}
          className="rounded-full bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800"
          type="button"
        >
          {mockLabel}
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
