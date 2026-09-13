# Declutter Plus

🇫🇷 **[Version française](README.fr.md)**

Reusable Lovelace card templates for Home Assistant — a modern, visual successor
to [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Declutter Plus card editor](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

- **Place cards anywhere**: a Declutter Plus card only holds a template name and
  its variable values.
- **Two storage options per template**: *this dashboard* or *shared* with every
  dashboard (see [Template storage](#template-storage)).
- **Edited like Bubble Card pop-ups**: the left panel only holds the card's
  settings (template, storage, variables). Everything else happens in the
  preview on the right: **Add card** opens Home Assistant's card picker pop-up,
  and the card's edit toolbar opens its own editor (visual or code) — any card,
  including custom cards such as Bubble Card.
- **Import a whole section**: **Import a section** (under **Add card**) copies
  every card of a section of the dashboard into the template at once, with
  their widths.
- **The original cards are never changed**: a template is a copy. Delete the
  original cards yourself if you only want to keep the Declutter Plus version.
- **Several cards per template**: **Add card** stays under the cards; each card
  has its own edit toolbar (edit, duplicate, copy, delete). Cards are laid out
  side by side on a 12-column grid, like a section: set each card's width in the
  *Layout* tab of its editor.
- **Template gallery** with live thumbnails, variable form with real pickers
  (entity, icon, area…).
- **Copy & paste native cards**: *Copy* any card from its menu, then pick
  **“Declutter Plus: paste copied card”** in *Add card* — it becomes a template.
  You can also start from any card of the current dashboard.
- **Compatible** with decluttering-card: `[[variable]]` syntax, `default`,
  `card` / `element`, and existing `decluttering_templates` (one-click import).
- **Sections view ready**: grid size passed through from the inner card
  (or set with `grid_options` in the template).
- Typed variables: `'[[features]]'` receives a real list/object/number.
- Defaults can reference other variables (`name: "[[entity]]"`).
- English and French. No dependency, no build.

## Installation

**HACS**: *HACS › ⋮ › Custom repositories* → `https://github.com/Flybrow/lovelace-declutter-plus`
(type *Dashboard*), install, then reload the browser.

**Manual**: copy `declutter-plus.js` to `/config/www/` and add the resource
`/local/declutter-plus.js` (type *JavaScript module*).

## Quick start

1. Edit a dashboard › *Add card* › **Declutter Plus**.
2. In the preview on the right, click **Add card** and pick a card in Home
   Assistant's card picker, then configure it in its usual editor and save.
3. The template is created and selected. Back in the Declutter Plus editor, set
   its name and storage on the left.
   Variables are optional: only needed to reuse the template with different
   values (for example one card per room). Add them in *Variables* with
   **Make a setting variable…**.
4. Click **Add card** again to add more cards to the template. To change a card
   later, use its edit button in the preview: its editor opens (visual or code)
   and saving updates the template.
5. Reuse it: add another Declutter Plus card and pick the template in the
   gallery.

## Template storage

A template is a reusable card model. Cards themselves go wherever you want.

| Storage            | Where it is saved                                                     | Usable on           |
| ------------------ | --------------------------------------------------------------------- | ------------------- |
| **This dashboard** | the current dashboard's configuration                                 | this dashboard only |
| **Shared**         | a hidden dashboard *Declutter Plus – Templates*, used only as storage | every dashboard     |

- Shared storage can be enabled from the *Template* panel (administrators).
- The storage dashboard shows every shared template (title, description and the
  card with its default values). It is rebuilt automatically: do not edit it by
  hand.
- If both contain a template with the same name, the local one wins.
- Changing the storage of an existing template moves it; renaming renames it.
- Dashboards in YAML mode cannot be modified from the UI: use shared storage.

### Protecting shared templates

Home Assistant cannot lock a dashboard, so Declutter Plus adds three safeguards:

- the storage dashboard is titled **⚠ Declutter Plus – Templates (do not
  delete)** in *Settings › Dashboards*;
- deleting a dashboard that stores templates asks for confirmation, with the
  number of templates (only in a browser tab where Declutter Plus is loaded);
- shared templates are **backed up automatically** on the server (administrator
  user data). If the storage dashboard is deleted, the Declutter Plus editor
  offers **Restore templates**.

## Card options

| Option      | Type           | Default          | Description                                              |
| ----------- | -------------- | ---------------- | -------------------------------------------------------- |
| `template`  | string         | —                | Template name                                            |
| `variables` | object or list | `{}`             | Variable values (list form is decluttering-compatible)   |
| `library`   | string         | `declutter-plus` | URL path of the shared storage dashboard                 |
| `paste`     | card config    | —                | Set by the paste entry, removed once saved as a template |

```yaml
type: custom:declutter-plus-card
template: light_tile
variables:
  entity: light.kitchen
  color: amber
```

Also available: `custom:declutter-plus-element` (picture-elements),
`custom:declutter-plus-row` (entities card rows) and `custom:declutter-plus-grid`
(12-column grid used by multi-card templates, usable on its own:
`cards:` list, width from each card's `grid_options.columns`).

## Template format

Templates are stored under `declutter_plus_templates`, in the current dashboard or in the storage dashboard:

```yaml
declutter_plus_templates:
  light_tile:
    description: Tile with brightness slider
    default:
      color: yellow
      name: "[[entity]]"
    fields:                 # optional: editor pickers
      entity:
        label: Light
        required: true
        selector:
          entity:
            domain: light
    grid_options:           # optional: sections view size
      columns: 6
    card:                   # or `element:` / `row:`
      type: tile
      entity: "[[entity]]"
      color: "[[color]]"
      features:
        - type: light-brightness
```

- A value that is exactly `"[[var]]"` is replaced by the raw value (list, object,
  number, boolean); inside text it is inserted as text.
- Variables without `fields` get a guessed picker (`entity`, `icon`, `area`,
  booleans, numbers, objects → YAML).
- A template with an entity picker is suggested in the card picker when you
  select a matching entity (Home Assistant 2026.6+).

## Migrating from decluttering-card

Replace `custom:decluttering-card` with `custom:declutter-plus-card`: the
dashboard's existing `decluttering_templates` keep working (marked *local*).
Edit and save one to convert it, or use **Move … decluttering-card template(s) to
shared storage**.

## Notes

- Editing templates requires an administrator; every user can read them.
- Put `visibility` on the Declutter Plus card itself (handled natively).
