# Gnosis Web Requirements

## Purpose

Gnosis Web is a responsive, static study site for Christian Gnostic content. It must feel calm, contemplative, modern, and readable on mobile and desktop without requiring a build step.

## Primary Users

- Visitors who want to read introductory Gnostic material.
- Visitors who want to study the Psalms in multiple languages.
- Maintainers who need to add sections, translations, or content without editing one large file.

## Functional Requirements

1. The app must run as static files from a simple local server or GitHub Pages.
2. The app must support five languages: English, Spanish, French, Portuguese, and German.
3. Language changes must update navigation labels, page titles, body copy, and Psalm fallback text.
4. The Home view must show the quote "Know yourself and you will know the universe and the gods" in the active language.
5. The LHN must show the brand, tagline, and navigation sections.
6. "Salmos" must be a child section under "How to begin Gnostic study".
7. The parent menu item must be collapsible when clicked again.
8. The LHN must scroll independently from the page content on desktop.
9. The LHN scrollbar must be visually subtle and appear on hover, focus, or when the mobile menu is open.
10. Mobile must use a hamburger-triggered full-screen menu overlay.
11. Psalm content must load from language-specific `.txt` files.
12. If browser local-file restrictions block Psalm loading, the app must show a fallback iframe and explanatory notice.

## Non-Functional Requirements

1. Keep the visual palette aligned with the current colors: indigo, jade, aqua, gold, parchment, and mist.
2. Preserve a quiet, nature-inspired look and feel with soft motion.
3. Avoid heavy dependencies and build tooling unless a future feature clearly requires them.
4. Keep editable text content in `content/i18n/*.json`, separate from app behavior.
5. Keep styles separate from HTML structure.
6. Keep automated checks lightweight and runnable with Node.

## Content Sources

- Navigation and section copy live in `content/i18n/*.json`.
- `assets/js/content.js` only defines content file locations and loading helpers.
- Psalm long-form content lives in `salmos_en.txt`, `salmos_es.txt`, `salmos_fr.txt`, `salmos_pt.txt`, and `salmos_de.txt`.
- Visual assets live in `assets/`.

## Success Criteria

- `npm test` passes.
- The app loads at `http://127.0.0.1:8765/`.
- The console has no errors on initial load.
- Desktop and mobile layouts remain usable.
