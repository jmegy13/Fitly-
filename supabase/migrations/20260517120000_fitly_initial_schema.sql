-- Fitly initial Supabase schema.
-- Run through Supabase SQL Editor or Supabase CLI migrations.

create type public.plan_type as enum ('free', 'premium');
create type public.try_on_job_status as enum ('queued', 'processing', 'completed', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  image_url text,
  plan public.plan_type not null default 'free',
  try_ons_used_this_month integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.usage_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  month text not null,
  try_ons_used integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, month)
);

create table public.try_on_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.try_on_job_status not null default 'queued',
  selfie_image_url text not null,
  clothing_image_url text not null,
  result_image_url text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  try_on_job_id uuid references public.try_on_jobs(id) on delete set null,
  title text not null,
  selfie_image_url text not null,
  clothing_image_url text not null,
  result_image_url text not null,
  clothing_brand text,
  clothing_category text,
  clothing_price text,
  is_favorite boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan public.plan_type not null default 'premium',
  status text not null,
  current_period_end timestamptz not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index wardrobe_items_user_created_idx on public.wardrobe_items(user_id, created_at desc);
create index try_on_jobs_user_created_idx on public.try_on_jobs(user_id, created_at desc);
create index usage_records_user_month_idx on public.usage_records(user_id, month);
create index billing_subscriptions_user_idx on public.billing_subscriptions(user_id);

alter table public.profiles enable row level security;
alter table public.usage_records enable row level security;
alter table public.try_on_jobs enable row level security;
alter table public.wardrobe_items enable row level security;
alter table public.billing_subscriptions enable row level security;

create policy "Profiles are visible to their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles can be inserted by their owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles can be updated by their owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usage records are visible to owner"
  on public.usage_records for select
  using (auth.uid() = user_id);

create policy "Usage records can be inserted by owner"
  on public.usage_records for insert
  with check (auth.uid() = user_id);

create policy "Usage records can be updated by owner"
  on public.usage_records for update
  using (auth.uid() = user_id);

create policy "Try-on jobs are visible to owner"
  on public.try_on_jobs for select
  using (auth.uid() = user_id);

create policy "Try-on jobs can be inserted by owner"
  on public.try_on_jobs for insert
  with check (auth.uid() = user_id);

create policy "Try-on jobs can be updated by owner"
  on public.try_on_jobs for update
  using (auth.uid() = user_id);

create policy "Wardrobe items are visible to owner"
  on public.wardrobe_items for select
  using (auth.uid() = user_id);

create policy "Wardrobe items can be inserted by owner"
  on public.wardrobe_items for insert
  with check (auth.uid() = user_id);

create policy "Billing subscriptions are visible to owner"
  on public.billing_subscriptions for select
  using (auth.uid() = user_id);
