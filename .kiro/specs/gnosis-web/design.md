# Gnosis Web Design

## Architecture

The app is intentionally static and modular:

```text
index.html
assets/
  css/
    styles.css
  js/
    app.js
    content.js
    markdown.js
  nature-mist-bg.png
content/
  README.md
  i18n/
    en.json
    es.json
    fr.json
    pt.json
    de.json
salmos_en.txt
salmos_es.txt
salmos_fr.txt
salmos_pt.txt
salmos_de.txt
tests/
  static.spec.mjs
  manual-checklist.md
```

## File Responsibilities

- `index.html`: HTML shell only. Contains the structural sections, nav anchors, and `data-i18n` attributes.
- `assets/css/styles.css`: All visual styling, responsive behavior, motion, LHN layout, and scrollbar behavior.
- `content/i18n/*.json`: Editable text dictionaries for each language. This is the preferred place to change website copy.
- `assets/js/content.js`: Content loader. Owns `defaultLanguage`, supported languages, translation file paths, and the Psalm file map.
- `assets/js/markdown.js`: Markdown-lite helpers for Psalm text rendering and HTML escaping.
- `assets/js/app.js`: Runtime behavior: language switching, menu state, section navigation, Psalm loading, and mobile menu.
- `tests/static.spec.mjs`: Automated static checks for architecture, translation coverage, content files, and helper behavior.
- `tests/manual-checklist.md`: Browser validation cases for desktop and mobile.

## Runtime Flow

1. Browser loads `index.html`.
2. `index.html` loads `assets/css/styles.css`.
3. `index.html` loads `assets/js/app.js` as an ES module.
4. `app.js` imports content loading helpers and Psalm file names from `content.js`.
5. `app.js` imports HTML escaping and Markdown rendering from `markdown.js`.
6. App fetches the active language dictionary from `content/i18n/{language}.json`.
7. App initializes the default language and Home section.
8. When language changes, text nodes with `data-i18n` are updated.
9. When the Psalm section is visible or language changes, the matching `.txt` file is fetched and rendered.

## Navigation Model

- Sections are single-page views toggled by `display`.
- `currentViewKey` tracks the label displayed in the top header.
- The `start-study` nav item owns the nested `psalm34-study` link.
- Parent menu click both opens the parent page and toggles submenu visibility.

## Responsive Model

- Desktop: `.app` is a two-column layout.
- Desktop LHN: `.sidebar` is `position: sticky`, `height: 100dvh`, and has independent `overflow-y: auto`.
- Mobile: `.sidebar` is hidden until hamburger opens it as a fixed full-screen overlay.
- Mobile body scroll is locked while the menu overlay is open.

## Styling Model

- Keep card radius at `8px` or below.
- Keep colors within the existing palette.
- Use background image `assets/nature-mist-bg.png` from CSS as `../nature-mist-bg.png`.
- Maintain `prefers-reduced-motion` handling.
- Avoid introducing large frameworks for this static app.

## Extension Points

- Edit current UI text in `content/i18n/{language}.json`.
- Add new UI text by adding keys to every language JSON file.
- Add a new section by adding its HTML block in `index.html`, nav item, and translations in `content.js`.
- Add behavior in `app.js` only after checking whether existing navigation/language helpers already cover it.
- Add long-form localized text as separate files when it is too large for `content.js`.
