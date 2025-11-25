# Project Roadmap

## Overview

This document defines the Karaoke Tracker development roadmap, organized in milestones with specific acceptance criteria.

**Status Legend**:
- 🟢 Completed
- 🟡 In Progress
- ⚪ Planned
- 🔴 Blocked

---

## Milestone 1: MVP Core ✅
**Status**: 🟢 Completed
**Target**: Basic queue management functionality

### Features

#### 1.1 Add Singer Form
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Form with fields: name (required), song title (required), song author, key adjustment, YouTube URL
- [x] HTML5 validation for required fields
- [x] `aria-required` attributes for accessibility
- [x] Form reset after successful submit
- [x] Error feedback on failure

#### 1.2 Singers List
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Display singers list in insertion order
- [x] Empty state when list is empty
- [x] Automatic update on add/remove
- [x] Card with name, song info, key, YouTube link

#### 1.3 Singer Actions
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] "Done" button with confirmation
- [x] "Remove" button with confirmation
- [x] "Edit" button with dialog
- [x] "Clear All" button with confirmation
- [x] Error feedback on failure

#### 1.4 Data Persistence
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Save to IndexedDB
- [x] Load data on startup
- [x] Persist after page refresh
- [x] IndexedDB error handling

---

## Milestone 2: Layout & UX Improvements ✅
**Status**: 🟢 Completed
**Target**: UX improvements and layout refinement

### Features

#### 2.1 Two-Column Layout
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Singers list on the left side
- [x] Add singer form on the right side
- [x] Responsive: stack vertically on mobile
- [x] Proper spacing and visual hierarchy

#### 2.2 Dialog Modals
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Native `<dialog>` element for confirmations
- [x] Example list dialog
- [x] Reset list dialog
- [x] Remove singer dialog
- [x] Done singer dialog with rating
- [x] Edit singer dialog

#### 2.3 NOW SINGING Badge
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Visual indicator for first singer in queue
- [x] Badge with microphone emoji
- [x] Card styling highlight

---

## Milestone 3: Performance Rating ✅
**Status**: 🟢 Completed
**Target**: Applause meter rating system

### Features

#### 3.1 Star Rating Component
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Star rating display (1-5 stars)
- [x] Support for half-star increments (0.5)
- [x] Visual star icons with CSS clip-path
- [x] Click-only interaction (no hover preview)
- [x] Reset button to clear rating
- [x] Accessible: keyboard navigable, screen reader support
- [x] Clear visual feedback on selection

#### 3.2 Rating in Done Flow
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Rating appears in "Done" dialog
- [x] Rating synced from card to dialog
- [x] Rating saved with performance record
- [x] Optional (can complete without rating)

#### 3.3 Leaderboard
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Display singers ranked by average rating
- [x] Show rank emoji (🥇🥈🥉) for top 3
- [x] Show song count per singer
- [x] Show average rating with stars
- [x] Empty state message
- [x] Reset with clear all / example list

---

## Milestone 4: Auto Re-add & Queue Management ✅
**Status**: 🟢 Completed
**Target**: Advanced queue management

### Features

#### 4.1 Auto Re-add Toggle
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Checkbox toggle in header
- [x] Enabled by default
- [x] Re-add singer to end of queue on "Done"
- [x] Add with "(next song)" placeholder

#### 4.2 Example List
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Button to load sample data
- [x] 8 example singers with various songs
- [x] Clears current queue first
- [x] Confirmation dialog

---

## Milestone 5: Theme & Internationalization ✅
**Status**: 🟢 Completed
**Target**: Multi-language and theme support

### Features

#### 5.1 Theme Switcher
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Light mode (☀️)
- [x] Dark mode (🌙)
- [x] System mode (💻) - follows OS preference
- [x] Theme persisted to localStorage
- [x] CSS custom properties for colors
- [x] Default: System

#### 5.2 Multi-language Support (i18n)
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Language selector in header
- [x] 8 supported languages:
  - 🇬🇧 English
  - 🇮🇹 Italian
  - 🇫🇷 French
  - 🇩🇪 German
  - 🇪🇸 Spanish
  - 🇨🇳 Chinese
  - 🇯🇵 Japanese
  - 🇸🇦 Arabic
- [x] `data-i18n` attributes for static text
- [x] `i18n.t()` function for dynamic text
- [x] Language persisted to localStorage
- [x] Components re-render on language change

#### 5.3 RTL Support
**Status**: 🟢 Completed

**Acceptance Criteria**:
- [x] Arabic language with RTL layout
- [x] Document direction changes (`dir="rtl"`)
- [x] CSS rules for RTL elements
- [x] Header controls position flip
- [x] Actions buttons direction flip

---

## Milestone 6: History & Analytics ⚪
**Status**: ⚪ Planned
**Target**: History and statistics

### Features

#### 6.1 Performance History
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Separate tab/section for history
- [ ] View completed performances
- [ ] Performance timestamp
- [ ] History list display
- [ ] Re-add from history option

#### 6.2 Night Statistics
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Total performance count
- [ ] Most frequent singers
- [ ] Most popular songs
- [ ] Average wait time
- [ ] Average performance rating
- [ ] Rating distribution chart

#### 6.3 Data Export
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] JSON export of the night
- [ ] CSV export for spreadsheets
- [ ] Import data from file
- [ ] Imported data validation

---

## Milestone 7: Advanced Queue Management ⚪
**Status**: ⚪ Planned
**Target**: Advanced queue features

### Features

#### 7.1 Drag & Drop Reorder
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Reorder cards via drag & drop
- [ ] Visual indicator during drag
- [ ] Save new order to IndexedDB
- [ ] Touch support for mobile
- [ ] Keyboard alternative for accessibility

#### 7.2 Search/Filter
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Search field above list
- [ ] Real-time filter by name or song
- [ ] Highlight found terms
- [ ] "No results" message if empty
- [ ] Clear button for filter reset

#### 7.3 Queue Counter
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Total singers in queue count
- [ ] Estimated wait time (based on average)
- [ ] Real-time update

---

## Milestone 8: Multi-Session ⚪
**Status**: ⚪ Planned
**Target**: Multiple nights management

### Features

#### 8.1 Sessions
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Create new session/night
- [ ] Saved sessions list
- [ ] Switch between sessions
- [ ] Archive past sessions
- [ ] Delete session

#### 8.2 Session Settings
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Customizable session name
- [ ] Session date
- [ ] Session notes/description
- [ ] Configurable average song time

---

## Milestone 9: PWA & Offline ⚪
**Status**: ⚪ Planned
**Target**: Progressive Web App

### Features

#### 9.1 Service Worker
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Static assets caching
- [ ] Full offline operation
- [ ] Data sync when online
- [ ] Update notification

#### 9.2 Installation
**Status**: ⚪ Planned

**Acceptance Criteria**:
- [ ] Valid manifest.json
- [ ] Icons for all platforms
- [ ] Installation prompt
- [ ] Splash screen

---

## Technical Debt & Improvements

### TD-001: Test Suite
**Priority**: High

**Acceptance Criteria**:
- [ ] Testing framework setup (Vitest or similar)
- [ ] Unit tests for StorageService
- [ ] Unit tests for Custom Elements
- [ ] Integration tests for main flows
- [ ] Coverage > 70%

### TD-002: Error Boundary
**Priority**: Medium

**Acceptance Criteria**:
- [ ] Global error handling
- [ ] UI fallback for critical errors
- [ ] Structured error logging

### TD-003: Performance Audit
**Priority**: Medium

**Acceptance Criteria**:
- [ ] Lighthouse score > 90 on all categories
- [ ] Bundle analysis
- [ ] List rendering optimization

### TD-004: Documentation
**Priority**: Ongoing

**Acceptance Criteria**:
- [ ] Complete JSDoc for all public functions
- [ ] Storybook or demo page for components
- [ ] Contributing guide
- [ ] Automatic changelog

---

## Release Schedule

| Milestone | Target | Dependencies | Status |
|-----------|--------|--------------|--------|
| M1: MVP Core | ✅ Q4 2024 | - | 🟢 Done |
| M2: Layout & UX | ✅ Q4 2024 | M1 | 🟢 Done |
| M3: Performance Rating | ✅ Q4 2024 | M2 | 🟢 Done |
| M4: Auto Re-add | ✅ Q4 2024 | M2 | 🟢 Done |
| M5: Theme & i18n | ✅ Q4 2024 | M2 | 🟢 Done |
| M6: History & Analytics | Q1 2025 | M3 | ⚪ Planned |
| M7: Advanced Queue | Q1 2025 | M4 | ⚪ Planned |
| M8: Multi-Session | Q2 2025 | M6 | ⚪ Planned |
| M9: PWA & Offline | Q2 2025 | M8 | ⚪ Planned |

---

## How to Contribute

1. Choose a task from an "In Progress" or "Planned" milestone
2. Create a branch `feature/[milestone]-[feature-name]`
3. Implement following coding styleguides in `/docs/coding-styleguides/`
4. Verify all acceptance criteria
5. Create Pull Request with milestone reference

---

## Notes

- Dates are indicative and subject to revision
- Priorities may change based on user feedback
- New features can be added to future milestones
- Technical debt is addressed continuously, not in a dedicated milestone
