# Fintech SaaS Sidebar Demo

Production-minded, config-driven sidebar navigation demo for a fintech admin dashboard.

## Features

- Sectioned information architecture: Overview, Operations, Compliance, Reporting, Settings
- Role-aware RBAC filtering (`admin`, `analyst`, `support`)
- Active route matching (including nested navigation)
- Collapsible desktop sidebar (icon mode) with persisted preference
- Responsive mobile drawer with overlay, ESC close, and focus management
- Accessible semantic navigation markup and visible focus styles
- Sticky sidebar with overflow scroll shadows
- Badge/counter support via config
- Workspace switcher + user profile/settings/logout areas

## Files

- `index.html` — app shell
- `src/nav-config.js` — typed nav config and RBAC metadata
- `src/nav-utils.js` — RBAC filtering + active route matching utilities
- `src/main.js` — sidebar rendering and behavior
- `styles.css` — layout and sidebar styling
- `test/nav-utils.test.js` — unit tests

## Run

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
