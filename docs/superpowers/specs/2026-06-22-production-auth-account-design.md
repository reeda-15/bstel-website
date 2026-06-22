# Production Auth And Account Design

Date: 2026-06-22
Project: Paddle Live Auctions

## Goal

Build the production account foundation for the real Next.js + Supabase auction app. The feature set covers email/password login, Google/Apple/Facebook OAuth login, phone OTP login, linked login methods, two-factor authentication, user profiles, company profiles, address book, and saved payment methods for paying for won auctions.

This design targets `apps/auction-web`, not the static HTML prototype. The static page remains a visual reference only.

## Selected Approach

Use phased production auth:

1. Supabase Auth for identity, sessions, OAuth, phone OTP, and MFA.
2. Supabase Postgres for app-owned account data and security rules.
3. Stripe for saved payment methods, with only safe Stripe metadata stored locally.
4. Existing Socket.IO realtime service remains focused on live auction events and does not own auth.

This avoids fake security UI and keeps payment handling outside the app database.

## Architecture

Supabase Auth is the source of truth for:

- Email/password credentials.
- Google, Apple, and Facebook OAuth identities.
- Phone OTP identity.
- Linked login identities.
- MFA factors and authentication assurance level.
- User sessions.

The Next.js app owns:

- Auth pages and redirects.
- Server/client Supabase clients.
- Account settings screens.
- Profile, company, address, and payment metadata APIs.
- Route and action guards for seller/admin requirements.

Stripe owns:

- Payment method collection.
- SetupIntent confirmation.
- Customer payment method attachment.
- Future won-auction payment charges.

The database owns:

- App role flags.
- Seller readiness state.
- Company profile data.
- Address data.
- Stripe customer/payment method metadata.
- Row Level Security policies.

## Auth Methods

The sign-in UI supports:

- Email/password sign in and sign up.
- Google OAuth.
- Apple OAuth.
- Facebook OAuth.
- Phone OTP sign in.

Users may link multiple login methods to one account. Account Settings includes a Login Methods section showing connected email, phone, Google, Apple, and Facebook identities.

Phone OTP requires a configured SMS provider and rate limits. The UI must show resend cooldown, invalid code, and expired code states.

## MFA Policy

MFA is required for sellers and admins, and optional for bidders.

Supported factors:

- Authenticator app / TOTP.
- Phone MFA when Supabase phone MFA and SMS provider configuration are available.

TOTP is the required baseline factor for sellers and admins. Phone MFA can be offered in addition to TOTP after SMS is configured, but seller/admin enforcement must not depend on SMS being available.

Protected actions require an MFA-verified session:

- Publishing an auction listing.
- Seller account changes that affect listings.
- Admin moderation actions.
- Payment method changes.
- Deleting security factors.

If a bidder has not enabled MFA, they can still browse, bid, and pay for won auctions. If a bidder enables MFA, login must respect the challenge flow.

If a seller or admin signs in without MFA enrollment or verification, the app routes them to the security setup/challenge flow before allowing protected actions.

## Data Model

Supabase Auth `auth.users` remains the identity table. App tables reference `auth.users.id`.

### `profiles`

Extends the current profile model.

Fields:

- `id uuid primary key references auth.users(id)`
- `display_name text not null`
- `avatar_url text`
- `email text`
- `phone text`
- `roles profile_role[] not null default array['bidder']`
- `default_company_id uuid`
- `onboarding_completed_at timestamptz`
- `banned_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

### `company_profiles`

Stores seller identity and readiness data.

Fields:

- `id uuid primary key`
- `owner_id uuid references auth.users(id)`
- `company_name text not null`
- `legal_name text`
- `tax_id text`
- `website_url text`
- `support_email text`
- `support_phone text`
- `verification_status text not null default 'unverified'`
- `created_at timestamptz`
- `updated_at timestamptz`

Company profile is optional for bidders and required before sellers publish listings.

### `addresses`

Stores user-owned addresses.

Fields:

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `company_id uuid references company_profiles(id)`
- `type text not null check type in ('shipping', 'billing', 'company')`
- `name text`
- `line1 text not null`
- `line2 text`
- `city text not null`
- `region text`
- `postal_code text not null`
- `country text not null`
- `phone text`
- `is_default_shipping boolean not null default false`
- `is_default_billing boolean not null default false`
- `created_at timestamptz`
- `updated_at timestamptz`

Rules:

- One default shipping address per user.
- One default billing address per user.
- Company address is required for seller readiness.
- Default address rules should be enforced with partial unique indexes, not only client-side validation.

### `stripe_customers`

Maps app users to Stripe customers.

Fields:

- `user_id uuid primary key references auth.users(id)`
- `stripe_customer_id text not null unique`
- `created_at timestamptz`
- `updated_at timestamptz`

### `saved_payment_methods`

Stores safe display metadata only.

Fields:

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `stripe_payment_method_id text not null unique`
- `brand text`
- `last4 text`
- `exp_month integer`
- `exp_year integer`
- `billing_address_id uuid references addresses(id)`
- `is_default boolean not null default false`
- `status text not null default 'active'`
- `created_at timestamptz`
- `updated_at timestamptz`

The app must never store raw card numbers, CVC, full bank details, or payment secrets.

## User Flows

### Sign In And Sign Up

1. User opens sign-in page.
2. User chooses email/password, social login, or phone OTP.
3. Supabase Auth creates or resumes the session.
4. App ensures a `profiles` row exists.
5. If MFA challenge is required, route to challenge.
6. Otherwise route to browse/dashboard.

### Login Method Linking

1. User opens Account Settings > Login Methods.
2. Connected identities are listed.
3. User can connect Google, Apple, Facebook, phone, or password where allowed.
4. App refreshes the identity list after linking.

### MFA Enrollment

1. User opens Security settings or hits a protected seller/admin action.
2. App shows available MFA factors.
3. User enrolls TOTP or phone MFA.
4. User verifies the factor.
5. App refreshes the session and displays MFA as active.

### Seller Readiness

A seller can publish only when:

- Company profile exists.
- Company address exists.
- MFA is enrolled and current session has sufficient assurance.
- User is not banned.

If readiness is incomplete, the publish action opens a checklist with direct links to each missing step.

### Address Book

1. User opens Account Settings > Addresses.
2. User adds shipping, billing, or company address.
3. User can mark default shipping and default billing addresses.
4. Won-auction checkout selects the default shipping and billing addresses first.

### Saved Payment Methods

1. User opens Account Settings > Payment Methods or won-auction checkout.
2. Server creates/reuses Stripe Customer.
3. Server creates a SetupIntent.
4. Client confirms card setup with Stripe Elements.
5. Server verifies the SetupIntent result.
6. App stores safe payment method metadata.
7. User can set default or remove a payment method.

Saved payment methods are used for paying for won auctions only in this phase.

## Route And Action Guards

Public:

- Browse live auctions.
- View public auction details.
- Sign in/up pages.

Authenticated bidder:

- Bid on auctions.
- Manage own profile.
- Manage own addresses.
- Manage own saved payment methods.
- Pay for won auctions.

Seller:

- All bidder capabilities.
- Manage company profile.
- Create drafts.
- Publish listings only after seller readiness passes.

Admin:

- Moderation actions only with admin role and MFA-verified session.

## Error Handling

Auth errors:

- Invalid credentials: show a generic retry message.
- OAuth canceled or failed: return to sign-in with retry.
- Phone OTP invalid/expired: show code-specific retry state.
- OTP resend unavailable: show cooldown.

MFA errors:

- Invalid code: allow retry.
- Missing factor: route to enrollment.
- Insufficient assurance: route to challenge.
- Factor removal blocked: require current MFA verification.

Seller readiness errors:

- Missing company profile.
- Missing company address.
- MFA not enrolled or not verified.
- Account banned.

Payment errors:

- Stripe setup failure: show Stripe-provided safe error message.
- Removed/expired method: mark unavailable.
- Default method deletion: require selecting a new default when other methods exist.

## Security And RLS

RLS policies must enforce:

- Users can read/update only their own profile.
- Users can manage only their own addresses.
- Users can manage only their own payment method metadata.
- Company profile writes are limited to the owner.
- Admin reads/actions require admin role checks server-side.
- Seller publish checks must run server-side.

Sensitive actions should use server-side session checks. Client-side checks can improve UX, but are never the source of truth.

## Testing Plan

Unit tests:

- Seller readiness rules.
- MFA requirement rules.
- Default address selection.
- Payment metadata normalization.

API tests:

- Profile update.
- Address CRUD.
- Company profile CRUD.
- Payment method list/default/delete.
- Seller publish blocked until ready.

Database/RLS tests:

- Users cannot read another user's addresses.
- Users cannot read another user's payment metadata.
- Users cannot update another user's company profile.
- Admin-only operations reject non-admins.

UI tests:

- Email/password sign-in states.
- OAuth button rendering and callback error state.
- Phone OTP send/verify states.
- MFA enrollment/challenge states.
- Account settings tabs.
- Seller readiness checklist.
- Saved payment method add/default/delete states.

Integration tests:

- Stripe test-mode SetupIntent flow.
- Supabase auth callback routing.
- MFA challenge flow with test factors where possible.

## Rollout Plan

1. Account foundation: Supabase browser/server clients, session provider, route protection.
2. Login methods: email/password, OAuth buttons, phone OTP screens.
3. Profiles and addresses.
4. MFA enrollment/challenge and seller/admin enforcement.
5. Company profile and seller readiness checklist.
6. Stripe saved payment methods for won-auction checkout.

Each phase should leave the app in a runnable state.

## Dependencies And Configuration

Supabase:

- Auth providers configured for Google, Apple, Facebook.
- Phone auth enabled.
- SMS provider configured before phone OTP is production-ready.
- MFA enabled for TOTP and phone where supported.
- Redirect URLs configured for local and production domains.

Stripe:

- Secret key and publishable key.
- Webhook signing secret reserved for future won-auction payment events.
- SetupIntent support.
- Test mode cards for verification.

Environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## External References

- Supabase Social Login: https://supabase.com/docs/guides/auth/social-login
- Supabase Phone Login: https://supabase.com/docs/guides/auth/phone-login
- Supabase Multi-Factor Authentication: https://supabase.com/docs/guides/auth/auth-mfa
- Stripe Payment Methods: https://docs.stripe.com/payments/payment-methods
