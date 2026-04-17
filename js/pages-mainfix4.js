import { MONTHS } from "./constants-mainfix.js";
import { medicinalRecords, isPlant, reviewRecords, avoidRecords, isForagingMushroom } from "./data-model-mainfix4.js?v=v3.2.0";
import { VOCAB } from "./vocabulary.js?v=v2.0";
import { renderResultCard } from "./renderers/cards-mainfix.js?v=v3.2.0";
import { renderInteractiveTimeline } from "./renderers/timeline.js?v=v3.2.0";
import { escapeHtml } from "./utils.js?v=v3.2.0";
import { state } from "./state.js";
import { renderRarePageHtml } from "./rare-watch.js";

const FLOWER_COLORS = ["White", "Purple", "Pink", "Yellow", "Blue", "Red", "Green"];
const LEAF_SHAPES = ["Round", "Oval", "Heart-shaped", "Lance-shaped", "Pointed", "Lobed", "Compound", "Needle-like"];
const LEAF_ARRANGEMENTS = ["Alternate", "Opposite", "Basal rosette", "Whorled", "Needle clusters"];
const STEM_SURFACES = ["Smooth", "Hairy", "Rough", "Fuzzy", "Prickly"];
const LEAF_POINT_COUNTS = ["1-point", "3-point", "5-point", "Many-lobed"];
const BOLETE_FAMILIES = [
  {
    key: "Brown / king allies",
    title: "Brown / king allies",
    text: "Thicker, brown-toned boletes including king bolete / porcini types and similar non-red species.",
    examples: "Examples: porcini, reticulate-stem browns, dark-capped brown boletes"
  },
  {
    key: "Red & staining boletes",
    title: "Red & staining boletes",
    text: "Red-capped or red-pored boletes and species that often bruise or stain blue.",
    examples: "Examples: bicolor bolete, Frost's bolete, red pores / blue staining"
  },
  {
    key: "Suillus / slippery jacks",
    title: "Suillus / slippery jacks",
    text: "Usually sticky or slimy-capped boletes, often associated with pines or larch and sometimes with glandular dots or a ring.",
    examples: "Examples: chicken fat mushroom, slippery jacks, larch bolete"
  },
  {
    key: "Leccinum / scaber stalks",
    title: "Leccinum / scaber stalks",
    text: "Boletes with rough dotted stalks (scabers), often associated with birch, aspen, or other hardwoods.",
    examples: "Examples: birch bolete, orange birch bolete, aspen bolete"
  },
  {
    key: "Tylopilus / bitter boletes",
    title: "Tylopilus / bitter boletes",
    text: "Usually brownish boletes with pinkish pore surfaces and bitter flesh; some are not worth eating.",
    examples: "Examples: pink-pored or brown-capped bitters"
  },
  {
    key: "Oddballs / shaggy boletes",
    title: "Oddballs / shaggy boletes",
    text: "Unusual or shaggy boletes such as Old Man of the Woods and similar odd-looking species.",
    examples: "Examples: Old Man of the Woods, shaggy / scaly oddballs"
  }
];
const BOLETE_SUBGROUPS = {
  "Brown / king allies": [
    { key: "King bolete / porcini", title: "King bolete / porcini", text: "Chunky, brown-capped boletes with pale to yellowish pores and stout stems; the best-known edible kings." },
    { key: "Reticulate-stem browns", title: "Reticulate-stem browns", text: "Brown boletes with net-like patterning (reticulation) on the stem." },
    { key: "Dark-capped brown boletes", title: "Dark-capped brown boletes", text: "Browns, bays, and similar darker capped boletes without the red/staining look of the red group." }
  ],
  "Red & staining boletes": [
    { key: "Red-capped boletes", title: "Red-capped boletes", text: "Species with red or reddish caps but not necessarily red pores." },
    { key: "Blue-staining yellow pores", title: "Blue-staining yellow pores", text: "Yellow-pored boletes that bruise or stain blue." },
    { key: "Red pores / strong blue staining", title: "Red pores / strong blue staining", text: "Red or orange pores and/or strong blue staining, often striking in the field." }
  ],
  "Suillus / slippery jacks": [
    { key: "With ring", title: "With ring", text: "Sticky-cap Suillus species with a ring on the stem." },
    { key: "Without ring", title: "Without ring", text: "Sticky-cap Suillus species lacking a ring." },
    { key: "Pine associates", title: "Pine associates", text: "Species usually growing with pine or other conifers." }
  ],
  "Leccinum / scaber stalks": [
    { key: "Birch associates", title: "Birch associates", text: "Scaber-stalk boletes associated with birch." },
    { key: "Aspen / poplar associates", title: "Aspen / poplar associates", text: "Scaber-stalk boletes associated with aspen or poplar." },
    { key: "Orange-capped scabers", title: "Orange-capped scabers", text: "Leccinum with orange caps and rough dotted stalks." }
  ],
  "Tylopilus / bitter boletes": [
    { key: "Pink-pored bitters", title: "Pink-pored bitters", text: "Bitter boletes with pinkish pore surfaces." },
    { key: "Brown-capped bitters", title: "Brown-capped bitters", text: "Duller brown bitter boletes, usually not red or staining like the red group." }
  ],
  "Oddballs / shaggy boletes": [
    { key: "Old Man of the Woods", title: "Old Man of the Woods", text: "Dark, shaggy, often blackish boletes in the Strobilomyces line." },
    { key: "Shaggy / scaly oddballs", title: "Shaggy / scaly oddballs", text: "Other odd or rough-looking boletes with shaggy / scaly features." }
  ]
};
const BOLETE_PORE_COLORS = [
  "White / cream",
  "Yellow",
  "Olive",
  "Pinkish",
  "Red / orange",
  "Gray / black"
];
const BOLETE_STEM_FEATURES = [
  "Smooth",
  "Reticulate / netted",
  "Scabers / rough dots",
  "Glandular dots",
  "Shaggy / scaly"
];
const SORT_OPTIONS = [
  { value: "", label: "Default sort" },
  { value: "food-quality-desc", label: "Choice foods first" },
  { value: "food-quality-asc", label: "Lower food quality first" },
  { value: "common-desc", label: "Most common first" },
  { value: "common-asc", label: "Least common first" }
];
const MEDICINAL_SORT_OPTIONS = [
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
function boleteSubgroupCards(group) {
  return BOLETE_SUBGROUPS[group] || [];
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
function homeHub(allRecords) {
  const month = currentMonthName();
  const inSeasonPlants = allRecords.filter((record) => isPlant(record) && (record.months_available || []).includes(month)).length;
  const inSeasonMushrooms = allRecords.filter((record) => isForagingMushroom(record) && (record.months_available || []).includes(month)).length;
  const totalPlants = allRecords.filter((record) => isPlant(record)).length;
  const totalMushrooms = allRecords.filter((record) => isForagingMushroom(record)).length;
  const totalMedicinal = medicinalRecords(allRecords).length;
  const rareCount = (state.rareSpecies || []).length;
  return `
    <section class="panel home-hub">
      <div class="result-header compact-result-header"><div class="result-title-row"><h3>In Focus Right Now</h3><p class="results-meta">${escapeHtml(month)}</p></div></div>
      <div class="tag-row">
        <span class="tag">${inSeasonPlants} plants in season</span>
        <span class="tag">${inSeasonMushrooms} mushrooms in season</span>
        <span class="tag">${totalPlants} total plants</span>
        <span class="tag">${totalMushrooms} total mushrooms</span>
        <span class="tag">${totalMedicinal} medicinal species</span>
        <span class="tag">${rareCount} rare / endangered entries</span>
      </div>
    </section>`;
}
function mushroomLaneNav(active = "all") {
  const cards = [
    { key: "gills", href: "#/mushrooms-gilled", title: "Gills", text: "Thin blade-like structures under the cap." },
    { key: "sponge", href: "#/boletes", title: "Sponge-like (boletes)", text: "Soft pores / sponge underside. Most of these are boletes." },
    { key: "other", href: "#/mushrooms-other", title: "Other", text: "Ridges, teeth, shelves, blobs, coral, jelly, and oddballs." }
  ];
  return `
    <section class="panel home-hub">
      <div class="result-header compact-result-header"><div class="result-title-row"><h3>Start here</h3><p class="results-meta">Choose a section</p></div></div>
      <div class="mushroom-lane-grid">
        ${cards.map((card) => `<a class="mushroom-lane-card ${active === card.key ? "active" : ""}" href="${card.href}"><strong>${card.title}</strong><span>${card.text}</span></a>`).join("")}
      </div>
    </section>`;
}
function seasonToggleFilter(page, count, activeMonth = "") {
  const month = currentMonthName();
  const active = activeMonth === month;
  return `<div class="compact-filter season-filter-cell"><span>Season</span><button class="buttonish compact-quick-filter ${active ? "active" : ""}" type="button" data-action="toggle-in-season" data-page="${escapeHtml(page)}">In-season (${count})</button></div>`;
}
function selectFilter(label, key, values, current, blank) {
  return `<label class="compact-filter"><span>${escapeHtml(label)}</span><select data-filter="${escapeHtml(key)}">${optionHtml(values, current, blank)}</select></label>`;
}
function searchFilter(key, current, placeholder) {
  return `<label class="compact-filter compact-search"><input type="search" data-filter="${escapeHtml(key)}" value="${escapeHtml(current || "")}" placeholder="${escapeHtml(placeholder)}"></label>`;
}
function sortFilter(current, options = SORT_OPTIONS) {
  return `<label class="compact-filter"><span>Sort</span><select data-filter="sort">${options.map((opt) => `<option value="${escapeHtml(opt.value)}" ${current === opt.value ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}</select></label>`;
}
function filterBlock(extraFilters = [], allowClear = true) {
  const clear = allowClear ? `<div class="filter-actions"><button class="buttonish" type="button" data-action="clear-filters">Clear all filters</button></div>` : "";
  return `<section class="panel filter-stack"><div class="tight-filter-grid">${extraFilters.join("")}</div>${clear}</section>`;
}
function resultSection(title, records, context, filters = {}, metaText = "", sortOptions = SORT_OPTIONS) {
  const finalMeta = metaText || `${records.length} match${records.length === 1 ? "" : "es"}${filters.sort ? ` · ${escapeHtml(sortOptions.find((opt)=>opt.value===filters.sort)?.label || "")}` : ""}`;
  return `<section class="panel workspace-pane results-pane-card"><div class="result-header compact-result-header"><div class="result-title-row"><h3>${escapeHtml(title)}</h3><p class="results-meta">${finalMeta}</p></div></div><div class="result-list">${renderResultList(records, context)}</div></section>`;
}
function renderMushroomLandingPage(allRecords) {
  const month = currentMonthName();
  const inSeasonRecords = allRecords.filter((record) => isForagingMushroom(record) && (record.months_available || []).includes(month));
  const metaText = `${inSeasonRecords.length} in season · ${escapeHtml(month)} · Use Gills, Sponge-like (boletes), or Other for full filtering`;
  return `${mushroomLaneNav("all")}${resultSection("MUSHROOMS IN SEASON NOW", inSeasonRecords, "mushrooms", {}, metaText)}`;
}
function renderBoleteGuide(currentRecords, filters, allRecords) {
  const inSeasonCount = allRecords.filter((record) => isForagingMushroom(record) && (record.underside || []).includes("Pores") && (record.months_available || []).includes(currentMonthName())).length;
  const familyGuide = `
    <section class="panel home-hub">
      <div class="result-header compact-result-header"><div class="result-title-row"><h3>Choose a bolete family / type</h3><p class="results-meta">Start by what you see, not by already knowing the names</p></div></div>
      <div class="mushroom-lane-grid">
        ${BOLETE_FAMILIES.map((family) => `<button type="button" class="mushroom-lane-card ${filters.boleteGroup === family.key ? "active" : ""}" data-action="set-bolete-group" data-value="${escapeHtml(family.key)}"><strong>${escapeHtml(family.title)}</strong><span>${escapeHtml(family.text)}</span><span class="muted-line">${escapeHtml(family.examples)}</span></button>`).join("")}
      </div>
    </section>`;

  const subgroupGuide = filters.boleteGroup ? `
    <section class="panel home-hub">
      <div class="result-header compact-result-header"><div class="result-title-row"><h3>${escapeHtml(filters.boleteGroup)}</h3><p class="results-meta">Choose the closer match below</p></div></div>
      <div class="mushroom-lane-grid">
        ${boleteSubgroupCards(filters.boleteGroup).map((subgroup) => `<button type="button" class="mushroom-lane-card ${filters.boleteSubgroup === subgroup.key ? "active" : ""}" data-action="set-bolete-subgroup" data-value="${escapeHtml(subgroup.key)}"><strong>${escapeHtml(subgroup.title)}</strong><span>${escapeHtml(subgroup.text)}</span></button>`).join("")}
      </div>
      <div class="tag-row"><button class="buttonish" type="button" data-action="clear-bolete-group">Choose a different bolete family / type</button></div>
    </section>` : "";

  const filterPanel = `${filterBlock([
      seasonToggleFilter("boletes", inSeasonCount, filters.month),
      sortFilter(filters.sort),
      selectFilter("Substrate", "substrate", vocabLabels(VOCAB.mushrooms.substrates), filters.substrate, "Any substrate"),
      selectFilter("Tree type", "treeType", vocabLabels(VOCAB.mushrooms.woodTypes), filters.treeType, "Any tree type"),
      selectFilter("Host tree", "hostTree", hostTreeLabels(filters.treeType), filters.hostTree, "Any host tree"),
      selectFilter("Pore color", "poreColor", BOLETE_PORE_COLORS, filters.poreColor, "Any pore color"),
      selectFilter("Stem feature", "stemFeature", BOLETE_STEM_FEATURES, filters.stemFeature, "Any stem feature"),
      selectFilter("Cap surface", "texture", vocabLabels(VOCAB.mushrooms.textures), filters.texture, "Any cap surface"),
      selectFilter("Staining", "staining", vocabLabels(VOCAB.mushrooms.stainingColors), filters.staining, "Any staining"),
      selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"),
      selectFilter("Month", "month", MONTHS, filters.month, "Any month")
    ])}`;

  const resultTitle = filters.boleteSubgroup ? filters.boleteSubgroup : (filters.boleteGroup || "Sponge-like mushrooms (boletes)");
  return `${mushroomLaneNav("sponge")}${familyGuide}${subgroupGuide}${filterPanel}${resultSection(resultTitle, currentRecords, "mushrooms", filters)}`;
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
  if (page === "plants") {
    const inSeasonCount = allRecords.filter((record) => isPlant(record) && (record.months_available || []).includes(currentMonthName())).length;
    return `${filterBlock([seasonToggleFilter("plants", inSeasonCount, filters.month), sortFilter(filters.sort), selectFilter("Habitat", "habitat", vocabLabels(VOCAB.common.habitats), filters.habitat, "Any habitat"), selectFilter("Part / trait", "part", vocabLabels(VOCAB.common.observedParts), filters.part, "Any part / trait"), selectFilter("Flower color", "flowerColor", FLOWER_COLORS, filters.flowerColor, "Any flower color"), selectFilter("Leaf arrangement", "leafArrangement", LEAF_ARRANGEMENTS, filters.leafArrangement, "Any leaf arrangement"), selectFilter("Leaf shape", "leafShape", LEAF_SHAPES, filters.leafShape, "Any leaf shape"), selectFilter("Leaf points", "leafPointCount", LEAF_POINT_COUNTS, filters.leafPointCount, "Any leaf points"), selectFilter("Stem surface", "stemSurface", STEM_SURFACES, filters.stemSurface, "Any stem surface"), selectFilter("Size", "size", vocabLabels(VOCAB.common.sizes), filters.size, "Any size"), selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Plants", currentRecords, "general", filters)}`;
  }
  if (page === "mushrooms") return renderMushroomLandingPage(allRecords);
  if (page === "mushrooms-gilled") {
    const inSeasonCount = allRecords.filter((record) => isForagingMushroom(record) && (record.underside || []).includes("Gills") && (record.months_available || []).includes(currentMonthName())).length;
    return `${mushroomLaneNav("gills")}${filterBlock([seasonToggleFilter("mushrooms-gilled", inSeasonCount, filters.month), sortFilter(filters.sort), selectFilter("Substrate", "substrate", vocabLabels(VOCAB.mushrooms.substrates), filters.substrate, "Any substrate"), selectFilter("Tree type", "treeType", vocabLabels(VOCAB.mushrooms.woodTypes), filters.treeType, "Any tree type"), selectFilter("Host tree", "hostTree", hostTreeLabels(filters.treeType), filters.hostTree, "Any host tree"), selectFilter("Ring", "ring", vocabLabels(VOCAB.mushrooms.ringStates), filters.ring, "Any ring"), selectFilter("Smell", "smell", vocabLabels(VOCAB.mushrooms.odors), filters.smell, "Any smell"), selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Gilled mushrooms", currentRecords, "mushrooms", filters)}`;
  }
  if (page === "boletes") return renderBoleteGuide(currentRecords, filters, allRecords);
  if (page === "mushrooms-other") {
    const inSeasonCount = allRecords.filter((record) => isForagingMushroom(record) && !(record.underside || []).includes("Gills") && !(record.underside || []).includes("Pores") && (record.months_available || []).includes(currentMonthName())).length;
    return `${mushroomLaneNav("other")}${filterBlock([seasonToggleFilter("mushrooms-other", inSeasonCount, filters.month), sortFilter(filters.sort), selectFilter("Substrate", "substrate", vocabLabels(VOCAB.mushrooms.substrates), filters.substrate, "Any substrate"), selectFilter("Tree type", "treeType", vocabLabels(VOCAB.mushrooms.woodTypes), filters.treeType, "Any tree type"), selectFilter("Host tree", "hostTree", hostTreeLabels(filters.treeType), filters.hostTree, "Any host tree"), selectFilter("Texture", "texture", vocabLabels(VOCAB.mushrooms.textures), filters.texture, "Any texture"), selectFilter("Smell", "smell", vocabLabels(VOCAB.mushrooms.odors), filters.smell, "Any smell"), selectFilter("Taste", "taste", vocabLabels(VOCAB.common.tastes), filters.taste, "Any taste"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Other non-gilled mushrooms", currentRecords, "mushrooms", filters)}`;
  }
  if (page === "medicinal") {
    const inSeasonCount = medicinalRecords(allRecords).filter((record) => (record.months_available || []).includes(currentMonthName())).length;
    return `${filterBlock([seasonToggleFilter("medicinal", inSeasonCount, filters.month), sortFilter(filters.sort, MEDICINAL_SORT_OPTIONS), selectFilter("Action", "medicinalAction", vocabLabels(VOCAB.medicinal.actions), filters.medicinalAction, "Any action"), selectFilter("Body system", "medicinalSystem", vocabLabels(VOCAB.medicinal.bodySystems), filters.medicinalSystem, "Any body system"), selectFilter("Medical term", "medicinalTerm", vocabLabels(VOCAB.medicinal.symptoms), filters.medicinalTerm, "Any medical term"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Medicinal", currentRecords, "medicinal", filters, "", MEDICINAL_SORT_OPTIONS)}`;
  }
  if (page === "rare") return renderRarePageHtml(state.rareSpecies || [], state.rareSightings || []);
  if (page === "lookalikes") {
    const severities = [...new Set(allRecords.map((r) => r.non_edible_severity).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const inSeasonCount = avoidRecords(allRecords).filter((record) => (record.months_available || []).includes(currentMonthName())).length;
    return `${filterBlock([seasonToggleFilter("lookalikes", inSeasonCount, filters.month), sortFilter(filters.sort), selectFilter("Severity", "severity", severities, filters.severity, "Any severity"), selectFilter("Month", "month", MONTHS, filters.month, "Any month")])}${resultSection("Non-edible species", currentRecords, "lookalikes", filters)}`;
  }
  if (page === "review") { const reviewReasons = [...new Set(allRecords.flatMap((record) => record.reviewReasons || []))].sort((a, b) => a.localeCompare(b)); return `${filterBlock([sortFilter(filters.sort), selectFilter("Review reason", "reviewReason", reviewReasons, filters.reviewReason, "Any review reason")])}${resultSection("Needs Review", currentRecords, "review", filters)}`; }
  if (page === "timeline") { const eligible = allRecords.filter((record) => !!String(record.medicinal_uses || "").trim() || isForagingMushroom(record) || (isPlant(record) && !!String(record.culinary_uses || "").trim())); return `${renderInteractiveTimeline(eligible, selectedMonth, "results")}`; }
  if (page === "credits") return renderCreditsPage(allRecords, overridePayload);
  if (page === "references") return renderReferencesPage(references, filters.search || "");
  return "";
}
