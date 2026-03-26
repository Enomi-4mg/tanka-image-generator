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
- In the current implementation, detail values are synchronized with presets, and the main tanka text is rendered centered.
- Top/right margin inputs are visible in detail mode, but current rendering still uses centered placement.

## Project Structure
- `index.html` - UI layout
- `style.css` - visual styles
- `script.js` - canvas rendering and interactions
- `README.md` - English documentation
- `README_ja.md` - Japanese documentation

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas API

## Browser Support
Works on modern Chromium/Firefox/Safari versions that support:
- Canvas API
- `document.fonts`

## Future Improvements (Ideas)
- User-defined output filename
- Additional poetry templates
- Better punctuation and small-kana positioning for vertical typography
- Apply top/right margin inputs directly to rendering position

