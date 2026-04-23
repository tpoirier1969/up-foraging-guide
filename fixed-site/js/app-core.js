import { APP_VERSION } from "./config.js";
import { state, setRoute, setSpecies, setRareSpecies, setReferences, logBoot } from "./state.js";
import * as appData from "./data/load-app-data.js";
import { renderPage, openModal, closeModal, els } from "./ui/dom.js";
import { markActiveNav } from "./ui/nav.js";
import { esc } from "./lib/escape.js";

const REVIEW_STORAGE_KEY = "foraging_review_overlay_v1";
const MODULE_VERSION = "v4.2.2-r2026-04-23-loaderfix1";
const moduleCache = new Map();
let renderToken = 0;

function getLoaders() {
  const loadCoreSpecies = typeof appData.loadCoreSpecies === "function"
    ? appData.loadCoreSpecies
    : async (log) => {
        if (typeof appData.loadAppData !== "function") {
          throw new Error("load-app-data.js does not export a usable core species loader.");
        }
        const result = await appData.loadAppData(log);
        return {
          species: Array.isArray(result?.species) ? result.species : [],
          errors: Array.isArray(result?.errors) ? result.errors : []
        };
      };

  const loadRareSpecies = typeof appData.loadRareSpecies === "function"
    ? appData.loadRareSpecies
    : async (log) => {
        if (typeof appData.loadAppData !== "function") return [];
        const result = await appData.loadAppData(log);
        return Array.isArray(result?.rareSpecies) ? result.rareSpecies : [];
      };

  const loadReferences = typeof appData.loadReferences === "function"
    ? appData.loadReferences
    : async (log) => {
        if (typeof appData.loadAppData !== "function") return [];
        const result = await appData.loadAppData(log);
        return Array.isArray(result?.references) ? result.references : [];
      };

  return { loadCoreSpecies, loadRareSpecies, loadReferences };
}

function parseRoute() {
  const raw = String(location.hash || "#/home").replace(/^#\/?/, "");
  return raw || "home";
}

function routeTitle(route) {
  return {
    home: "Home",
    plants: "Plants",
    mushrooms: "Mushrooms",
    "mushrooms-gilled": "Gilled mushrooms",
    boletes: "Boletes",
    "mushrooms-other": "Other mushrooms",
    medicinal: "Medicinal",
    rare: "Rare",
    lookalikes: "Caution & Other Uses",
    review: "Needs Review",
    references: "References",
    credits: "Credits",
    search: "Search"
  }[route] || "Home";
}

function importModule(path) {
  const cacheKey = `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(MODULE_VERSION)}`;
  if (!moduleCache.has(cacheKey)) moduleCache.set(cacheKey, import(cacheKey));
  return moduleCache.get(cacheKey);
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
    <section class="panel">
      <h2>Mushrooms</h2>
      <p>Start with the underside. That gets most people to the right part of the guide faster than taxonomy ever will.</p>
      <div class="lane-grid">
        <a class="lane-card" href="#/mushrooms-gilled"><strong>Gilled</strong><span>Thin blade-like gills under the cap.</span></a>
        <a class="lane-card" href="#/boletes"><strong>Boletes</strong><span>Pores or sponge-like underside.</span></a>
        <a class="lane-card" href="#/mushrooms-other"><strong>Other</strong><span>Teeth, ridges, shelves, coral, jelly, and oddballs.</span></a>
      </div>
    </section>
  `;
}

function controlsHtml(placeholder = "Search species") {
  const search = state.filters.search || "";
  return `
    <section class="panel">
      <div class="control-row">
        <input id="speciesSearch" type="search" value="${esc(search)}" placeholder="${esc(placeholder)}" style="flex:1;min-width:280px">
        <button id="speciesSearchBtn" class="primary" type="button">Search</button>
        ${search ? `<button id="speciesClearBtn" type="button">Clear</button>` : ""}
      </div>
    </section>
  `;
}

function getRecordBySlug(slug) {
  return state.species.find(record => record.slug === slug) || state.rareSpecies.find(record => record.slug === slug);
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

async function openRecordDetail(slug) {
  const record = getRecordBySlug(slug);
  if (!record) return;
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
  input?.addEventListener("keydown", (event) => { if (event.key === "Enter") onSubmit(input?.value || ""); });
}

function wireActionButtons(root = document) {
  root.querySelectorAll("[data-detail]").forEach(btn => {
    btn.addEventListener("click", () => openRecordDetail(btn.dataset.detail));
  });
  root.querySelectorAll("[data-review-action]").forEach(btn => {
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
        return;
      }
    });
  });
}

function wireCommonEvents(route) {
  wireSearchBlock("homeSearch", "homeSearchBtn", (value) => { state.filters.search = value; location.hash = "#/search"; });
  wireSearchBlock("speciesSearch", "speciesSearchBtn", (value) => { state.filters.search = value; renderCurrentRoute(); });
  document.getElementById("speciesClearBtn")?.addEventListener("click", () => { state.filters.search = ""; renderCurrentRoute(); });
  wireSearchBlock("rareSearch", "rareSearchBtn", (value) => { state.filters.search = value; renderCurrentRoute(); });
  wireSearchBlock("refSearch", "refSearchBtn", (value) => { state.filters.search = value; renderCurrentRoute(); });
  wireSearchBlock("creditsSearch", "creditsSearchBtn", (value) => { state.filters.search = value; renderCurrentRoute(); });
  wireActionButtons(document);
  enhanceImages(els.pageRoot);
  document.getElementById("retryRoute")?.addEventListener("click", () => renderCurrentRoute());
}

async function ensureRareData() {
  if (state.rareReady) return state.rareSpecies;
  if (!state.rarePromise) {
    const { loadRareSpecies } = getLoaders();
    state.rarePromise = Promise.resolve(loadRareSpecies((message) => logBoot(`[rare] ${message}`)))
      .then((records) => { setRareSpecies(records); return records; });
  }
  return state.rarePromise;
}

async function ensureReferencesData() {
  if (state.referencesReady) return state.references;
  if (!state.referencesPromise) {
    const { loadReferences } = getLoaders();
    state.referencesPromise = Promise.resolve(loadReferences((message) => logBoot(`[references] ${message}`)))
      .then((records) => { setReferences(records); return records; });
  }
  return state.referencesPromise;
}

async function renderHomeRoute(token) {
  const { renderHome } = await importModule("./ui/render-home.js");
  if (token !== renderToken) return;
  renderPage(renderHome(state.species, state.loadErrors || [], state.rareSpecies || []));
  wireCommonEvents("home");
}

async function renderSpeciesRoute(route, token) {
  const { filterRecords, renderRecordCards } = await importModule("./ui/render-list.js");
  if (token !== renderToken) return;
  const filtered = filterRecords(state.species, route === "search" ? "general" : route, state.filters.search);
  const title = `${routeTitle(route)} (${filtered.length})`;
  renderPage(`
    ${controlsHtml(route === "search" ? "Search all species" : `Search ${routeTitle(route).toLowerCase()}`)}
    <section class="panel"><h2>${esc(title)}</h2></section>
    ${renderRecordCards(filtered, route)}
  `);
  wireCommonEvents(route);
}

async function renderRareRoute(token) {
  if (!state.rareReady) {
    renderPage(statusHtml("Loading rare species…", ["Rare species are lazy-loaded only when you open this section."]));
    try { await ensureRareData(); } catch (err) {
      if (token !== renderToken) return;
      renderPage(routeErrorHtml("rare", err?.message || String(err))); wireCommonEvents("rare"); return;
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
    try { await ensureReferencesData(); } catch (err) {
      if (token !== renderToken) return;
      renderPage(routeErrorHtml("references", err?.message || String(err))); wireCommonEvents("references"); return;
    }
    if (token !== renderToken) return;
  }
  const { renderReferencesPage } = await importModule("./ui/render-references.js");
  if (token !== renderToken) return;
  renderPage(renderReferencesPage(state.references, state.filters.search));
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
  markActiveNav(route === "search" ? "search" : (route.startsWith("mushrooms-") || route === "boletes" ? "mushrooms" : route));

  if (state.loading && !state.coreReady) {
    renderPage(statusHtml("Loading app…", state.bootLog, "Core plants and mushrooms load first. Rare and references stay lazy until opened."));
    return;
  }

  try {
    if (route === "home") return await renderHomeRoute(token);
    if (route === "mushrooms") { renderPage(mushroomLaneLandingHtml()); wireCommonEvents("mushrooms"); return; }
    if (route === "rare") return await renderRareRoute(token);
    if (route === "references") return await renderReferencesRoute(token);
    if (route === "credits") return await renderCreditsRoute(token);
    if (["plants","mushrooms-gilled","boletes","mushrooms-other","medicinal","lookalikes","review","search"].includes(route)) {
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
  document.getElementById("versionBadge")?.replaceChildren(document.createTextNode(APP_VERSION));
  wireModalClose();
  loadReviewOverlay();
  window.addEventListener("hashchange", renderCurrentRoute);
  state.loading = true;
  renderPage(statusHtml("Loading app…", state.bootLog, "Core plants and mushrooms load first. Rare and references stay lazy until opened."));
  try {
    const { loadCoreSpecies } = getLoaders();
    const result = await loadCoreSpecies((message) => {
      logBoot(message);
      renderPage(statusHtml("Loading app…", state.bootLog, "Core plants and mushrooms load first. Rare and references stay lazy until opened."));
    });
    setSpecies(applyReviewOverlay(result.species));
    state.loadErrors = result.errors;
    state.loading = false;
    ensureRareData().then(() => {
      if (state.route === "home") renderCurrentRoute();
    }).catch(() => {});
    await renderCurrentRoute();
    logBoot("[photos] Using local hardwired image manifest only. Runtime Commons search disabled.");
  } catch (err) {
    state.loading = false;
    renderPage(`<section class="error-box"><h2>Startup failed</h2><p>The shell loaded, but core species data did not.</p><p class="codeish">${esc(err?.message || String(err))}</p><div class="control-row"><button id="retryBoot" class="primary" type="button">Retry</button></div></section>${statusHtml("Boot log", state.bootLog)}`);
    document.getElementById("retryBoot")?.addEventListener("click", startApp);
  }
}
