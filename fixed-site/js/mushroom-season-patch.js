import { state } from "./state.js";
import { renderPage, openModal, els } from "./ui/dom.js";
import { renderRecordCards } from "./ui/render-list.js";
import { renderDetail } from "./ui/render-detail.js";
import { installLazyImages } from "./lib/image-resolver.js";
import { markActiveNav } from "./ui/nav.js";
import { esc } from "./lib/escape.js";

const VERSION = "v4.3.31-r2026-05-12-mushroom-landing-forage-filter1";
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

function textBlob(record = {}) {
  return [
    record.food_role,
    record.edibility_status,
    record.edibility_detail,
    record.edibility_notes,
    record.culinary_uses,
    record.food_quality,
    record.foraging_value,
    record.non_edible_severity,
    record.danger_level,
    record.look_alike_risk,
    record.mushroom_profile?.edibility_status,
    record.mushroom_profile?.caution_level,
    ...(Array.isArray(record.use_roles) ? record.use_roles : asList(record.use_roles))
  ].join(" ").toLowerCase();
}

function isForageMushroomRecord(record = {}) {
  if (!isMushroomRecord(record) || record.hidden) return false;
  if (record.is_non_edible === true) return false;

  const foodRole = String(record.food_role || "").trim().toLowerCase();
  const status = String(record.edibility_status || record.mushroom_profile?.edibility_status || "").trim().toLowerCase();
  const useRoles = asList(record.use_roles).map((value) => String(value || "").trim().toLowerCase());
  const text = textBlob(record);

  if (["avoid", "caution", "id / caution", "id / comparison", "comparison", "look-alike"].includes(foodRole)) return false;
  if (/^(not_edible|not-edible|non_edible|non-edible|toxic|toxic_or_dangerous|dangerous|out_of_scope|out-of-scope)$/.test(status)) return false;
  if (/deadly|poison|toxic|dangerous|unsafe|\bavoid\b|not[_ -]?edible|non[_ -]?edible|not recommended|not a food target|comparison\/caution only|comparison only|caution only|id \/ caution|look-alike warning|not treated as .*food|out[- ]of[- ]region/.test(text)) return false;

  if (foodRole === "food") return true;
  if (useRoles.some((value) => value === "food" || value.includes("food"))) return true;
  if (/edible|choice|forage|culinary|cook|table mushroom|prime|good processed food|occasional edible|use with expert-level confidence/.test(text)) return true;
  return false;
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
  if (!isForageMushroomRecord(record)) return false;
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
      <div class="lane-grid" data-season-patch-grid="mushroom-lane">
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
    .filter((record) => isForageMushroomRecord(record))
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

function routeLabel() {
  return {
    "mushrooms-gilled": "Gilled mushrooms",
    boletes: "Spongelike",
    "mushrooms-other": "Other mushrooms"
  }[route()] || "Mushrooms";
}

function updateMushroomVisibleCount() {
  if (!FILTER_ROUTES.has(route())) return;
  const slugs = new Set();
  document.querySelectorAll("[data-detail]").forEach((button) => {
    const slug = button.dataset.detail || "";
    const record = getRecordBySlug(slug);
    if (recordMatchesCurrentMushroomRoute(record)) slugs.add(slug);
  });
  const heading = Array.from(document.querySelectorAll("section.panel h2"))
    .find((h2) => /gilled|spongelike|other mushrooms|mushrooms/i.test(h2.textContent || ""));
  if (heading) heading.textContent = `${routeLabel()} (${slugs.size})`;
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
  installMushroomCompactStyle();
  injectInSeasonCards();
  injectSeasonSelectIfMissing();
  removeNonForageMushroomCards();
  updateMushroomVisibleCount();
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
  else runPatchPass();
}, 750);

schedulePatchPass();
console.debug(`[foraging] mushroom season patch loaded: ${VERSION}`);
