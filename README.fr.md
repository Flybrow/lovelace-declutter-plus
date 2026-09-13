# Declutter Plus

🇬🇧 **[English version](README.md)**

Templates de cartes Lovelace réutilisables pour Home Assistant — successeur
moderne et graphique de [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Éditeur de la carte Declutter Plus](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

- **Cartes posées où vous voulez** : une carte Declutter Plus ne contient que le
  nom du template et les valeurs de ses variables.
- **Deux stockages au choix par template** : *ce dashboard* ou *partagé* avec
  tous les dashboards (voir [Stockage des templates](#stockage-des-templates)).
- **Éditeur graphique** : options en panneaux repliables à gauche, aperçu en
  direct de Home Assistant à droite. **Ajouter une carte** ouvre le sélecteur de
  cartes de Home Assistant, puis l'éditeur visuel de la carte ; on choisit
  quels réglages deviennent des variables.
- **Galerie de templates** avec miniatures en direct, formulaire des variables
  avec vrais sélecteurs (entité, icône, pièce…).
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
2. Cliquer **Ajouter une carte** sous l'aperçu et choisir une carte (ou coller
   une carte copiée, ou copier une carte du dashboard). La configurer avec son
   éditeur habituel.
3. L'entité devient variable automatiquement ; **Rendre un réglage variable…**
   pour les autres (nom, icône, couleur…).
4. Choisir où l'enregistrer (*Ce dashboard* ou *Partagé*) puis **Enregistrer le
   template**.
5. Le réutiliser : ajouter une autre carte Declutter Plus, choisir le template
   dans la galerie et remplir ses variables.

## Stockage des templates

Un template est un modèle de carte réutilisable. Les cartes, elles, se posent
où vous voulez.

| Stockage         | Où il est enregistré                                                             | Utilisable sur         |
| ---------------- | -------------------------------------------------------------------------------- | ---------------------- |
| **Ce dashboard** | la configuration du dashboard courant                                            | ce dashboard seulement |
| **Partagé**      | un dashboard caché *Declutter Plus – Templates*, qui sert uniquement de stockage | tous les dashboards    |

- Le stockage partagé s'active une fois depuis le panneau *Stockage des
  templates* (administrateur). Inutile d'ouvrir ce dashboard.
- Si les deux contiennent un template du même nom, le local est prioritaire.
- Changer le stockage d'un template existant le déplace.
- Un dashboard en mode YAML ne peut pas être modifié depuis l'interface :
  utiliser le stockage partagé.

## Options de la carte

| Option      | Type            | Défaut           | Description                                             |
| ----------- | --------------- | ---------------- | ------------------------------------------------------- |
| `template`  | texte           | —                | Nom du template                                         |
| `variables` | objet ou liste  | `{}`             | Valeurs des variables (liste compatible decluttering)   |
| `library`   | texte           | `declutter-plus` | Chemin URL du dashboard de stockage partagé             |
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

Stockés sous `declutter_plus_templates`, dans le dashboard courant ou dans le dashboard de stockage :

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
Les modifier puis enregistrer les convertit ; **Déplacer … template(s)
decluttering-card vers le stockage partagé** les rend disponibles partout.

## Remarques

- Modifier les templates requiert un administrateur ; tous les utilisateurs
  peuvent les lire.
- Mettre `visibility` sur la carte Declutter Plus elle-même (géré nativement).
