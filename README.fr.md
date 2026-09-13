# Declutter Plus

🇬🇧 **[English version](README.md)**

Templates de cartes Lovelace réutilisables pour Home Assistant — successeur
moderne et graphique de [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Éditeur de la carte Declutter Plus](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

- **Bibliothèque partagée** : les templates vivent dans un dashboard masqué et
  sont disponibles sur **tous** les dashboards.
- **Éditeur graphique** : options en panneaux repliables à gauche, aperçu en
  direct de Home Assistant à droite — y compris le template en cours
  d'édition — avec un bouton **Ajouter une carte** sous l'aperçu.
- **Galerie de templates** avec miniatures en direct, formulaire des variables
  avec vrais sélecteurs (entité, icône, pièce…), éditeur YAML de template.
- **Copier-coller de cartes natives** : *Copier* une carte depuis son menu, puis
  choisir **« Declutter Plus : coller la carte copiée »** dans *Ajouter une
  carte* — elle devient un template. On peut aussi partir d'une carte du
  dashboard courant.
- **Compatible** decluttering-card : syntaxe `[[variable]]`, `default`,
  `card` / `element`, et `decluttering_templates` existants (import en un clic).
- **Prêt pour la vue sections** : taille de la carte interne transmise (ou
  `grid_options` dans le template).
- Variables typées : `'[[features]]'` reçoit une vraie liste/objet/nombre.
- Les défauts peuvent référencer d'autres variables (`name: "[[entity]]"`).
- Anglais et français. Sans dépendance, sans build.

## Installation

**HACS** : *HACS › ⋮ › Dépôts personnalisés* → `https://github.com/Flybrow/lovelace-declutter-plus`
(type *Dashboard*), installer, puis recharger le navigateur.

**Manuelle** : copier `declutter-plus.js` dans `/config/www/` et ajouter la
ressource `/local/declutter-plus.js` (type *Module JavaScript*).

## Démarrage

1. Modifier un dashboard › *Ajouter une carte* › **Declutter Plus**.
2. Panneau *Bibliothèque* › **Créer la bibliothèque** (administrateur, une fois).
3. Cliquer **Ajouter une carte** sous l'aperçu : **Nouveau template**, **Depuis
   la carte copiée** ou **Depuis une carte de ce dashboard**, puis
   **Enregistrer dans la bibliothèque**.
4. Choisir le template dans le panneau *Template* et remplir ses *Variables*.

## Options de la carte

| Option      | Type            | Défaut           | Description                                             |
| ----------- | --------------- | ---------------- | ------------------------------------------------------- |
| `template`  | texte           | —                | Nom du template                                         |
| `variables` | objet ou liste  | `{}`             | Valeurs des variables (liste compatible decluttering)   |
| `library`   | texte           | `declutter-plus` | Chemin URL du dashboard bibliothèque                    |
| `paste`     | config de carte | —                | Posé par l'entrée « coller », retiré à l'enregistrement |

```yaml
type: custom:declutter-plus-card
template: light_tile
variables:
  entity: light.cuisine
  color: amber
```

Aussi disponibles : `custom:declutter-plus-element` (picture-elements) et
`custom:declutter-plus-row` (lignes de carte entités).

## Format des templates

Stockés dans le dashboard bibliothèque sous `declutter_plus_templates` :

```yaml
declutter_plus_templates:
  light_tile:
    description: Tuile avec variateur
    default:
      color: yellow
      name: "[[entity]]"
    fields:                 # optionnel : sélecteurs de l'éditeur
      entity:
        label: Lumière
        required: true
        selector:
          entity:
            domain: light
    grid_options:           # optionnel : taille en vue sections
      columns: 6
    card:                   # ou `element:` / `row:`
      type: tile
      entity: "[[entity]]"
      color: "[[color]]"
      features:
        - type: light-brightness
```

- Une valeur égale à `"[[var]]"` est remplacée par la valeur brute (liste,
  objet, nombre, booléen) ; dans un texte, elle est insérée comme texte.
- Sans `fields`, le sélecteur est deviné (`entity`, `icon`, `area`, booléens,
  nombres, objets → YAML).
- Un template avec sélecteur d'entité est suggéré dans le sélecteur de cartes
  quand on choisit une entité compatible (Home Assistant 2026.6+).

## Migration depuis decluttering-card

Remplacer `custom:decluttering-card` par `custom:declutter-plus-card` : les
`decluttering_templates` du dashboard continuent de fonctionner (badge *local*).
**Importer … template(s) decluttering-card** les déplace dans la bibliothèque.

## Remarques

- Modifier la bibliothèque requiert un administrateur ; tous les utilisateurs
  peuvent la lire.
- Le dashboard bibliothèque est masqué du menu latéral et s'ouvre depuis le
  panneau *Bibliothèque*.
- Mettre `visibility` sur la carte Declutter Plus elle-même (géré nativement).
