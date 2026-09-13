/*
 * Declutter Plus — templates de cartes Lovelace réutilisables, stockés dans le
 * dashboard courant ou partagés entre dashboards, édités avec les popups natives
 * de Home Assistant. Compatible avec la syntaxe de decluttering-card.
 */
(function () {
  "use strict";

  const VERSION = "1.3.0";
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
  const DIRTY_FRAMES = 10;
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
      panelTemplate: "Template",
      panelVariables: "Variables",
      noTemplateHelp: "Pick a template below, or click \"Add card\" in the preview to create a new one.",
      pasteHelp: "Pasted card: click \"Save as template\" in the preview.",
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
      storageShared: "Saved in a hidden dashboard named \"{title}\", used only as storage, usable on every dashboard.",
      sharedEnable: "Enable shared storage",
      sharedNote: "This hidden dashboard only stores the shared **Declutter Plus** templates. You do not need to open it: manage templates from the Declutter Plus card editor.",
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
      dialogUnavailable: "The Home Assistant card editor is not available here. Open this card from the dashboard editor.",
      dashboardUnavailable: "This dashboard cannot be modified from here (YAML mode?). Use shared storage.",
      error: "Error: {message}"
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
      panelTemplate: "Template",
      panelVariables: "Variables",
      noTemplateHelp: "Choisissez un template ci-dessous, ou cliquez sur « Ajouter une carte » dans l'aperçu pour en créer un.",
      pasteHelp: "Carte collée : cliquez sur « Enregistrer comme template » dans l'aperçu.",
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
      storageShared: "Enregistré dans un dashboard caché nommé « {title} », qui sert uniquement de stockage, utilisable sur tous les dashboards.",
      sharedEnable: "Activer le stockage partagé",
      sharedNote: "Ce dashboard caché sert uniquement à stocker les templates **Declutter Plus** partagés. Inutile de l'ouvrir : gérez les templates depuis l'éditeur de la carte Declutter Plus.",
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
      dialogUnavailable: "L'éditeur de cartes de Home Assistant n'est pas disponible ici. Ouvrez cette carte depuis l'édition du dashboard.",
      dashboardUnavailable: "Ce dashboard ne peut pas être modifié d'ici (mode YAML ?). Utilisez le stockage partagé.",
      error: "Erreur : {message}"
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
  function forceDialogDirty(dialog, original) {
    try {
      const slices = dialog._dirtySlices;
      const slice = slices && typeof slices.get === "function" ? slices.get("__default__") : null;
      if (slice) {
        slice.initial = clone(original);
        slice.normalizedInitial =
          typeof dialog._effectiveNormalize === "function" ? dialog._effectiveNormalize(clone(original)) : clone(original);
        if (typeof dialog._publishContext === "function") dialog._publishContext();
      }
      if ("_dirty" in dialog) dialog._dirty = true;
    } catch (e) {}
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

  // opts : { hass, mode: "add" | "edit", card, ownConfig, onSave(card) -> Promise<nouvelle config> }
  function openNativeCardDialog(opts) {
    const dialog = activeEditDialog();
    const host = haHost();
    if (!dialog || !dialog._params || !host) return Promise.resolve(false);

    const parent = Object.assign({}, dialog._params);
    const originalRoot = clone(parent.cardConfig);
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
        let frame = 0;
        const tick = function () {
          forceDialogDirty(dialog, originalRoot);
          if (++frame < DIRTY_FRAMES) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    };

    const bridgeClose = function () {
      const hadOwn = Object.prototype.hasOwnProperty.call(dialog, "closeDialog");
      const original = dialog.closeDialog;
      const intercepted = function () {
        restore();
        const result = typeof original === "function" ? original.apply(dialog, arguments) : true;
        Promise.resolve(result).then(function (closed) {
          if (closed !== false) setTimeout(reopenParent, 0);
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

    const onShow = function (ev) {
      if (!ev.detail || ev.detail.dialogTag !== "hui-dialog-edit-card") return;
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      if (opts.mode === "add") {
        pendingChild = ev.detail.dialogParams;
      } else {
        host.removeEventListener("show-dialog", onShow, true);
        showChild(ev.detail.dialogParams);
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

    host.addEventListener("show-dialog", onShow, true);
    if (opts.mode === "add") window.addEventListener("dialog-closed", onCreateClosed, true);

    return createProxySection(opts.hass, opts.mode === "add" ? [] : [clone(opts.card)], saveConfig).then(function (section) {
      if (!section) {
        cleanup();
        return false;
      }
      const eventName = opts.mode === "add" ? "ll-create-card" : "ll-edit-card";
      section._layoutElement.dispatchEvent(
        new CustomEvent(eventName, { bubbles: true, composed: true, detail: opts.mode === "add" ? undefined : { path: [0, 0, 0] } })
      );
      setTimeout(function () {
        section.remove();
      }, 0);
      return true;
    });
  }

  // ---------------------------------------------------------------------------
  // Stockage partagé (dashboard caché) et local

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

  // Compte les cartes Declutter Plus qui utilisent un template, sur tous les dashboards.
  function countTemplateUsages(hass, name) {
    const types = ["custom:" + CARD_TAG, "custom:" + ELEMENT_TAG, "custom:" + ROW_TAG];
    const count = function (config) {
      let n = 0;
      const stack = [config];
      let guard = 0;
      while (stack.length && guard < DOM_GUARD) {
        guard++;
        const node = stack.pop();
        if (node === null || typeof node !== "object") continue;
        if (types.indexOf(node.type) !== -1 && node.template === name) n++;
        Object.keys(node).forEach(function (k) {
          stack.push(node[k]);
        });
      }
      return n;
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
            return hass.callWS({ type: "lovelace/config", url_path: path }).then(count, function () {
              return 0;
            });
          })
        );
      })
      .then(function (counts) {
        return {
          cards: counts.reduce(function (a, b) {
            return a + b;
          }, 0),
          dashboards: counts.filter(function (c) {
            return c > 0;
          }).length
        };
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
    delete config.visibility;
    const vars = [];
    if (typeof config.entity === "string" && config.entity) vars.push({ name: "entity", path: ["entity"], label: "" });
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

  // Un template à plusieurs cartes est stocké en vertical-stack (carte native).
  function isStack(card) {
    return isObject(card) && card.type === "vertical-stack" && Array.isArray(card.cards);
  }

  function cleanCard(card) {
    const out = clone(card);
    if (isObject(out)) {
      delete out.view_layout;
      delete out.layout_options;
      delete out.grid_options;
    }
    return out;
  }

  function draftCards(ed) {
    return isStack(ed.card) ? ed.card.cards : [ed.card];
  }

  function ensureStack(ed) {
    if (isStack(ed.card)) return;
    ed.card = { type: "vertical-stack", cards: [ed.card] };
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
    if (isStack(ed.card)) ed.card.cards[index] = cleanCard(card);
    else ed.card = cleanCard(card);
    ed.vars = ed.vars.filter(function (v) {
      return getPath(ed.card, v.path) !== undefined;
    });
  }

  // Retire une carte ; false si c'était la dernière.
  function removeDraftCard(ed, index) {
    if (!isStack(ed.card) || ed.card.cards.length <= 1) return false;
    ed.vars = ed.vars.filter(function (v) {
      return !(v.path[0] === "cards" && Number(v.path[1]) === index);
    });
    ed.card.cards.splice(index, 1);
    shiftVars(ed, index + 1, -1);
    if (ed.card.cards.length === 1) {
      ed.card = ed.card.cards[0];
      ed.vars.forEach(function (v) {
        v.path = v.path.slice(2);
      });
    }
    return true;
  }

  // Lie l'entité d'une carte ajoutée à une nouvelle variable (entity, entity_2…).
  function bindCardEntity(ed, index) {
    const base = isStack(ed.card) ? ["cards", index] : [];
    const card = getPath(ed.card, base);
    if (!isObject(card) || typeof card.entity !== "string" || !card.entity) return null;
    const taken = ed.vars.map((v) => v.name).concat(Object.keys(ed.extraDefaults));
    const name = suggestVarName(["entity"], taken);
    ed.vars.push({ name: name, path: base.concat("entity"), label: "" });
    return name;
  }

  function draftValuesFor(ed, names) {
    const values = {};
    ed.vars.forEach(function (v) {
      const value = getPath(ed.card, v.path);
      if (names.indexOf(v.name) !== -1 && value !== undefined) values[v.name] = value;
    });
    return values;
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
  // Canal aperçu -> éditeur

  const previewBus = { editors: [] };

  function previewAction(action, payload) {
    const editors = previewBus.editors;
    const editor = editors.length ? editors[editors.length - 1] : null;
    if (editor) editor._previewAction(action, payload);
  }

  // ---------------------------------------------------------------------------
  // Carte / élément / ligne

  const BASE_STYLE =
    ":host{display:block}" +
    ".dp-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;margin-top:8px;" +
    "min-height:56px;padding:12px;border:2px dashed var(--divider-color,#8886);border-radius:var(--ha-card-border-radius,12px);" +
    "background:transparent;color:var(--primary-text-color);font:inherit;font-size:14px;cursor:pointer;opacity:.8}" +
    ".dp-add:hover{opacity:1;border-color:var(--primary-color);color:var(--primary-color)}" +
    ".dp-add ha-svg-icon{--mdc-icon-size:20px}" +
    ".dp-tools{position:absolute;top:6px;right:6px;display:flex;gap:4px;z-index:2}" +
    ".dp-tools button{border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;" +
    "background:var(--primary-color);color:var(--text-primary-color,#fff);font-size:15px}" +
    ".dp-frame{position:relative;display:block}" +
    ".dp-stack{display:flex;flex-direction:column;gap:var(--vertical-stack-card-gap,var(--stack-card-gap,8px))}" +
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
      return this._preview && this.constructor.kind === "card";
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
      this._show(renderTemplate(tpl, listToObject(this._config.variables)), lang, tpl.kind === "card" ? "add" : null);
      if (this._deferred && this.isConnected && tpl.kind === "card" && !this._preview) fireEvent(this, "ll-rebuild", {});
      this._deferred = false;
    }

    _createChild(kind, config) {
      return createChild(kind, config);
    }

    _show(rendered, lang, button) {
      const signature = JSON.stringify([rendered, this._editable()]);
      if (signature !== this._signature || !this._child) {
        this._signature = signature;
        this._rendered = rendered;
        try {
          // aperçu : chaque carte d'un template multi-cartes a sa propre barre d'édition
          const cards = this._editable() && isStack(rendered.config) ? rendered.config.cards : [rendered.config];
          this._mount(
            cards.map((config) => this._createChild(this.constructor.kind, config)),
            this._editable() && isStack(rendered.config)
          );
        } catch (e) {
          this._showError(tSub(lang, "error", { message: e.message }));
        }
      }
      this._syncAddButton(lang, button);
    }

    // Bouton pointillé sous l'aperçu (éditeur uniquement), comme Bubble Card
    _syncAddButton(lang, mode) {
      let btn = this.shadowRoot.querySelector(".dp-add");
      if (!this._editable() || !mode) {
        if (btn) btn.remove();
        return;
      }
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dp-add";
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          previewAction(btn.dataset.mode, { config: this._config });
        });
        this.shadowRoot.appendChild(btn);
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
        "ll-change-grid-options": null
      };
      Object.keys(map).forEach(function (type) {
        frame.addEventListener(type, function (ev) {
          ev.stopPropagation();
          if (map[type]) previewAction(map[type], { config: self._config, index: index });
        });
      });
      frame.appendChild(child);
      return frame;
    }

    _mount(children, asList) {
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
      if (asList) {
        frame = document.createElement("div");
        frame.className = "dp-stack";
        this._frames.forEach(function (f) {
          frame.appendChild(f);
        });
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
    .panel { display:block; margin-bottom:12px; }
    details.panel { border:1px solid var(--divider-color); border-radius:12px; padding:8px 12px; }
    details.panel summary { cursor:pointer; font-weight:500; padding:4px 0; }
    .body { padding:8px 12px 12px; }
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
    .badge { display:inline-block; font-size:10px; padding:1px 6px; border-radius:8px; margin-top:2px;
      background:var(--secondary-background-color); color:var(--secondary-text-color); }
    .badge.shared { background:var(--primary-color); color:var(--text-primary-color,#fff); }
    h4 { font-size:14px; font-weight:500; margin:20px 0 2px; }
    .chips { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0; }
    .chip { display:inline-flex; align-items:center; gap:4px; font-size:12px; padding:3px 4px 3px 10px; border-radius:14px;
      background:var(--secondary-background-color); }
    .chip code { font-size:11px; color:var(--secondary-text-color); }
    .chip button { border:none; background:none; color:var(--secondary-text-color); cursor:pointer; font-size:14px; padding:0 4px; }
  `;

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
      this._onLibrary = this._render.bind(this);
      this.attachShadow({ mode: "open" });
    }

    setConfig(config) {
      const templateChanged = !this._built || this._config.template !== config.template || !!this._config.paste !== !!config.paste;
      this._config = Object.assign({}, config);
      if (templateChanged) this._render();
      else this._updateVariablesForm();
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

    _current() {
      const name = this._config.template;
      const found = name ? this._templates()[name] : null;
      return found && normalizeTemplate(found.raw) ? { name: name, found: found } : null;
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

    _notify(text, type) {
      this._message = text ? { text: text, type: type } : null;
      this._render();
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
      const current = this._current();
      root.appendChild(this._panel("panel-template", t(lang, "panelTemplate"), "mdi:view-grid-outline", !current, this._renderTemplatePanel(lang, current)));
      if (current) {
        root.appendChild(this._panel("panel-variables", t(lang, "panelVariables"), "mdi:variable", true, this._renderVariablesPanel(lang, current)));
      }
    }

    // --- Panneau Template : nom, description, stockage, galerie

    _renderTemplatePanel(lang, current) {
      const box = this._el("div");
      if (this._config.paste && !this._config.template) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "pasteHelp") }));
      } else if (!current) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "noTemplateHelp") }));
      }

      if (current && isAdmin(this._hass)) {
        const tpl = normalizeTemplate(current.found.raw);
        const nameInput = this._el("input", { class: "text" });
        nameInput.value = current.name;
        nameInput.addEventListener("change", () => this._rename(nameInput.value.trim()));

        const scopeSelect = this._el("select", { class: "text" });
        const entry = this._entry();
        const sharedReady = entry.loaded && !entry.missing;
        const currentScope = current.found.scope === SCOPE_SHARED ? SCOPE_SHARED : SCOPE_LOCAL;
        [SCOPE_LOCAL, SCOPE_SHARED].forEach((scope) => {
          const opt = this._el("option", { value: scope, text: this._scopeLabel(lang, scope) });
          if (scope === SCOPE_SHARED && !sharedReady) opt.disabled = true;
          if (scope === currentScope) opt.selected = true;
          scopeSelect.appendChild(opt);
        });
        scopeSelect.addEventListener("change", () => this._move(scopeSelect.value));

        box.appendChild(
          this._el("div", { class: "grid2" }, [
            this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldName") }), nameInput]),
            this._el("div", null, [this._el("label", { class: "lbl", text: t(lang, "fieldScope") }), scopeSelect])
          ])
        );
        box.appendChild(
          this._el("div", {
            class: "help",
            text: currentScope === SCOPE_SHARED ? tSub(lang, "storageShared", { title: SHARED_TITLE }) : t(lang, "storageLocal")
          })
        );
        if (!sharedReady && entry.loaded) {
          const enable = this._el("button", { class: "link", type: "button", text: t(lang, "sharedEnable") });
          enable.addEventListener("click", () => this._run(createShared(this._hass, entry.path, lang), null).catch(function () {}));
          box.appendChild(enable);
        }

        const descInput = this._el("input", { class: "text" });
        descInput.value = tpl.description;
        descInput.addEventListener("change", () => {
          this._updateTemplate(function (ed) {
            ed.description = descInput.value;
          });
        });
        box.appendChild(this._el("label", { class: "lbl", text: t(lang, "fieldDescription") }));
        box.appendChild(descInput);
      }

      box.appendChild(this._renderGallery(lang));
      return box;
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
      search.style.marginTop = "16px";
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
              const scale = this._el("div", { class: "scale" });
              try {
                const card = createChild("card", renderTemplate(tpl, {}).config);
                card.hass = this._hass;
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
      this._message = null;
      this._changed(next);
      this._render();
    }

    // --- Panneau Variables : valeurs de cette carte + réglages variables du template

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

    _renderVariablesPanel(lang, current) {
      const box = this._el("div");
      const tpl = normalizeTemplate(current.found.raw);
      const names = new Set(Object.keys(tpl.fields));
      collectVars(tpl.config).forEach(function (v) {
        names.add(v);
      });
      Object.keys(tpl.defaults).forEach(function (v) {
        names.add(v);
      });

      if (!names.size) {
        box.appendChild(this._el("div", { class: "help", text: t(lang, "noVariables") }));
      } else {
        const fields = tpl.fields;
        const schema = Array.from(names).map((v) => {
          const f = isObject(fields[v]) ? fields[v] : {};
          const item = { name: v, selector: isObject(f.selector) ? f.selector : this._guessSelector(v, tpl.defaults[v]) };
          if (f.required) item.required = true;
          return item;
        });
        box.appendChild(this._variablesForm(lang, tpl, schema));
      }

      if (tpl.kind !== "card") {
        box.appendChild(this._el("div", { class: "help", text: tSub(lang, "nonCardHelp", { kind: tpl.kind }) }));
        return box;
      }
      if (!isAdmin(this._hass)) return box;

      // réglages variables du template
      const ed = draftFromTemplate(current.name, current.found, this._config.variables);
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
          });
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
          });
        });
        box.appendChild(pick);
      }
      return box;
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

    _updateTemplate(mutate, successText) {
      const current = this._current();
      if (!current) return Promise.resolve();
      const ed = draftFromTemplate(current.name, current.found, this._config.variables);
      mutate(ed);
      return this._run(this._writeDraft(ed), successText || t(this._lang(), "saved")).catch(function () {});
    }

    _rename(name) {
      const lang = this._lang();
      const current = this._current();
      if (!current || name === current.name) return;
      if (!NAME_RE.test(name)) {
        this._notify(t(lang, "invalidName"), "err");
        return;
      }
      const ed = draftFromTemplate(current.name, current.found, this._config.variables);
      if (this._exists(name, ed.scope) && !window.confirm(tSub(lang, "confirmOverwrite", { name: name }))) {
        this._render();
        return;
      }
      ed.name = name;
      this._run(this._writeDraft(ed), t(lang, "saved"))
        .then(() => {
          const next = Object.assign({}, this._config, { template: name });
          this._changed(next);
          this._render();
        })
        .catch(function () {});
    }

    _move(scope) {
      const lang = this._lang();
      const current = this._current();
      if (!current) return;
      const ed = draftFromTemplate(current.name, current.found, this._config.variables);
      if (this._exists(ed.name, scope) && !window.confirm(tSub(lang, "confirmOverwrite", { name: ed.name }))) {
        this._render();
        return;
      }
      ed.scope = scope;
      this._run(this._writeDraft(ed), t(lang, "saved")).catch(function () {});
    }

    _defaultScope() {
      const entry = this._entry();
      return entry.loaded && !entry.missing ? SCOPE_SHARED : SCOPE_LOCAL;
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
    }

    _dialogFailed(opened) {
      if (opened === false) this._notify(t(this._lang(), "dialogUnavailable"), "err");
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
            const varName = bindCardEntity(ed, index);
            return editor._writeDraft(ed).then(function () {
              const next = Object.assign({}, ownConfig);
              if (varName) next.variables = Object.assign(listToObject(ownConfig.variables), draftValuesFor(ed, [varName]));
              return next;
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
          if (!isStack(ed.card) && isObject(card.grid_options)) ed.grid_options = clone(card.grid_options);
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
          const next = Object.assign({}, this._config, { template: "" });
          delete next.variables;
          this._changed(next);
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
