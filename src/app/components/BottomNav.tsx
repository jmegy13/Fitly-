import { Home, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router';

type BottomNavProps = {
  active: 'home' | 'wardrobe' | 'profile';
};

const navItems = [
  { id: 'home', label: 'Home', path: '/home', icon: Home },
  { id: 'wardrobe', label: 'Wardrobe', path: '/wardrobe', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', path: '/profile', icon: User },
] as const;

export function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white/95 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-colors ${
                isActive ? 'text-black' : 'text-gray-400 hover:text-gray-700'
              }`}
              type="button"
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
