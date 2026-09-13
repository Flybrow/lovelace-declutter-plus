# Declutter Plus

🇬🇧 **[English version](README.md)**

Templates de cartes Lovelace réutilisables pour Home Assistant — successeur
moderne et graphique de [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Éditeur de la carte Declutter Plus](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

## Fonctionnalités

- **Un template créé une fois, posé partout** : une carte Declutter Plus ne
  contient que le nom d'un template (et d'éventuelles valeurs de variables).
  Modifiez le template, toutes les cartes qui l'utilisent suivent.
- **Édition façon pop-up Bubble Card** : le panneau de gauche ne contient que les
  réglages de la carte ; toutes les actions se font dans l'aperçu à droite.
  - **Ajouter une carte** ouvre le sélecteur de cartes de Home Assistant, puis
    l'éditeur de la carte (visuel ou code). Toutes les cartes fonctionnent, y
    compris les cartes personnalisées comme Bubble Card.
  - **Importer une section** copie d'un coup toutes les cartes d'une section.
  - Chaque carte du template a la barre d'édition de Home Assistant : modifier,
    dupliquer, copier, supprimer.
- **Plusieurs cartes par template**, côte à côte sur une grille de 12 colonnes
  comme une section. La largeur de chaque carte se règle dans l'onglet
  *Mise en page* de son éditeur.
- **Stockage partagé ou par dashboard**, avec sauvegarde automatique des
  templates partagés.
- **Variables facultatives** avec de vrais sélecteurs (entité, icône, pièce…),
  pour réutiliser un template avec des valeurs différentes.
- **Pop-ups Bubble Card** comme dans une section : masquées jusqu'à leur
  ouverture, réduites en mode édition, complètes seulement dans leur propre
  éditeur.
- **Compatible** decluttering-card : syntaxe `[[variable]]`, `default`,
  `card` / `element`, et `decluttering_templates` existants.
- Anglais et français. Sans dépendance, sans build.

## Prérequis

- Home Assistant **2026.6** ou plus récent.
- Modifier les templates demande un **administrateur** ; tous les utilisateurs
  peuvent les afficher.

## Installation

**HACS** : *HACS › ⋮ › Dépôts personnalisés* → `https://github.com/Flybrow/lovelace-declutter-plus`
(type *Dashboard*), installer, puis recharger le navigateur.

**Manuelle** : copier `declutter-plus.js` dans `/config/www/` et ajouter la
ressource `/local/declutter-plus.js` (type *Module JavaScript*).

La version chargée s'affiche en bas de l'éditeur Declutter Plus. Si ce n'est pas
la dernière après une mise à jour, videz le cache du navigateur (ou de l'app).

## Démarrage

1. Modifier un dashboard › *Ajouter une carte* › **Declutter Plus**.
2. Dans l'aperçu à droite, cliquer **Ajouter une carte** et choisir une carte,
   la configurer dans son éditeur habituel puis enregistrer. Ou cliquer
   **Importer une section** pour copier une section entière.
3. Le template est créé et sélectionné. Dans le panneau *Template* à gauche,
   régler son nom, son stockage et sa description.
4. Cliquer à nouveau **Ajouter une carte** pour ajouter des cartes. Pour
   modifier une carte, utiliser son bouton d'édition dans l'aperçu ;
   l'enregistrement met à jour le template.
5. Le réutiliser : ajouter une autre carte Declutter Plus et choisir le template
   dans la galerie.

On peut aussi copier une carte (menu de la carte › *Copier*), puis choisir
**Declutter Plus : coller la carte copiée** dans *Ajouter une carte* et cliquer
**Enregistrer comme template** dans l'aperçu.

**Les cartes d'origine ne sont jamais modifiées** : un template est une copie.
Supprimez vous-même les cartes d'origine si vous ne voulez garder que la version
Declutter Plus.

## Éditeur

| Où | Quoi |
| --- | --- |
| Panneau *Template* (gauche) | galerie et recherche des templates ; nom, stockage et description du template choisi |
| Panneau *Variables* (gauche) | valeurs des variables de cette carte ; **Rendre un réglage variable…** et ✕ pour gérer les variables du template |
| Aperçu (droite) | **Ajouter une carte**, **Importer une section**, et la barre d'édition de chaque carte |

Renommer, déplacer, modifier une carte ou changer les variables d'un template
est enregistré immédiatement. Le bouton *Enregistrer* de Home Assistant
enregistre cette carte (choix du template et valeurs des variables).

### Suppression

| Action | Effet |
| --- | --- |
| Supprimer la carte Declutter Plus du dashboard (menu de la carte) | Seule cette carte disparaît (Home Assistant propose *Annuler*). Le template est conservé. |
| Dans l'aperçu, supprimer une carte du template | La retire du template, **pour toutes les cartes qui l'utilisent** (confirmation). |
| Dans l'aperçu, supprimer la dernière carte du template | Supprime le **template** (confirmation avec le nombre de cartes qui l'utilisent). |

## Variables

Les variables sont **facultatives**. Sans elles, un template affiche toujours
les mêmes cartes. Elles servent à réutiliser un template avec des valeurs
différentes, par exemple une carte par pièce où seuls l'entité et le nom
changent.

- En créer une avec *Variables › Rendre un réglage variable…* : la valeur
  actuelle devient la valeur par défaut.
- Régler sa valeur sur chaque carte Declutter Plus dans le panneau *Variables*.
- En retirer une avec ✕ : les cartes reprennent la valeur par défaut.

## Stockage des templates

| Stockage | Où il est enregistré | Utilisable sur |
| --- | --- | --- |
| **Ce dashboard** | la configuration du dashboard courant | ce dashboard seulement |
| **Partagé** | un dashboard caché *⚠ Declutter Plus – Templates (ne pas supprimer)*, qui sert uniquement de stockage | tous les dashboards |

- **Partagé est le choix le plus simple**, sans coût de performance notable (une
  lecture de plus au chargement de la page). Choisir *Ce dashboard* seulement
  pour que les templates suivent la configuration de ce dashboard.
- Le stockage partagé s'active depuis le panneau *Template* d'un template choisi
  (administrateur). D'ici là, les nouveaux templates sont enregistrés dans le
  dashboard courant.
- Changer le stockage d'un template le déplace. Si les deux stockages
  contiennent un template du même nom, celui du dashboard courant est
  prioritaire.
- Le dashboard de stockage affiche chaque template partagé avec ses valeurs par
  défaut. Il est reconstruit automatiquement : ne pas le modifier à la main.
- Un dashboard en mode YAML ne peut pas être modifié depuis l'interface :
  utiliser le stockage partagé.

### Protection des templates partagés

Home Assistant ne permet pas de verrouiller un dashboard ; Declutter Plus ajoute
trois garde-fous :

- l'avertissement dans le titre du dashboard de stockage, visible dans
  *Paramètres › Tableaux de bord* ;
- supprimer un dashboard qui stocke des templates demande confirmation
  (uniquement dans un onglet où Declutter Plus est chargé) ;
- les templates partagés sont **sauvegardés automatiquement** dans les données
  utilisateur Home Assistant de l'administrateur. Si le dashboard de stockage est
  supprimé, l'éditeur Declutter Plus propose **Restaurer les templates**.

Les sauvegardes Home Assistant incluent aussi le dashboard de stockage.

## Options de la carte

| Option | Type | Défaut | Description |
| --- | --- | --- | --- |
| `template` | texte | — | Nom du template |
| `variables` | objet ou liste | `{}` | Valeurs des variables (liste compatible decluttering) |
| `library` | texte | `declutter-plus` | Chemin URL du dashboard de stockage partagé |
| `paste` | config de carte | — | Posé par l'entrée « coller », retiré à l'enregistrement |

```yaml
type: custom:declutter-plus-card
template: light_tile
variables:
  entity: light.cuisine
```

Aussi disponibles : `custom:declutter-plus-element` (picture-elements),
`custom:declutter-plus-row` (lignes de carte entités) et
`custom:declutter-plus-grid` (la grille de 12 colonnes des templates
multi-cartes : liste `cards:`, largeur donnée par `grid_options.columns` de
chaque carte).

## Format des templates

Les templates sont stockés sous `declutter_plus_templates`, dans le dashboard
courant ou dans le dashboard de stockage. L'éditeur écrit ce format pour vous :

```yaml
declutter_plus_templates:
  light_tile:
    description: Tuile avec variateur
    default:                # optionnel : valeurs par défaut des variables
      entity: light.cuisine
      name: "[[entity]]"    # un défaut peut utiliser une autre variable
    fields:                 # optionnel : sélecteurs de l'éditeur
      entity:
        label: Lumière
        selector:
          entity:
            domain: light
    grid_options:           # optionnel : taille de la carte Declutter Plus
      columns: 6
    card:                   # ou `element:` / `row:`
      type: tile
      entity: "[[entity]]"
      name: "[[name]]"
```

Un template à plusieurs cartes utilise la grille :

```yaml
    card:
      type: custom:declutter-plus-grid
      cards:
        - type: tile
          entity: light.cuisine
          grid_options:
            columns: 6
        - type: tile
          entity: light.salon
          grid_options:
            columns: 6
```

- Une valeur égale à `"[[var]]"` est remplacée par la valeur brute (liste,
  objet, nombre, booléen) ; dans un texte, elle est insérée comme texte.
- Sans `fields`, le sélecteur est deviné (`entity`, `icon`, `area`, booléens,
  nombres, objets → YAML).
- Les anciens templates multi-cartes stockés en `vertical-stack` s'affichent en
  grille dès qu'une carte a une largeur, et sont convertis quand une carte est
  ajoutée, modifiée ou supprimée.
- Un template avec sélecteur d'entité est suggéré dans le sélecteur de cartes de
  Home Assistant quand on choisit une entité compatible.

## Migration depuis decluttering-card

Remplacer `custom:decluttering-card` par `custom:declutter-plus-card` : les
`decluttering_templates` du dashboard continuent de fonctionner et apparaissent
dans la galerie comme *Ce dashboard (decluttering-card)*. Pour en convertir un,
le sélectionner et choisir le stockage *Partagé* dans le panneau *Template*.
