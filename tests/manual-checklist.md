# Manual Browser Checklist

Run these after structural or visual changes.

## Desktop

1. Open `http://127.0.0.1:8765/`.
2. Confirm Home loads without console errors.
3. Confirm the nature background appears.
4. Confirm the LHN stays fixed while content scrolls.
5. Confirm the LHN scrollbar is visually hidden until hover or keyboard focus.
6. Click "How to begin Gnostic study" and confirm the Salmos child appears.
7. Click the parent again and confirm the Salmos child collapses.
8. Open Salmos and confirm Psalm text loads for the active language.
9. Switch each language and confirm labels, title, quote, and Psalm fallback text update.

## Mobile

1. Test around `390px` width.
2. Confirm the hamburger button is visible.
3. Open the hamburger menu.
4. Confirm the menu overlays the screen and body scroll is locked.
5. Confirm the menu can scroll internally if content exceeds viewport height.
6. Select a nav item and confirm the menu closes.
7. Confirm Home and Salmos remain readable.

## Accessibility Smoke Test

1. Use keyboard tabbing to reach language buttons and nav controls.
2. Confirm focus does not trap unexpectedly.
3. Confirm `prefers-reduced-motion` is respected by CSS.
