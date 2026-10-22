# Verification — 21 October 2026

## Build and domain checks

- `npm run check`: TypeScript passed.
- `npm test`: 17 tests passed, covering cart quantities, product variants, integer-cent totals, availability conflicts, cancellation, rescheduling, Vancouver dates, daylight-saving transitions and midnight selection refresh.
- `npm run build`: all four HTML entrypoints built successfully.

## Real Chrome checks

Desktop review used a 1512 px viewport. Responsive review used 390 px and 320 px emulation, with temporary overrides cleared afterward. These checks are browser emulation, not physical-device tests.

- **Seasonal Table:** category and vegetarian filters, no-result search/reset, date validation, local request creation, refresh persistence and removal. Viewed the edited dining-room image on desktop and mobile. At 320 px, the vegetarian menu view had no document-level horizontal overflow.
- **Objects:** Maple/Walnut variants remain separate; two Maple trays plus one Walnut tray total CAD 102; decreasing the Maple quantity gives CAD 68. Review, refresh persistence, removal and empty-cart state were checked. The Olive reading-light variant disables purchase. Mobile hero, lamp catalogue crops and the Olive product-detail photograph were visually reviewed at 390 px, with no document-level horizontal overflow.
- **Studio Session:** creation, rescheduling, refresh persistence, cancellation, empty filtered results and released slots were checked. A 320 px review confirmed that the calendar fits. The record-detail action buttons now stack on narrow screens and remain within the viewport.
- **Portfolio index:** desktop and 390 px visual review, with no document-level horizontal overflow. Project cards link to the three independent sites; the CV link points to the bundled public PDF.

## Review findings resolved

- A midnight transition could leave the detail form with an invalid date selection; selection refresh now returns to the booking step, with a regression test.
- Two management buttons could exceed the available width on a 320 px screen; a narrow-screen layout now stacks them.

## Functional boundaries

These are static independent portfolio projects. Browser-local persistence is deliberate: no real payments, restaurant reservation submission, external calendar synchronisation, email delivery or shared multi-user availability is implemented. The UI communicates this at save/review points. Product and restaurant imagery is adapted from licensed photographic references; see `ASSETS.md`.

GitHub Pages deployment is verified separately after publication. This record does not claim physical-device, production-backend, payment or comprehensive accessibility certification.

## Restaurant layout revision — 22 October 2026

Re-reviewed Lilia and Published on Main in Chrome, then revised the layout to lead with restaurant photography. At 1512 px, the photo now begins near y=141 instead of y=477. The three menu groups each measure approximately 357 px wide. Repeated story/visit sections were consolidated.

Verified category plus vegetarian filtering (2 matching main dishes), no-result search and reset (12 dishes), mobile navigation open/close with anchor navigation, and missing-name/date validation. Responsive checks at 390 px and 320 px show no document-level horizontal overflow; date/time input top positions match. Existing request persistence logic was retained. TypeScript and production build passed after the revision. Independent read-only visual review found the original three layout issues resolved in the supplied desktop screenshots.
