# Advanced Contribution Guide

This document contains advanced, technical contribution details intended for maintainers and contributors who want to collaborate on the codebase at a deeper level (tests, tooling, pre-commit hooks, and recording video tutorials).

Table of contents
- Development tooling
- Tests (Playwright / E2E)
- Formatting and linting (Biome)
- Pre-commit and hooks (lint-staged, Husky)
- Recording video tutorials / live-coding tips
- Helpful commands

Development tooling

This repository uses lightweight tooling to keep the developer experience fast and predictable. Typical tools you may encounter:

- Parcel.js — bundler for local development and builds.
- Biome — code formatter / linter (see `biome.json`).
- Playwright — end-to-end browser testing (optional).
- lint-staged & Husky — pre-commit hooks for formatting and quick checks.

Tests (Playwright / E2E)

If Playwright is present in the project or you want to add E2E tests:

1. Install Playwright and browsers:

```bash
pnpm add -D @playwright/test
# install browsers
npx playwright install --with-deps
```

2. Typical scripts you could add to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

3. Writing tests:
- Keep E2E tests focused on flows (add singer, complete song, leaderboard updates).
- Prefer stable selectors: `data-test` or role-based selectors.
- Keep tests deterministic and small to speed up CI.

Formatting and linting (Biome)

This repo includes `biome.json` for formatting and linting rules. Use Biome to format and check code locally:

```bash
# Format files
pnpm exec biome format

# Run linter checks
pnpm exec biome check
```

Use your editor integration to format on save for best DX.

Pre-commit and hooks (lint-staged, Husky)

If the project uses `lint-staged` + `husky` add hooks to keep commits clean:

1. Install:

```bash
pnpm add -D husky lint-staged
npx husky install
```

2. Example `package.json` settings:

```json
"husky": {
  "hooks": {
    "pre-commit": "npx lint-staged"
  }
},
"lint-staged": {
  "**/*.{js,css,html,md}": [
    "pnpm exec biome format",
    "git add"
  ]
}
```

Recording video tutorials / live-coding tips

If you'll use this repository for recordings or live coding, follow these guidelines to make sessions reproducible and easy to follow:

- Keep changes small and self-contained per commit — this makes it easy to jump to a point in the recording.
- Use descriptive commit messages: prefix with `feat/`, `fix/`, `docs/` for clarity in the video timeline.
- Create branches per recorded topic (ex: `feat/demo-add-song-button`).
- Keep sample data deterministic — include an example dataset in `src/assets` if needed for demos.
- Use `pnpm start` and show `http://localhost:1234` for local demos.
- When showing tests, run a single test or `--grep` selected tests to keep the recording short.

Helpful commands

```bash
# start dev server
pnpm start

# run formatter
pnpm exec biome format

# run unit/e2e tests (if configured)
pnpm test
pnpm run test:e2e

# build for production
pnpm run build
```

Support

If you need help adding tooling (Playwright, Husky, lint-staged), open an issue describing the short-term goal (CI, recording) and maintainers can add recommended config snippets.
