create extension if not exists "pgcrypto";

create type public.profile_role as enum ('bidder', 'seller', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  email text,
  phone text,
  roles public.profile_role[] not null default array['bidder']::public.profile_role[],
  default_company_id uuid,
  onboarding_completed_at timestamptz,
  banned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  legal_name text,
  tax_id text,
  website_url text,
  support_email text,
  support_phone text,
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists one_company_profile_per_owner
  on public.company_profiles(owner_id);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.company_profiles(id) on delete cascade,
  type text not null check (type in ('shipping', 'billing', 'company')),
  name text,
  line1 text not null,
  line2 text,
  city text not null,
  region text,
  postal_code text not null,
  country text not null,
  phone text,
  is_default_shipping boolean not null default false,
  is_default_billing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists one_default_shipping_per_user
  on public.addresses(user_id)
  where is_default_shipping;

create unique index if not exists one_default_billing_per_user
  on public.addresses(user_id)
  where is_default_billing;

create table if not exists public.stripe_customers (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_payment_method_id text not null unique,
  brand text,
  last4 text,
  exp_month integer,
  exp_year integer,
  billing_address_id uuid references public.addresses(id),
  is_default boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists one_default_payment_method_per_user
  on public.saved_payment_methods(user_id)
  where is_default and status = 'active';

alter table public.profiles enable row level security;
alter table public.company_profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.stripe_customers enable row level security;
alter table public.saved_payment_methods enable row level security;

create policy "users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users can manage own company profiles"
  on public.company_profiles for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "users can manage own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can read own stripe customer"
  on public.stripe_customers for select
  using (auth.uid() = user_id);

create policy "users can read own payment methods"
  on public.saved_payment_methods for select
  using (auth.uid() = user_id);
