# Production Auth Account Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the production auth and account foundation for Paddle Live Auctions with Supabase Auth, MFA-aware seller/admin gating, profiles, addresses, company profiles, and Stripe saved payment method metadata.

**Architecture:** Supabase Auth owns identities, sessions, phone OTP, OAuth, and MFA. Next.js owns route guards, account screens, and API routes; Supabase Postgres owns app account data and RLS; Stripe owns payment method collection through SetupIntents. Implement in phases so every task leaves the app runnable.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Supabase Auth/Postgres, Stripe, Node test runner.

---

## Scope Check

The approved spec covers auth, profiles, seller readiness, address book, MFA, and saved payment methods. These are related subsystems, but the implementation must remain phased:

1. Shared account rules and tests.
2. Supabase schema/env/client foundation.
3. Auth routes and session shell.
4. Profile/company/address APIs and UI.
5. MFA policy and seller readiness.
6. Stripe saved payment methods metadata.

Do not implement seller payouts, marketplace disputes, refunds, tax/KYC, or real won-auction charging in this plan. Saved payment methods are only for future payment of won auctions.

## File Structure

Create or modify these files:

- `packages/shared/account-rules.js`: pure account readiness and MFA gating logic.
- `packages/shared/account-rules.d.ts`: shared types for TS imports.
- `packages/shared/account-rules.test.js`: Node tests for account guards.
- `supabase/schema.sql`: extend existing schema with account/payment tables and RLS.
- `apps/auction-web/.env.example`: add public Supabase anon key and Stripe vars.
- `apps/auction-web/package.json`: add `@supabase/ssr`, `@stripe/stripe-js`, and `stripe`.
- `apps/auction-web/src/lib/supabase/client.ts`: browser Supabase client.
- `apps/auction-web/src/lib/supabase/server.ts`: server Supabase client.
- `apps/auction-web/src/lib/account/account-types.ts`: app account types.
- `apps/auction-web/src/lib/account/account-api.ts`: client helpers for account APIs.
- `apps/auction-web/src/app/auth/page.tsx`: sign-in/sign-up UI.
- `apps/auction-web/src/app/auth/callback/route.ts`: OAuth callback route.
- `apps/auction-web/src/app/auth/mfa/page.tsx`: MFA challenge/enrollment UI.
- `apps/auction-web/src/app/account/page.tsx`: account settings shell.
- `apps/auction-web/src/app/account/AccountSettings.tsx`: profile/company/address/payment settings UI.
- `apps/auction-web/src/app/api/account/profile/route.ts`: profile read/update.
- `apps/auction-web/src/app/api/account/company/route.ts`: company profile read/upsert.
- `apps/auction-web/src/app/api/account/addresses/route.ts`: address list/create/update.
- `apps/auction-web/src/app/api/account/payment-methods/route.ts`: saved payment method list/default/delete.
- `apps/auction-web/src/app/api/account/payment-methods/setup-intent/route.ts`: create Stripe SetupIntent.
- `apps/auction-web/src/app/api/seller/readiness/route.ts`: seller readiness check.
- `apps/auction-web/src/app/layout.tsx`: add account-aware navigation links if needed.
- `apps/auction-web/src/app/styles.css`: account/auth UI styles.

## Task 1: Shared Account Rules

**Files:**
- Create: `packages/shared/account-rules.js`
- Create: `packages/shared/account-rules.d.ts`
- Create: `packages/shared/account-rules.test.js`
- Modify: `packages/shared/package.json`
- Modify: `package.json`

- [ ] **Step 1: Write failing tests**

Create `packages/shared/account-rules.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getMissingSellerReadiness,
  canPublishListing,
  requiresMfaForRole,
  canManagePaymentMethods,
} = require("./account-rules");

test("seller readiness requires company profile, company address, MFA, and active account", () => {
  const account = {
    roles: ["seller"],
    bannedAt: null,
    hasCompanyProfile: false,
    hasCompanyAddress: false,
    hasMfaEnrollment: false,
    assuranceLevel: "aal1",
  };

  assert.deepEqual(getMissingSellerReadiness(account), [
    "company_profile",
    "company_address",
    "mfa_enrollment",
    "mfa_challenge",
  ]);
  assert.equal(canPublishListing(account).ok, false);
});

test("seller can publish after company readiness and aal2 session", () => {
  const account = {
    roles: ["seller"],
    bannedAt: null,
    hasCompanyProfile: true,
    hasCompanyAddress: true,
    hasMfaEnrollment: true,
    assuranceLevel: "aal2",
  };

  assert.deepEqual(getMissingSellerReadiness(account), []);
  assert.deepEqual(canPublishListing(account), { ok: true, missing: [] });
});

test("banned sellers cannot publish even when setup is complete", () => {
  const account = {
    roles: ["seller"],
    bannedAt: "2026-06-22T00:00:00.000Z",
    hasCompanyProfile: true,
    hasCompanyAddress: true,
    hasMfaEnrollment: true,
    assuranceLevel: "aal2",
  };

  assert.deepEqual(canPublishListing(account), { ok: false, missing: ["active_account"] });
});

test("MFA is required for sellers and admins but optional for bidders", () => {
  assert.equal(requiresMfaForRole(["bidder"]), false);
  assert.equal(requiresMfaForRole(["bidder", "seller"]), true);
  assert.equal(requiresMfaForRole(["admin"]), true);
});

test("payment method changes require authenticated aal2 for seller or admin but only auth for bidder", () => {
  assert.equal(canManagePaymentMethods({ roles: ["bidder"], isAuthenticated: true, assuranceLevel: "aal1" }).ok, true);
  assert.deepEqual(canManagePaymentMethods({ roles: ["seller"], isAuthenticated: true, assuranceLevel: "aal1" }), {
    ok: false,
    reason: "mfa_required",
  });
  assert.equal(canManagePaymentMethods({ roles: ["seller"], isAuthenticated: true, assuranceLevel: "aal2" }).ok, true);
  assert.deepEqual(canManagePaymentMethods({ roles: ["bidder"], isAuthenticated: false, assuranceLevel: "aal1" }), {
    ok: false,
    reason: "auth_required",
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run test:account
```

Expected: fails because `test:account` and `account-rules.js` do not exist.

- [ ] **Step 3: Add shared account rules**

Create `packages/shared/account-rules.js`:

```js
function hasAnyRole(roles, candidates) {
  return candidates.some((role) => roles.includes(role));
}

function requiresMfaForRole(roles) {
  return hasAnyRole(roles || [], ["seller", "admin"]);
}

function getMissingSellerReadiness(account) {
  const missing = [];
  if (account.bannedAt) missing.push("active_account");
  if (!account.hasCompanyProfile) missing.push("company_profile");
  if (!account.hasCompanyAddress) missing.push("company_address");
  if (!account.hasMfaEnrollment) missing.push("mfa_enrollment");
  if (account.assuranceLevel !== "aal2") missing.push("mfa_challenge");
  return missing;
}

function canPublishListing(account) {
  const missing = getMissingSellerReadiness(account);
  return { ok: missing.length === 0, missing };
}

function canManagePaymentMethods(account) {
  if (!account.isAuthenticated) return { ok: false, reason: "auth_required" };
  if (requiresMfaForRole(account.roles || []) && account.assuranceLevel !== "aal2") {
    return { ok: false, reason: "mfa_required" };
  }
  return { ok: true };
}

module.exports = {
  canManagePaymentMethods,
  canPublishListing,
  getMissingSellerReadiness,
  requiresMfaForRole,
};
```

Create `packages/shared/account-rules.d.ts`:

```ts
export type ProfileRole = "bidder" | "seller" | "admin";
export type AssuranceLevel = "aal1" | "aal2";

export type SellerReadinessAccount = {
  roles: ProfileRole[];
  bannedAt: string | null;
  hasCompanyProfile: boolean;
  hasCompanyAddress: boolean;
  hasMfaEnrollment: boolean;
  assuranceLevel: AssuranceLevel;
};

export type PaymentMethodGuardAccount = {
  roles: ProfileRole[];
  isAuthenticated: boolean;
  assuranceLevel: AssuranceLevel;
};

export function requiresMfaForRole(roles: ProfileRole[]): boolean;
export function getMissingSellerReadiness(account: SellerReadinessAccount): string[];
export function canPublishListing(account: SellerReadinessAccount): { ok: boolean; missing: string[] };
export function canManagePaymentMethods(account: PaymentMethodGuardAccount): { ok: true } | { ok: false; reason: string };
```

Modify `packages/shared/package.json`:

```json
{
  "name": "@paddle/shared",
  "version": "0.1.0",
  "private": true,
  "main": "auction-rules.js",
  "exports": {
    "./auction-rules": "./auction-rules.js",
    "./realtime-events": "./realtime-events.js",
    "./account-rules": "./account-rules.js"
  }
}
```

Modify root `package.json` scripts:

```json
"test": "node --test src/lib/*.test.js packages/shared/*.test.js",
"test:auction": "node --test packages/shared/auction-rules.test.js",
"test:account": "node --test packages/shared/account-rules.test.js"
```

- [ ] **Step 4: Run tests**

Run:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run test:account
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```powershell
& 'C:\Program Files\Git\cmd\git.exe' add packages/shared/account-rules.js packages/shared/account-rules.d.ts packages/shared/account-rules.test.js packages/shared/package.json package.json
& 'C:\Program Files\Git\cmd\git.exe' commit -m "feat: add account readiness rules"
```

## Task 2: Supabase Account Schema And Environment

**Files:**
- Modify: `supabase/schema.sql`
- Modify: `apps/auction-web/.env.example`

- [ ] **Step 1: Add schema section**

Append to `supabase/schema.sql` after the existing table definitions and before policies when possible:

```sql
alter type public.profile_role add value if not exists 'seller';
alter type public.profile_role add value if not exists 'admin';

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

alter table public.company_profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.stripe_customers enable row level security;
alter table public.saved_payment_methods enable row level security;

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
```

- [ ] **Step 2: Update env example**

Modify `apps/auction-web/.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REALTIME_SERVER_URL=http://127.0.0.1:4100
REALTIME_INTERNAL_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_replace_me
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
```

- [ ] **Step 3: Validate SQL text locally**

Run:

```powershell
rg -n "company_profiles|addresses|stripe_customers|saved_payment_methods|one_default_shipping_per_user" supabase/schema.sql
```

Expected: each table/index name appears.

- [ ] **Step 4: Commit**

```powershell
& 'C:\Program Files\Git\cmd\git.exe' add supabase/schema.sql apps/auction-web/.env.example
& 'C:\Program Files\Git\cmd\git.exe' commit -m "feat: add account database schema"
```

## Task 3: Supabase Clients And Auth Pages

**Files:**
- Modify: `apps/auction-web/package.json`
- Create: `apps/auction-web/src/lib/supabase/client.ts`
- Create: `apps/auction-web/src/lib/supabase/server.ts`
- Create: `apps/auction-web/src/app/auth/page.tsx`
- Create: `apps/auction-web/src/app/auth/callback/route.ts`
- Modify: `apps/auction-web/src/app/styles.css`

- [ ] **Step 1: Add dependencies**

Modify `apps/auction-web/package.json` dependencies:

```json
"dependencies": {
  "@stripe/stripe-js": "^7.10.0",
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.89.0",
  "next": "^16.1.5",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "socket.io-client": "^4.8.1",
  "stripe": "^20.1.0"
}
```

Run:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' install
```

- [ ] **Step 2: Add Supabase browser client**

Create `apps/auction-web/src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase browser client is not configured.");
  }

  return createBrowserClient(url, anonKey);
}
```

- [ ] **Step 3: Add Supabase server client**

Create `apps/auction-web/src/lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase server client is not configured.");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
```

- [ ] **Step 4: Add auth page**

Create `apps/auction-web/src/app/auth/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

type AuthMode = "password" | "phone";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  async function signInWithPassword() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? "Could not sign in. Check your details and try again." : "Signed in.");
  }

  async function signUpWithPassword() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? "Could not create account." : "Check your email to confirm your account.");
  }

  async function signInWithProvider(provider: "google" | "apple" | "facebook") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function sendPhoneOtp() {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setMessage(error ? "Could not send code." : "Code sent. Enter the 6 digit code.");
  }

  async function verifyPhoneOtp() {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setMessage(error ? "Invalid or expired code." : "Phone verified.");
  }

  return (
    <main className="account-page">
      <section className="auth-panel">
        <p className="eyebrow">Paddle account</p>
        <h1>Sign in to bid, sell, and manage won auctions.</h1>
        <div className="segmented">
          <button onClick={() => setMode("password")} aria-pressed={mode === "password"}>Email</button>
          <button onClick={() => setMode("phone")} aria-pressed={mode === "phone"}>Phone OTP</button>
        </div>
        {mode === "password" ? (
          <div className="form-stack">
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
            <button onClick={signInWithPassword}>Sign in</button>
            <button className="secondary" onClick={signUpWithPassword}>Create account</button>
          </div>
        ) : (
          <div className="form-stack">
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+1 555 0100" />
            <button onClick={sendPhoneOtp}>Send code</button>
            <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="6 digit code" inputMode="numeric" />
            <button className="secondary" onClick={verifyPhoneOtp}>Verify code</button>
          </div>
        )}
        <div className="provider-row">
          <button onClick={() => signInWithProvider("google")}>Google</button>
          <button onClick={() => signInWithProvider("apple")}>Apple</button>
          <button onClick={() => signInWithProvider("facebook")}>Facebook</button>
        </div>
        {message ? <p className="notice">{message}</p> : null}
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Add auth callback**

Create `apps/auction-web/src/app/auth/callback/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
```

- [ ] **Step 6: Add minimal styles**

Append to `apps/auction-web/src/app/styles.css`:

```css
.account-page {
  min-height: 100vh;
  padding: 48px 24px;
  background: #f7f5ef;
  color: #1b1a16;
}

.auth-panel {
  max-width: 440px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e7e5de;
  border-radius: 8px;
  padding: 24px;
}

.segmented,
.provider-row,
.form-stack {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.segmented {
  grid-template-columns: 1fr 1fr;
}

.provider-row {
  grid-template-columns: repeat(3, 1fr);
}

.form-stack input {
  border: 1px solid #dedbd2;
  border-radius: 8px;
  padding: 12px;
  font: inherit;
}

.form-stack button,
.provider-row button,
.segmented button {
  border: 1px solid #1b1a16;
  border-radius: 8px;
  background: #1b1a16;
  color: #fff;
  padding: 11px 12px;
  font-weight: 700;
  cursor: pointer;
}

.form-stack .secondary,
.segmented button[aria-pressed="false"],
.provider-row button {
  background: #fff;
  color: #1b1a16;
}
```

- [ ] **Step 7: Build**

Run:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run build --workspace @paddle/auction-web
```

Expected: build passes. In this environment, Next may warn about SWC and use WASM fallback.

- [ ] **Step 8: Commit**

```powershell
& 'C:\Program Files\Git\cmd\git.exe' add apps/auction-web/package.json package-lock.json apps/auction-web/src/lib/supabase apps/auction-web/src/app/auth apps/auction-web/src/app/styles.css
& 'C:\Program Files\Git\cmd\git.exe' commit -m "feat: add Supabase auth entrypoints"
```

## Task 4: Account Types, APIs, And Settings UI

**Files:**
- Create: `apps/auction-web/src/lib/account/account-types.ts`
- Create: `apps/auction-web/src/lib/account/account-api.ts`
- Create: `apps/auction-web/src/app/account/page.tsx`
- Create: `apps/auction-web/src/app/account/AccountSettings.tsx`
- Create: `apps/auction-web/src/app/api/account/profile/route.ts`
- Create: `apps/auction-web/src/app/api/account/company/route.ts`
- Create: `apps/auction-web/src/app/api/account/addresses/route.ts`

- [ ] **Step 1: Add account types**

Create `apps/auction-web/src/lib/account/account-types.ts`:

```ts
export type AddressType = "shipping" | "billing" | "company";

export type AccountProfile = {
  id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  roles: Array<"bidder" | "seller" | "admin">;
};

export type CompanyProfile = {
  id?: string;
  company_name: string;
  legal_name: string | null;
  website_url: string | null;
  support_email: string | null;
  support_phone: string | null;
};

export type AddressInput = {
  id?: string;
  type: AddressType;
  name: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
};
```

- [ ] **Step 2: Add client API helpers**

Create `apps/auction-web/src/lib/account/account-api.ts`:

```ts
import type { AddressInput, CompanyProfile } from "./account-types";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init && init.headers ? init.headers : {}),
    },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload as T;
}

export function updateProfile(displayName: string) {
  return requestJson("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify({ display_name: displayName }),
  });
}

export function saveCompany(company: CompanyProfile) {
  return requestJson("/api/account/company", {
    method: "PUT",
    body: JSON.stringify(company),
  });
}

export function saveAddress(address: AddressInput) {
  return requestJson("/api/account/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });
}
```

- [ ] **Step 3: Add account page**

Create `apps/auction-web/src/app/account/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { AccountSettings } from "./AccountSettings";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/auth");

  return <AccountSettings email={data.user.email || null} phone={data.user.phone || null} />;
}
```

- [ ] **Step 4: Add account settings component**

Create `apps/auction-web/src/app/account/AccountSettings.tsx`:

```tsx
"use client";

import { useState } from "react";
import { saveAddress, saveCompany, updateProfile } from "../../lib/account/account-api";

export function AccountSettings({ email, phone }: { email: string | null; phone: string | null }) {
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    }
  }

  return (
    <main className="account-page">
      <section className="settings-grid">
        <article className="settings-panel">
          <h1>Account settings</h1>
          <p>Email: {email || "Not connected"}</p>
          <p>Phone: {phone || "Not connected"}</p>
        </article>
        <article className="settings-panel">
          <h2>User profile</h2>
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display name" />
          <button onClick={() => run(() => updateProfile(displayName), "Profile saved")}>Save profile</button>
        </article>
        <article className="settings-panel">
          <h2>Company profile</h2>
          <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Company name" />
          <button onClick={() => run(() => saveCompany({ company_name: companyName, legal_name: null, website_url: null, support_email: email, support_phone: phone }), "Company saved")}>Save company</button>
        </article>
        <article className="settings-panel">
          <h2>Address book</h2>
          <input value={line1} onChange={(event) => setLine1(event.target.value)} placeholder="Address line 1" />
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" />
          <input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} placeholder="Postal code" />
          <button onClick={() => run(() => saveAddress({ type: "shipping", name: null, line1, line2: null, city, region: null, postal_code: postalCode, country: "US", phone, is_default_shipping: true, is_default_billing: false }), "Address saved")}>Save shipping address</button>
        </article>
        {message ? <p className="notice">{message}</p> : null}
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Add API routes**

Create `apps/auction-web/src/app/api/account/profile/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  const displayName = String(body.display_name || "").trim();
  if (!displayName) return NextResponse.json({ error: "Display name is required" }, { status: 400 });

  const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", data.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
```

Create `apps/auction-web/src/app/api/account/company/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  const companyName = String(body.company_name || "").trim();
  if (!companyName) return NextResponse.json({ error: "Company name is required" }, { status: 400 });

  const { error } = await supabase.from("company_profiles").upsert({
    owner_id: data.user.id,
    company_name: companyName,
    legal_name: body.legal_name || null,
    website_url: body.website_url || null,
    support_email: body.support_email || null,
    support_phone: body.support_phone || null,
  }, { onConflict: "owner_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
```

Create `apps/auction-web/src/app/api/account/addresses/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  for (const key of ["type", "line1", "city", "postal_code", "country"]) {
    if (!String(body[key] || "").trim()) {
      return NextResponse.json({ error: `${key} is required` }, { status: 400 });
    }
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: data.user.id,
    type: body.type,
    name: body.name || null,
    line1: body.line1,
    line2: body.line2 || null,
    city: body.city,
    region: body.region || null,
    postal_code: body.postal_code,
    country: body.country,
    phone: body.phone || null,
    is_default_shipping: !!body.is_default_shipping,
    is_default_billing: !!body.is_default_billing,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Add settings styles**

Append:

```css
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  max-width: 1040px;
  margin: 0 auto;
}

.settings-panel {
  background: #fff;
  border: 1px solid #e7e5de;
  border-radius: 8px;
  padding: 20px;
}

.settings-panel input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  border: 1px solid #dedbd2;
  border-radius: 8px;
  padding: 11px;
  font: inherit;
}

.settings-panel button {
  margin-top: 12px;
  border: 0;
  border-radius: 8px;
  background: #1b1a16;
  color: #fff;
  padding: 11px 13px;
  font-weight: 700;
}
```

- [ ] **Step 7: Verify**

Run:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run build --workspace @paddle/auction-web
```

Expected: TypeScript and build pass.

- [ ] **Step 8: Commit**

```powershell
& 'C:\Program Files\Git\cmd\git.exe' add apps/auction-web/src/lib/account apps/auction-web/src/app/account apps/auction-web/src/app/api/account apps/auction-web/src/app/styles.css
& 'C:\Program Files\Git\cmd\git.exe' commit -m "feat: add account settings foundation"
```

## Task 5: MFA And Seller Readiness API

**Files:**
- Create: `apps/auction-web/src/app/auth/mfa/page.tsx`
- Create: `apps/auction-web/src/app/api/seller/readiness/route.ts`
- Modify: `apps/auction-web/src/app/account/AccountSettings.tsx`

- [ ] **Step 1: Add MFA page**

Create `apps/auction-web/src/app/auth/mfa/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

export default function MfaPage() {
  const supabase = createSupabaseBrowserClient();
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Set up or verify two-factor authentication.");

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data, error }) => {
      if (error) setMessage("Could not load factors.");
      const factor = data?.totp?.[0] || data?.phone?.[0];
      if (factor) setFactorId(factor.id);
    });
  }, [supabase]);

  async function challenge() {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) setMessage("Could not start challenge.");
    else {
      setChallengeId(data.id);
      setMessage("Enter your authenticator code.");
    }
  }

  async function verify() {
    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
    setMessage(error ? "Invalid code." : "Two-factor authentication verified.");
  }

  return (
    <main className="account-page">
      <section className="auth-panel">
        <p className="eyebrow">Security</p>
        <h1>Two-factor authentication</h1>
        <p>{message}</p>
        <input value={factorId} onChange={(event) => setFactorId(event.target.value)} placeholder="Factor ID" />
        <button onClick={challenge}>Start challenge</button>
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="6 digit code" inputMode="numeric" />
        <button onClick={verify}>Verify</button>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Add seller readiness API**

Create `apps/auction-web/src/app/api/seller/readiness/route.ts`:

```ts
import { canPublishListing } from "@paddle/shared/account-rules";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles,banned_at")
    .eq("id", userData.user.id)
    .single();

  const { data: company } = await supabase
    .from("company_profiles")
    .select("id")
    .eq("owner_id", userData.user.id)
    .maybeSingle();

  const { data: companyAddress } = await supabase
    .from("addresses")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("type", "company")
    .maybeSingle();

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const hasMfaEnrollment = !!((factors?.totp?.length || 0) + (factors?.phone?.length || 0));

  const result = canPublishListing({
    roles: profile?.roles || ["bidder"],
    bannedAt: profile?.banned_at || null,
    hasCompanyProfile: !!company,
    hasCompanyAddress: !!companyAddress,
    hasMfaEnrollment,
    assuranceLevel: aal?.currentLevel === "aal2" ? "aal2" : "aal1",
  });

  return NextResponse.json(result);
}
```

- [ ] **Step 3: Add readiness section to settings**

In `AccountSettings.tsx`, add:

```tsx
async function checkSellerReadiness() {
  try {
    const response = await fetch("/api/seller/readiness");
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Readiness check failed");
    setMessage(payload.ok ? "Seller account is ready to publish." : `Missing: ${payload.missing.join(", ")}`);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Readiness check failed");
  }
}
```

Add this card inside the settings grid:

```tsx
<article className="settings-panel">
  <h2>Seller readiness</h2>
  <p>Company profile, company address, and verified 2FA are required before publishing listings.</p>
  <button onClick={checkSellerReadiness}>Check readiness</button>
</article>
```

- [ ] **Step 4: Verify**

Run:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run test:account
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run build --workspace @paddle/auction-web
```

Expected: account tests pass and app builds.

- [ ] **Step 5: Commit**

```powershell
& 'C:\Program Files\Git\cmd\git.exe' add apps/auction-web/src/app/auth/mfa apps/auction-web/src/app/api/seller apps/auction-web/src/app/account/AccountSettings.tsx
& 'C:\Program Files\Git\cmd\git.exe' commit -m "feat: add mfa readiness guards"
```

## Task 6: Stripe Saved Payment Methods

**Files:**
- Create: `apps/auction-web/src/lib/stripe/server.ts`
- Create: `apps/auction-web/src/app/api/account/payment-methods/setup-intent/route.ts`
- Create: `apps/auction-web/src/app/api/account/payment-methods/route.ts`
- Modify: `apps/auction-web/src/app/account/AccountSettings.tsx`

- [ ] **Step 1: Add Stripe server helper**

Create `apps/auction-web/src/lib/stripe/server.ts`:

```ts
import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe is not configured.");
  return new Stripe(secretKey, { apiVersion: "2025-11-17.clover" });
}
```

If installed Stripe types reject this API version, use the latest supported literal from the installed package error message and document the change in the commit.

- [ ] **Step 2: Add SetupIntent route**

Create `apps/auction-web/src/app/api/account/payment-methods/setup-intent/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { getStripe } from "../../../../../lib/stripe/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const stripe = getStripe();
  const { data: existing } = await supabase
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: userData.user.email || undefined });
    customerId = customer.id;
    await supabase.from("stripe_customers").insert({ user_id: userData.user.id, stripe_customer_id: customerId });
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
    usage: "off_session",
  });

  return NextResponse.json({ clientSecret: setupIntent.client_secret });
}
```

- [ ] **Step 3: Add payment method list route**

Create `apps/auction-web/src/app/api/account/payment-methods/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: methods, error } = await supabase
    .from("saved_payment_methods")
    .select("id,brand,last4,exp_month,exp_year,is_default,status")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ methods });
}
```

- [ ] **Step 4: Add account UI starter for payment setup**

In `AccountSettings.tsx`, add:

```tsx
async function createSetupIntent() {
  try {
    const response = await fetch("/api/account/payment-methods/setup-intent", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not create setup intent");
    setMessage("Stripe SetupIntent created. Next step: mount Stripe Elements with the returned client secret.");
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Could not create setup intent");
  }
}
```

Add this card:

```tsx
<article className="settings-panel">
  <h2>Saved payment methods</h2>
  <p>Cards are saved securely through Stripe for paying won auctions.</p>
  <button onClick={createSetupIntent}>Start adding card</button>
</article>
```

- [ ] **Step 5: Verify**

Run:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run build --workspace @paddle/auction-web
```

Expected: build passes without Stripe env at build time. Runtime route returns a clear error if `STRIPE_SECRET_KEY` is missing.

- [ ] **Step 6: Commit**

```powershell
& 'C:\Program Files\Git\cmd\git.exe' add apps/auction-web/src/lib/stripe apps/auction-web/src/app/api/account/payment-methods apps/auction-web/src/app/account/AccountSettings.tsx
& 'C:\Program Files\Git\cmd\git.exe' commit -m "feat: add saved payment method setup"
```

## Final Verification

- [ ] Run shared account tests:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run test:account
```

- [ ] Run all shared tests:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' test
```

- [ ] Run TypeScript:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
```

- [ ] Build the auction app:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run build --workspace @paddle/auction-web
```

- [ ] Start local app:

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\npm.cmd' run auction:web
```

- [ ] Browser-check:

Open `http://localhost:3100/auth` and `http://localhost:3100/account`. Without real Supabase env values, `/account` should redirect to `/auth`. With env configured, sign-in should work through enabled Supabase providers.

## Self-Review Notes

Spec coverage:

- Email/password, OAuth, phone OTP: Task 3.
- User profile, company profile, address book: Task 4.
- Seller/admin MFA and readiness: Tasks 1 and 5.
- Saved payment methods for won auctions: Task 6.
- RLS/schema: Task 2.
- Testing and rollout: Tasks 1 through 6 plus final verification.

Known limits:

- Full Stripe Elements card entry UI is intentionally deferred until after the SetupIntent route exists and Stripe keys are configured.
- Real OAuth/phone/MFA behavior requires Supabase dashboard provider configuration.
- Payment charging for won auctions is outside this plan.
