# Declutter Plus

🇫🇷 **[Version française](README.fr.md)**

Reusable Lovelace card templates for Home Assistant — a modern, visual successor
to [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Declutter Plus card editor](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

## Features

- **Build a template once, place it anywhere**: a Declutter Plus card only holds
  a template name (and optional variable values). Change the template, every
  card using it follows.
- **Edited like Bubble Card pop-ups**: the left panel only holds the card's
  settings; every action happens in the preview on the right.
  - **Add card** opens Home Assistant's card picker, then the card's own editor
    (visual or code). Any card works, including custom cards such as Bubble Card.
  - **Import a section** copies all the cards of a dashboard section at once.
  - Each card of the template has Home Assistant's edit toolbar: edit,
    duplicate, copy, delete.
- **Several cards per template**, side by side on a 12-column grid like a
  section. Set each card's width in the *Layout* tab of its editor.
- **Shared or per-dashboard storage**, with automatic backup of shared templates.
- **Optional variables** with real pickers (entity, icon, area…), to reuse one
  template with different values.
- **Bubble Card pop-ups** behave like in a section: hidden until opened,
  minimized in edit mode, fully shown only in their own editor.
- **Compatible** with decluttering-card: `[[variable]]` syntax, `default`,
  `card` / `element`, and existing `decluttering_templates`.
- English and French. No dependency, no build.

## Requirements

- Home Assistant **2026.6** or later.
- Editing templates requires an **administrator**; every user can display them.

## Installation

**HACS**: *HACS › ⋮ › Custom repositories* → `https://github.com/Flybrow/lovelace-declutter-plus`
(type *Dashboard*), install, then reload the browser.

**Manual**: copy `declutter-plus.js` to `/config/www/` and add the resource
`/local/declutter-plus.js` (type *JavaScript module*).

The loaded version is shown at the bottom of the Declutter Plus editor. If it is
not the latest one after an update, clear the browser (or app) cache.

## Quick start

1. Edit a dashboard › *Add card* › **Declutter Plus**.
2. In the preview on the right, click **Add card** and pick a card, then
   configure it in its usual editor and save. Or click **Import a section** to
   copy a whole section.
3. The template is created and selected. In the *Template* panel on the left,
   set its name, storage and description.
4. Click **Add card** again to add more cards. To change a card, use its edit
   button in the preview; saving updates the template.
5. Reuse it: add another Declutter Plus card and pick the template in the
   gallery.

You can also copy a card (card menu › *Copy*), then choose
**Declutter Plus: paste copied card** in *Add card* and click
**Save as template** in the preview.

**The original cards are never changed**: a template is a copy. Delete the
original cards yourself if you only want to keep the Declutter Plus version.

## Editor

| Where | What |
| --- | --- |
| *Template* panel (left) | template gallery and search; name, storage and description of the selected template |
| *Variables* panel (left) | values of this card's variables; **Make a setting variable…** and ✕ to manage the template's variables |
| Preview (right) | **Add card**, **Import a section**, and the edit toolbar of each card |

Renaming, moving, editing a card or changing variables of a template is saved
immediately. The *Save* button of Home Assistant saves this card (template
choice and variable values).

### Deleting

| Action | Effect |
| --- | --- |
| Delete the Declutter Plus card from the dashboard (card menu) | Only this card is removed (Home Assistant offers *Undo*). The template is kept. |
| In the preview, delete a card of the template | Removes it from the template, **for every card using it** (confirmation). |
| In the preview, delete the last card of the template | Deletes the **template** (confirmation with the number of cards using it). |

## Variables

Variables are **optional**. Without them, a template always shows the same
cards. They are useful to reuse one template with different values, for example
one card per room with only the entity and the name changing.

- Create one with *Variables › Make a setting variable…*: the current value
  becomes the default value.
- Set its value on each Declutter Plus card in the *Variables* panel.
- Remove one with ✕: cards get the default value back.

## Template storage

| Storage | Where it is saved | Usable on |
| --- | --- | --- |
| **This dashboard** | the current dashboard's configuration | this dashboard only |
| **Shared** | a hidden dashboard *⚠ Declutter Plus – Templates (do not delete)*, used only as storage | every dashboard |

- **Shared is the simplest choice** and has no noticeable performance cost (one
  extra read when the page loads). Choose *This dashboard* only if you want the
  templates to travel with that dashboard's configuration.
- Enable shared storage from the *Template* panel of a selected template
  (administrators). Until then, new templates are saved in the current
  dashboard.
- Changing the storage of a template moves it. If both storages hold a template
  with the same name, the one of the current dashboard wins.
- The storage dashboard shows every shared template with its default values. It
  is rebuilt automatically: do not edit it by hand.
- Dashboards in YAML mode cannot be modified from the UI: use shared storage.

### Protecting shared templates

Home Assistant cannot lock a dashboard, so Declutter Plus adds three safeguards:

- the warning in the storage dashboard's title, visible in *Settings ›
  Dashboards*;
- deleting a dashboard that stores templates asks for confirmation (only in a
  browser tab where Declutter Plus is loaded);
- shared templates are **backed up automatically** in the administrator's Home
  Assistant user data. If the storage dashboard is deleted, the Declutter Plus
  editor offers **Restore templates**.

Home Assistant backups also include the storage dashboard.

## Card options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `template` | string | — | Template name |
| `variables` | object or list | `{}` | Variable values (list form is decluttering-compatible) |
| `library` | string | `declutter-plus` | URL path of the shared storage dashboard |
| `paste` | card config | — | Set by the paste entry, removed once saved as a template |

```yaml
type: custom:declutter-plus-card
template: light_tile
variables:
  entity: light.kitchen
```

Also available: `custom:declutter-plus-element` (picture-elements),
`custom:declutter-plus-row` (entities card rows) and `custom:declutter-plus-grid`
(the 12-column grid used by multi-card templates: `cards:` list, width from each
card's `grid_options.columns`).

## Template format

Templates are stored under `declutter_plus_templates`, in the current dashboard
or in the storage dashboard. The editor writes this format for you:

```yaml
declutter_plus_templates:
  light_tile:
    description: Tile with brightness slider
    default:                # optional: variable default values
      entity: light.kitchen
      name: "[[entity]]"    # a default can use another variable
    fields:                 # optional: editor pickers
      entity:
        label: Light
        selector:
          entity:
            domain: light
    grid_options:           # optional: size of the Declutter Plus card
      columns: 6
    card:                   # or `element:` / `row:`
      type: tile
      entity: "[[entity]]"
      name: "[[name]]"
```

A multi-card template uses the grid:

```yaml
    card:
      type: custom:declutter-plus-grid
      cards:
        - type: tile
          entity: light.kitchen
          grid_options:
            columns: 6
        - type: tile
          entity: light.living_room
          grid_options:
            columns: 6
```

- A value that is exactly `"[[var]]"` is replaced by the raw value (list,
  object, number, boolean); inside text it is inserted as text.
- Variables without `fields` get a guessed picker (`entity`, `icon`, `area`,
  booleans, numbers, objects → YAML).
- Older multi-card templates stored as `vertical-stack` are shown on the grid
  when a card has a width, and converted when a card is added, edited or
  removed.
- A template with an entity picker is suggested in Home Assistant's card picker
  when you select a matching entity.

## Migrating from decluttering-card

Replace `custom:decluttering-card` with `custom:declutter-plus-card`: the
dashboard's existing `decluttering_templates` keep working and appear in the
gallery as *This dashboard (decluttering-card)*. To convert one, select it and
choose *Shared* as storage in the *Template* panel.
