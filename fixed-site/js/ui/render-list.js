import { classifyRecord, cleanUserFacingText, deriveIngestibleUse, isBuildNoteText } from "../lib/merge.js";
import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

function makeMeta(record, route = "general") {
  const info = classifyRecord(record);
  const edibleUse = record.edible_use || deriveIngestibleUse(record);
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

function asList(value) {
  return Array.isArray(value) ? value : [];
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
    medicinalTerm: filtersOrSearch?.medicinalTerm || ""
  };
}

function matchesMedicinalFilters(record, filters) {
  return arrayHas(record.medicinalAction, filters.medicinalAction)
    && arrayHas(record.medicinalSystem, filters.medicinalSystem)
    && arrayHas(record.medicinalTerms, filters.medicinalTerm);
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
    if (!routeMatch(record, route === "search" ? "general" : route)) return false;
    if (route === "medicinal" && !matchesMedicinalFilters(record, filters)) return false;
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
