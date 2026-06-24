# Content Editing Guide

This folder is the editable content layer for the static site.

## Where To Change Text

Use the language JSON files in `content/i18n/` for short and structured website text:

```text
content/i18n/en.json
content/i18n/es.json
content/i18n/fr.json
content/i18n/pt.json
content/i18n/de.json
```

Each file has the same keys. Change the value, keep the key.

Example:

```json
{
  "home_title": "Bienvenido",
  "home_desc": "Nuevo texto para la p?gina de inicio"
}
```

## Important Rules

1. Keep valid JSON: double quotes, commas between fields, no trailing comma after the last field.
2. Do not rename keys unless you also update the HTML or JavaScript that uses them.
3. When adding a key, add it to every language file.
4. Long Psalm study text still lives in the existing `salmos_*.txt` files.
5. Run `npm test` after editing content.

## Common Keys

- `home_title`, `home_quote`, `home_desc`: Home page.
- `masthead_title`: Large page headline.
- `intro_p1`, `intro_p2`: Introduction page body.
- `start_step*_title`, `start_step*_text`: Study-start cards.
- `daily_reflection_*`: Daily reflection page.
- `contact_text`: Contact page body.
