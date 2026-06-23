# Paddle Auction Local Setup

This project now has a backend foundation:

- `apps/auction-web`: Next.js auction app with API routes.
- `apps/realtime`: separate Socket.IO service for live price and viewer events.
- `packages/db`: Supabase server client and auction repository functions.
- `packages/shared`: shared bidding rules and realtime event names.
- `supabase/schema.sql`: database tables, RLS policies, and `place_bid` RPC.
- `supabase/seed.sql`: demo profiles and auctions.

## 1. Create Supabase Tables

In your Supabase SQL editor, run:

```sql
-- First run the contents of supabase/schema.sql.
-- Then run the contents of supabase/seed.sql for demo data.
```

## 2. Add Environment Variables

Copy the example files:

```powershell
Copy-Item apps/auction-web/.env.example apps/auction-web/.env.local
Copy-Item apps/realtime/.env.example apps/realtime/.env
```

Then replace the placeholder values with your Supabase project URL, service role key, and one matching realtime secret in both files.

## 3. Run Locally

Start realtime:

```powershell
npm run auction:realtime
```

Start the web app in another terminal:

```powershell
npm run auction:web -- --hostname 127.0.0.1 --port 3100
```

Open `http://127.0.0.1:3100`.

The web app reads live auctions through `/api/auctions`, places bids through `/api/bids`, stores bids in Supabase through the `place_bid` RPC, and broadcasts price changes through the Socket.IO service.
