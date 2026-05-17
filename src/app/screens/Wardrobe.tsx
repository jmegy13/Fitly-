import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Clock, Grid3x3, Heart, LayoutGrid, ShoppingBag } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { OutfitCard } from '../components/OutfitCard';
import { useAuth } from '../context/AuthContext';
import { savedOutfits } from '../data/mockData';
import { savedOutfitToTryOnResult, useTryOn } from '../hooks/useTryOn';

export function Wardrobe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wardrobeItems, openSavedResult, loadWardrobe, isWardrobeLoading, lastError } = useTryOn();
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all');

  useEffect(() => {
    if (user) loadWardrobe(user.id);
  }, [user?.id]);

  const starterItems = useMemo(() => savedOutfits.map(savedOutfitToTryOnResult), []);
  const allOutfits = [...wardrobeItems, ...starterItems];
  const filteredOutfits =
    filter === 'favorites'
      ? allOutfits.filter((outfit) => outfit.isFavorite)
      : filter === 'recent'
      ? allOutfits.slice(0, Math.max(3, wardrobeItems.length))
      : allOutfits;

  const handleOpenOutfit = (outfit: (typeof allOutfits)[number]) => {
    openSavedResult(outfit);
    navigate('/try-on/result');
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-stone-50">
      <div className="px-6 pb-6 pt-12">
        <div className="mx-auto mb-6 flex max-w-md items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Wardrobe</h1>
            <p className="text-sm text-gray-500">
              {wardrobeItems.length > 0 ? `${wardrobeItems.length} saved try-on result${wardrobeItems.length === 1 ? '' : 's'}` : 'Save a try-on to build your closet'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}
              type="button"
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('large')}
              className={`rounded-lg p-2 transition-colors ${
                viewMode === 'large' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}
              type="button"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="scrollbar-hide mx-auto flex max-w-md gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
            type="button"
          >
            All Outfits
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              filter === 'favorites' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
            type="button"
          >
            <Heart className="h-4 w-4" />
            Favorites
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              filter === 'recent' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
            type="button"
          >
            <Clock className="h-4 w-4" />
            Recent
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 pb-28">
        {isWardrobeLoading && (
          <div className="mx-auto mb-4 max-w-md rounded-3xl bg-white p-4 text-sm font-semibold text-gray-600 shadow-sm">
            Loading your wardrobe...
          </div>
        )}
        {lastError && (
          <div className="mx-auto mb-4 max-w-md rounded-3xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {lastError}
          </div>
        )}
        {wardrobeItems.length > 0 && filter === 'all' && (
          <div className="mx-auto mb-4 max-w-md rounded-3xl bg-black p-4 text-white">
            <p className="text-sm font-semibold">Saved to wardrobe</p>
            <p className="mt-1 text-sm text-white/60">Your newest try-ons appear first and stay after refresh.</p>
          </div>
        )}

        <div className={`mx-auto max-w-md ${viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 gap-6'}`}>
          {filteredOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              image={outfit.resultImage}
              title={outfit.title}
              subtitle={outfit.createdAt.includes('T') ? new Date(outfit.createdAt).toLocaleDateString() : outfit.createdAt}
              isFavorite={outfit.isFavorite}
              large={viewMode === 'large'}
              onClick={() => handleOpenOutfit(outfit)}
            />
          ))}
        </div>

        {filteredOutfits.length === 0 && (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="font-semibold text-gray-700">No outfits found</p>
            <p className="mt-1 text-sm text-gray-500">Try another filter or save your first result.</p>
          </div>
        )}
      </main>

      <BottomNav active="wardrobe" />
    </div>
  );
}
