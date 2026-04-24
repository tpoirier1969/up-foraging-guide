import { classifyRecord, cleanUserFacingText, isBuildNoteText } from "../lib/merge.js?v=v4.2.25-r2026-04-24-filter-cleanup1";
import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const PLANT_FILTER_DEFS = [
  { key: "plantMonth", label: "Season", blankLabel: "Any season", valueKey: "month" },
  { key: "plantPart", label: "Part / clue", blankLabel: "Any part", valueKey: "plantPart" },
  { key: "plantHabitat", label: "Habitat", blankLabel: "Any habitat", valueKey: "plantHabitat" },
  { key: "plantSize", label: "Size", blankLabel: "Any size", valueKey: "plantSize" },
  { key: "plantTaste", label: "Taste", blankLabel: "Any taste", valueKey: "plantTaste" },
  { key: "plantFlowerColor", label: "Flower color", blankLabel: "Any flower color", valueKey: "plantFlowerColor" },
  { key: "plantFruitColor", label: "Fruit color", blankLabel: "Any fruit color", valueKey: "plantFruitColor" },
  { key: "plantLeafShape", label: "Leaf shape", blankLabel: "Any leaf shape", valueKey: "plantLeafShape" },
  { key: "plantLeafArrangement", label: "Leaf arrangement", blankLabel: "Any leaf arrangement", valueKey: "plantLeafArrangement" },
  { key: "plantStem", label: "Stem / surface", blankLabel: "Any stem clue", valueKey: "plantStem" }
];

const MUSHROOM_FILTER_DEFS = [
  { key: "mushroomMonth", label: "Season", blankLabel: "Any season", valueKey: "month" },
  { key: "mushroomSubstrate", label: "Substrate", blankLabel: "Any substrate", valueKey: "mushroomSubstrate" },
  { key: "mushroomTreeType", label: "Tree type", blankLabel: "Any tree type", valueKey: "mushroomTreeType" },
  { key: "mushroomHost", label: "Host tree", blankLabel: "Any host tree", valueKey: "mushroomHost" },
  { key: "mushroomUnderside", label: "Underside", blankLabel: "Any underside", valueKey: "mushroomUnderside" },
  { key: "mushroomRing", label: "Ring", blankLabel: "Any ring", valueKey: "mushroomRing" },
  { key: "mushroomTexture", label: "Texture", blankLabel: "Any texture", valueKey: "mushroomTexture" },
  { key: "mushroomSmell", label: "Smell", blankLabel: "Any smell", valueKey: "mushroomSmell" },
  { key: "mushroomStaining", label: "Staining", blankLabel: "Any staining", valueKey: "mushroomStaining" },
  { key: "mushroomCapSurface", label: "Cap surface", blankLabel: "Any cap surface", valueKey: "mushroomCapSurface" },
  { key: "mushroomStemFeature", label: "Stem feature", blankLabel: "Any stem feature", valueKey: "mushroomStemFeature" }
];

const BOLETE_EXTRA_FILTER_DEFS = [
  { key: "mushroomBoleteGroup", label: "Bolete group", blankLabel: "Any bolete group", valueKey: "mushroomBoleteGroup" },
  { key: "mushroomBoleteSubgroup", label: "Bolete subgroup", blankLabel: "Any bolete subgroup", valueKey: "mushroomBoleteSubgroup" },
  { key: "mushroomPoreColor", label: "Pore color", blankLabel: "Any pore color", valueKey: "mushroomPoreColor" }
];

const SKIP_OPTION_VALUES = new Set(["", "unknown", "needs-review", "needs review", "review_required", "n/a", "not sure"]);
const MISSING_FILTER_VALUE = "__missing__";
const MISSING_FILTER_LABEL = "Unknown / not specified";
const SEASON_REVIEW_VALUE = "__season_needs_review__";
const SEASON_REVIEW_LABEL = "Season needs review";
const TREE_TYPE_RE = /\b(hardwood|softwood|conifer|coniferous|deciduous|broadleaf|mixed woods?)\b/i;

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  return [value];
}

function nestedValue(source, path) {
  return path.reduce((value, key) => (value && typeof value === "object" ? value[key] : undefined), source);
}

function collectValues(record, paths = []) {
  return paths.flatMap((path) => asList(nestedValue(record, path)));
}

function normalizeOption(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");
}

function cleanOptionValues(values = []) {
  return values
    .flatMap((value) => asList(value))
    .map(normalizeOption)
    .filter((value) => value && !SKIP_OPTION_VALUES.has(value.toLowerCase()));
}

function hasLikelyDefaultSeason(record) {
  const precision = String(record.weekPrecision || record.week_precision || record.season_confidence || "").toLowerCase();
  if (precision.includes("needs-review") || precision.includes("needs review")) return true;

  const reviewReasons = [
    ...asList(record.reviewReasons),
    ...asList(record.review_reasons),
    ...asList(record.manual_review_reasons)
  ].join(" ").toLowerCase();
  if (reviewReasons.includes("needs species-level") || reviewReasons.includes("needs source links")) return true;

  const auditText = [
    record.notes,
    record.general_notes,
    record.culinary_uses,
    record.mushroom_profile?.summary,
    ...asList(record.mushroom_profile?.research_notes)
  ].join(" ");
  return isBuildNoteText(auditText);
}

function monthValues(record) {
  if (hasLikelyDefaultSeason(record)) return [SEASON_REVIEW_VALUE];
  const names = cleanOptionValues(record.months_available);
  const fromSeasonMonths = asList(record.season_months)
    .map((value) => MONTHS[Number(value) - 1] || "")
    .filter(Boolean);
  const fromMonthNumbers = asList(record.month_numbers)
    .map((value) => MONTHS[Number(value) - 1] || "")
    .filter(Boolean);
  return cleanOptionValues([...names, ...fromSeasonMonths, ...fromMonthNumbers]);
}

function treeTypeValues(record) {
  const candidates = cleanOptionValues([
    ...collectValues(record, [["treeType"], ["wood_type"], ["mushroom_profile", "wood_type"]]),
    ...collectValues(record, [["host_filter_tokens"], ["mushroom_profile", "host_filter_tokens"]])
  ]);
  return candidates.filter((value) => TREE_TYPE_RE.test(value));
}

function hostTreeValues(record) {
  const candidates = cleanOptionValues([
    ...collectValues(record, [["hostTree"], ["host_trees"], ["mushroom_profile", "host_trees"]]),
    ...collectValues(record, [["host_filter_tokens"], ["mushroom_profile", "host_filter_tokens"]])
  ]);
  return candidates.filter((value) => !TREE_TYPE_RE.test(value));
}

function valuesForFilter(record, valueKey) {
  switch (valueKey) {
    case "month": return monthValues(record);
    case "plantPart": return cleanOptionValues(collectValues(record, [["observedPart"], ["parts_used"], ["plant_parts"], ["category"], ["foraging_class"]]));
    case "plantHabitat": return cleanOptionValues(collectValues(record, [["habitats"], ["habitat"]]));
    case "plantSize": return cleanOptionValues(collectValues(record, [["size"]]));
    case "plantTaste": return cleanOptionValues(collectValues(record, [["taste"]]));
    case "plantFlowerColor": return cleanOptionValues(collectValues(record, [["flowerColor"], ["flower_color"]]));
    case "plantFruitColor": return cleanOptionValues(collectValues(record, [["fruitColor"], ["fruit_color"], ["berryColor"], ["berry_color"]]));
    case "plantLeafShape": return cleanOptionValues(collectValues(record, [["leafShape"], ["leaf_shape"]]));
    case "plantLeafArrangement": return cleanOptionValues(collectValues(record, [["leafArrangement"], ["leaf_arrangement"]]));
    case "plantStem": return cleanOptionValues(collectValues(record, [["stemSurface"], ["stem_surface"], ["stemShape"], ["stem_shape"], ["leafPointCount"]]));
    case "mushroomSubstrate": return cleanOptionValues(collectValues(record, [["substrate"], ["mushroom_profile", "substrate"]]));
    case "mushroomTreeType": return treeTypeValues(record);
    case "mushroomHost": return hostTreeValues(record);
    case "mushroomUnderside": return cleanOptionValues(collectValues(record, [["underside"], ["mushroom_profile", "underside"], ["mushroom_profile", "underside_type"], ["mushroom_profile", "fertile_surface"]]));
    case "mushroomRing": return cleanOptionValues(collectValues(record, [["ring"], ["mushroom_profile", "ring"]]));
    case "mushroomTexture": return cleanOptionValues(collectValues(record, [["texture"], ["mushroom_profile", "texture"]]));
    case "mushroomSmell": return cleanOptionValues(collectValues(record, [["smell"], ["odor"], ["mushroom_profile", "smell"], ["mushroom_profile", "odor"]]));
    case "mushroomStaining": return cleanOptionValues(collectValues(record, [["staining"], ["mushroom_profile", "staining"]]));
    case "mushroomCapSurface": return cleanOptionValues(collectValues(record, [["capSurface"], ["cap_surface"], ["mushroom_profile", "cap_surface"]]));
    case "mushroomStemFeature": return cleanOptionValues(collectValues(record, [["stemFeature"], ["stem_feature"], ["mushroom_profile", "stem_feature"]]));
    case "mushroomBoleteGroup": return cleanOptionValues(collectValues(record, [["boleteGroup"], ["mushroom_family"]]));
    case "mushroomBoleteSubgroup": return cleanOptionValues(collectValues(record, [["boleteSubgroup"]]));
    case "mushroomPoreColor": return cleanOptionValues(collectValues(record, [["poreColor"], ["pore_color"], ["mushroom_profile", "pore_color"]]));
    default: return [];
  }
}

function filterDefinitionsForRoute(route) {
  if (route === "plants") return PLANT_FILTER_DEFS;
  if (["mushrooms-gilled", "mushrooms-other"].includes(route)) return MUSHROOM_FILTER_DEFS;
  if (route === "boletes") return [...MUSHROOM_FILTER_DEFS, ...BOLETE_EXTRA_FILTER_DEFS];
  return [];
}

function displayOptionValue(value) {
  if (value === MISSING_FILTER_VALUE) return MISSING_FILTER_LABEL;
  if (value === SEASON_REVIEW_VALUE) return SEASON_REVIEW_LABEL;
  return value;
}

function sortOptions(values, valueKey = "") {
  const unique = [...new Set(cleanOptionValues(values))];
  return unique.sort((a, b) => {
    if (a === SEASON_REVIEW_VALUE) return 1;
    if (b === SEASON_REVIEW_VALUE) return -1;
    if (a === MISSING_FILTER_VALUE) return 1;
    if (b === MISSING_FILTER_VALUE) return -1;
    if (valueKey === "month") return MONTHS.indexOf(a) - MONTHS.indexOf(b);
    return a.localeCompare(b);
  });
}

export function getFilterFieldsForRoute(records, route) {
  const defs = filterDefinitionsForRoute(route);
  if (!defs.length) return [];
  const baseRecords = (records || []).filter((record) => !record?.hidden && routeMatch(record, route));
  return defs.map((def) => {
    const counts = new Map();
    let missingCount = 0;
    for (const record of baseRecords) {
      const values = [...new Set(valuesForFilter(record, def.valueKey))];
      if (!values.length) {
        missingCount += 1;
        continue;
      }
      values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
    }
    const values = sortOptions([...counts.keys()], def.valueKey);
    const options = values.map((value) => ({
      value,
      label: `${displayOptionValue(value)} (${counts.get(value) || 0})`
    }));
    if (missingCount > 0) {
      options.push({ value: MISSING_FILTER_VALUE, label: `${MISSING_FILTER_LABEL} (${missingCount})` });
    }
    return { ...def, options };
  }).filter((field) => field.options.length > 0);
}

export function hasActiveTraitFilters(route, filters = {}) {
  return filterDefinitionsForRoute(route).some((def) => !!filters?.[def.key]);
}

function makeMeta(record, route = "general") {
  const info = classifyRecord(record);
  const edibleUse = record.edible_use || null;
  const bits = [];
  if (record.foraging_class) bits.push(`<span class="tag">${esc(String(record.foraging_class).replaceAll("_", " "))}</span>`);
  else if (record.category) bits.push(`<span class="tag">${esc(record.category)}</span>`);
  if (record.lane && record.record_type === "mushroom") bits.push(`<span class="tag">${esc(record.lane)}</span>`);
  if (route === "other-uses" && info.otherUses) bits.push(`<span class="tag">Other use</span>`);
  if ((route === "lookalikes" || route === "caution") && info.caution) bits.push(`<span class="tag danger">Caution</span>`);
  if (record.commonness) bits.push(`<span class="tag">${esc(record.commonness)}</span>`);
  if (record.food_quality) bits.push(`<span class="tag good">${esc(record.food_quality)}</span>`);
  if (edibleUse?.has_ingestible_use && edibleUse.method && !bits.join(" ").includes(edibleUse.method)) bits.push(`<span class="tag good">${esc(edibleUse.method)}</span>`);
  if (record.non_edible_severity && !edibleUse?.has_ingestible_use) bits.push(`<span class="tag danger">${esc(record.non_edible_severity)}</span>`);
  if (record.review_status === "needs_review") bits.push(`<span class="tag review">Needs review</span>`);
  return bits.join("");
}

function matchesSearch(record, q) {
  const rare = record.rare_profile || {};
  const medicinal = record.medicinal || {};
  const hay = [
    record.display_name,
    record.common_name,
    ...(record.common_names || []),
    record.scientific_name,
    record.slug,
    record.category,
    record.foraging_class,
    record.overview,
    record.field_identification,
    record.culinary_uses,
    record.medicinal_uses,
    medicinal.summary,
    record.other_uses,
    record.notes,
    record.general_notes,
    record.edibility_notes,
    record.edibility_detail,
    record.commonness,
    rare.reason,
    rare.field_marks,
    rare.care_note,
    record.danger_level,
    record.poisoning_effects,
    record.toxicity_notes,
    ...(record.search_aliases || []),
    ...(record.reviewReasons || []),
    ...(record.look_alikes || []),
    ...(record.confused_with || []),
    ...(record.medicinalAction || []),
    ...(record.medicinalSystem || []),
    ...(record.medicinalTerms || []),
    ...(record.affected_systems || []),
    ...(rare.key_features || [])
  ].join(" ").toLowerCase();
  return hay.includes(q);
}

function arrayHas(valueList, selected) {
  if (!selected) return true;
  return asList(valueList).includes(selected);
}

function normalizeFilters(filtersOrSearch) {
  if (typeof filtersOrSearch === "string") {
    return {
      search: filtersOrSearch,
      medicinalAction: "",
      medicinalSystem: "",
      medicinalTerm: ""
    };
  }
  return {
    search: filtersOrSearch?.search || "",
    medicinalAction: filtersOrSearch?.medicinalAction || "",
    medicinalSystem: filtersOrSearch?.medicinalSystem || "",
    medicinalTerm: filtersOrSearch?.medicinalTerm || "",
    plantMonth: filtersOrSearch?.plantMonth || "",
    plantPart: filtersOrSearch?.plantPart || "",
    plantHabitat: filtersOrSearch?.plantHabitat || "",
    plantSize: filtersOrSearch?.plantSize || "",
    plantTaste: filtersOrSearch?.plantTaste || "",
    plantFlowerColor: filtersOrSearch?.plantFlowerColor || "",
    plantFruitColor: filtersOrSearch?.plantFruitColor || "",
    plantLeafShape: filtersOrSearch?.plantLeafShape || "",
    plantLeafArrangement: filtersOrSearch?.plantLeafArrangement || "",
    plantStem: filtersOrSearch?.plantStem || "",
    mushroomMonth: filtersOrSearch?.mushroomMonth || "",
    mushroomSubstrate: filtersOrSearch?.mushroomSubstrate || "",
    mushroomTreeType: filtersOrSearch?.mushroomTreeType || "",
    mushroomHost: filtersOrSearch?.mushroomHost || "",
    mushroomUnderside: filtersOrSearch?.mushroomUnderside || "",
    mushroomRing: filtersOrSearch?.mushroomRing || "",
    mushroomTexture: filtersOrSearch?.mushroomTexture || "",
    mushroomSmell: filtersOrSearch?.mushroomSmell || "",
    mushroomStaining: filtersOrSearch?.mushroomStaining || "",
    mushroomCapSurface: filtersOrSearch?.mushroomCapSurface || "",
    mushroomStemFeature: filtersOrSearch?.mushroomStemFeature || "",
    mushroomBoleteGroup: filtersOrSearch?.mushroomBoleteGroup || "",
    mushroomBoleteSubgroup: filtersOrSearch?.mushroomBoleteSubgroup || "",
    mushroomPoreColor: filtersOrSearch?.mushroomPoreColor || ""
  };
}

function matchesMedicinalFilters(record, filters) {
  return arrayHas(record.medicinalAction, filters.medicinalAction)
    && arrayHas(record.medicinalSystem, filters.medicinalSystem)
    && arrayHas(record.medicinalTerms, filters.medicinalTerm);
}

function matchesTraitFilters(record, route, filters) {
  const defs = filterDefinitionsForRoute(route);
  if (!defs.length) return true;
  return defs.every((def) => {
    const selected = String(filters?.[def.key] || "").trim();
    if (!selected) return true;
    const values = valuesForFilter(record, def.valueKey);
    if (selected === MISSING_FILTER_VALUE) return values.length === 0;
    return values.includes(selected);
  });
}

function routeMatch(record, route) {
  const info = classifyRecord(record);
  if (route === "plants") return info.isPlant && info.edible;
  if (route === "mushrooms-gilled") return info.isMushroom && info.edible && record.lane === "gilled";
  if (route === "boletes") return info.isMushroom && info.edible && record.lane === "bolete";
  if (route === "mushrooms-other") return info.isMushroom && info.edible && record.lane === "other";
  if (route === "medicinal") return info.medicinal;
  if (route === "lookalikes") return info.caution;
  if (route === "caution") return info.caution;
  if (route === "other-uses") return info.otherUses;
  if (route === "review") return record.review_status === "needs_review";
  return true;
}

export function filterRecords(records, route, filtersOrSearch = "") {
  const filters = normalizeFilters(filtersOrSearch);
  const q = String(filters.search || "").trim().toLowerCase();
  return (records || []).filter((record) => {
    if (record.hidden) return false;
    const matchRoute = route === "search" ? "general" : route;
    if (!routeMatch(record, matchRoute)) return false;
    if (route === "medicinal" && !matchesMedicinalFilters(record, filters)) return false;
    if (!matchesTraitFilters(record, matchRoute, filters)) return false;
    if (!q) return true;
    return matchesSearch(record, q);
  });
}

function cardSnippet(record) {
  const rare = record.rare_profile || {};
  const candidates = [
    record.overview,
    record.field_identification,
    record.other_uses,
    record.poisoning_effects,
    record.toxicity_notes,
    record.edibility_notes,
    record.edibility_detail,
    rare.reason,
    record.culinary_uses,
    record.notes,
    record.general_notes,
    record.habitat_detail
  ];
  for (const value of candidates) {
    const text = cleanUserFacingText(value);
    if (!text) continue;
    if (isBuildNoteText(text)) continue;
    return text;
  }
  return "";
}

export function renderRecordCards(records, route = "general") {
  if (!records.length) return `<section class="panel empty-state"><h3>No matches</h3></section>`;
  return `<section class="record-list">${records.map((record) => `
    <article class="record-card with-image">
      ${renderImageSlot(record, "card")}
      <div class="record-card-body">
        <h3><button class="record-title-button" type="button" data-detail="${esc(record.slug)}">${esc(record.display_name || record.common_name || record.slug || "Untitled")}</button></h3>
        <p class="muted small">${esc(record.scientific_name || "")}</p>
        <div class="record-meta">${makeMeta(record, route)}</div>
        <p>${esc(cardSnippet(record)).slice(0, 260)}</p>
        <div class="control-row">
          <button class="primary" type="button" data-detail="${esc(record.slug)}">Open details</button>
          ${record.review_status === "needs_review" ? `<button class="warn" type="button" data-review-action="mark-ok" data-slug="${esc(record.slug)}">Mark OK</button>` : ""}
          ${route !== "review" && record.review_status !== "needs_review" ? `<button class="subtle" type="button" data-review-action="send-review" data-slug="${esc(record.slug)}">Send to Needs Review</button>` : ""}
        </div>
      </div>
    </article>
  `).join("")}</section>`;
}
