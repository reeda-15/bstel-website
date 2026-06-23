insert into public.profiles (id, name, email, roles)
values
  ('00000000-0000-4000-8000-000000000001', 'Demo Bidder', 'bidder@example.com', array['bidder']::public.profile_role[]),
  ('00000000-0000-4000-8000-000000000002', 'Your Studio', 'seller@example.com', array['seller','bidder']::public.profile_role[]),
  ('00000000-0000-4000-8000-000000000003', 'Demo Admin', 'admin@example.com', array['admin']::public.profile_role[])
on conflict (id) do nothing;

insert into public.auctions (
  id,
  seller_id,
  title,
  description,
  category,
  starting_price_cents,
  reserve_price_cents,
  current_price_cents,
  status,
  ends_at
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002',
    'Leica M6 Rangefinder, 1984 original leatherette',
    'A clean rangefinder kit with cap, strap, and documented service history.',
    'Cameras',
    180000,
    200000,
    184000,
    'live',
    now() + interval '2 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    'Cartier Tank Solo, stainless steel',
    'Boxed watch with recent service and light signs of wear.',
    'Jewelry',
    250000,
    300000,
    268000,
    'live',
    now() + interval '45 minutes'
  )
on conflict (id) do nothing;
