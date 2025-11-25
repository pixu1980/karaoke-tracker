# Functional Analysis

## Executive Summary

**Karaoke Tracker** is a web application designed to manage the singer queue during a karaoke night. The application allows adding singers with song information, managing the performance order, rating performances, viewing a leaderboard, and maintaining a persistent history of performances. It supports multiple languages (8) and themes (light/dark/system).

---

## Target Users

### Primary User: KJ (Karaoke Jockey) / Host
- **Needs**: Quickly manage singer queue during the event
- **Usage context**: Mobile device or tablet during the event
- **Technical skills**: Basic

### Secondary User: Event Organizer
- **Needs**: View participant order
- **Usage context**: Evening supervision
- **Technical skills**: Basic

---

## Functional Requirements

### FR-001: Add Singer
**Description**: User must be able to add a new singer to the queue.

**Form fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Singer name | Text | ✅ Yes | Min 1 character |
| Song title | Text | ✅ Yes | Min 1 character |
| Song author | Text | ❌ No | - |
| Key adjustment | Select | ❌ No | Values: -4 to +4 |
| YouTube URL | URL | ❌ No | Valid YouTube URL |

**Behavior**:
1. User fills the form
2. Click "Add to Queue"
3. Required fields validation
4. Save to IndexedDB with timestamp
5. Reset form
6. Update singer list

**User feedback**:
- Validation error: field highlight
- Save error: alert with message

---

### FR-002: Singer List Display
**Description**: User must view all singers in queue.

**Information displayed per singer**:
- Singer name
- Song title and author
- Key adjustment (if set)
- YouTube link (if provided)
- Star rating (0-5 with half-star increments)
- "NOW SINGING" badge for first singer
- Available actions (Edit, Done, Remove)

**Sorting**: By insertion timestamp (FIFO)

**List states**:
- **Empty**: "No singers in the queue yet" message
- **Populated**: List of singer cards
- **Error**: Loading error message

---

### FR-003: Remove Singer
**Description**: User must be able to remove a singer from the queue.

**Trigger**: Click on "Remove" button

**Behavior**:
1. Action confirmation (dialog)
2. Remove from IndexedDB
3. Update list

---

### FR-004: Complete Singer (Done)
**Description**: User must be able to mark a singer as "done" with optional rating.

**Trigger**: Click on "Done" button

**Behavior**:
1. Action confirmation (dialog with star rating)
2. Optional: Set performance rating (1-5 stars with 0.5 increments)
3. Save performance to history (if rated)
4. Remove from active queue
5. Optional: Auto re-add singer to queue (if checkbox enabled)
6. Update list and leaderboard

---

### FR-005: Edit Singer
**Description**: User must be able to edit singer information.

**Trigger**: Click on "Edit" button

**Behavior**:
1. Open edit dialog with pre-filled data
2. Modify fields
3. Save changes to IndexedDB
4. Update list

---

### FR-006: Clear All / Reset List
**Description**: User must be able to clear the entire queue.

**Trigger**: Click on "Reset List" button

**Behavior**:
1. Action confirmation (dialog with warning)
2. Remove all records from IndexedDB (singers and performances)
3. Update list (show empty state)
4. Reset leaderboard

---

### FR-007: Load Example List
**Description**: User can load a pre-defined list of example singers.

**Trigger**: Click on "Example List" button

**Behavior**:
1. Action confirmation (dialog with warning)
2. Clear current queue and performances
3. Load sample singers data
4. Update list

---

### FR-008: Star Rating System
**Description**: Rate singer performances with stars.

**Features**:
- 5-star rating with half-star increments (0.5)
- Click to set rating (no hover preview)
- Reset button to clear rating
- Rating synced between card and done modal
- Rating saved with performance for leaderboard

---

### FR-009: Leaderboard
**Description**: Display ranked list of singers by average rating.

**Information displayed**:
- Rank (🥇🥈🥉 for top 3)
- Singer name
- Number of songs performed
- Average rating with stars
- Numeric average

**Behavior**:
- Updates when performance is completed with rating
- Resets when list is cleared

---

### FR-010: Auto Re-add
**Description**: Automatically re-add singer to queue after completion.

**Trigger**: Checkbox in header controls (enabled by default)

**Behavior**:
1. When "Done" is clicked and auto re-add is enabled
2. Singer is added back to queue with "(next song)" placeholder
3. Original singer is removed from current position

---

### FR-011: Theme Switcher
**Description**: Switch between light, dark, and system themes.

**Options**:
- ☀️ Light mode
- 🌙 Dark mode
- 💻 System (follows OS preference)

**Behavior**:
- Theme saved to localStorage
- Applies CSS custom properties for colors
- Default: System

---

### FR-012: Multi-language Support (i18n)
**Description**: Application supports multiple languages.

**Supported languages**:
- 🇬🇧 English (en)
- 🇮🇹 Italian (it)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇨🇳 Chinese (zh)
- 🇯🇵 Japanese (ja)
- 🇸🇦 Arabic (ar) - with RTL support

**Behavior**:
- Language saved to localStorage
- All UI text translated via `data-i18n` attributes
- Dynamic components use `i18n.t()` function
- RTL languages change document direction

---

### FR-013: Data Persistence
**Description**: Data must persist between sessions.

**Technology**: IndexedDB

**Data schema**:
```javascript
// singers store
{
    id: Number,           // Auto-generated, primary key
    name: String,         // Singer name (required)
    songTitle: String,    // Song title (required)
    songAuthor: String,   // Song author/artist (optional)
    songKey: String,      // Key adjustment: -4 to +4 (optional)
    youtubeUrl: String,   // YouTube backing track URL (optional)
    rating: Number,       // Current rating 0-5 (optional)
    timestamp: Number     // Unix timestamp of insertion
}

// performances store
{
    id: Number,           // Auto-generated, primary key
    singerName: String,   // Singer name
    songTitle: String,    // Song title
    rating: Number,       // Performance rating 1-5
    timestamp: Number     // Unix timestamp of completion
}
```

**Indexes**: `timestamp` for sorting, `singerName` for leaderboard

---

## Non-Functional Requirements

### NFR-001: Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle size**: < 100KB

### NFR-002: Responsiveness
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### NFR-003: Accessibility
- **WCAG Level**: AA
- **Keyboard navigation**: Complete
- **Screen reader**: Compatible
- **Color contrast**: Compliant
- **RTL support**: Arabic language

### NFR-004: Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### NFR-005: Offline Capability
- Offline operation with local data
- No dependency on external servers

---

## User Flows

### UF-001: Add New Singer

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Open      │───▶│   Fill      │───▶│   Submit    │───▶│   List      │
│   App       │    │   Form      │    │   Form      │    │   Updated   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### UF-002: Queue Management During Event

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Singer     │───▶│   Click     │───▶│   Rate      │───▶│   Next      │
│  Performs   │    │   "Done"    │    │  (optional) │    │   Singer    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### UF-003: Auto Re-add Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Complete   │───▶│  Auto-add   │───▶│  Singer at  │───▶│  Edit new   │
│  Singer     │    │  Enabled    │    │  End Queue  │    │  Song Info  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Data Model

### Entity: Singer

```
┌────────────────────────────────────────┐
│               Singer                    │
├────────────────────────────────────────┤
│ PK  id         : Number (auto)         │
│     name       : String (required)     │
│     songTitle  : String (required)     │
│     songAuthor : String (optional)     │
│     songKey    : String (optional)     │
│     youtubeUrl : String (optional)     │
│     rating     : Number (optional)     │
│     timestamp  : Number (auto)         │
└────────────────────────────────────────┘
```

### Entity: Performance

```
┌────────────────────────────────────────┐
│             Performance                 │
├────────────────────────────────────────┤
│ PK  id         : Number (auto)         │
│     singerName : String (required)     │
│     songTitle  : String (required)     │
│     rating     : Number (required)     │
│     timestamp  : Number (auto)         │
└────────────────────────────────────────┘
```

### Storage Structure

```
IndexedDB: KaraokeTrackerDB
├── Version: 2
├── ObjectStore: singers
│   ├── keyPath: id (autoIncrement)
│   └── Index: timestamp
└── ObjectStore: performances
    ├── keyPath: id (autoIncrement)
    ├── Index: singerName
    └── Index: timestamp
```

---

## UI Components

### Component: SingerForm
**Responsibility**: Collect new singer data
**Input**: User form data
**Output**: Custom event `singer-added`
**i18n**: Yes - labels use `i18n.t()`

### Component: SingerList
**Responsibility**: Display singers list
**Input**: Events `storage-ready`, `singer-added`, `singer-deleted`, `language-changed`
**Output**: Render SingerCard list
**i18n**: Yes - empty state message

### Component: SingerCard
**Responsibility**: Display single singer with actions
**Input**: Singer data via data attributes
**Output**: Action events (edit, done, remove)
**i18n**: Yes - buttons and badges

### Component: StarRating
**Responsibility**: Display and capture star ratings
**Input**: `value` attribute (0-5)
**Output**: Custom event `rating-change`
**i18n**: Yes - rating label

### Component: SingerLeaderboard
**Responsibility**: Display ranked singers by average rating
**Input**: Events `storage-ready`, `performance-added`, `leaderboard-reset`, `language-changed`
**Output**: Ranked list
**i18n**: Yes - empty state and song count

---

## Error Handling

### User Errors
| Error | Message | Recovery |
|-------|---------|----------|
| Empty required field | Field highlight | Focus on field |
| Invalid URL | (silent) | Ignored |

### System Errors
| Error | Message | Recovery |
|-------|---------|----------|
| IndexedDB unavailable | Alert | Page refresh |
| Save error | Alert | Retry |
| Load error | Message in list | Retry |

---

## Future Considerations

### Potential Evolutions (not in current scope):
1. **Drag & drop**: Manual queue reordering
2. **Singer search**: Filter by name/song
3. **Export/Import**: JSON data backup
4. **Multi-session**: Multiple nights management
5. **Timer**: Estimated wait time
6. **Music API integration**: Song search
7. **PWA**: Offline-first with service worker

---

## Acceptance Criteria Summary

✅ **MVP Complete**:
- [x] Add singer form working
- [x] Singer list displayed correctly
- [x] Edit singer working
- [x] Done/Remove actions working with dialogs
- [x] Clear All working
- [x] Data persistent after refresh
- [x] Responsive on mobile/desktop
- [x] Keyboard accessible
- [x] Star rating system
- [x] Leaderboard with average ratings
- [x] Auto re-add functionality
- [x] Theme switcher (light/dark/system)
- [x] Multi-language support (8 languages)
- [x] RTL support for Arabic
- [x] No console errors in normal use
