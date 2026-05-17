import { Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type OutfitCardProps = {
  image: string;
  title: string;
  subtitle: string;
  isFavorite?: boolean;
  large?: boolean;
  onClick?: () => void;
};

export function OutfitCard({ image, title, subtitle, isFavorite, large, onClick }: OutfitCardProps) {
  return (
    <button className="group block w-full text-left" onClick={onClick} type="button">
      <div className={`${large ? 'aspect-[4/5]' : 'aspect-[3/4]'} relative overflow-hidden rounded-2xl bg-gray-100`}>
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isFavorite && (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
            <Heart className="h-4 w-4 fill-current text-pink-500" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="truncate font-semibold text-gray-900">{title}</p>
        <p className="truncate text-sm text-gray-500">{subtitle}</p>
      </div>
    </button>
  );
}
