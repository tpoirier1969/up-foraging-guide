import { state } from "./state.js";
import { renderPage, openModal, els } from "./ui/dom.js";
import { renderRecordCards } from "./ui/render-list.js";
import { renderDetail } from "./ui/render-detail.js";
import { installLazyImages } from "./lib/image-resolver.js";
import { markActiveNav } from "./ui/nav.js";
import { esc } from "./lib/escape.js";

const VERSION = "v4.3.30-r2026-05-12-mushroom-season-controls1";
const IN_SEASON_ROUTE = "mushrooms-in-season";
const MUSHROOM_ROUTES = new Set(["mushrooms", "mushrooms-gilled", "boletes", "mushrooms-other", IN_SEASON_ROUTE]);
const FILTER_ROUTES = new Set(["mushrooms-gilled", "boletes", "mushrooms-other"]);
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let renderQueued = false;
let observerQueued = false;

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

function hasMonth(record, monthName) {
  const wanted = String(monthName || "").toLowerCase();
  return monthValues(record).some((value) => String(value || "").toLowerCase() === wanted);
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

function recordMatchesCurrentMushroomRoute(record = {}) {
  const r = route();
  if (!isMushroomRecord(record) || record.hidden) return false;
  if (r === "mushrooms-gilled") return isGilled(record);
  if (r === "boletes") return isBolete(record);
  if (r === "mushrooms-other") return !isGilled(record) && !isBolete(record);
  return true;
}

function activeLaneCard(href, key, label, note) {
  const active = route() === key ? " active" : "";
  return `<a class="lane-card${active}" href="${href}"><strong>${esc(label)}</strong><span>${esc(note)}</span></a>`;
}

function mushroomLaneSwitcherHtml() {
  return `
    <section class="panel mushroom-lane-switcher" data-season-patch-nav="true">
      <h3>Mushroom underside / form</h3>
      <div class="lane-grid">
        ${activeLaneCard("#/mushrooms-gilled", "mushrooms-gilled", "Gilled", "Thin blade-like gills under the cap.")}
        ${activeLaneCard("#/boletes", "boletes", "Spongelike", "Pores, tubes, or sponge-like underside.")}
        ${activeLaneCard("#/mushrooms-other", "mushrooms-other", "Other", "Teeth, ridges, shelves, coral, jelly, and oddballs.")}
        ${activeLaneCard("#/mushrooms-in-season", IN_SEASON_ROUTE, "In Season", "All mushrooms with a recorded season for this month.")}
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

function renderInSeasonPage() {
  if (route() !== IN_SEASON_ROUTE || !Array.isArray(state.species) || !state.species.length) return;
  const month = currentMonthName();
  const records = state.species
    .filter((record) => isMushroomRecord(record) && !record.hidden)
    .filter((record) => hasMonth(record, month))
    .sort((a, b) => String(a.display_name || a.common_name || a.slug || "").localeCompare(String(b.display_name || b.common_name || b.slug || "")));

  renderPage(`
    ${mushroomLaneSwitcherHtml()}
    <section class="panel" data-mushroom-season-page="true">
      <h2>In Season — ${esc(month)} (${records.length})</h2>
      <p class="muted small">Shows mushroom records with ${esc(month)} in their recorded season fields. Records with missing or review-needed season data are left out instead of guessed.</p>
    </section>
    ${records.length ? renderRecordCards(records, "mushrooms-in-season") : `<section class="panel"><p>No mushroom records currently have ${esc(month)} as a recorded season.</p></section>`}
  `);
  markActiveNav("mushrooms");
  wireDetailButtons(document);
  installLazyImages(els.pageRoot, getRecordBySlug);
}

function seasonOptionsHtml(current = "") {
  const selected = String(current || "");
  return [`<option value="">Any season</option>`].concat(MONTHS.map((month) => {
    return `<option value="${esc(month)}" ${selected === month ? "selected" : ""}>${esc(month)}</option>`;
  })).join("");
}

function injectSeasonSelectIfMissing() {
  if (!FILTER_ROUTES.has(route())) return;
  if (document.getElementById("traitFilter_mushroomMonth")) return;
  const rows = Array.from(document.querySelectorAll(".medicinal-filter-row"));
  const traitRow = rows.find((row) => row.closest("section")?.querySelector("h3")?.textContent?.toLowerCase().includes("filter"));
  if (!traitRow) return;
  const cell = document.createElement("div");
  cell.className = "medicinal-filter-cell season-patch-cell";
  cell.innerHTML = `
    <label for="traitFilter_mushroomMonth" class="muted small">Season</label>
    <select id="traitFilter_mushroomMonth" data-trait-filter="mushroomMonth" style="width:100%">
      ${seasonOptionsHtml(state.filters.mushroomMonth || "")}
    </select>
  `;
  traitRow.prepend(cell);
  cell.querySelector("select")?.addEventListener("change", (event) => {
    state.filters.mushroomMonth = event.currentTarget.value || "";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

function injectInSeasonCards() {
  const r = route();
  if (!MUSHROOM_ROUTES.has(r)) return;
  if (r === IN_SEASON_ROUTE) return;

  document.querySelectorAll(".mushroom-lane-switcher .lane-grid, .panel .lane-grid").forEach((grid) => {
    const sectionText = grid.closest("section")?.textContent || "";
    const hasMushroomContext = /mushroom|gilled|spongelike|underside|taxonomy/i.test(sectionText);
    if (!hasMushroomContext || grid.querySelector('a[href="#/mushrooms-in-season"]')) return;
    const card = document.createElement("a");
    card.className = "lane-card";
    card.href = "#/mushrooms-in-season";
    card.innerHTML = `<strong>In Season</strong><span>All mushrooms with a recorded season for this month.</span>`;
    grid.appendChild(card);
  });
}

function runPatchPass() {
  injectInSeasonCards();
  injectSeasonSelectIfMissing();
  if (route() === IN_SEASON_ROUTE && !document.querySelector('[data-mushroom-season-page="true"]')) {
    renderInSeasonPage();
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
  if (route() === IN_SEASON_ROUTE && !document.querySelector('[data-mushroom-season-page="true"]')) renderInSeasonPage();
  else injectInSeasonCards();
}, 750);

schedulePatchPass();
console.debug(`[foraging] mushroom season patch loaded: ${VERSION}`);
