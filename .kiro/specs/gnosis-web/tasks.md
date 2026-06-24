# Gnosis Web Task Workflow

## Before Changing Code

1. Read this folder first:
   - `.kiro/specs/gnosis-web/requirements.md`
   - `.kiro/specs/gnosis-web/design.md`
   - `.kiro/specs/gnosis-web/tasks.md`
2. Check `git status --short`.
3. Identify which module owns the requested change:
   - Structure: `index.html`
   - Styling/responsive behavior: `assets/css/styles.css`
   - Translations/text labels: `content/i18n/*.json`
   - Content loading paths: `assets/js/content.js`
   - Psalm rendering: `assets/js/markdown.js`
   - Navigation/runtime behavior: `assets/js/app.js`
   - Long-form Psalm content: `salmos_*.txt`

## Implementation Order

1. Update the smallest responsible module first.
2. Keep cross-module changes explicit.
3. If a new `data-i18n` key is added, add it to every `content/i18n/*.json` file.
4. If a new asset is added, place it under `assets/`.
5. If behavior changes, update or add tests in `tests/static.spec.mjs`.
6. If expected browser behavior changes, update `tests/manual-checklist.md`.
7. If architecture or feature scope changes, update these specs.

## Validation Order

1. Run `npm test`.
2. Start or reuse the local server at `http://127.0.0.1:8765/`.
3. Verify desktop:
   - LHN remains fixed while content scrolls.
   - LHN scrollbar is subtle until hover/focus.
   - Language switch works.
   - Salmos nested menu opens and collapses.
4. Verify mobile:
   - Hamburger opens full-screen menu.
   - Body scroll locks while menu is open.
   - Menu can scroll internally.
   - Content remains readable.
5. Check browser console for errors.

## Commit Guidance

Use concise commit messages:

- `Refactor app architecture`
- `Update mobile navigation`
- `Add Spanish section copy`
- `Improve Psalm rendering`

Keep generated or unrelated files out of commits.
