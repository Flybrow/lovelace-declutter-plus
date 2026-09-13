# Declutter Plus

🇫🇷 **[Version française](README.fr.md)**

Reusable Lovelace card templates for Home Assistant — a modern, visual successor
to [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Declutter Plus card editor](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

- **Shared library**: templates live in one hidden dashboard and are available
  on **every** dashboard.
- **Visual editor**: options in collapsible panels on the left, Home Assistant's
  live preview on the right — including the template you are editing — with an
  **Add a card** button under the preview.
- **Template gallery** with live thumbnails, variable form with real pickers
  (entity, icon, area…), YAML template editor.
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
2. *Library* panel › **Create library** (administrators, once).
3. Click **Add a card** under the preview: **New template**, **From copied card**
   or **From a card of this dashboard**, then **Save to library**.
4. Pick the template in the *Template* panel and fill in its *Variables*.

## Card options

| Option      | Type           | Default          | Description                                              |
| ----------- | -------------- | ---------------- | -------------------------------------------------------- |
| `template`  | string         | —                | Template name                                            |
| `variables` | object or list | `{}`             | Variable values (list form is decluttering-compatible)   |
| `library`   | string         | `declutter-plus` | URL path of the library dashboard                        |
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

Templates are stored in the library dashboard under `declutter_plus_templates`:

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
Use **Import … decluttering-card template(s)** to move them to the shared library.

## Notes

- Editing the library requires an administrator; every user can read it.
- The library dashboard is hidden from the sidebar and can be opened from the
  *Library* panel.
- Put `visibility` on the Declutter Plus card itself (handled natively).
