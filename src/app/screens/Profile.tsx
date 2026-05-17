import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Bell, ChevronRight, Crown, HelpCircle, LogOut, Settings, Shield, Sparkles, UserRound } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BottomNav } from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useTryOn } from '../hooks/useTryOn';

export function Profile() {
  const navigate = useNavigate();
  const { user, subscription, remainingTryOns, logout } = useAuth();
  const { wardrobeItems, loadWardrobe } = useTryOn();

  useEffect(() => {
    if (user) loadWardrobe(user.id);
  }, [user?.id]);

  if (!user) return null;

  const stats = [
    { label: 'Wardrobe', value: wardrobeItems.length.toString() },
    { label: 'Used', value: user.tryOnsUsedThisMonth.toString() },
    { label: 'Remaining', value: remainingTryOns === 'unlimited' ? '∞' : remainingTryOns.toString() },
  ];

  const settingsItems = [
    { icon: UserRound, label: 'Account Details', color: 'text-gray-600' },
    { icon: Bell, label: 'Notifications', color: 'text-purple-500' },
    { icon: Shield, label: 'Privacy & Safety', color: 'text-blue-500' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-gray-500' },
  ];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-stone-50">
      <div className="px-6 pb-6 pt-12">
        <div className="mx-auto mb-6 flex max-w-md items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button className="rounded-lg p-2 transition-colors hover:bg-gray-100" type="button">
            <Settings className="h-6 w-6" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md overflow-hidden rounded-[2rem] bg-black p-5 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-white/10">
              <ImageWithFallback src={user.image} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold">{user.name}</h2>
              <p className="truncate text-sm text-white/60">{user.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-black">
                {user.plan === 'premium' ? <Crown className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                {user.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
              </div>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: user.plan === 'premium' ? '100%' : `${Math.min(100, (user.tryOnsUsedThisMonth / 5) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-white/60">
            {remainingTryOns === 'unlimited'
              ? `${user.tryOnsUsedThisMonth} try-ons used this month. Unlimited access is active.`
              : `${remainingTryOns} of 5 free try-ons remaining this month.`}
          </p>
          {subscription && (
            <p className="mt-1 text-xs text-white/40">
              Subscription {subscription.status} until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
            </p>
          )}
        </motion.div>

        <div className="mx-auto mt-4 grid max-w-md grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl bg-white p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 pb-28">
        <div className="mx-auto max-w-md space-y-3">
          {user.plan === 'free' && (
            <button
              onClick={() => navigate('/premium')}
              className="flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm"
              type="button"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <Crown className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-950">Upgrade to Premium</p>
                <p className="text-sm text-gray-500">Unlimited try-ons and HD generations.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          )}

          <div className="rounded-3xl bg-white p-2 shadow-sm">
            {settingsItems.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-gray-50"
                type="button"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="flex-1 font-medium text-gray-900">{item.label}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              logout().then(() => {
              navigate('/login', { replace: true });
              });
            }}
            className="mt-4 flex w-full items-center gap-4 rounded-3xl bg-red-50 p-4 text-left transition-colors hover:bg-red-100"
            type="button"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="flex-1 font-semibold text-red-500">Log Out</span>
          </button>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
