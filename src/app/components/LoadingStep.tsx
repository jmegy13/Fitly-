import { Check } from 'lucide-react';

type LoadingStepProps = {
  label: string;
  state: 'pending' | 'active' | 'complete';
};

export function LoadingStep({ label, state }: LoadingStepProps) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
      state === 'active' ? 'bg-white text-black' : 'bg-white/10 text-white/60'
    }`}>
      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
        state === 'complete' ? 'bg-white text-black' : state === 'active' ? 'bg-black text-white' : 'bg-white/10 text-white/40'
      }`}>
        {state === 'complete' ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
