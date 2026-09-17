/*
 * Declutter Plus — templates de cartes Lovelace réutilisables, stockés dans le
 * dashboard courant ou partagés entre dashboards, édités avec les popups natives
 * de Home Assistant. Compatible avec la syntaxe de decluttering-card.
 */
(function () {
  "use strict";

  const VERSION = "2.1.0";
  const CARD_TAG = "declutter-plus-card";
  const PASTE_TAG = "declutter-plus-paste-card";
  const ELEMENT_TAG = "declutter-plus-element";
  const ROW_TAG = "declutter-plus-row";
  const GRID_TAG = "declutter-plus-grid";
  const GRID_TYPE = "custom:" + GRID_TAG;
  const GRID_COLUMNS = 12;
  const GRID_REFRESH_MS = [50, 300, 1000];
  const EDITOR_TAG = "declutter-plus-card-editor";
  const SHARED_DASHBOARD = "declutter-plus"; // ancien dashboard caché, identifiant de la bibliothèque
  const SYSTEM_KEY = "declutter_plus";
  const PREFS_KEY = "declutter_plus_prefs";
  const DECLUTTERING_SUFFIX = "_decluttering";
  const SCAN_TTL_MS = 300000;
  const BACKUP_KEY = "declutter_plus_backup_";
  const TEMPLATES_KEY = "declutter_plus_templates";
  const LEGACY_KEY = "decluttering_templates";
  const SCOPE_LOCAL = "local";
  const SCOPE_LEGACY = "legacy";
  const SCOPE_SHARED = "shared";
  const KINDS = ["card", "element", "row"];
  const VAR_RE = /\[\[([A-Za-z0-9_-]+)\]\]/g;
  const EXACT_VAR_RE = /^\[\[([A-Za-z0-9_-]+)\]\]$/;
  const NAME_RE = /^[A-Za-z0-9_-]+$/;
  const ENTITY_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/;
  const CLIPBOARD_KEY = "dashboardCardClipboard";
  const MAX_VAR_PASSES = 10;
  const PREVIEW_LIMIT = 24;
  const PREVIEW_REFRESH_MS = 60000;
  const DOM_GUARD = 20000;
  // HA réinitialise son suivi « modifié » après un chargement asynchrone
  const DIRTY_TICKS = 40;
  const DIRTY_TICK_MS = 50;
  const DIRTY_MARKER = "__declutter_plus_saved";
  const CLOSE_TIMEOUT_MS = 1500;
  const FALLBACK_LANG = "en";

  const STRINGS = {
    en: {
      cardName: "Declutter Plus",
      cardDescription: "Reusable card templates for this dashboard or all dashboards, edited with Home Assistant's own card editors.",
      pasteName: "Declutter Plus: paste copied card",
      pasteDescription: "Turn the card you copied (card menu > Copy) into a reusable template.",
      templateNotFound: "Template not found: {name}",
      kindMismatch: "Template \"{name}\" is a {kind} template.",
      addCard: "Add card",
      saveAsTemplate: "Save as template",
      importSection: "Import a section",
      importTitle: "Import the cards of a section",
      importHelp: "The cards are copied into the template; the original section is not changed.",
      importEmpty: "No section with cards on this dashboard.",
      importCount: "{count} card(s)",
      imported: "{count} card(s) imported.",
      homeTitle: "Declutter Plus",
      homeIntro: "A template groups one or more cards that you build once and reuse on as many pages as you want. Edit it from any card that uses it: they all follow.",
      homePoint1: "Fill a template from the preview: pick a card, paste a copied card, or import a whole section with its containers.",
      homePoint2: "Shared templates are available on every dashboard.",
      homePoint3: "Optional variables let you reuse a template with other entities.",
      homePoint4: "Original cards are never changed: a template is a copy.",
      homeCount: "{count} template(s) available",
      createTemplate: "Create a template",
      createTemplateHint: "Name it, then add cards from the preview.",
      useTemplate: "Use an existing template",
      manageTemplates: "Manage templates",
      back: "Back",
      cancel: "Cancel",
      createTitle: "New template",
      namePlaceholder: "living_room_menu",
      nameHint: "Letters, digits, _ and - only. Cards use this name to find the template.",
      nameTaken: "A template named \"{name}\" already exists.",
      createHelpTitle: "How to fill it",
      createHelp: "Once created, fill the template from the preview on the right: \"Add card\" opens Home Assistant's card picker, \"Import a section\" copies every card and container of a section, and a card copied from its menu can be added with \"Declutter Plus: paste copied card\". Original cards are not changed. You can then edit this template from any page where a card uses it: changes apply everywhere.",
      pasteIntoCreate: "The copied card will be the first card of the template.",
      createButton: "Create template",
      created: "Template \"{name}\" created. Add cards from the preview.",
      pickTitle: "Choose a template",
      manageTitle: "Manage templates",
      manageHelp: "Changes apply to every Declutter Plus card using the template.",
      cardsInTemplate: "{count} card(s)",
      usedBy: "used by {count} card(s)",
      usageLoading: "counting uses…",
      edit: "Edit",
      remove: "Delete",
      useInCard: "Use in this card",
      templateLabel: "Template",
      editHint: "Edit the cards of this template in the preview on the right: changes apply wherever it is used.",
      noVariablesCard: "This template has no variables. Add some from \"Manage templates\".",
      changeTemplate: "Change template",
      confirmRename: "Rename template \"{old}\" to \"{name}\"? {usage}\nOther cards using the old name will show \"Template not found\" until the template is chosen again.",
      legacyFound: "{count} shared template(s) are still in the old storage dashboard (Declutter Plus 1.x). They keep working there.",
      legacyCopyHelp: "You can copy them to Home Assistant's system data, the new storage: no hidden dashboard to maintain, updated live, included in backups. The old dashboard is left untouched and stays usable.",
      legacyCopy: "Copy to the new storage",
      legacyCopied: "{count} template(s) copied to the new storage. The old storage dashboard is unchanged; delete it in Settings › Dashboards only when you no longer need it.",
      declFound: "{count} decluttering-card template(s) found in {dashboards} dashboard(s). Copy them into Declutter Plus?",
      declHelp: "They are copied to Declutter Plus shared templates. The original decluttering-card templates and cards are not changed and keep working; delete them yourself if you wish.",
      declCopy: "Copy into Declutter Plus",
      declLater: "Later",
      declNever: "Don't ask again",
      declCopied: "{count} decluttering-card template(s) copied into Declutter Plus. Your decluttering-card cards still use decluttering-card: to use a copy, add a Declutter Plus card and choose the template.",
      popupNoHash: "Pop-up without hash",
      backupFound: "No shared template found, but a backup of {count} template(s) from {date} exists.",
      backupRestore: "Restore templates",
      restored: "{count} template(s) restored.",
      confirmDeleteLocal: "This dashboard stores {count} Declutter Plus template(s). Deleting it removes them.\n\nDelete it anyway?",
      deleteCancelled: "Deletion cancelled.",
      popupHidden: "Pop-up content is hidden in edit mode. Edit this card to see it.",
      sectionLabel: "Section {index}",
      panelVariables: "Variables",
      search: "Search templates",
      noTemplates: "No template yet.",
      scopeLocal: "This dashboard",
      scopeLegacy: "This dashboard (decluttering-card)",
      scopeShared: "Shared",
      noPreview: "No preview for {kind} templates",
      fieldName: "Template name",
      fieldDescription: "Description",
      fieldScope: "Storage",
      storageLocal: "Saved in this dashboard's configuration, usable on this dashboard only.",
      storageShared: "Saved in Home Assistant's system data, usable on every dashboard (included in Home Assistant backups).",
      noVariables: "This template has no variables.",
      defaultValue: "Default: {value}",
      templateVars: "Variable settings of the template",
      templateVarsHelp: "These card settings can be changed on each Declutter Plus card.",
      addVariable: "Make a setting variable…",
      removeVar: "Remove variable {name}",
      nonCardHelp: "This {kind} template is edited in YAML (code editor of this card).",
      confirmDelete: "Delete the Declutter Plus template \"{name}\"?\n\nIt is stored {where} and may be used by other Declutter Plus cards. {usage}\nThose cards will show \"Template not found\" once it is deleted.\n\nThis cannot be undone.",
      confirmRemoveCard: "Remove this card from the Declutter Plus template \"{name}\"?\n\nThe template is stored {where}: the change applies to every Declutter Plus card using it. {usage}",
      whereShared: "in shared storage (all dashboards)",
      whereLocal: "in this dashboard",
      usageCount: "It is currently used by {cards} card(s) on {dashboards} dashboard(s).",
      usageUnknown: "Its use on other dashboards could not be checked.",
      confirmOverwrite: "Template \"{name}\" already exists there. Overwrite?",
      saved: "Template saved.",
      deleted: "Template deleted.",
      copied: "Card copied.",
      invalidName: "The name may only contain letters, digits, _ and -.",
      adminOnly: "Only administrators can edit templates.",
      dialogUnavailable: "Declutter Plus: the Home Assistant card editor could not be opened ({reason}).",
      dashboardUnavailable: "This dashboard cannot be modified from here (YAML mode?). Use shared storage.",
      error: "Error: {message}",
      close: "Close"
    },
    fr: {
      cardName: "Declutter Plus",
      cardDescription: "Templates de cartes réutilisables, pour ce dashboard ou tous les dashboards, édités avec les éditeurs de cartes de Home Assistant.",
      pasteName: "Declutter Plus : coller la carte copiée",
      pasteDescription: "Transforme la carte copiée (menu de la carte > Copier) en template réutilisable.",
      templateNotFound: "Template introuvable : {name}",
      kindMismatch: "Le template « {name} » est de type {kind}.",
      addCard: "Ajouter une carte",
      saveAsTemplate: "Enregistrer comme template",
      importSection: "Importer une section",
      importTitle: "Importer les cartes d'une section",
      importHelp: "Les cartes sont copiées dans le template ; la section d'origine n'est pas modifiée.",
      importEmpty: "Aucune section avec des cartes sur ce dashboard.",
      importCount: "{count} carte(s)",
      imported: "{count} carte(s) importée(s).",
      homeTitle: "Declutter Plus",
      homeIntro: "Un template regroupe une ou plusieurs cartes, créées une fois et réutilisées sur autant de pages que vous voulez. Modifiez-le depuis n'importe quelle carte qui l'utilise : toutes suivent.",
      homePoint1: "Remplissez un template depuis l'aperçu : choisissez une carte, collez une carte copiée ou importez une section entière avec ses conteneurs.",
      homePoint2: "Les templates partagés sont disponibles sur tous les dashboards.",
      homePoint3: "Des variables facultatives permettent de réutiliser un template avec d'autres entités.",
      homePoint4: "Les cartes d'origine ne sont jamais modifiées : un template est une copie.",
      homeCount: "{count} template(s) disponible(s)",
      createTemplate: "Créer un template",
      createTemplateHint: "Nommez-le, puis ajoutez des cartes depuis l'aperçu.",
      useTemplate: "Utiliser un template existant",
      manageTemplates: "Gérer les templates",
      back: "Retour",
      cancel: "Annuler",
      createTitle: "Nouveau template",
      namePlaceholder: "menu_salon",
      nameHint: "Lettres, chiffres, _ et - uniquement. Les cartes retrouvent le template grâce à ce nom.",
      nameTaken: "Un template nommé « {name} » existe déjà.",
      createHelpTitle: "Comment le remplir",
      createHelp: "Une fois créé, remplissez le template depuis l'aperçu à droite : « Ajouter une carte » ouvre le sélecteur de cartes de Home Assistant, « Importer une section » copie toutes les cartes et conteneurs d'une section, et une carte copiée depuis son menu s'ajoute avec « Declutter Plus : coller la carte copiée ». Les cartes d'origine ne sont pas modifiées. Vous pourrez ensuite modifier ce template depuis n'importe quelle page où une carte l'utilise : les changements s'appliquent partout.",
      pasteIntoCreate: "La carte copiée sera la première carte du template.",
      createButton: "Créer le template",
      created: "Template « {name} » créé. Ajoutez des cartes depuis l'aperçu.",
      pickTitle: "Choisir un template",
      manageTitle: "Gérer les templates",
      manageHelp: "Les modifications s'appliquent à toutes les cartes Declutter Plus qui utilisent le template.",
      cardsInTemplate: "{count} carte(s)",
      usedBy: "utilisé par {count} carte(s)",
      usageLoading: "comptage des utilisations…",
      edit: "Modifier",
      remove: "Supprimer",
      useInCard: "Utiliser dans cette carte",
      templateLabel: "Template",
      editHint: "Modifiez les cartes de ce template dans l'aperçu à droite : les changements s'appliquent partout où il est utilisé.",
      noVariablesCard: "Ce template n'a pas de variable. Ajoutez-en depuis « Gérer les templates ».",
      changeTemplate: "Changer de template",
      confirmRename: "Renommer le template « {old} » en « {name} » ? {usage}\nLes autres cartes qui utilisent l'ancien nom afficheront « Template introuvable » jusqu'à ce que le template soit à nouveau choisi.",
      legacyFound: "{count} template(s) partagé(s) sont encore dans l'ancien dashboard de stockage (Declutter Plus 1.x). Ils continuent d'y fonctionner.",
      legacyCopyHelp: "Vous pouvez les copier dans les données système de Home Assistant, le nouveau stockage : plus de dashboard caché à maintenir, mise à jour en direct, inclus dans les sauvegardes. L'ancien dashboard n'est pas modifié et reste utilisable.",
      legacyCopy: "Copier vers le nouveau stockage",
      legacyCopied: "{count} template(s) copié(s) vers le nouveau stockage. L'ancien dashboard de stockage n'a pas changé ; ne le supprimez dans Paramètres › Tableaux de bord que lorsque vous n'en avez plus besoin.",
      declFound: "{count} template(s) decluttering-card trouvé(s) dans {dashboards} dashboard(s). Les copier dans Declutter Plus ?",
      declHelp: "Ils sont copiés dans les templates partagés de Declutter Plus. Les templates et cartes decluttering-card d'origine ne sont pas modifiés et continuent de fonctionner ; supprimez-les vous-même si vous le souhaitez.",
      declCopy: "Copier dans Declutter Plus",
      declLater: "Plus tard",
      declNever: "Ne plus demander",
      declCopied: "{count} template(s) decluttering-card copié(s) dans Declutter Plus. Vos cartes decluttering-card utilisent toujours decluttering-card : pour utiliser une copie, ajoutez une carte Declutter Plus et choisissez le template.",
      popupNoHash: "Pop-up sans hash",
      backupFound: "Aucun template partagé trouvé, mais une sauvegarde de {count} template(s) du {date} existe.",
      backupRestore: "Restaurer les templates",
      restored: "{count} template(s) restauré(s).",
      confirmDeleteLocal: "Ce dashboard stocke {count} template(s) Declutter Plus. Le supprimer les efface.\n\nLe supprimer quand même ?",
      deleteCancelled: "Suppression annulée.",
      popupHidden: "Le contenu de la pop-up est masqué en mode édition. Modifiez cette carte pour le voir.",
      sectionLabel: "Section {index}",
      panelVariables: "Variables",
      search: "Rechercher un template",
      noTemplates: "Aucun template pour l'instant.",
      scopeLocal: "Ce dashboard",
      scopeLegacy: "Ce dashboard (decluttering-card)",
      scopeShared: "Partagé",
      noPreview: "Pas d'aperçu pour un template {kind}",
      fieldName: "Nom du template",
      fieldDescription: "Description",
      fieldScope: "Stockage",
      storageLocal: "Enregistré dans la configuration de ce dashboard, utilisable uniquement sur ce dashboard.",
      storageShared: "Enregistré dans les données système de Home Assistant, utilisable sur tous les dashboards (inclus dans les sauvegardes Home Assistant).",
      noVariables: "Ce template n'a pas de variable.",
      defaultValue: "Défaut : {value}",
      templateVars: "Réglages variables du template",
      templateVarsHelp: "Ces réglages de la carte peuvent changer sur chaque carte Declutter Plus.",
      addVariable: "Rendre un réglage variable…",
      removeVar: "Retirer la variable {name}",
      nonCardHelp: "Ce template {kind} se modifie en YAML (éditeur de code de cette carte).",
      confirmDelete: "Supprimer le template Declutter Plus « {name} » ?\n\nIl est stocké {where} et peut être utilisé par d'autres cartes Declutter Plus. {usage}\nCes cartes afficheront « Template introuvable » une fois le template supprimé.\n\nCette action est irréversible.",
      confirmRemoveCard: "Retirer cette carte du template Declutter Plus « {name} » ?\n\nLe template est stocké {where} : la modification s'applique à toutes les cartes Declutter Plus qui l'utilisent. {usage}",
      whereShared: "dans le stockage partagé (tous les dashboards)",
      whereLocal: "dans ce dashboard",
      usageCount: "Il est actuellement utilisé par {cards} carte(s) sur {dashboards} dashboard(s).",
      usageUnknown: "Son utilisation sur les autres dashboards n'a pas pu être vérifiée.",
      confirmOverwrite: "Le template « {name} » existe déjà à cet endroit. L'écraser ?",
      saved: "Template enregistré.",
      deleted: "Template supprimé.",
      copied: "Carte copiée.",
      invalidName: "Le nom ne peut contenir que lettres, chiffres, _ et -.",
      adminOnly: "Seuls les administrateurs peuvent modifier les templates.",
      dialogUnavailable: "Declutter Plus : impossible d'ouvrir l'éditeur de cartes de Home Assistant ({reason}).",
      dashboardUnavailable: "Ce dashboard ne peut pas être modifié d'ici (mode YAML ?). Utilisez le stockage partagé.",
      error: "Erreur : {message}",
      close: "Fermer"
    }
  };

  // ---------------------------------------------------------------------------
  // i18n

  function resolveLang(hass) {
    let lang = "";
    try {
      lang = (hass && ((hass.locale && hass.locale.language) || hass.language)) || navigator.language || "";
    } catch (e) {}
    lang = String(lang).toLowerCase().split(/[-_]/)[0];
    return STRINGS[lang] ? lang : FALLBACK_LANG;
  }

  function t(lang, key) {
    const table = STRINGS[lang] || STRINGS[FALLBACK_LANG];
    return key in table ? table[key] : STRINGS[FALLBACK_LANG][key] || key;
  }

  function tSub(lang, key, subs) {
    return t(lang, key).replace(/\{(\w+)\}/g, function (m, k) {
      return subs && k in subs ? String(subs[k]) : m;
    });
  }

  // Libellé natif de HA quand il existe (même texte que le reste de l'interface)
  function haLabel(hass, key, lang, fallbackKey) {
    try {
      const text = hass && hass.localize && hass.localize(key);
      if (text) return text;
    } catch (e) {}
    return t(lang, fallbackKey);
  }

  // ---------------------------------------------------------------------------
  // Utilitaires

  function isObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  function clone(v) {
    if (v === undefined) return undefined;
    try {
      return JSON.parse(JSON.stringify(v));
    } catch (e) {
      return v;
    }
  }

  function listToObject(v) {
    // decluttering-card : liste de { nom: valeur } ; on accepte aussi un objet
    if (Array.isArray(v)) {
      const out = {};
      v.forEach(function (item) {
        if (isObject(item)) Object.assign(out, item);
      });
      return out;
    }
    return isObject(v) ? Object.assign({}, v) : {};
  }

  function hasVar(vars, name) {
    return Object.prototype.hasOwnProperty.call(vars, name);
  }

  function valueToText(v) {
    return typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
  }

  function getPath(node, path) {
    let cur = node;
    for (let i = 0; i < path.length; i++) {
      if (cur === null || typeof cur !== "object") return undefined;
      cur = cur[path[i]];
    }
    return cur;
  }

  function setPath(node, path, value) {
    let cur = node;
    for (let i = 0; i < path.length - 1; i++) {
      if (cur === null || typeof cur !== "object") return false;
      cur = cur[path[i]];
    }
    if (cur === null || typeof cur !== "object") return false;
    cur[path[path.length - 1]] = value;
    return true;
  }

  function samePath(a, b) {
    return a.length === b.length && a.every(function (k, i) {
      return String(k) === String(b[i]);
    });
  }

  // Chemin d'un objet égal (JSON) à target dans root ; [] si c'est root.
  function findConfigPath(root, target) {
    const wanted = JSON.stringify(target);
    const stack = [{ node: root, path: [] }];
    let guard = 0;
    while (stack.length && guard < DOM_GUARD) {
      guard++;
      const item = stack.pop();
      if (item.node === null || typeof item.node !== "object") continue;
      if (JSON.stringify(item.node) === wanted) return item.path;
      Object.keys(item.node).forEach(function (key) {
        stack.push({ node: item.node[key], path: item.path.concat(Array.isArray(item.node) ? Number(key) : key) });
      });
    }
    return null;
  }

  // Feuilles scalaires d'une config (hors clés « type »), candidates aux variables.
  function leafPaths(node, path, out) {
    out = out || [];
    path = path || [];
    if (Array.isArray(node)) {
      node.forEach(function (item, i) {
        leafPaths(item, path.concat(i), out);
      });
    } else if (isObject(node)) {
      Object.keys(node).forEach(function (key) {
        if (key === "type") return;
        leafPaths(node[key], path.concat(key), out);
      });
    } else if (path.length && (typeof node === "string" || typeof node === "number" || typeof node === "boolean")) {
      out.push({ path: path, value: node });
    }
    return out;
  }

  // Remplace les [[variables]]. Une chaîne réduite à « [[x]] » reprend la valeur
  // brute (objet, nombre, booléen) ; sinon la valeur est insérée comme texte.
  function substitute(node, vars) {
    if (typeof node === "string") {
      const exact = node.match(EXACT_VAR_RE);
      if (exact) return hasVar(vars, exact[1]) ? clone(vars[exact[1]]) : node;
      return node.replace(VAR_RE, function (m, name) {
        return hasVar(vars, name) && vars[name] !== undefined ? valueToText(vars[name]) : m;
      });
    }
    if (Array.isArray(node)) {
      return node.map(function (item) {
        return substitute(item, vars);
      });
    }
    if (isObject(node)) {
      const out = {};
      Object.keys(node).forEach(function (key) {
        out[substitute(key, vars)] = substitute(node[key], vars);
      });
      return out;
    }
    return node;
  }

  function collectVars(node, set) {
    set = set || new Set();
    if (typeof node === "string") {
      let m;
      VAR_RE.lastIndex = 0;
      while ((m = VAR_RE.exec(node))) set.add(m[1]);
    } else if (Array.isArray(node)) {
      node.forEach(function (item) {
        collectVars(item, set);
      });
    } else if (isObject(node)) {
      Object.keys(node).forEach(function (key) {
        collectVars(key, set);
        collectVars(node[key], set);
      });
    }
    return set;
  }

  // Défauts + valeurs données, puis résolution des variables qui en référencent d'autres.
  function resolveVariables(defaults, given) {
    let merged = Object.assign({}, defaults, given);
    for (let i = 0; i < MAX_VAR_PASSES; i++) {
      const before = JSON.stringify(merged);
      merged = substitute(merged, merged);
      if (JSON.stringify(merged) === before) break;
    }
    return merged;
  }

  function normalizeTemplate(raw) {
    if (!isObject(raw)) return null;
    let kind = null;
    for (let i = 0; i < KINDS.length; i++) {
      if (isObject(raw[KINDS[i]])) {
        kind = KINDS[i];
        break;
      }
    }
    if (!kind) return null;
    return {
      kind: kind,
      config: raw[kind],
      defaults: listToObject(raw.default),
      fields: isObject(raw.fields) ? raw.fields : {},
      description: typeof raw.description === "string" ? raw.description : "",
      grid_options: isObject(raw.grid_options) ? raw.grid_options : null
    };
  }

  function renderTemplate(tpl, given) {
    const vars = resolveVariables(tpl.defaults, given);
    return {
      config: substitute(tpl.config, vars),
      grid_options: tpl.grid_options ? substitute(tpl.grid_options, vars) : null
    };
  }

  function validateConfig(config) {
    if (!isObject(config)) throw new Error("Invalid configuration");
    if (config.paste !== undefined && !(isObject(config.paste) && typeof config.paste.type === "string")) {
      throw new Error("'paste' must be a card configuration");
    }
    if (config.template === undefined && !config.paste) throw new Error("'template' is required");
    if (config.template !== undefined && typeof config.template !== "string") {
      throw new Error("'template' must be a string");
    }
    if (config.variables !== undefined && config.variables !== null) {
      const v = config.variables;
      const ok = isObject(v) || (Array.isArray(v) && v.every(isObject));
      if (!ok) throw new Error("'variables' must be an object or a list of objects");
    }
    if (config.library !== undefined && typeof config.library !== "string") {
      throw new Error("'library' must be a string");
    }
  }

  function fireEvent(node, type, detail) {
    const ev = new Event(type, { bubbles: true, composed: true });
    ev.detail = detail;
    node.dispatchEvent(ev);
  }

  function isAdmin(hass) {
    return !!(hass && hass.user && hass.user.is_admin);
  }

  function errorText(lang, err) {
    const msg = (err && (err.message || err.code)) || String(err);
    return msg === "dashboard unavailable" ? t(lang, "dashboardUnavailable") : tSub(lang, "error", { message: msg });
  }

  // ---------------------------------------------------------------------------
  // Dashboard courant

  let rootHost = null;

  function isLovelace(obj) {
    return !!(obj && isObject(obj.config) && typeof obj.saveConfig === "function");
  }

  function bfsFind(root, test) {
    const queue = [root];
    let head = 0;
    while (head < queue.length && head < DOM_GUARD) {
      const el = queue[head++];
      if (!el) continue;
      try {
        if (test(el)) return el;
      } catch (e) {}
      if (el.shadowRoot) queue.push.apply(queue, el.shadowRoot.children);
      if (el.children) queue.push.apply(queue, el.children);
    }
    return null;
  }

  // Remonte depuis l'élément (shadow roots compris), sinon cherche hui-root :
  // l'éditeur vit dans une boîte de dialogue hors de l'arbre du dashboard.
  function findLovelace(start) {
    let el = start;
    let guard = 0;
    while (el && guard < 200) {
      guard++;
      try {
        if (isLovelace(el.lovelace)) return el.lovelace;
      } catch (e) {}
      el = el.parentNode || el.host;
    }
    if (rootHost && rootHost.isConnected && isLovelace(rootHost.lovelace)) return rootHost.lovelace;
    rootHost = bfsFind(document.body, function (node) {
      return node.localName === "hui-root" && isLovelace(node.lovelace);
    });
    return rootHost ? rootHost.lovelace : null;
  }

  // Presse-papiers de cartes de HA (menu « Copier ») : sessionStorage, puis localStorage.
  function readHaClipboard() {
    const stores = [];
    try {
      stores.push(window.sessionStorage, window.localStorage);
    } catch (e) {}
    for (let i = 0; i < stores.length; i++) {
      try {
        const raw = stores[i] && stores[i].getItem(CLIPBOARD_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (isObject(parsed) && typeof parsed.type === "string") return parsed;
      } catch (e) {}
    }
    return null;
  }

  function writeHaClipboard(card) {
    try {
      window.sessionStorage.setItem(CLIPBOARD_KEY, JSON.stringify(card));
    } catch (e) {}
    try {
      window.localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(card));
    } catch (e) {}
  }

  // Sections du dashboard qui contiennent des cartes (hors cartes Declutter Plus).
  function listDashboardSections(config, lang) {
    const out = [];
    if (!config || !Array.isArray(config.views)) return out;
    config.views.forEach(function (view, v) {
      const viewName = view.title || view.path || "#" + (v + 1);
      (Array.isArray(view.sections) ? view.sections : []).forEach(function (section, i) {
        const cards = (Array.isArray(section.cards) ? section.cards : []).filter(function (card) {
          return isObject(card) && typeof card.type === "string" && card.type.indexOf("custom:declutter-plus") !== 0;
        });
        if (!cards.length) return;
        const heading = cards.find(function (card) {
          return card.type === "heading" && card.heading;
        });
        const title = (heading && heading.heading) || section.title || tSub(lang, "sectionLabel", { index: i + 1 });
        out.push({ label: viewName + " › " + title, title: title, cards: cards });
      });
    });
    return out;
  }

  function isBubblePopup(config) {
    return isObject(config) && config.type === "custom:bubble-card" && config.card_type === "pop-up";
  }

  // Encart réduit d'une pop-up Bubble Card, comme Bubble l'affiche en mode édition.
  // Dans l'aperçu de l'éditeur, Bubble afficherait la pop-up complète.
  function createPopupPlaceholder(config, lang) {
    const card = document.createElement(customElements.get("ha-card") ? "ha-card" : "div");
    card.style.cssText = "display:flex;align-items:center;gap:12px;padding:12px 16px;min-height:56px;box-sizing:border-box";
    if (customElements.get("ha-icon")) {
      const icon = document.createElement("ha-icon");
      icon.icon = "mdi:information-outline";
      icon.style.cssText = "color:var(--secondary-text-color);flex:none";
      card.appendChild(icon);
    }
    const info = document.createElement("div");
    const hash = document.createElement("div");
    hash.style.cssText = "font-weight:500;font-size:14px";
    hash.textContent = config.hash || t(lang, "popupNoHash");
    const hint = document.createElement("div");
    hint.style.cssText = "font-size:12px;color:var(--secondary-text-color)";
    hint.textContent = t(lang, "popupHidden");
    info.appendChild(hash);
    info.appendChild(hint);
    card.appendChild(info);
    return card;
  }

  // ---------------------------------------------------------------------------
  // Helpers de cartes de HA (chargés une fois)

  let helpers = null;
  let helpersPromise = null;

  function loadHelpers() {
    if (helpers) return Promise.resolve(helpers);
    if (!helpersPromise) {
      helpersPromise = Promise.resolve()
        .then(function () {
          if (typeof window.loadCardHelpers !== "function") throw new Error("loadCardHelpers unavailable");
          return window.loadCardHelpers();
        })
        .then(function (h) {
          helpers = h;
          return h;
        })
        .catch(function (e) {
          helpersPromise = null;
          throw e;
        });
    }
    return helpersPromise;
  }

  function createChild(kind, config) {
    if (kind === "element") return helpers.createHuiElement(config);
    if (kind === "row") return helpers.createRowElement(config);
    return helpers.createCardElement(config);
  }

  // Carte dans son propre conteneur hui-card, comme dans une section : les cartes
  // qui masquent leur conteneur (pop-up Bubble Card fermée) ou les conditions de
  // visibilité n'agissent que sur leur case, pas sur toute la carte Declutter Plus.
  function createHuiCard(config, hass, preview) {
    if (!customElements.get("hui-card")) return helpers.createCardElement(config);
    const el = document.createElement("hui-card");
    el.layout = "grid";
    // preview = mode édition du dashboard : Bubble Card y affiche ses pop-ups réduites
    el.preview = !!preview;
    if (hass) el.hass = hass;
    el.config = config;
    if (typeof el.load === "function") el.load();
    return el;
  }

  // ---------------------------------------------------------------------------
  // Popups natives de HA (même principe que Bubble Card)
  //
  // Une section fantôme (hui-section + lovelace factice) reçoit ll-create-card /
  // ll-edit-card : HA ouvre son sélecteur puis son éditeur de carte. L'éditeur
  // enfant s'affiche dans la boîte d'édition courante ; à sa fermeture, la popup
  // de la carte Declutter Plus est rouverte avec sa config à jour.

  function haHost() {
    try {
      return document.querySelector("home-assistant");
    } catch (e) {
      return null;
    }
  }

  function activeEditDialog() {
    const host = haHost();
    try {
      return host && host.shadowRoot ? host.shadowRoot.querySelector("hui-dialog-edit-card") : null;
    } catch (e) {
      return null;
    }
  }

  // Force l'état « modifié » pour que le bouton Enregistrer de HA reste actif.
  // La référence (« initial ») reçoit un marqueur : l'état diffère de la config
  // courante (Enregistrer actif), et « Annuler » restaure cette référence, donc
  // aucune demande « abandonner les modifications ».
  function forceDialogDirty(dialog) {
    try {
      const slices = dialog._dirtySlices;
      const slice = slices && typeof slices.get === "function" ? slices.get("__default__") : null;
      if (!slice || !isObject(slice.current)) return false;
      if (isObject(slice.initial) && slice.initial[DIRTY_MARKER]) return true;
      const initial = clone(slice.current);
      initial[DIRTY_MARKER] = true;
      slice.initial = initial;
      slice.normalizedInitial = typeof dialog._normalizeEffective === "function" ? dialog._normalizeEffective(clone(initial)) : clone(initial);
      if (typeof dialog._publishContext === "function") dialog._publishContext();
      if (typeof dialog.requestUpdate === "function") dialog.requestUpdate();
      return true;
    } catch (e) {
      return false;
    }
  }

  function createProxySection(hass, cards, saveConfig) {
    const host = haHost();
    if (!host || !customElements.get("hui-section")) return Promise.resolve(null);
    const section = { type: "grid", cards: cards };
    const el = document.createElement("hui-section");
    el.style.display = "none";
    el.hass = hass;
    el.index = 0;
    el.viewIndex = 0;
    el.config = section;
    el.lovelace = {
      config: { views: [{ path: "declutter-plus", title: "Declutter Plus", sections: [section] }] },
      editMode: true,
      saveConfig: saveConfig
    };
    host.appendChild(el);
    return Promise.resolve()
      .then(function () {
        return typeof el._initializeConfig === "function" ? el._initializeConfig() : el.updateComplete;
      })
      .then(function () {
        return el.updateComplete;
      })
      .then(function () {
        return el._layoutElement ? el : null;
      })
      .catch(function (e) {
        console.warn("[declutter-plus] proxy section failed", e);
        el.remove();
        return null;
      });
  }

  // Toast natif de HA (visible aussi sur mobile, où le panneau peut être hors écran)
  function showToast(message) {
    try {
      fireEvent(haHost() || window, "hass-notification", { message: message });
    } catch (e) {}
  }

  // opts : { hass, mode: "add" | "edit", card, ownConfig, onSave(card) -> Promise<nouvelle config> }
  // Résout { ok, reason }.
  function openNativeCardDialog(opts) {
    const dialog = activeEditDialog();
    const host = haHost();
    if (!host) return Promise.resolve({ ok: false, reason: "no home-assistant" });
    if (!dialog) return Promise.resolve({ ok: false, reason: "no hui-dialog-edit-card" });
    if (!dialog._params) return Promise.resolve({ ok: false, reason: "no dialog params" });

    const parent = Object.assign({}, dialog._params);
    const ownPath = findConfigPath(parent.cardConfig, opts.ownConfig) || [];
    let nextOwnConfig = null;
    let pendingChild = null;
    let done = false;
    let restoreClose = null;

    const cleanup = function () {
      host.removeEventListener("show-dialog", onShow, true);
      window.removeEventListener("dialog-closed", onCreateClosed, true);
      if (restoreClose) restoreClose();
    };

    const reopenParent = function () {
      if (done) return;
      done = true;
      cleanup();
      const own = nextOwnConfig || opts.ownConfig;
      const params = Object.assign({}, parent, {
        cardConfig: ownPath.length ? (function () {
          const root = clone(parent.cardConfig);
          setPath(root, ownPath, clone(own));
          return root;
        })() : clone(own)
      });
      // la config du dashboard a pu changer (template enregistré localement)
      const ll = findLovelace(null);
      if (ll && "lovelaceConfig" in params) params.lovelaceConfig = ll.config;
      try {
        dialog.showDialog(params);
      } catch (e) {
        fireEvent(host, "show-dialog", {
          dialogTag: "hui-dialog-edit-card",
          dialogImport: function () {
            return Promise.resolve();
          },
          dialogParams: params
        });
      }
      if (nextOwnConfig) {
        // minuteur plutôt que requestAnimationFrame (suspendu en arrière-plan)
        let ticks = 0;
        const timer = setInterval(function () {
          forceDialogDirty(dialog);
          if (++ticks >= DIRTY_TICKS) clearInterval(timer);
        }, DIRTY_TICK_MS);
      }
    };

    // HA ferme en deux temps (animation, puis paramètres effacés et
    // « dialog-closed ») : rouvrir avant la fin effacerait la popup parente.
    const reopenAfterClosed = function () {
      let fired = false;
      const finish = function () {
        if (fired) return;
        fired = true;
        window.removeEventListener("dialog-closed", onClosed, true);
        setTimeout(reopenParent, 0);
      };
      const onClosed = function (ev) {
        if (ev.detail && ev.detail.dialog === "hui-dialog-edit-card") finish();
      };
      window.addEventListener("dialog-closed", onClosed, true);
      setTimeout(finish, CLOSE_TIMEOUT_MS);
    };

    const bridgeClose = function () {
      const hadOwn = Object.prototype.hasOwnProperty.call(dialog, "closeDialog");
      const original = dialog.closeDialog;
      const intercepted = function () {
        restore();
        const result = typeof original === "function" ? original.apply(dialog, arguments) : true;
        Promise.resolve(result).then(function (closed) {
          if (closed !== false) reopenAfterClosed();
        });
        return result;
      };
      const restore = function () {
        if (dialog.closeDialog !== intercepted) return;
        if (hadOwn) dialog.closeDialog = original;
        else delete dialog.closeDialog;
      };
      dialog.closeDialog = intercepted;
      restoreClose = restore;
    };

    const showChild = function (childParams) {
      bridgeClose();
      try {
        dialog.showDialog(childParams);
      } catch (e) {
        console.error("[declutter-plus] cannot open card editor", e);
        reopenParent();
      }
    };

    // enregistrement d'une carte par l'éditeur enfant
    const saveCard = function (card) {
      if (!isObject(card)) return Promise.resolve();
      return Promise.resolve(opts.onSave(clone(card))).then(function (own) {
        if (own) nextOwnConfig = own;
      });
    };

    const onShow = function (ev) {
      if (!ev.detail || ev.detail.dialogTag !== "hui-dialog-edit-card") return;
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      const params = Object.assign({}, ev.detail.dialogParams);
      if (typeof params.saveCardConfig === "function") params.saveCardConfig = saveCard;
      if (opts.mode === "add") {
        pendingChild = params;
      } else {
        host.removeEventListener("show-dialog", onShow, true);
        showChild(params);
      }
    };

    const onCreateClosed = function (ev) {
      if (!ev.detail || ev.detail.dialog !== "hui-dialog-create-card") return;
      host.removeEventListener("show-dialog", onShow, true);
      window.removeEventListener("dialog-closed", onCreateClosed, true);
      setTimeout(function () {
        if (pendingChild) showChild(pendingChild);
        else if (nextOwnConfig) reopenParent();
      }, 0);
    };

    const saveConfig = function (config) {
      const cards = getPath(config, ["views", 0, "sections", 0, "cards"]) || getPath(config, ["views", 0, "cards"]) || [];
      const card = cards[cards.length - 1];
      if (!isObject(card)) return Promise.resolve();
      return Promise.resolve(opts.onSave(card)).then(function (own) {
        if (own) nextOwnConfig = own;
      });
    };

    // Édition : l'éditeur enfant s'ouvre directement dans la boîte courante
    // (paramètres actuels de HA : cardConfig + saveCardConfig), sans section fantôme.
    if (opts.mode === "edit") {
      const card = clone(opts.card);
      showChild({
        lovelaceConfig: parent.lovelaceConfig,
        saveCardConfig: saveCard,
        cardConfig: card,
        sectionConfig: { type: "grid", cards: [card] }
      });
      return Promise.resolve({ ok: true });
    }

    // Ajout : sélecteur natif via une section fantôme (qui sait le charger)
    host.addEventListener("show-dialog", onShow, true);
    window.addEventListener("dialog-closed", onCreateClosed, true);
    return createProxySection(opts.hass, [], saveConfig).then(function (section) {
      if (section) {
        section._layoutElement.dispatchEvent(new CustomEvent("ll-create-card", { bubbles: true, composed: true }));
        setTimeout(function () {
          section.remove();
        }, 0);
        return { ok: true };
      }
      // repli : sélecteur déjà chargé, appelé directement avec retour de la carte
      if (customElements.get("hui-dialog-create-card")) {
        fireEvent(host, "show-dialog", {
          dialogTag: "hui-dialog-create-card",
          dialogImport: function () {
            return Promise.resolve();
          },
          dialogParams: {
            lovelaceConfig: parent.lovelaceConfig,
            saveConfig: function () {},
            path: [0, 0],
            saveCard: saveCard
          }
        });
        return { ok: true };
      }
      cleanup();
      return { ok: false, reason: customElements.get("hui-section") ? "proxy section failed" : "hui-section not loaded" };
    });
  }

  // ---------------------------------------------------------------------------
  // Stockage partagé (données système de HA) et local

  const libraries = {};
  const liveCards = new Set();

  function libraryEntry(path) {
    if (!libraries[path]) {
      libraries[path] = {
        path: path,
        loaded: false,
        legacy: false,
        error: null,
        templates: {},
        promise: null,
        subscribed: false,
        listeners: new Set()
      };
    }
    return libraries[path];
  }

  function notifyLibrary(entry) {
    entry.listeners.forEach(function (fn) {
      try {
        fn(entry);
      } catch (e) {
        console.error("[declutter-plus] listener error", e);
      }
    });
  }

  // Clé des données système de Home Assistant (lisibles par tous, écrites par un
  // administrateur, abonnement aux modifications) : plus de dashboard caché.
  function systemKey(path) {
    return path === SHARED_DASHBOARD ? SYSTEM_KEY : SYSTEM_KEY + "_" + path;
  }

  // Sauvegarde des templates partagés dans les données utilisateur de HA (côté
  // serveur), pour restaurer après un effacement accidentel.
  const backupSignatures = {};

  function writeBackup(hass, path, templates, always) {
    if (!isAdmin(hass) || !hass.callWS) return;
    const count = Object.keys(templates).length;
    if (!count && !always) return; // ne pas écraser une sauvegarde par un stockage vide
    const signature = JSON.stringify(templates);
    if (backupSignatures[path] === signature) return;
    backupSignatures[path] = signature;
    hass
      .callWS({
        type: "frontend/set_user_data",
        key: BACKUP_KEY + path,
        value: { path: path, saved_at: new Date().toISOString(), templates: clone(templates) }
      })
      .catch(function (e) {
        delete backupSignatures[path];
        console.warn("[declutter-plus] backup failed", e);
      });
  }

  function readBackup(hass, path) {
    return hass.callWS({ type: "frontend/get_user_data", key: BACKUP_KEY + path }).then(
      function (result) {
        const value = result && result.value;
        return isObject(value) && isObject(value.templates) && Object.keys(value.templates).length ? value : null;
      },
      function () {
        return null;
      }
    );
  }

  // Demande confirmation avant de supprimer un dashboard qui stocke des templates.
  // Ne protège que les suppressions faites dans un onglet où le plugin est chargé.
  function installDeleteGuard(hass) {
    const conn = hass && hass.connection;
    if (!conn || conn.__declutterPlusGuard || typeof conn.sendMessagePromise !== "function") return;
    conn.__declutterPlusGuard = true;
    const original = conn.sendMessagePromise;
    conn.sendMessagePromise = function (message) {
      const args = arguments;
      if (!message || message.type !== "lovelace/dashboards/delete") return original.apply(conn, args);
      const lang = resolveLang(hass);
      return original
        .call(conn, { type: "lovelace/dashboards/list" })
        .then(function (list) {
          const dash = (Array.isArray(list) ? list : []).find(function (d) {
            return d.id === message.dashboard_id;
          });
          if (!dash) return null;
          return original.call(conn, { type: "lovelace/config", url_path: dash.url_path }).then(
            function (config) {
              return Object.keys(listToObject(config && config[TEMPLATES_KEY])).length;
            },
            function () {
              return 0;
            }
          );
        })
        .catch(function () {
          return 0;
        })
        .then(function (count) {
          if (count && !window.confirm(tSub(lang, "confirmDeleteLocal", { count: count }))) {
            return Promise.reject({ code: "cancelled", message: t(lang, "deleteCancelled") });
          }
          return original.apply(conn, args);
        });
    };
  }

  function readSystemTemplates(result) {
    const value = result && result.value;
    return isObject(value) && isObject(value.templates) ? listToObject(value.templates) : null;
  }

  function loadLibrary(hass, path, force) {
    const entry = libraryEntry(path);
    if (!hass || !hass.callWS) return Promise.resolve(entry);
    subscribeLibrary(hass, entry);
    if (entry.promise && !force) return entry.promise;
    entry.promise = hass
      .callWS({ type: "frontend/get_system_data", key: systemKey(path) })
      .then(
        function (result) {
          entry.error = null;
          entry.legacy = false;
          const templates = readSystemTemplates(result);
          if (templates) {
            entry.templates = templates;
            return null;
          }
          entry.templates = {};
          return readLegacyDashboard(hass, entry);
        },
        function (err) {
          entry.templates = {};
          entry.error = err;
          console.warn("[declutter-plus] shared storage unavailable", err);
        }
      )
      .then(function () {
        entry.loaded = true;
        writeBackup(hass, path, entry.templates, false);
        notifyLibrary(entry);
        return entry;
      });
    return entry.promise;
  }

  function subscribeLibrary(hass, entry) {
    const conn = hass.connection;
    if (entry.subscribed || !conn || typeof conn.subscribeMessage !== "function") return;
    entry.subscribed = true;
    try {
      Promise.resolve(
        conn.subscribeMessage(
          function (event) {
            const templates = readSystemTemplates(event);
            if (!templates) return;
            entry.legacy = false;
            if (JSON.stringify(templates) === JSON.stringify(entry.templates)) return;
            entry.templates = templates;
            entry.loaded = true;
            notifyLibrary(entry);
          },
          { type: "frontend/subscribe_system_data", key: systemKey(entry.path) }
        )
      ).catch(function () {
        entry.subscribed = false;
      });
    } catch (e) {
      entry.subscribed = false;
    }
  }

  // Versions 1.x : templates dans le dashboard caché « declutter-plus ». Tant que
  // l'utilisateur ne les a pas copiés vers les données système, ils y restent lus
  // et modifiés ; ce dashboard n'est jamais vidé ni supprimé par le plugin.
  function readLegacyDashboard(hass, entry) {
    return hass.callWS({ type: "lovelace/config", url_path: entry.path }).then(
      function (config) {
        const templates = listToObject(isObject(config) ? config[TEMPLATES_KEY] : null);
        if (!Object.keys(templates).length) return null;
        entry.templates = templates;
        entry.legacy = true;
        return null;
      },
      function () {
        return null;
      }
    );
  }

  function saveLegacyDashboard(hass, path, mutate) {
    return hass.callWS({ type: "lovelace/config", url_path: path, force: true }).then(function (config) {
      const next = Object.assign({}, config);
      next[TEMPLATES_KEY] = listToObject(next[TEMPLATES_KEY]);
      mutate(next[TEMPLATES_KEY]);
      return hass.callWS({ type: "lovelace/config/save", url_path: path, config: next }).then(function () {
        return next[TEMPLATES_KEY];
      });
    });
  }

  // Copie (sans rien retirer) les templates de l'ancien dashboard vers les données système.
  function copyLegacyToSystem(hass, path) {
    return hass
      .callWS({ type: "lovelace/config", url_path: path, force: true })
      .then(function (config) {
        const templates = listToObject(isObject(config) ? config[TEMPLATES_KEY] : null);
        return hass
          .callWS({ type: "frontend/set_system_data", key: systemKey(path), value: { version: 1, templates: templates } })
          .then(function () {
            return Object.keys(templates).length;
          });
      })
      .then(function (count) {
        return loadLibrary(hass, path, true).then(function () {
          return count;
        });
      });
  }

  // Relit les templates frais et n'écrit que la clé de la bibliothèque.
  function saveShared(hass, path, mutate) {
    const key = systemKey(path);
    if (libraryEntry(path).legacy) {
      // pas encore copiés : on continue d'écrire dans l'ancien dashboard
      return saveLegacyDashboard(hass, path, mutate)
        .then(function (templates) {
          writeBackup(hass, path, templates, true);
        })
        .then(function () {
          return loadLibrary(hass, path, true);
        });
    }
    return hass
      .callWS({ type: "frontend/get_system_data", key: key })
      .then(function (result) {
        const templates = readSystemTemplates(result) || clone(libraryEntry(path).templates);
        mutate(templates);
        return hass.callWS({ type: "frontend/set_system_data", key: key, value: { version: 1, templates: templates } }).then(function () {
          writeBackup(hass, path, templates, true);
        });
      })
      .then(function () {
        return loadLibrary(hass, path, true);
      });
  }

  // Enregistre dans le dashboard courant via l'objet lovelace (config en mémoire
  // à jour). La config tenue par la boîte d'édition est aussi mise à jour : HA
  // l'enregistre telle quelle et écraserait sinon les templates.
  function saveLocal(lovelace, extraConfigs, mutate) {
    if (!isLovelace(lovelace)) return Promise.reject(new Error("dashboard unavailable"));
    const next = Object.assign({}, lovelace.config);
    const local = listToObject(next[TEMPLATES_KEY]);
    const legacy = listToObject(next[LEGACY_KEY]);
    mutate(local, legacy);
    const targets = [next].concat(
      extraConfigs.filter(function (c) {
        return isObject(c) && c !== lovelace.config;
      })
    );
    [
      [TEMPLATES_KEY, local],
      [LEGACY_KEY, legacy]
    ].forEach(function (pair) {
      targets.forEach(function (target) {
        try {
          if (Object.keys(pair[1]).length) target[pair[0]] = pair[1];
          else delete target[pair[0]];
        } catch (e) {}
      });
    });
    return Promise.resolve(lovelace.saveConfig(next)).then(function () {
      liveCards.forEach(function (card) {
        card._signature = null;
        card._build();
      });
    });
  }

  function localTemplates(config) {
    return {
      local: config ? listToObject(config[TEMPLATES_KEY]) : {},
      legacy: config ? listToObject(config[LEGACY_KEY]) : {}
    };
  }

  // Priorité : ce dashboard, puis decluttering-card de ce dashboard, puis partagé.
  function allTemplates(entry, dashConfig) {
    const out = {};
    const loc = localTemplates(dashConfig);
    [
      [entry ? entry.templates : {}, SCOPE_SHARED],
      [loc.legacy, SCOPE_LEGACY],
      [loc.local, SCOPE_LOCAL]
    ].forEach(function (pair) {
      Object.keys(pair[0]).forEach(function (name) {
        out[name] = { raw: pair[0][name], scope: pair[1] };
      });
    });
    return out;
  }

  // Templates decluttering-card (`decluttering_templates`) de tous les dashboards.
  // Le premier trouvé l'emporte quand un nom existe dans plusieurs dashboards.
  let declutteringScan = null;

  function scanDeclutteringTemplates(hass) {
    if (declutteringScan && Date.now() - declutteringScan.at < SCAN_TTL_MS) return declutteringScan.promise;
    const promise = hass
      .callWS({ type: "lovelace/dashboards/list" })
      .then(function (list) {
        const paths = [null].concat(
          (Array.isArray(list) ? list : []).map(function (d) {
            return d.url_path;
          })
        );
        return Promise.all(
          paths.map(function (path) {
            return hass.callWS({ type: "lovelace/config", url_path: path }).then(
              function (config) {
                return listToObject(isObject(config) ? config[LEGACY_KEY] : null);
              },
              function () {
                return {};
              }
            );
          })
        );
      })
      .then(function (perDashboard) {
        const templates = {};
        let dashboards = 0;
        perDashboard.forEach(function (found) {
          const names = Object.keys(found);
          if (names.length) dashboards++;
          names.forEach(function (name) {
            if (!hasVar(templates, name) && normalizeTemplate(found[name])) templates[name] = found[name];
          });
        });
        return { templates: templates, dashboards: dashboards };
      });
    declutteringScan = { at: Date.now(), promise: promise };
    promise.catch(function () {
      declutteringScan = null;
    });
    return promise;
  }

  // Templates decluttering-card pas encore copiés : absents de la bibliothèque, ou
  // présents sous un autre contenu (copiés alors avec un suffixe).
  function pendingDecluttering(scan, shared) {
    const pending = {};
    Object.keys(scan.templates).forEach(function (name) {
      const raw = scan.templates[name];
      if (hasVar(shared, name) && JSON.stringify(shared[name]) === JSON.stringify(raw)) return;
      if (hasVar(shared, name + DECLUTTERING_SUFFIX) && JSON.stringify(shared[name + DECLUTTERING_SUFFIX]) === JSON.stringify(raw)) return;
      pending[name] = raw;
    });
    return pending;
  }

  function readPrefs(hass) {
    return hass.callWS({ type: "frontend/get_user_data", key: PREFS_KEY }).then(
      function (result) {
        return isObject(result && result.value) ? result.value : {};
      },
      function () {
        return {};
      }
    );
  }

  function writePrefs(hass, prefs) {
    return hass.callWS({ type: "frontend/set_user_data", key: PREFS_KEY, value: prefs });
  }

  // Compte, en un passage sur tous les dashboards, les cartes Declutter Plus par template.
  function countAllTemplateUsages(hass) {
    const types = ["custom:" + CARD_TAG, "custom:" + ELEMENT_TAG, "custom:" + ROW_TAG];
    const collect = function (config) {
      const found = {};
      const stack = [config];
      let guard = 0;
      while (stack.length && guard < DOM_GUARD) {
        guard++;
        const node = stack.pop();
        if (node === null || typeof node !== "object") continue;
        if (types.indexOf(node.type) !== -1 && typeof node.template === "string" && node.template) {
          found[node.template] = (found[node.template] || 0) + 1;
        }
        Object.keys(node).forEach(function (k) {
          stack.push(node[k]);
        });
      }
      return found;
    };
    return hass
      .callWS({ type: "lovelace/dashboards/list" })
      .then(function (list) {
        const paths = [null].concat(
          (Array.isArray(list) ? list : [])
            .filter(function (d) {
              return d.url_path !== SHARED_DASHBOARD;
            })
            .map(function (d) {
              return d.url_path;
            })
        );
        return Promise.all(
          paths.map(function (path) {
            return hass.callWS({ type: "lovelace/config", url_path: path }).then(collect, function () {
              return {};
            });
          })
        );
      })
      .then(function (perDashboard) {
        const usage = {};
        perDashboard.forEach(function (found) {
          Object.keys(found).forEach(function (name) {
            usage[name] = usage[name] || { cards: 0, dashboards: 0 };
            usage[name].cards += found[name];
            usage[name].dashboards += 1;
          });
        });
        return usage;
      });
  }

  function countTemplateUsages(hass, name) {
    return countAllTemplateUsages(hass).then(function (usage) {
      return usage[name] || { cards: 0, dashboards: 0 };
    });
  }

  function uniqueName(base, taken) {
    base = String(base || "template").replace(/^custom:/, "").replace(/[^A-Za-z0-9_-]/g, "_") || "template";
    let name = base;
    let i = 2;
    while (hasVar(taken, name)) name = base + "_" + i++;
    return name;
  }

  // ---------------------------------------------------------------------------
  // Brouillon de template : carte concrète + variables liées à des chemins

  function guessField(value, previous, label) {
    const field = isObject(previous) ? clone(previous) : {};
    if (!isObject(field.selector)) {
      if (typeof value === "boolean") field.selector = { boolean: {} };
      else if (typeof value === "number") field.selector = { number: { mode: "box" } };
      else if (typeof value === "string" && ENTITY_RE.test(value)) field.selector = { entity: { domain: value.split(".")[0] } };
      else if (typeof value === "string" && /^mdi:/.test(value)) field.selector = { icon: {} };
      else field.selector = { text: {} };
    }
    if (label) field.label = label;
    return field;
  }

  function suggestVarName(path, taken) {
    let base = String(path[path.length - 1]).replace(/[^A-Za-z0-9_-]/g, "_");
    if (/^\d+$/.test(base)) base = String(path[path.length - 2] || "value") + "_" + base;
    let name = base;
    let i = 2;
    while (taken.indexOf(name) !== -1) name = base + "_" + i++;
    return name;
  }

  // Template -> brouillon : chaque « [[x]] » exact reprend sa valeur par défaut
  // (ou celle de la carte) pour que l'éditeur natif reçoive de vraies valeurs.
  function draftFromTemplate(name, found, given) {
    const tpl = normalizeTemplate(found.raw);
    const values = listToObject(given);
    const card = clone(tpl.config);
    const vars = [];
    const extra = clone(tpl.defaults);
    leafPaths(card).forEach(function (leaf) {
      if (typeof leaf.value !== "string") return;
      const m = leaf.value.match(EXACT_VAR_RE);
      if (!m) return;
      const hasDefault = hasVar(tpl.defaults, m[1]);
      const value = hasDefault ? tpl.defaults[m[1]] : values[m[1]];
      if (value === undefined || value === null || typeof value === "object") return;
      if (typeof value === "string" && value.indexOf("[[") !== -1) return;
      setPath(card, leaf.path, value);
      delete extra[m[1]];
      const field = tpl.fields[m[1]];
      vars.push({ name: m[1], path: leaf.path, label: (isObject(field) && field.label) || "", noDefault: !hasDefault });
    });
    const asGridCard = asGrid(card);
    if (asGridCard !== card) card.type = GRID_TYPE;
    return {
      originalName: name,
      originScope: found.scope,
      name: name,
      description: tpl.description,
      kind: tpl.kind,
      scope: found.scope === SCOPE_SHARED ? SCOPE_SHARED : SCOPE_LOCAL,
      card: card,
      vars: vars,
      extraDefaults: extra,
      fields: clone(tpl.fields),
      grid_options: clone(tpl.grid_options)
    };
  }

  function draftFromCard(card, name, scope) {
    const gridOptions = isObject(card.grid_options) ? clone(card.grid_options) : null;
    const config = cleanCard(card);
    delete config.grid_options;
    delete config.visibility;
    // aucune variable par défaut : on en crée avec « Rendre un réglage variable »
    const vars = [];
    return {
      originalName: null,
      originScope: null,
      name: name,
      description: "",
      kind: "card",
      scope: scope,
      card: config,
      vars: vars,
      extraDefaults: {},
      fields: {},
      grid_options: gridOptions
    };
  }

  // Brouillon -> format stocké (compatible decluttering-card).
  function draftToRaw(ed) {
    const config = clone(ed.card);
    const defaults = Object.assign({}, ed.extraDefaults);
    const fields = {};
    const oldFields = isObject(ed.fields) ? ed.fields : {};
    const liveVars = ed.vars.filter(function (v) {
      return getPath(ed.card, v.path) !== undefined;
    });
    liveVars.forEach(function (v) {
      setPath(config, v.path, "[[" + v.name + "]]");
    });
    const used = collectVars(config);
    Object.keys(oldFields).forEach(function (k) {
      if (used.has(k) || hasVar(defaults, k)) fields[k] = oldFields[k];
    });
    liveVars.forEach(function (v) {
      const value = getPath(ed.card, v.path);
      if (!hasVar(defaults, v.name) && !v.noDefault) defaults[v.name] = value;
      fields[v.name] = guessField(value, oldFields[v.name], v.label);
    });
    const raw = {};
    if (ed.description) raw.description = ed.description;
    if (Object.keys(defaults).length) raw.default = defaults;
    if (Object.keys(fields).length) raw.fields = fields;
    if (isObject(ed.grid_options)) raw.grid_options = ed.grid_options;
    raw[ed.kind] = config;
    return raw;
  }

  // Un template à plusieurs cartes est stocké en grille Declutter Plus (12 colonnes,
  // comme une section) ; les anciens vertical-stack restent lus comme des listes.
  // Un vertical-stack dont une carte a une largeur réglée s'affiche en grille :
  // l'utilisateur veut des cartes côte à côte (templates créés en 1.3.0).
  function asGrid(config) {
    if (isObject(config) && config.type === "vertical-stack" && Array.isArray(config.cards)) {
      const sized = config.cards.some(function (card) {
        return isObject(card) && isObject(card.grid_options) && card.grid_options.columns !== undefined;
      });
      if (sized) return Object.assign({}, config, { type: GRID_TYPE });
    }
    return config;
  }

  function isStack(card) {
    return isObject(card) && (card.type === GRID_TYPE || card.type === "vertical-stack") && Array.isArray(card.cards);
  }

  // grid_options est gardé : il fixe la largeur de la carte dans la grille.
  function cleanCard(card) {
    const out = clone(card);
    if (isObject(out)) {
      delete out.view_layout;
      delete out.layout_options;
    }
    return out;
  }

  function draftCards(ed) {
    return isStack(ed.card) ? ed.card.cards : [ed.card];
  }

  function ensureStack(ed) {
    if (isStack(ed.card)) {
      ed.card.type = GRID_TYPE;
      return;
    }
    ed.card = { type: GRID_TYPE, cards: [ed.card] };
    ed.vars.forEach(function (v) {
      v.path = ["cards", 0].concat(v.path);
    });
  }

  // Décale les variables des cartes à partir de « from » (delta = +1 / -1).
  function shiftVars(ed, from, delta) {
    ed.vars.forEach(function (v) {
      if (v.path[0] === "cards" && Number(v.path[1]) >= from) {
        v.path = ["cards", Number(v.path[1]) + delta].concat(v.path.slice(2));
      }
    });
  }

  function insertDraftCard(ed, index, card) {
    ensureStack(ed);
    shiftVars(ed, index, 1);
    ed.card.cards.splice(index, 0, cleanCard(card));
  }

  function replaceDraftCard(ed, index, card) {
    if (isStack(ed.card)) {
      // les anciens vertical-stack passent en grille : la largeur des cartes s'applique
      ed.card.type = GRID_TYPE;
      ed.card.cards[index] = cleanCard(card);
    } else {
      // carte unique : sa taille est celle du template
      ed.card = cleanCard(card);
      if (isObject(ed.card.grid_options)) ed.grid_options = ed.card.grid_options;
      delete ed.card.grid_options;
    }
    ed.vars = ed.vars.filter(function (v) {
      return getPath(ed.card, v.path) !== undefined;
    });
  }

  // Retire une carte ; false si c'était la dernière.
  function removeDraftCard(ed, index) {
    if (!isStack(ed.card) || ed.card.cards.length <= 1) return false;
    ed.card.type = GRID_TYPE;
    ed.vars = ed.vars.filter(function (v) {
      return !(v.path[0] === "cards" && Number(v.path[1]) === index);
    });
    ed.card.cards.splice(index, 1);
    shiftVars(ed, index + 1, -1);
    if (ed.card.cards.length === 1) {
      ed.card = ed.card.cards[0];
      delete ed.card.grid_options;
      ed.vars.forEach(function (v) {
        v.path = v.path.slice(2);
      });
    }
    return true;
  }

  function resizeDraftCard(ed, index, gridOptions) {
    const card = isStack(ed.card) ? ed.card.cards[index] : null;
    if (!isObject(card) || !isObject(gridOptions)) return false;
    ed.card.type = GRID_TYPE;
    card.grid_options = Object.assign({}, card.grid_options, gridOptions);
    return true;
  }

  // Valeurs actuelles des variables liées (pour la carte qui vient de créer le template)
  function draftValues(ed) {
    const values = {};
    ed.vars.forEach(function (v) {
      const value = getPath(ed.card, v.path);
      if (value !== undefined) values[v.name] = value;
    });
    return values;
  }

  // ---------------------------------------------------------------------------
  // Grille à 12 colonnes (comme une section de HA)

  const GRID_STYLE =
    ".dp-grid{display:grid;grid-template-columns:repeat(" + GRID_COLUMNS + ",minmax(0,1fr));" +
    "gap:var(--row-gap,8px) var(--column-gap,8px);align-items:start}" +
    ".dp-cell{position:relative;min-width:0;grid-column:span " + GRID_COLUMNS + "}" +
    ".dp-cell>*{display:block}" +
    // case masquée par sa carte (visibilité, pop-up fermée) : ne réserve pas de place
    ".dp-cell:has(>hui-card[hidden]),.dp-cell:has(>hui-card[style*='display: none']){display:none}";

  // Largeur : grid_options de la carte, sinon getGridOptions() de la carte, sinon pleine largeur.
  function gridColumns(config, el) {
    let columns = isObject(config) && isObject(config.grid_options) ? config.grid_options.columns : undefined;
    if (columns === undefined && el) {
      try {
        const options = typeof el.getGridOptions === "function" ? el.getGridOptions() : null;
        if (options) columns = options.columns;
      } catch (e) {}
    }
    if (columns === undefined || columns === null || columns === "full") return GRID_COLUMNS;
    columns = Math.round(Number(columns));
    return isFinite(columns) ? Math.max(1, Math.min(GRID_COLUMNS, columns)) : GRID_COLUMNS;
  }

  // Les cartes chargées à la demande ne connaissent leur taille qu'une fois définies.
  function layoutGrid(cells) {
    const apply = function () {
      cells.forEach(function (cell) {
        cell.el.style.gridColumn = "span " + gridColumns(cell.config, cell.card);
      });
    };
    apply();
    GRID_REFRESH_MS.forEach(function (ms) {
      setTimeout(apply, ms);
    });
  }

  class DeclutterPlusGrid extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._preview = false;
      this._cards = [];
      this.attachShadow({ mode: "open" });
    }

    set preview(v) {
      this._preview = !!v;
      this._cards.forEach(function (card) {
        if (card.localName === "hui-card") card.preview = !!v;
      });
    }

    get preview() {
      return this._preview;
    }

    setConfig(config) {
      if (!isObject(config) || !Array.isArray(config.cards)) throw new Error("'cards' must be a list of cards");
      this._config = config;
      loadHelpers().then(this._build.bind(this), function (e) {
        console.error("[declutter-plus] grid init failed", e);
      });
    }

    set hass(hass) {
      this._hass = hass;
      this._cards.forEach(function (card) {
        card.hass = hass;
      });
    }

    _build() {
      const root = this.shadowRoot;
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = GRID_STYLE;
      root.appendChild(style);
      const grid = document.createElement("div");
      grid.className = "dp-grid";
      const cells = [];
      this._cards = [];
      this._config.cards.forEach((config, index) => {
        const cell = document.createElement("div");
        cell.className = "dp-cell";
        const card = createHuiCard(config, this._hass, this._preview);
        card.addEventListener("ll-rebuild", (ev) => {
          if (card.localName === "hui-card") return;
          ev.stopPropagation();
          const fresh = helpers.createCardElement(config);
          if (this._hass) fresh.hass = this._hass;
          cell.replaceChild(fresh, cell.firstChild);
          this._cards[index] = fresh;
          cells[index].card = fresh;
          layoutGrid([cells[index]]);
        });
        if (this._hass) card.hass = this._hass;
        cell.appendChild(card);
        grid.appendChild(cell);
        this._cards.push(card);
        cells.push({ el: cell, config: config, card: card });
      });
      root.appendChild(grid);
      layoutGrid(cells);
    }

    getCardSize() {
      return Promise.all(
        this._cards.map(function (card) {
          return typeof card.getCardSize === "function" ? card.getCardSize() : 1;
        })
      ).then(function (sizes) {
        return sizes.reduce(function (a, b) {
          return a + b;
        }, 0);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Canal aperçu -> éditeur

  const previewBus = { editors: [] };

  function previewAction(action, payload) {
    const editors = previewBus.editors;
    const editor = editors.length ? editors[editors.length - 1] : null;
    if (editor) editor._previewAction(action, payload);
    else showToast(tSub(resolveLang(null), "dialogUnavailable", { reason: "no Declutter Plus editor" }));
  }

  // ---------------------------------------------------------------------------
  // Carte / élément / ligne

  const BASE_STYLE =
    ":host{display:block}" +
    ".dp-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;margin-top:8px;" +
    "min-height:56px;padding:12px;border:2px dashed var(--divider-color,#8886);border-radius:var(--ha-card-border-radius,12px);" +
    "background:transparent;color:var(--primary-text-color);font:inherit;font-size:14px;cursor:pointer;opacity:.8}" +
    ".dp-add:hover{opacity:1;border-color:var(--primary-color);color:var(--primary-color)}" +
    ".dp-add.dp-import{min-height:40px;margin-top:6px;font-size:13px;border-width:1px}" +
    ".dp-add ha-svg-icon{--mdc-icon-size:20px}" +
    ".dp-tools{position:absolute;top:6px;right:6px;display:flex;gap:4px;z-index:2}" +
    ".dp-tools button{border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;" +
    "background:var(--primary-color);color:var(--text-primary-color,#fff);font-size:15px}" +
    ".dp-frame{position:relative;display:block}" +
    ".dp-one>.dp-cell,.dp-stack>.dp-cell{position:relative;display:block}" +
    ".dp-stack{display:flex;flex-direction:column;gap:var(--vertical-stack-card-gap,var(--stack-card-gap,8px))}" +
    GRID_STYLE +
    ".dp-error{padding:12px 16px;color:var(--error-color,#db4437);" +
    "background:var(--ha-card-background,var(--card-background-color,#fff));border-radius:var(--ha-card-border-radius,12px);" +
    "border:1px solid var(--error-color,#db4437);font-size:14px}";

  const MDI_PLUS = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";

  class DeclutterPlusBase extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._child = null;
      this._children = [];
      this._frame = null;
      this._frames = [];
      this._rendered = null;
      this._signature = null;
      this._editMode = false;
      this._preview = false;
      this._inEditor = false;
      this._deferred = false;
      this._onLibrary = this._build.bind(this);
      this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = BASE_STYLE;
      this.shadowRoot.appendChild(style);
    }

    static get kind() {
      return "card";
    }

    setConfig(config) {
      validateConfig(config);
      this._config = config;
      this._signature = null;
      this._build();
    }

    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      if (first) installDeleteGuard(hass);
      this._children.forEach(function (child) {
        child.hass = hass;
      });
      this._frames.forEach(function (frame) {
        if (frame.localName === "hui-card-edit-mode") frame.hass = hass;
      });
      if (first) this._build();
    }

    get hass() {
      return this._hass;
    }

    set editMode(v) {
      this._editMode = v;
      this._children.forEach(function (child) {
        child.editMode = v;
      });
    }

    get editMode() {
      return this._editMode;
    }

    set preview(v) {
      if (this._preview === !!v) return;
      this._preview = !!v;
      this._signature = null;
      this._build();
    }

    get preview() {
      return this._preview;
    }

    connectedCallback() {
      this._entry().listeners.add(this._onLibrary);
      liveCards.add(this);
      const inEditor = this._detectEditor();
      if (inEditor !== this._inEditor) {
        this._inEditor = inEditor;
        this._signature = null;
      }
      this._build();
    }

    disconnectedCallback() {
      this._entry().listeners.delete(this._onLibrary);
      liveCards.delete(this);
    }

    _entry() {
      return libraryEntry((this._config && this._config.library) || SHARED_DASHBOARD);
    }

    _editable() {
      return this._preview && this.constructor.kind === "card" && this._inEditor;
    }

    _detectEditor() {
      let el = this.parentNode || null;
      let guard = 0;
      while (el && guard < 200) {
        guard++;
        const tag = el.localName;
        // l'aperçu de la popup peut être dans une hui-section : remonter jusqu'au bout
        if (tag === "hui-dialog-edit-card" || tag === "hui-card-preview" || tag === "hui-card-element-editor") return true;
        if (tag === "hui-root") return false;
        el = el.parentNode || el.host;
      }
      return false;
    }

    _build() {
      if (!this._config) return;
      if (this.isConnected) {
        const inEditor = this._detectEditor();
        if (inEditor !== this._inEditor) {
          this._inEditor = inEditor;
          this._signature = null;
        }
      }
      const entry = this._entry();
      if (!helpers || !entry.loaded) {
        // Création asynchrone : on redemandera une reconstruction au parent pour
        // qu'il relise getGridOptions (vue sections).
        this._deferred = true;
        if (this._hass) {
          Promise.all([loadHelpers(), loadLibrary(this._hass, entry.path)])
            .then(this._build.bind(this))
            .catch(function (e) {
              console.error("[declutter-plus] init failed", e);
            });
        }
        return;
      }
      const lang = resolveLang(this._hass);
      const name = this._config.template;

      if (!name && this._config.paste && this.constructor.kind === "card") {
        this._show({ config: this._config.paste, grid_options: null }, lang, "paste");
        return;
      }
      if (!name) {
        this._clear();
        this._syncAddButton(lang, "add");
        return;
      }
      const lovelace = findLovelace(this);
      const found = allTemplates(entry, lovelace && lovelace.config)[name];
      const tpl = found && normalizeTemplate(found.raw);
      if (!tpl) {
        this._showError(tSub(lang, "templateNotFound", { name: name }));
        this._syncAddButton(lang, "add");
        return;
      }
      if (tpl.kind !== this.constructor.kind) {
        this._showError(tSub(lang, "kindMismatch", { name: name, kind: tpl.kind }));
        return;
      }
      const rendered = renderTemplate(tpl, listToObject(this._config.variables));
      if (tpl.kind === "card") rendered.config = asGrid(rendered.config);
      this._show(rendered, lang, tpl.kind === "card" ? "add" : null);
      if (this._deferred && this.isConnected && tpl.kind === "card" && !this._inEditor) fireEvent(this, "ll-rebuild", {});
      this._deferred = false;
    }

    _createChild(kind, config) {
      if (kind === "card" && !this._editable() && !isStack(config) && config.type !== GRID_TYPE) {
        return createHuiCard(config, this._hass, this._preview);
      }
      return createChild(kind, config);
    }

    _show(rendered, lang, button) {
      const signature = JSON.stringify([rendered, this._editable()]);
      if (signature !== this._signature || !this._child) {
        this._signature = signature;
        this._rendered = rendered;
        try {
          // aperçu : chaque carte d'un template multi-cartes a sa propre barre d'édition
          const list = this._editable() && isStack(rendered.config);
          const cards = list ? rendered.config.cards : [rendered.config];
          this._mount(
            cards.map((config) =>
              this._editable() && isBubblePopup(config) ? createPopupPlaceholder(config, lang) : this._createChild(this.constructor.kind, config)
            ),
            list ? rendered.config.type : null,
            cards
          );
        } catch (e) {
          this._showError(tSub(lang, "error", { message: e.message }));
        }
      }
      this._syncAddButton(lang, button);
    }

    // Bouton pointillé sous l'aperçu (éditeur uniquement), comme Bubble Card
    _syncAddButton(lang, mode) {
      let btn = this.shadowRoot.querySelector(".dp-add:not(.dp-import)");
      let importBtn = this.shadowRoot.querySelector(".dp-import");
      if (!this._editable() || !mode) {
        if (btn) btn.remove();
        if (importBtn) importBtn.remove();
        return;
      }
      if (mode === "add") {
        if (!importBtn) {
          importBtn = document.createElement("button");
          importBtn.type = "button";
          importBtn.className = "dp-add dp-import";
          importBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            previewAction("importSection", { config: this._config });
          });
          this.shadowRoot.appendChild(importBtn);
        }
        importBtn.textContent = t(lang, "importSection");
      } else if (importBtn) {
        importBtn.remove();
      }
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dp-add";
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          previewAction(btn.dataset.mode, { config: this._config });
        });
        this.shadowRoot.insertBefore(btn, importBtn || null);
      }
      btn.dataset.mode = mode;
      btn.innerHTML = "";
      if (mode === "add" && customElements.get("ha-svg-icon")) {
        const icon = document.createElement("ha-svg-icon");
        icon.path = MDI_PLUS;
        btn.appendChild(icon);
      }
      const text = document.createElement("span");
      text.textContent =
        mode === "add" ? haLabel(this._hass, "ui.panel.lovelace.editor.section.add_card", lang, "addCard") : t(lang, "saveAsTemplate");
      btn.appendChild(text);
    }

    // Dans l'aperçu, la carte est entourée de la barre d'édition native de HA.
    _wrap(child, index) {
      if (!this._editable()) return child;
      const self = this;
      let frame;
      if (customElements.get("hui-card-edit-mode")) {
        frame = document.createElement("hui-card-edit-mode");
        frame.hass = this._hass;
        frame.lovelace = {
          editMode: true,
          saveConfig: function () {
            return Promise.resolve();
          }
        };
        frame.path = [0, 0, index];
        frame.hiddenOverlay = false;
      } else {
        frame = document.createElement("div");
        frame.className = "dp-frame";
        const tools = document.createElement("div");
        tools.className = "dp-tools";
        [
          ["edit", "✎"],
          ["delete", "✕"]
        ].forEach(function (item) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = item[1];
          b.addEventListener("click", function (ev) {
            ev.stopPropagation();
            previewAction(item[0], { config: self._config, index: index });
          });
          tools.appendChild(b);
        });
        frame.appendChild(tools);
      }
      const map = {
        "ll-edit-card": "edit",
        "ll-delete-card": "delete",
        "ll-duplicate-card": "duplicate",
        "ll-copy-card": "copy",
        "ll-cut-card": null,
        "ll-move-card": null,
        "ll-move-to-section": null,
        "ll-change-grid-options": "resize"
      };
      Object.keys(map).forEach(function (type) {
        frame.addEventListener(type, function (ev) {
          ev.stopPropagation();
          const detail = ev.detail || {};
          if (map[type]) previewAction(map[type], { config: self._config, index: index, gridOptions: detail.gridOptions });
        });
      });
      frame.appendChild(child);
      return frame;
    }

    _mount(children, listType, configs) {
      const self = this;
      const signature = this._signature;
      this._clear();
      this._signature = signature;
      this._children = children;
      this._child = children[0] || null;
      this._frames = [];
      children.forEach(function (child, index) {
        child.addEventListener("ll-rebuild", function (ev) {
          ev.stopPropagation();
          if (self._children.indexOf(child) === -1) return;
          self._signature = null;
          self._build();
        });
        if (self._hass) child.hass = self._hass;
        child.editMode = self._editMode;
        child.preview = self._preview;
        self._frames.push(self._wrap(child, index));
      });
      let frame = this._frames[0];
      if (this._editable()) {
        // une cellule positionnée par carte (le calque d'édition de HA s'y cale)
        frame = document.createElement("div");
        frame.className = listType === "vertical-stack" ? "dp-stack" : listType ? "dp-grid" : "dp-one";
        const cells = this._frames.map(function (f, i) {
          const cell = document.createElement("div");
          cell.className = "dp-cell";
          cell.appendChild(f);
          frame.appendChild(cell);
          return { el: cell, config: configs[i], card: children[i] };
        });
        if (listType && listType !== "vertical-stack") layoutGrid(cells);
      }
      this._frame = frame;
      this.shadowRoot.insertBefore(frame, this.shadowRoot.querySelector(".dp-add"));
    }

    _clear() {
      if (this._frame && this._frame.parentNode) this._frame.parentNode.removeChild(this._frame);
      const err = this.shadowRoot.querySelector(".dp-error");
      if (err) err.remove();
      this._frame = null;
      this._frames = [];
      this._child = null;
      this._children = [];
      this._signature = null;
    }

    _showError(message) {
      this._clear();
      const err = document.createElement("div");
      err.className = "dp-error";
      err.textContent = message;
      this.shadowRoot.insertBefore(err, this.shadowRoot.querySelector(".dp-add"));
    }

    getCardSize() {
      if (this._child && typeof this._child.getCardSize === "function") return this._child.getCardSize();
      return 1;
    }

    getGridOptions() {
      const own = this._rendered && this._rendered.grid_options;
      let inner;
      try {
        if (this._child && typeof this._child.getGridOptions === "function") inner = this._child.getGridOptions();
      } catch (e) {}
      if (!own && !inner) return undefined;
      return Object.assign({}, inner || {}, own || {});
    }

    getLayoutOptions() {
      try {
        if (this._child && typeof this._child.getLayoutOptions === "function") return this._child.getLayoutOptions();
      } catch (e) {}
      return undefined;
    }
  }

  class DeclutterPlusCard extends DeclutterPlusBase {
    static get kind() {
      return "card";
    }

    static getConfigElement() {
      return document.createElement(EDITOR_TAG);
    }

    static getStubConfig() {
      return { template: "" };
    }
  }

  // Entrée « coller la carte copiée » du sélecteur : produit une declutter-plus-card.
  class DeclutterPlusPasteCard extends DeclutterPlusCard {
    static getStubConfig() {
      const stub = { type: "custom:" + CARD_TAG };
      const copied = readHaClipboard();
      if (copied) stub.paste = copied;
      else stub.template = "";
      return stub;
    }
  }

  class DeclutterPlusElement extends DeclutterPlusBase {
    static get kind() {
      return "element";
    }

    _createChild(kind, config) {
      // picture-elements positionne l'hôte : on lui transfère le style du template
      const inner = Object.assign({}, config);
      if (isObject(inner.style)) {
        const host = this;
        Object.keys(inner.style).forEach(function (prop) {
          host.style.setProperty(prop, inner.style[prop]);
        });
        delete inner.style;
      }
      return createChild(kind, inner);
    }
  }

  class DeclutterPlusRow extends DeclutterPlusBase {
    static get kind() {
      return "row";
    }
  }

  // ---------------------------------------------------------------------------
  // Éditeur (panneau de gauche : réglages de la carte uniquement)

  const EDITOR_STYLE = `
    :host { display:block; }
    .notice { padding:10px 12px; border-radius:8px; background:var(--secondary-background-color); font-size:13px; margin-bottom:12px; }
    .notice.err { color:var(--error-color); }
    .notice.ok { color:var(--success-color, #43a047); }
    .help { font-size:13px; color:var(--secondary-text-color); margin:4px 0 8px; line-height:1.45; }
    input.text, select.text { box-sizing:border-box; width:100%; font:inherit; padding:9px 10px; border-radius:8px;
      border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); }
    label.lbl { display:block; font-size:12px; color:var(--secondary-text-color); margin:12px 0 4px; }
    .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:0 12px; }
    @media (max-width:600px) { .grid2 { grid-template-columns:1fr; } }
    .link { border:none; background:none; color:var(--primary-color); font:inherit; font-size:13px; cursor:pointer; padding:4px 0; }
    .links { display:flex; flex-wrap:wrap; gap:4px 18px; margin-top:12px; }
    .back { margin-bottom:8px; }
    h2 { font-size:20px; font-weight:500; margin:4px 0 8px; }
    h3 { font-size:16px; font-weight:500; margin:4px 0 8px; }
    h4 { font-size:14px; font-weight:500; margin:18px 0 4px; }
    ul.points { margin:8px 0 14px; padding-left:20px; font-size:13px; line-height:1.5; color:var(--primary-text-color); }
    .choices { display:grid; gap:10px; margin:14px 0 6px; }
    button.choice { display:block; width:100%; text-align:left; font:inherit; padding:14px 16px; border-radius:12px; cursor:pointer;
      border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); }
    button.choice strong { display:block; font-size:15px; font-weight:500; }
    button.choice span { display:block; font-size:12px; color:var(--secondary-text-color); margin-top:2px; }
    button.choice.primary { border-color:var(--primary-color); box-shadow:inset 0 0 0 1px var(--primary-color); }
    button.choice:disabled { opacity:.5; cursor:default; }
    button.action { font:inherit; font-size:14px; padding:9px 18px; border-radius:20px; cursor:pointer; border:1px solid var(--divider-color);
      background:transparent; color:var(--primary-text-color); }
    button.action.primary { background:var(--primary-color); border-color:var(--primary-color); color:var(--text-primary-color,#fff); }
    .actions { display:flex; gap:10px; justify-content:flex-end; margin-top:16px; }
    .box { border:1px solid var(--divider-color); border-radius:12px; padding:10px 14px; margin-top:14px; }
    .box .help { margin:0; }
    .gallery { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; margin-top:8px;
      max-height:420px; overflow:auto; padding:2px; }
    .tile { border:2px solid var(--divider-color); border-radius:12px; overflow:hidden; cursor:pointer;
      background:var(--primary-background-color); display:flex; flex-direction:column; }
    .tile.sel { border-color:var(--primary-color); box-shadow:0 0 0 2px var(--primary-color); }
    .thumb { height:120px; overflow:hidden; pointer-events:none; }
    .thumb .scale { zoom:.55; width:182%; padding:6px; box-sizing:border-box; }
    .thumb .none { display:flex; align-items:center; justify-content:center; height:100%; font-size:12px;
      color:var(--secondary-text-color); padding:8px; text-align:center; }
    .meta { padding:6px 8px; border-top:1px solid var(--divider-color); background:var(--card-background-color); }
    .name { font-weight:500; font-size:13px; word-break:break-all; }
    .badge { display:inline-block; font-size:10px; padding:1px 6px; border-radius:8px; margin-left:6px; vertical-align:middle;
      background:var(--secondary-background-color); color:var(--secondary-text-color); }
    .badge.shared { background:var(--primary-color); color:var(--text-primary-color,#fff); }
    .current { display:flex; align-items:center; flex-wrap:wrap; gap:4px; font-size:15px; font-weight:500; }
    .tpl-row { border:1px solid var(--divider-color); border-radius:12px; padding:10px 14px; margin-top:8px; }
    .tpl-row.open { border-color:var(--primary-color); }
    .tpl-head { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .tpl-head .grow { flex:1; min-width:140px; }
    .tpl-sub { font-size:12px; color:var(--secondary-text-color); }
    .tpl-actions { display:flex; gap:14px; }
    .link.danger { color:var(--error-color); }
    .offer { margin:0 0 14px; border-color:var(--primary-color); }
    .offer-title { font-weight:500; margin-bottom:4px; }
    .offer .actions { margin-top:10px; }
    label.check { display:flex; align-items:center; gap:6px; font-size:13px; margin-top:8px; cursor:pointer; }
    .version { font-size:11px; color:var(--secondary-text-color); text-align:right; opacity:.7; margin-top:10px; }
    .chips { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0; }
    .chip { display:inline-flex; align-items:center; gap:4px; font-size:12px; padding:3px 4px 3px 10px; border-radius:14px;
      background:var(--secondary-background-color); }
    .chip code { font-size:11px; color:var(--secondary-text-color); }
    .chip button { border:none; background:none; color:var(--secondary-text-color); cursor:pointer; font-size:14px; padding:0 4px; }
  `;

  const VIEW_HOME = "home";
  const VIEW_CREATE = "create";
  const VIEW_PICK = "pick";
  const VIEW_MANAGE = "manage";
  const VIEW_CARD = "card";

  class DeclutterPlusCardEditor extends HTMLElement {
    constructor() {
      super();
      this._config = {};
      this._hass = null;
      this.lovelace = null; // LovelaceConfig transmise par HA
      this._search = "";
      this._message = null;
      this._previews = [];
      this._built = false;
      this._lastLang = null;
      this._busy = false;
      this._thumbs = new Map();
      this._previewsAt = 0;
      this._librarySignature = null;
      this._backup = undefined;
      this._view = null; // écran choisi ; null = déduit de la config
      this._draftCreate = null; // saisie de l'écran de création
      this._manageOpen = null; // template déplié dans l'écran de gestion
      this._usage = null; // utilisations par template (écran de gestion)
      this._decl = null; // templates decluttering-card à proposer, pour cette ouverture
      this._declHidden = false;
      // ne redessiner que si les templates ont vraiment changé
      this._onLibrary = (entry) => {
        const signature = JSON.stringify([entry.error ? 1 : 0, entry.legacy, entry.templates]);
        if (signature === this._librarySignature) return;
        this._librarySignature = signature;
        this._render();
      };
      this.attachShadow({ mode: "open" });
    }

    setConfig(config) {
      const templateChanged = !this._built || this._config.template !== config.template || !!this._config.paste !== !!config.paste;
      this._config = Object.assign({}, config);
      if (templateChanged) {
        if (this._view !== VIEW_MANAGE) this._view = null;
        this._render();
      } else {
        this._updateVariablesForm();
      }
    }

    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      if (first) {
        installDeleteGuard(hass);
        this._checkDecluttering(hass);
        loadHelpers().then(this._render.bind(this), function () {});
        loadLibrary(hass, this._path(), true).then(this._onLibrary);
      } else if (resolveLang(hass) !== this._lastLang) {
        this._render();
        return;
      }
      // miniatures : rafraîchies au plus une fois par minute (cartes lourdes)
      const now = Date.now();
      if (now - this._previewsAt > PREVIEW_REFRESH_MS) {
        this._previewsAt = now;
        this._previews.forEach(function (p) {
          p.hass = hass;
        });
      }
      const form = this.shadowRoot.querySelector("ha-form");
      if (form) form.hass = hass;
    }

    connectedCallback() {
      this._entry().listeners.add(this._onLibrary);
      previewBus.editors.push(this);
    }

    disconnectedCallback() {
      this._entry().listeners.delete(this._onLibrary);
      const i = previewBus.editors.indexOf(this);
      if (i !== -1) previewBus.editors.splice(i, 1);
    }

    _path() {
      return this._config.library || SHARED_DASHBOARD;
    }

    _entry() {
      return libraryEntry(this._path());
    }

    _lovelaceObj() {
      return findLovelace(this);
    }

    _dashConfig() {
      const ll = this._lovelaceObj();
      if (ll) return ll.config;
      if (isObject(this.lovelace) && Array.isArray(this.lovelace.views)) return this.lovelace;
      return null;
    }

    _lang() {
      return resolveLang(this._hass);
    }

    _templates() {
      return allTemplates(this._entry(), this._dashConfig());
    }

    _templateByName(name) {
      const found = name ? this._templates()[name] : null;
      return found && normalizeTemplate(found.raw) ? { name: name, found: found } : null;
    }

    _current() {
      return this._templateByName(this._config.template);
    }

    _changed(config) {
      this._config = config;
      fireEvent(this, "config-changed", { config: config });
    }

    _el(tag, attrs, children) {
      const el = document.createElement(tag);
      if (attrs) {
        Object.keys(attrs).forEach(function (k) {
          if (k === "text") el.textContent = attrs[k];
          else if (k === "class") el.className = attrs[k];
          else el.setAttribute(k, attrs[k]);
        });
      }
      (children || []).forEach(function (c) {
        if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
      return el;
    }

    _link(text, onClick, cls) {
      const link = this._el("button", { class: "link" + (cls ? " " + cls : ""), type: "button", text: text });
      link.addEventListener("click", onClick);
      return link;
    }

    _scopeLabel(lang, scope) {
      return t(lang, scope === SCOPE_SHARED ? "scopeShared" : scope === SCOPE_LEGACY ? "scopeLegacy" : "scopeLocal");
    }

    _badge(lang, scope) {
      return this._el("span", { class: "badge" + (scope === SCOPE_SHARED ? " shared" : ""), text: this._scopeLabel(lang, scope) });
    }

    _notify(text, type) {
      this._message = text ? { text: text, type: type } : null;
      this._render();
    }

    _go(view) {
      this._view = view;
      this._message = null;
      if (view === VIEW_MANAGE) this._usage = null;
      this._render();
    }

    _currentView() {
      if (this._view) return this._view;
      if (this._config.template) return VIEW_CARD;
      if (this._config.paste) return VIEW_CREATE;
      return VIEW_HOME;
    }

    _render() {
      if (!this._hass) return;
      const lang = this._lang();
      this._lastLang = lang;
      this._built = true;
      const root = this.shadowRoot;
      root.innerHTML = "";
      this._previews = [];
      root.appendChild(this._el("style", { text: EDITOR_STYLE }));
      if (this._message) {
        root.appendChild(this._el("div", { class: "notice " + (this._message.type || ""), text: this._message.text }));
      }
      this._renderDeclutteringOffer(root, lang);
      const view = this._currentView();
      if (view === VIEW_CARD) root.appendChild(this._renderCard(lang));
      else if (view === VIEW_CREATE) root.appendChild(this._renderCreate(lang));
      else if (view === VIEW_PICK) root.appendChild(this._renderPick(lang));
      else if (view === VIEW_MANAGE) root.appendChild(this._renderManage(lang));
      else root.appendChild(this._renderHome(lang));
      // version chargée : repère simple quand le navigateur garde un ancien fichier
      root.appendChild(this._el("div", { class: "version", text: "Declutter Plus v" + VERSION }));
    }

    _backLink(lang) {
      const back = this._link("← " + t(lang, "back"), () => this._go(null));
      back.classList.add("back");
      return back;
    }

    // --- Accueil (nouvelle carte)

    _renderHome(lang) {
      const box = this._el("div");
      const count = Object.keys(this._templates()).length;
      box.appendChild(this._el("h2", { text: t(lang, "homeTitle") }));
      box.appendChild(this._el("div", { class: "help", text: t(lang, "homeIntro") }));
      box.appendChild(
        this._el(
          "ul",
          { class: "points" },
          ["homePoint1", "homePoint2", "homePoint3", "homePoint4"].map((key) => this._el("li", { text: t(lang, key) }))
        )
      );
      this._renderLegacy(box, lang);
      this._renderBackup(box, lang);

      const admin = isAdmin(this._hass);
      const choices = this._el("div", { class: "choices" });
      const choice = (titleKey, textKey, onClick, primary, disabled) => {
        const button = this._el("button", { class: "choice" + (primary ? " primary" : ""), type: "button" }, [
          this._el("strong", { text: t(lang, titleKey) }),
          this._el("span", { text: textKey })
        ]);
        if (disabled) button.disabled = true;
        button.addEventListener("click", onClick);
        return button;
      };
      choices.appendChild(choice("createTemplate", t(lang, "createTemplateHint"), () => this._go(VIEW_CREATE), true, !admin));
      choices.appendChild(
        choice("useTemplate", tSub(lang, "homeCount", { count: count }), () => this._go(VIEW_PICK), false, !count)
      );
      box.appendChild(choices);
      if (!admin) box.appendChild(this._el("div", { class: "help", text: t(lang, "adminOnly") }));
      if (count && admin) {
        box.appendChild(this._el("div", { class: "links" }, [this._link(t(lang, "manageTemplates"), () => this._go(VIEW_MANAGE))]));
      }
      return box;
    }

    // --- Création d'un template

    _renderCreate(lang) {
      const box = this._el("div");
      if (!this._config.paste) box.appendChild(this._backLink(lang));
      box.appendChild(this._el("h3", { text: t(lang, "createTitle") }));
      if (this._config.paste) box.appendChild(this._el("div", { class: "notice", text: t(lang, "pasteIntoCreate") }));

      const draft = this._draftCreate || { name: "", description: "", scope: this._defaultScope() };
      this._draftCreate = draft;

      const nameInput = this._el("input", { class: "text", placeholder: t(lang, "namePlaceholder") });
      nameInput.value = draft.name;
      nameInput.addEventListener("input", function () {
        draft.name = nameInput.value.trim();
      });
      box.appendChild(this._el("label", { class: "lbl", text: t(lang, "fieldName") }));
      box.appendChild(nameInput);
      box.appendChild(this._el("div", { class: "help", text: t(lang, "nameHint") }));

      const descInput = this._el("input", { class: "text" });
      descInput.value = draft.description;
      descInput.addEventListener("input", function () {
        draft.description = descInput.value;
      });
      box.appendChild(this._el("label", { class: "lbl", text: t(lang, "fieldDescription") }));
      box.appendChild(descInput);

      box.appendChild(this._el("label", { class: "lbl", text: t(lang, "fieldScope") }));
      const scopeHelp = this._el("div", { class: "help" });
      box.appendChild(this._scopeSelect(lang, draft.scope, (scope) => {
        draft.scope = scope;
        scopeHelp.textContent = this._scopeHelp(lang, scope);
      }));
      scopeHelp.textContent = this._scopeHelp(lang, draft.scope);
      box.appendChild(scopeHelp);

      box.appendChild(
        this._el("div", { class: "box" }, [this._el("h4", { text: t(lang, "createHelpTitle") }), this._el("div", { class: "help", text: t(lang, "createHelp") })])
      );

      const actions = this._el("div", { class: "actions" });
      if (!this._config.paste) {
        const cancel = this._el("button", { class: "action", type: "button", text: haLabel(this._hass, "ui.common.cancel", lang, "cancel") });
        cancel.addEventListener("click", () => {
          this._draftCreate = null;
          this._go(null);
        });
        actions.appendChild(cancel);
      }
      const create = this._el("button", { class: "action primary", type: "button", text: t(lang, "createButton") });
      create.addEventListener("click", () => this._createTemplate(draft));
      actions.appendChild(create);
      box.appendChild(actions);
      return box;
    }

    _scopeHelp(lang, scope) {
      return t(lang, scope === SCOPE_SHARED ? "storageShared" : "storageLocal");
    }

    _scopeSelect(lang, value, onChange) {
      const select = this._el("select", { class: "text" });
      const shared = !this._entry().error;
      [SCOPE_SHARED, SCOPE_LOCAL].forEach((scope) => {
        const opt = this._el("option", { value: scope, text: this._scopeLabel(lang, scope) });
        if (scope === SCOPE_SHARED && !shared) opt.disabled = true;
        if (scope === (value === SCOPE_LEGACY ? SCOPE_LOCAL : value)) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener("change", () => onChange(select.value));
      return select;
    }

    _createTemplate(draft) {
      const lang = this._lang();
      const name = draft.name;
      if (!NAME_RE.test(name)) {
        this._notify(t(lang, "invalidName"), "err");
        return;
      }
      if (hasVar(this._templates(), name)) {
        this._notify(tSub(lang, "nameTaken", { name: name }), "err");
        return;
      }
      const paste = this._config.paste;
      const ed = {
        originalName: null,
        originScope: null,
        name: name,
        description: draft.description,
        kind: "card",
        scope: draft.scope,
        card: { type: GRID_TYPE, cards: isObject(paste) ? [cleanCard(paste)] : [] },
        vars: [],
        extraDefaults: {},
        fields: {},
        grid_options: null
      };
      this._run(this._writeDraft(ed), tSub(lang, "created", { name: name }))
        .then(() => {
          this._draftCreate = null;
          this._view = null;
          const next = Object.assign({}, this._config, { template: name });
          delete next.paste;
          delete next.variables;
          this._changed(next);
          this._render();
        })
        .catch(function () {});
    }

    // --- Choix d'un template existant

    _renderPick(lang) {
      const box = this._el("div");
      box.appendChild(this._backLink(lang));
      box.appendChild(this._el("h3", { text: t(lang, "pickTitle") }));
      box.appendChild(this._renderGallery(lang));
      return box;
    }

    // --- Carte existante : uniquement ses réglages

    _renderCard(lang) {
      const box = this._el("div");
      const current = this._current();
      if (!current) {
        box.appendChild(this._el("div", { class: "notice err", text: tSub(lang, "templateNotFound", { name: this._config.template }) }));
        box.appendChild(
          this._el("div", { class: "links" }, [
            this._link(t(lang, "changeTemplate"), () => this._go(VIEW_PICK)),
            isAdmin(this._hass) ? this._link(t(lang, "createTemplate"), () => this._go(VIEW_CREATE)) : null
          ])
        );
        return box;
      }
      const tpl = normalizeTemplate(current.found.raw);
      box.appendChild(this._el("label", { class: "lbl", text: t(lang, "templateLabel") }));
      box.appendChild(this._el("div", { class: "current" }, [current.name, this._badge(lang, current.found.scope)]));
      if (tpl.description) box.appendChild(this._el("div", { class: "help", text: tpl.description }));

      box.appendChild(this._el("h4", { text: t(lang, "panelVariables") }));
      const schema = this._variableSchema(tpl);
      if (schema.length) box.appendChild(this._variablesForm(lang, tpl, schema));
      else box.appendChild(this._el("div", { class: "help", text: t(lang, "noVariablesCard") }));

      if (tpl.kind === "card" && isAdmin(this._hass)) {
        box.appendChild(this._el("div", { class: "box" }, [this._el("div", { class: "help", text: t(lang, "editHint") })]));
      }
      box.appendChild(
        this._el("div", { class: "links" }, [
          this._link(t(lang, "changeTemplate"), () => this._go(VIEW_PICK)),
          isAdmin(this._hass) ? this._link(t(lang, "manageTemplates"), () => this._go(VIEW_MANAGE)) : null
        ])
      );
      return box;
    }

    _variableSchema(tpl) {
      const names = new Set(Object.keys(tpl.fields));
      collectVars(tpl.config).forEach(function (v) {
        names.add(v);
      });
      Object.keys(tpl.defaults).forEach(function (v) {
        names.add(v);
      });
      const fields = tpl.fields;
      return Array.from(names).map((v) => {
        const f = isObject(fields[v]) ? fields[v] : {};
        const item = { name: v, selector: isObject(f.selector) ? f.selector : this._guessSelector(v, tpl.defaults[v]) };
        if (f.required) item.required = true;
        return item;
      });
    }

    // --- Gestion des templates

    _renderManage(lang) {
      const box = this._el("div");
      box.appendChild(this._backLink(lang));
      box.appendChild(this._el("h3", { text: t(lang, "manageTitle") }));
      box.appendChild(this._el("div", { class: "help", text: t(lang, "manageHelp") }));
      this._renderLegacy(box, lang);
      this._renderBackup(box, lang);

      if (this._usage === null) {
        this._usage = undefined;
        countAllTemplateUsages(this._hass).then(
          (usage) => {
            this._usage = usage;
            if (this._currentView() === VIEW_MANAGE) this._render();
          },
          () => {
            this._usage = {};
          }
        );
      }

      const templates = this._templates();
      const names = Object.keys(templates).sort();
      if (!names.length) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "noTemplates") }));
        return box;
      }
      names.forEach((name) => {
        const found = templates[name];
        const tpl = normalizeTemplate(found.raw);
        const open = this._manageOpen === name;
        const row = this._el("div", { class: "tpl-row" + (open ? " open" : "") });
        const cardCount = tpl && isStack(tpl.config) ? tpl.config.cards.length : 1;
        const usage = this._usage ? this._usage[name] : null;
        const sub = [tSub(lang, "cardsInTemplate", { count: cardCount })];
        sub.push(this._usage ? tSub(lang, "usedBy", { count: usage ? usage.cards : 0 }) : t(lang, "usageLoading"));
        row.appendChild(
          this._el("div", { class: "tpl-head" }, [
            this._el("div", { class: "grow" }, [
              this._el("div", { class: "current" }, [name, this._badge(lang, found.scope)]),
              this._el("div", { class: "tpl-sub", text: sub.join(" · ") })
            ]),
            this._el("div", { class: "tpl-actions" }, [
              this._link(t(lang, open ? "close" : "edit"), () => {
                this._manageOpen = open ? null : name;
                this._render();
              }),
              this._link(t(lang, "remove"), () => this._deleteByName(name), "danger")
            ])
          ])
        );
        if (open && tpl) row.appendChild(this._renderTemplateDetail(lang, { name: name, found: found }, tpl));
        box.appendChild(row);
      });
      return box;
    }

    _renderTemplateDetail(lang, target, tpl) {
      const box = this._el("div");
      const nameInput = this._el("input", { class: "text" });
      nameInput.value = target.name;
      nameInput.addEventListener("change", () => this._rename(target.name, nameInput.value.trim()));
      const descInput = this._el("input", { class: "text" });
      descInput.value = tpl.description;
      descInput.addEventListener("change", () => {
        this._updateTemplate(function (ed) {
          ed.description = descInput.value;
        }, null, target.name);
      });
      const scopeHelp = this._el("div", { class: "help", text: this._scopeHelp(lang, target.found.scope === SCOPE_SHARED ? SCOPE_SHARED : SCOPE_LOCAL) });
      box.appendChild(
        this._el("div", { class: "grid2" }, [
          this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldName") }), nameInput]),
          this._el("div", null, [
            this._el("label", { class: "lbl", text: t(lang, "fieldScope") }),
            this._scopeSelect(lang, target.found.scope, (scope) => this._move(target.name, scope))
          ])
        ])
      );
      box.appendChild(scopeHelp);
      box.appendChild(this._el("label", { class: "lbl", text: t(lang, "fieldDescription") }));
      box.appendChild(descInput);

      if (tpl.kind === "card") box.appendChild(this._renderTemplateVariables(lang, target));
      else box.appendChild(this._el("div", { class: "help", text: tSub(lang, "nonCardHelp", { kind: tpl.kind }) }));

      if (target.name !== this._config.template) {
        box.appendChild(this._el("div", { class: "links" }, [this._link(t(lang, "useInCard"), () => this._select(target.name))]));
      }
      return box;
    }

    // Variables du template : liste (✕ pour retirer) et « Rendre un réglage variable… »
    _renderTemplateVariables(lang, target) {
      const box = this._el("div");
      const given = target.name === this._config.template ? this._config.variables : {};
      const ed = draftFromTemplate(target.name, target.found, given);
      box.appendChild(this._el("h4", { text: t(lang, "templateVars") }));
      box.appendChild(this._el("div", { class: "help", text: t(lang, "templateVarsHelp") }));
      const chips = this._el("div", { class: "chips" });
      ed.vars.forEach((v) => {
        const remove = this._el("button", { type: "button", title: tSub(lang, "removeVar", { name: v.name }), text: "✕" });
        remove.addEventListener("click", () => {
          this._updateTemplate(function (draft) {
            draft.vars = draft.vars.filter(function (x) {
              return !samePath(x.path, v.path);
            });
          }, null, target.name);
        });
        chips.appendChild(this._el("span", { class: "chip" }, [v.name + " ", this._el("code", { text: v.path.join(".") }), remove]));
      });
      box.appendChild(chips);

      const candidates = leafPaths(ed.card).filter(function (leaf) {
        return !ed.vars.some(function (v) {
          return samePath(v.path, leaf.path);
        });
      });
      if (candidates.length) {
        const pick = this._el("select", { class: "text" });
        pick.appendChild(this._el("option", { value: "", text: t(lang, "addVariable") }));
        candidates.forEach(function (c, i) {
          const opt = document.createElement("option");
          opt.value = String(i);
          opt.textContent = c.path.join(" › ") + " = " + String(c.value).slice(0, 50);
          pick.appendChild(opt);
        });
        pick.addEventListener("change", () => {
          if (pick.value === "") return;
          const leaf = candidates[Number(pick.value)];
          this._updateTemplate(function (draft) {
            const taken = draft.vars.map((x) => x.name).concat(Object.keys(draft.extraDefaults));
            draft.vars.push({ name: suggestVarName(leaf.path, taken), path: leaf.path, label: "" });
          }, null, target.name);
        });
        box.appendChild(pick);
      }
      return box;
    }

    // À chaque ouverture (administrateur), sauf « Ne plus demander »
    _checkDecluttering(hass) {
      if (!isAdmin(hass)) return;
      Promise.all([readPrefs(hass), scanDeclutteringTemplates(hass), loadLibrary(hass, this._path())])
        .then(([prefs, scan]) => {
          if (prefs.skip_decluttering_import) return;
          this._decl = scan;
          this._render();
        })
        .catch(function (e) {
          console.warn("[declutter-plus] decluttering-card scan failed", e);
        });
    }

    _renderDeclutteringOffer(root, lang) {
      if (!this._decl || this._declHidden || !isAdmin(this._hass)) return;
      const pending = pendingDecluttering(this._decl, this._entry().templates);
      const count = Object.keys(pending).length;
      if (!count) return;
      const never = this._el("input", { type: "checkbox", id: "decl-never" });
      const box = this._el("div", { class: "box offer" }, [
        this._el("div", { class: "offer-title", text: tSub(lang, "declFound", { count: count, dashboards: this._decl.dashboards }) }),
        this._el("div", { class: "help", text: t(lang, "declHelp") }),
        this._el("label", { class: "check", for: "decl-never" }, [never, " " + t(lang, "declNever")])
      ]);
      const copy = this._el("button", { class: "action primary", type: "button", text: t(lang, "declCopy") });
      copy.addEventListener("click", () => this._copyDecluttering(pending, never.checked));
      const later = this._el("button", { class: "action", type: "button", text: t(lang, "declLater") });
      later.addEventListener("click", () => {
        this._declHidden = true;
        if (never.checked) writePrefs(this._hass, { skip_decluttering_import: true }).catch(function () {});
        this._render();
      });
      box.appendChild(this._el("div", { class: "actions" }, [later, copy]));
      root.appendChild(box);
    }

    _copyDecluttering(pending, never) {
      const lang = this._lang();
      const names = Object.keys(pending);
      const chain = saveShared(this._hass, this._path(), function (lib) {
        names.forEach(function (name) {
          let target = name;
          if (hasVar(lib, name) && JSON.stringify(lib[name]) !== JSON.stringify(pending[name])) {
            target = uniqueName(name + DECLUTTERING_SUFFIX, lib);
          }
          lib[target] = clone(pending[name]);
        });
      }).then(() => (never ? writePrefs(this._hass, { skip_decluttering_import: true }).catch(function () {}) : null));
      this._declHidden = true;
      this._run(chain, tSub(lang, "declCopied", { count: names.length })).catch(function () {});
    }

    // Templates encore dans l'ancien dashboard : proposer une copie, jamais imposée
    _renderLegacy(box, lang) {
      const entry = this._entry();
      if (!isAdmin(this._hass) || !entry.legacy) return;
      const count = Object.keys(entry.templates).length;
      box.appendChild(
        this._el("div", { class: "box" }, [
          this._el("div", { class: "help", text: tSub(lang, "legacyFound", { count: count }) }),
          this._el("div", { class: "help", text: t(lang, "legacyCopyHelp") }),
          this._link(t(lang, "legacyCopy"), () => {
            this._run(copyLegacyToSystem(this._hass, entry.path), null)
              .then(() => this._notify(tSub(lang, "legacyCopied", { count: count }), "ok"))
              .catch(function () {});
          })
        ])
      );
    }

    // Stockage partagé vide mais sauvegarde disponible : proposer la restauration
    _renderBackup(box, lang) {
      const entry = this._entry();
      if (!isAdmin(this._hass) || !entry.loaded || entry.error || entry.legacy || Object.keys(entry.templates).length) return;
      if (this._backup === undefined) {
        this._backup = null;
        readBackup(this._hass, entry.path).then((backup) => {
          this._backup = backup;
          if (backup) this._render();
        });
        return;
      }
      const backup = this._backup;
      if (!backup) return;
      const count = Object.keys(backup.templates).length;
      let date = backup.saved_at;
      try {
        date = new Date(backup.saved_at).toLocaleString(lang);
      } catch (e) {}
      box.appendChild(this._el("div", { class: "notice err", text: tSub(lang, "backupFound", { count: count, date: date }) }));
      box.appendChild(
        this._link(t(lang, "backupRestore"), () => {
          const chain = saveShared(this._hass, entry.path, function (lib) {
            Object.keys(backup.templates).forEach(function (name) {
              lib[name] = clone(backup.templates[name]);
            });
          });
          this._run(chain, tSub(lang, "restored", { count: count }))
            .then(() => {
              this._backup = undefined;
            })
            .catch(function () {});
        })
      );
    }

    _renderGallery(lang) {
      const box = this._el("div");
      const templates = this._templates();
      const names = Object.keys(templates).sort();
      if (!names.length) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "noTemplates") }));
        return box;
      }
      const search = this._el("input", { class: "text", type: "search", placeholder: t(lang, "search") });
      search.value = this._search;
      const grid = this._el("div", { class: "gallery" });
      box.appendChild(search);
      box.appendChild(grid);

      const fill = () => {
        grid.innerHTML = "";
        this._previews = [];
        const q = this._search.toLowerCase();
        names
          .filter(function (n) {
            const d = (templates[n].raw && templates[n].raw.description) || "";
            return !q || n.toLowerCase().indexOf(q) !== -1 || String(d).toLowerCase().indexOf(q) !== -1;
          })
          .forEach((name, idx) => {
            const found = templates[name];
            const tpl = normalizeTemplate(found.raw);
            const tile = this._el("div", { class: "tile" + (name === this._config.template ? " sel" : "") });
            const thumb = this._el("div", { class: "thumb" });
            if (tpl && tpl.kind === "card" && helpers && idx < PREVIEW_LIMIT) {
              thumb.appendChild(this._thumbnail(name, tpl));
            } else {
              thumb.appendChild(this._el("div", { class: "none", text: tSub(lang, "noPreview", { kind: tpl ? tpl.kind : "?" }) }));
            }
            tile.appendChild(thumb);
            tile.appendChild(this._el("div", { class: "meta" }, [this._el("div", { class: "name" }, [name, this._badge(lang, found.scope)])]));
            tile.addEventListener("click", () => this._select(name));
            grid.appendChild(tile);
          });
      };
      search.addEventListener("input", () => {
        this._search = search.value;
        fill();
      });
      fill();
      return box;
    }

    // Miniature d'un template : réutilisée tant que le template ne change pas, et
    // créée seulement quand elle devient visible.
    _thumbnail(name, tpl) {
      const config = renderTemplate(tpl, {}).config;
      const key = name + ":" + JSON.stringify(config);
      let scale = this._thumbs.get(key);
      if (!scale) {
        scale = this._el("div", { class: "scale" });
        this._thumbs.set(key, scale);
        const build = () => {
          if (scale._built) return;
          scale._built = true;
          try {
            const card = createChild("card", config);
            card.hass = this._hass;
            scale.appendChild(card);
            scale._card = card;
          } catch (e) {}
        };
        if (typeof IntersectionObserver === "function") {
          const observer = new IntersectionObserver(function (entries) {
            if (entries.some((e) => e.isIntersecting)) {
              observer.disconnect();
              build();
            }
          });
          observer.observe(scale);
        } else {
          build();
        }
      }
      if (scale._card) this._previews.push(scale._card);
      else this._pendingPreview(scale);
      return scale;
    }

    _pendingPreview(scale) {
      // miniature construite plus tard : l'ajouter à la liste une fois créée
      const check = () => {
        if (scale._card && this._previews.indexOf(scale._card) === -1) this._previews.push(scale._card);
      };
      setTimeout(check, 500);
    }

    _select(name) {
      const next = Object.assign({}, this._config, { template: name });
      delete next.paste;
      const found = this._templates()[name];
      const tpl = found && normalizeTemplate(found.raw);
      if (tpl && this._config.variables) {
        // garde les variables encore utilisées par le nouveau template
        const used = collectVars(tpl.config);
        Object.keys(tpl.defaults).forEach(function (k) {
          used.add(k);
        });
        const kept = {};
        const given = listToObject(this._config.variables);
        Object.keys(given).forEach(function (k) {
          if (used.has(k)) kept[k] = given[k];
        });
        if (Object.keys(kept).length) next.variables = kept;
        else delete next.variables;
      }
      this._message = null;
      this._view = null;
      this._changed(next);
      this._render();
    }

    _guessSelector(name, def) {
      const n = name.toLowerCase();
      if (typeof def === "boolean") return { boolean: {} };
      if (typeof def === "number") return { number: { mode: "box" } };
      if (isObject(def) || Array.isArray(def)) return { object: {} };
      if (typeof def === "string" && ENTITY_RE.test(def)) return { entity: {} };
      if (n === "entity" || /(^|_)entity($|_)/.test(n)) return { entity: {} };
      if (n === "icon" || /(^|_)icon($|_)/.test(n)) return { icon: {} };
      if (n === "area" || /(^|_)area($|_)/.test(n)) return { area: {} };
      return { text: {} };
    }

    _variablesForm(lang, tpl, schema) {
      const data = listToObject(this._config.variables);
      const fields = tpl.fields;
      if (!customElements.get("ha-form")) {
        const wrap = this._el("div");
        schema.forEach((s) => {
          const input = this._el("input", { class: "text" });
          input.value = hasVar(data, s.name) ? valueToText(data[s.name]) : "";
          input.addEventListener("change", () => this._setVariable(s.name, input.value));
          wrap.appendChild(this._el("label", { class: "lbl", text: s.name }));
          wrap.appendChild(input);
        });
        return wrap;
      }
      const form = document.createElement("ha-form");
      form.hass = this._hass;
      form.data = data;
      form.schema = schema;
      form.computeLabel = function (s) {
        const f = fields[s.name];
        return (isObject(f) && f.label) || s.name;
      };
      form.computeHelper = function (s) {
        const f = fields[s.name];
        if (isObject(f) && f.description) return f.description;
        return hasVar(tpl.defaults, s.name) ? tSub(lang, "defaultValue", { value: valueToText(tpl.defaults[s.name]) }) : "";
      };
      form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const value = Object.assign({}, ev.detail.value);
        Object.keys(value).forEach(function (k) {
          if (value[k] === "" || value[k] === undefined || value[k] === null) delete value[k];
        });
        const next = Object.assign({}, this._config);
        if (Object.keys(value).length) next.variables = value;
        else delete next.variables;
        form.data = value;
        this._changed(next);
      });
      return form;
    }

    _updateVariablesForm() {
      const form = this.shadowRoot.querySelector("ha-form");
      if (form) form.data = listToObject(this._config.variables);
    }

    _setVariable(name, value) {
      const vars = listToObject(this._config.variables);
      if (value === "") delete vars[name];
      else vars[name] = value;
      const next = Object.assign({}, this._config);
      if (Object.keys(vars).length) next.variables = vars;
      else delete next.variables;
      this._changed(next);
    }

    // --- Écriture des templates

    _run(promise, successText) {
      const lang = this._lang();
      this._busy = true;
      return Promise.resolve(promise).then(
        () => {
          this._busy = false;
          this._notify(successText, "ok");
        },
        (err) => {
          this._busy = false;
          this._notify(errorText(lang, err), "err");
          throw err;
        }
      );
    }

    // Écrit le brouillon à sa portée cible, en retirant l'ancienne version si le
    // nom ou la portée ont changé.
    _writeDraft(ed) {
      const raw = draftToRaw(ed);
      const newName = ed.name;
      const target = ed.scope;
      const origin = ed.originScope;
      const orig = ed.originalName;
      const lovelace = this._lovelaceObj();
      const extra = [this.lovelace];
      const dialog = activeEditDialog();
      if (dialog && dialog._params && dialog._params.lovelaceConfig) extra.push(dialog._params.lovelaceConfig);
      const hass = this._hass;
      const path = this._path();
      const leavesLocal = orig && (origin === SCOPE_LOCAL || origin === SCOPE_LEGACY);
      if ((target === SCOPE_LOCAL || leavesLocal) && !lovelace) return Promise.reject(new Error("dashboard unavailable"));

      let chain;
      if (target === SCOPE_SHARED) {
        chain = saveShared(hass, path, function (lib) {
          if (origin === SCOPE_SHARED && orig && orig !== newName) delete lib[orig];
          lib[newName] = raw;
        });
        if (leavesLocal) {
          chain = chain.then(function () {
            return saveLocal(lovelace, extra, function (local, legacy) {
              delete (origin === SCOPE_LEGACY ? legacy : local)[orig];
            });
          });
        }
      } else {
        chain = saveLocal(lovelace, extra, function (local, legacy) {
          if (orig && origin === SCOPE_LEGACY) delete legacy[orig];
          if (orig && origin === SCOPE_LOCAL && orig !== newName) delete local[orig];
          delete legacy[newName];
          local[newName] = raw;
        });
        if (orig && origin === SCOPE_SHARED) {
          chain = chain.then(function () {
            return saveShared(hass, path, function (lib) {
              delete lib[orig];
            });
          });
        }
      }
      return chain.then(function () {
        ed.originalName = newName;
        ed.originScope = target;
      });
    }

    _exists(name, scope) {
      if (scope === SCOPE_SHARED) return hasVar(this._entry().templates, name);
      const loc = localTemplates(this._dashConfig());
      return hasVar(loc.local, name) || hasVar(loc.legacy, name);
    }

    _updateTemplate(mutate, successText, name) {
      const target = name ? this._templateByName(name) : this._current();
      if (!target) return Promise.resolve();
      const given = target.name === this._config.template ? this._config.variables : {};
      const ed = draftFromTemplate(target.name, target.found, given);
      mutate(ed);
      return this._run(this._writeDraft(ed), successText || t(this._lang(), "saved")).catch(function () {});
    }

    _rename(oldName, name) {
      const lang = this._lang();
      const target = this._templateByName(oldName);
      if (!target || !name || name === oldName) return;
      if (!NAME_RE.test(name)) {
        this._notify(t(lang, "invalidName"), "err");
        return;
      }
      const given = oldName === this._config.template ? this._config.variables : {};
      const ed = draftFromTemplate(target.name, target.found, given);
      if (this._exists(name, ed.scope) && !window.confirm(tSub(lang, "confirmOverwrite", { name: name }))) {
        this._render();
        return;
      }
      // renommer casse les autres cartes qui utilisent l'ancien nom : confirmer
      countTemplateUsages(this._hass, oldName)
        .then(
          (usage) => tSub(lang, "usageCount", usage),
          () => t(lang, "usageUnknown")
        )
        .then((usage) => {
          if (!window.confirm(tSub(lang, "confirmRename", { old: oldName, name: name, usage: usage }))) {
            this._render();
            return;
          }
          ed.name = name;
          if (this._manageOpen === oldName) this._manageOpen = name;
          this._run(this._writeDraft(ed), t(lang, "saved"))
            .then(() => {
              if (this._config.template === oldName) this._changed(Object.assign({}, this._config, { template: name }));
              this._usage = null;
              this._render();
            })
            .catch(function () {});
        });
    }

    _move(name, scope) {
      const lang = this._lang();
      const current = this._templateByName(name);
      if (!current) return;
      const given = name === this._config.template ? this._config.variables : {};
      const ed = draftFromTemplate(current.name, current.found, given);
      if (this._exists(ed.name, scope) && !window.confirm(tSub(lang, "confirmOverwrite", { name: ed.name }))) {
        this._render();
        return;
      }
      ed.scope = scope;
      this._run(this._writeDraft(ed), t(lang, "saved")).catch(function () {});
    }

    // Partagé par défaut ; « ce dashboard » seulement si les données système sont indisponibles
    _defaultScope() {
      return this._entry().error ? SCOPE_LOCAL : SCOPE_SHARED;
    }

    // --- Actions de l'aperçu (boutons à droite)

    _previewAction(action, payload) {
      const lang = this._lang();
      const index = payload && typeof payload.index === "number" ? payload.index : 0;
      if (!isAdmin(this._hass) && action !== "copy") {
        this._notify(t(lang, "adminOnly"), "err");
        return;
      }
      if (action === "add") this._addCard();
      else if (action === "paste") this._savePaste();
      else if (action === "edit") this._editCard(index);
      else if (action === "delete") this._removeCard(index);
      else if (action === "duplicate") this._duplicateCard(index);
      else if (action === "copy") this._copyCard(index);
      else if (action === "resize") this._resizeCard(index, payload.gridOptions);
      else if (action === "importSection") this._chooseSection();
    }

    _dialogFailed(result) {
      if (result && result.ok) return;
      const message = tSub(this._lang(), "dialogUnavailable", { reason: (result && result.reason) || "?" });
      console.warn("[declutter-plus] " + message);
      showToast(message);
      this._notify(message, "err");
    }

    _addCard() {
      const lang = this._lang();
      const ownConfig = Object.assign({ type: "custom:" + CARD_TAG }, this._config);
      const editor = this;
      const current = this._current();
      if (current && normalizeTemplate(current.found.raw).kind === "card") {
        // ajoute la carte à la fin du template affiché
        const ed = draftFromTemplate(current.name, current.found, this._config.variables);
        openNativeCardDialog({
          hass: this._hass,
          mode: "add",
          ownConfig: ownConfig,
          onSave: function (card) {
            const index = draftCards(ed).length;
            insertDraftCard(ed, index, card);
            return editor._writeDraft(ed).then(function () {
              return Object.assign({}, ownConfig);
            }, function (err) {
              throw new Error(errorText(lang, err));
            });
          }
        }).then(this._dialogFailed.bind(this));
        return;
      }
      openNativeCardDialog({
        hass: this._hass,
        mode: "add",
        ownConfig: ownConfig,
        onSave: function (card) {
          const ed = draftFromCard(card, uniqueName(card.type, editor._templates()), editor._defaultScope());
          return editor._writeDraft(ed).then(function () {
            const next = Object.assign({}, ownConfig, { template: ed.name });
            delete next.paste;
            const values = draftValues(ed);
            if (Object.keys(values).length) next.variables = values;
            else delete next.variables;
            return next;
          }, function (err) {
            throw new Error(errorText(lang, err));
          });
        }
      }).then(this._dialogFailed.bind(this));
    }

    _editCard(index) {
      const lang = this._lang();
      const editor = this;
      const ownConfig = Object.assign({ type: "custom:" + CARD_TAG }, this._config);
      let ed;
      if (this._config.paste && !this._config.template) {
        ed = draftFromCard(this._config.paste, uniqueName(this._config.paste.type, this._templates()), this._defaultScope());
      } else {
        const current = this._current();
        if (!current) return;
        ed = draftFromTemplate(current.name, current.found, this._config.variables);
        if (ed.kind !== "card") {
          this._notify(tSub(lang, "nonCardHelp", { kind: ed.kind }), "err");
          return;
        }
      }
      const cards = draftCards(ed);
      if (!cards[index]) index = 0;
      openNativeCardDialog({
        hass: this._hass,
        mode: "edit",
        card: cards[index],
        ownConfig: ownConfig,
        onSave: function (card) {
          const isNew = !ed.originalName;
          replaceDraftCard(ed, index, card);
          return editor._writeDraft(ed).then(function () {
            const next = Object.assign({}, ownConfig, { template: ed.name });
            delete next.paste;
            if (isNew) {
              const values = draftValues(ed);
              if (Object.keys(values).length) next.variables = values;
            }
            return next;
          }, function (err) {
            throw new Error(errorText(lang, err));
          });
        }
      }).then(this._dialogFailed.bind(this));
    }

    _savePaste() {
      const lang = this._lang();
      const paste = this._config.paste;
      if (!isObject(paste)) return;
      const ed = draftFromCard(paste, uniqueName(paste.type, this._templates()), this._defaultScope());
      this._run(this._writeDraft(ed), t(lang, "saved"))
        .then(() => {
          const next = Object.assign({}, this._config, { template: ed.name });
          delete next.paste;
          const values = draftValues(ed);
          if (Object.keys(values).length) next.variables = values;
          this._changed(next);
          this._render();
        })
        .catch(function () {});
    }

    // Message de confirmation : type Declutter Plus, stockage et utilisations
    _confirmTemplate(key, current) {
      const lang = this._lang();
      const where = t(lang, current.found.scope === SCOPE_SHARED ? "whereShared" : "whereLocal");
      return countTemplateUsages(this._hass, current.name).then(
        function (usage) {
          return tSub(lang, "usageCount", usage);
        },
        function () {
          return t(lang, "usageUnknown");
        }
      ).then(function (usage) {
        return window.confirm(tSub(lang, key, { name: current.name, where: where, usage: usage }));
      });
    }

    _removeCard(index) {
      const lang = this._lang();
      const current = this._current();
      if (current) {
        const ed = draftFromTemplate(current.name, current.found, this._config.variables);
        if (removeDraftCard(ed, index)) {
          this._confirmTemplate("confirmRemoveCard", current).then((ok) => {
            if (ok) this._run(this._writeDraft(ed), t(lang, "saved")).catch(function () {});
          });
          return;
        }
      }
      this._deleteTemplate();
    }

    // Petite popup native (<dialog> modal : passe au-dessus de la boîte de HA)
    _chooseSection() {
      const lang = this._lang();
      const sections = listDashboardSections(this._dashConfig(), lang);
      const dialog = document.createElement("dialog");
      dialog.style.cssText =
        "padding:0;border:none;border-radius:24px;width:min(520px,94vw);max-height:80vh;overflow:auto;" +
        "background:var(--card-background-color,#fff);color:var(--primary-text-color);font-family:var(--ha-font-family-body,Roboto,sans-serif)";
      const host = document.createElement("div");
      const root = host.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent =
        ".wrap{padding:20px}h2{margin:0 0 4px;font-size:20px;font-weight:500}p{margin:0 0 16px;font-size:13px;color:var(--secondary-text-color)}" +
        "button.item{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;font:inherit;font-size:14px;padding:12px 14px;" +
        "margin-bottom:8px;border-radius:12px;border:1px solid var(--divider-color);background:transparent;color:inherit;cursor:pointer}" +
        "button.item:hover{border-color:var(--primary-color)}button.item span{color:var(--secondary-text-color);white-space:nowrap}" +
        ".foot{display:flex;justify-content:flex-end}button.close{font:inherit;border:none;background:none;color:var(--primary-color);cursor:pointer;padding:8px}";
      root.appendChild(style);
      const wrap = this._el("div", { class: "wrap" }, [
        this._el("h2", { text: t(lang, "importTitle") }),
        this._el("p", { text: sections.length ? t(lang, "importHelp") : t(lang, "importEmpty") })
      ]);
      const close = () => {
        try {
          dialog.close();
        } catch (e) {}
        dialog.remove();
      };
      sections.forEach((section) => {
        const item = this._el("button", { class: "item", type: "button" }, [
          section.label,
          this._el("span", { text: tSub(lang, "importCount", { count: section.cards.length }) })
        ]);
        item.addEventListener("click", () => {
          close();
          this._importCards(section);
        });
        wrap.appendChild(item);
      });
      const closeBtn = this._el("button", { class: "close", type: "button", text: haLabel(this._hass, "ui.common.close", lang, "close") });
      closeBtn.addEventListener("click", close);
      wrap.appendChild(this._el("div", { class: "foot" }, [closeBtn]));
      root.appendChild(wrap);
      dialog.appendChild(host);
      dialog.addEventListener("cancel", (ev) => {
        ev.preventDefault();
        close();
      });
      document.body.appendChild(dialog);
      try {
        dialog.showModal();
      } catch (e) {
        dialog.setAttribute("open", "");
      }
    }

    // Copie les cartes d'une section dans le template affiché, ou en crée un.
    _importCards(section) {
      const lang = this._lang();
      const current = this._current();
      const cards = section.cards.map(clone);
      let ed;
      const isNew = !current || normalizeTemplate(current.found.raw).kind !== "card";
      if (!isNew) {
        ed = draftFromTemplate(current.name, current.found, this._config.variables);
      } else {
        const base = String(section.title).toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "section";
        ed = draftFromCard(cards.shift(), uniqueName(base, this._templates()), this._defaultScope());
        // une section se copie en grille, même avec une seule carte
        if (cards.length) ensureStack(ed);
      }
      cards.forEach(function (card) {
        const index = draftCards(ed).length;
        insertDraftCard(ed, index, card);
      });
      this._run(this._writeDraft(ed), tSub(lang, "imported", { count: section.cards.length }))
        .then(() => {
          const next = Object.assign({}, this._config, { template: ed.name });
          delete next.paste;
          if (isNew) delete next.variables;
          this._changed(next);
          this._render();
        })
        .catch(function () {});
    }

    _resizeCard(index, gridOptions) {
      const current = this._current();
      if (!current) return;
      const ed = draftFromTemplate(current.name, current.found, this._config.variables);
      if (!resizeDraftCard(ed, index, gridOptions)) return;
      this._run(this._writeDraft(ed), null).catch(function () {});
    }

    _duplicateCard(index) {
      const lang = this._lang();
      const current = this._current();
      if (!current) return;
      const ed = draftFromTemplate(current.name, current.found, this._config.variables);
      const cards = draftCards(ed);
      if (!cards[index]) return;
      insertDraftCard(ed, index + 1, clone(cards[index]));
      this._run(this._writeDraft(ed), t(lang, "saved")).catch(function () {});
    }

    _deleteTemplate() {
      if (this._config.paste && !this._config.template) {
        const next = Object.assign({}, this._config, { template: "" });
        delete next.paste;
        this._changed(next);
        this._render();
        return;
      }
      const current = this._current();
      if (!current) return;
      this._confirmTemplate("confirmDelete", current).then((ok) => {
        if (ok) this._doDeleteTemplate(current);
      });
    }

    _deleteByName(name) {
      const target = this._templateByName(name);
      if (!target) return;
      this._confirmTemplate("confirmDelete", target).then((ok) => {
        if (ok) this._doDeleteTemplate(target);
      });
    }

    _doDeleteTemplate(current) {
      const lang = this._lang();
      const name = current.name;
      const dialog = activeEditDialog();
      const extra = [this.lovelace];
      if (dialog && dialog._params && dialog._params.lovelaceConfig) extra.push(dialog._params.lovelaceConfig);
      // retire le nom de tous les stockages : sinon une autre copie (partagée ou
      // decluttering-card) réapparaît dans la galerie
      const loc = localTemplates(this._dashConfig());
      const hass = this._hass;
      const path = this._path();
      const lovelace = this._lovelaceObj();
      let chain = Promise.resolve();
      if (hasVar(this._entry().templates, name)) {
        chain = chain.then(function () {
          return saveShared(hass, path, function (lib) {
            delete lib[name];
          });
        });
      }
      if (hasVar(loc.local, name) || hasVar(loc.legacy, name)) {
        chain = chain.then(function () {
          return saveLocal(lovelace, extra, function (local, legacy) {
            delete local[name];
            delete legacy[name];
          });
        });
      }
      this._run(chain, t(lang, "deleted"))
        .then(() => {
          if (this._manageOpen === name) this._manageOpen = null;
          this._usage = null;
          if (this._config.template === name) {
            const next = Object.assign({}, this._config, { template: "" });
            delete next.variables;
            this._changed(next);
          }
          this._render();
        })
        .catch(function () {});
    }

    _copyCard(index) {
      const lang = this._lang();
      const current = this._current();
      let card = null;
      if (current) {
        card = renderTemplate(normalizeTemplate(current.found.raw), listToObject(this._config.variables)).config;
        if (isStack(card)) card = card.cards[index] || card;
      } else if (this._config.paste) {
        card = this._config.paste;
      }
      if (!card) return;
      writeHaClipboard(card);
      this._notify(t(lang, "copied"), "ok");
    }
  }

  // ---------------------------------------------------------------------------
  // Enregistrement

  function define(tag, cls) {
    if (!customElements.get(tag)) customElements.define(tag, cls);
  }

  define(CARD_TAG, DeclutterPlusCard);
  define(PASTE_TAG, DeclutterPlusPasteCard);
  define(ELEMENT_TAG, DeclutterPlusElement);
  define(ROW_TAG, DeclutterPlusRow);
  define(GRID_TAG, DeclutterPlusGrid);
  define(EDITOR_TAG, DeclutterPlusCardEditor);

  // Suggestion de template dans le sélecteur de cartes (HA 2026.6+)
  function entitySuggestion(hass, entityId) {
    const entry = libraries[SHARED_DASHBOARD];
    if (!entry || !entry.loaded) {
      loadLibrary(hass, SHARED_DASHBOARD);
      return null;
    }
    const lovelace = findLovelace(null);
    const templates = allTemplates(entry, lovelace && lovelace.config);
    const domain = String(entityId).split(".")[0];
    const names = Object.keys(templates).sort();
    for (let i = 0; i < names.length; i++) {
      const tpl = normalizeTemplate(templates[names[i]].raw);
      if (!tpl || tpl.kind !== "card") continue;
      const fieldNames = Object.keys(tpl.fields);
      for (let j = 0; j < fieldNames.length; j++) {
        const sel = isObject(tpl.fields[fieldNames[j]]) && tpl.fields[fieldNames[j]].selector;
        if (!isObject(sel) || !("entity" in sel)) continue;
        const spec = isObject(sel.entity) ? sel.entity : {};
        const domains = [].concat(spec.domain || []).concat(
          [].concat(spec.filter || []).reduce(function (acc, f) {
            return acc.concat((f && f.domain) || []);
          }, [])
        );
        if (domains.length && domains.indexOf(domain) === -1) continue;
        const variables = {};
        variables[fieldNames[j]] = entityId;
        return { label: names[i], config: { type: "custom:" + CARD_TAG, template: names[i], variables: variables } };
      }
    }
    return null;
  }

  const pickerLang = resolveLang(null);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TAG,
    name: t(pickerLang, "cardName"),
    description: t(pickerLang, "cardDescription"),
    preview: false,
    documentationURL: "https://github.com/Flybrow/lovelace-declutter-plus",
    getEntitySuggestion: entitySuggestion
  });
  window.customCards.push({
    type: PASTE_TAG,
    name: t(pickerLang, "pasteName"),
    description: t(pickerLang, "pasteDescription"),
    preview: false,
    documentationURL: "https://github.com/Flybrow/lovelace-declutter-plus"
  });

  console.info("%c DECLUTTER-PLUS %c v" + VERSION + " ", "color:#fff;background:#3f51b5;font-weight:700", "color:#3f51b5");
})();
