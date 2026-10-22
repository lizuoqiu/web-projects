# Three Web Projects Implementation Plan

> **For agentic workers:** Use subagent-driven development: separate owners for restaurant, store and scheduling; root integrates and reviews. The named superpowers execution skills are not installed, so use the available collaboration tools with the same independent ownership and review structure.

**Goal:** Publish three distinct, functional independent web projects and a concise portfolio index through the user's GitHub account.

**Architecture:** Vite multi-page React application. Every site exports a default React component and imports its own CSS. Shared build configuration only; no shared UI framework or fake backend.

**Tech Stack:** React, TypeScript, Vite, CSS, browser localStorage, Node test runner.

## Global Constraints
- User approved all three projects and free public GitHub Pages publication on 2026-10-21.
- No paid services, private workspace files, credentials, invented clients or outcomes.
- Four paths: `/`, `/table/`, `/objects/`, `/sessions/`, relative assets compatible with `/web-projects/`.
- No mandatory example/demo branding; local save feedback is accurate.
- Up to 20 hours/week in the professional profile.

## Task 1: Site shell and portfolio (root)
Files: package.json, tsconfig.json, vite.config.ts, index.html, src/main.tsx, src/hub.css, .github/workflows/pages.yml.
Interfaces: site HTML entrypoints load `/src/{table,objects,sessions}/main.tsx`; each site's default App can be tested independently.
- [x] Create React/Vite TypeScript build and four HTML entrypoints with descriptive metadata.
- [x] Install one dependency set; no overlapping package mutations.
- [x] Build an editorial index linking three projects plus verified BZC and research projects.
- [x] Use CSS layout and focused link navigation; no unnecessary UI tests for static copy.

## Task 2: Restaurant (exclusive owner)
Files: src/table/*, public/images/table/*.
Interfaces: default `App` imported by main.tsx; no changes to shared package/config.
- [x] Create 12 original dishes in 3 categories and accessible category/vegetarian controls.
- [x] Implement editorial landing, text-led menu and visit sections using licensed imagery.
- [x] Add required date/party-size/name fields, reject past dates, save request to localStorage and render accurate unsent summary.
- [x] Check no-result/reset and responsive navigation in browser review.

## Task 3: Store (exclusive owner)
Files: src/objects/*, public/images/objects/*, tests/cart.test.ts.
Interfaces: pure exported `addItem`, `setQuantity`, `subtotal` functions with typed item and integer-cent price inputs; App imports them.
- [x] Write domain checks: same variant merges; different variants remain separate; 2 × 2400 + 1 × 1800 = 6600 cents; zero quantity removes.
- [x] Create 8 products, 3 categories and 2 variants each, one unavailable variant.
- [x] Implement catalogue sort/filter, details and selectable variants.
- [x] Implement cart edit/remove, refresh persistence and a no-payment order summary.
- [x] Confirm tests and UI workflow, including unavailable/empty states.

## Task 4: Scheduling (exclusive owner)
Files: src/sessions/*, tests/booking.test.ts.
Interfaces: pure `createBooking`, `rescheduleBooking`, `cancelBooking`, `availableSlots`, with shared Booking records used by both views.
- [x] Write checks for duplicate active slots, released cancelled slots, reschedule release/occupancy, and Vancouver date handling.
- [x] Implement future two-week date selection and 30-minute slots, disable elapsed times.
- [x] Implement validated local creation, list/search/filter/sort and detail panel.
- [x] Implement reschedule/cancel and persist updates; explain browser-local effects on save.
- [x] Confirm domain checks and real browser workflow.

## Task 5: Review and publish (root)
Files: README.md, ASSETS.md, docs/verification.md, local outputs portfolio copy.
- [x] Run `npm run check`, `npm test`, `npm run build` once implementation is integrated; fix observed failures.
- [x] Start preview, inspect all pages at desktop and mobile sizes, exercise critical flows, fix observed problems.
- [x] Record source references, asset licensing and precise tested coverage.
- [x] Inspect tracked file list, initialize new repo with GitHub noreply author identity, commit only this directory.
- [ ] Create public `lizuoqiu/web-projects`, push, configure Pages Actions and verify successful deployment and HTTP/browser routes.
- [ ] Add actual project links and factual stack/feature descriptions to local portfolio materials. Deliver live URLs and source link.

## Plan review
All approved scenarios map to Tasks 2–4; shared publication and copy to Tasks 1/5. Domain interfaces are isolated to avoid conflicting edits. No new features beyond the approved workflows. Browser owner is root; subagents do not operate shared Chrome.
