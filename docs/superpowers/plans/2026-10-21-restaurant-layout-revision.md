# Restaurant Layout Revision Implementation Plan

> **For agentic workers:** Root owns implementation and Chrome. Independent read-only review supplied the layout findings. The optional superpowers execution skills are unavailable; use the existing collaboration workflow.

**Goal:** Replace the awkward restaurant layout with a coherent, photograph-led restaurant experience.

**Architecture:** Retain the existing React component and request/filter state. Change only its presentation markup and stylesheet, then regenerate the portfolio preview.

**Tech Stack:** React, TypeScript, CSS, Vite.

## Constraints
Preserve existing natural images and local-only form behaviour. No new dependencies, invented restaurant facts, external submissions or changes to the other two sites.

## Steps
- [ ] In `src/table/App.tsx`, replace the slogan-first hero with header plus photograph; combine the old story/season sections into one photo/copy section; remove repetitive visit section and put party/time facts alongside the form.
- [ ] In `src/table/styles.css`, implement centred branding, a full-width hero, equal three-column menu groups and a two-column visit form; use one-column mobile layouts with wrapping controls.
- [ ] Check desktop and 390/320 px views in existing Chrome; exercise category/vegetarian filters, empty-state reset, mobile navigation and form validation.
- [ ] Run `npm run check` and `npm run build`; save new desktop/mobile screenshots and update `public/previews/table.png`.
- [ ] Record actual verification and commit the bounded change. Keep deployment status pending until GitHub login is restored.
