import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { LoadingStep } from '../components/LoadingStep';
import { useAuth } from '../context/AuthContext';
import { useTryOn } from '../hooks/useTryOn';
import { tryOnService } from '../services/tryOnService';

const loadingSteps = tryOnService.getLoadingSteps();

export function TryOnGenerating() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, generateTryOn, lastError } = useTryOn();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!draft.selfie || !draft.clothing) {
      navigate('/try-on/upload-photo', { replace: true });
      return;
    }

    if (!user) {
      navigate('/login', { replace: true, state: { from: '/try-on/generating' } });
      return;
    }

    let isCancelled = false;
    generateTryOn(user.id, (_step, index) => {
      if (!isCancelled) setActiveStep(index);
    }).then((result) => {
      if (isCancelled) return;
      navigate(result ? '/try-on/result' : '/try-on/upload-clothing', { replace: true });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!draft.selfie || !draft.clothing) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black px-6 text-white">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="relative mb-8">
          <motion.div
            animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.94, 1.05, 0.94] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-6 rounded-full bg-white/20 blur-3xl"
          />
          <div className="relative grid grid-cols-[1fr_0.72fr] gap-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-900 shadow-2xl"
            >
              <ImageWithFallback src={draft.selfie.image} alt={draft.selfie.label} className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-10 aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-gray-900 shadow-2xl"
            >
              <ImageWithFallback src={draft.clothing.image} alt={draft.clothing.label} className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.08, 1] }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-2xl"
            >
              <Sparkles className="h-7 w-7" />
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">Step 3 of 3</p>
          <h1 className="mt-3 text-3xl font-bold">Generating your fit...</h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-white/60">
            Building a realistic mocked try-on preview for {draft.clothing.label}.
          </p>
        </motion.div>

        <div className="mt-8 space-y-2">
          {loadingSteps.map((step, index) => (
            <LoadingStep
              key={step}
              label={step}
              state={index < activeStep ? 'complete' : index === activeStep ? 'active' : 'pending'}
            />
          ))}
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((activeStep + 1) / loadingSteps.length) * 100}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="h-full rounded-full bg-white"
          />
        </div>
        {lastError && (
          <div className="mt-5 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100">
            {lastError}
          </div>
        )}
      </main>
    </div>
  );
}
