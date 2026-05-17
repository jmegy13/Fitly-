# Supabase Setup

This project is a Vite React app. Do not use the Next.js `@supabase/ssr` server helpers here unless the app is migrated to Next.js.

## Required Dashboard Setup

1. Open Supabase project:
   `https://nuahtvhibuqhsbimcwpt.supabase.co`
2. Run `supabase/migrations/20260517120000_fitly_initial_schema.sql` in SQL Editor.
3. Create a public Storage bucket:
   `fitly-uploads`
4. Enable Auth providers as needed:
   - Google
   - Apple
5. Add allowed redirect URLs:
   - `http://127.0.0.1:5173/home`
   - `http://localhost:5173/home`

## Local Env

The app reads Vite env vars:

```env
VITE_SERVICE_MODE=remote
VITE_SUPABASE_URL=https://nuahtvhibuqhsbimcwpt.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

The Supabase publishable key can be used as `VITE_SUPABASE_ANON_KEY` for this frontend.
