# BSTEL Hero Background Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero's boxed visual with a full-width route-flow animation that communicates fibre routes, coverage, and monitored uptime.

**Architecture:** Reuse the existing `ShaderHeroBackground` component as the homepage background surface, but change its shader from a boxed/grid feel to full-hero route flow. Remove the homepage-only `PageHeroVisual` and `HeroNetworkGraphic` instances from `src/app/page.tsx`; leave `PageHeroVisual` intact for inner pages. Update CSS so the homepage hero is a single-column content layer over the full-width animated background.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, WebGL shader canvas, CSS media queries, Node test runner.

---

### Task 1: Update Motion Metadata Tests

**Files:**
- Modify: `src/lib/shader-hero.js`
- Modify: `src/lib/shader-hero.test.js`

- [ ] **Step 1: Write the failing test**

Replace the existing tests in `src/lib/shader-hero.test.js` with:

```js
const assert = require("node:assert/strict");
const test = require("node:test");
const { shaderHeroConfig } = require("./shader-hero.js");

test("uses the approved full-width route-flow background", () => {
  assert.equal(shaderHeroConfig.source, "hyperframes-route-flow");
  assert.equal(shaderHeroConfig.variant, "home-full-width");
  assert.equal(shaderHeroConfig.layout, "full-bleed-background");
});

test("keeps route-flow colors aligned with the BSTEL palette", () => {
  assert.deepEqual(shaderHeroConfig.colors, ["#160b2d", "#4b2e83", "#89c430", "#a78bdb"]);
});

test("documents the business cues represented by the animation", () => {
  assert.deepEqual(shaderHeroConfig.cues, ["fibre routes", "signal flow", "coverage grid", "24x7 monitoring"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern shader`

Expected: FAIL because `shaderHeroConfig.source`, `variant`, `layout`, `colors`, and `cues` still describe the old shader.

- [ ] **Step 3: Update metadata implementation**

Replace `src/lib/shader-hero.js` with:

```js
const shaderHeroConfig = {
  source: "hyperframes-route-flow",
  variant: "home-full-width",
  layout: "full-bleed-background",
  colors: ["#160b2d", "#4b2e83", "#89c430", "#a78bdb"],
  cues: ["fibre routes", "signal flow", "coverage grid", "24x7 monitoring"],
};

module.exports = {
  shaderHeroConfig,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --test-name-pattern shader`

Expected: PASS for the updated shader metadata tests.

### Task 2: Remove Homepage Boxed Visuals

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write the minimal page change**

In `src/app/page.tsx`, remove these imports:

```ts
import { HeroNetworkGraphic } from "@/components/HeroNetworkGraphic";
import { PageHeroVisual } from "@/components/PageHeroVisual";
```

Inside the homepage hero section, remove:

```tsx
<PageHeroVisual variant="home" />
```

and remove:

```tsx
<HeroNetworkGraphic />
```

Keep:

```tsx
<ShaderHeroBackground />
```

- [ ] **Step 2: Run TypeScript/build check**

Run: `npm run build`

Expected: PASS with no unused import or render errors.

### Task 3: Convert Hero Layout To Full-Width Background

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update homepage hero layout CSS**

In `src/app/globals.css`, update `.home-hero` to use one content column over the full background:

```css
.home-hero {
  align-items: center;
  display: grid;
  min-height: clamp(560px, 68vh, 760px);
  padding-bottom: 88px;
  padding-top: 96px;
}
```

Update `.home-hero::before` to protect text readability:

```css
.home-hero::before {
  background:
    linear-gradient(90deg, rgba(22,11,45,.98) 0%, rgba(22,11,45,.86) 42%, rgba(22,11,45,.36) 76%, rgba(22,11,45,.16) 100%),
    linear-gradient(180deg, rgba(22,11,45,.28), rgba(22,11,45,.52));
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: -1;
}
```

Ensure `.home-hero > div:first-child` keeps the copy width:

```css
.home-hero > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 620px;
}
```

- [ ] **Step 2: Update mobile layout CSS**

In the existing responsive rules, remove `grid-template-columns` assumptions for `.home-hero`, and ensure mobile keeps enough height:

```css
@media (max-width: 760px) {
  .home-hero {
    min-height: 620px;
    padding-top: 64px;
  }
}
```

- [ ] **Step 3: Run build check**

Run: `npm run build`

Expected: PASS.

### Task 4: Replace Shader With Route-Flow Animation

**Files:**
- Modify: `src/components/ShaderHeroBackground.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update shader fragment source**

Replace the fragment shader in `src/components/ShaderHeroBackground.tsx` with a full-width route-flow shader that draws:

- a dark purple base,
- subtle grid lines,
- three curved horizontal route bands,
- green/violet route pulses,
- soft node glows.

Keep the existing resize, `prefers-reduced-motion`, and render loop structure.

- [ ] **Step 2: Update background fallback CSS**

Keep `.shader-hero-background` as absolute full-hero coverage and use this fallback:

```css
.shader-hero-background {
  background:
    radial-gradient(circle at 72% 28%, rgba(137,196,48,.22), transparent 28%),
    radial-gradient(circle at 84% 72%, rgba(167,139,219,.22), transparent 30%),
    linear-gradient(135deg, var(--ink), var(--deep) 54%, var(--purple));
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  z-index: -1;
}
```

- [ ] **Step 3: Run tests and build**

Run: `npm test`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

### Task 5: Browser Verification

**Files:**
- Verify: homepage in browser

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

Expected: Next dev server starts on an available localhost port.

- [ ] **Step 2: Inspect desktop homepage**

Open the homepage in the in-app browser. Verify:

- animation spans the full hero width,
- no right-side boxed/square visual remains,
- hero text and buttons are readable,
- background motion suggests route flow and monitored nodes.

- [ ] **Step 3: Inspect mobile width**

Use a mobile viewport or narrow browser width. Verify:

- hero text does not overlap animation details,
- buttons fit without text overflow,
- animation remains full-width behind content.

- [ ] **Step 4: Final status**

Summarize files changed, tests run, build result, and browser verification result.

---

## Self-Review

- Spec coverage: The plan removes the boxed visual, makes the animation full-width, preserves readability, keeps reduced-motion support, and verifies build/tests/browser behavior.
- Placeholder scan: No placeholders remain.
- Type consistency: File names, exports, and config property names are consistent across tasks.
