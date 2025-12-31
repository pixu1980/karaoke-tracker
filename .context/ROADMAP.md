# Project Roadmap

## Overview

This document defines the Karaoke Tracker development roadmap, organized in milestones with specific acceptance criteria. The application features a **three-column layout** with Singers Management, Song Queue, and Leaderboard.

> **Note (2024-12)**: All core milestones (1-6) have been completed. The application is fully functional with:
> - Complete singers management with add/edit/delete/clear
> - Song queue with multi-singer support, key adjustment (-5 to +5), YouTube links
> - Leaderboard with top 3 medal emojis (🥇🥈🥉) and average ratings
> - Star rating with half-star support (0.5-5 in 0.5 increments) and hover preview
> - Theme switcher (light/dark/system) with emoji icons
> - Language selector (8 languages with RTL support)
> - Example data loading for demo/testing
> - Full IndexedDB persistence

**Status Legend**:
- 🟢 Completed
- 🟡 In Progress
- ⚪ Planned
- 🔴 Blocked

---

## Milestone 1: Foundation & Infrastructure ⚪
**Status**: ⚪ Planned
**Target**: Core infrastructure and base components

### Features

#### 1.1 Project Setup
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Clean `src/` folder structure
- [ ] Base HTML with three-column layout
- [ ] CSS design system with layers and variables
- [ ] Services: i18n, storage, template engine, stylesheet
- [ ] Polyfills for Safari custom elements

#### 1.2 StorageService (IndexedDB)
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Three object stores: `singers`, `songs`, `performances`
- [ ] CRUD operations for singers
- [ ] CRUD operations for songs (with multi-singer support)
- [ ] Performance recording for leaderboard
- [ ] Data schema validation

#### 1.3 Base UI Components
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] `pix-dialog` - Base dialog component with native `<dialog>`
- [ ] `pix-rating` - Star rating (1-5, half-star increments)
- [ ] `pix-color-scheme-switcher` - Light/Dark/System theme toggle
- [ ] `pix-language-select` - i18n language dropdown

---

## Milestone 2: Singers Management (Left Column) ⚪
**Status**: ⚪ Planned
**Target**: Complete singers CRUD and display

### Features

#### 2.1 SingerList Component
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Display all singers in alphabetical order
- [ ] Show song count per singer (from performances)
- [ ] Empty state when no singers
- [ ] "Add Singer" button in section header
- [ ] Updates on singer events

#### 2.2 SingerCard Component
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Display singer name
- [ ] Display song count badge
- [ ] Edit button (opens dialog)
- [ ] Remove button (with confirmation)
- [ ] Visual feedback on actions

#### 2.3 Add/Edit Singer Dialog
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Name field (required, unique validation)
- [ ] Save/Cancel buttons
- [ ] Keyboard accessible
- [ ] Close on backdrop click
- [ ] Pre-filled for edit mode

---

## Milestone 3: Song Queue (Center Column) ⚪
**Status**: ⚪ Planned
**Target**: Song queue with multi-singer support

### Features

#### 3.1 SongQueue Component
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Display songs in FIFO order
- [ ] "NOW PLAYING" badge for first song
- [ ] Empty state message
- [ ] Queue actions section
- [ ] Auto-updates on song events

#### 3.2 SongCard Component
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Song title and author display
- [ ] Singer(s) display (with group indicator for duets)
- [ ] Key adjustment badge
- [ ] YouTube link icon
- [ ] Edit, Done, Remove buttons
- [ ] Visual distinction for current song

#### 3.3 Add/Edit Song Dialog
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Song title field (required)
- [ ] Song author field (optional)
- [ ] Multi-select for singers (required, 1+)
- [ ] Key adjustment dropdown (-6 to +6)
- [ ] YouTube URL field (optional)
- [ ] Pre-filled for edit mode

#### 3.4 Song Complete Dialog
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Display song and singer(s) info
- [ ] Star rating component (optional)
- [ ] Confirm/Cancel buttons
- [ ] Creates performance record(s)
- [ ] Triggers rotation if auto-add enabled

---

## Milestone 4: Leaderboard (Right Column) ⚪
**Status**: ⚪ Planned
**Target**: Performance ranking display

### Features

#### 4.1 Leaderboard Component
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Ranked list by average rating
- [ ] Medal emojis for top 3 (🥇🥈🥉)
- [ ] Singer name display
- [ ] Song count (rated performances)
- [ ] Average rating with stars
- [ ] Numeric average value
- [ ] Empty state message
- [ ] Auto-updates on performance events

---

## Milestone 5: Header & Controls ⚪
**Status**: ⚪ Planned
**Target**: Header with actions and controls

### Features

#### 5.1 Header Layout
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Logo/Title on left
- [ ] Action buttons on right
- [ ] Responsive on mobile
- [ ] RTL support for Arabic

#### 5.2 Add Song Button
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Prominent "+" button
- [ ] Opens Add Song dialog
- [ ] Disabled state when no singers

#### 5.3 Auto Re-add Toggle
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Checkbox/switch toggle
- [ ] Enabled by default
- [ ] Persisted to localStorage
- [ ] Visual indicator of state

#### 5.4 Theme & Language Controls
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Color scheme switcher in header
- [ ] Language selector in header
- [ ] Both persist preferences

---

## Milestone 6: Auto-Rotation Feature ⚪
**Status**: ⚪ Planned
**Target**: Singer rotation after song completion

### Features

#### 6.1 Rotation Logic
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] When song completed and auto-add enabled:
  - [ ] Move singer(s) to bottom of singers list
  - [ ] Update sort order in storage
  - [ ] Dispatch rotation event
- [ ] Visual feedback during rotation
- [ ] Works correctly for duets/groups

---

## Milestone 7: Session Management ⚪
**Status**: ⚪ Planned
**Target**: Reset and example data

### Features

#### 7.1 Reset Session
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Reset button in UI (menu or controls)
- [ ] Confirmation dialog with warning
- [ ] Clears all: singers, songs, performances
- [ ] Resets all components to empty state

#### 7.2 Load Example Data
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Example data button
- [ ] Confirmation dialog
- [ ] Sample singers (8+)
- [ ] Sample songs in queue
- [ ] Useful for demo/testing

---

## Milestone 8: i18n & Accessibility ⚪
**Status**: ⚪ Planned
**Target**: Full internationalization and a11y

### Features

#### 8.1 Complete Translations
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] All 8 languages updated:
  - [ ] English (en)
  - [ ] Italian (it)
  - [ ] French (fr)
  - [ ] German (de)
  - [ ] Spanish (es)
  - [ ] Chinese (zh)
  - [ ] Japanese (ja)
  - [ ] Arabic (ar)
- [ ] RTL layout for Arabic
- [ ] All UI strings translatable

#### 8.2 Accessibility Audit
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] WCAG 2.1 AA compliance
- [ ] Full keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] Focus management in dialogs
- [ ] ARIA labels on all controls

---

## Milestone 9: Responsive Design ⚪
**Status**: ⚪ Planned
**Target**: Mobile and tablet optimization

### Features

#### 9.1 Mobile Layout
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Single column layout (< 768px)
- [ ] Tab navigation or accordion for sections
- [ ] Touch-friendly buttons
- [ ] Swipe gestures (optional)

#### 9.2 Tablet Layout
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Two-column layout (768px - 1023px)
- [ ] Singers + Queue | Leaderboard
- [ ] Optimized spacing

---

## Technical Debt & Improvements

### TD-001: Test Suite
**Priority**: High

**Acceptance Criteria**:
- [ ] Testing framework setup (Vitest)
- [ ] Unit tests for services
- [ ] Unit tests for components
- [ ] Integration tests
- [ ] Coverage > 70%

### TD-002: Performance Optimization
**Priority**: Medium

**Acceptance Criteria**:
- [ ] Lighthouse score > 90
- [ ] Bundle size < 100KB
- [ ] First Contentful Paint < 1.5s

### TD-003: Documentation
**Priority**: Ongoing

**Acceptance Criteria**:
- [ ] JSDoc for all public APIs
- [ ] Component usage examples
- [ ] Contributing guide

---

## Release Schedule

| Milestone | Target | Dependencies | Status |
|-----------|--------|--------------|--------|
| M1: Foundation | Week 1 | - | ⚪ Planned |
| M2: Singers | Week 2 | M1 | ⚪ Planned |
| M3: Song Queue | Week 2-3 | M1, M2 | ⚪ Planned |
| M4: Leaderboard | Week 3 | M1, M3 | ⚪ Planned |
| M5: Header | Week 3 | M1 | ⚪ Planned |
| M6: Rotation | Week 4 | M2, M3 | ⚪ Planned |
| M7: Session | Week 4 | All | ⚪ Planned |
| M8: i18n & a11y | Week 5 | All | ⚪ Planned |
| M9: Responsive | Week 5-6 | All | ⚪ Planned |

---

## How to Contribute

1. Choose a task from a "Planned" milestone
2. Create a branch `feature/m[number]-[feature-name]`
3. Implement following coding styleguides in `/docs/coding-styleguides/`
4. Verify all acceptance criteria
5. Create Pull Request with milestone reference

---

## Notes

- Milestones are designed to be completed incrementally
- Each milestone should result in a working feature
- Priorities may change based on feedback
- Technical debt is addressed continuously
