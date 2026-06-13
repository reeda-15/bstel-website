# BSTEL Hero Background Animation Design

## Goal

Create a refined homepage hero animation that matches BSTEL's business: telecom infrastructure, fibre rollout, regional coverage, and 24x7 monitored uptime. The animation should use the full width of the hero section and replace the current square/right-side visual layout.

## Chosen Direction

Use the "Route Flow" direction:

- A dark, technical regional-grid background.
- Soft fibre-route lines moving across the hero.
- Green and violet signal pulses travelling along the routes.
- Subtle node pulses to imply monitored infrastructure and uptime.
- Calm looping motion that feels dependable, not flashy.

## Layout Change

The homepage hero should become a full-width animated background composition:

- Remove the current right-side square hero visual from the homepage hero.
- Keep the hero copy and primary actions on the left.
- Let the animated background span the complete hero area behind the content.
- Preserve text readability with a dark overlay/gradient behind the copy.
- Keep the animation responsive on desktop, tablet, and mobile.

## HyperFrames Role

Use HyperFrames to generate the motion background asset or composition source:

- Author a deterministic HTML/CSS animation composition inspired by the existing BSTEL visual language.
- Render or export it as a web-ready background asset when practical.
- Integrate it into the Next.js homepage hero as the visual background.

If local rendering is blocked by missing FFmpeg or package installation constraints, implement the same design as a live browser animation first and leave the HyperFrames composition source in the project for rendering later.

## Visual Constraints

- Avoid a boxed/card/square treatment in the hero.
- Avoid overly bright or busy effects behind text.
- Keep the palette aligned with the current brand: deep purple, green accent, violet route lines, and muted technical grid tones.
- Respect `prefers-reduced-motion` by freezing or heavily reducing motion.
- Do not introduce decorative visuals unrelated to telecom infrastructure.

## Acceptance Criteria

- Homepage hero animation spans the full hero width.
- Existing square/right-side visual is removed from the homepage hero.
- Hero text remains legible across desktop and mobile.
- Animation clearly suggests fibre routes, signal flow, monitored nodes, and network reliability.
- Reduced-motion users do not receive continuous background animation.
- Build and tests pass after implementation.
