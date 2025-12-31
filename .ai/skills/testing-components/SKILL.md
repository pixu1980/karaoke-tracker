---
name: testing-components
description: Strategies and patterns for testing components through unit tests and end-to-end tests. Use when implementing tests or test infrastructure.
license: MIT
metadata:
  author: AI Agents
  version: "1.0"
---

## When to use this skill

Use this skill when writing tests for components, setting up test infrastructure, or debugging component behavior. Covers unit testing, E2E testing, and testing best practices.

For test examples, patterns and debugging strategies, see [references/REFERENCE.md](references/REFERENCE.md).

For project-specific test setup and conventions, refer to `.context/CLAUDE.md` or `.context/COPILOT.md`.

- Prefer small test harnesses that mount the component in a JS test runner (Jest/Node DOM) if available.

## E2E with Playwright

- Install: `pnpm add -D @playwright/test`
- Typical scripts:
  - `playwright test`
  - `playwright test --headed`
- Keep tests deterministic: seed storage or mock the `storage` service.

## Example Playwright test (concept)

```javascript
import { test, expect } from '@playwright/test';

test('song search filters list', async ({ page }) => {
  await page.goto('http://localhost:1234');
  await page.fill('input[data-filter]', 'love');
  const items = await page.locator('kt-song-queue ul li');
  await expect(items).toHaveCount(1);
});
```

## CI

- Add a GitHub Actions workflow to run Playwright tests in CI when present.
