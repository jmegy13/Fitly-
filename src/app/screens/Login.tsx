import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Apple, PlayCircle, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { appConfig } from '../config/env';
import { useAuth } from '../context/AuthContext';

type LoginLocationState = {
  from?: string;
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthLoading, isLoggedIn, loginWithProvider } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [loginError, setLoginError] = useState<string | null>(null);
  const from = (location.state as LoginLocationState | null)?.from ?? '/home';
  const isRemoteMode = appConfig.serviceMode === 'remote';

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (provider: 'apple' | 'google' | 'demo') => {
    setLoginError(null);
    try {
      await loginWithProvider(provider);
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black text-white">
      <div className="absolute inset-0 opacity-25">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85"
          alt="Fashion background"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col justify-between p-8">
        <div className="mt-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-white" />
          <span className="text-xl font-bold">Fitly</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-white/40">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </p>
          <h1 className="mb-4 text-5xl font-bold leading-tight">
            Your Personal
            <br />
            <span className="text-white">AI Stylist</span>
          </h1>
          <p className="text-lg text-gray-300">Save looks, track credits, and build your virtual wardrobe.</p>
        </motion.div>

        <div className="space-y-3">
          <div className="mb-4 grid grid-cols-2 rounded-full bg-white/10 p-1 backdrop-blur-sm">
            <button
              onClick={() => setMode('signup')}
              className={`rounded-full py-2.5 text-sm font-semibold transition-colors ${
                mode === 'signup' ? 'bg-white text-black' : 'text-gray-400'
              }`}
              type="button"
            >
              Sign up
            </button>
            <button
              onClick={() => setMode('login')}
              className={`rounded-full py-2.5 text-sm font-semibold transition-colors ${
                mode === 'login' ? 'bg-white text-black' : 'text-gray-400'
              }`}
              type="button"
            >
              Log in
            </button>
          </div>

          <button
            onClick={() => handleLogin('apple')}
            disabled={isAuthLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 font-semibold text-black transition-colors hover:bg-gray-200"
            type="button"
          >
            <Apple className="h-5 w-5" />
            {mode === 'signup' ? 'Sign up' : 'Log in'} with Apple
          </button>

          <button
            onClick={() => handleLogin('google')}
            disabled={isAuthLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 font-semibold text-black transition-colors hover:bg-gray-200"
            type="button"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {mode === 'signup' ? 'Sign up' : 'Log in'} with Google
          </button>

          <button
            onClick={() => handleLogin('demo')}
            disabled={isAuthLoading || isRemoteMode}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 py-4 font-semibold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            <PlayCircle className="h-5 w-5" />
            {isAuthLoading ? 'Signing in...' : isRemoteMode ? 'Demo disabled in Supabase mode' : 'Continue with Demo Account'}
          </button>

          {loginError && (
            <div className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100">
              {loginError}
            </div>
          )}

          <p className="pt-4 text-center text-xs text-gray-500">
            Mock auth only. Real accounts can plug into this flow later.
          </p>
        </div>
      </div>
    </div>
  );
}
