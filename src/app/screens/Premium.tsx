import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Crown, History, Image, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const premiumBenefits = [
  { icon: Sparkles, text: 'Unlimited try-ons' },
  { icon: Image, text: 'HD generations' },
  { icon: Zap, text: 'Faster AI processing' },
  { icon: History, text: 'Saved outfit history' },
  { icon: Crown, text: 'Early access to new features' },
];

const comparisonRows = [
  { label: 'Monthly try-ons', free: '5', premium: 'Unlimited' },
  { label: 'Generation quality', free: 'Standard', premium: 'HD' },
  { label: 'Processing speed', free: 'Regular', premium: 'Priority' },
  { label: 'Saved history', free: 'Limited', premium: 'Full' },
];

export function Premium() {
  const navigate = useNavigate();
  const { user, subscription, upgradeToPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [upgraded, setUpgraded] = useState(user?.plan === 'premium');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const plans = {
    monthly: { price: '$9.99', period: 'month', note: 'Flexible monthly access' },
    yearly: { price: '$79.99', period: 'year', note: 'Best value, save 33%' },
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setUpgradeError(null);
    try {
      await upgradeToPremium();
      setUpgraded(true);
    } catch (error) {
      setUpgradeError(error instanceof Error ? error.message : 'Upgrade failed. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%)]" />

      <div className="relative z-10 px-6 pb-4 pt-12">
        <div className="mx-auto max-w-md">
          <button
            onClick={() => navigate('/profile')}
            className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-black">
              <Crown className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/40">Fitly Premium</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight">Create without limits.</h1>
            <p className="mt-3 text-white/60">Mock upgrade today, Stripe-ready structure later.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {(['monthly', 'yearly'] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`rounded-3xl border p-4 text-left transition-colors ${
                  selectedPlan === plan ? 'border-white bg-white text-black' : 'border-white/10 bg-white/10 text-white'
                }`}
                type="button"
              >
                <p className="text-sm font-semibold capitalize">{plan}</p>
                <p className="mt-2 text-2xl font-bold">{plans[plan].price}</p>
                <p className={selectedPlan === plan ? 'text-sm text-gray-500' : 'text-sm text-white/50'}>/{plans[plan].period}</p>
                <p className={selectedPlan === plan ? 'mt-3 text-xs text-gray-600' : 'mt-3 text-xs text-white/50'}>{plans[plan].note}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="relative z-10 flex-1 overflow-y-auto px-6 pb-32">
        <div className="mx-auto max-w-md space-y-5">
          <section className="rounded-[2rem] bg-white/10 p-5">
            <h2 className="mb-4 text-lg font-bold">Premium benefits</h2>
            <div className="space-y-3">
              {premiumBenefits.map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-white/90">{benefit.text}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] bg-white text-black">
            <div className="grid grid-cols-[1.2fr_0.8fr_0.9fr] bg-gray-100 px-4 py-3 text-sm font-bold">
              <span>Feature</span>
              <span>Free</span>
              <span>Premium</span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.2fr_0.8fr_0.9fr] border-t border-gray-100 px-4 py-3 text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="text-gray-500">{row.free}</span>
                <span className="font-semibold">{row.premium}</span>
              </div>
            ))}
          </section>

          {upgraded && (
            <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-black">
              Premium is active on your mock user.
              {subscription ? ` Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.` : ''}
            </div>
          )}
          {upgradeError && (
            <div className="rounded-3xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100">
              {upgradeError}
            </div>
          )}
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-white py-4 text-lg font-bold text-black transition-transform hover:scale-[1.02]"
          type="button"
        >
          {upgraded ? <Check className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
          {isUpgrading ? 'Upgrading...' : upgraded ? 'Premium Active' : 'Upgrade to Premium'}
        </button>
      </div>
    </div>
  );
}
