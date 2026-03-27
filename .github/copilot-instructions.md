# Project Guidelines

## Code Style
- Keep changes compatible with a no-build vanilla JavaScript app (ES modules loaded directly by the browser).
- Preserve module responsibilities and avoid cross-cutting logic in the entrypoint.
- Keep `script.js` as a thin entrypoint that calls `initApp()` from `js/app.js`.
- Prefer small, testable calculation functions in layout/text modules when adding rendering logic.

## Architecture
- Follow the current dependency-injection style between `dom`, `state`, and rendering functions.
- Maintain the initialization order: first render should remain gated by `document.fonts.ready`.
- Keep rendering behavior consistent with the current strategy: SVG writing-mode path first, Canvas fallback path second.
- Respect module boundaries described in `README.md` and `README_ja.md` instead of duplicating architecture docs here.

## Build and Test
- There is no build step and no package install step for normal development.
- Run lightweight calculation tests with Node.js 18+:

```bash
node tests/calculation-tests.mjs
```

- Use the manual regression checklist in `test-tanka.md` for UI/rendering behavior checks.

## Conventions
- For vertical composition stability, treat one phrase per line as the default input assumption.
- When changing layout/detail behavior, keep preset-sync behavior and detail-mode behavior aligned.
- Keep English/Japanese documentation in sync for user-visible behavior changes:
  - `README.md`
  - `README_ja.md`