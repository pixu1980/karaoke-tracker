# Copilot Instructions for Karaoke Tracker

## ⚠️ IMPORTANT: Documentation Source of Truth

**The `/docs` folder is the ONLY source of truth for this project's documentation.**

### MANDATORY documents to consult on EVERY prompt:

1. **`docs/RULES.md`** - Development rules and general guidelines
2. **`docs/coding-styleguides/`** - Language-specific code conventions:
   - `javascript.md` - JavaScript standards
   - `css.md` - CSS standards and conventions
   - `html.md` - HTML standards and semantics
   - `a11y.md` - Accessibility standards

### Before every code change:
- ✅ ALWAYS consult `docs/RULES.md`
- ✅ Consult relevant coding styleguides in `docs/coding-styleguides/`
- ✅ Respect ALL documented conventions
- ✅ Do not make assumptions that contradict the documentation

---

## Project Overview
Simple Karaoke Singers list tracker built with modern web technologies. This application allows users to manage a queue of karaoke singers with customizable images and notes, with data persistence using IndexedDB.

## Technology Stack
- **Bundler**: Parcel.js (v2+)
- **Styling**: Vanilla CSS with a custom design system
- **JavaScript**: Vanilla JS using Custom Elements v1 API
- **Storage**: IndexedDB for persistent data storage
- **Deployment**: GitHub Actions to GitHub Pages

## Quick Reference (see docs/ for full details)

### Architecture Principles
- Custom Elements v1 API - **NO Shadow DOM**, **NO `<template>` tags**
- Components: `SingerForm`, `SingerList`, `SingerCard`
- Storage: IndexedDB via `StorageService` class

### Development Commands
- Use **pnpm** for all installs and scripts
- `pnpm start` - Start development server
- `pnpm run build` - Build for production
- `pnpm test` - Run tests

## Documentation Structure

```
/docs
  ├── RULES.md                    # Development rules (ALWAYS consult)
  ├── PROJECT_STRUCTURE.md        # Project structure
  ├── FUNCTIONAL_ANALYSIS.md      # Functional analysis
  ├── ROADMAP.md                  # Roadmap with milestones
  └── coding-styleguides/
      ├── javascript.md           # JavaScript standards
      ├── css.md                  # CSS standards
      ├── html.md                 # HTML standards
      └── a11y.md                 # Accessibility standards
```

## When Making Changes

1. **FIRST**: Read `docs/RULES.md` and relevant styleguides
2. Keep changes minimal and focused
3. Test in the browser after changes
4. Ensure accessibility is maintained
5. Follow the documented code style
6. Update docs if architecture changes
