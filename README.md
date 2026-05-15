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

- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/index.html` — app shell
- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/src/nav-config.js` — typed nav config and RBAC metadata
- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/src/nav-utils.js` — RBAC filtering + active route matching utilities
- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/src/main.js` — sidebar rendering and behavior
- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/styles.css` — layout and sidebar styling
- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/test/nav-utils.test.js` — unit tests

## Run

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
