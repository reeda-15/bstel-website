# Auction Backend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first backend-connected foundation for the Paddle auction platform.

**Architecture:** Add a monorepo-style auction system beside the existing Next site. Shared rule helpers are tested first, Supabase schema/RPCs define durable state, the auction web app uses API routes for backend access, and the realtime service owns Socket.IO rooms.

**Tech Stack:** Next.js App Router, React, Supabase, Socket.IO, Node test runner, TypeScript-flavored source files.

---

### Task 1: Shared Auction Rules

**Files:**
- Create: `packages/shared/auction-rules.js`
- Create: `packages/shared/auction-rules.d.ts`
- Test: `packages/shared/auction-rules.test.js`

- [ ] Write tests for money formatting and bid validation.
- [ ] Run tests and confirm they fail before implementation.
- [ ] Implement the shared rule helpers.
- [ ] Run tests and confirm they pass.

### Task 2: Supabase Data Layer

**Files:**
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`
- Create: `packages/db/supabase-server.ts`
- Create: `packages/db/auction-repository.ts`

- [ ] Define profiles, auctions, auction_photos, bids, watchlist, and notifications tables.
- [ ] Add RLS policy skeletons and RPC functions for placing bids.
- [ ] Add lazy Supabase server-client helpers.
- [ ] Add repository wrappers that keep Supabase initialization inside functions.

### Task 3: Next Auction Web App

**Files:**
- Create: `apps/auction-web/package.json`
- Create: `apps/auction-web/next.config.ts`
- Create: `apps/auction-web/tsconfig.json`
- Create: `apps/auction-web/src/app/layout.tsx`
- Create: `apps/auction-web/src/app/page.tsx`
- Create: `apps/auction-web/src/app/api/auctions/route.ts`
- Create: `apps/auction-web/src/app/api/bids/route.ts`
- Create: `apps/auction-web/src/components/AuctionShell.tsx`

- [ ] Add a Next app shell separate from the existing site.
- [ ] Add route handlers for auction reads and bid placement.
- [ ] Add a client auction UI that fetches from `/api/auctions`.

### Task 4: Realtime Service

**Files:**
- Create: `apps/realtime/package.json`
- Create: `apps/realtime/src/server.ts`
- Create: `apps/realtime/src/events.ts`

- [ ] Add a Socket.IO server with authenticated room joins.
- [ ] Add internal broadcast endpoint for committed auction changes.
- [ ] Keep all event names shared with `packages/shared`.

### Task 5: Workspace Scripts And Verification

**Files:**
- Modify: `package.json`

- [ ] Add scripts for shared tests, auction web dev, and realtime dev.
- [ ] Install missing dependencies if needed.
- [ ] Run shared tests.
- [ ] Run type/build checks when dependencies are available.
