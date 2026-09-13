# Declutter Plus

🇫🇷 **[Version française](README.fr.md)**

Reusable Lovelace card templates for Home Assistant — a modern, visual successor
to [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Declutter Plus card editor](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

- **Place cards anywhere**: a Declutter Plus card only holds a template name and
  its variable values.
- **Two storage options per template**: *this dashboard* or *shared* with every
  dashboard (see [Template storage](#template-storage)).
- **Visual editor**: options in collapsible panels on the left, Home Assistant's
  live preview on the right. **Add a card** opens Home Assistant's own card
  picker, then the card's own visual editor; pick which settings become
  variables.
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
2. Click **Add a card** under the preview and pick a card (or paste a copied
   card, or copy one from this dashboard). Configure it with its usual editor.
3. The entity is made variable automatically; use **Make a setting variable…**
   for others (name, icon, color…).
4. Choose where to save it (*This dashboard* or *Shared*) and **Save template**.
5. Reuse it: add another Declutter Plus card, pick the template in the gallery
   and fill in its variables.

## Template storage

A template is a reusable card model. Cards themselves go wherever you want.

| Storage            | Where it is saved                                                     | Usable on           |
| ------------------ | --------------------------------------------------------------------- | ------------------- |
| **This dashboard** | the current dashboard's configuration                                 | this dashboard only |
| **Shared**         | a hidden dashboard *Declutter Plus – Templates*, used only as storage | every dashboard     |

- Shared storage is enabled once from the *Template storage* panel
  (administrators). You never need to open that dashboard.
- If both contain a template with the same name, the local one wins.
- Changing the storage of an existing template moves it.
- Dashboards in YAML mode cannot be modified from the UI: use shared storage.

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

Also available: `custom:declutter-plus-element` (picture-elements) and
`custom:declutter-plus-row` (entities card rows).

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
