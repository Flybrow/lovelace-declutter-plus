# Changelog

🇫🇷 **[Version française](CHANGELOG.fr.md)**

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
