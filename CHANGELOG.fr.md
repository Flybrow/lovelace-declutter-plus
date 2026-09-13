# Journal des modifications

🇬🇧 **[English version](CHANGELOG.md)**

## 1.5.0 — 13 septembre 2026

- Le dashboard de stockage partagé affiche désormais chaque template partagé :
  une section par template avec son nom, sa description et la carte rendue avec
  ses valeurs par défaut. Il est reconstruit à chaque modification des templates,
  et mis à jour quand un administrateur ouvre Declutter Plus (les dashboards
  existants vides se remplissent).

## 1.4.0 — 13 septembre 2026

### Nouveautés

- **Cartes côte à côte** : les templates à plusieurs cartes utilisent une grille
  de 12 colonnes, comme une section. Chaque carte prend sa largeur (taille par
  défaut, onglet *Mise en page* de son éditeur ou poignées de redimensionnement
  de la barre d'édition).
- Nouvelle carte `custom:declutter-plus-grid`, qui stocke les templates
  multi-cartes. Les templates existants en `vertical-stack` sont convertis dès
  qu'une carte est ajoutée, dupliquée ou supprimée.

### Corrections

- Modifier la deuxième carte d'un template ouvrait la première : le calque
  d'édition de la première carte recouvrait toutes les cartes.
- Sur le dashboard en mode édition, les cartes Declutter Plus affichaient le
  bouton « Ajouter une carte » et les barres d'édition par carte ; ils
  n'apparaissent plus que dans la popup d'édition de la carte.

## 1.3.0 — 13 septembre 2026

- **Plusieurs cartes par template** : **Ajouter une carte** reste désormais sous
  les cartes de l'aperçu et ajoute une carte au template affiché. Chaque carte a
  sa barre d'édition : modifier, dupliquer, copier, supprimer.
- Un template à plusieurs cartes est stocké en `vertical-stack` natif (toujours
  compatible decluttering-card) ; revenu à une seule carte, la pile est retirée.
- L'entité de chaque carte ajoutée devient une nouvelle variable (`entity_2`,
  `entity_3`…).
- Supprimer la dernière carte supprime le template.
- Confirmations plus claires : supprimer un template, ou en retirer une carte,
  indique qu'il s'agit d'un template Declutter Plus, où il est stocké et combien
  de cartes Declutter Plus l'utilisent sur l'ensemble des dashboards, car elles
  sont aussi concernées.

### Corrections

- Un template supprimé pouvait rester dans la galerie quand une autre copie du
  même nom existait (copie partagée et template decluttering-card d'origine) :
  la suppression retire désormais le nom de tous les stockages.
- Déplacer un template échoue maintenant avec une erreur, au lieu de laisser un
  doublon, si l'ancienne copie ne peut pas être retirée du dashboard.

## 1.2.0 — 13 septembre 2026

### Éditeur repensé, façon Bubble Card

- Le panneau de gauche ne contient plus que les réglages de la carte : galerie
  de templates, nom, stockage, description, valeurs et réglages des variables.
- Toutes les actions passent dans l'aperçu à droite :
  - **Ajouter une carte** ouvre la **popup du sélecteur de cartes** de Home
    Assistant, puis l'éditeur de la carte choisie ; l'enregistrement crée le
    template.
  - La carte affiche la **barre d'édition** de Home Assistant : le crayon ouvre
    l'éditeur de la carte (visuel ou code) et l'enregistrement met à jour le
    template ; le menu permet aussi de dupliquer, copier ou supprimer le
    template.
- Les templates importés (par exemple des templates Bubble Card issus de
  decluttering-card) se retravaillent désormais dans leur propre éditeur.
- Renommer un template ou changer son stockage s'applique immédiatement.

### Retiré

- Le panneau « Créer ou modifier un template » et l'éditeur de template séparé.

### Corrections

- Le presse-papiers de cartes de Home Assistant est aussi lu dans `sessionStorage`.

## 1.1.0 — 13 septembre 2026

### Nouveautés

- **Ajouter une carte** sous l'aperçu ouvre désormais le **sélecteur de cartes**
  de Home Assistant, puis **l'éditeur visuel de la carte choisie**, avec
  l'aperçu en direct à droite. On choisit quels réglages deviennent des
  variables (l'entité est proposée automatiquement).
- **Stockage par template** : *Ce dashboard* ou *Partagé* avec tous les
  dashboards. Le local est prioritaire à nom égal ; changer le stockage déplace
  le template.

### Changements

- « Bibliothèque » renommée **Stockage des templates**, avec une explication dans
  l'éditeur. Le dashboard caché de stockage s'intitule *Declutter Plus – Templates*.
- Le stockage partagé devient facultatif : on peut créer des templates sans lui.

### Corrections

- L'éditeur ne voyait pas le dashboard courant (templates decluttering-card
  locaux et liste « copier une carte de ce dashboard » vides).

## 1.0.0 — 13 septembre 2026

Première version.

- Templates de cartes, d'éléments d'image et de lignes d'entités.
- Bibliothèque partagée dans un dashboard dédié, rechargée en direct.
- Éditeur graphique : panneaux d'options repliables, galerie de templates avec
  miniatures en direct, formulaire de variables avec sélecteurs, éditeur YAML
  dont le brouillon s'affiche dans l'aperçu de Home Assistant, bouton
  **Ajouter une carte** sous l'aperçu.
- Coller une carte native copiée depuis *Ajouter une carte*, ou partir d'une
  carte du dashboard courant (`entity` devient `[[entity]]`).
- Compatibilité decluttering-card et import en un clic.
- Variables typées, défauts référençant d'autres variables, taille en vue sections.
- Suggestions de templates dans le sélecteur de cartes (Home Assistant 2026.6+).
- Anglais et français.
