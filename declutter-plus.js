/*
 * Declutter Plus — templates de cartes Lovelace réutilisables, stockés dans le
 * dashboard courant ou partagés entre dashboards, avec éditeur graphique.
 * Compatible avec la syntaxe de decluttering-card.
 */
(function () {
  "use strict";

  const VERSION = "1.1.0";
  const CARD_TAG = "declutter-plus-card";
  const PASTE_TAG = "declutter-plus-paste-card";
  const ELEMENT_TAG = "declutter-plus-element";
  const ROW_TAG = "declutter-plus-row";
  const EDITOR_TAG = "declutter-plus-card-editor";
  const SHARED_DASHBOARD = "declutter-plus";
  const SHARED_TITLE = "Declutter Plus – Templates";
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
  const PREVIEW_LIMIT = 60;
  const DOM_GUARD = 20000;
  const NATIVE_TIMEOUT_MS = 8000;
  const FALLBACK_LANG = "en";

  const STRINGS = {
    en: {
      cardName: "Declutter Plus",
      cardDescription: "Reusable card templates for this dashboard or all dashboards, with a visual editor.",
      pasteName: "Declutter Plus: paste copied card",
      pasteDescription: "Turn the card you copied (card menu > Copy) into a reusable template.",
      templateNotFound: "Template not found: {name}",
      kindMismatch: "Template \"{name}\" is a {kind} template.",
      chooseTemplate: "Choose a template in the card editor.",
      pasteHint: "Pasted card: save it as a template to reuse it.",
      addCard: "Add a card",
      panelTemplate: "Template",
      panelVariables: "Variables",
      panelCreate: "Create or edit a template",
      panelStorage: "Template storage",
      storageIntro: "A template is a reusable card model. Place Declutter Plus cards wherever you want: each card only holds a template name and its variable values.",
      storageLocal: "This dashboard: saved in this dashboard's configuration, usable on this dashboard only.",
      storageShared: "Shared: saved in a hidden dashboard named \"{title}\", used only as storage, usable on every dashboard.",
      sharedMissing: "Shared storage is not set up yet.",
      sharedMissingUser: "Shared storage is not set up yet. Ask an administrator.",
      sharedCreate: "Set up shared storage",
      sharedCount: "{count} shared template(s)",
      localCount: "{count} template(s) on this dashboard",
      sharedOpen: "Open storage dashboard",
      reload: "Reload",
      sharedNote: "This hidden dashboard only stores the shared **Declutter Plus** templates. You do not need to open it: manage templates from the Declutter Plus card editor.",
      importLegacy: "Move {count} decluttering-card template(s) to shared storage",
      importDone: "{count} template(s) moved.",
      search: "Search templates",
      noTemplates: "No template yet. Click \"Add a card\" under the preview to create one.",
      scopeLocal: "This dashboard",
      scopeLegacy: "This dashboard (decluttering-card)",
      scopeShared: "Shared",
      noPreview: "No preview for {kind} templates",
      noVariables: "This template has no variables.",
      defaultValue: "Default: {value}",
      editTemplate: "Edit this template",
      editorTitle: "Template editor",
      fieldName: "Template name",
      fieldDescription: "Description",
      fieldKind: "Type",
      fieldScope: "Save to",
      kindCard: "Card",
      kindElement: "Picture element",
      kindRow: "Entities row",
      pickCard: "Pick the card to turn into a template:",
      changeCard: "Change card",
      codeEditor: "Show code editor",
      visualEditor: "Show visual editor",
      fromClipboard: "Paste copied card",
      fromDashboard: "Copy a card of this dashboard…",
      clipboardEmpty: "No copied card found. Use \"Copy\" in a card menu, then try again.",
      nativeUnavailable: "The Home Assistant card picker could not be loaded: write the card YAML below.",
      fieldConfig: "Configuration (YAML)",
      varsHelp: "Choose which settings change from one card to another. Their current value becomes the default value.",
      addVariable: "Make a setting variable…",
      varName: "Variable",
      varLabel: "Label",
      removeVar: "Remove",
      extraDefaults: "Other default values (YAML)",
      save: "Save template",
      remove: "Delete",
      cancel: "Close",
      confirmDelete: "Delete template \"{name}\"?",
      confirmOverwrite: "Template \"{name}\" already exists there. Overwrite?",
      saved: "Template saved.",
      deleted: "Template deleted.",
      invalidName: "The name may only contain letters, digits, _ and -.",
      invalidYaml: "Invalid YAML.",
      noCard: "Pick a card first.",
      adminOnly: "Only administrators can edit templates.",
      dashboardUnavailable: "This dashboard cannot be modified from here (YAML mode?). Use shared storage.",
      error: "Error: {message}",
      untitledCard: "card"
    },
    fr: {
      cardName: "Declutter Plus",
      cardDescription: "Templates de cartes réutilisables, pour ce dashboard ou tous les dashboards, avec éditeur graphique.",
      pasteName: "Declutter Plus : coller la carte copiée",
      pasteDescription: "Transforme la carte copiée (menu de la carte > Copier) en template réutilisable.",
      templateNotFound: "Template introuvable : {name}",
      kindMismatch: "Le template « {name} » est de type {kind}.",
      chooseTemplate: "Choisissez un template dans l'éditeur de la carte.",
      pasteHint: "Carte collée : enregistrez-la comme template pour la réutiliser.",
      addCard: "Ajouter une carte",
      panelTemplate: "Template",
      panelVariables: "Variables",
      panelCreate: "Créer ou modifier un template",
      panelStorage: "Stockage des templates",
      storageIntro: "Un template est un modèle de carte réutilisable. Posez les cartes Declutter Plus où vous voulez : chaque carte ne contient que le nom du template et les valeurs de ses variables.",
      storageLocal: "Ce dashboard : enregistré dans la configuration de ce dashboard, utilisable uniquement sur ce dashboard.",
      storageShared: "Partagé : enregistré dans un dashboard caché nommé « {title} », qui sert uniquement de stockage, utilisable sur tous les dashboards.",
      sharedMissing: "Le stockage partagé n'est pas encore activé.",
      sharedMissingUser: "Le stockage partagé n'est pas encore activé. Demandez à un administrateur.",
      sharedCreate: "Activer le stockage partagé",
      sharedCount: "{count} template(s) partagé(s)",
      localCount: "{count} template(s) sur ce dashboard",
      sharedOpen: "Ouvrir le dashboard de stockage",
      reload: "Recharger",
      sharedNote: "Ce dashboard caché sert uniquement à stocker les templates **Declutter Plus** partagés. Inutile de l'ouvrir : gérez les templates depuis l'éditeur de la carte Declutter Plus.",
      importLegacy: "Déplacer {count} template(s) decluttering-card vers le stockage partagé",
      importDone: "{count} template(s) déplacé(s).",
      search: "Rechercher un template",
      noTemplates: "Aucun template. Cliquez sur « Ajouter une carte » sous l'aperçu pour en créer un.",
      scopeLocal: "Ce dashboard",
      scopeLegacy: "Ce dashboard (decluttering-card)",
      scopeShared: "Partagé",
      noPreview: "Pas d'aperçu pour un template {kind}",
      noVariables: "Ce template n'a pas de variable.",
      defaultValue: "Défaut : {value}",
      editTemplate: "Modifier ce template",
      editorTitle: "Éditeur de template",
      fieldName: "Nom du template",
      fieldDescription: "Description",
      fieldKind: "Type",
      fieldScope: "Enregistrer dans",
      kindCard: "Carte",
      kindElement: "Élément d'image",
      kindRow: "Ligne d'entités",
      pickCard: "Choisissez la carte à transformer en template :",
      changeCard: "Changer de carte",
      codeEditor: "Afficher l'éditeur de code",
      visualEditor: "Afficher l'éditeur visuel",
      fromClipboard: "Coller la carte copiée",
      fromDashboard: "Copier une carte de ce dashboard…",
      clipboardEmpty: "Aucune carte copiée. Utilisez « Copier » dans le menu d'une carte, puis réessayez.",
      nativeUnavailable: "Le sélecteur de cartes de Home Assistant n'a pas pu être chargé : saisissez le YAML de la carte ci-dessous.",
      fieldConfig: "Configuration (YAML)",
      varsHelp: "Choisissez les réglages qui changent d'une carte à l'autre. Leur valeur actuelle devient la valeur par défaut.",
      addVariable: "Rendre un réglage variable…",
      varName: "Variable",
      varLabel: "Libellé",
      removeVar: "Retirer",
      extraDefaults: "Autres valeurs par défaut (YAML)",
      save: "Enregistrer le template",
      remove: "Supprimer",
      cancel: "Fermer",
      confirmDelete: "Supprimer le template « {name} » ?",
      confirmOverwrite: "Le template « {name} » existe déjà à cet endroit. L'écraser ?",
      saved: "Template enregistré.",
      deleted: "Template supprimé.",
      invalidName: "Le nom ne peut contenir que lettres, chiffres, _ et -.",
      invalidYaml: "YAML invalide.",
      noCard: "Choisissez d'abord une carte.",
      adminOnly: "Seuls les administrateurs peuvent modifier les templates.",
      dashboardUnavailable: "Ce dashboard ne peut pas être modifié d'ici (mode YAML ?). Utilisez le stockage partagé.",
      error: "Erreur : {message}",
      untitledCard: "carte"
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

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(new Error("timeout"));
        }, ms);
      })
    ]);
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

  // Presse-papiers de cartes de HA (menu « Copier »).
  function readHaClipboard() {
    try {
      const raw = window.localStorage.getItem(CLIPBOARD_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (isObject(parsed) && typeof parsed.type === "string") return parsed;
    } catch (e) {}
    return null;
  }

  function readCopiedCard() {
    const copied = readHaClipboard();
    if (copied) return Promise.resolve(copied);
    if (!navigator.clipboard || !navigator.clipboard.readText) return Promise.resolve(null);
    return navigator.clipboard.readText().then(
      function (text) {
        try {
          const parsed = JSON.parse(text);
          return isObject(parsed) && parsed.type ? parsed : null;
        } catch (e) {
          return null;
        }
      },
      function () {
        return null;
      }
    );
  }

  // Liste à plat des cartes d'un dashboard (vues, sections, cartes imbriquées).
  function listDashboardCards(config) {
    const out = [];
    function walk(cards, path) {
      if (!Array.isArray(cards)) return;
      cards.forEach(function (card, i) {
        if (!isObject(card) || !card.type) return;
        const label = path + " / " + (card.title || card.name || card.entity || card.type) + " #" + (i + 1);
        out.push({ label: label, config: card });
        walk(card.cards, label);
        if (isObject(card.card)) walk([card.card], label);
      });
    }
    if (config && Array.isArray(config.views)) {
      config.views.forEach(function (view, v) {
        const vpath = view.title || view.path || "#" + (v + 1);
        walk(view.cards, vpath);
        if (Array.isArray(view.sections)) {
          view.sections.forEach(function (section, s) {
            walk(section.cards, vpath + " / " + (section.title || "section " + (s + 1)));
          });
        }
      });
    }
    return out.filter(function (c) {
      return String(c.config.type).indexOf("custom:declutter-plus") !== 0;
    });
  }

  // ---------------------------------------------------------------------------
  // Helpers de cartes et éditeurs natifs de HA (chargés une fois)

  let helpers = null;
  let helpersPromise = null;
  let nativePromise = null;

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

  // hui-card-picker et hui-card-element-editor sont chargés à la demande par HA :
  // l'éditeur de la carte « pile verticale » les importe.
  function loadNativeEditors() {
    const ready = function () {
      return !!(customElements.get("hui-card-picker") && customElements.get("hui-card-element-editor"));
    };
    if (ready()) return Promise.resolve(true);
    if (!nativePromise) {
      nativePromise = withTimeout(
        loadHelpers()
          .then(function (h) {
            h.createCardElement({ type: "vertical-stack", cards: [] });
            return customElements.whenDefined("hui-vertical-stack-card");
          })
          .then(function () {
            const cls = customElements.get("hui-vertical-stack-card");
            return cls && cls.getConfigElement ? cls.getConfigElement() : null;
          })
          .then(function () {
            return Promise.all([
              customElements.whenDefined("hui-card-picker"),
              customElements.whenDefined("hui-card-element-editor")
            ]);
          }),
        NATIVE_TIMEOUT_MS
      ).then(ready, function (e) {
        nativePromise = null;
        console.warn("[declutter-plus] native card editors unavailable", e);
        return false;
      });
    }
    return nativePromise;
  }

  function createChild(kind, config) {
    if (kind === "element") return helpers.createHuiElement(config);
    if (kind === "row") return helpers.createRowElement(config);
    return helpers.createCardElement(config);
  }

  // ---------------------------------------------------------------------------
  // Stockage partagé (dashboard caché)

  const libraries = {};
  const liveCards = new Set();

  function libraryEntry(path) {
    if (!libraries[path]) {
      libraries[path] = {
        path: path,
        loaded: false,
        missing: false,
        error: null,
        templates: {},
        promise: null,
        subscribed: false,
        listeners: new Set()
      };
    }
    return libraries[path];
  }

  function isNotFound(err) {
    const code = err && err.code;
    const msg = String((err && err.message) || "").toLowerCase();
    return code === "config_not_found" || msg.indexOf("not found") !== -1 || msg.indexOf("unknown config") !== -1;
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

  function loadLibrary(hass, path, force) {
    const entry = libraryEntry(path);
    if (!hass || !hass.callWS) return Promise.resolve(entry);
    subscribeLibrary(hass, entry);
    if (entry.promise && !force) return entry.promise;
    entry.promise = hass
      .callWS({ type: "lovelace/config", url_path: path, force: !!force })
      .then(
        function (config) {
          entry.missing = false;
          entry.error = null;
          entry.templates = listToObject(isObject(config) ? config[TEMPLATES_KEY] : null);
        },
        function (err) {
          entry.templates = {};
          entry.missing = isNotFound(err);
          entry.error = entry.missing ? null : err;
          if (!entry.missing) console.warn("[declutter-plus] shared storage load failed", err);
        }
      )
      .then(function () {
        entry.loaded = true;
        notifyLibrary(entry);
        return entry;
      });
    return entry.promise;
  }

  function subscribeLibrary(hass, entry) {
    if (entry.subscribed || !hass.connection || !hass.connection.subscribeEvents) return;
    entry.subscribed = true;
    try {
      hass.connection
        .subscribeEvents(function (ev) {
          if (ev && ev.data && ev.data.url_path === entry.path) loadLibrary(hass, entry.path, true);
        }, "lovelace_updated")
        .catch(function () {
          entry.subscribed = false;
        });
    } catch (e) {
      entry.subscribed = false;
    }
  }

  // Relit la config fraîche et ne modifie que la clé des templates.
  function saveShared(hass, path, mutate) {
    return hass
      .callWS({ type: "lovelace/config", url_path: path, force: true })
      .then(function (config) {
        const next = Object.assign({}, config);
        next[TEMPLATES_KEY] = listToObject(next[TEMPLATES_KEY]);
        mutate(next[TEMPLATES_KEY]);
        return hass.callWS({ type: "lovelace/config/save", url_path: path, config: next });
      })
      .then(function () {
        return loadLibrary(hass, path, true);
      });
  }

  function createShared(hass, path, lang) {
    const base = {
      url_path: path,
      title: SHARED_TITLE,
      icon: "mdi:puzzle-outline",
      show_in_sidebar: false,
      require_admin: false
    };
    const config = { views: [{ title: SHARED_TITLE, cards: [{ type: "markdown", content: t(lang, "sharedNote") }] }] };
    config[TEMPLATES_KEY] = {};
    return hass
      .callWS(Object.assign({ type: "lovelace/dashboards/create", mode: "storage" }, base))
      .catch(function () {
        return hass.callWS(Object.assign({ type: "lovelace/dashboards/create" }, base));
      })
      .then(function () {
        return hass.callWS({ type: "lovelace/config/save", url_path: path, config: config });
      })
      .then(function () {
        return loadLibrary(hass, path, true);
      });
  }

  // Enregistre dans le dashboard courant via l'objet lovelace (met à jour la
  // config en mémoire). La config transmise à l'éditeur est aussi mise à jour :
  // la boîte de dialogue d'édition l'enregistre telle quelle à la fermeture.
  function saveLocal(lovelace, dialogConfig, mutate) {
    if (!isLovelace(lovelace)) return Promise.reject(new Error("dashboard unavailable"));
    const next = Object.assign({}, lovelace.config);
    const local = listToObject(next[TEMPLATES_KEY]);
    const legacy = listToObject(next[LEGACY_KEY]);
    mutate(local, legacy);
    [
      [TEMPLATES_KEY, local],
      [LEGACY_KEY, legacy]
    ].forEach(function (pair) {
      if (Object.keys(pair[1]).length) next[pair[0]] = pair[1];
      else delete next[pair[0]];
      if (isObject(dialogConfig) && dialogConfig !== lovelace.config) {
        try {
          if (Object.keys(pair[1]).length) dialogConfig[pair[0]] = pair[1];
          else delete dialogConfig[pair[0]];
        } catch (e) {}
      }
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

  // ---------------------------------------------------------------------------
  // Canal éditeur <-> aperçu

  const previewBus = { draft: null, cards: new Set(), editors: new Set() };

  function setDraft(config) {
    if (JSON.stringify(config) === JSON.stringify(previewBus.draft)) return;
    previewBus.draft = config;
    previewBus.cards.forEach(function (card) {
      card._build();
    });
  }

  function requestAddCard() {
    previewBus.editors.forEach(function (editor) {
      editor._addCard();
    });
  }

  // ---------------------------------------------------------------------------
  // Carte / élément / ligne

  const BASE_STYLE =
    ":host{display:block}" +
    ".dp-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;margin-top:8px;padding:14px;" +
    "border:2px dashed var(--divider-color,#8886);border-radius:var(--ha-card-border-radius,12px);background:transparent;" +
    "color:var(--secondary-text-color);font:inherit;font-size:14px;cursor:pointer}" +
    ".dp-add:hover{color:var(--primary-color);border-color:var(--primary-color)}" +
    ".dp-error{padding:12px 16px;color:var(--error-color,#db4437);" +
    "background:var(--ha-card-background,var(--card-background-color,#fff));border-radius:var(--ha-card-border-radius,12px);" +
    "border:1px solid var(--error-color,#db4437);font-size:14px}";

  class DeclutterPlusBase extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._child = null;
      this._rendered = null;
      this._signature = null;
      this._editMode = false;
      this._preview = false;
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
      if (this._child) this._child.hass = hass;
      if (first) this._build();
    }

    get hass() {
      return this._hass;
    }

    set editMode(v) {
      this._editMode = v;
      if (this._child) this._child.editMode = v;
    }

    get editMode() {
      return this._editMode;
    }

    set preview(v) {
      this._preview = v;
      if (this._child) this._child.preview = v;
      if (this.constructor.kind === "card" && v) previewBus.cards.add(this);
      else previewBus.cards.delete(this);
      this._build();
    }

    get preview() {
      return this._preview;
    }

    connectedCallback() {
      this._entry().listeners.add(this._onLibrary);
      liveCards.add(this);
      if (this._preview && this.constructor.kind === "card") previewBus.cards.add(this);
      this._build();
    }

    disconnectedCallback() {
      this._entry().listeners.delete(this._onLibrary);
      liveCards.delete(this);
      previewBus.cards.delete(this);
    }

    _entry() {
      return libraryEntry((this._config && this._config.library) || SHARED_DASHBOARD);
    }

    _build() {
      if (!this._config) return;
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
      this._syncAddButton(lang);
      if (this._preview && previewBus.draft && this.constructor.kind === "card") {
        this._showDirect(previewBus.draft);
        return;
      }
      if (!name && this._config.paste && this.constructor.kind === "card") {
        this._showDirect(this._config.paste);
        return;
      }
      if (!name) {
        this._showError(t(lang, "chooseTemplate"));
        return;
      }
      const lovelace = findLovelace(this);
      const found = allTemplates(entry, lovelace && lovelace.config)[name];
      const tpl = found && normalizeTemplate(found.raw);
      if (!tpl) {
        this._showError(tSub(lang, "templateNotFound", { name: name }));
        return;
      }
      if (tpl.kind !== this.constructor.kind) {
        this._showError(tSub(lang, "kindMismatch", { name: name, kind: tpl.kind }));
        return;
      }
      const rendered = renderTemplate(tpl, listToObject(this._config.variables));
      const signature = JSON.stringify(rendered);
      if (signature === this._signature && this._child) return;
      this._signature = signature;
      this._rendered = rendered;

      try {
        this._mount(this._createChild(tpl.kind, rendered.config));
      } catch (e) {
        this._showError(tSub(lang, "error", { message: e.message }));
        return;
      }
      if (this._deferred && this.isConnected && tpl.kind === "card") fireEvent(this, "ll-rebuild", {});
      this._deferred = false;
    }

    _createChild(kind, config) {
      return createChild(kind, config);
    }

    _showDirect(config) {
      const rendered = { config: config, grid_options: null };
      const signature = JSON.stringify(rendered);
      if (signature === this._signature && this._child) return;
      this._signature = signature;
      this._rendered = rendered;
      try {
        this._mount(createChild("card", config));
      } catch (e) {
        this._showError(e.message);
      }
    }

    // Bouton « Ajouter une carte » sous l'aperçu, uniquement dans l'éditeur
    _syncAddButton(lang) {
      let btn = this.shadowRoot.querySelector(".dp-add");
      if (!(this._preview && this.constructor.kind === "card")) {
        if (btn) btn.remove();
        return;
      }
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dp-add";
        btn.addEventListener("click", function (ev) {
          ev.stopPropagation();
          requestAddCard();
        });
        this.shadowRoot.appendChild(btn);
      }
      btn.textContent = "+  " + t(lang, "addCard");
    }

    _mount(child) {
      const self = this;
      child.addEventListener("ll-rebuild", function (ev) {
        ev.stopPropagation();
        if (!self._rendered || self._child !== child) return;
        try {
          self._mount(self._createChild(self.constructor.kind, self._rendered.config));
        } catch (e) {}
      });
      if (this._hass) child.hass = this._hass;
      child.editMode = this._editMode;
      child.preview = this._preview;
      if (this._child && this._child.parentNode) this._child.parentNode.removeChild(this._child);
      const err = this.shadowRoot.querySelector(".dp-error");
      if (err) err.remove();
      this._child = child;
      this.shadowRoot.insertBefore(child, this.shadowRoot.querySelector(".dp-add"));
    }

    _showError(message) {
      if (this._child && this._child.parentNode) this._child.parentNode.removeChild(this._child);
      this._child = null;
      this._signature = null;
      let err = this.shadowRoot.querySelector(".dp-error");
      if (!err) {
        err = document.createElement("div");
        err.className = "dp-error";
        this.shadowRoot.insertBefore(err, this.shadowRoot.querySelector(".dp-add"));
      }
      err.textContent = message;
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
    else delete field.label;
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

  // Template existant -> brouillon : les variables exactes deviennent des chemins
  // et reprennent leur valeur par défaut dans la carte concrète.
  function draftFromTemplate(name, found) {
    const tpl = normalizeTemplate(found.raw);
    const card = clone(tpl.config);
    const vars = [];
    const extra = clone(tpl.defaults);
    leafPaths(card).forEach(function (leaf) {
      if (typeof leaf.value !== "string") return;
      const m = leaf.value.match(EXACT_VAR_RE);
      if (!m) return;
      const def = tpl.defaults[m[1]];
      const bindable = hasVar(tpl.defaults, m[1]) && !(typeof def === "string" && VAR_RE.test(def)) && typeof def !== "object";
      VAR_RE.lastIndex = 0;
      if (!bindable) return;
      setPath(card, leaf.path, def);
      delete extra[m[1]];
      const field = tpl.fields[m[1]];
      vars.push({ name: m[1], path: leaf.path, label: (isObject(field) && field.label) || "" });
    });
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
      grid_options: clone(tpl.grid_options),
      yamlInvalid: false
    };
  }

  function bindDefaultVars(ed) {
    if (!isObject(ed.card)) return;
    if (typeof ed.card.entity === "string" && !ed.vars.some(function (v) {
      return samePath(v.path, ["entity"]);
    })) {
      ed.vars.push({ name: "entity", path: ["entity"], label: "" });
    }
  }

  // Brouillon -> format stocké (compatible decluttering-card).
  function draftToRaw(ed) {
    const config = clone(ed.card);
    const defaults = Object.assign({}, ed.extraDefaults);
    const fields = {};
    const oldFields = isObject(ed.fields) ? ed.fields : {};
    Object.keys(oldFields).forEach(function (k) {
      if (hasVar(ed.extraDefaults, k) || collectVars(config).has(k)) fields[k] = oldFields[k];
    });
    ed.vars.forEach(function (v) {
      const value = getPath(ed.card, v.path);
      if (value === undefined) return;
      setPath(config, v.path, "[[" + v.name + "]]");
      if (!hasVar(defaults, v.name)) defaults[v.name] = value;
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

  // ---------------------------------------------------------------------------
  // Éditeur graphique

  const EDITOR_STYLE = `
    :host { display:block; }
    .panel { display:block; margin-bottom:12px; }
    details.panel { border:1px solid var(--divider-color); border-radius:12px; padding:8px 12px; }
    details.panel summary { cursor:pointer; font-weight:500; padding:4px 0; }
    .body { padding:8px 12px 12px; }
    .bar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin:8px 0; }
    .grow { flex:1; min-width:160px; color:var(--secondary-text-color); font-size:13px; }
    .notice { padding:10px 12px; border-radius:8px; background:var(--secondary-background-color); font-size:13px; margin-bottom:12px; }
    .notice.err { color:var(--error-color); }
    .notice.ok { color:var(--success-color, #43a047); }
    .help { font-size:13px; color:var(--secondary-text-color); margin:4px 0 8px; line-height:1.45; }
    ul.help { padding-left:18px; }
    button.dp { font:inherit; font-size:13px; padding:6px 12px; border-radius:18px; cursor:pointer;
      border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); }
    button.dp.primary { background:var(--primary-color); color:var(--text-primary-color,#fff); border-color:var(--primary-color); }
    button.dp.danger { color:var(--error-color); border-color:var(--error-color); }
    button.dp.link { border:none; background:none; color:var(--primary-color); padding:6px 4px; }
    input.text, select.text { box-sizing:border-box; width:100%; font:inherit; padding:8px 10px; border-radius:8px;
      border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); }
    label.lbl { display:block; font-size:12px; color:var(--secondary-text-color); margin:10px 0 4px; }
    .gallery { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; margin-top:8px;
      max-height:480px; overflow:auto; padding:2px; }
    .tile { border:2px solid var(--divider-color); border-radius:12px; overflow:hidden; cursor:pointer;
      background:var(--primary-background-color); display:flex; flex-direction:column; }
    .tile.sel { border-color:var(--primary-color); box-shadow:0 0 0 2px var(--primary-color); }
    .thumb { height:130px; overflow:hidden; pointer-events:none; }
    .thumb .scale { zoom:.55; width:182%; padding:6px; box-sizing:border-box; }
    .thumb .none { display:flex; align-items:center; justify-content:center; height:100%; font-size:12px;
      color:var(--secondary-text-color); padding:8px; text-align:center; }
    .meta { padding:6px 8px; border-top:1px solid var(--divider-color); background:var(--card-background-color); }
    .name { font-weight:500; font-size:13px; word-break:break-all; }
    .desc { font-size:11px; color:var(--secondary-text-color); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .badge { display:inline-block; font-size:10px; padding:1px 6px; border-radius:8px; margin-top:2px;
      background:var(--secondary-background-color); color:var(--secondary-text-color); }
    .badge.shared { background:var(--primary-color); color:var(--text-primary-color,#fff); }
    .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:0 10px; }
    @media (max-width:600px) { .grid2 { grid-template-columns:1fr; } }
    h4 { font-size:14px; font-weight:500; margin:16px 0 4px; }
    .native { display:block; margin-top:8px; }
    .var-row { display:grid; grid-template-columns:1fr 1fr auto; gap:6px; align-items:end; margin-bottom:6px; }
    .var-row .path { grid-column:1 / -1; font-size:11px; color:var(--secondary-text-color); font-family:monospace; margin-top:6px; }
    textarea.code { box-sizing:border-box; width:100%; min-height:140px; font-family:monospace; font-size:12px; }
  `;

  class DeclutterPlusCardEditor extends HTMLElement {
    constructor() {
      super();
      this._config = {};
      this._hass = null;
      this.lovelace = null; // LovelaceConfig transmise par HA
      this._search = "";
      this._editing = null;
      this._message = null;
      this._previews = [];
      this._built = false;
      this._lastLang = null;
      this._nativeOk = null;
      this._onLibrary = this._render.bind(this);
      this.attachShadow({ mode: "open" });
    }

    setConfig(config) {
      this._config = Object.assign({}, config);
      if (isObject(this._config.paste) && !this._editing) {
        this._startFromCard(this._config.paste);
        this._message = { text: t(this._lang(), "pasteHint"), type: "ok" };
        this._render();
        return;
      }
      if (this._built) this._renderSelection();
      else this._render();
    }

    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      if (first) {
        loadHelpers().then(this._render.bind(this), function () {});
        loadLibrary(hass, this._path()).then(this._render.bind(this));
      } else if (resolveLang(hass) !== this._lastLang) {
        this._render();
        return;
      }
      this._previews.forEach(function (p) {
        p.hass = hass;
      });
      this.shadowRoot.querySelectorAll("ha-form, hui-card-picker, hui-card-element-editor, ha-yaml-editor").forEach(function (el) {
        el.hass = hass;
      });
    }

    connectedCallback() {
      this._entry().listeners.add(this._onLibrary);
      previewBus.editors.add(this);
    }

    disconnectedCallback() {
      this._entry().listeners.delete(this._onLibrary);
      previewBus.editors.delete(this);
      setDraft(null);
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
          else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), attrs[k]);
          else el.setAttribute(k, attrs[k]);
        });
      }
      (children || []).forEach(function (c) {
        if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
      return el;
    }

    _button(label, onClick, cls) {
      return this._el("button", { class: "dp " + (cls || ""), type: "button", text: label, onclick: onClick });
    }

    _panel(cls, title, icon, expanded, content) {
      let panel;
      if (customElements.get("ha-expansion-panel")) {
        panel = document.createElement("ha-expansion-panel");
        panel.outlined = true;
        panel.header = title;
        panel.expanded = !!expanded;
        if (customElements.get("ha-icon")) {
          const ic = document.createElement("ha-icon");
          ic.setAttribute("slot", "leading-icon");
          ic.icon = icon;
          panel.appendChild(ic);
        }
      } else {
        panel = document.createElement("details");
        panel.open = !!expanded;
        panel.appendChild(this._el("summary", { text: title }));
      }
      panel.className = "panel " + cls;
      content.classList.add("body");
      panel.appendChild(content);
      return panel;
    }

    _scopeLabel(lang, scope) {
      return t(lang, scope === SCOPE_SHARED ? "scopeShared" : scope === SCOPE_LEGACY ? "scopeLegacy" : "scopeLocal");
    }

    // Rendu complet
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
      const hasTemplate = !!this._config.template;
      const editing = !!this._editing;
      root.appendChild(this._panel("panel-template", t(lang, "panelTemplate"), "mdi:view-grid-outline", !hasTemplate && !editing, this._renderGallery(lang)));
      root.appendChild(this._panel("panel-variables", t(lang, "panelVariables"), "mdi:variable", hasTemplate && !editing, this._el("div", { class: "variables" })));
      root.appendChild(this._panel("panel-create", t(lang, "panelCreate"), "mdi:pencil-plus-outline", editing, this._el("div", { class: "template-editor" })));
      root.appendChild(this._panel("panel-storage", t(lang, "panelStorage"), "mdi:database-outline", false, this._renderStorage(lang)));
      this._renderSelection();
    }

    _renderSelection() {
      const lang = this._lang();
      const root = this.shadowRoot;
      root.querySelectorAll(".tile").forEach((tile) => {
        tile.classList.toggle("sel", tile.dataset.name === this._config.template);
      });
      const vars = root.querySelector(".variables");
      if (vars) this._renderVariables(vars, lang);
      const ed = root.querySelector(".template-editor");
      if (ed) this._renderTemplateEditor(ed, lang);
    }

    // --- Stockage

    _renderStorage(lang) {
      const entry = this._entry();
      const admin = isAdmin(this._hass);
      const box = this._el("div");
      box.appendChild(this._el("div", { class: "help", text: t(lang, "storageIntro") }));
      box.appendChild(
        this._el("ul", { class: "help" }, [
          this._el("li", { text: t(lang, "storageLocal") }),
          this._el("li", { text: tSub(lang, "storageShared", { title: SHARED_TITLE }) })
        ])
      );
      const loc = localTemplates(this._dashConfig());
      box.appendChild(
        this._el("div", { class: "grow", text: tSub(lang, "localCount", { count: Object.keys(loc.local).length + Object.keys(loc.legacy).length }) })
      );
      const bar = this._el("div", { class: "bar" });
      if (!entry.loaded) {
        bar.appendChild(this._el("span", { class: "grow", text: "…" }));
      } else if (entry.missing) {
        bar.appendChild(this._el("span", { class: "grow", text: t(lang, admin ? "sharedMissing" : "sharedMissingUser") }));
        if (admin) bar.appendChild(this._button(t(lang, "sharedCreate"), () => this._run(createShared(this._hass, entry.path, lang)), "primary"));
      } else {
        const text = entry.error
          ? tSub(lang, "error", { message: entry.error.message || entry.error.code })
          : tSub(lang, "sharedCount", { count: Object.keys(entry.templates).length });
        bar.appendChild(this._el("span", { class: "grow", text: text }));
        bar.appendChild(
          this._el("a", { href: "/" + entry.path, target: "_blank", rel: "noopener" }, [this._button(t(lang, "sharedOpen"), null, "link")])
        );
      }
      bar.appendChild(this._button(t(lang, "reload"), () => this._run(loadLibrary(this._hass, entry.path, true)), "link"));
      box.appendChild(bar);

      const legacyNames = Object.keys(loc.legacy);
      if (admin && entry.loaded && !entry.missing && legacyNames.length) {
        const count = legacyNames.length;
        box.appendChild(
          this._button(tSub(lang, "importLegacy", { count: count }), () =>
            this._run(
              saveShared(this._hass, entry.path, function (lib) {
                legacyNames.forEach(function (n) {
                  if (!hasVar(lib, n)) lib[n] = clone(loc.legacy[n]);
                });
              }).then(() =>
                saveLocal(this._lovelaceObj(), this.lovelace, function (local, legacy) {
                  legacyNames.forEach(function (n) {
                    delete legacy[n];
                  });
                })
              ),
              tSub(lang, "importDone", { count: count })
            )
          )
        );
      }
      return box;
    }

    // --- Galerie

    _renderGallery(lang) {
      const box = this._el("div");
      const templates = this._templates();
      const search = this._el("input", { class: "text", type: "search", placeholder: t(lang, "search") });
      search.value = this._search;
      const grid = this._el("div", { class: "gallery" });
      box.appendChild(search);
      box.appendChild(grid);

      const fill = () => {
        grid.innerHTML = "";
        this._previews = [];
        const q = this._search.toLowerCase();
        const names = Object.keys(templates)
          .sort()
          .filter(function (n) {
            const d = (templates[n].raw && templates[n].raw.description) || "";
            return !q || n.toLowerCase().indexOf(q) !== -1 || String(d).toLowerCase().indexOf(q) !== -1;
          });
        if (!names.length) {
          grid.appendChild(this._el("div", { class: "help", text: t(lang, "noTemplates") }));
          return;
        }
        names.forEach((name, idx) => {
          const found = templates[name];
          const tpl = normalizeTemplate(found.raw);
          const tile = this._el("div", { class: "tile" });
          tile.dataset.name = name;
          if (name === this._config.template) tile.classList.add("sel");
          const thumb = this._el("div", { class: "thumb" });
          if (tpl && tpl.kind === "card" && helpers && idx < PREVIEW_LIMIT) {
            const scale = this._el("div", { class: "scale" });
            try {
              const card = createChild("card", renderTemplate(tpl, {}).config);
              card.hass = this._hass;
              card.preview = true;
              scale.appendChild(card);
              this._previews.push(card);
            } catch (e) {}
            thumb.appendChild(scale);
          } else {
            thumb.appendChild(this._el("div", { class: "none", text: tSub(lang, "noPreview", { kind: tpl ? tpl.kind : "?" }) }));
          }
          tile.appendChild(thumb);
          tile.appendChild(
            this._el("div", { class: "meta" }, [
              this._el("div", { class: "name", text: name }),
              this._el("div", { class: "desc", text: (tpl && tpl.description) || "" }),
              this._el("span", { class: "badge" + (found.scope === SCOPE_SHARED ? " shared" : ""), text: this._scopeLabel(lang, found.scope) })
            ])
          );
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

    _select(name) {
      if (name === this._config.template && !this._config.paste) return;
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
      this._editing = null;
      setDraft(null);
      this._changed(next);
      this._render();
    }

    // --- Variables de la carte

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

    _renderVariables(box, lang) {
      const name = this._config.template;
      const found = name && this._templates()[name];
      const stamp = JSON.stringify(found || null);
      // Ne pas recréer le formulaire à chaque config-changed (perte du focus)
      const existing = box.querySelector("ha-form");
      if (existing && box._template === name && box._stamp === stamp) {
        existing.data = listToObject(this._config.variables);
        return;
      }
      box._template = name;
      box._stamp = stamp;
      box.innerHTML = "";
      const tpl = found && normalizeTemplate(found.raw);
      if (!tpl) return;

      const names = new Set(Object.keys(tpl.fields));
      collectVars(tpl.config).forEach(function (v) {
        names.add(v);
      });
      Object.keys(tpl.defaults).forEach(function (v) {
        names.add(v);
      });
      if (!names.size) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "noVariables") }));
        return;
      }
      const fields = tpl.fields;
      const schema = Array.from(names).map((v) => {
        const f = isObject(fields[v]) ? fields[v] : {};
        const item = { name: v, selector: isObject(f.selector) ? f.selector : this._guessSelector(v, tpl.defaults[v]) };
        if (f.required) item.required = true;
        return item;
      });
      const data = listToObject(this._config.variables);

      if (!customElements.get("ha-form")) {
        box.appendChild(this._renderVariablesFallback(schema, data));
        return;
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
      box.appendChild(form);
    }

    _renderVariablesFallback(schema, data) {
      const wrap = this._el("div");
      schema.forEach((s) => {
        const input = this._el("input", { class: "text" });
        input.value = hasVar(data, s.name) ? valueToText(data[s.name]) : "";
        input.addEventListener("change", () => {
          const vars = listToObject(this._config.variables);
          if (input.value === "") delete vars[s.name];
          else vars[s.name] = input.value;
          const next = Object.assign({}, this._config);
          if (Object.keys(vars).length) next.variables = vars;
          else delete next.variables;
          this._changed(next);
        });
        wrap.appendChild(this._el("label", { class: "lbl", text: s.name }));
        wrap.appendChild(input);
      });
      return wrap;
    }

    // --- Création / édition de template

    _addCard() {
      if (!this._editing) this._startNew();
      else if (this._editing.kind === "card") this._editing.card = null;
      this._message = null;
      setDraft(null);
      this._render();
      const panel = this.shadowRoot.querySelector(".panel-create");
      if (panel) {
        panel.expanded = true;
        panel.open = true;
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    _startNew() {
      const shared = this._entry();
      this._editing = {
        originalName: null,
        originScope: null,
        name: "",
        description: "",
        kind: "card",
        scope: shared.loaded && !shared.missing ? SCOPE_SHARED : SCOPE_LOCAL,
        card: null,
        vars: [],
        extraDefaults: {},
        fields: {},
        grid_options: null,
        yamlInvalid: false
      };
    }

    _startEdit(name) {
      const found = this._templates()[name];
      if (!found || !normalizeTemplate(found.raw)) return;
      this._editing = draftFromTemplate(name, found);
      this._message = null;
      this._render();
    }

    _startFromCard(card) {
      if (!this._editing) this._startNew();
      this._setCard(clone(card));
    }

    _setCard(card) {
      const ed = this._editing;
      if (isObject(card) && isObject(card.grid_options)) {
        ed.grid_options = card.grid_options;
        delete card.grid_options;
      }
      if (isObject(card)) {
        delete card.view_layout;
        delete card.layout_options;
        delete card.visibility;
      }
      ed.card = card;
      ed.vars = [];
      bindDefaultVars(ed);
      if (!ed.name && isObject(card)) {
        const base = String(card.type || t(this._lang(), "untitledCard")).replace(/^custom:/, "").replace(/[^A-Za-z0-9_-]/g, "_");
        ed.name = base + "_template";
      }
    }

    _renderTemplateEditor(box, lang) {
      if (this._editing && box._editing === this._editing) return;
      box._editing = this._editing;
      box.innerHTML = "";
      if (!isAdmin(this._hass)) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "adminOnly") }));
        return;
      }
      if (!this._editing) {
        const bar = this._el("div", { class: "bar" });
        bar.appendChild(this._button("+ " + t(lang, "addCard"), () => this._addCard(), "primary"));
        const found = this._config.template && this._templates()[this._config.template];
        if (found && normalizeTemplate(found.raw)) {
          bar.appendChild(this._button(t(lang, "editTemplate"), () => this._startEdit(this._config.template)));
        }
        box.appendChild(bar);
        return;
      }

      const ed = this._editing;
      const entry = this._entry();

      const nameInput = this._el("input", { class: "text" });
      nameInput.value = ed.name;
      nameInput.addEventListener("input", function () {
        ed.name = nameInput.value.trim();
      });
      const scopeSelect = this._el("select", { class: "text" });
      [SCOPE_LOCAL, SCOPE_SHARED].forEach((scope) => {
        const opt = this._el("option", { value: scope, text: this._scopeLabel(lang, scope) });
        if (scope === SCOPE_SHARED && (!entry.loaded || entry.missing)) opt.disabled = true;
        if (ed.scope === scope) opt.selected = true;
        scopeSelect.appendChild(opt);
      });
      scopeSelect.addEventListener("change", function () {
        ed.scope = scopeSelect.value;
      });
      box.appendChild(
        this._el("div", { class: "grid2" }, [
          this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldName") }), nameInput]),
          this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldScope") }), scopeSelect])
        ])
      );

      const descInput = this._el("input", { class: "text" });
      descInput.value = ed.description;
      descInput.addEventListener("input", function () {
        ed.description = descInput.value;
      });
      const kindSelect = this._el("select", { class: "text" });
      [
        ["card", "kindCard"],
        ["element", "kindElement"],
        ["row", "kindRow"]
      ].forEach((k) => {
        const opt = this._el("option", { value: k[0], text: t(lang, k[1]) });
        if (ed.kind === k[0]) opt.selected = true;
        kindSelect.appendChild(opt);
      });
      kindSelect.addEventListener("change", () => {
        ed.kind = kindSelect.value;
        if (ed.kind !== "card" && !isObject(ed.card)) ed.card = {};
        this._renderCardSection(box.querySelector(".card-section"), lang);
      });
      box.appendChild(
        this._el("div", { class: "grid2" }, [
          this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldDescription") }), descInput]),
          this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldKind") }), kindSelect])
        ])
      );

      box.appendChild(this._el("div", { class: "card-section" }));
      box.appendChild(this._el("div", { class: "vars-section" }));

      const bar = this._el("div", { class: "bar" });
      bar.style.marginTop = "16px";
      bar.appendChild(this._button(t(lang, "save"), () => this._saveEdit(lang), "primary"));
      if (ed.originalName) bar.appendChild(this._button(t(lang, "remove"), () => this._deleteEdit(lang), "danger"));
      bar.appendChild(
        this._button(t(lang, "cancel"), () => {
          this._editing = null;
          setDraft(null);
          this._render();
        })
      );
      box.appendChild(bar);

      this._renderCardSection(box.querySelector(".card-section"), lang);
    }

    _renderCardSection(section, lang) {
      const ed = this._editing;
      section.innerHTML = "";
      if (ed.kind === "card" && !isObject(ed.card)) {
        this._renderPicker(section, lang);
      } else if (ed.kind === "card") {
        this._renderNativeEditor(section, lang);
      } else {
        section.appendChild(this._el("label", { class: "lbl", text: t(lang, "fieldConfig") }));
        section.appendChild(this._yamlEditor(ed.card, (value) => this._cardChanged(value)));
      }
      this._renderVars(lang);
      this._pushDraft();
    }

    _renderPicker(section, lang) {
      section.appendChild(this._el("h4", { text: t(lang, "pickCard") }));
      const bar = this._el("div", { class: "bar" });
      bar.appendChild(
        this._button(t(lang, "fromClipboard"), () => {
          readCopiedCard().then((card) => {
            if (!card) {
              this._notifyInline(section, t(lang, "clipboardEmpty"));
              return;
            }
            this._setCard(card);
            this._rerenderEditor();
          });
        })
      );
      section.appendChild(bar);
      const cards = listDashboardCards(this._dashConfig());
      if (cards.length) {
        const pick = this._el("select", { class: "text" });
        pick.appendChild(this._el("option", { value: "", text: t(lang, "fromDashboard") }));
        cards.forEach((c, i) => {
          pick.appendChild(this._el("option", { value: String(i), text: c.label }));
        });
        pick.addEventListener("change", () => {
          if (pick.value === "") return;
          this._setCard(clone(cards[Number(pick.value)].config));
          this._rerenderEditor();
        });
        section.appendChild(pick);
      }
      const holder = this._el("div", { class: "native" });
      section.appendChild(holder);
      loadNativeEditors().then((ok) => {
        if (!holder.isConnected) return;
        if (!ok) {
          holder.appendChild(this._el("div", { class: "help", text: t(lang, "nativeUnavailable") }));
          holder.appendChild(
            this._yamlEditor({ type: "tile", entity: "" }, (value) => {
              if (isObject(value) && value.type) {
                this._setCard(value);
                this._rerenderEditor();
              }
            })
          );
          return;
        }
        const picker = document.createElement("hui-card-picker");
        picker.hass = this._hass;
        picker.lovelace = this._dashConfig() || { views: [] };
        picker.addEventListener("config-changed", (ev) => {
          ev.stopPropagation();
          const config = ev.detail && ev.detail.config;
          if (!isObject(config) || String(config.type).indexOf("custom:declutter-plus") === 0) return;
          this._setCard(clone(config));
          this._rerenderEditor();
        });
        holder.appendChild(picker);
      });
    }

    _renderNativeEditor(section, lang) {
      const ed = this._editing;
      const bar = this._el("div", { class: "bar" });
      const changeBtn = this._button(t(lang, "changeCard"), () => {
        ed.card = null;
        ed.vars = [];
        this._renderCardSection(section, lang);
      });
      const modeBtn = this._button(t(lang, "codeEditor"), null, "link");
      bar.appendChild(this._el("h4", { class: "grow", text: String(ed.card.type || "") }));
      bar.appendChild(modeBtn);
      bar.appendChild(changeBtn);
      section.appendChild(bar);
      const holder = this._el("div", { class: "native" });
      section.appendChild(holder);
      loadNativeEditors().then((ok) => {
        if (!holder.isConnected) return;
        if (!ok) {
          modeBtn.remove();
          holder.appendChild(this._yamlEditor(ed.card, (value) => this._cardChanged(value)));
          return;
        }
        const editor = document.createElement("hui-card-element-editor");
        editor.hass = this._hass;
        editor.lovelace = this._dashConfig() || { views: [] };
        editor.value = ed.card;
        editor.addEventListener("config-changed", (ev) => {
          ev.stopPropagation();
          if (ev.detail && isObject(ev.detail.config)) this._cardChanged(ev.detail.config);
        });
        editor.addEventListener("GUImode-changed", (ev) => {
          ev.stopPropagation();
          const gui = ev.detail && ev.detail.guiMode !== false;
          modeBtn.textContent = t(lang, gui ? "codeEditor" : "visualEditor");
        });
        modeBtn.addEventListener("click", function () {
          if (typeof editor.toggleMode === "function") editor.toggleMode();
        });
        holder.appendChild(editor);
      });
    }

    _yamlEditor(value, onChange) {
      const ed = this._editing;
      if (customElements.get("ha-yaml-editor")) {
        const yaml = document.createElement("ha-yaml-editor");
        yaml.hass = this._hass;
        yaml.defaultValue = value;
        yaml.addEventListener("value-changed", (ev) => {
          ev.stopPropagation();
          ed.yamlInvalid = ev.detail.isValid === false;
          if (!ed.yamlInvalid) onChange(ev.detail.value);
        });
        return yaml;
      }
      // Repli JSON si l'éditeur YAML de HA n'est pas chargé
      const area = this._el("textarea", { class: "code" });
      area.value = JSON.stringify(value || {}, null, 2);
      area.addEventListener("input", () => {
        try {
          const parsed = JSON.parse(area.value || "{}");
          ed.yamlInvalid = false;
          onChange(parsed);
        } catch (e) {
          ed.yamlInvalid = true;
        }
      });
      return area;
    }

    _rerenderEditor() {
      const box = this.shadowRoot.querySelector(".template-editor");
      if (!box) return;
      box._editing = null;
      this._renderTemplateEditor(box, this._lang());
    }

    _notifyInline(section, text) {
      const note = this._el("div", { class: "notice err", text: text });
      section.insertBefore(note, section.firstChild);
      setTimeout(function () {
        note.remove();
      }, 5000);
    }

    _cardChanged(config) {
      const ed = this._editing;
      if (!ed) return;
      ed.card = config;
      // variables dont le réglage a disparu
      ed.vars = ed.vars.filter(function (v) {
        return getPath(config, v.path) !== undefined;
      });
      this._renderVars(this._lang());
      this._pushDraft();
    }

    _pushDraft() {
      const ed = this._editing;
      setDraft(ed && ed.kind === "card" && isObject(ed.card) && ed.card.type ? clone(ed.card) : null);
    }

    _renderVars(lang) {
      const ed = this._editing;
      const section = this.shadowRoot.querySelector(".vars-section");
      if (!section || !ed) return;
      // ne pas recréer les champs en cours de saisie
      const signature = JSON.stringify([ed.vars.map((v) => v.path), leafPaths(ed.card || {}).map((l) => l.path)]);
      if (section._signature === signature) {
        section.querySelectorAll(".var-value").forEach(function (el) {
          const v = ed.vars[Number(el.dataset.index)];
          if (v) el.textContent = v.path.join(".") + " = " + valueToText(getPath(ed.card, v.path));
        });
        return;
      }
      section._signature = signature;
      section.innerHTML = "";
      if (!isObject(ed.card)) return;
      section.appendChild(this._el("h4", { text: t(lang, "panelVariables") }));
      section.appendChild(this._el("div", { class: "help", text: t(lang, "varsHelp") }));

      ed.vars.forEach((v, i) => {
        const nameInput = this._el("input", { class: "text", placeholder: t(lang, "varName") });
        nameInput.value = v.name;
        nameInput.addEventListener("input", function () {
          v.name = nameInput.value.trim();
        });
        const labelInput = this._el("input", { class: "text", placeholder: t(lang, "varLabel") });
        labelInput.value = v.label;
        labelInput.addEventListener("input", function () {
          v.label = labelInput.value;
        });
        const row = this._el("div", { class: "var-row" }, [
          this._el("div", { class: "path var-value", text: v.path.join(".") + " = " + valueToText(getPath(ed.card, v.path)) }),
          nameInput,
          labelInput,
          this._button(t(lang, "removeVar"), () => {
            ed.vars.splice(i, 1);
            section._signature = null;
            this._renderVars(lang);
          }, "link")
        ]);
        row.querySelector(".var-value").dataset.index = String(i);
        section.appendChild(row);
      });

      const candidates = leafPaths(ed.card).filter(function (leaf) {
        return !ed.vars.some(function (v) {
          return samePath(v.path, leaf.path);
        });
      });
      candidates.sort(function (a, b) {
        const ea = typeof a.value === "string" && ENTITY_RE.test(a.value) ? 0 : 1;
        const eb = typeof b.value === "string" && ENTITY_RE.test(b.value) ? 0 : 1;
        return ea - eb;
      });
      if (candidates.length) {
        const pick = this._el("select", { class: "text" });
        pick.appendChild(this._el("option", { value: "", text: t(lang, "addVariable") }));
        candidates.forEach(function (c, i) {
          const text = c.path.join(".") + " = " + String(c.value).slice(0, 60);
          pick.appendChild(Object.assign(document.createElement("option"), { value: String(i), textContent: text }));
        });
        pick.addEventListener("change", () => {
          if (pick.value === "") return;
          const leaf = candidates[Number(pick.value)];
          const taken = ed.vars.map((v) => v.name).concat(Object.keys(ed.extraDefaults));
          ed.vars.push({ name: suggestVarName(leaf.path, taken), path: leaf.path, label: "" });
          section._signature = null;
          this._renderVars(lang);
        });
        section.appendChild(pick);
      }

      if (Object.keys(ed.extraDefaults).length) {
        section.appendChild(this._el("label", { class: "lbl", text: t(lang, "extraDefaults") }));
        section.appendChild(
          this._yamlEditor(ed.extraDefaults, function (value) {
            ed.extraDefaults = isObject(value) ? value : {};
          })
        );
      }
    }

    _saveEdit(lang) {
      const ed = this._editing;
      if (!NAME_RE.test(ed.name)) {
        this._notify(t(lang, "invalidName"), "err");
        return;
      }
      if (!isObject(ed.card) || (ed.kind === "card" && !ed.card.type)) {
        this._notify(t(lang, "noCard"), "err");
        return;
      }
      if (ed.yamlInvalid) {
        this._notify(t(lang, "invalidYaml"), "err");
        return;
      }
      const badVar = ed.vars.find(function (v) {
        return !NAME_RE.test(v.name);
      });
      if (badVar) {
        this._notify(t(lang, "invalidName"), "err");
        return;
      }
      const raw = draftToRaw(ed);
      const newName = ed.name;
      const target = ed.scope;
      const origin = ed.originScope;
      const orig = ed.originalName;
      const sameSpot = orig === newName && (origin === target || (origin === SCOPE_LEGACY && target === SCOPE_LOCAL));
      const loc = localTemplates(this._dashConfig());
      const exists = target === SCOPE_SHARED ? hasVar(this._entry().templates, newName) : hasVar(loc.local, newName) || hasVar(loc.legacy, newName);
      if (exists && !sameSpot && !window.confirm(tSub(lang, "confirmOverwrite", { name: newName }))) return;

      const lovelace = this._lovelaceObj();
      const dialogConfig = this.lovelace;
      const hass = this._hass;
      const path = this._path();
      if (target === SCOPE_LOCAL && !lovelace) {
        this._notify(t(lang, "dashboardUnavailable"), "err");
        return;
      }

      let chain;
      if (target === SCOPE_SHARED) {
        chain = saveShared(hass, path, function (lib) {
          if (origin === SCOPE_SHARED && orig && orig !== newName) delete lib[orig];
          lib[newName] = raw;
        });
        if (orig && (origin === SCOPE_LOCAL || origin === SCOPE_LEGACY) && lovelace) {
          chain = chain.then(function () {
            return saveLocal(lovelace, dialogConfig, function (local, legacy) {
              delete (origin === SCOPE_LEGACY ? legacy : local)[orig];
            });
          });
        }
      } else {
        chain = saveLocal(lovelace, dialogConfig, function (local, legacy) {
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

      this._run(
        chain.then(() => {
          this._editing = null;
          setDraft(null);
          const next = Object.assign({}, this._config, { template: newName });
          delete next.paste;
          if (!next.variables && !orig) {
            // nouvelle carte : reprend les valeurs actuelles comme valeurs de la carte
            const values = {};
            ed.vars.forEach(function (v) {
              values[v.name] = getPath(ed.card, v.path);
            });
            if (Object.keys(values).length) next.variables = values;
          }
          this._changed(next);
        }),
        t(lang, "saved")
      );
    }

    _deleteEdit(lang) {
      const ed = this._editing;
      const name = ed.originalName;
      if (!window.confirm(tSub(lang, "confirmDelete", { name: name }))) return;
      const chain =
        ed.originScope === SCOPE_SHARED
          ? saveShared(this._hass, this._path(), function (lib) {
              delete lib[name];
            })
          : saveLocal(this._lovelaceObj(), this.lovelace, function (local, legacy) {
              delete (ed.originScope === SCOPE_LEGACY ? legacy : local)[name];
            });
      this._run(
        chain.then(() => {
          this._editing = null;
          setDraft(null);
        }),
        t(lang, "deleted")
      );
    }

    _notify(text, type) {
      this._message = { text: text, type: type };
      this._render();
    }

    _run(promise, successText) {
      const lang = this._lang();
      return Promise.resolve(promise).then(
        () => {
          this._message = successText ? { text: successText, type: "ok" } : null;
          this._render();
        },
        (err) => {
          const msg = (err && (err.message || err.code)) || String(err);
          this._message = {
            text: msg === "dashboard unavailable" ? t(lang, "dashboardUnavailable") : tSub(lang, "error", { message: msg }),
            type: "err"
          };
          this._render();
        }
      );
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
