create extension if not exists "pgcrypto";

create type public.auction_status as enum ('draft', 'live', 'ended', 'cancelled');
create type public.profile_role as enum ('bidder', 'seller', 'admin');

create table if not exists public.profiles (
  id uuid primary key,
  name text not null,
  email text not null unique,
  roles public.profile_role[] not null default array['bidder']::public.profile_role[],
  banned_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.auctions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id),
  title text not null,
  description text not null default '',
  category text not null default 'Watches',
  starting_price_cents integer not null check (starting_price_cents >= 0),
  reserve_price_cents integer check (reserve_price_cents is null or reserve_price_cents >= 0),
  current_price_cents integer not null check (current_price_cents >= 0),
  status public.auction_status not null default 'draft',
  ends_at timestamptz not null,
  winner_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auction_photos (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  bidder_id uuid not null references public.profiles(id),
  amount_cents integer not null check (amount_cents >= 0),
  voided_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.watchlist (
  user_id uuid not null references public.profiles(id) on delete cascade,
  auction_id uuid not null references public.auctions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, auction_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.auctions enable row level security;
alter table public.auction_photos enable row level security;
alter table public.bids enable row level security;
alter table public.watchlist enable row level security;
alter table public.notifications enable row level security;

create policy "public can read live auctions"
  on public.auctions for select
  using (status = 'live');

create policy "public can read live auction photos"
  on public.auction_photos for select
  using (exists (
    select 1 from public.auctions a
    where a.id = auction_id and a.status = 'live'
  ));

create policy "users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users can read own watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "users can mutate own watchlist"
  on public.watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create or replace function public.place_bid(
  p_auction_id uuid,
  p_bidder_id uuid,
  p_amount_cents integer
) returns table (
  auction_id uuid,
  current_price_cents integer,
  bid_count bigint,
  leader_id uuid,
  committed_at timestamptz
) language plpgsql security definer set search_path = public as $$
declare
  v_auction public.auctions%rowtype;
  v_bidder public.profiles%rowtype;
  v_minimum integer;
begin
  select * into v_auction
  from public.auctions
  where id = p_auction_id
  for update;

  if not found then
    raise exception 'AUCTION_NOT_FOUND';
  end if;

  select * into v_bidder
  from public.profiles
  where id = p_bidder_id;

  if not found then
    raise exception 'AUTH_REQUIRED';
  end if;

  if v_auction.status <> 'live' then
    raise exception 'AUCTION_NOT_LIVE';
  end if;

  if now() >= v_auction.ends_at then
    raise exception 'AUCTION_ENDED';
  end if;

  if v_bidder.banned_at is not null then
    raise exception 'USER_BANNED';
  end if;

  if not ('bidder'::public.profile_role = any(v_bidder.roles)) then
    raise exception 'BIDDER_ROLE_REQUIRED';
  end if;

  if array_length(v_bidder.roles, 1) = 1 and 'admin'::public.profile_role = any(v_bidder.roles) then
    raise exception 'ADMIN_CANNOT_BID';
  end if;

  if v_auction.seller_id = p_bidder_id then
    raise exception 'SELLER_CANNOT_BID';
  end if;

  v_minimum := greatest(v_auction.current_price_cents + 100, v_auction.starting_price_cents);
  if p_amount_cents < v_minimum then
    raise exception 'BID_TOO_LOW';
  end if;

  insert into public.bids (auction_id, bidder_id, amount_cents)
  values (p_auction_id, p_bidder_id, p_amount_cents);

  update public.auctions
  set current_price_cents = p_amount_cents,
      updated_at = now()
  where id = p_auction_id;

  return query
    select
      p_auction_id,
      p_amount_cents,
      (select count(*) from public.bids where bids.auction_id = p_auction_id and voided_at is null),
      p_bidder_id,
      now();
end;
$$;
