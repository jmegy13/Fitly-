type ServiceMode = 'mock' | 'remote';

function readBoolean(value: string | undefined, fallback = false) {
  if (!value) return fallback;
  return value === 'true' || value === '1';
}

function readServiceMode(value: string | undefined): ServiceMode {
  return value === 'remote' ? 'remote' : 'mock';
}

export const appConfig = {
  serviceMode: readServiceMode(import.meta.env.VITE_SERVICE_MODE),
  enableRemoteAi: readBoolean(import.meta.env.VITE_ENABLE_REMOTE_AI),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey:
    import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
  aiTryOnApiUrl: import.meta.env.VITE_AI_TRYON_API_URL ?? '',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ?? '',
  geminiModel: import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash-image',
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? '',
};

export function hasSupabaseConfig() {
  return Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey);
}

export function hasAiTryOnConfig() {
  return Boolean(appConfig.aiTryOnApiUrl || appConfig.geminiApiKey);
}

export function hasGeminiConfig() {
  return Boolean(appConfig.geminiApiKey && appConfig.geminiModel);
}

export function hasStripeConfig() {
  return Boolean(appConfig.stripePublicKey);
}
