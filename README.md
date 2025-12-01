# karaoke-tracker

[![Deploy](https://github.com/pixu1980/karaoke-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/pixu1980/karaoke-tracker/actions)
[![License](https://img.shields.io/github/license/pixu1980/karaoke-tracker)](LICENSE)
[![Open Issues](https://img.shields.io/github/issues/pixu1980/karaoke-tracker)](https://github.com/pixu1980/karaoke-tracker/issues)
[![Last Commit](https://img.shields.io/github/last-commit/pixu1980/karaoke-tracker)](https://github.com/pixu1980/karaoke-tracker/commits)

🎤 Simple Karaoke Singers list tracker - Manage your karaoke singers queue with style!

## Features

- ✨ Add singers to the queue with name, song title, optional image, and notes
- 🎵 Beautiful, responsive interface with modern design
- 💾 Persistent storage using IndexedDB
- ♿ Fully accessible with semantic HTML and ARIA labels
- 📱 Mobile-friendly responsive design
- 🚀 Fast and lightweight (vanilla JS, no frameworks)

## Technology Stack

- **Bundler**: Parcel.js v2
- **Styling**: Vanilla CSS with custom design system
- **JavaScript**: Vanilla JS with Custom Elements v1 API
- **Storage**: IndexedDB for persistent data
- **Deployment**: GitHub Actions → GitHub Pages

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/pixu1980/karaoke-tracker.git
cd karaoke-tracker

# Install dependencies (pnpm only)
pnpm install
```

### Development

```bash
# Start development server
pnpm start

# Open http://localhost:1234 in your browser
```

### Production Build

```bash
# Build for production
pnpm run build

# Output will be in the dist/ folder
```

## Usage

1. **Add a Singer**: Fill in the singer's name and song title (required), optionally add an image URL and notes
2. **Manage Queue**: View all singers in the queue with their information
3. **Mark as Done**: Click the green "✓ Done" button when a singer finishes
4. **Remove Singer**: Click the red "✕ Remove" button to remove from queue
5. **Clear All**: Use the "Clear All" button to reset the entire queue

## Project Structure

```
karaoke-tracker/
├── src/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # CSS with design system
│   └── app.js           # JavaScript with custom elements
├── docs/
│   └── RULES.md         # Development rules and guidelines
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions deployment
├── copilot-instructions.md  # Copilot development guide
└── package.json         # Project dependencies and scripts
```

## Development Guidelines

See [copilot-instructions.md](./copilot-instructions.md) and [docs/RULES.md](./docs/RULES.md) for detailed development guidelines and architecture information.

## Deployment

The project is configured to automatically deploy to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

### Enable GitHub Pages

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will automatically deploy on the next push to main

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! See `CONTRIBUTING.md` in the repository root for details on how to contribute.

- Development rules and conventions: `docs/RULES.md`
- Local development guide: `DEVELOPING.md`
- Issue and PR templates: `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md`

Before opening a PR, please follow the guidelines in `CONTRIBUTING.md` and the docs under `docs/`.

