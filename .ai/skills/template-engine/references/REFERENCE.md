## pixEngine template reference

Detailed usage, examples and security notes for `pixEngine` templates.

### Key features

- `{{ var }}` — escaped variable interpolation (safe for user input)
- `{{{ var }}}` — raw HTML injection (use only for trusted SVG/markup)
- `<if condition="..."> ... </if>` and optional `<else>` for conditionals
- `<for each="item in items"> ... </for>` for loops

### Best practices

- Compute complex fields in JS before calling `pixEngine` (e.g., `singerNames` for a song).
- Use `{{{...}}}` only for sanitized markup such as server-rendered SVG or internal icon markup.
- Translate strings in JS and pass translated labels into the template.

### Security note

- `pixEngine` escapes by default; rely on that for user-provided content.
- Sanitize any HTML you plan to render with `{{{...}}}` before injecting.
