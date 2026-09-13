/*
 * Declutter Plus — templates de cartes Lovelace réutilisables, partagés entre
 * dashboards, avec éditeur graphique et aperçus.
 * Compatible avec la syntaxe de decluttering-card.
 */
(function () {
  "use strict";

  const VERSION = "1.0.0";
  const CARD_TAG = "declutter-plus-card";
  const ELEMENT_TAG = "declutter-plus-element";
  const ROW_TAG = "declutter-plus-row";
  const EDITOR_TAG = "declutter-plus-card-editor";
  const PASTE_TAG = "declutter-plus-paste-card";
  const DEFAULT_LIBRARY = "declutter-plus";
  const LIBRARY_KEY = "declutter_plus_templates";
  const LEGACY_KEY = "decluttering_templates";
  const KINDS = ["card", "element", "row"];
  const VAR_RE = /\[\[([A-Za-z0-9_-]+)\]\]/g;
  const EXACT_VAR_RE = /^\[\[([A-Za-z0-9_-]+)\]\]$/;
  const MAX_VAR_PASSES = 10;
  const PREVIEW_LIMIT = 60;
  const FALLBACK_LANG = "en";

  const STRINGS = {
    en: {
      cardName: "Declutter Plus",
      cardDescription: "Reusable card templates shared across dashboards, with a visual editor.",
      templateNotFound: "Template not found: {name}",
      kindMismatch: "Template \"{name}\" is a {kind} template.",
      libraryTitle: "Library",
      libraryMissing: "The shared library dashboard \"{path}\" does not exist yet.",
      libraryMissingUser: "The shared library does not exist yet. Ask an administrator to create it.",
      libraryCreate: "Create library",
      libraryReload: "Reload",
      libraryOpen: "Open library dashboard",
      libraryNote: "This dashboard stores the **Declutter Plus** templates shared by all your dashboards. Edit them from the Declutter Plus card editor.",
      libraryCount: "{count} template(s) in \"{path}\"",
      importLegacy: "Import {count} decluttering-card template(s) from this dashboard",
      importDone: "{count} template(s) imported.",
      search: "Search templates",
      noTemplates: "No template yet. Create your first one below.",
      legacyBadge: "local",
      noPreview: "No preview for {kind} templates",
      selected: "Selected template",
      variables: "Variables",
      noVariables: "This template has no variables.",
      defaultValue: "Default: {value}",
      editTemplate: "Edit this template",
      newTemplate: "New template",
      editorTitle: "Template editor",
      fieldName: "Name",
      fieldDescription: "Description",
      fieldKind: "Type",
      kindCard: "Card",
      kindElement: "Picture element",
      kindRow: "Entities row",
      fieldConfig: "Configuration (use [[variable]] placeholders)",
      fieldDefaults: "Default values",
      fieldFields: "Variable fields (optional: label, selector, required)",
      detected: "Detected variables: {list}",
      save: "Save to library",
      remove: "Delete",
      cancel: "Close",
      confirmDelete: "Delete template \"{name}\"?",
      confirmOverwrite: "Template \"{name}\" already exists. Overwrite?",
      saved: "Template saved.",
      deleted: "Template deleted.",
      invalidName: "Name must contain only letters, digits, _ and -.",
      invalidYaml: "Invalid YAML in \"{field}\".",
      adminOnly: "Only administrators can edit the library.",
      error: "Error: {message}",
      preview: "Preview",
      fromClipboard: "From copied card",
      fromDashboard: "From a card of this dashboard…",
      clipboardEmpty: "No copied card found. Use \"Copy\" in a card menu, or copy its YAML, then try again.",
      untitledCard: "card",
      pasteName: "Declutter Plus: paste copied card",
      pasteDescription: "Turn the card you copied (card menu > Copy) into a reusable template.",
      chooseTemplate: "Choose a template in the card editor.",
      pasteHint: "Pasted card: save it as a template to reuse it.",
      addCard: "Add a card",
      panelTemplate: "Template",
      panelVariables: "Variables",
      panelCreate: "Create or edit a template",
      panelLibrary: "Library"
    },
    fr: {
      cardName: "Declutter Plus",
      cardDescription: "Templates de cartes réutilisables, partagés entre dashboards, avec éditeur graphique.",
      templateNotFound: "Template introuvable : {name}",
      kindMismatch: "Le template « {name} » est de type {kind}.",
      libraryTitle: "Bibliothèque",
      libraryMissing: "Le dashboard bibliothèque « {path} » n'existe pas encore.",
      libraryMissingUser: "La bibliothèque n'existe pas encore. Demandez à un administrateur de la créer.",
      libraryCreate: "Créer la bibliothèque",
      libraryReload: "Recharger",
      libraryOpen: "Ouvrir le dashboard bibliothèque",
      libraryNote: "Ce dashboard contient les templates **Declutter Plus** partagés par tous vos dashboards. Modifiez-les depuis l'éditeur de la carte Declutter Plus.",
      libraryCount: "{count} template(s) dans « {path} »",
      importLegacy: "Importer {count} template(s) decluttering-card de ce dashboard",
      importDone: "{count} template(s) importé(s).",
      search: "Rechercher un template",
      noTemplates: "Aucun template. Créez le premier ci-dessous.",
      legacyBadge: "local",
      noPreview: "Pas d'aperçu pour un template {kind}",
      selected: "Template choisi",
      variables: "Variables",
      noVariables: "Ce template n'a pas de variable.",
      defaultValue: "Défaut : {value}",
      editTemplate: "Modifier ce template",
      newTemplate: "Nouveau template",
      editorTitle: "Éditeur de template",
      fieldName: "Nom",
      fieldDescription: "Description",
      fieldKind: "Type",
      kindCard: "Carte",
      kindElement: "Élément d'image",
      kindRow: "Ligne d'entités",
      fieldConfig: "Configuration (variables [[variable]])",
      fieldDefaults: "Valeurs par défaut",
      fieldFields: "Champs des variables (optionnel : label, selector, required)",
      detected: "Variables détectées : {list}",
      save: "Enregistrer dans la bibliothèque",
      remove: "Supprimer",
      cancel: "Fermer",
      confirmDelete: "Supprimer le template « {name} » ?",
      confirmOverwrite: "Le template « {name} » existe déjà. L'écraser ?",
      saved: "Template enregistré.",
      deleted: "Template supprimé.",
      invalidName: "Le nom ne doit contenir que lettres, chiffres, _ et -.",
      invalidYaml: "YAML invalide dans « {field} ».",
      adminOnly: "Seuls les administrateurs peuvent modifier la bibliothèque.",
      error: "Erreur : {message}",
      preview: "Aperçu",
      fromClipboard: "Depuis la carte copiée",
      fromDashboard: "Depuis une carte de ce dashboard…",
      clipboardEmpty: "Aucune carte copiée. Utilisez « Copier » dans le menu d'une carte, ou copiez son YAML, puis réessayez.",
      untitledCard: "carte",
      pasteName: "Declutter Plus : coller la carte copiée",
      pasteDescription: "Transforme la carte copiée (menu de la carte > Copier) en template réutilisable.",
      chooseTemplate: "Choisissez un template dans l'éditeur de la carte.",
      pasteHint: "Carte collée : enregistrez-la comme template pour la réutiliser.",
      addCard: "Ajouter une carte",
      panelTemplate: "Template",
      panelVariables: "Variables",
      panelCreate: "Créer ou modifier un template",
      panelLibrary: "Bibliothèque"
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
    // decluttering-card : liste de { nom: valeur } ; ici on accepte aussi un objet
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

  // Remplace les [[variables]]. Une chaîne réduite à « [[x]] » reprend la valeur
  // brute (objet, nombre, booléen) : corrige les objets passés en JSON.
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

  // Fusionne défauts et valeurs données, puis résout les variables qui en
  // référencent d'autres (ex. défaut name: "[[entity]]").
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

  // Remonte à travers les shadow roots jusqu'à l'objet lovelace (hui-root/hui-view).
  function findLovelace(start) {
    let el = start;
    let guard = 0;
    while (el && guard < 200) {
      guard++;
      try {
        if (el.lovelace && isObject(el.lovelace.config)) return el.lovelace;
      } catch (e) {}
      el = el.parentNode || el.host;
    }
    return null;
  }

  const CLIPBOARD_KEY = "dashboardCardClipboard";

  function readHaClipboard() {
    try {
      const raw = window.localStorage.getItem(CLIPBOARD_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (isObject(parsed) && typeof parsed.type === "string") return parsed;
    } catch (e) {}
    return null;
  }

  // Presse-papiers de cartes de HA (menu « Copier »), puis presse-papiers système (JSON).
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

  // Liste à plat des cartes du dashboard (vues, sections, cartes imbriquées).
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
    return out;
  }

  // Transforme une carte native en template : entity devient [[entity]].
  function cardToTemplate(card) {
    const config = clone(card);
    const defaults = {};
    const fields = {};
    delete config.view_layout;
    delete config.layout_options;
    let gridOptions = null;
    if (isObject(config.grid_options)) {
      gridOptions = config.grid_options;
      delete config.grid_options;
    }
    if (typeof config.entity === "string" && config.entity) {
      defaults.entity = config.entity;
      config.entity = "[[entity]]";
      fields.entity = { selector: { entity: {} }, required: true };
    }
    return { config: config, defaults: defaults, fields: fields, grid_options: gridOptions };
  }

  function isAdmin(hass) {
    return !!(hass && hass.user && hass.user.is_admin);
  }

  // ---------------------------------------------------------------------------
  // Helpers de cartes HA (chargés une fois)

  let helpers = null;
  let helpersPromise = null;

  function loadHelpers() {
    if (helpers) return Promise.resolve(helpers);
    if (!helpersPromise) {
      helpersPromise = Promise.resolve()
        .then(function () {
          if (typeof window.loadCardHelpers !== "function") {
            throw new Error("loadCardHelpers unavailable");
          }
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

  // ---------------------------------------------------------------------------
  // Bibliothèque partagée (dashboard dédié)

  const libraries = {};

  function libraryEntry(path) {
    if (!libraries[path]) {
      libraries[path] = {
        path: path,
        loaded: false,
        missing: false,
        error: null,
        raw: null,
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
          entry.raw = isObject(config) ? config : {};
          entry.missing = false;
          entry.error = null;
          entry.templates = listToObject(entry.raw[LIBRARY_KEY]);
        },
        function (err) {
          entry.raw = null;
          entry.templates = {};
          entry.missing = isNotFound(err);
          entry.error = entry.missing ? null : err;
          if (!entry.missing) console.warn("[declutter-plus] library load failed", err);
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

  function saveLibraryTemplates(hass, path, mutate) {
    return hass
      .callWS({ type: "lovelace/config", url_path: path, force: true })
      .then(function (config) {
        const next = Object.assign({}, config);
        next[LIBRARY_KEY] = listToObject(next[LIBRARY_KEY]);
        mutate(next[LIBRARY_KEY]);
        return hass.callWS({ type: "lovelace/config/save", url_path: path, config: next });
      })
      .then(function () {
        return loadLibrary(hass, path, true);
      });
  }

  function createLibrary(hass, path, lang) {
    const base = {
      url_path: path,
      title: "Declutter Plus",
      icon: "mdi:puzzle-outline",
      show_in_sidebar: false,
      require_admin: false
    };
    const config = { views: [{ title: "Declutter Plus", cards: [{ type: "markdown", content: t(lang, "libraryNote") }] }] };
    config[LIBRARY_KEY] = {};
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

  // Bibliothèque partagée d'abord, puis templates decluttering-card du dashboard courant.
  function lookupTemplate(entry, lovelace, name) {
    if (entry && hasVar(entry.templates, name)) return { raw: entry.templates[name], legacy: false };
    const local = lovelace && lovelace.config ? listToObject(lovelace.config[LEGACY_KEY]) : {};
    if (hasVar(local, name)) return { raw: local[name], legacy: true };
    return null;
  }

  function allTemplates(entry, lovelace) {
    const out = {};
    const local = lovelace && lovelace.config ? listToObject(lovelace.config[LEGACY_KEY]) : {};
    Object.keys(local).forEach(function (name) {
      out[name] = { raw: local[name], legacy: true };
    });
    if (entry) {
      Object.keys(entry.templates).forEach(function (name) {
        out[name] = { raw: entry.templates[name], legacy: false };
      });
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Canal éditeur <-> aperçu : brouillon affiché par les cartes en aperçu

  const previewBus = { draft: null, cards: new Set(), editors: new Set() };

  function setDraft(config) {
    previewBus.draft = config;
    previewBus.cards.forEach(function (card) {
      card._build();
    });
  }

  function requestAddCard() {
    previewBus.editors.forEach(function (editor) {
      editor._focusCreate();
    });
  }

  // ---------------------------------------------------------------------------
  // Carte / élément / ligne

  const BASE_STYLE = ":host{display:block}.dp-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;margin-top:8px;padding:14px;" +
    "border:2px dashed var(--divider-color,#8886);border-radius:var(--ha-card-border-radius,12px);background:transparent;" +
    "color:var(--secondary-text-color);font:inherit;font-size:14px;cursor:pointer}.dp-add:hover{color:var(--primary-color);border-color:var(--primary-color)}" +
    ".dp-error{padding:12px 16px;color:var(--error-color,#db4437);" +
    "background:var(--ha-card-background,var(--card-background-color,#fff));border-radius:var(--ha-card-border-radius,12px);" +
    "border:1px solid var(--error-color,#db4437);font-size:14px}";

  class DeclutterPlusBase extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._child = null;
      this._signature = null;
      this._editMode = false;
      this._preview = false;
      this._deferred = false;
      this._onLibrary = this._build.bind(this);
      this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = BASE_STYLE + (this.constructor.kind === "row" ? "" : "");
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
      this._build();
    }

    disconnectedCallback() {
      this._entry().listeners.delete(this._onLibrary);
      previewBus.cards.delete(this);
    }

    _entry() {
      return libraryEntry((this._config && this._config.library) || DEFAULT_LIBRARY);
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
      const found = lookupTemplate(entry, findLovelace(this), name);
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

      let child;
      try {
        child = this._createChild(tpl.kind, rendered.config);
      } catch (e) {
        this._showError(tSub(lang, "error", { message: e.message }));
        return;
      }
      this._mount(child);

      if (this._deferred && this.isConnected && tpl.kind === "card") {
        this._deferred = false;
        fireEvent(this, "ll-rebuild", {});
      }
      this._deferred = false;
    }

    _createChild(kind, config) {
      return createChild(kind, config);
    }

    _showDirect(config) {
      const rendered = { config: config, grid_options: null };
      const sig = JSON.stringify(rendered);
      if (sig === this._signature && this._child) return;
      this._signature = sig;
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
      const wanted = this._preview && this.constructor.kind === "card";
      if (!wanted) {
        if (btn) btn.remove();
        return;
      }
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dp-add";
        btn.addEventListener("click", requestAddCard);
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
      const entry = libraries[DEFAULT_LIBRARY];
      const names = entry ? Object.keys(entry.templates) : [];
      return { template: names[0] || "" };
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
  // Éditeur graphique

  const NAME_RE = /^[A-Za-z0-9_-]+$/;

  const EDITOR_STYLE = `
    :host { display:block; }
    .section { margin-bottom:16px; }
    .panel { display:block; margin-bottom:12px; --expansion-panel-content-padding:0 12px 12px; }
    details.panel { border:1px solid var(--divider-color); border-radius:12px; padding:8px 12px; }
    details.panel summary { cursor:pointer; font-weight:500; padding:4px 0; }
    .variables, .template-editor { padding-top:8px; }
    .bar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:8px; }
    .bar .grow { flex:1; min-width:160px; color:var(--secondary-text-color); font-size:13px; }
    .notice { padding:10px 12px; border-radius:8px; background:var(--secondary-background-color); font-size:13px; margin-bottom:8px; }
    .notice.err { color:var(--error-color); }
    .notice.ok { color:var(--success-color, #43a047); }
    button.dp { font:inherit; font-size:13px; padding:6px 12px; border-radius:18px; cursor:pointer;
      border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); }
    button.dp.primary { background:var(--primary-color); color:var(--text-primary-color,#fff); border-color:var(--primary-color); }
    button.dp.danger { color:var(--error-color); border-color:var(--error-color); }
    button.dp:disabled { opacity:.5; cursor:default; }
    input.search, input.text, select.text { box-sizing:border-box; width:100%; font:inherit; padding:8px 10px; border-radius:8px;
      border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); }
    .gallery { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; margin-top:8px;
      max-height:480px; overflow:auto; padding:2px; }
    .tile { border:2px solid var(--divider-color); border-radius:12px; overflow:hidden; cursor:pointer;
      background:var(--primary-background-color); display:flex; flex-direction:column; }
    .tile.sel { border-color:var(--primary-color); box-shadow:0 0 0 2px var(--primary-color); }
    .tile .thumb { height:140px; overflow:hidden; position:relative; pointer-events:none; }
    .tile .thumb .scale { zoom:.55; width:182%; padding:6px; box-sizing:border-box; }
    .tile .thumb .none { display:flex; align-items:center; justify-content:center; height:100%; font-size:12px;
      color:var(--secondary-text-color); padding:8px; text-align:center; }
    .tile .meta { padding:6px 8px; border-top:1px solid var(--divider-color); background:var(--card-background-color); }
    .tile .name { font-weight:500; font-size:13px; word-break:break-all; }
    .tile .desc { font-size:11px; color:var(--secondary-text-color); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .badge { font-size:10px; padding:1px 6px; border-radius:8px; background:var(--warning-color,#ffa600); color:#fff; margin-left:4px; }
    h3 { font-size:15px; font-weight:500; margin:0 0 8px; }
    .help { font-size:12px; color:var(--secondary-text-color); margin:4px 0 8px; }
    .tpl-editor { border:1px solid var(--divider-color); border-radius:12px; padding:12px; }
    .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; }
    @media (max-width:600px) { .grid2 { grid-template-columns:1fr; } }
    label.lbl { display:block; font-size:12px; color:var(--secondary-text-color); margin:8px 0 4px; }
    textarea.code { box-sizing:border-box; width:100%; min-height:140px; font-family:monospace; font-size:12px; }
    .live { margin-top:8px; }
  `;

  class DeclutterPlusCardEditor extends HTMLElement {
    constructor() {
      super();
      this._config = {};
      this._hass = null;
      this.lovelace = null;
      this._search = "";
      this._editing = null; // { originalName, name, description, kind, config, defaults, fields }
      this._message = null;
      this._previews = [];
      this._livePreview = null;
      this._built = false;
      this._lastLang = null;
      this._onLibrary = this._render.bind(this);
      this.attachShadow({ mode: "open" });
    }

    setConfig(config) {
      this._config = Object.assign({}, config);
      if (isObject(this._config.paste) && !this._editing) {
        this._startFromCard(this._config.paste, this._lang(), true);
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
      }
      this._previews.forEach(function (p) {
        p.hass = hass;
      });
      if (this._livePreview) this._livePreview.hass = hass;
      const form = this.shadowRoot.querySelector("ha-form");
      if (form) form.hass = hass;
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

    _focusCreate() {
      const panel = this.shadowRoot.querySelector(".panel-create");
      if (!panel) return;
      panel.expanded = true;
      panel.open = true;
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
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
      panel.appendChild(content);
      return panel;
    }

    _path() {
      return this._config.library || DEFAULT_LIBRARY;
    }

    _entry() {
      return libraryEntry(this._path());
    }

    _lovelace() {
      return this.lovelace || findLovelace(this);
    }

    _lang() {
      return resolveLang(this._hass);
    }

    _templates() {
      return allTemplates(this._entry(), this._lovelace());
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

    // Rendu complet (bibliothèque, galerie, variables, éditeur de template)
    _render() {
      if (!this._hass) return;
      const lang = this._lang();
      this._lastLang = lang;
      this._built = true;
      const root = this.shadowRoot;
      root.innerHTML = "";
      root.appendChild(this._el("style", { text: EDITOR_STYLE }));
      if (this._message) {
        root.appendChild(this._el("div", { class: "notice " + (this._message.type || ""), text: this._message.text }));
      }
      const hasTemplate = !!this._config.template;
      root.appendChild(this._panel("panel-template", t(lang, "panelTemplate"), "mdi:view-grid-outline", !hasTemplate && !this._editing, this._renderGallery(lang)));
      root.appendChild(this._panel("panel-variables", t(lang, "panelVariables"), "mdi:variable", hasTemplate && !this._editing, this._el("div", { class: "variables" })));
      root.appendChild(this._panel("panel-create", t(lang, "panelCreate"), "mdi:pencil-plus-outline", !!this._editing, this._el("div", { class: "template-editor" })));
      root.appendChild(this._panel("panel-library", t(lang, "panelLibrary"), "mdi:bookshelf", false, this._renderLibraryBar(lang)));
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

    _renderLibraryBar(lang) {
      const entry = this._entry();
      const admin = isAdmin(this._hass);
      const box = this._el("div", { class: "section" });
      const bar = this._el("div", { class: "bar" });
      if (!entry.loaded) {
        bar.appendChild(this._el("span", { class: "grow", text: "…" }));
      } else if (entry.missing) {
        bar.appendChild(
          this._el("span", {
            class: "grow",
            text: admin ? tSub(lang, "libraryMissing", { path: entry.path }) : t(lang, "libraryMissingUser")
          })
        );
        if (admin) {
          bar.appendChild(
            this._button(t(lang, "libraryCreate"), () => this._run(createLibrary(this._hass, entry.path, lang)), "primary")
          );
        }
      } else {
        const text = entry.error
          ? tSub(lang, "error", { message: entry.error.message || entry.error.code })
          : tSub(lang, "libraryCount", { count: Object.keys(entry.templates).length, path: entry.path });
        bar.appendChild(this._el("span", { class: "grow", text: text }));
        bar.appendChild(
          this._el("a", { href: "/" + entry.path, target: "_blank", rel: "noopener", title: t(lang, "libraryOpen") }, [
            this._button(t(lang, "libraryOpen"))
          ])
        );
      }
      bar.appendChild(this._button(t(lang, "libraryReload"), () => this._run(loadLibrary(this._hass, entry.path, true))));
      box.appendChild(bar);

      const ll = this._lovelace();
      const legacy = ll && ll.config ? listToObject(ll.config[LEGACY_KEY]) : {};
      const legacyNames = Object.keys(legacy);
      if (admin && entry.loaded && !entry.missing && legacyNames.length) {
        const count = legacyNames.length;
        box.appendChild(
          this._button(
            tSub(lang, "importLegacy", { count: count }),
            () =>
              this._run(
                saveLibraryTemplates(this._hass, entry.path, function (lib) {
                  legacyNames.forEach(function (n) {
                    if (!hasVar(lib, n)) lib[n] = clone(legacy[n]);
                  });
                }),
                tSub(lang, "importDone", { count: count })
              )
          )
        );
      }
      return box;
    }

    _renderGallery(lang) {
      const box = this._el("div", { class: "section" });
      const templates = this._templates();
      const search = this._el("input", { class: "search", type: "search", placeholder: t(lang, "search") });
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
          const tpl = normalizeTemplate(templates[name].raw);
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
            thumb.appendChild(
              this._el("div", { class: "none", text: tSub(lang, "noPreview", { kind: tpl ? tpl.kind : "?" }) })
            );
          }
          const nameEl = this._el("div", { class: "name", text: name });
          if (templates[name].legacy) nameEl.appendChild(this._el("span", { class: "badge", text: t(lang, "legacyBadge") }));
          tile.appendChild(thumb);
          tile.appendChild(
            this._el("div", { class: "meta" }, [nameEl, this._el("div", { class: "desc", text: (tpl && tpl.description) || "" })])
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
      if (name === this._config.template) return;
      const next = Object.assign({}, this._config, { template: name });
      delete next.paste;
      // on garde les variables encore utilisées par le nouveau template
      const found = this._templates()[name];
      const tpl = found && normalizeTemplate(found.raw);
      if (tpl && this._config.variables) {
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

    _guessSelector(name, def) {
      const n = name.toLowerCase();
      if (typeof def === "boolean") return { boolean: {} };
      if (typeof def === "number") return { number: { mode: "box" } };
      if (isObject(def) || Array.isArray(def)) return { object: {} };
      if (n === "entity" || /(^|_)entity($|_)/.test(n) || /_id$/.test(n)) return { entity: {} };
      if (n === "icon" || /(^|_)icon($|_)/.test(n)) return { icon: {} };
      if (n === "area" || /(^|_)area($|_)/.test(n)) return { area: {} };
      return { text: {} };
    }

    _renderVariables(box, lang) {
      const name = this._config.template;
      // Evite de recreer le formulaire (perte du focus) apres chaque config-changed
      const existing = box.querySelector("ha-form");
      if (existing && box._template === name && this._libraryStamp() === box._stamp) {
        existing.data = listToObject(this._config.variables);
        return;
      }
      box._template = name;
      box._stamp = this._libraryStamp();
      box.innerHTML = "";
      const found = name && this._templates()[name];
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

    _libraryStamp() {
      return JSON.stringify(this._templates()[this._config.template] || null);
    }

    _renderTemplateEditor(box, lang) {
      if (this._editing && box._editing === this._editing) return;
      box._editing = this._editing;
      box.innerHTML = "";
      this._livePreview = null;
      const entry = this._entry();
      if (!entry.loaded || entry.missing) return;
      if (!isAdmin(this._hass)) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "adminOnly") }));
        return;
      }
      if (!this._editing) {
        const bar = this._el("div", { class: "bar" });
        const found = this._config.template && this._templates()[this._config.template];
        if (found && normalizeTemplate(found.raw)) {
          bar.appendChild(this._button(t(lang, "editTemplate"), () => this._startEdit(this._config.template)));
        }
        bar.appendChild(this._button(t(lang, "newTemplate"), () => this._startEdit(null)));
        bar.appendChild(
          this._button(t(lang, "fromClipboard"), () => {
            readCopiedCard().then((card) => {
              if (card) this._startFromCard(card, lang);
              else this._notify(t(lang, "clipboardEmpty"), "err");
            });
          })
        );
        const ll = this._lovelace();
        const cards = listDashboardCards(ll && ll.config).filter(function (c) {
          return c.config.type !== "custom:" + CARD_TAG;
        });
        if (cards.length) {
          const pick = this._el("select", { class: "text" });
          pick.appendChild(this._el("option", { value: "", text: t(lang, "fromDashboard") }));
          cards.forEach(function (c, i) {
            pick.appendChild(Object.assign(document.createElement("option"), { value: String(i), textContent: c.label }));
          });
          pick.addEventListener("change", () => {
            if (pick.value !== "") this._startFromCard(cards[Number(pick.value)].config, lang);
          });
          box.appendChild(bar);
          box.appendChild(pick);
          return;
        }
        box.appendChild(bar);
        return;
      }

      const ed = this._editing;
      const panel = this._el("div", { class: "tpl-editor" });
      panel.appendChild(this._el("h3", { text: t(lang, "editorTitle") }));

      const nameInput = this._el("input", { class: "text" });
      nameInput.value = ed.name;
      nameInput.addEventListener("input", function () {
        ed.name = nameInput.value.trim();
      });
      const kindSelect = this._el("select", { class: "text" });
      [
        ["card", "kindCard"],
        ["element", "kindElement"],
        ["row", "kindRow"]
      ].forEach(function (k) {
        const opt = document.createElement("option");
        opt.value = k[0];
        opt.textContent = t(lang, k[1]);
        if (ed.kind === k[0]) opt.selected = true;
        kindSelect.appendChild(opt);
      });
      kindSelect.addEventListener("change", () => {
        ed.kind = kindSelect.value;
        this._updateLive(panel, lang);
      });
      panel.appendChild(
        this._el("div", { class: "grid2" }, [
          this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldName") }), nameInput]),
          this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldKind") }), kindSelect])
        ])
      );
      const descInput = this._el("input", { class: "text" });
      descInput.value = ed.description;
      descInput.addEventListener("input", function () {
        ed.description = descInput.value;
      });
      panel.appendChild(this._el("label", { class: "lbl", text: t(lang, "fieldDescription") }));
      panel.appendChild(descInput);

      panel.appendChild(this._yamlField(lang, "fieldConfig", "config", panel));
      panel.appendChild(this._el("div", { class: "help detected" }));
      panel.appendChild(this._yamlField(lang, "fieldDefaults", "defaults", panel));
      panel.appendChild(this._yamlField(lang, "fieldFields", "fields", panel));

      const bar = this._el("div", { class: "bar" });
      bar.style.marginTop = "12px";
      bar.appendChild(this._button(t(lang, "save"), () => this._saveEdit(lang), "primary"));
      if (ed.originalName) bar.appendChild(this._button(t(lang, "remove"), () => this._deleteEdit(lang), "danger"));
      bar.appendChild(
        this._button(t(lang, "cancel"), () => {
          this._editing = null;
          setDraft(null);
          this._renderSelection();
        })
      );
      panel.appendChild(bar);
      panel.appendChild(this._el("div", { class: "live" }));
      box.appendChild(panel);
      this._updateLive(panel, lang);
    }

    _yamlField(lang, labelKey, prop, panel) {
      const ed = this._editing;
      const wrap = this._el("div");
      wrap.appendChild(this._el("label", { class: "lbl", text: t(lang, labelKey) }));
      if (customElements.get("ha-yaml-editor")) {
        const yaml = document.createElement("ha-yaml-editor");
        yaml.hass = this._hass;
        yaml.defaultValue = ed[prop];
        yaml.addEventListener("value-changed", (ev) => {
          ev.stopPropagation();
          ed.invalid[prop] = ev.detail.isValid === false;
          if (!ed.invalid[prop]) {
            ed[prop] = ev.detail.value;
            this._updateLive(panel, lang);
          }
        });
        wrap.appendChild(yaml);
      } else {
        // Repli JSON si l'éditeur YAML de HA n'est pas chargé
        const area = this._el("textarea", { class: "code" });
        area.value = JSON.stringify(ed[prop] || {}, null, 2);
        area.addEventListener("input", () => {
          try {
            ed[prop] = JSON.parse(area.value || "{}");
            ed.invalid[prop] = false;
            this._updateLive(panel, lang);
          } catch (e) {
            ed.invalid[prop] = true;
          }
        });
        wrap.appendChild(area);
      }
      return wrap;
    }

    _updateLive(panel, lang) {
      const ed = this._editing;
      if (!ed) return;
      const detected = panel.querySelector(".detected");
      if (detected) {
        const list = Array.from(collectVars(ed.config)).join(", ") || "—";
        detected.textContent = tSub(lang, "detected", { list: list });
      }
      const live = panel.querySelector(".live");
      if (live) live.innerHTML = "";
      if (ed.kind !== "card" || !isObject(ed.config)) {
        setDraft(null);
        if (live) live.appendChild(this._el("div", { class: "help", text: tSub(lang, "noPreview", { kind: ed.kind }) }));
        return;
      }
      // Le brouillon s'affiche dans l'aperçu natif de HA (à droite)
      const tpl = normalizeTemplate({ card: ed.config, default: ed.defaults });
      setDraft(renderTemplate(tpl, Object.assign({}, ed.defaults, listToObject(this._config.variables))).config);
    }

    _startEdit(name) {
      const found = name && this._templates()[name];
      const raw = found ? found.raw : null;
      const tpl = raw && normalizeTemplate(raw);
      this._editing = {
        // un template local (decluttering-card) est enregistré dans la bibliothèque
        originalName: found && !found.legacy ? name : null,
        name: name || "",
        description: tpl ? tpl.description : "",
        kind: tpl ? tpl.kind : "card",
        config: tpl ? clone(tpl.config) : { type: "tile", entity: "[[entity]]" },
        defaults: tpl ? clone(tpl.defaults) : {},
        fields: tpl ? clone(tpl.fields) : { entity: { selector: { entity: {} }, required: true } },
        grid_options: tpl ? clone(tpl.grid_options) : null,
        invalid: {}
      };
      this._message = null;
      this._render();
    }

    _startFromCard(card, lang, silent) {
      const tpl = cardToTemplate(card);
      const base = String(card.type).replace(/^custom:/, "").replace(/[^A-Za-z0-9_-]/g, "_") || t(lang, "untitledCard");
      this._editing = {
        originalName: null,
        name: base + "_template",
        description: "",
        kind: "card",
        config: tpl.config,
        defaults: tpl.defaults,
        fields: tpl.fields,
        grid_options: tpl.grid_options,
        invalid: {}
      };
      this._message = silent ? { text: t(lang, "pasteHint"), type: "ok" } : null;
      this._render();
    }

    _saveEdit(lang) {
      const ed = this._editing;
      if (!NAME_RE.test(ed.name)) {
        this._notify(t(lang, "invalidName"), "err");
        return;
      }
      const bad = Object.keys(ed.invalid).filter(function (k) {
        return ed.invalid[k];
      });
      if (bad.length || !isObject(ed.config)) {
        this._notify(tSub(lang, "invalidYaml", { field: bad[0] || "config" }), "err");
        return;
      }
      const lib = this._entry().templates;
      if (ed.name !== ed.originalName && hasVar(lib, ed.name)) {
        if (!window.confirm(tSub(lang, "confirmOverwrite", { name: ed.name }))) return;
      }
      const raw = {};
      if (ed.description) raw.description = ed.description;
      if (isObject(ed.defaults) && Object.keys(ed.defaults).length) raw.default = ed.defaults;
      if (isObject(ed.fields) && Object.keys(ed.fields).length) raw.fields = ed.fields;
      if (isObject(ed.grid_options)) raw.grid_options = ed.grid_options;
      raw[ed.kind] = ed.config;
      const original = ed.originalName;
      const newName = ed.name;
      this._run(
        saveLibraryTemplates(this._hass, this._path(), function (templates) {
          if (original && original !== newName) delete templates[original];
          templates[newName] = raw;
        }).then(() => {
          this._editing = null;
          setDraft(null);
          if (this._config.template !== newName || this._config.paste) {
            const next = Object.assign({}, this._config, { template: newName });
            delete next.paste;
            this._changed(next);
          }
        }),
        t(lang, "saved")
      );
    }

    _deleteEdit(lang) {
      const name = this._editing.originalName;
      if (!window.confirm(tSub(lang, "confirmDelete", { name: name }))) return;
      this._run(
        saveLibraryTemplates(this._hass, this._path(), function (templates) {
          delete templates[name];
        }).then(() => {
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
          this._message = { text: tSub(lang, "error", { message: (err && (err.message || err.code)) || err }), type: "err" };
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

  // Entrée « coller la carte copiée » du sélecteur de cartes : sa config initiale
  // est une declutter-plus-card portant la carte copiée.
  class DeclutterPlusPasteCard extends DeclutterPlusCard {
    static getStubConfig() {
      const stub = { type: "custom:" + CARD_TAG };
      const copied = readHaClipboard();
      if (copied) stub.paste = copied;
      else stub.template = DeclutterPlusCard.getStubConfig().template;
      return stub;
    }
  }

  define(CARD_TAG, DeclutterPlusCard);
  define(PASTE_TAG, DeclutterPlusPasteCard);
  define(ELEMENT_TAG, DeclutterPlusElement);
  define(ROW_TAG, DeclutterPlusRow);
  define(EDITOR_TAG, DeclutterPlusCardEditor);

  // Suggestion de template dans le sélecteur de cartes (HA 2026.6+)
  function entitySuggestion(hass, entityId) {
    const entry = libraries[DEFAULT_LIBRARY];
    if (!entry || !entry.loaded) {
      loadLibrary(hass, DEFAULT_LIBRARY);
      return null;
    }
    const domain = String(entityId).split(".")[0];
    const names = Object.keys(entry.templates).sort();
    for (let i = 0; i < names.length; i++) {
      const tpl = normalizeTemplate(entry.templates[names[i]]);
      if (!tpl || tpl.kind !== "card") continue;
      const fieldNames = Object.keys(tpl.fields);
      for (let j = 0; j < fieldNames.length; j++) {
        const sel = isObject(tpl.fields[fieldNames[j]]) && tpl.fields[fieldNames[j]].selector;
        if (!isObject(sel) || !("entity" in sel)) continue;
        const spec = isObject(sel.entity) ? sel.entity : {};
        const domains = []
          .concat(spec.domain || [])
          .concat(
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
