# BSTEL Next.js Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Next.js App Router version of the BSTEL corporate website from the HTML design handoff.

**Architecture:** Create a static-first Next.js TypeScript app with shared layout components and typed content data. Keep interactivity isolated to client components for mobile nav, coverage selection, and contact form validation.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules/global CSS, `next/font`, `next/image`.

---

## File Structure

- `package.json`: scripts and dependencies.
- `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, `.gitignore`: Next.js project configuration.
- `src/app/layout.tsx`: root HTML, metadata, font, global layout.
- `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/services/page.tsx`, `src/app/coverage/page.tsx`, `src/app/projects/page.tsx`, `src/app/careers/page.tsx`, `src/app/contact/page.tsx`: route pages.
- `src/app/globals.css`: global tokens, responsive styling, page/component classes.
- `src/components/Header.tsx`, `Footer.tsx`, `CtaBanner.tsx`, `LogoGrid.tsx`, `CoverageExplorer.tsx`, `ContactForm.tsx`, `HeroNetworkGraphic.tsx`, `Icon.tsx`: reusable UI.
- `src/lib/site-data.ts`: typed site content, navigation, services, states, clients, careers, projects.
- `src/lib/contact-validation.ts`: pure contact validation logic.
- `src/lib/contact-validation.test.js`: Node test for validation behavior.
- `public/assets`: copied logo and client logo images from the handoff zip.

## Tasks

- [ ] Create Next.js project configuration and base folders.
- [ ] Copy prototype assets into `public/assets`.
- [ ] Add typed site data and contact validation with tests.
- [ ] Build shared layout components.
- [ ] Build all seven pages.
- [ ] Add responsive global CSS matching the prototype.
- [ ] Run tests and production build.
- [ ] Start dev server and visually verify the website.
