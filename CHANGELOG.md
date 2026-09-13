# Changelog

🇫🇷 **[Version française](CHANGELOG.fr.md)**

## 1.6.0 — 13 September 2026

- **Import a section**: a new button under **Add card** in the preview lists the
  sections of the dashboard and copies all the cards of the chosen one into the
  template (or creates a template named after the section), keeping card widths.
  Each card's entity becomes a variable. The original section is not changed.

## 1.5.6 — 13 September 2026

### Fixes

- Adding a Bubble Card pop-up to a template hid the whole Declutter Plus card
  once saved: a closed pop-up hides its nearest card container, which was the
  Declutter Plus card itself. Each card of a template now gets its own Home
  Assistant card container (like in a section), so the pop-up only hides its
  own cell. Per-card `visibility` conditions now work too.
- Shared templates are always reloaded from storage (no stale template until the
  cache is cleared), and the editor reloads them each time it opens.
- The loaded version is shown at the bottom of the editor, to spot an old file
  kept by the browser cache.

## 1.5.5 — 13 September 2026

### Fixes

- Templates stored as `vertical-stack` whose cards have a width
  (`grid_options.columns`) are now always displayed on the grid, in the editor
  and on dashboards, without having to edit them first. Stacks without any card
  width (for example from decluttering-card) keep their stacked layout.

## 1.5.4 — 13 September 2026

### Fixes

- Cards of templates created in 1.3.0 (stored as `vertical-stack`) stayed
  stacked even after setting their width. Editing or resizing one of their
  cards now converts the template to the grid, so widths apply.

## 1.5.3 — 13 September 2026

### Fixes

- Regression in 1.5.1: saving, closing or cancelling a card's editor also closed
  the Declutter Plus editor behind it. It is now reopened only once Home
  Assistant has fully closed the card editor.

## 1.5.2 — 13 September 2026

### Fixes

- Regression in 1.5.1: in a sections dashboard, the card editor preview lost the
  per-card edit toolbars and the "Add card" button (the preview is rendered
  inside a section, which was mistaken for the dashboard).

## 1.5.1 — 13 September 2026

### Fixes

- Editing a card from the preview could do nothing (reported on mobile). The
  card editor is now opened directly with Home Assistant's current editor
  parameters, without the hidden proxy section it depended on.
- Adding a card falls back to opening the card picker directly when the proxy
  section is unavailable.
- When the editor cannot be opened, a Home Assistant notification now gives the
  reason (the left panel may be off screen on mobile).
- Detection of the editor preview is refreshed on every render.

## 1.5.0 — 13 September 2026

- The shared storage dashboard now shows every shared template: one section per
  template with its name, description and the card rendered with its default
  values. It is rebuilt whenever templates change, and brought up to date when
  an administrator opens Declutter Plus (existing empty dashboards get filled).

## 1.4.0 — 13 September 2026

### New

- **Cards side by side**: multi-card templates use a 12-column grid, like a
  section. Each card takes its own width (its default size, or the *Layout* tab
  of its editor, or the resize handles of the edit toolbar).
- New `custom:declutter-plus-grid` card, used to store multi-card templates.
  Existing `vertical-stack` templates are converted when a card is added,
  duplicated, removed, edited or resized (1.5.4).

### Fixes

- Editing the second card of a template opened the first one: the edit overlay
  of the first card covered all cards.
- On the dashboard in edit mode, Declutter Plus cards showed the "Add card"
  button and per-card edit toolbars; they now only appear in the card editor
  pop-up.

## 1.3.0 — 13 September 2026

- **Several cards per template**: **Add card** now stays under the cards in the
  preview and adds a card to the displayed template. Each card has its own edit
  toolbar: edit, duplicate, copy, delete.
- Multi-card templates are stored as a native `vertical-stack` (still
  decluttering-card compatible); back to a single card, the stack is removed.
- The entity of each added card becomes a new variable (`entity_2`, `entity_3`…).
- Deleting the last card deletes the template.
- Clearer confirmations: deleting a template, or removing a card from it, says
  it is a Declutter Plus template, where it is stored, and how many Declutter
  Plus cards use it across all dashboards, since they are affected too.

### Fixes

- A deleted template could stay in the gallery when another copy with the same
  name existed (shared copy and original decluttering-card template): deleting
  now removes the name from every storage.
- Moving a template now fails with an error, instead of leaving a duplicate,
  when its previous copy cannot be removed from the dashboard.

## 1.2.0 — 13 September 2026

### Editor redesigned, Bubble Card style

- The left panel now only holds the card's settings: template gallery, name,
  storage, description, variable values and variable settings.
- All actions moved to the preview on the right:
  - **Add card** opens Home Assistant's **card picker pop-up**, then the chosen
    card's editor; saving creates the template.
  - The card shows Home Assistant's **edit toolbar**: edit opens the card's
    own editor (visual or code) and saving updates the template; the menu also
    duplicates, copies or deletes the template.
- Imported templates (for example Bubble Card templates from decluttering-card)
  can now be reworked in their own editor.
- Renaming a template or changing its storage is applied immediately.

### Removed

- The "Create or edit a template" panel and the separate template editor.

### Fixes

- Home Assistant's card clipboard is also read from `sessionStorage`.

## 1.1.0 — 13 September 2026

### New

- **Add a card** under the preview now opens Home Assistant's **card picker**,
  then the chosen card's **own visual editor**, with the live preview on the
  right. Choose which settings become variables (the entity is suggested
  automatically).
- **Storage per template**: *This dashboard* or *Shared* with every dashboard.
  Local templates win over shared ones with the same name; changing the storage
  moves the template.

### Changes

- "Library" renamed **Template storage**, with an explanation in the editor. The
  hidden storage dashboard is now titled *Declutter Plus – Templates*.
- Shared storage is optional: templates can be created without it.

### Fixes

- The editor did not see the current dashboard (local decluttering-card
  templates and the "copy a card of this dashboard" list were empty).

## 1.0.0 — 13 September 2026

First release.

- Reusable card, picture-element and entities-row templates.
- Shared library stored in a dedicated dashboard, reloaded live on change.
- Visual editor: collapsible option panels, template gallery with live
  thumbnails, variable form with pickers, YAML template editor whose draft is
  shown in Home Assistant's preview, **Add a card** button under the preview.
- Paste a copied native card from *Add card*, or start from any card of the
  current dashboard (`entity` becomes `[[entity]]`).
- decluttering-card compatibility and one-click import.
- Typed variables, defaults referencing other variables, sections view sizing.
- Template suggestions in the card picker (Home Assistant 2026.6+).
- English and French.
