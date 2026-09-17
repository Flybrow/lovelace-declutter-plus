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
- Popup **Gérer les templates** : chaque template avec son aperçu, renommer,
  description, variables, supprimer, et le nombre de cartes qui l'utilisent.
- **Templates stockés dans les données système de Home Assistant** :
  utilisables sur tous les dashboards, plus de dashboard caché, inclus dans les
  sauvegardes Home Assistant, avec en plus une sauvegarde automatique.
- **Variables facultatives** avec de vrais sélecteurs (entité, icône, pièce…),
  pour réutiliser un template avec des valeurs différentes.
- **Pop-ups Bubble Card** masquées jusqu'à leur ouverture. Dans l'éditeur
  Declutter Plus, elles apparaissent sous forme d'encart réduit, et en entier
  seulement dans leur propre éditeur. Sur le dashboard en mode édition, les
  cartes masquées hors édition (pop-ups fermées, conditions de visibilité non
  remplies) sont écartées et résumées par une petite mention comme « +3 autre(s)
  carte(s) masquée(s) ».
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
2. **Créer un template** : lui donner un nom (lettres, chiffres, `_`, `-`) et une
   description facultative.
3. Dès que le nom est valide, le remplir depuis l'aperçu à droite : **Ajouter une
   carte** (sélecteur de cartes) ou **Importer une section** (toutes les cartes et
   conteneurs d'une section). Cliquer sur **Enregistrer** pour terminer : le
   template est créé, même vide, et la carte enregistrée. Modifier ensuite une
   carte avec son bouton d'édition dans l'aperçu.
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
| Accueil | nouvelle carte | explications, **Créer un template**, **Utiliser un template existant**, **Gérer les templates** ; propose de copier les templates decluttering-card ou 1.x trouvés |
| Nouveau template | depuis l'accueil | nom, description, comment remplir le template ; les cartes s'ajoutent depuis l'aperçu et **Enregistrer** crée le template |
| Choisir un template | depuis l'accueil ou **Changer de template** | galerie avec miniatures et recherche |
| Cette carte | carte existante | le template utilisé, un bouton **Gérer mes templates**, et **uniquement les valeurs des variables de cette carte** (bloc *Variables (facultatif)* replié) ; **Changer de template**, **Gérer les templates** |
| Gérer les templates | popup, depuis l'accueil ou Cette carte | tous les templates avec leur aperçu, leur nombre de cartes et d'utilisations : renommer, description, variables, supprimer ; **Déplacer vers le stockage système** pour les templates encore stockés dans un dashboard |

Dès qu'un template est choisi, ou qu'un nom valide est saisi sur l'écran de
création, l'aperçu à droite contient **Ajouter une carte**, **Importer une
section** et la barre d'édition de chaque carte. Sur les écrans d'accueil, de
choix et de gestion, rien n'y est proposé et le bouton **Enregistrer** de Home
Assistant est masqué : ces écrans font office de menu. Les modifications des cartes d'un template
sont enregistrées immédiatement ; dans *Gérer les templates*, le nom, la
description et les variables s'enregistrent avec le bouton **Enregistrer**, qui
apparaît quand une valeur a changé ;
le bouton *Enregistrer* de Home Assistant enregistre cette carte (choix du
template et valeurs des variables).

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
- Chaque carte Declutter Plus règle ses propres valeurs dans *Cette carte*, dans
  le bloc *Variables (facultatif)*, replié par défaut.

## Stockage des templates

Les templates sont stockés dans les **données système de Home Assistant**
(`.storage/frontend.system_data`) : utilisables sur tous les dashboards, lus une
fois au chargement de la page puis mis à jour en direct, et inclus dans les
sauvegardes Home Assistant. Il n'y a pas de stockage à choisir.

- Les templates sont aussi **sauvegardés automatiquement** dans les données
  utilisateur de l'administrateur ; s'ils étaient effacés, l'éditeur propose
  **Restaurer les templates**.
- **Les templates encore stockés dans un dashboard** (versions précédentes)
  continuent de fonctionner. Dans *Gérer les templates*, **Déplacer vers le
  stockage système** les range au bon endroit ; les modifier les déplace aussi.
- **Les templates decluttering-card** (`decluttering_templates`) ne sont jamais
  modifiés : les déplacer ou les modifier les copie dans le stockage système, et
  la copie est ensuite utilisée.

### Mise à jour depuis la 1.x

Les versions 1.x stockaient les templates dans un dashboard caché. Rien n'est
converti automatiquement : ces templates continuent de fonctionner depuis ce
dashboard (et restent modifiables) aussi longtemps que vous le souhaitez.

Quand vous êtes prêt, l'écran d'accueil et *Gérer les templates* proposent
**Déplacer vers le nouveau stockage**. Les templates sont copiés dans les données
système de Home Assistant, la copie est relue et vérifiée, et seulement ensuite
l'ancien dashboard est supprimé. Si la vérification échoue, l'ancien dashboard
est conservé et un message vous l'indique.

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
