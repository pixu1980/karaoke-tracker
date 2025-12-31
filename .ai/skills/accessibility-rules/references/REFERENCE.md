## Accessibility rules — reference

Detailed checklist and testing guidance for accessibility.

### Checklist

- Use semantic HTML elements (`button`, `input`, `h2`, `ul`) whenever possible.
- Provide `aria-label` for icon-only buttons and `alt` for images.
- Focus management: ensure interactive elements have visible `:focus-visible` styles.
- Use `role="list"` with `aria-label` for custom lists.
- Keyboard support: all interactions reachable via keyboard (tab/enter/space as appropriate).
- Do not remove native semantics (avoid replacing `button` with `div`).

### Dialog considerations

- Use native `dialog` or accessible `pix-dialog` wrapper.
- Ensure `aria-hidden`/`aria-modal` states are properly set by dialog implementation.

### Testing a11y

- Test keyboard navigation manually.
- Use lighthouse / axe / Playwright accessibility checks in CI for critical paths.
