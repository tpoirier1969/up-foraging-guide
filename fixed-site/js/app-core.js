import { state, setRoute, setSpecies, setRareSpecies, setReferences, logBoot } from "./state.js";
import { MEDICINAL_VOCAB } from "./data/medicinal-vocabulary.js";
import { renderPage, openModal, closeModal, els } from "./ui/dom.js";
import { markActiveNav } from "./ui/nav.js";
import { esc } from "./lib/escape.js";
import { isEdibleForSection } from "./lib/merge.js";

const APP_VERSION = new URL(import.meta.url).searchParams.get("v") || window.UP_FORAGING_APP_VERSION || "dev";
const REVIEW_STORAGE_KEY = "foraging_review_overlay_v1";
const moduleCache = new Map();
let loadAppDataPromise = null;
let renderToken = 0;
let searchInputDebounceTimer = null;
let plantLaneDelegationInstalled = false;
const SEARCH_DEBOUNCE_MS = 750;
const SEARCH_RESULT_LIMIT = 80;
const VALID_PLANT_LANE_IDS = new Set([
  "leaves-greens",
  "flowers",
  "berries-fruits",
  "roots-tubers",
  "nuts-seeds",
  "trees-shrubs-sap",
  "tea-infusions"
]);

const IN_SEASON_ROUTE = "mushrooms-in-season";
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const SEASON_EDGE_DAYS = 7;

function versionedPath(path) {
  return path.includes("?") ? path : `${path}?v=${encodeURIComponent(APP_VERSION)}`;
}

function routePartsFromHash() {
  const raw = String(location.hash || "#/home").replace(/^#\/?/, "") || "home";
  const [routePart, queryPart = ""] = raw.split("?");
  return { route: routePart || "home", params: new URLSearchParams(queryPart) };
}

function normalizePlantLane(lane = "") {
  const cleanLane = String(lane || "").trim();
  return VALID_PLANT_LANE_IDS.has(cleanLane) ? cleanLane : "";
}

function plantLaneHash(lane = "") {
  const cleanLane = normalizePlantLane(lane);
  return cleanLane ? `#/plants?plantLane=${encodeURIComponent(cleanLane)}` : "#/plants";
}

function searchHash(query = "") {
  const cleanQuery = String(query || "").trim();
  return cleanQuery ? `#/search?q=${encodeURIComponent(cleanQuery)}` : "#/search";
}

function syncRouteFilters(route, params) {
  if (route === "plants") {
    state.filters.plantLane = normalizePlantLane(params.get("plantLane") || "");
  }
  if (route === "search") {
    state.filters.search = String(params.get("q") || "").trim();
  }
}

function parseRoute() {
  const { route, params } = routePartsFromHash();
  syncRouteFilters(route, params);
  return route;
}


function routeIntro(route) {
  return {
    "other-uses": "True non-food practical uses only: tinder, dye, fiber, pitch, craft, material, scouring, or similar uses. Look-alikes and ID comparisons remain in their normal caution or ID sections, not here.",
    review: "Review is a work queue, not a species type. Records here may also remain in their normal food, caution, medicinal, rare, or ID/comparison sections."
  }[route] || "";
}

function routeTitle(route) {
  return {
    home: "Home",
    plants: "Plants",
    mushrooms: "Mushrooms",
    "mushrooms-gilled": "Gilled mushrooms",
    boletes: "Spongelike",
    "mushrooms-other": "Other mushrooms",
    "mushrooms-in-season": "In Season",
    medicinal: "Medicinal",
    rare: "Rare",
    lookalikes: "Caution",
    "other-uses": "Other Uses",
    review: "Needs Review",
    references: "References",
    credits: "Credits",
    search: "Search"
  }[route] || "Home";
}

function importModule(path) {
  const key = versionedPath(path);
  if (!moduleCache.has(key)) moduleCache.set(key, import(key));
  return moduleCache.get(key);
}

async function loadAppDataModule() {
  if (!loadAppDataPromise) {
    loadAppDataPromise = importModule("./data/load-app-data.js");
  }
  return loadAppDataPromise;
}

function statusHtml(title = "Loading…", items = [], extra = "") {
  return `
    <section class="panel">
      <h2>${esc(title)}</h2>
      ${extra ? `<p>${esc(extra)}</p>` : ""}
      <ul class="status-log">${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function routeErrorHtml(route, message) {
  return `
    <section class="error-box">
      <h2>${esc(routeTitle(route))} failed</h2>
      <p>This page module broke, but the rest of the app shell is still alive.</p>
      <p class="codeish">${esc(message)}</p>
      <div class="control-row"><button id="retryRoute" class="primary" type="button">Retry this page</button></div>
    </section>
  `;
}

function mushroomLaneLandingHtml() {
  return `
    <section class="panel mushroom-lane-switcher">
      <h2>Mushrooms</h2>
      <p>Start with the underside. That gets most people to the right part of the guide faster than taxonomy ever will.</p>
      <div class="lane-grid">
        <a class="lane-card" href="#/mushrooms-gilled"><strong>Gilled</strong><span>Thin blade-like gills under the cap.</span></a>
        <a class="lane-card" href="#/boletes"><strong>Spongelike</strong><span>Pores, tubes, or sponge-like underside.</span></a>
        <a class="lane-card" href="#/mushrooms-other"><strong>Other</strong><span>Teeth, ridges, shelves, coral, jelly, and oddballs.</span></a>
        <a class="lane-card" href="#/mushrooms-in-season"><strong>In Season</strong><span>Edible mushrooms matching the current season window.</span></a>
      </div>
    </section>
  `;
}

function mushroomLaneNavHtml(route = "") {
  if (!["mushrooms-gilled", "boletes", "mushrooms-other", IN_SEASON_ROUTE].includes(route)) return "";
  const item = (href, key, label, note) => {
    const active = route === key ? " active" : "";
    return `<a class="lane-card${active}" href="${href}"><strong>${esc(label)}</strong><span>${esc(note)}</span></a>`;
  };
  return `
    <section class="panel mushroom-lane-switcher">
      <h3>Mushroom underside / form</h3>
      <div class="lane-grid">
        ${item("#/mushrooms-gilled", "mushrooms-gilled", "Gilled", "Thin blade-like gills under the cap.")}
        ${item("#/boletes", "boletes", "Spongelike", "Pores, tubes, or sponge-like underside.")}
        ${item("#/mushrooms-other", "mushrooms-other", "Other", "Teeth, ridges, shelves, coral, jelly, and oddballs.")}
        ${item("#/mushrooms-in-season", IN_SEASON_ROUTE, "In Season", "Edible mushrooms matching the current season window.")}
      </div>
    </section>
  `;
}

function optionHtml(values, current, blankLabel) {
  return [`<option value="">${esc(blankLabel)}</option>`]
    .concat((values || []).map((item) => {
      const value = item && typeof item === "object" ? String(item.value || "") : String(item || "");
      const label = item && typeof item === "object" ? String(item.label || item.value || "") : value;
      return `<option value="${esc(value)}" ${current === value ? "selected" : ""}>${esc(label)}</option>`;
    }))
    .join("");
}

const PLANT_TRAIT_FILTER_KEYS = [
  "plantMonth", "plantPart", "plantHabitat", "plantSize", "plantTaste",
  "plantFlowerColor", "plantFruitColor", "plantLeafShape", "plantLeafArrangement", "plantStem",
  "plantLane"
];

const CAUTION_FILTER_KEYS = ["cautionSeverity", "cautionForm", "cautionConfusedWith", "cautionAffectedSystem", "cautionCriticalCheck", "cautionSeason"];

const MUSHROOM_TRAIT_FILTER_KEYS = [
  "mushroomMonth", "mushroomReviewFlag", "mushroomCapColor", "mushroomUnderside",
  "mushroomUndersideColor", "mushroomStemColor", "mushroomStaining", "mushroomFleshColor",
  "mushroomSporePrintColor", "mushroomCapSurface", "mushroomStemFeature", "mushroomSmell",
  "mushroomTaste", "mushroomSubstrate", "mushroomHabitat", "mushroomTreeType", "mushroomHost",
  "mushroomRing", "mushroomTexture", "mushroomBoleteGroup", "mushroomBoleteSubgroup",
  "mushroomPoreColor", "mushroomTreeAssociation"
];

const SORT_OPTIONS = [
  { value: "default", label: "Default order" },
  { value: "name", label: "Name A–Z" },
  { value: "commonness", label: "Commonality — common first" },
  { value: "foodQuality", label: "Foraging value — best first" },
  { value: "season", label: "Season — earliest first" }
];

function isSortableRoute(route) {
  return [
    "plants", "mushrooms-gilled", "boletes", "mushrooms-other",
    "medicinal", "lookalikes", "caution", "other-uses", "search", "review"
  ].includes(route);
}

function isPlantFilterRoute(route) {
  return route === "plants";
}

function isMushroomFilterRoute(route) {
  return ["mushrooms-gilled", "boletes", "mushrooms-other"].includes(route);
}

function clearTraitFiltersForRoute(route) {
  const keys = isPlantFilterRoute(route)
    ? PLANT_TRAIT_FILTER_KEYS
    : (isMushroomFilterRoute(route) ? MUSHROOM_TRAIT_FILTER_KEYS : []);
  keys.forEach((key) => { state.filters[key] = ""; });
}

function renderSortControls(route) {
  if (!isSortableRoute(route)) return "";
  const current = state.filters.sortSpecies || "default";
  return `
    <section class="panel">
      <div class="medicinal-filter-row" style="display:grid;grid-template-columns:minmax(220px,320px) minmax(260px,1fr);gap:12px;align-items:end;">
        <div class="medicinal-filter-cell">
          <label for="speciesSortSelect" class="muted small">Sort</label>
          <select id="speciesSortSelect" style="width:100%">${optionHtml(SORT_OPTIONS, current, "Default order")}</select>
        </div>
        <p class="muted small" style="margin:0;">Sorting applies after the current filters. Foraging value sorting puts prime and high-value foods first when those records have value data.</p>
      </div>
    </section>
  `;
}

function renderTraitFilters(route, filterFields = [], activeTraitFilters = false) {
  if (!filterFields.length) return "";
  const title = isPlantFilterRoute(route) ? "Plant filters" : (route === "boletes" ? "Spongelike mushroom filters" : "Mushroom filters");
  return `
    <section class="panel">
      <div class="home-focus-heading">
        <h3>${esc(title)}</h3>
        ${activeTraitFilters ? `<button id="traitClearBtn" type="button">Clear filters</button>` : ""}
      </div>
      <div class="medicinal-filter-row" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;align-items:end;">
        ${filterFields.map((field) => `
          <div class="medicinal-filter-cell">
            <label for="traitFilter_${esc(field.key)}" class="muted small">${esc(field.label)}</label>
            <select id="traitFilter_${esc(field.key)}" data-trait-filter="${esc(field.key)}" style="width:100%">
              ${optionHtml(field.options, state.filters[field.key] || "", field.blankLabel || "Any")}
            </select>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}



function renderCautionFilters(filterFields = [], activeCautionFilters = false) {
  if (!filterFields.length) return "";
  return `
    <section class="panel caution-filter-panel">
      <div class="home-focus-heading caution-filter-heading">
        <div>
          <h3>Caution filters</h3>
          <p class="muted small">Narrow danger and caution records by risk, mushroom form, common confusion trap, affected body system, and the field check that separates the look-alikes.</p>
        </div>
        ${activeCautionFilters ? `<button id="cautionClearBtn" type="button">Clear filters</button>` : ""}
      </div>
      <div class="caution-filter-grid">
        ${filterFields.map((field) => `
          <div class="caution-filter-cell">
            <label for="cautionFilter_${esc(field.key)}" class="muted small">${esc(field.label)}</label>
            <select id="cautionFilter_${esc(field.key)}" data-caution-filter="${esc(field.key)}">
              ${optionHtml(field.options, state.filters[field.key] || "", field.blankLabel || "Any")}
            </select>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function sanitizeTraitFiltersForRoute(route, filterFields = []) {
  const activeKeys = new Set((filterFields || []).map((field) => field.key));
  const validValuesByKey = new Map((filterFields || []).map((field) => [field.key, new Set((field.options || []).map((option) => String(option.value || option || "")))]));
  const keys = isPlantFilterRoute(route)
    ? PLANT_TRAIT_FILTER_KEYS
    : (isMushroomFilterRoute(route) ? MUSHROOM_TRAIT_FILTER_KEYS : []);
  let changed = false;
  for (const key of keys) {
    const selected = String(state.filters[key] || "").trim();
    if (!selected) continue;
    if (key === "plantLane") {
      // Plant-lane buttons are rendered separately from the select-based trait filters.
      // They intentionally do not appear in filterFields, so validating them against
      // activeKeys here would immediately clear the click selection before the list
      // can be filtered. Leave plantLane alone unless an explicit clear action resets it.
      continue;
    }
    const validValues = validValuesByKey.get(key);
    // Filters shared across mushroom lanes should not silently zero out another lane.
    // If the selected value is not available for the current lane, clear it for this view.
    if (!activeKeys.has(key) || !validValues || !validValues.has(selected)) {
      state.filters[key] = "";
      changed = true;
    }
  }
  return changed;
}

function controlsHtml(route = "general", placeholder = "Search species", filterFields = [], activeTraitFilters = false, plantLaneControls = "") {
  const search = state.filters.search || "";
  const sortControls = renderSortControls(route);
  if (route === "medicinal") {
    return `
      <section class="panel">
        <div class="medicinal-filter-row">
          <div class="medicinal-filter-cell">
            <label for="medicinalActionFilter" class="muted small">Action</label>
            <select id="medicinalActionFilter" style="width:100%">${optionHtml(MEDICINAL_VOCAB.actions, state.filters.medicinalAction, "Any action")}</select>
          </div>
          <div class="medicinal-filter-cell">
            <label for="medicinalSystemFilter" class="muted small">Body system</label>
            <select id="medicinalSystemFilter" style="width:100%">${optionHtml(MEDICINAL_VOCAB.bodySystems, state.filters.medicinalSystem, "Any body system")}</select>
          </div>
          <div class="medicinal-filter-cell">
            <label for="medicinalTermFilter" class="muted small">Medical term</label>
            <select id="medicinalTermFilter" style="width:100%">${optionHtml(MEDICINAL_VOCAB.symptoms, state.filters.medicinalTerm, "Any medical term")}</select>
          </div>
          <div class="medicinal-filter-actions">
            ${(state.filters.medicinalAction || state.filters.medicinalSystem || state.filters.medicinalTerm) ? `<button id="speciesClearBtn" type="button">Clear</button>` : ""}
          </div>
        </div>
      </section>
      ${sortControls}
    `;
  }
  if (route === "lookalikes" || route === "caution") {
    return `${renderCautionFilters(filterFields, activeTraitFilters)}${sortControls}`;
  }
  if (route === "search") {
    return `
      <section class="panel">
        <div class="control-row">
          <input id="speciesSearch" type="search" value="${esc(search)}" placeholder="${esc(placeholder)}" style="flex:1;min-width:280px" autocomplete="off">
          <button id="speciesSearchBtn" class="primary" type="button">Search</button>
          ${search ? `<button id="speciesClearBtn" type="button">Clear</button>` : ""}
        </div>
        <p id="speciesSearchStatus" class="muted small" aria-live="polite">${search ? "Edit the search text or press Search." : "Search opens blank. Start typing and results will load after a short pause."}</p>
      </section>
      ${search ? sortControls : ""}
    `;
  }
  if (isPlantFilterRoute(route) || isMushroomFilterRoute(route)) {
    return `${mushroomLaneNavHtml(route)}${plantLaneControls}${renderTraitFilters(route, filterFields, activeTraitFilters)}${sortControls}`;
  }
  return sortControls;
}
function getRecordBySlug(slug) {
  return state.species.find(record => record.slug === slug)
    || state.rareSpecies.find(record => record.slug === slug);
}

function loadReviewOverlay() {
  try {
    state.reviewOverlay = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || "{}");
  } catch {
    state.reviewOverlay = {};
  }
}

function saveReviewOverlay() {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state.reviewOverlay || {}));
}

function applyReviewOverlay(records) {
  return (records || []).map((record) => {
    const overlay = state.reviewOverlay?.[record.slug] || {};
    const reviewReasons = Array.from(new Set([...(record.reviewReasons || []), ...(overlay.review_reasons || [])].filter(Boolean)));
    const review_status = overlay.review_status || record.review_status || (reviewReasons.length ? "needs_review" : "ok");
    return {
      ...record,
      review_status,
      reviewReasons,
      review_notes: overlay.review_notes || record.review_notes || ""
    };
  });
}

function setReviewStatus(slug, status, extra = {}) {
  if (!slug) return;
  const current = state.reviewOverlay?.[slug] || {};
  const next = { ...current, ...extra, review_status: status };
  if (status === "ok") {
    next.review_status = "ok";
  }
  state.reviewOverlay = { ...(state.reviewOverlay || {}), [slug]: next };
  saveReviewOverlay();
  state.species = applyReviewOverlay(state.species);
}

async function enhanceImages(root) {
  if (!root?.querySelector?.("img[data-record-image]")) return;
  try {
    const { installLazyImages } = await importModule("./lib/image-resolver.js");
    installLazyImages(root, getRecordBySlug);
  } catch {}
}

function wireModalClose() {
  els.closeModalBtn?.addEventListener("click", closeModal);
  els.modal?.addEventListener("click", (event) => {
    const card = els.modal.querySelector(".modal-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const inside = rect.left <= event.clientX && event.clientX <= rect.right && rect.top <= event.clientY && event.clientY <= rect.bottom;
    if (!inside) closeModal();
  });
}

function labelFromSlug(slug = "") {
  return String(slug || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function openRecordDetail(slug) {
  const record = getRecordBySlug(slug);
  if (!record) {
    openModal(`<section class="detail-block"><h3>${esc(labelFromSlug(slug))}</h3><p>This look-alike or related species is named in the guide, but it does not have a full species page yet.</p><p class="muted">Treat unlinked look-alikes as a warning, not as a confirmed safe substitute.</p></section>`);
    return;
  }
  try {
    const { renderDetail } = await importModule("./ui/render-detail.js");
    openModal(renderDetail(record));
    wireActionButtons(els.modalContent);
    await enhanceImages(els.modalContent);
  } catch (err) {
    openModal(`<section class="error-box"><h3>Detail view failed</h3><p class="codeish">${esc(err?.message || String(err))}</p></section>`);
  }
}

function wireSearchBlock(inputId, buttonId, onSubmit) {
  const input = document.getElementById(inputId);
  document.getElementById(buttonId)?.addEventListener("click", () => onSubmit(input?.value || ""));
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") onSubmit(input?.value || "");
  });
}

function wireActionButtons(root = document) {
  root.querySelectorAll("[data-detail]").forEach((btn) => {
    btn.addEventListener("click", () => openRecordDetail(btn.dataset.detail));
  });
  root.querySelectorAll("[data-review-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug || "";
      const action = btn.dataset.reviewAction;
      if (!slug || !action) return;
      if (action === "mark-ok") {
        setReviewStatus(slug, "ok");
        closeModal();
        renderCurrentRoute();
        return;
      }
      if (action === "send-review") {
        setReviewStatus(slug, "needs_review");
        closeModal();
        location.hash = "#/review";
      }
    });
  });
}

function clearRouteFilters(route) {
  state.filters.search = "";
  if (route === "medicinal") {
    state.filters.medicinalAction = "";
    state.filters.medicinalSystem = "";
    state.filters.medicinalTerm = "";
  }
  if (route === "lookalikes" || route === "caution") {
    CAUTION_FILTER_KEYS.forEach((key) => { state.filters[key] = ""; });
  }
  clearTraitFiltersForRoute(route);
}


function installPlantLaneDelegation() {
  if (plantLaneDelegationInstalled) return;
  plantLaneDelegationInstalled = true;
  document.addEventListener("click", (event) => {
    const laneButton = event.target?.closest?.(".plant-lane-switcher [data-plant-lane]");
    if (laneButton) {
      event.preventDefault();
      const lane = laneButton.dataset.plantLane || "";
      const nextLane = state.filters.plantLane === lane ? "" : lane;
      const nextHash = plantLaneHash(nextLane);
      if (location.hash === nextHash) {
        state.filters.plantLane = nextLane;
        renderCurrentRoute();
      } else {
        location.hash = nextHash;
      }
      return;
    }

    const clearButton = event.target?.closest?.(".plant-lane-switcher [data-plant-lane-clear], .plant-lane-switcher #plantLaneClearBtn");
    if (clearButton) {
      event.preventDefault();
      if (location.hash === "#/plants") {
        state.filters.plantLane = "";
        renderCurrentRoute();
      } else {
        location.hash = "#/plants";
      }
    }
  });
}

function wireCommonEvents(route) {
  wireSearchBlock("homeSearch", "homeSearchBtn", (value) => {
    state.filters.search = String(value || "").trim();
    location.hash = searchHash(state.filters.search);
  });
  wireSearchBlock("speciesSearch", "speciesSearchBtn", (value) => {
    clearTimeout(searchInputDebounceTimer);
    state.filters.search = String(value || "").trim();
    if (route === "search") {
      const nextHash = searchHash(state.filters.search);
      if (location.hash === nextHash) renderCurrentRoute();
      else location.hash = nextHash;
      return;
    }
    renderCurrentRoute();
  });
  document.getElementById("speciesClearBtn")?.addEventListener("click", () => {
    clearRouteFilters(route);
    if (route === "search") {
      const nextHash = "#/search";
      if (location.hash === nextHash) renderCurrentRoute();
      else location.hash = nextHash;
      return;
    }
    renderCurrentRoute();
  });
  document.getElementById("medicinalActionFilter")?.addEventListener("change", (event) => {
    state.filters.medicinalAction = event.currentTarget.value || "";
    renderCurrentRoute();
  });
  document.getElementById("medicinalSystemFilter")?.addEventListener("change", (event) => {
    state.filters.medicinalSystem = event.currentTarget.value || "";
    renderCurrentRoute();
  });
  document.getElementById("medicinalTermFilter")?.addEventListener("change", (event) => {
    state.filters.medicinalTerm = event.currentTarget.value || "";
    renderCurrentRoute();
  });
  document.querySelectorAll("[data-trait-filter]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const key = event.currentTarget.dataset.traitFilter || "";
      if (!key) return;
      state.filters[key] = event.currentTarget.value || "";
      renderCurrentRoute();
    });
  });
  // Plant-lane buttons are handled by one delegated listener installed at startup.
  // Keeping the handler outside this per-render wiring avoids dead buttons when
  // lane controls are re-rendered or injected by later UI passes.
  document.getElementById("speciesSortSelect")?.addEventListener("change", (event) => {
    state.filters.sortSpecies = event.currentTarget.value || "default";
    renderCurrentRoute();
  });
  document.getElementById("traitClearBtn")?.addEventListener("click", () => {
    clearTraitFiltersForRoute(route);
    if (route === "plants") {
      const cleanHash = "#/plants";
      if (location.hash === cleanHash) {
        renderCurrentRoute();
      } else {
        location.hash = cleanHash;
      }
      return;
    }
    renderCurrentRoute();
  });
  document.querySelectorAll("[data-caution-filter]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const key = event.currentTarget.dataset.cautionFilter || "";
      if (!key) return;
      state.filters[key] = event.currentTarget.value || "";
      renderCurrentRoute();
    });
  });
  document.getElementById("cautionClearBtn")?.addEventListener("click", () => {
    CAUTION_FILTER_KEYS.forEach((key) => { state.filters[key] = ""; });
    renderCurrentRoute();
  });
  if (route === "search") {
    const searchInput = document.getElementById("speciesSearch");
    const searchStatus = document.getElementById("speciesSearchStatus");
    searchInput?.addEventListener("input", () => {
      clearTimeout(searchInputDebounceTimer);
      const value = String(searchInput.value || "").trim();
      if (!value) {
        state.filters.search = "";
        if (searchStatus) searchStatus.textContent = "Search is blank. Start typing to search.";
        searchInputDebounceTimer = setTimeout(() => {
          if (location.hash === "#/search") renderCurrentRoute();
          else location.replace("#/search");
        }, 200);
        return;
      }
      if (searchStatus) searchStatus.textContent = "Loading shortly after typing stops…";
      searchInputDebounceTimer = setTimeout(() => {
        state.filters.search = value;
        const nextHash = searchHash(value);
        if (location.hash === nextHash) renderCurrentRoute();
        else location.replace(nextHash);
      }, SEARCH_DEBOUNCE_MS);
    });
    window.requestAnimationFrame(() => {
      try { searchInput?.focus({ preventScroll: true }); } catch { searchInput?.focus(); }
      try { searchInput?.select?.(); } catch {}
    });
  }
  wireActionButtons(document);
  enhanceImages(els.pageRoot);
  document.getElementById("retryRoute")?.addEventListener("click", () => renderCurrentRoute());
}

async function ensureRareData() {
  if (state.rareReady) return state.rareSpecies;
  if (!state.rarePromise) {
    state.rarePromise = (async () => {
      const { loadRareSpecies } = await loadAppDataModule();
      const records = await loadRareSpecies((message) => logBoot(`[rare] ${message}`));
      setRareSpecies(records);
      return records;
    })();
  }
  return state.rarePromise;
}

async function ensureReferencesData() {
  if (state.referencesReady) return state.references;
  if (!state.referencesPromise) {
    state.referencesPromise = (async () => {
      const { loadReferences } = await loadAppDataModule();
      const records = await loadReferences((message) => logBoot(`[references] ${message}`));
      setReferences(records);
      return records;
    })();
  }
  return state.referencesPromise;
}


function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  return [value];
}

function monthValues(record = {}) {
  const out = [];
  out.push(...asList(record.months_available));
  out.push(...asList(record.season_months).map((value) => MONTHS[Number(value) - 1] || ""));
  out.push(...asList(record.month_numbers).map((value) => MONTHS[Number(value) - 1] || ""));
  return Array.from(new Set(out.map((value) => String(value || "").trim()).filter(Boolean)));
}

function monthNumberFromName(monthName = "") {
  return MONTHS.findIndex((month) => month.toLowerCase() === String(monthName || "").toLowerCase()) + 1;
}

function escapeRegex(value = "") {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function textMentionsMonth(text = "", monthName = "") {
  const month = String(monthName || "").trim();
  if (!month) return false;
  return new RegExp(`\\b${escapeRegex(month.toLowerCase())}\\b`, "i").test(String(text || ""));
}
function seasonText(record = {}) {
  return [
    record.season,
    record.seasonality,
    record.fruiting_period,
    record.fruitingPeriod,
    record.availability,
    record.mushroom_profile?.season_note,
    record.mushroom_profile?.fruiting_period,
    record.mushroom_profile?.seasonality
  ].flatMap(asList).join(" ").toLowerCase();
}

function seasonTextMatchesMonth(record = {}, monthName = "") {
  const month = monthNumberFromName(monthName);
  if (!month) return false;
  const text = seasonText(record);
  if (!text) return false;
  if (textMentionsMonth(text, monthName)) return true;
  if (/year[- ]round|all year|perennial|visible year/.test(text)) return true;
  if (/early spring/.test(text)) return [3, 4].includes(month);
  if (/mid spring/.test(text)) return [4, 5].includes(month);
  if (/late spring/.test(text)) return [5, 6].includes(month);
  if (/spring/.test(text)) return [3, 4, 5].includes(month);
  if (/early summer/.test(text)) return [6, 7].includes(month);
  if (/mid summer/.test(text)) return [7, 8].includes(month);
  if (/late summer/.test(text)) return [8, 9].includes(month);
  if (/summer/.test(text)) return [6, 7, 8].includes(month);
  if (/early fall|early autumn/.test(text)) return [9, 10].includes(month);
  if (/mid fall|mid autumn/.test(text)) return [10].includes(month);
  if (/late fall|late autumn/.test(text)) return [10, 11].includes(month);
  if (/fall|autumn/.test(text)) return [9, 10, 11].includes(month);
  if (/winter/.test(text)) return [12, 1, 2].includes(month);
  return false;
}

function hasExplicitMonthData(record = {}) {
  return monthValues(record).length > 0;
}

function hasMonth(record, monthName) {
  const wanted = String(monthName || "").toLowerCase();
  const explicitMonths = monthValues(record);
  if (explicitMonths.length) {
    return explicitMonths.some((value) => String(value || "").toLowerCase() === wanted);
  }
  return seasonTextMatchesMonth(record, monthName);
}

function isMushroomRecord(record = {}) {
  const text = [
    record.primary_type,
    record.record_type,
    record.kingdom_type,
    record.foraging_class,
    record.category
  ].join(" ").toLowerCase();
  if (text.includes("plant")) return false;
  return text.includes("mushroom") || text.includes("fung") || text.includes("bolete") || Boolean(record.mushroom_profile);
}

function isForageMushroomRecord(record = {}) {
  if (!isMushroomRecord(record) || record.hidden || record.is_non_edible === true) return false;
  return isEdibleForSection(record) === true;
}

function daysInCurrentMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function monthNameByOffset(monthName = "", offset = 0) {
  const monthIndex = MONTHS.findIndex((month) => month.toLowerCase() === String(monthName || "").toLowerCase());
  if (monthIndex < 0) return "";
  return MONTHS[(monthIndex + offset + 12) % 12] || "";
}

function explicitMonthMatch(record = {}, monthName = "") {
  const wanted = String(monthName || "").toLowerCase();
  if (!wanted) return false;
  const explicitMonths = monthValues(record);
  if (explicitMonths.length) {
    return explicitMonths.some((value) => String(value || "").toLowerCase() === wanted);
  }
  return textMentionsMonth(seasonText(record), monthName);
}

function edgeSeasonTextMatch(record = {}, monthName = "", direction = "next") {
  const text = seasonText(record);
  if (!text) return false;
  const month = monthNumberFromName(monthName);
  if (!month) return false;

  // When a record has explicit month fields, do not let generic text like
  // "summer" or "fall" expand the In Season window beyond those fields.
  if (hasExplicitMonthData(record)) return false;

  if (direction === "next") {
    if (text.includes(String(monthName || "").toLowerCase()) && !new RegExp(`\\blate\\s+${String(monthName || "").toLowerCase()}\\b`).test(text)) return true;
    if (/early summer/.test(text)) return month === 6;
    if (/early fall|early autumn/.test(text)) return month === 9;
    if (/early winter/.test(text)) return month === 12;
    if (/early spring/.test(text)) return month === 3;
  }

  if (direction === "previous") {
    if (text.includes(String(monthName || "").toLowerCase()) && !new RegExp(`\\bearly\\s+${String(monthName || "").toLowerCase()}\\b`).test(text)) return true;
    if (/late winter/.test(text)) return month === 2;
    if (/late spring/.test(text)) return month === 5;
    if (/late summer/.test(text)) return month === 8;
    if (/late fall|late autumn/.test(text)) return month === 11;
  }

  return false;
}

function activeSeasonWindow(date = new Date()) {
  const current = MONTHS[date.getMonth()] || "";
  const day = date.getDate();
  const days = daysInCurrentMonth(date);
  const window = [{ month: current, mode: "current" }];

  if (day <= SEASON_EDGE_DAYS) {
    const previous = monthNameByOffset(current, -1);
    if (previous) window.unshift({ month: previous, mode: "previous" });
  }
  if (day > days - SEASON_EDGE_DAYS) {
    const next = monthNameByOffset(current, 1);
    if (next) window.push({ month: next, mode: "next" });
  }
  return window;
}

function seasonWindowLabel(window = []) {
  const months = window.map((item) => item.month).filter(Boolean);
  if (months.length <= 1) return months[0] || "current month";
  return months.join(" / ");
}

function hasMonthWindow(record, window = activeSeasonWindow()) {
  return window.some((item) => {
    if (item.mode === "current") return hasMonth(record, item.month);
    return explicitMonthMatch(record, item.month) || edgeSeasonTextMatch(record, item.month, item.mode);
  });
}

function compareDisplayName(a, b) {
  return String(a.display_name || a.common_name || a.slug || "").localeCompare(String(b.display_name || b.common_name || b.slug || ""));
}

async function renderInSeasonRoute(token) {
  const { renderRecordCards } = await importModule("./ui/render-list.js");
  if (token !== renderToken) return;
  const window = activeSeasonWindow();
  const label = seasonWindowLabel(window);
  const records = (state.species || [])
    .filter((record) => isForageMushroomRecord(record))
    .filter((record) => hasMonthWindow(record, window))
    .sort(compareDisplayName);

  renderPage(`
    ${mushroomLaneNavHtml(IN_SEASON_ROUTE)}
    <section class="panel" data-mushroom-season-page="true">
      <h2>In Season — ${esc(label)} (${records.length})</h2>
    </section>
    ${records.length ? renderRecordCards(records, IN_SEASON_ROUTE) : `<section class="panel"><p>No edible mushroom records currently match the ${esc(label)} season window.</p></section>`}
  `);
  wireCommonEvents(IN_SEASON_ROUTE);
}

async function renderHomeRoute(token) {
  const { renderHome } = await importModule("./ui/render-home.js");
  if (token !== renderToken) return;
  renderPage(renderHome(state.species, state.loadErrors || [], state.rareSpecies || []));
  wireCommonEvents("home");
}

async function renderSpeciesRoute(route, token) {
  const {
    filterRecords,
    renderRecordCards,
    getFilterFieldsForRoute,
    hasActiveTraitFilters,
    sortRecords,
    renderPlantLaneControls,
    getCautionFilterFields,
    hasActiveCautionFilters
  } = await importModule("./ui/render-list.js");
  if (token !== renderToken) return;

  if (route === "search" && !String(state.filters.search || "").trim()) {
    renderPage(`
      ${controlsHtml(route, "Search all species", [], false, "")}
      <section class="panel empty-state">
        <h2>Search</h2>
        <p>Type a plant, mushroom, look-alike, color, month, or use.</p>
        <p class="muted small">Try: <a href="#/search?q=morel">morel</a>, <a href="#/search?q=blueberry">blueberry</a>, <a href="#/search?q=Amanita">Amanita</a>, <a href="#/search?q=tea">tea</a>, or <a href="#/search?q=June">June</a>.</p>
      </section>
    `);
    wireCommonEvents(route);
    return;
  }

  const matchRoute = route === "search" ? "general" : route;
  let filterFields = route === "search"
    ? []
    : ((route === "lookalikes" || route === "caution")
      ? getCautionFilterFields(state.species, state.filters)
      : getFilterFieldsForRoute(state.species, matchRoute, state.filters));
  if (route !== "search" && !(route === "lookalikes" || route === "caution") && sanitizeTraitFiltersForRoute(matchRoute, filterFields)) {
    filterFields = getFilterFieldsForRoute(state.species, matchRoute, state.filters);
  }
  const activeTraitFilters = route === "search"
    ? false
    : ((route === "lookalikes" || route === "caution")
      ? hasActiveCautionFilters(state.filters)
      : hasActiveTraitFilters(matchRoute, state.filters));
  const plantLaneControls = route === "plants" ? renderPlantLaneControls(state.species, state.filters) : "";
  const filtered = filterRecords(state.species, matchRoute, state.filters);
  const sorted = sortRecords(filtered, state.filters.sortSpecies || "default");
  const visibleRecords = route === "search" ? sorted.slice(0, SEARCH_RESULT_LIMIT) : sorted;
  const limitNote = route === "search" && sorted.length > visibleRecords.length
    ? `<p class="muted small">Showing the first ${visibleRecords.length} of ${sorted.length} matches. Keep typing to narrow the list.</p>`
    : "";
  const title = route === "search" ? `Search results (${filtered.length})` : `${routeTitle(route)} (${filtered.length})`;
  const intro = routeIntro(route);
  renderPage(`
    ${controlsHtml(route, route === "search" ? "Search all species" : `Search ${routeTitle(route).toLowerCase()}`, filterFields, activeTraitFilters, plantLaneControls)}
    <section class="panel"><h2>${esc(title)}</h2>${intro ? `<p class="muted small">${esc(intro)}</p>` : ""}${limitNote}</section>
    ${visibleRecords.length ? renderRecordCards(visibleRecords, route) : `<section class="panel empty-state"><h3>No species found</h3></section>`}
  `);
  wireCommonEvents(route);
}

async function renderRareRoute(token) {
  if (!state.rareReady) {
    renderPage(statusHtml("Loading rare species…", ["Rare species are loading for this section."]));
    try {
      await ensureRareData();
    } catch (err) {
      if (token !== renderToken) return;
      renderPage(routeErrorHtml("rare", err?.message || String(err)));
      wireCommonEvents("rare");
      return;
    }
    if (token !== renderToken) return;
  }
  const { renderRarePage } = await importModule("./ui/render-rare.js");
  if (token !== renderToken) return;
  renderPage(renderRarePage(state.rareSpecies, state.filters.search));
  wireCommonEvents("rare");
}

async function renderReferencesRoute(token) {
  if (!state.referencesReady) {
    renderPage(statusHtml("Loading references…", ["References are lazy-loaded only when you open this section."]));
    try {
      await ensureReferencesData();
    } catch (err) {
      if (token !== renderToken) return;
      renderPage(routeErrorHtml("references", err?.message || String(err)));
      wireCommonEvents("references");
      return;
    }
    if (token !== renderToken) return;
  }
  const { renderReferencesPage } = await importModule("./ui/render-references.js");
  if (token !== renderToken) return;
  renderPage(renderReferencesPage(state.references, ""));
  wireCommonEvents("references");
}

async function renderCreditsRoute(token) {
  const { renderCreditsPage } = await importModule("./ui/render-credits.js");
  if (token !== renderToken) return;
  renderPage(renderCreditsPage(state.species, state.imageCredits, state.filters.search));
  wireCommonEvents("credits");
}

export async function renderCurrentRoute() {
  const token = ++renderToken;
  const route = parseRoute();
  setRoute(route);
  markActiveNav(route === "search" ? "search" : (route.startsWith("mushrooms-") || route === "boletes" ? "mushrooms" : (route === "other-uses" ? "other-uses" : route)));

  if (state.loading && !state.coreReady) {
    renderPage(statusHtml("Loading app…", state.bootLog, "Plants, mushrooms, and the rare-species count are loading first."));
    return;
  }

  try {
    if (route === "home") return await renderHomeRoute(token);
    if (route === IN_SEASON_ROUTE) return await renderInSeasonRoute(token);
    if (route === "mushrooms") {
      renderPage(mushroomLaneLandingHtml());
      wireCommonEvents("mushrooms");
      return;
    }
    if (route === "rare") return await renderRareRoute(token);
    if (route === "references") return await renderReferencesRoute(token);
    if (route === "credits") return await renderCreditsRoute(token);
    if (["plants", "mushrooms-gilled", "boletes", "mushrooms-other", "medicinal", "lookalikes", "other-uses", "review", "search"].includes(route)) {
      return await renderSpeciesRoute(route, token);
    }
    await renderHomeRoute(token);
  } catch (err) {
    if (token !== renderToken) return;
    renderPage(routeErrorHtml(route, err?.message || String(err)));
    wireCommonEvents(route);
  }
}

export async function startApp() {
  // Visible version badge is owned by boot.js so the UI shows one consistent human-facing version.
  installPlantLaneDelegation();
  wireModalClose();
  loadReviewOverlay();
  window.addEventListener("hashchange", renderCurrentRoute);
  state.loading = true;
  renderPage(statusHtml("Loading app…", state.bootLog, "Plants, mushrooms, and the rare-species count are loading first."));
  try {
    const { loadCoreSpecies, loadRareSpecies } = await loadAppDataModule();
    const result = await loadCoreSpecies((message) => {
      logBoot(message);
      renderPage(statusHtml("Loading app…", state.bootLog, "Plants, mushrooms, and the rare-species count are loading first."));
    });
    setSpecies(applyReviewOverlay(result.species));
    state.loadErrors = result.errors;

    try {
      const rare = await loadRareSpecies((message) => {
        logBoot(`[rare] ${message}`);
      });
      setRareSpecies(rare);
    } catch (err) {
      logBoot(`[rare] ${err?.message || String(err)}`);
    }

    state.loading = false;
    await renderCurrentRoute();
    logBoot("[photos] Using local hardwired image manifest only. Runtime Commons search disabled.");
  } catch (err) {
    state.loading = false;
    renderPage(`<section class="error-box"><h2>Startup failed</h2><p>The shell loaded, but core species data did not.</p><p class="codeish">${esc(err?.message || String(err))}</p><div class="control-row"><button id="retryBoot" class="primary" type="button">Retry</button></div></section>${statusHtml("Boot log", state.bootLog)}`);
    document.getElementById("retryBoot")?.addEventListener("click", startApp);
  }
}
