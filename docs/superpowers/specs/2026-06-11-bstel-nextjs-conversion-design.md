# BSTEL Next.js Conversion Design

## Goal

Convert the BSTEL prototype handoff in `C:\Users\Reeda Mansuri\Downloads\bstel.zip` into a real Next.js App Router website in this repository.

## Scope

Build seven public routes: `/`, `/about`, `/services`, `/coverage`, `/projects`, `/careers`, and `/contact`. Recreate the prototype's corporate telecom visual language, content, shared navigation, footer, CTA sections, responsive layouts, coverage interaction, and contact form validation.

## Architecture

Use Next.js App Router with TypeScript. Most UI is static and rendered by Server Components. Use small Client Components for the mobile navigation, coverage state highlighting, and contact form state.

Content will live in typed data modules under `src/lib`. Shared UI will live in `src/components`. Static image assets from the zip will be copied to `public/assets`.

## Design Requirements

- Use Archivo via `next/font/google`.
- Preserve the prototype palette: ink, deep purple, primary purple, light purple tint, accent green, body text, section background, and border colors.
- Provide desktop layouts faithful to the prototype and responsive mobile/tablet layouts below 900px.
- Add a mobile hamburger navigation below tablet width.
- Keep cards, buttons, inputs, logo grids, hero panels, and CTA banners consistent with the handoff.
- Avoid CMS and backend scope for this first conversion.

## Behavior

- Header is sticky, with active navigation based on current path.
- Services page supports anchor links for the four practice areas.
- Coverage page lets the user select or deselect a state card and highlights its map dots.
- Contact form validates full name, email, and message. On success it shows the prototype's success state and can reset.
- Contact submission remains client-side only in this version.

## Open Content Preserved From Prototype

- Testimonials remain placeholders.
- Careers roles remain sample roles.
- Project photos remain styled placeholders.
- Capability percentages remain as provided in the handoff.
- Orange `one.png` client logo name remains unconfirmed.
- Contact form backend is not implemented.

## Verification

- Build with `npm run build`.
- Run the local dev server and visually verify the main pages at desktop and mobile sizes.
- Confirm interactive coverage selection and contact form validation work.
