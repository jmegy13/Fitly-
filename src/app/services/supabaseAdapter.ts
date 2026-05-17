import { createClient } from '@supabase/supabase-js';
import { appConfig, hasSupabaseConfig } from '../config/env';
import { ServiceError } from '../types';

export function assertSupabaseConfigured() {
  if (!hasSupabaseConfig()) {
    throw new ServiceError('integration_not_configured', 'Supabase is not configured yet.');
  }
}

export const supabase = hasSupabaseConfig()
  ? createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getSupabaseClient() {
  assertSupabaseConfigured();
  if (!supabase) {
    throw new ServiceError('integration_not_configured', 'Supabase client is unavailable.');
  }

  return supabase;
}

export const supabaseAdapter = {
  async signInWithOAuth(provider: 'apple' | 'google') {
    const client = getSupabaseClient();
    const { error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/home',
      },
    });

    if (error) throw error;
  },

  async signOut() {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async uploadObject(path: string, file: File) {
    const client = getSupabaseClient();
    const { error } = await client.storage.from('fitly-uploads').upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) throw error;

    const { data } = client.storage.from('fitly-uploads').getPublicUrl(path);
    return data.publicUrl;
  },
};
