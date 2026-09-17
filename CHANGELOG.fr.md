# Journal des modifications

🇬🇧 **[English version](CHANGELOG.md)**

## 2.0.0 — 17 septembre 2026

### Stockage partagé sans dashboard caché

- Les templates partagés sont désormais stockés dans les **données système de
  Home Assistant** (lisibles par tous les utilisateurs, écrites par les
  administrateurs, mises à jour en direct, incluses dans les sauvegardes Home
  Assistant) au lieu d'un dashboard caché : plus de dashboard à protéger, plus de
  vues à reconstruire, une seule lecture légère par chargement de page.
- **Copie facultative depuis la 1.x, jamais automatique** : les templates de
  l'ancien dashboard caché continuent d'y fonctionner (lus et modifiés) aussi
  longtemps que vous le souhaitez. Les écrans d'accueil et *Gérer les templates*
  proposent **Copier vers le nouveau stockage** ; la copie laisse l'ancien
  dashboard intact et utilisable.
- L'option `library` désigne désormais une bibliothèque partagée séparée.

### Éditeur guidé

- **Écran d'accueil** pour une nouvelle carte : ce que fait le plugin,
  **Créer un template**, **Utiliser un template existant**, **Gérer les
  templates**. L'aperçu ne propose ni *Ajouter une carte* ni *Importer une
  section* tant qu'aucun template n'est choisi ou créé.
- **Écran de création** : nom, description, stockage, et comment remplir le
  template. Dès que le nom est valide, des cartes s'ajoutent depuis l'aperçu
  (*Ajouter une carte*, *Importer une section*) ; la première carte crée le
  template. Pas de bouton de création séparé : le bouton **Enregistrer** de Home
  Assistant crée le template (même vide) et enregistre la carte. Coller une carte
  copiée ouvre cet écran avec la carte comme première carte.
- Le bouton **Enregistrer** de Home Assistant est masqué tant que la carte n'a pas
  de template (accueil, choix, gestion, nom pas encore valide) : ces écrans font
  office de menu.
- **Cette carte** : une carte existante n'affiche que le template qu'elle
  utilise et ses propres valeurs de variables, avec un bouton **Gérer mes
  templates** à côté du nom du template, et les liens **Changer de template** /
  **Gérer les templates**.
- **Gérer les templates** : tous les templates avec leur nombre de cartes et
  d'utilisations ; renommer (avec avertissement pour les autres cartes),
  stockage, description, variables, supprimer (avec confirmation).
- Les variables sont repliées par défaut et marquées *(facultatif)*, sur la carte
  et dans *Gérer les templates*.

### decluttering-card

- À chaque ouverture de l'éditeur par un administrateur, les
  `decluttering_templates` de tous les dashboards qui ne sont pas encore dans
  Declutter Plus sont proposés à la copie dans les templates partagés. Les
  originaux ne sont jamais modifiés.
- **Plus tard** redemande à la prochaine ouverture ; **Ne plus demander** arrête
  la proposition (enregistré dans les données utilisateur Home Assistant).
- Un nom déjà pris par un template différent reçoit le suffixe `_decluttering`.
- Les templates copiés sont mémorisés : ils ne sont plus proposés, même si la
  copie est modifiée ensuite, sauf si l'original decluttering-card change.

### Dashboard en mode édition

- Les cartes masquées hors mode édition (pop-ups Bubble Card fermées, cartes dont
  les conditions de visibilité ne sont pas remplies) ne sont plus affichées ; une
  petite mention indique combien sont masquées (« +3 autre(s) carte(s)
  masquée(s) »). L'aperçu de l'éditeur ne change pas.

### Mises à jour et cache

- Un numéro de build est affiché à côté de la version (bas de l'éditeur et
  console du navigateur), pour savoir quel fichier est chargé quand la version ne
  change pas.
- À l'ouverture de l'éditeur, le plugin relit son fichier en contournant le
  cache : si un build plus récent existe, il propose **Recharger**. Un lien
  **Recharger sans cache** est toujours disponible en bas de l'éditeur. Le
  rechargement retire aussi le fichier des caches du service worker ; sur certains
  appareils (application mobile), vider le cache de l'app peut rester nécessaire.

### Documentation

- README réécrit pour la 2.0.0, en indiquant clairement que tout se fait
  graphiquement, sans YAML à écrire.

## 1.8.2 — 13 septembre 2026

### Documentation

- README réécrit pour correspondre au plugin actuel (éditeur, suppression,
  variables facultatives, stockage, pop-ups Bubble Card, prérequis) ; retrait
  des fonctions qui n'existent plus (import decluttering-card en un clic, partir
  d'une carte du dashboard).
- Nouvelle illustration de l'éditeur actuel dans le README.
- Version minimale de Home Assistant fixée à **2026.6.0** dans `hacs.json` : le
  plugin s'appuie sur des fonctions d'édition des versions récentes.

## 1.8.1 — 13 septembre 2026

### Corrections

- Après la modification d'une carte du template, le bouton **Enregistrer** de
  l'éditeur Declutter Plus restait grisé (la modification étant déjà enregistrée
  dans le template, Home Assistant ne voyait rien à enregistrer). Il est
  désormais actif et enregistre normalement ; **Annuler** ferme toujours sans
  demander d'abandonner les modifications.

## 1.8.0 — 13 septembre 2026

### Protection des templates partagés

- Le dashboard de stockage est renommé **⚠ Declutter Plus – Templates (ne pas
  supprimer)** pour que l'avertissement apparaisse dans *Paramètres › Tableaux
  de bord*.
- Supprimer un dashboard qui stocke des templates Declutter Plus demande
  confirmation, avec le nombre de templates. Au mieux : uniquement dans un onglet
  où Declutter Plus est chargé.
- Les templates partagés sont sauvegardés automatiquement dans les données
  utilisateur Home Assistant de l'administrateur. Quand le dashboard de stockage
  est introuvable, l'éditeur propose **Restaurer les templates** (le dashboard
  est recréé et rempli).

### Performances

- Éditeur beaucoup plus léger : les miniatures des templates ne sont créées que
  lorsqu'elles sont visibles, réutilisées d'un rendu à l'autre et rafraîchies au
  plus une fois par minute au lieu d'à chaque changement d'état (mesuré : 300 → 0
  redessins de miniatures pour 100 changements d'état, 12 → 3 cartes créées pour
  3 rafraîchissements). L'éditeur ne se redessine plus quand les templates n'ont
  pas changé, et affiche au plus 24 miniatures.

## 1.7.0 — 13 septembre 2026

### Changements

- **Plus de variables automatiques** : ajouter une carte, importer une section ou
  coller une carte garde les valeurs telles quelles. Les variables sont
  facultatives et se créent à la demande avec **Rendre un réglage variable…**.
  Les variables existantes sont conservées ; les retirer avec ✕ si inutiles.
- L'éditeur s'ouvre avec le panneau **Template** déplié et **Variables** replié,
  et retient les panneaux ouverts ou fermés.

## 1.6.1 — 13 septembre 2026

### Corrections

- Les pop-ups Bubble Card d'un template se comportent comme dans une section :
  - dashboard en mode édition : affichées réduites (encart de Bubble) au lieu
    d'être masquées, le mode édition étant désormais transmis aux cartes du
    template ;
  - éditeur Declutter Plus : affichées en encart réduit (hash et indication) au
    lieu de la pop-up complète ; la pop-up complète n'apparaît que dans son
    propre éditeur, quand on modifie cette carte.

## 1.6.0 — 13 septembre 2026

- **Importer une section** : un nouveau bouton sous **Ajouter une carte** dans
  l'aperçu liste les sections du dashboard et copie toutes les cartes de celle
  choisie dans le template (ou crée un template portant le nom de la section), en
  gardant la largeur des cartes. L'entité de chaque carte devient une variable.
  La section d'origine n'est pas modifiée.

## 1.5.6 — 13 septembre 2026

### Corrections

- Ajouter une pop-up Bubble Card à un template masquait toute la carte Declutter
  Plus après enregistrement : une pop-up fermée masque le conteneur de carte le
  plus proche, qui était la carte Declutter Plus elle-même. Chaque carte d'un
  template a désormais son propre conteneur de carte Home Assistant (comme dans
  une section) : la pop-up ne masque que sa case. Les conditions `visibility`
  par carte fonctionnent aussi.
- Les templates partagés sont toujours relus depuis le stockage (plus de template
  périmé jusqu'au vidage du cache), et l'éditeur les recharge à chaque ouverture.
- La version chargée est affichée en bas de l'éditeur, pour repérer un ancien
  fichier gardé en cache par le navigateur.

## 1.5.5 — 13 septembre 2026

### Corrections

- Les templates stockés en `vertical-stack` dont des cartes ont une largeur
  (`grid_options.columns`) s'affichent désormais toujours en grille, dans
  l'éditeur comme sur les dashboards, sans devoir les modifier. Les piles sans
  largeur de carte (par exemple issues de decluttering-card) restent empilées.

## 1.5.4 — 13 septembre 2026

### Corrections

- Les cartes des templates créés en 1.3.0 (stockés en `vertical-stack`) restaient
  empilées même après avoir réglé leur largeur. Modifier ou redimensionner une
  de leurs cartes convertit désormais le template en grille : les largeurs
  s'appliquent.

## 1.5.3 — 13 septembre 2026

### Corrections

- Régression de la 1.5.1 : enregistrer, fermer ou annuler l'éditeur d'une carte
  fermait aussi l'éditeur Declutter Plus derrière. Il n'est désormais rouvert
  qu'une fois l'éditeur de carte complètement fermé par Home Assistant.

## 1.5.2 — 13 septembre 2026

### Corrections

- Régression de la 1.5.1 : dans un dashboard en sections, l'aperçu de l'éditeur
  perdait les barres d'édition par carte et le bouton « Ajouter une carte »
  (l'aperçu est rendu dans une section, prise à tort pour le dashboard).

## 1.5.1 — 13 septembre 2026

### Corrections

- Modifier une carte depuis l'aperçu pouvait ne rien faire (constaté sur
  mobile). L'éditeur de carte s'ouvre désormais directement avec les paramètres
  actuels de Home Assistant, sans la section fantôme dont il dépendait.
- L'ajout d'une carte ouvre directement le sélecteur de cartes si la section
  fantôme n'est pas disponible.
- Si l'éditeur ne peut pas s'ouvrir, une notification Home Assistant en donne la
  raison (le panneau de gauche peut être hors écran sur mobile).
- La détection de l'aperçu de l'éditeur est recalculée à chaque rendu.

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
  qu'une carte est ajoutée, dupliquée, supprimée, modifiée ou redimensionnée
  (1.5.4).

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
