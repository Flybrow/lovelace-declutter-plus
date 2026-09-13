# Declutter Plus

🇬🇧 **[English version](README.md)**

Templates de cartes Lovelace réutilisables pour Home Assistant — successeur
moderne et graphique de [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Éditeur de la carte Declutter Plus](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

- **Cartes posées où vous voulez** : une carte Declutter Plus ne contient que le
  nom du template et les valeurs de ses variables.
- **Deux stockages au choix par template** : *ce dashboard* ou *partagé* avec
  tous les dashboards (voir [Stockage des templates](#stockage-des-templates)).
- **Édition façon pop-up Bubble Card** : le panneau de gauche ne contient que
  les réglages de la carte (template, stockage, variables). Tout le reste se
  fait dans l'aperçu à droite : **Ajouter une carte** ouvre la popup du
  sélecteur de cartes de Home Assistant, et la barre d'édition de la carte ouvre
  son propre éditeur (visuel ou code) — n'importe quelle carte, y compris les
  cartes personnalisées comme Bubble Card.
- **Import d'une section entière** : **Importer une section** (sous **Ajouter
  une carte**) copie d'un coup toutes les cartes d'une section du dashboard dans
  le template, avec leurs largeurs.
- **Les cartes d'origine ne sont jamais modifiées** : un template est une copie.
  Supprimez vous-même les cartes d'origine si vous ne voulez garder que la
  version Declutter Plus.
- **Plusieurs cartes par template** : **Ajouter une carte** reste sous les
  cartes ; chaque carte a sa barre d'édition (modifier, dupliquer, copier,
  supprimer). Les cartes se placent côte à côte sur une grille de 12 colonnes,
  comme dans une section : régler la largeur de chaque carte dans l'onglet
  *Mise en page* de son éditeur.
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
2. Dans l'aperçu à droite, cliquer **Ajouter une carte** et choisir une carte
   dans le sélecteur de Home Assistant, la configurer dans son éditeur habituel
   puis enregistrer.
3. Le template est créé et sélectionné. De retour dans l'éditeur Declutter Plus,
   régler à gauche son nom et son stockage.
   Les variables sont facultatives : utiles seulement pour réutiliser le template
   avec des valeurs différentes (par exemple une carte par pièce). Les ajouter
   dans *Variables* avec **Rendre un réglage variable…**.
4. Cliquer à nouveau **Ajouter une carte** pour ajouter d'autres cartes au
   template. Pour modifier une carte ensuite, utiliser son bouton d'édition dans
   l'aperçu : son éditeur s'ouvre (visuel ou code) et l'enregistrement met à
   jour le template.
5. Le réutiliser : ajouter une autre carte Declutter Plus et choisir le template
   dans la galerie.

## Stockage des templates

Un template est un modèle de carte réutilisable. Les cartes, elles, se posent
où vous voulez.

| Stockage         | Où il est enregistré                                                             | Utilisable sur         |
| ---------------- | -------------------------------------------------------------------------------- | ---------------------- |
| **Ce dashboard** | la configuration du dashboard courant                                            | ce dashboard seulement |
| **Partagé**      | un dashboard caché *Declutter Plus – Templates*, qui sert uniquement de stockage | tous les dashboards    |

- Le stockage partagé s'active depuis le panneau *Template* (administrateur).
- Le dashboard de stockage affiche chaque template partagé (titre, description
  et carte avec ses valeurs par défaut). Il est reconstruit automatiquement : ne
  pas le modifier à la main.
- Si les deux contiennent un template du même nom, le local est prioritaire.
- Changer le stockage d'un template existant le déplace ; changer son nom le renomme.
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

Aussi disponibles : `custom:declutter-plus-element` (picture-elements),
`custom:declutter-plus-row` (lignes de carte entités) et
`custom:declutter-plus-grid` (grille de 12 colonnes des templates multi-cartes,
utilisable seule : liste `cards:`, largeur donnée par `grid_options.columns` de
chaque carte).

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
