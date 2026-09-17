# Declutter Plus

🇬🇧 **[English version](README.md)**

Templates de cartes Lovelace réutilisables pour Home Assistant — successeur
moderne et graphique de [decluttering-card](https://github.com/custom-cards/decluttering-card).

![Éditeur de la carte Declutter Plus](https://raw.githubusercontent.com/Flybrow/lovelace-declutter-plus/main/assets/editor.png)

## Fonctionnalités

- **Un template créé une fois, posé partout** : une carte Declutter Plus ne
  contient que le nom d'un template (et d'éventuelles valeurs de variables).
  Modifiez le template depuis n'importe quelle carte qui l'utilise : toutes
  suivent.
- **Éditeur guidé** : une nouvelle carte ouvre un écran d'accueil pour créer un
  template ou en utiliser un existant ; une carte existante n'affiche que ses
  propres réglages.
- **Tout se fait à la souris, sans écrire de YAML** : vous créez et modifiez vos
  templates avec les mêmes fenêtres et menus que pour n'importe quelle carte de
  Home Assistant, directement dans l'aperçu à droite. Aucune ligne de code
  n'est nécessaire.
  - **Ajouter une carte** : choisissez une carte dans la liste habituelle de
    Home Assistant, puis réglez-la avec ses menus. Toutes les cartes
    fonctionnent, y compris les cartes personnalisées comme Bubble Card.
  - **Importer une section** copie toutes les cartes et conteneurs d'une
    section.
  - Chaque carte du template a la barre d'édition de Home Assistant : modifier,
    dupliquer, copier, supprimer.
- **Plusieurs cartes par template**, côte à côte sur une grille de 12 colonnes
  comme une section. La largeur se règle dans l'onglet *Mise en page* de
  l'éditeur de chaque carte.
- Écran **Gérer les templates** : renommer, changer le stockage, variables,
  supprimer, avec le nombre de cartes qui utilisent chaque template.
- **Templates partagés stockés dans les données système de Home Assistant** :
  plus de dashboard caché, inclus dans les sauvegardes Home Assistant, avec en
  plus une sauvegarde automatique.
- **Variables facultatives** avec de vrais sélecteurs (entité, icône, pièce…),
  pour réutiliser un template avec des valeurs différentes.
- **Pop-ups Bubble Card** masquées jusqu'à leur ouverture, et complètes seulement
  dans leur propre éditeur. Sur le dashboard en mode édition, les cartes masquées
  hors édition (pop-ups fermées, conditions de visibilité non remplies) sont
  écartées et résumées par une petite mention comme « +3 autre(s) carte(s)
  masquée(s) ».
- **Compatible** decluttering-card : syntaxe `[[variable]]`, `default`,
  `card` / `element`, et `decluttering_templates` existants.
- Anglais et français. Sans dépendance, sans build.

## Prérequis

- Home Assistant **2026.6** ou plus récent.
- Créer et modifier les templates demande un **administrateur** ; tous les
  utilisateurs peuvent les afficher.

## Installation

**HACS** : *HACS › ⋮ › Dépôts personnalisés* → `https://github.com/Flybrow/lovelace-declutter-plus`
(type *Dashboard*), installer, puis recharger le navigateur.

**Manuelle** : copier `declutter-plus.js` dans `/config/www/` et ajouter la
ressource `/local/declutter-plus.js` (type *Module JavaScript*).

La version et le numéro de build chargés s'affichent en bas de l'éditeur
Declutter Plus (et dans la console du navigateur). À l'ouverture, l'éditeur
vérifie s'il existe un fichier plus récent et propose **Recharger** ; le lien
**Recharger sans cache** à côté de la version fait de même à tout moment.

## Démarrage

1. Modifier un dashboard › *Ajouter une carte* › **Declutter Plus**. L'écran
   d'accueil présente le plugin et propose deux choix.
2. **Créer un template** : lui donner un nom (lettres, chiffres, `_`, `-`), une
   description facultative et un stockage (*Partagé* par défaut), puis
   **Créer le template**.
3. Le remplir depuis l'aperçu à droite : **Ajouter une carte** (sélecteur de
   cartes) ou **Importer une section** (toutes les cartes et conteneurs d'une
   section). Modifier une carte avec son bouton d'édition ; l'enregistrement met
   à jour le template.
4. Le réutiliser : ajouter une autre carte Declutter Plus et choisir
   **Utiliser un template existant**.

On peut aussi copier une carte (menu de la carte › *Copier*), puis choisir
**Declutter Plus : coller la carte copiée** dans *Ajouter une carte* : l'écran de
création s'ouvre et la carte copiée devient la première carte du nouveau
template.

**Les cartes d'origine ne sont jamais modifiées** : un template est une copie.
Supprimez vous-même les cartes d'origine si vous ne voulez garder que la version
Declutter Plus.

## Éditeur

| Écran | Quand | Contenu |
| --- | --- | --- |
| Accueil | nouvelle carte | explications, **Créer un template**, **Utiliser un template existant**, **Gérer les templates** |
| Nouveau template | depuis l'accueil | nom, description, stockage, comment remplir le template |
| Choisir un template | depuis l'accueil ou **Changer de template** | galerie avec miniatures et recherche |
| Cette carte | carte existante | le template utilisé et **uniquement les valeurs des variables de cette carte** ; **Changer de template**, **Gérer les templates** |
| Gérer les templates | depuis l'accueil ou Cette carte | tous les templates avec leur nombre de cartes et d'utilisations : renommer, stockage, description, variables, supprimer |

L'aperçu à droite contient toujours **Ajouter une carte**, **Importer une
section** et la barre d'édition de chaque carte. Les modifications d'un template
(ses cartes, son nom, son stockage, ses variables) sont enregistrées
immédiatement ; le bouton *Enregistrer* de Home Assistant enregistre cette carte
(choix du template et valeurs des variables).

### Suppression

| Action | Effet |
| --- | --- |
| Supprimer la carte Declutter Plus du dashboard (menu de la carte) | Seule cette carte disparaît (Home Assistant propose *Annuler*). Le template est conservé. |
| Dans l'aperçu, supprimer une carte du template | La retire du template, **pour toutes les cartes qui l'utilisent** (confirmation). |
| Dans l'aperçu, supprimer la dernière carte, ou **Supprimer** dans *Gérer les templates* | Supprime le **template** (confirmation avec le nombre de cartes qui l'utilisent). |

Renommer un template demande aussi confirmation : les autres cartes qui
utilisent l'ancien nom affichent *Template introuvable* jusqu'à ce que le
template soit à nouveau choisi.

## Variables

Les variables sont **facultatives**. Sans elles, un template affiche toujours
les mêmes cartes. Elles servent à réutiliser un template avec des valeurs
différentes, par exemple une carte par pièce où seuls l'entité et le nom
changent.

- Dans *Gérer les templates › Modifier*, **Rendre un réglage variable…**
  transforme un réglage des cartes du template en variable ; sa valeur actuelle
  devient la valeur par défaut. ✕ retire une variable.
- Chaque carte Declutter Plus règle ses propres valeurs dans *Cette carte*.

## Stockage des templates

| Stockage | Où il est enregistré | Utilisable sur |
| --- | --- | --- |
| **Partagé** (par défaut) | les données système de Home Assistant (`.storage/frontend.system_data`) | tous les dashboards |
| **Ce dashboard** | la configuration du dashboard courant | ce dashboard seulement |

- **Partagé est le choix le plus simple.** Aucun dashboard n'est nécessaire : les
  templates sont lus une fois au chargement de la page puis mis à jour en direct,
  et ils sont inclus dans les sauvegardes Home Assistant. Choisir *Ce dashboard*
  seulement pour que les templates suivent la configuration de ce dashboard.
- Changer le stockage d'un template le déplace. Si les deux stockages
  contiennent un template du même nom, celui du dashboard courant est
  prioritaire.
- Les templates partagés sont aussi **sauvegardés automatiquement** dans les
  données utilisateur de l'administrateur ; s'ils étaient effacés, l'éditeur
  propose **Restaurer les templates**.
- Supprimer un dashboard qui stocke des templates (*Ce dashboard*) demande
  confirmation, dans un onglet où Declutter Plus est chargé.
- Un dashboard en mode YAML ne peut pas être modifié depuis l'interface :
  utiliser le stockage partagé.

### Mise à jour depuis la 1.x

Les versions 1.x stockaient les templates partagés dans un dashboard caché. Rien
n'est converti automatiquement : ces templates continuent de fonctionner depuis
ce dashboard (et restent modifiables) aussi longtemps que vous le souhaitez.

Quand vous êtes prêt, l'écran d'accueil et *Gérer les templates* proposent
**Copier vers le nouveau stockage**. Les templates sont copiés dans les données
système de Home Assistant et l'ancien dashboard reste intact et utilisable.
Declutter Plus 2.0 utilise ensuite le nouveau stockage ; ne supprimez l'ancien
dashboard dans *Paramètres › Tableaux de bord* que lorsque vous n'en avez plus
besoin.

## Options de la carte

| Option | Type | Défaut | Description |
| --- | --- | --- | --- |
| `template` | texte | — | Nom du template |
| `variables` | objet ou liste | `{}` | Valeurs des variables (liste compatible decluttering) |
| `library` | texte | `declutter-plus` | Nom d'une bibliothèque de templates partagés séparée |
| `paste` | config de carte | — | Posé par l'entrée « coller », retiré à la création du template |

```yaml
type: custom:declutter-plus-card
template: light_tile
variables:
  entity: light.cuisine
```

Aussi disponibles : `custom:declutter-plus-element` (picture-elements),
`custom:declutter-plus-row` (lignes de carte entités) et
`custom:declutter-plus-grid` (la grille de 12 colonnes des templates : liste
`cards:`, largeur donnée par `grid_options.columns` de chaque carte).

## Format des templates

Les templates partagés sont dans la clé `declutter_plus` des données système ;
les templates stockés dans un dashboard sont sous `declutter_plus_templates`
dans sa configuration. L'éditeur écrit ce format pour vous :

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
      type: custom:declutter-plus-grid
      cards:
        - type: tile
          entity: "[[entity]]"
          name: "[[name]]"
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

**Proposition automatique** : à chaque ouverture de l'éditeur Declutter Plus par
un administrateur, le plugin recherche des `decluttering_templates` dans tous les
dashboards. S'il en trouve qui ne sont pas encore dans Declutter Plus, il propose
de les **Copier dans Declutter Plus** (templates partagés).

- Rien n'est modifié côté decluttering-card : ses templates et ses cartes
  continuent de fonctionner. Supprimez-les vous-même si vous le souhaitez.
- Un template dont le nom existe déjà dans Declutter Plus avec un contenu
  différent est copié avec le suffixe `_decluttering`.
- Les templates déjà copiés ne sont plus proposés, même si vous modifiez la
  copie, sauf si l'original decluttering-card change.
- **Plus tard** redemandera à la prochaine ouverture ; cochez **Ne plus
  demander** pour arrêter la proposition (enregistré dans vos données
  utilisateur Home Assistant, sur tous vos appareils).
- Pour utiliser une copie, ajoutez une carte Declutter Plus et choisissez le
  template.

Les templates restés dans les `decluttering_templates` d'un dashboard sont aussi
lisibles directement par les cartes Declutter Plus de ce dashboard (affichés
comme *Ce dashboard (decluttering-card)*).
