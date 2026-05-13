import { state } from "./state.js";
import { renderPage, openModal, els } from "./ui/dom.js";
import { renderRecordCards } from "./ui/render-list.js";
import { renderDetail } from "./ui/render-detail.js";
import { installLazyImages } from "./lib/image-resolver.js";
import { markActiveNav } from "./ui/nav.js";
import { esc } from "./lib/escape.js";
import { isEdibleForSection } from "./lib/merge.js";

const VERSION = "v4.3.37-r2026-05-13-mushroom-patch-retire-season1";
const IN_SEASON_ROUTE = "mushrooms-in-season";
const MUSHROOM_ROUTES = new Set(["mushrooms", "mushrooms-gilled", "boletes", "mushrooms-other", IN_SEASON_ROUTE]);
const FORAGE_LIST_ROUTES = new Set(["mushrooms-gilled", "boletes", "mushrooms-other", IN_SEASON_ROUTE]);
const FILTER_ROUTES = new Set(["mushrooms-gilled", "boletes", "mushrooms-other"]);
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const ORIG_HIDDEN_KEY = "__foragePatchOrigHidden";

let renderQueued = false;
let observerQueued = false;
let rerenderQueued = false;
let lastHash = location.hash || "#/home";

function route() {
  return String(location.hash || "#/home").replace(/^#\/?/, "") || "home";
}

function currentMonthName() {
  return MONTHS[new Date().getMonth()] || "";
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
  if (text.includes(String(monthName || "").toLowerCase())) return true;
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

function hasMonth(record, monthName) {
  const wanted = String(monthName || "").toLowerCase();
  return monthValues(record).some((value) => String(value || "").toLowerCase() === wanted)
    || seasonTextMatchesMonth(record, monthName);
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

function isForageMushroomRecordRaw(record = {}) {
  if (!isMushroomRecord(record)) return false;
  if (record.is_non_edible === true) return false;
  // Keep this one shared edible gate until the lane routes move fully into app-core/render-list.
  return isEdibleForSection(record) === true;
}

function adjacentMonthNames(monthName = "") {
  const month = monthNumberFromName(monthName);
  if (!month) return [monthName].filter(Boolean);
  const nums = [month - 1, month, month + 1].map((n) => ((n - 1 + 12) % 12) + 1);
  return nums.map((n) => MONTHS[n - 1]);
}

function hasMonthWindow(record, monthName) {
  return adjacentMonthNames(monthName).some((name) => hasMonth(record, name));
}

function mushroomCoverageStats() {
  const mushrooms = state.species.filter((record) => isMushroomRecord(record));
  const forage = mushrooms.filter((record) => isForageMushroomRecordRaw(record));
  const boletes = forage.filter((record) => isBolete(record));
  const nonBolete = forage.filter((record) => !isBolete(record));
  return {
    totalMushrooms: mushrooms.length,
    forageMushrooms: forage.length,
    boleteForage: boletes.length,
    nonBoleteForage: nonBolete.length
  };
}

function coverageNoteHtml(records = []) {
  const stats = mushroomCoverageStats();
  const warn = records.length < 10 || stats.nonBoleteForage < 20;
  if (!warn) return "";
  return `
    <section class="panel" data-mushroom-coverage-note="true">
      <h3>Data coverage note</h3>
      <p class="muted small">This page is built from the mushroom records currently loaded by the app. Loaded forage mushrooms: ${esc(stats.forageMushrooms)} total, including ${esc(stats.nonBoleteForage)} non-bolete/other-form records and ${esc(stats.boleteForage)} bolete records. If the May list still looks thin, the remaining issue is source coverage, not the month filter.</p>
    </section>
  `;
}

function isForageMushroomRecord(record = {}) {
  return isForageMushroomRecordRaw(record) && !record.hidden;
}

function isGilled(record = {}) {
  const text = [
    record.lane,
    record.mushroom_family,
    record.boleteGroup,
    record.boleteSubgroup,
    record.mushroom_profile?.underside,
    record.mushroom_profile?.gill_color,
    record.display_name,
    record.common_name
  ].flatMap(asList).join(" ").toLowerCase();
  return text.includes("gill") && !isBolete(record);
}

function isBolete(record = {}) {
  const text = [
    record.lane,
    record.mushroom_family,
    record.boleteGroup,
    record.boleteSubgroup,
    record.mushroom_profile?.ecology,
    record.mushroom_profile?.underside,
    record.mushroom_profile?.pore_color,
    record.display_name,
    record.common_name
  ].flatMap(asList).join(" ").toLowerCase();
  return text.includes("bolete") || text.includes("pore") || text.includes("suillus") || text.includes("leccinum") || text.includes("tylopilus");
}

function activeLaneCard(href, key, label, note) {
  const active = route() === key ? " active" : "";
  return `<a class="lane-card${active}" href="${href}"><strong>${esc(label)}</strong><span>${esc(note)}</span></a>`;
}

function mushroomLaneSwitcherHtml() {
  return `
    <section class="panel mushroom-lane-switcher" data-season-patch-nav="true">
      <h3>Mushroom underside / form</h3>
      <div class="lane-grid" data-season-patch-grid="mushroom-lane">
        ${activeLaneCard("#/mushrooms-gilled", "mushrooms-gilled", "Gilled", "Thin blade-like gills under the cap.")}
        ${activeLaneCard("#/boletes", "boletes", "Spongelike", "Pores, tubes, or sponge-like underside.")}
        ${activeLaneCard("#/mushrooms-other", "mushrooms-other", "Other", "Teeth, ridges, shelves, coral, jelly, and oddballs.")}
        ${activeLaneCard("#/mushrooms-in-season", IN_SEASON_ROUTE, "In Season", "All edible mushrooms recorded for this month.")}
      </div>
    </section>
  `;
}

function labelFromSlug(slug = "") {
  return String(slug || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRecordBySlug(slug) {
  return state.species.find((record) => record.slug === slug)
    || state.rareSpecies.find((record) => record.slug === slug);
}

function wireDetailButtons(root = document) {
  root.querySelectorAll("[data-detail]").forEach((button) => {
    if (button.dataset.seasonPatchWired === "true") return;
    button.dataset.seasonPatchWired = "true";
    button.addEventListener("click", () => {
      const record = getRecordBySlug(button.dataset.detail);
      if (!record) {
        openModal(`<section class="detail-block"><h3>${esc(labelFromSlug(button.dataset.detail))}</h3><p>This related record is named in the guide, but it does not have a full page yet.</p></section>`);
        return;
      }
      openModal(renderDetail(record));
      installLazyImages(els.modalContent, getRecordBySlug);
    });
  });
}

function rememberOriginalHidden(record) {
  if (!Object.prototype.hasOwnProperty.call(record, ORIG_HIDDEN_KEY)) {
    record[ORIG_HIDDEN_KEY] = record.hidden;
  }
}

function restoreOriginalHidden(record) {
  if (!Object.prototype.hasOwnProperty.call(record, ORIG_HIDDEN_KEY)) return false;
  const original = record[ORIG_HIDDEN_KEY];
  const before = record.hidden;
  if (original === undefined) delete record.hidden;
  else record.hidden = original;
  delete record[ORIG_HIDDEN_KEY];
  return before !== record.hidden;
}

function syncForageVisibilityForRoute() {
  if (!Array.isArray(state.species) || !state.species.length) return false;
  const forageMode = FORAGE_LIST_ROUTES.has(route());
  let changed = false;

  state.species.forEach((record) => {
    if (!isMushroomRecord(record)) return;
    if (forageMode) {
      rememberOriginalHidden(record);
      const shouldHide = !isForageMushroomRecordRaw(record);
      if ((record.hidden === true) !== shouldHide) {
        record.hidden = shouldHide;
        changed = true;
      }
    } else if (restoreOriginalHidden(record)) {
      changed = true;
    }
  });

  return changed;
}

function requestRerender() {
  if (rerenderQueued) return;
  rerenderQueued = true;
  setTimeout(() => {
    rerenderQueued = false;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, 0);
}

function renderInSeasonPage() {
  if (route() !== IN_SEASON_ROUTE || !Array.isArray(state.species) || !state.species.length) return;
  const month = currentMonthName();
  const records = state.species
    .filter((record) => isForageMushroomRecord(record))
    .filter((record) => hasMonthWindow(record, month))
    .sort((a, b) => String(a.display_name || a.common_name || a.slug || "").localeCompare(String(b.display_name || b.common_name || b.slug || "")));

  renderPage(`
    ${mushroomLaneSwitcherHtml()}
    <section class="panel" data-mushroom-season-page="true">
      <h2>In Season — ${esc(month)} window (${records.length})</h2>
      <p class="muted small">Shows edible mushroom records matching ${esc(month)} or the immediately adjacent spring/season window. This catches late-April/early-June records that are realistic in Upper Michigan.</p>
    </section>
    ${coverageNoteHtml(records)}
    ${records.length ? renderRecordCards(records, "mushrooms-in-season") : `<section class="panel"><p>No edible mushroom records currently match the ${esc(month)} season window.</p></section>`}
  `);
  markActiveNav("mushrooms");
  wireDetailButtons(document);
  installLazyImages(els.pageRoot, getRecordBySlug);
}

function injectInSeasonCards() {
  const r = route();
  if (!MUSHROOM_ROUTES.has(r) || r === IN_SEASON_ROUTE) return;

  document.querySelectorAll(".mushroom-lane-switcher .lane-grid, .panel .lane-grid").forEach((grid) => {
    const sectionText = grid.closest("section")?.textContent || "";
    const hasMushroomContext = /mushroom|gilled|spongelike|underside|taxonomy/i.test(sectionText);
    if (!hasMushroomContext) return;
    grid.dataset.seasonPatchGrid = "mushroom-lane";
    if (grid.querySelector('a[href="#/mushrooms-in-season"]')) return;
    const card = document.createElement("a");
    card.className = "lane-card";
    card.href = "#/mushrooms-in-season";
    card.innerHTML = `<strong>In Season</strong><span>All edible mushrooms recorded for this month.</span>`;
    grid.appendChild(card);
  });
}

function cardElementForButton(button) {
  return button.closest("article, .record-card, .species-card, .result-card, [data-record-card], li") || button.parentElement;
}

function removeNonForageMushroomCards() {
  const r = route();
  if (!FILTER_ROUTES.has(r) && r !== IN_SEASON_ROUTE) return;
  document.querySelectorAll("[data-detail]").forEach((button) => {
    const slug = button.dataset.detail || "";
    const record = getRecordBySlug(slug);
    if (!record || !isMushroomRecord(record) || isForageMushroomRecord(record)) return;
    const card = cardElementForButton(button);
    if (card) card.remove();
  });
}

function installMushroomCompactStyle() {
  if (document.getElementById("mushroomSeasonCompactStyle")) return;
  const style = document.createElement("style");
  style.id = "mushroomSeasonCompactStyle";
  style.textContent = `
    @media (min-width: 760px) {
      .lane-grid[data-season-patch-grid="mushroom-lane"] {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
      }
      .lane-grid[data-season-patch-grid="mushroom-lane"] .lane-card {
        min-height: 0;
        padding: 10px 12px;
        gap: 4px;
      }
      .lane-grid[data-season-patch-grid="mushroom-lane"] .lane-card strong {
        font-size: 0.98rem;
        line-height: 1.15;
      }
      .lane-grid[data-season-patch-grid="mushroom-lane"] .lane-card span {
        font-size: 0.78rem;
        line-height: 1.25;
      }
    }
  `;
  document.head.appendChild(style);
}

function runPatchPass() {
  const hashChanged = lastHash !== (location.hash || "#/home");
  lastHash = location.hash || "#/home";
  const visibilityChanged = syncForageVisibilityForRoute();

  installMushroomCompactStyle();
  injectInSeasonCards();
  removeNonForageMushroomCards();

  if (route() === IN_SEASON_ROUTE && !document.querySelector('[data-mushroom-season-page="true"]')) {
    renderInSeasonPage();
    return;
  }

  if ((visibilityChanged || hashChanged) && FORAGE_LIST_ROUTES.has(route())) {
    requestRerender();
  }
}

function schedulePatchPass() {
  if (renderQueued) return;
  renderQueued = true;
  setTimeout(() => {
    renderQueued = false;
    runPatchPass();
  }, 0);
}

window.addEventListener("hashchange", schedulePatchPass);
window.addEventListener("DOMContentLoaded", schedulePatchPass);

new MutationObserver(() => {
  if (observerQueued) return;
  observerQueued = true;
  setTimeout(() => {
    observerQueued = false;
    runPatchPass();
  }, 0);
}).observe(document.body, { childList: true, subtree: true });

setInterval(() => {
  if (route() === IN_SEASON_ROUTE && !document.querySelector('[data-mushroom-season-page="true"]')) {
    renderInSeasonPage();
  } else {
    runPatchPass();
  }
}, 750);

schedulePatchPass();
console.debug(`[foraging] mushroom season patch loaded: ${VERSION}`);
