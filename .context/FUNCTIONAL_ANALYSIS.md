# Functional Analysis

## Executive Summary

**Karaoke Tracker** is a web application designed for KJs (Karaoke Jockeys) to manage singers and song queues during karaoke events. The application features a **three-column layout** with:
- **Singers Management** (left column)
- **Song Queue** (center column)
- **Leaderboard** (right column)

Key features include multi-singer support (duets/groups), performance tracking, star ratings, automatic queue rotation, and comprehensive internationalization (8 languages with RTL support).

---

## Target Users

### Primary User: KJ (Karaoke Jockey) / Host
- **Needs**: Efficiently manage singers rotation and song queue during events
- **Usage context**: Tablet or laptop at the karaoke station
- **Technical skills**: Basic

### Secondary User: Event Organizer
- **Needs**: Overview of participant order and performance statistics
- **Usage context**: Evening supervision
- **Technical skills**: Basic

---

## Application Layout

### Three-Column Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                          │
│  ┌──────────────────────┐              ┌────────────────────────────────┐   │
│  │ 🎤 Karaoke Tracker   │              │ [🔄 Auto] [☀️🌙💻] [🌐] [📥]   │   │
│  └──────────────────────┘              └────────────────────────────────┘   │
├─────────────────────┬─────────────────────────┬─────────────────────────────┤
│   SINGERS LIST      │     SONG QUEUE          │      LEADERBOARD            │
│   (Left Column)     │     (Center Column)     │      (Right Column)         │
│                     │                         │                             │
│   ┌───────────────┐ │   [+ Add Song] [Clear]  │   ┌─────────────────────┐   │
│   │ Singer Card   │ │                         │   │ 🏆 Leaderboard      │   │
│   │ - Name        │ │   ┌─────────────────┐   │   │                     │   │
│   │ - Songs: 3    │ │   │ 🎤 NOW PLAYING  │   │   │ 🥇 Singer A - ⭐4.5 │   │
│   │ [Edit][Del]   │ │   │ Song Card       │   │   │ 🥈 Singer B - ⭐4.2 │   │
│   └───────────────┘ │   │ - Title         │   │   │ 🥉 Singer C - ⭐4.0 │   │
│                     │   │ - Author        │   │   │    Singer D - ⭐3.8 │   │
│   ┌───────────────┐ │   │ - Singers       │   │   └─────────────────────┘   │
│   │ Singer Card   │ │   │ - Key           │   │                             │
│   │ ...           │ │   │ [Done][Remove]  │   │                             │
│   └───────────────┘ │   └─────────────────┘   │                             │
│                     │                         │                             │
│ [+ Add] [Clear]     │   ┌─────────────────┐   │                             │
│                     │   │ Next Song       │   │                             │
│                     │   │ ...             │   │                             │
│                     │   └─────────────────┘   │                             │
├─────────────────────┴─────────────────────────┴─────────────────────────────┤
│                              FOOTER                                          │
│                    © 2024 | Links | Credits                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop (1024px+)**: Three columns side by side
- **Tablet (768px - 1023px)**: Stacked layout (Singers + Queue | Leaderboard)
- **Mobile (< 768px)**: Single column with tabs or accordion

---

## Functional Requirements

### FR-001: Singers Management (Left Column)

**Description**: Manage the list of singers participating in the karaoke night.

#### FR-001.1: Add Singer
**Form fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Singer name | Text | ✅ Yes | Min 1 character, unique |

**Behavior**:
1. Click "Add Singer" button in singers section
2. Modal opens with name field
3. Validate uniqueness
4. Save to IndexedDB
5. Update singers list

#### FR-001.2: Singers List Display
**Information per singer**:
- Singer name
- Song count for the night (from archived performances)
- Edit button
- Remove button

**Sorting**: Alphabetical or by song count (configurable)

#### FR-001.3: Edit Singer
**Trigger**: Click "Edit" button on singer card
**Behavior**: Open modal to edit singer name

#### FR-001.4: Remove Singer
**Trigger**: Click "Remove" button
**Behavior**:
1. Confirmation dialog
2. Remove singer
3. Remove associated pending songs from queue
4. Keep archived performances (for leaderboard)

#### FR-001.5: Auto Re-add (Rotation)
**Description**: When "Auto Re-add" is enabled and a song is completed:
1. The singer(s) who just performed are moved to the bottom of the singers list
2. This allows KJ to approach them and ask for their next song

---

### FR-002: Song Queue (Center Column)

**Description**: Manage the queue of songs to be performed.

#### FR-002.1: Add Song to Queue
**Trigger**: Click "Add Song" button in SongQueue header
**Form fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Song title | Text | ✅ Yes | Min 1 character |
| Song author | Text | ❌ No | - |
| Singers | Multi-select | ✅ Yes | At least 1 singer |
| Key adjustment | Select | ❌ No | Values: -5 to +5, with "0 (Original Key)" default |
| YouTube URL | URL | ❌ No | Valid YouTube URL |

**Multi-singer support**:
- Select one or more singers (duets, trios, groups)
- All selected singers are credited for the performance

#### FR-002.2: Song Queue Display
**Information per song**:
- Song title and author
- Singer(s) names (with visual indication for duets/groups)
- Key adjustment badge (if set)
- YouTube link icon (if provided)
- "NOW PLAYING" badge for first song
- Available actions: Edit, Done, Remove

**Sorting**: By insertion timestamp (FIFO)

#### FR-002.3: Complete Song (Done)
**Trigger**: Click "Done" button
**Behavior**:
1. Open confirmation modal with star rating
2. Set performance rating (0.5-5 stars in 0.5 increments, with hover preview)
3. Archive performance:
   - Create performance record for EACH singer involved
   - Increment song count for each singer
4. Remove from active queue
5. If "Auto Re-add" enabled: move involved singer(s) to bottom of singers list
6. Update leaderboard

#### FR-002.4: Edit Song
**Trigger**: Click "Edit" button
**Behavior**: Open modal with pre-filled data, allow modification

#### FR-002.5: Remove Song
**Trigger**: Click "Remove" button
**Behavior**: Confirmation dialog, then remove from queue

---

### FR-003: Leaderboard (Right Column)

**Description**: Display ranked list of singers by average performance rating.

**Information displayed per singer**:
- Rank position (🥇🥈🥉 for top 3)
- Singer name
- Number of songs performed (with rating)
- Average rating with star visualization
- Numeric average value

**Behavior**:
- Auto-updates when a performance is completed with rating
- Only includes singers with at least one rated performance
- Resets when session is cleared

---

### FR-004: Header Controls

**Layout (left to right)**:
1. **Logo/Title**: App branding (🎤 emoji + "Karaoke Tracker")
2. **Spacer**
3. **Auto Re-add Toggle**: Checkbox/switch for rotation feature (🔄)
4. **Color Scheme Switcher**: Light/Dark/System (☀️/🌙/💻)
5. **Language Selector**: i18n dropdown with flags
6. **Example Data Button**: Load sample data for demo/testing

**Note**: The "Add Song" button has been moved to the SongQueue component header alongside a "Clear Songs" button. Similarly, the SingerList component has its own "Add Singer" and "Clear Singers" buttons.

---

### FR-005: Session Management

#### FR-005.1: Clear All Singers
**Trigger**: Click "Clear Singers" button in SingerList header
**Behavior**:
1. Confirmation dialog with warning
2. Clear all data (singers, songs, performances)
3. Start fresh session

#### FR-005.2: Clear All Songs
**Trigger**: Click "Clear Songs" button in SongQueue header
**Behavior**:
1. Confirmation dialog with warning
2. Clear all songs from queue
3. Keep singers and performance history

#### FR-005.3: Load Example Data
**Trigger**: Click Example Data button in header
**Behavior**:
1. Confirmation dialog
2. Load sample data:
   - 10 singers with names
   - 20 queued songs with various artists
   - 10 completed performances with ratings (2.5-5 stars)
3. Useful for demo/testing

---

### FR-006: Theme Switcher
**Options**:
- ☀️ Light mode
- 🌙 Dark mode
- 💻 System (follows OS preference)

**Implementation**: Uses CSS `color-scheme` and `light-dark()` function

---

### FR-007: Multi-language Support (i18n)

**Supported languages**:
| Code | Language | RTL |
|------|----------|-----|
| en | English | No |
| it | Italian | No |
| fr | French | No |
| de | German | No |
| es | Spanish | No |
| zh | Chinese | No |
| ja | Japanese | No |
| ar | Arabic | Yes |

---

### FR-008: Data Persistence

**Technology**: IndexedDB

**Data stores**:

#### Store: `singers`
```javascript
{
    id: Number,           // Auto-generated, primary key
    name: String,         // Singer name (required, unique)
    createdAt: Number,    // Unix timestamp
    sortOrder: Number     // For manual ordering / rotation
}
```

#### Store: `songs`
```javascript
{
    id: Number,           // Auto-generated, primary key
    title: String,        // Song title (required)
    author: String,       // Song author/artist (optional)
    singerIds: Number[],  // Array of singer IDs (required, 1+)
    key: String,          // Key adjustment: -6 to +6 (optional)
    youtubeUrl: String,   // YouTube backing track URL (optional)
    status: String,       // 'queued' | 'archived'
    createdAt: Number,    // Unix timestamp
    completedAt: Number   // Unix timestamp (when archived)
}
```

#### Store: `performances`
```javascript
{
    id: Number,           // Auto-generated, primary key
    songId: Number,       // Reference to song
    singerId: Number,     // Reference to singer (one record per singer)
    songTitle: String,    // Denormalized for display
    singerName: String,   // Denormalized for display
    rating: Number,       // Performance rating 1-5 (optional)
    performedAt: Number   // Unix timestamp
}
```

---

## Non-Functional Requirements

### NFR-001: Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle size**: < 100KB

### NFR-002: Responsiveness
- **Mobile**: 320px - 767px (single column)
- **Tablet**: 768px - 1023px (two columns)
- **Desktop**: 1024px+ (three columns)

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
- Full offline operation with local IndexedDB
- No external server dependencies

---

## User Flows

### UF-001: Add Singer and First Song

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Open      │───▶│ Add Singer  │───▶│  Add Song   │───▶│   Queue     │
│   App       │    │  (modal)    │    │  (modal)    │    │   Updated   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### UF-002: Complete Song with Rotation

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Song Plays  │───▶│ Click Done  │───▶│ Rate + OK   │───▶│ Singer at   │
│             │    │             │    │             │    │ Bottom      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                      ┌─────────────┐
                                      │ Leaderboard │
                                      │ Updated     │
                                      └─────────────┘
```

### UF-003: Duet Performance

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Add Song    │───▶│ Select 2+   │───▶│ Song Done   │───▶│ All Singers │
│ Modal       │    │ Singers     │    │ with Rating │    │ Credited    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## UI Components

### Core Components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `singer-list` | Left Column | Display and manage singers |
| `singer-card` | Left Column | Single singer with actions |
| `song-queue` | Center Column | Display song queue |
| `song-card` | Center Column | Single song with actions |
| `leaderboard` | Right Column | Ranked performances |

### UI Components

| Component | Responsibility |
|-----------|----------------|
| `pix-dialog` | Base dialog component |
| `pix-rating` | Star rating input/display |
| `color-scheme-switcher` | Theme toggle |
| `language-select` | i18n dropdown |

### Dialog Components

| Component | Trigger |
|-----------|---------|
| `add-singer-dialog` | Add/Edit singer |
| `add-song-dialog` | Add/Edit song (with multi-select) |
| `confirm-dialog` | Generic confirmations |
| `song-complete-dialog` | Done action with rating |

---

## Error Handling

### User Errors
| Error | Message | Recovery |
|-------|---------|----------|
| Empty required field | Field highlight + message | Focus on field |
| Duplicate singer name | "Singer already exists" | Edit name |
| No singer selected | "Select at least one singer" | Show multi-select |

### System Errors
| Error | Message | Recovery |
|-------|---------|----------|
| IndexedDB unavailable | Alert with instructions | Page refresh |
| Save error | Toast notification | Retry action |
| Load error | Error state in list | Retry button |

---

## Acceptance Criteria Summary

### MVP Requirements:
- [ ] Three-column layout (responsive)
- [ ] Singers CRUD with song count
- [ ] Songs queue with multi-singer support (duets/groups)
- [ ] Leaderboard with average ratings
- [ ] Auto re-add / rotation feature
- [ ] Star rating system
- [ ] Theme switcher (light/dark/system)
- [ ] Multi-language support (8 languages)
- [ ] RTL support for Arabic
- [ ] Data persistence with IndexedDB
- [ ] Keyboard accessible
- [ ] No console errors in normal use
