import { MONTHS } from "./constants-mainfix.js";
import { medicinalRecords, isPlant, reviewRecords, avoidRecords, isForagingMushroom } from "./data-model-mainfix4.js?v=2026-04-15-2";
import { VOCAB } from "./vocabulary.js?v=v2.0";
import { renderResultCard } from "./renderers/cards-mainfix.js";
import { renderInteractiveTimeline } from "./renderers/timeline.js?v=2026-04-15-2";
import { escapeHtml } from "./utils.js?v=2026-04-15-2";
import { state } from "./state.js";
import { renderRarePageHtml } from "./rare-watch.js";

const FLOWER_COLORS = ["White", "Purple", "Pink", "Yellow", "Blue", "Red", "Green"];
const LEAF_SHAPES = ["Round", "Oval", "Heart-shaped", "Lance-shaped", "Pointed", "Lobed", "Compound", "Needle-like"];
const LEAF_ARRANGEMENTS = ["Alternate", "Opposite", "Basal rosette", "Whorled", "Needle clusters"];
const STEM_SURFACES = ["Smooth", "Hairy", "Rough", "Fuzzy", "Prickly"];
const LEAF_POINT_COUNTS = ["1-point", "3-point", "5-point", "Many-lobed"];
const SORT_OPTIONS = [
  { value: "", label: "Default sort" },
  { value: "food-quality-desc", label: "Choice foods first" },
  { value: "food-quality-asc", label: "Lower food quality first" },
  { value: "common-desc", label: "Most common first" },
  { value: "common-asc", label: "Least common first" }
];
const COMMON_ONLY_SORT_OPTIONS = [
  { value: "", label: "Default sort" },
  { value: "common-desc", label: "Most common first" },
  { value: "common-asc", label: "Least common first" }
];

function optionHtml(values, current, label) {
  return [`<option value="">${label}</option>`].concat(values.map((v) => `<option value="${escapeHtml(v)}" ${current === v ? "selected" : ""}>${escapeHtml(v)}</option>`)).join("");
}
function vocabLabels(entries) { return (entries || []).map((entry) => entry.label); }
function hostTreeLabels(treeType) {
  const all = VOCAB.mushrooms.hostTrees || [];
  if (!treeType) return all.map((entry) => entry.label);
  if (treeType === "Hardwood") return all.filter((entry) => entry.broadType === "hardwood").map((entry) => entry.label);
  if (treeType === "Conifer / softwood") return all.filter((entry) => entry.broadType === "conifer").map((entry) => entry.label);
  return all.map((entry) => entry.label);
}
function formatLabelFromSlug(slug) {
  return String(slug || "").replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}
function renderResultList(records, context = "general") {
  return records.length ? records.map((record) => renderResultCard(record, context)).join("") : '<div class="panel empty-state"><h3>No matches</h3></div>';
}
function currentMonthName() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return MONTHS[d.getMonth()];
}
function homeHub(allRecords = []) {
  const month = currentMonthName();
  const plants = allRecords.filter((record) => isPlant(record) && (record.months_available || []).includes(month)).length;
  const mushrooms = allRecords.filter((record) => isForagingMushroom(record) && (record.months_available || []).includes(month)).length;
  const rare = (state.rareSpecies || []).length;
  const review = reviewRecords(allRecords).length;
  return `
    <section class="panel home-hub">
      <div class="result-header compact-result-header"><div class="result-title-row"><h3>In focus right now</h3><p class="results-meta">${escapeHtml(month)}</p></div></div>
      <div class="home-focus-grid">
        <a class="home-card" href="#/plants"><strong>Plants in season</strong><span>${plants} plant listings for ${escapeHtml(month)}</span></a>
        <a class="home-card" href="#/mushrooms"><strong>Mushrooms in season</strong><span>${mushrooms} mushroom listings for ${escapeHtml(month)}</span></a>
        <a class="home-card" href="#/rare"><strong>Rare / Endangered</strong><span>${rare} protected species with watchlist details</span></a>
        <a class="home-card" href="#/review"><strong>Needs Review</strong><span>${review} listings still flagged for cleanup</span></a>
      </div>
    </section>`;
}
function mushroomLaneNav(activeLane = "all") {
  return `
    <section class="panel">
      <div class="result-header compact-result-header"><div class="result-title-row"><h3>Mushroom paths</h3><p class="results-meta">Use the underside first</p></div></div>
      <div class="mushroom-lane-grid">
        <a class="mushroom-lane-card ${activeLane === "gills" ? "active" : ""}" href="#/mushrooms-gilled"><strong>Gills</strong><span>True blade-like gills under the cap.</span></a>
        <a class="mushroom-lane-card ${activeLane === "sponge" ? "active" : ""}" href="#/boletes"><strong>Sponge-like</strong><span>Soft pores / bolete-type underside.</span></a>
        <a class="mushroom-lane-card ${activeLane === "other" ? "active" : ""}" href="#/mushrooms-other"><strong>Other</strong><span>False gills, teeth, shelves, coral, jelly, puffballs.</span></a>
      </div>
      <p class="small-note" style="margin-top:.55rem">Flip it over. True gills go to Gills. Soft sponge-like pores go to Sponge-like. Everything else goes to Other.</p>
    </section>`;
}
function compactSeasonPanel(allRecords, type, activeMonth = "") {
  const month = currentMonthName();
  const records = type === "plants"
    ? allRecords.filter((record) => isPlant(record) && (record.months_available || []).includes(month))
    : type === "mushrooms"
      ? allRecords.filter((record) => isForagingMushroom(record) && (record.months_available || []).includes(month))
      : avoidRecords(allRecords).filter((record) => (record.months_available || []).includes(month));
  const active = activeMonth === month;
  const label = type === "lookalikes" ? "Non-edible species" : (type === "plants" ? "Plants" : "Mushrooms");
  return `<section class="panel compact-season-panel"><div class="compact-season-head"><strong>${escapeHtml(label)}</strong><button class="buttonish compact-quick-filter ${active ? "active" : ""}" type="button" data-action="toggle-in-season" data-page="${escapeHtml(type === "lookalikes" ? "lookalikes" : type)}">In-season (${records.length})</button><span class="compact-month">${escapeHtml(month)}</span></div></section>`;
}
function selectFilter(label, key, values, current, blank) {
  return `<label class="compact-filter"><span>${escapeHtml(label)}</span><select data-filter="${escapeHtml(key)}">${optionHtml(values, current, blank)}</select></label>`;
}
function searchFilter(key, current, placeholder) {
  return `<label class="compact-filter compact-search"><input type="search" data-filter="${escapeHtml(key)}" value="${escapeHtml(current || "")}" placeholder="${escapeHtml(placeholder)}"></label>`;
}
function sortFilter(current, mode = "all") {
  const options = mode === "common-only" ? COMMON_ONLY_SORT_OPTIONS : SORT_OPTIONS;
  return `<label class="compact-filter"><span>Sort</span><select data-filter="sort">${options.map((opt) => `<option value="${escapeHtml(opt.value)}" ${current === opt.value ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}</select></label>`;
}
function filterBlock(extraFilters = [], allowClear = true) {
  const clear = allowClear ? `<div class="filter-actions"><button class="buttonish" type="button" data-action="clear-filters">Clear all filters</button></div>` : "";
  return `<section class="panel filter-stack"><div class="tight-filter-grid">${extraFilters.join("")}</div>${clear}</section>`;
}
function resultSection(title, records, context, filters = {}, metaText = "", sortMode = "all") {
  const options = sortMode === "common-only" ? COMMON_ONLY_SORT_OPTIONS : SORT_OPTIONS;
  const finalMeta = metaText || `${records.length} match${records.length === 1 ? "" : "es"}${filters.sort ? ` · ${escapeHtml(options.find((opt)=>opt.value===filters.sort)?.label || "")}` : ""}`;
  return `<section class="panel workspace-pane results-pane-card"><div class="result-header compact-result-header"><div class="result-title-row"><h3>${escapeHtml(title)}</h3><p class="results-meta">${finalMeta}</p></div></div><div class="result-list">${renderResultList(records, context)}</div></section>`;
}
function renderCreditsPage(allRecords, overridePayload) {
  const creditsBySlug = overridePayload?.creditsPayload?.credits || {};
  const photographerMap = new Map();
  Object.entries(creditsBySlug).forEach(([slug, items]) => {
    const record = allRecords.find((item) => item.slug === slug);
    const label = record?.display_name || formatLabelFromSlug(slug);
    (items || []).forEach((item) => {
      const creator = item.creator || "Unknown creator";
      const bucket = photographerMap.get(creator) || [];
      bucket.push({ label, license: item.license || "", title: item.title || "" });
      photographerMap.set(creator, bucket);
    });
  });
  const grouped = [...photographerMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([creator, items]) => `<section class="credit-group"><h4>${escapeHtml(creator)}</h4><ul>${items.map((item) => `<li><strong>${escapeHtml(item.label)}</strong>${item.title ? ` — ${escapeHtml(item.title)}` : ""}${item.license ? ` — ${escapeHtml(item.license)}` : ""}</li>`).join("")}</ul></section>`).join("");
  return grouped ? `<section class="panel">${grouped}</section>` : '<section class="panel empty-state"><h3>No credits loaded</h3></section>';
}
function renderReferencesPage(references, search = "") {
  const query = String(search || "").trim().toLowerCase();
  const items = (Array.isArray(references) ? references : []).filter((item) => !query || [item.title, item.source, item.summary, ...(item.topics || [])].join(" ").toLowerCase().includes(query));
  if (!items.length) return `${filterBlock([searchFilter("search", search, "Search references")], false)}<section class="panel empty-state"><h3>No references loaded</h3></section>`;
  return `${filterBlock([searchFilter("search", search, "Search references")], false)}<section class="panel"><div class="result-header compact-result-header"><div class="result-title-row"><h3>References</h3><p class="results-meta">${items.length} entr${items.length === 1 ? "y" : "ies"}</p></div></div><div class="reference-list">${items.map((item) => `<article class="panel"><h3><a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">${escapeHtml(item.title || "Untitled reference")}</a></h3><p class="one-line muted-line">${escapeHtml([item.source, item.published, item.resourceType].filter(Boolean).join(" · "))}</p>${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}${item.topics?.length ? `<div class="tag-row">${item.topics.map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`).join("")}</div>` : ""}</article>`).join("")}</div></section>`;
}
export function renderDashboard({ page, allRecords, currentRecords, filters, selectedMonth, overridePayload, references = [] }) {
  if (page === "home") return homeHub(allRecords);
  if (page === "search") return `${filterBlock([searchFilter("search", filters.search, "Search all species"), sortFilter(filters.sort), `<div class="filter-hint">Press Enter to search</div>`])}${resultSection("Search", currentRecords, "general", filters)}`;
  if (page === "plants") return `${compactSeasonPanel(allRecords, "plants", filters.month)}${filterBlock([sortFilter(filters.sort), selectFilter("Habitat", "habitat", vocabLabels(VOCAB.common.habitats), filters.habitat, "Any habitat"), selectFilter("Part / trait", "part", vocabLabels(VOCAB.common.observedParts), filters.part, "Any part / trait"), selectFilter("Flower color", "flowerColor", FLOWER_COLORS, filters.flowerColor, "Any flower color"), selectFilter("Leaf arrangement", "leafArrangement", LEAF_ARRANGEMENTS, filters.leafArrangement, "Any leaf arrangement"), selectFilter("Leaf shape", "leafShape", LEAF_SHAPES, filters.leafShape, "Any leaf shape"), selectFilter("Leaf points", "leafPointCount", LEAF_POINT_COUNTS, filters.leafPointCount, "Any leaf points"), selectFilter("Stem surface", "stemSurface", STEM_SURFACES, filters.stemSurface, "Any stem surface"), selectFilter("Size", "size", vocabLabels(VOCAB.common.sizes), filters.size, "Any size"), selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Plants", currentRecords, "general", filters)}`;
  if (page === "mushrooms") return `${mushroomLaneNav("all")}${compactSeasonPanel(allRecords, "mushrooms", filters.month)}${resultSection("Mushrooms", currentRecords, "mushrooms", filters, "Choose a lane above to narrow mushrooms faster.")}`;
  if (page === "mushrooms-gilled") return `${mushroomLaneNav("gills")}${compactSeasonPanel(allRecords, "mushrooms", filters.month)}${filterBlock([sortFilter(filters.sort), selectFilter("Substrate", "substrate", vocabLabels(VOCAB.mushrooms.substrates), filters.substrate, "Any substrate"), selectFilter("Tree type", "treeType", vocabLabels(VOCAB.mushrooms.woodTypes), filters.treeType, "Any tree type"), selectFilter("Host tree", "hostTree", hostTreeLabels(filters.treeType), filters.hostTree, "Any host tree"), selectFilter("Ring", "ring", vocabLabels(VOCAB.mushrooms.ringStates), filters.ring, "Any ring"), selectFilter("Texture", "texture", vocabLabels(VOCAB.mushrooms.textures), filters.texture, "Any texture"), selectFilter("Smell", "smell", vocabLabels(VOCAB.mushrooms.odors), filters.smell, "Any smell"), selectFilter("Staining", "staining", vocabLabels(VOCAB.mushrooms.stainingColors), filters.staining, "Any staining"), selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Gilled mushrooms", currentRecords, "mushrooms", filters)}`;
  if (page === "boletes") return `${mushroomLaneNav("sponge")}${compactSeasonPanel(allRecords, "mushrooms", filters.month)}${filterBlock([sortFilter(filters.sort), selectFilter("Substrate", "substrate", vocabLabels(VOCAB.mushrooms.substrates), filters.substrate, "Any substrate"), selectFilter("Tree type", "treeType", vocabLabels(VOCAB.mushrooms.woodTypes), filters.treeType, "Any tree type"), selectFilter("Host tree", "hostTree", hostTreeLabels(filters.treeType), filters.hostTree, "Any host tree"), selectFilter("Staining", "staining", vocabLabels(VOCAB.mushrooms.stainingColors), filters.staining, "Any staining"), selectFilter("Texture", "texture", vocabLabels(VOCAB.mushrooms.textures), filters.texture, "Any texture"), selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Boletes", currentRecords, "mushrooms", filters)}`;
  if (page === "mushrooms-other") return `${mushroomLaneNav("other")}${compactSeasonPanel(allRecords, "mushrooms", filters.month)}${filterBlock([sortFilter(filters.sort), selectFilter("Substrate", "substrate", vocabLabels(VOCAB.mushrooms.substrates), filters.substrate, "Any substrate"), selectFilter("Tree type", "treeType", vocabLabels(VOCAB.mushrooms.woodTypes), filters.treeType, "Any tree type"), selectFilter("Host tree", "hostTree", hostTreeLabels(filters.treeType), filters.hostTree, "Any host tree"), selectFilter("Texture", "texture", vocabLabels(VOCAB.mushrooms.textures), filters.texture, "Any texture"), selectFilter("Smell", "smell", vocabLabels(VOCAB.mushrooms.odors), filters.smell, "Any smell"), selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Other non-gilled mushrooms", currentRecords, "mushrooms", filters)}`;
  if (page === "medicinal") return `${filterBlock([sortFilter(filters.sort, "common-only"), selectFilter("Action", "medicinalAction", vocabLabels(VOCAB.medicinal.actions), filters.medicinalAction, "Any action"), selectFilter("Body system", "medicinalSystem", vocabLabels(VOCAB.medicinal.bodySystems), filters.medicinalSystem, "Any body system"), selectFilter("Medical term", "medicinalTerm", vocabLabels(VOCAB.medicinal.symptoms), filters.medicinalTerm, "Any medical term"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Medicinal", currentRecords, "medicinal", filters, "", "common-only")}`;
  if (page === "rare") return renderRarePageHtml(state.rareSpecies || [], state.rareSightings || []);
  if (page === "lookalikes") {
    const severities = [...new Set(allRecords.map((r) => r.non_edible_severity).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return `${compactSeasonPanel(allRecords, "lookalikes", filters.month)}${filterBlock([sortFilter(filters.sort, "common-only"), selectFilter("Severity", "severity", severities, filters.severity, "Any severity"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Non-edible species", currentRecords, "lookalikes", filters, "", "common-only")}`;
  }
  if (page === "review") {
    const reviewReasons = [...new Set(allRecords.flatMap((record) => record.reviewReasons || []))].sort((a, b) => a.localeCompare(b));
    return `${filterBlock([sortFilter(filters.sort, "common-only"), selectFilter("Review reason", "reviewReason", reviewReasons, filters.reviewReason, "Any review reason")])}${resultSection("Needs Review", currentRecords, "review", filters, "", "common-only")}`;
  }
  if (page === "timeline") {
    const eligible = allRecords.filter((record) => !!String(record.medicinal_uses || "").trim() || isForagingMushroom(record) || (isPlant(record) && !!String(record.culinary_uses || "").trim()));
    return `${renderInteractiveTimeline(eligible, selectedMonth, "results")}`;
  }
  if (page === "credits") return renderCreditsPage(allRecords, overridePayload);
  if (page === "references") return renderReferencesPage(references, filters.search || "");
  return "";
}
