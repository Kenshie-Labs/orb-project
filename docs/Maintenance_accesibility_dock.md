# Accessibility Dock: Maintenance Guide

This document describes the accessibility dock feature of the Orb project: what it does, how it is built, and how to maintain it. Read this before changing the layout, the dialogs, or the accessibility settings.

---

## 1. Overview

The accessibility feature has two parts:

1. **The dock** — a set of small floating buttons on the right edge of the screen. It appears only on small screens (below the `lg` breakpoint, 1024px).
2. **The accessibility dialog** — a modal panel that holds all accessibility settings. The dialog is shared by the dock and by a button in the navbar on desktop.

Dock buttons and their dialogs:

| Button | `data-open` | Dialog `data-dialog` | Purpose |
|---|---|---|---|
| Page list | `pages` | `pages` | Browse notes in the current category |
| Table of contents | `toc` | `toc` | Jump to headings on the current page |
| Accessibility | `a11y` | `a11y` | Change display and reading settings |

On desktop (`lg` and up), the page list and table of contents are shown in the sidebars. The accessibility button appears in the navbar instead of the dock.

---

## 2. Where the code lives

| File | What it contains |
|---|---|
| `src/layouts/DocsLayout.astro` | Dock markup, the three dialogs, and the scripts that open and close them |
| `src/components/Navbar.svelte` | Desktop accessibility button and `openA11y()` handler |
| `src/components/ThemeInit.astro` | Inline script that applies saved settings before the page paints |
| `src/styles/global.css` | Dock styles (`.dock`, `.dock-btn`, `.dock-dialog`), accessibility styles, and focus and motion rules |
| `src/scripts/tts.ts` | Text-to-speech module used by the accessibility dialog |
| `public/js/blocks.js` | KaTeX and Mermaid rendering, re-run on every navigation |

---

## 3. How it works

### 3.1 Opening and closing dialogs

- Each dock button has `data-open="<name>"`.
- Each dialog has `data-dialog="<name>"`.
- The `setupDock()` function in `DocsLayout.astro` connects them. It:
  - calls `showModal()` when a dock button is clicked,
  - closes the dialog when a `data-close` button is clicked,
  - closes the dialog when the backdrop (the area outside the panel) is clicked,
  - closes the dialog when a link with `data-close-on-click` is clicked.
- Pressing Escape closes any open dialog. This is built into the native `<dialog>` element.

### 3.2 Page navigation (ClientRouter)

The site uses Astro's `ClientRouter`, which replaces the page body without a full reload. Scripts must handle this:

- Scripts that set up elements listen to `astro:page-load`.
- Each setup function uses a `dataset.ready` guard so listeners are not attached twice.
- `ThemeInit.astro` runs before paint on every full load. It applies saved settings to `<html>`.
- The `Navbar` is persisted (`transition:persist="navbar"`), so its state survives navigation. Its own `astro:page-load` listener resets the menu and re-reads the theme.

### 3.3 Accessibility settings

Settings are stored as one JSON object in `localStorage` under the key `orb-a11y`. Each setting is applied as a `data-*` attribute on `<html>`:

| Setting | Key | Attribute on `<html>` | Effect |
|---|---|---|---|
| Text size | `textSize` | `data-text-size="large"` | Larger text in `.prose` |
| Spacing | `spacing` | `data-spacing="wide"` | Wider letter and line spacing |
| Contrast | `contrast` | `data-contrast="high"` | High-contrast colors |
| Color filter | `colorFilter` | `data-color-filter="..."` | SVG color-matrix filter |
| Monochrome | `monochrome` | `data-monochrome="true"` | Grayscale |
| Dyslexia font | `dyslexic` | `data-dyslexic="true"` | OpenDyslexic font |
| Reduce motion | `reduceMotion` | `data-reduce-motion="true"` | Shorter animations and transitions |
| Reading focus | `readFocus` | `data-read-focus="true"` | Hides `<aside>` sidebars |

The default value removes the attribute. Two scripts use these settings:

- `ThemeInit.astro` applies them before paint, so there is no flash.
- The `setupA11y()` script in `DocsLayout.astro` reads and updates them while the dialog is open.

### 3.4 Text-to-speech

- `src/scripts/tts.ts` reads text from `<main>` using the Web Speech API.
- Code, math, diagrams, embeds, and navigation are skipped.
- The module is loaded once. Its state survives navigation, but `astro:before-swap` and `pagehide` call `stop()` so speech does not continue on another page.
- The language comes from `lang` on `#note-content`, which the `TranslateToggle` also uses.

**Why text-to-speech reads only the note content?**

The speech feature reads only the content inside <main>. It does not read the left sidebar, the right table of contents, the breadcrumb, or the dock and dialogs. This is intentional.

The sidebars and the table of contents are navigation, not content. They repeat information that is already on the page: the table of contents lists the same headings the speech feature reads in order, and the sidebar lists titles of other notes. Reading them would make every page longer and would mix the words of the note with unrelated links.

Screen reader users already have their own navigation tools. They move between headings, landmarks, and links with keyboard shortcuts. A speech feature that reads navigation again would duplicate those tools and make the page harder to follow. Keeping the speech feature focused on the note keeps it predictable.

Buttons, dialogs, and labels are also skipped. Reading “Tutup” or “Putar” after each sentence would add noise and would not help the listener understand the note.

The “Read titles only” option is the one exception. It reads only the headings inside the note, so a listener can hear the structure of the page without the full text.

### 3.5 Desktop button in the navbar

- The button has the class `hidden lg:flex`, so it shows only on desktop.
- It calls `openA11y()`, which runs `showModal()` on `[data-dialog="a11y"]`.
- The `DocsLayout` wraps the landing page too, so the button appears on `/` as well as on `/notes/`.

---

## 4. Adding a new dock button

1. Add a button inside `<div class="dock lg:hidden" data-dock>` with `data-open="<name>"`.
2. Add a `<dialog class="dock-dialog" data-dialog="<name>" aria-label="...">` in the same layout, using the `dock-dialog-head` and `dock-dialog-body` classes.
3. Add a `data-close` button in the dialog header.
4. No script changes are needed. `setupDock()` finds all `[data-dialog]` elements and connects them automatically.

Keep the number of dock buttons small. Each one takes space on a small screen.

---

## 5. Adding a new accessibility setting

1. Add the key and default value to `A11yState` and `DEFAULTS` in the `setupA11y` script.
2. Add a control in the `a11y` dialog:
   - Radio options use `role="radio"`, `data-a11y="<key>"`, and `data-value="<value>"`.
   - Checkboxes use `data-a11y="<key>"`.
3. Add the matching line in `apply()` to set or remove the `data-*` attribute.
4. Add the same line in the `set()` list in `ThemeInit.astro` so the setting is applied before paint.
5. Add the CSS rule in `global.css` that uses the attribute selector, for example `html[data-my-setting="true"] ...`.

Keep the attribute names in all three places identical: `A11yState`, `apply()`, and `ThemeInit.astro`.

---

## 6. Common problems and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Dock button does nothing | `setupDock` is missing or was overwritten | Check that the `setupDock` script exists in `DocsLayout.astro` |
| Dialog cannot be closed by ✕ or backdrop | Same as above, or `data-close` is missing | Confirm `data-close` on the button and that `setupDock` runs |
| Dock does not work after navigation | Setup function lacks `astro:page-load` listener | Add `document.addEventListener("astro:page-load", fn)` |
| Settings reset after navigation | `localStorage` write failed, or `setupA11y` did not run | Check the `orb-a11y` key in DevTools → Application → Local Storage |
| Flash of normal text on load | A setting is missing from `ThemeInit.astro` | Add the key to the `set()` list |
| Speech keeps playing after navigation | `astro:before-swap` listener removed | Restore the listener in `tts.ts` |
| Desktop button missing on a page | That page does not use `DocsLayout` | Wrap the page with `DocsLayout` |
| Dialog opens twice or errors | `showModal()` called on an open dialog | Guard with `if (!dialog.open)` |
| Color filter has no effect | Missing SVG filter definitions | Check the `<svg class="a11y-svg-defs">` block exists in `DocsLayout.astro` |

---

## 7. Checklist after any change

Run through this list after editing the dock, the dialogs, or the accessibility scripts.

**Mobile (below 1024px)**

- [ ] All three dock buttons appear on the right edge.
- [ ] Each button opens its dialog.
- [ ] The ✕ button closes each dialog.
- [ ] Clicking outside the panel closes each dialog.
- [ ] Escape closes each dialog.
- [ ] Choosing a TOC link closes the dialog and scrolls to the heading.
- [ ] After moving to another page with the dock, all buttons still work.

**Desktop (1024px and above)**

- [ ] The dock is hidden.
- [ ] The accessibility button appears in the navbar on note pages and on the landing page.
- [ ] The button opens the accessibility dialog.
- [ ] Settings persist after navigating between pages.

**Accessibility settings**

- [ ] Each control changes the page immediately.
- [ ] Reloading the page keeps the settings without a flash.
- [ ] Reset returns every control and the page to defaults.
- [ ] Keyboard focus shows a visible outline.

**Text-to-speech**

- [ ] Play, pause, resume, and stop change the button states.
- [ ] Speed and voice changes apply.
- [ ] "Read titles only" reads headings only.
- [ ] Navigating to another page stops speech.

---

## 8. Known limitations

- Color filters are simulations, not corrections. Test with real users before claiming they help.
- Reading focus only hides `<aside>` elements. Any sidebar without that tag stays visible.
- Voice lists differ between browsers. Some devices have only English voices.
- Reduce motion does not affect scroll-spy, which already uses instant scrolling.
- Speech rate support varies between browsers. The supported range is 0.8 to 1.2.
- Text-to-speech is experimental and may not work on every device.

---

## 9. Quick reference

- Dock visibility: `class="dock lg:hidden"` in `DocsLayout.astro`
- Dialog open logic: `setupDock()` in `DocsLayout.astro`
- Settings logic: `setupA11y()` in `DocsLayout.astro`
- Early settings: `ThemeInit.astro`
- Desktop button: `openA11y()` and the button in `Navbar.svelte`
- Speech: `src/scripts/tts.ts`
- Storage key: `orb-a11y` (settings) and `orb-theme` (dark mode)