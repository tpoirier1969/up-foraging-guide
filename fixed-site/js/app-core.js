import { APP_VERSION } from "./config.js";
import {
  state,
  setRoute,
  setSpecies,
  setRareSpecies,
  setReferences,
  logBoot
} from "./state.js";
import { loadCoreSpecies, loadRareSpecies, loadReferences } from "./data/load-app-data.js";
import { renderPage, openModal, closeModal, els } from "./ui/dom.js";
import { markActiveNav } from "./ui/nav.js";
import { esc } from "./lib/escape.js";
import { seedImageCacheFromStorage, auditAllSpeciesPhotos } from "./lib/photo-audit.js";

const moduleCache = new Map();
let renderToken = 0;

function parseRoute() {
  const raw = String(location.hash || "#/home").replace(/^#\/?/, "");
  return raw || "home";
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
      <div class="control-row">
        <button id="retryRoute" class="primary" type="button">Retry this page</button>
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

function routeTitle(route) {
  return {
    home: "Home",
    plants: "Plants",
    mushrooms: "Mushrooms",
    medicinal: "Medicinal",
    rare: "Rare",
    lookalikes: "Non-edible",
    references: "References",
    credits: "Credits",
    search: "Search"
  }[route] || "Home";
}

function getRecordBySlug(slug) {
  return state.species.find(record => record.slug === slug)
    || state.rareSpecies.find(record => record.slug === slug);
}

function importModule(path) {
  if (!moduleCache.has(path)) {
    moduleCache.set(path, import(path));
  }
  return moduleCache.get(path);
}

function queueIdle(task, delay = 80) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(task, { timeout: 1200 });
    return;
  }
  window.setTimeout(task, delay);
}

function preloadCommonModules() {
  if (state.modulePrefetchStarted) return;
  state.modulePrefetchStarted = true;
  queueIdle(() => {
    importModule("./ui/render-home.js").catch(() => {});
    importModule("./ui/render-list.js").catch(() => {});
    importModule("./ui/render-detail.js").catch(() => {});
    importModule("./lib/image-resolver.js").catch(() => {});
  });
}

async function enhanceImages(root) {
  if (!root?.querySelector?.('img[data-record-image]')) return;
  try {
    const { installLazyImages } = await importModule("./lib/image-resolver.js");
    installLazyImages(root, getRecordBySlug);
  } catch {
    // Keep the page alive even if image enhancement fails.
  }
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
    await enhanceImages(els.modalContent);
  } catch (err) {
    openModal(`
      <section class="error-box">
        <h3>Detail view failed</h3>
        <p class="codeish">${esc(err?.message || String(err))}</p>
      </section>
    `);
  }
}

function wireSearchBlock(inputId, buttonId, onSubmit) {
  const input = document.getElementById(inputId);
  document.getElementById(buttonId)?.addEventListener("click", () => onSubmit(input?.value || ""));
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") onSubmit(input?.value || "");
  });
}

function wireCommonEvents(route) {
  wireSearchBlock("homeSearch", "homeSearchBtn", (value) => {
    state.filters.search = value;
    location.hash = "#/search";
  });

  wireSearchBlock("speciesSearch", "speciesSearchBtn", (value) => {
    state.filters.search = value;
    renderCurrentRoute();
  });
  document.getElementById("speciesClearBtn")?.addEventListener("click", () => {
    state.filters.search = "";
    renderCurrentRoute();
  });

  wireSearchBlock("rareSearch", "rareSearchBtn", (value) => {
    state.filters.search = value;
    renderCurrentRoute();
  });

  wireSearchBlock("refSearch", "refSearchBtn", (value) => {
    state.filters.search = value;
    renderCurrentRoute();
  });

  wireSearchBlock("creditsSearch", "creditsSearchBtn", (value) => {
    state.filters.search = value;
    renderCurrentRoute();
  });

  document.querySelectorAll("[data-detail]").forEach(btn => {
    btn.addEventListener("click", () => openRecordDetail(btn.dataset.detail));
  });

  enhanceImages(els.pageRoot);

  document.getElementById("retryRoute")?.addEventListener("click", () => renderCurrentRoute());
}

async function ensureRareData() {
  if (state.rareReady) return state.rareSpecies;
  if (!state.rarePromise) {
    state.rarePromise = loadRareSpecies((message) => logBoot(`[rare] ${message}`))
      .then((records) => {
        setRareSpecies(records);
        return records;
      })
      .catch((err) => {
        state.loadErrors.push({ path: "data/rare-species-v2.json", error: err?.message || String(err) });
        throw err;
      });
  }
  return state.rarePromise;
}

async function ensureReferencesData() {
  if (state.referencesReady) return state.references;
  if (!state.referencesPromise) {
    state.referencesPromise = loadReferences((message) => logBoot(`[references] ${message}`))
      .then((records) => {
        setReferences(records);
        return records;
      })
      .catch((err) => {
        state.loadErrors.push({ path: "data/references-mainfix15.json", error: err?.message || String(err) });
        throw err;
      });
  }
  return state.referencesPromise;
}

async function renderHomeRoute(token) {
  const { renderHome } = await importModule("./ui/render-home.js");
  if (token !== renderToken) return;
  renderPage(renderHome(state.species, state.loadErrors || []));
  wireCommonEvents("home");
}

async function renderSpeciesRoute(route, token) {
  const { filterRecords, renderRecordCards } = await importModule("./ui/render-list.js");
  if (token !== renderToken) return;
  const filtered = filterRecords(state.species, route === "search" ? "home" : route, state.filters.search);
  const title = route === "search" ? `Search (${filtered.length})` : `${routeTitle(route)} (${filtered.length})`;
  renderPage(`
    ${controlsHtml(route === "search" ? "Search all species" : `Search ${routeTitle(route).toLowerCase()}`)}
    <section class="panel">
      <h2>${esc(title)}</h2>
    </section>
    ${renderRecordCards(filtered)}
  `);
  wireCommonEvents(route);
}

async function renderRareRoute(token) {
  if (!state.rareReady) {
    renderPage(statusHtml("Loading rare species…", ["Rare species are lazy-loaded only when you open this section."]));
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
  markActiveNav(route === "search" ? "search" : route);

  if (state.loading && !state.coreReady) {
    renderPage(statusHtml("Loading app…", state.bootLog, "Boot only loads the shell and core species data first."));
    return;
  }

  try {
    if (route === "home") {
      await renderHomeRoute(token);
      return;
    }
    if (route === "rare") {
      await renderRareRoute(token);
      return;
    }
    if (route === "references") {
      await renderReferencesRoute(token);
      return;
    }
    if (route === "credits") {
      await renderCreditsRoute(token);
      return;
    }
    await renderSpeciesRoute(route, token);
  } catch (err) {
    if (token !== renderToken) return;
    renderPage(routeErrorHtml(route, err?.message || String(err)));
    wireCommonEvents(route);
  }
}

export async function startApp() {
  document.getElementById("versionBadge")?.replaceChildren(document.createTextNode(APP_VERSION));
  wireModalClose();
  window.addEventListener("hashchange", renderCurrentRoute);

  state.loading = true;
  renderPage(statusHtml("Loading app…", state.bootLog, "Core species load first. Rare, Credits, and References stay lazy until opened."));

  try {
    const result = await loadCoreSpecies((message) => {
      logBoot(message);
      renderPage(statusHtml("Loading app…", state.bootLog, "Core species load first. Rare, Credits, and References stay lazy until opened."));
    });
    setSpecies(result.species);
    seedImageCacheFromStorage();
    state.loadErrors = result.errors;
    state.loading = false;
    await renderCurrentRoute();
    preloadCommonModules();
    queueIdle(() => {
      auditAllSpeciesPhotos(state.species, ({ completed, total, slug, status }) => {
        if (completed <= 6 || completed % 20 === 0 || completed === total) {
          logBoot(`[photos] ${completed}/${total} ${slug} ${status}`);
        }
      }).then(() => {
        if (state.route === "credits") renderCurrentRoute();
      }).catch(() => {});
    }, 120);
  } catch (err) {
    state.loading = false;
    renderPage(`
      <section class="error-box">
        <h2>Startup failed</h2>
        <p>The shell loaded, but core species data did not.</p>
        <p class="codeish">${esc(err?.message || String(err))}</p>
        <div class="control-row">
          <button id="retryBoot" class="primary" type="button">Retry</button>
        </div>
      </section>
      ${statusHtml("Boot log", state.bootLog)}
    `);
    document.getElementById("retryBoot")?.addEventListener("click", startApp);
  }
}
