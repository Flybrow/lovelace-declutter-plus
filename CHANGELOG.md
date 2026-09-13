# Changelog

🇫🇷 **[Version française](CHANGELOG.fr.md)**

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
