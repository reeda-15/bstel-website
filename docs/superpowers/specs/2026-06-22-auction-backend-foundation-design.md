# Auction Backend Foundation Design

## Goal

Convert the Paddle auction prototype from a static in-memory demo into a real backend-backed application foundation using a Next.js web app, Supabase data layer, and a separate Socket.IO realtime service.

## Scope For This Pass

This pass builds the foundation, not the full marketplace. It creates a monorepo-style structure alongside the existing site, adds shared auction rules, Supabase schema and RPC definitions, a Next.js auction app shell with API routes, and a realtime service skeleton. The first working backend behavior is server-authoritative auction reads and bid validation boundaries.

## Architecture

- `apps/auction-web` contains a Next.js App Router app for the auction UI and route handlers.
- `apps/realtime` contains a long-running Socket.IO service that can join auction rooms and broadcast committed changes.
- `packages/shared` contains money, role, event, and bid-validation helpers shared by web and realtime code.
- `packages/db` contains lazy Supabase server-client helpers and typed API wrappers.
- `supabase` contains SQL schema, RLS policy, seed data, and RPC function definitions.

## Data Flow

The web app fetches auctions through server-side API routes. Bid placement validates the request server-side, then calls a Supabase RPC that locks and updates the auction transactionally. After a successful commit, the API route notifies the realtime service, and Socket.IO broadcasts updated auction state to subscribed clients.

## First Milestone Behavior

- Demo auction data exists in Supabase seed SQL.
- Bids are represented in cents and must meet a 100-cent increment.
- Admin-only users cannot bid.
- Sellers cannot bid on their own auctions.
- Banned users cannot bid.
- Realtime events are defined in shared code, even if the first local run uses a mocked or unconnected Socket.IO URL.

## Environment

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REALTIME_SERVER_URL`
- `REALTIME_INTERNAL_SECRET`

Local development can start without credentials, but backend API routes will return explicit configuration errors until Supabase values are set.

## Testing

Shared auction rules are covered first with Node's built-in test runner. Route handlers and realtime integration are intentionally kept thin in this pass because they depend on Supabase and Socket.IO packages plus credentials. Once dependencies and credentials are present, integration tests should be added for bid RPC success, bid rejection, and realtime broadcast.
