# Declutter Plus

🇫🇷 **[Version française](README.fr.md)**

Reusable Lovelace card templates for Home Assistant — a modern, visual successor
to [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Declutter Plus card editor](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

## Features

- **Build a template once, place it anywhere**: a Declutter Plus card only holds
  a template name (and optional variable values). Edit the template from any
  card that uses it: every card follows.
- **Guided editor**: a new card opens a home screen to create a template or use
  an existing one; an existing card only shows its own settings.
- **Everything is done with the mouse, no YAML to write**: you create and edit
  your templates with the same windows and menus as any Home Assistant card,
  right in the preview on the right. No code is needed.
  - **Add card**: pick a card from Home Assistant's usual list, then set it up
    with its menus. Any card works, including custom cards such as Bubble Card.
  - **Import a section** copies every card and container of a dashboard section.
  - Each card of the template has Home Assistant's edit toolbar: edit,
    duplicate, copy, delete.
- **Several cards per template**, side by side on a 12-column grid like a
  section. Set each card's width in the *Layout* tab of its editor.
- **Manage templates** pop-up: each template with its preview, rename,
  description, variables, delete, and the number of cards using it.
- **Templates stored in Home Assistant's system data**: usable on every
  dashboard, no hidden dashboard, included in Home Assistant backups, plus an
  automatic backup.
- **Optional variables** with real pickers (entity, icon, area…), to reuse one
  template with different values.
- **Bubble Card pop-ups** stay hidden until opened. In the Declutter Plus editor
  they appear as a small placeholder, and fully only in their own editor. On the
  dashboard in edit mode, cards hidden outside edit mode (closed pop-ups, unmet
  visibility conditions) are left out and summed up by a small note such as
  "+3 hidden card(s)".
- **Compatible** with decluttering-card: `[[variable]]` syntax, `default`,
  `card` / `element`, and existing `decluttering_templates`.
- English and French. No dependency, no build.

## Requirements

- Home Assistant **2026.6** or later.
- Creating and editing templates requires an **administrator**; every user can
  display them.

## Installation

**HACS**: *HACS › ⋮ › Custom repositories* → `https://github.com/Flybrow/lovelace-declutter-plus`
(type *Dashboard*), install, then reload the browser.

**Manual**: copy `declutter-plus.js` to `/config/www/` and add the resource
`/local/declutter-plus.js` (type *JavaScript module*).

The loaded version and build number are shown at the bottom of the Declutter
Plus editor (and in the browser console). When the editor opens, it checks for a
newer file and offers **Reload**; the **Reload without cache** link next to the
version does the same at any time.

## Quick start

1. Edit a dashboard › *Add card* › **Declutter Plus**. The home screen explains
   the plugin and offers two choices.
2. **Create a template**: give it a name (letters, digits, `_`, `-`) and an
   optional description.
3. As soon as the name is valid, fill it from the preview on the right: **Add
   card** (card picker) or **Import a section** (every card and container of a
   section). Click **Save** to finish: it creates the template, even empty, and
   saves the card. Edit a card later with its edit button in the preview.
4. Reuse it: add another Declutter Plus card and choose **Use an existing
   template**.

You can also copy a card (card menu › *Copy*), then choose
**Declutter Plus: paste copied card** in *Add card*: the creation screen opens
and the copied card becomes the first card of the new template.

**The original cards are never changed**: a template is a copy. Delete the
original cards yourself if you only want to keep the Declutter Plus version.

## Editor

| Screen | When | What |
| --- | --- | --- |
| Home | new card | explanations, **Create a template**, **Use an existing template**, **Manage templates**; offers to copy decluttering-card templates or 1.x templates when found |
| New template | from Home | name, description, how to fill the template; cards are added from the preview and **Save** creates the template |
| Choose a template | from Home or **Change template** | gallery with thumbnails and search |
| This card | existing card | the template used, a **Manage my templates** button, and **this card's variable values only** (collapsed *Variables (optional)* block); **Change template**, **Manage templates** |
| Manage templates | pop-up, from Home or This card | every template with its preview, number of cards and uses: rename, description, variables, delete; **Move to the system storage** for templates still stored in a dashboard |

Once a template is chosen, or a valid name is entered on the New template
screen, the preview on the right holds **Add card**, **Import a section** and
the edit toolbar of each card. On the home, choose and manage screens, nothing
is offered there and Home Assistant's **Save** button is hidden: they act like a
menu. Changes to a template (its cards, name,
description, variables) are saved immediately; the *Save* button of Home Assistant
saves this card (template choice and variable values).

### Deleting

| Action | Effect |
| --- | --- |
| Delete the Declutter Plus card from the dashboard (card menu) | Only this card is removed (Home Assistant offers *Undo*). The template is kept. |
| In the preview, delete a card of the template | Removes it from the template, **for every card using it** (confirmation). |
| In the preview, delete the last card, or **Delete** in *Manage templates* | Deletes the **template** (confirmation with the number of cards using it). |

Renaming a template asks for confirmation too: other cards using the old name
show *Template not found* until the template is chosen again.

## Variables

Variables are **optional**. Without them, a template always shows the same
cards. They are useful to reuse one template with different values, for example
one card per room with only the entity and the name changing.

- In *Manage templates › Edit*, **Make a setting variable…** turns a setting of
  the template's cards into a variable; its current value becomes the default.
  ✕ removes a variable.
- Each Declutter Plus card sets its own values in *This card*, in the
  *Variables (optional)* block, collapsed by default.

## Template storage

Templates are stored in **Home Assistant's system data**
(`.storage/frontend.system_data`): usable on every dashboard, read once when
the page loads then updated live, and included in Home Assistant backups. There
is no storage to choose.

- Templates are also **backed up automatically** in the administrator's user
  data; if they are ever erased, the editor offers **Restore templates**.
- **Templates still stored in a dashboard** (earlier versions) keep working. In
  *Manage templates*, **Move to the system storage** moves them; editing one
  moves it too.
- **decluttering-card templates** (`decluttering_templates`) are never changed:
  moving or editing one copies it to the system storage, and the copy is used
  from then on.

### Upgrading from 1.x

Versions 1.x stored templates in a hidden dashboard. Nothing is converted
automatically: those templates keep working from that dashboard (they can still
be edited) as long as you want.

When you are ready, the home screen and *Manage templates* offer **Move to the
new storage**. The templates are copied to Home Assistant's system data, the
copy is read back and checked, and only then is the old dashboard deleted. If the
check fails, the old dashboard is kept and a message tells you.

## Card options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `template` | string | — | Template name |
| `variables` | object or list | `{}` | Variable values (list form is decluttering-compatible) |
| `library` | string | `declutter-plus` | Name of a separate shared template library |
| `paste` | card config | — | Set by the paste entry, removed once the template is created |

```yaml
type: custom:declutter-plus-card
template: light_tile
variables:
  entity: light.kitchen
```

Also available: `custom:declutter-plus-element` (picture-elements),
`custom:declutter-plus-row` (entities card rows) and `custom:declutter-plus-grid`
(the 12-column grid used by templates: `cards:` list, width from each card's
`grid_options.columns`).

## Template format

Shared templates live in the system data key `declutter_plus`; templates stored
in a dashboard live under `declutter_plus_templates` in its configuration. The
editor writes this format for you:

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
      type: custom:declutter-plus-grid
      cards:
        - type: tile
          entity: "[[entity]]"
          name: "[[name]]"
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

**Automatic offer**: each time an administrator opens the Declutter Plus editor,
the plugin looks for `decluttering_templates` in every dashboard. If some are not
in Declutter Plus yet, it offers to **Copy into Declutter Plus** (shared
templates).

- Nothing is changed on the decluttering-card side: its templates and cards keep
  working. Delete them yourself if you wish.
- A template whose name already exists in Declutter Plus with a different
  content is copied with the `_decluttering` suffix.
- Templates already copied are not offered again, even if you edit the copy,
  unless the original decluttering-card template changes.
- **Later** asks again next time; tick **Don't ask again** to stop the offer
  (saved in your Home Assistant user data, on every device).
- To use a copy, add a Declutter Plus card and choose the template.

Templates left in a dashboard's `decluttering_templates` are also readable
directly by Declutter Plus cards of that dashboard (shown as *This dashboard
(decluttering-card)*).
