# Developing (Local development)

This guide explains how to set up the development environment and common tasks.

Prerequisites

- Node.js 20+ (recommended LTS)
- pnpm

Installation

```bash
# Clone the repository
git clone https://github.com/pixu1980/karaoke-tracker.git
cd karaoke-tracker

# Install dependencies (use pnpm)
pnpm install
```

Useful commands

- `pnpm start` — start the development server (Parcel) at `http://localhost:1234`.
- `pnpm run build` — production build (output in `dist/`).
- `pnpm test` — run the test suite (if present).

Structure and conventions

- Follow the rules in `docs/RULES.md` and the guides in `docs/coding-styleguides/`.
- Each component follows the Custom Element pattern (folder with `.js`, `.css`, `.template.html`).
- Do not use Shadow DOM or `<template>` (see project rules).

Debugging and developing components

- Edit files in `src/` and the dev server will reload the app automatically.
- To add a new component, create a folder under `src/scripts/components/` with the three required files (`.js`, `.css`, `.template.html`).
- Register styles using `registerStylesheet(styles)` as described in `docs/RULES.md`.

Manual testing

- For manual UI testing open `http://localhost:1234` and reproduce the use cases.

Build and deploy

- `pnpm run build` produces the `dist/` folder ready for deployment.
- The project is configured to deploy to GitHub Pages via GitHub Actions (workflow in `.github/workflows/`).

Questions?

See `CONTRIBUTING.md` or open an issue if you're unsure where to start.
