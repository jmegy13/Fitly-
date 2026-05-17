import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Crown, Heart, Search, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BottomNav } from '../components/BottomNav';
import { savedOutfits } from '../data/mockData';

export function Home() {
  const navigate = useNavigate();

  const categories = [
    'All',
    'Streetwear',
    'Luxury',
    'Casual',
    'Shoes',
    'Jackets',
    'Accessories',
  ];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-stone-50">
      <div className="px-6 pb-4 pt-12">
        <div className="mx-auto mb-6 flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-black" />
            <span className="text-xl font-bold">Fitly</span>
          </div>
          <button
            onClick={() => navigate('/premium')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
            type="button"
          >
            <Crown className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search styles, items, trends..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div className="mb-4 px-6">
        <div className="scrollbar-hide mx-auto flex max-w-md gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                category === 'All'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
          {savedOutfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => navigate('/try-on/upload-photo')}
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={outfit.image}
                  alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="mb-1 font-semibold">{outfit.title}</p>
                  <p className="flex items-center gap-1 text-sm text-gray-300">
                    <Heart className="h-3.5 w-3.5" />
                    Saved look
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        onClick={() => navigate('/try-on/upload-photo')}
        className="absolute bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black px-8 py-4 font-semibold text-white shadow-2xl transition-transform hover:scale-105"
        type="button"
      >
        <Sparkles className="w-5 h-5" />
        Try On Now
      </motion.button>

      <BottomNav active="home" />
    </div>
  );
}
