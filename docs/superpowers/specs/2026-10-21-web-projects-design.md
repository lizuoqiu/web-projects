# Scott Li — three independent web projects

Approved by the user on 2026-10-21: build all three projects, create a new public GitHub repository, publish free on GitHub Pages. This document records the approved proposal; no further design gate is needed for this scope.

## Purpose and presentation
Give prospective small-business clients working evidence of website and interface development. Present each as an independently developed project. Do not invent clients, reviews, revenue, usage or successful external transactions. Do not put example/demo banners across the sites. Operation feedback must accurately explain local-only effects. Availability in the portfolio remains up to 20 hours per week.

## Architecture
One public repository, React + TypeScript with Vite. Four HTML entrypoints: portfolio `/`, restaurant `/table/`, store `/objects/`, and booking `/sessions/`. All assets and links work beneath `/web-projects/` on GitHub Pages. Each project owns its React component, stylesheet, data and domain helpers. No paid API, secrets, backend or login. Storage is namespaced localStorage. Build output is published with GitHub Actions.

## Seasonal Table
Warm cream, dark olive, restrained burgundy. Editorial serif typography, large dining photography and text-led menu rows. References: https://publishedonmain.com/menu/ and https://www.lilianewyork.com/ ; reuse navigation, hierarchy and menu clarity, not brand assets or copy. Homepage, 12 original menu items in three categories, vegetarian filtering, visit information and locally saved reservation request. A saved request explicitly has not been sent and is not a confirmed reservation. No invented real address or opening claims about an existing business.

## Objects
Quiet editorial product catalogue with generous consistent image areas, fine rules, stable prices and distinct product details. Reference: https://ugmonk.com/collections/best-sellers . Eight original product entries in three categories, sort, two variants per product, stock state, detail panel, cart, integer-cent price arithmetic, quantity/remove and local persistence. Order summary does not collect payment or imply an order was placed. Original graphics or permissively sourced photography with provenance.

## Studio Session
Compact off-white and ink scheduling tool with a small cobalt accent. References: https://cal.com/ and https://linear.app/docs/display-options . A single 30-minute service, explicit America/Vancouver time, available future dates over the next two weeks, time selection, name and optional notes, local save. Management list with search, status filter, sort, details, reschedule and cancel. Date/calendar/list share one state; changing/cancelling releases old slots. No external messages or calendar access, no fake KPI panels. Empty states and local-only feedback are clear.

## Quality and release
Keyboard focus, semantic controls, sensible labels, mobile layout, empty/error states, reduced-motion respect. Unit tests cover cart merge/price and booking conflicts/reschedule/cancel. Build and TypeScript checks, desktop/mobile browser inspection and real critical UI flows before release. Inspect final public source file list for private material. Verify deployment status and public pages. Add verified URLs and concise project descriptions to local portfolio copy only; broad platform edits are not part of this approved build.
