# Tanka Image Generator

A browser-based tool to create and download vertical Japanese tanka images.

## Overview
Tanka Image Generator renders your tanka on an HTML canvas and exports it as a PNG file. It is designed for quick visual creation without any build step or server.

## Features
- Vertical text rendering optimized for Japanese tanka
- Live preview while you type
- Font selection (Google Fonts)
- Text color and background color customization
- Separate settings tabs:
  - Tanka settings
  - Author settings
- Footer metadata support:
  - Author name
  - SNS accounts (X / Instagram / Threads)
  - Label visibility toggles (show/hide each label)
- Preset layout modes:
  - Multiline preset
  - Single-line preset
- Detail mode inputs for typography tuning
- Output size switching:
  - 800 x 800
  - 960 x 1280
- One-click PNG download (`my-tanka.png`)

## Quick Start
1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Edit the tanka text and style options.
4. Click **"Save Image"** to download.

No npm install or additional setup is required.

## Usage Notes
- Enter one phrase per line for stable vertical composition.
- Canvas preview updates immediately on input changes.
- Footer text is drawn at the bottom and wraps automatically when long.
- In the current implementation, detail values are synchronized with presets, and the main tanka text is always horizontally centered.
- Top margin in detail mode adjusts the starting Y position of the tanka body.

## Project Structure
- `index.html` - UI layout
- `style.css` - visual styles
- `script.js` - ES module entrypoint
- `js/app.js` - app bootstrap and initial flow
- `js/tanka-renderer.js` - tanka draw orchestration
- `js/dom.js` - DOM reference collection and cached maps
- `js/state.js` - UI runtime state
- `js/layout-settings.js` - layout preset/detail calculations and UI sync
- `js/font-adjustments.js` - font/character-specific vertical adjustment profiles
- `js/text-layout.js` - vertical glyph placement and text wrapping
- `js/canvas-renderer.js` - canvas glyph/footer rendering
- `js/svg-renderer.js` - SVG writing-mode rendering with canvas fallback
- `js/ui-events.js` - event listener registration
- `README.md` - English documentation
- `README_ja.md` - Japanese documentation

## Architecture Notes
- The app is split by responsibility and connected through dependency injection (`dom`, `state`, `drawTanka`).
- `script.js` only calls `initApp()` to keep entrypoint behavior stable.
- `document.fonts.ready` is still the single gate for first render, preserving initialization order.
- SVG mode remains the default rendering path, with canvas glyph rendering used as fallback.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas API

## Browser Support
Works on modern Chromium/Firefox/Safari versions that support:
- Canvas API
- `document.fonts`

## Testing
- Manual test sheet: `test-tanka.md`
- Lightweight calculation tests (Node.js 18+):

```bash
node tests/calculation-tests.mjs
```

## Future Improvements (Ideas)
- User-defined output filename
- Additional poetry templates
- Better punctuation and small-kana positioning for vertical typography
- Expand fine-grained controls for top margin and line flow

