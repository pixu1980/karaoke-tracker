## Real-time filtering — reference

Full pattern, code snippets, accessibility and performance notes for client-side filtering.

### Pattern summary

- Template: include `<input data-filter>` with `aria-label`.
- Component JS:
  - Keep `_filterText` state on the component instance.
  - On `render()` restore the `input.value` from `_filterText` and attach `input.oninput` handler.
  - Implement `updateList()` to hide/show `<li>` items (set `li.hidden = true/false`).

### Example (pseudo)

```javascript
// inside render()
const input = this.querySelector('input[data-filter]');
if (input) {
  input.oninput = (e) => {
    this._filterText = e.target.value.toLowerCase().trim();
    this.updateList();
  };
}

// updateList()
const items = this.querySelectorAll('ul > li');
items.forEach(li => {
  const text = li.textContent.toLowerCase();
  li.hidden = this._filterText && !text.includes(this._filterText);
});
```

### Accessibility

- Keep `aria-label` on the input.
- Use `role="list"` on the container if the list is custom-rendered.

### Performance tips

- Debounce only when filtering large datasets or when filtering requires async calls.
- For DOM-based hide/show, keep the DOM structure stable to avoid reflow costs.
