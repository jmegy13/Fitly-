# Fitly Backend Readiness

Phase 6 kept the app frontend-only, but the runtime now mirrors the backend shape we will need later. The current code can also use Supabase when `VITE_SERVICE_MODE=remote` and Supabase env vars are present.

## Service Swap Points

- `authService` talks to `userRepository`.
- `billingService` talks to `usageRepository`.
- `wardrobeService` talks to `wardrobeRepository`.
- `tryOnService` talks to `tryOnJobRepository` and `tryOnApi`.
- `serviceRegistry` chooses mock repositories by default and Supabase repositories when `VITE_SERVICE_MODE=remote`.

## Planned Supabase Tables

- `profiles`: user identity, plan, monthly usage summary.
- `usage_records`: one row per user/month for try-on limits.
- `try_on_jobs`: async generation jobs.
- `wardrobe_items`: saved try-on results.

The first schema draft lives in `supabase/schema.sql`.

## Future Stripe Flow

1. Frontend calls backend to create a checkout session.
2. Stripe webhook updates `profiles.plan`.
3. Frontend reads the plan from Supabase on session refresh.

## Future AI Flow

1. Create a `try_on_jobs` row with status `queued`.
2. Upload selfie and clothing images to Supabase Storage.
3. Current direct mode can call Gemini from the browser when `VITE_ENABLE_REMOTE_AI=true` and `VITE_GEMINI_API_KEY` is set.
4. Production mode should move Gemini calls to a backend worker to avoid exposing API keys.
5. Worker writes `result_image_url` and sets status `completed`.
6. Frontend polls or subscribes to job status.

## Required Supabase Setup

- Create the tables in `supabase/schema.sql`.
- Create a public Storage bucket named `fitly-uploads` or update `supabaseAdapter.ts`.
- Enable Apple/Google OAuth providers in Supabase Auth if those buttons should use real OAuth.
