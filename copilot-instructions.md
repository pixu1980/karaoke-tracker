# Copilot Instructions for Karaoke Tracker

## Project Overview
Simple Karaoke Singers list tracker built with modern web technologies. This application allows users to manage a queue of karaoke singers with customizable images and notes, with data persistence using IndexedDB.

## Technology Stack
- **Bundler**: Parcel.js (v2+)
- **Styling**: Vanilla CSS with a custom design system
- **JavaScript**: Vanilla JS using Custom Elements v1 API
- **Storage**: IndexedDB for persistent data storage
- **Deployment**: GitHub Actions to GitHub Pages

## Architecture Principles

### Custom Elements
- Use Custom Elements v1 API (`customElements.define()`)
- **NO Shadow DOM** - keep everything in the light DOM
- **NO `<template>` tags** - use string interpolation for HTML
- Components: `SingerForm`, `SingerList`, `SingerCard`

### Styling Guidelines
- Use CSS custom properties (variables) defined in `:root`
- Follow the tiny design system defined in `src/styles.css`
- Mobile-first responsive design
- Maintain consistent spacing, colors, and typography

### Storage
- Primary storage: IndexedDB via `StorageService` class
- Fallback: localStorage (if needed for simple settings)
- Store singer objects with: id, name, song, imageUrl, notes, timestamp

### Accessibility
- Use semantic HTML5 elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation works
- Use proper heading hierarchy
- Provide alt text for images

## Code Style

### JavaScript
- Use modern ES6+ syntax
- Prefer `async/await` over promises
- Use classes for services and components
- Keep functions small and focused
- Add error handling for all async operations

### CSS
- Use BEM-like naming for classes (e.g., `singer-card`, `singer-info`)
- Group related styles together
- Use CSS variables for all design tokens
- Maintain responsive breakpoints

### HTML
- Use semantic elements (`<header>`, `<main>`, `<section>`, `<article>`)
- Keep structure flat and simple
- Add appropriate ARIA labels
- Ensure forms are accessible

## Development Commands
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests (currently placeholder)

## File Structure
```
/src
  ├── index.html    # Main HTML file
  ├── styles.css    # CSS with design system
  └── app.js        # Main JavaScript with custom elements
/docs
  └── RULES.md      # Development rules and guidelines
```

## Key Features to Maintain
1. **Simple UI**: Clean, intuitive interface
2. **Image Support**: Optional images for singers (with fallback)
3. **Notes**: Optional notes field for each singer
4. **Queue Management**: Add, remove, mark as done
5. **Data Persistence**: All data stored in IndexedDB
6. **Responsive**: Works on mobile and desktop

## When Making Changes
1. Keep changes minimal and focused
2. Test in the browser after changes
3. Ensure accessibility is maintained
4. Follow the existing code style
5. Update this file if architecture changes
6. Check the docs/RULES.md for additional guidelines

## Common Tasks

### Adding a New Feature
1. Consider if it needs a new custom element
2. Add necessary HTML structure in appropriate component
3. Style using existing CSS variables
4. Add necessary JavaScript logic
5. Test thoroughly

### Modifying Storage
1. Update `StorageService` class methods
2. Maintain backward compatibility if possible
3. Test data persistence across page reloads

### Styling Changes
1. Use existing CSS variables when possible
2. Add new variables to `:root` if needed
3. Ensure responsive design is maintained
4. Test on mobile and desktop viewports
