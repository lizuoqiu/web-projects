# Scott Li — Websites & Interactive Tools

Three independently developed web projects covering hospitality, product browsing and appointment management. Built with React, TypeScript and CSS; published as a static multi-page site.

**Portfolio:** https://lizuoqiu.github.io/web-projects/

| Project | Website | Focus |
| --- | --- | --- |
| Seasonal Table | [Visit](https://lizuoqiu.github.io/web-projects/table/) | Editorial restaurant layout, menu filters, a reservation-request form |
| Objects | [Visit](https://lizuoqiu.github.io/web-projects/objects/) | Product variants, filtering, cart state and integer-cent totals |
| Studio Session | [Visit](https://lizuoqiu.github.io/web-projects/sessions/) | Calendar availability, local appointments, rescheduling and cancellation |

These are independent projects by BoRui (Scott) Li, not commissioned businesses. Shopping summaries and appointment/request records stay in the visitor's browser. The sites do not take payments, send reservation requests or synchronise external calendars.

## Run locally

Node 22.12+ or 24 is required.

```sh
npm ci
npm run dev
```

Open the printed URL with `/web-projects/`. The project uses this base path so local routing matches GitHub Pages.

```sh
npm run check
npm test
npm run build
npm run preview
```

## Structure

- `src/main.tsx`, `src/hub.css`: professional portfolio index.
- `src/table/`: Seasonal Table.
- `src/objects/`: catalogue, product details and cart.
- `src/sessions/`: appointment planner and management interface.
- `tests/`: core cart and scheduling behaviour.
- `public/`: project imagery, previews and one-page CV.
- `.github/workflows/pages.yml`: checks, build and GitHub Pages deployment.

## Design references

- [Published on Main](https://publishedonmain.com/menu/) and [Lilia](https://www.lilianewyork.com/): restaurant information hierarchy and text-led menus.
- [Ugmonk](https://ugmonk.com/collections/best-sellers): clear product comparison, restrained grids and product-led imagery.
- [Cal.com](https://cal.com/) and [Linear](https://linear.app/docs/display-options): scheduling context and focused data views.

Reference brands' logos, photography, copy and customer claims are not reproduced. See [asset provenance](ASSETS.md) for materials actually included, and [verification](docs/verification.md) for tested scope.

## About the developer

BoRui (Scott) Li is a Computing Science PhD student at Simon Fraser University. Web services include responsive business websites, Figma implementation, interactive tools and API integration. Available up to 20 hours per week.

[GitHub](https://github.com/lizuoqiu) · [LinkedIn](https://www.linkedin.com/in/borui-li/)
