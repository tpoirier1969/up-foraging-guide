import { classifyRecord, getMedicinalData } from "../lib/merge.js";
import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

function makeMeta(record) {
  const bits = [];
  if (record.foraging_class || record.category) bits.push(`<span class="tag">${esc(record.foraging_class || record.category)}</span>`);
  if (record.lane && record.record_type === "mushroom") bits.push(`<span class="tag">${esc(record.lane)}</span>`);
  if (record.commonness) bits.push(`<span class="tag">${esc(record.commonness)}</span>`);
  if (record.food_quality) bits.push(`<span class="tag good">${esc(record.food_quality)}</span>`);
  if (record.rare_profile?.status) bits.push(`<span class="tag warn">${esc(record.rare_profile.status)}</span>`);
  if (record.non_edible_severity) bits.push(`<span class="tag danger">${esc(record.non_edible_severity)}</span>`);
  if (record.review_status === "needs_review") bits.push(`<span class="tag review">Needs review</span>`);
  return bits.join("");
}

function matchesSearch(record, q) {
  const medicinal = getMedicinalData(record);
  const rare = record.rare_profile || {};
  const hay = [
    record.display_name, record.common_name, record.scientific_name, record.slug,
    record.category, record.foraging_class, record.overview, record.field_identification,
    record.culinary_uses, medicinal.summary || record.medicinal_uses,
    record.other_uses, record.notes, record.general_notes, record.edibility_notes || record.edibility_detail,
    record.commonness, record.habitat_detail, ...(record.habitats || []), ...(record.habitat || []),
    ...(record.search_aliases || []), ...(record.reviewReasons || []), ...(record.look_alikes || []),
    ...(record.confused_with || []), ...(medicinal.actions || []), ...(medicinal.body_systems || []),
    ...(medicinal.medical_terms || []), rare.reason, rare.field_marks, rare.care_note, ...(rare.key_features || [])
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
  const medicinal = getMedicinalData(record);
  return arrayHas(medicinal.actions || record.medicinalAction, filters.medicinalAction)
    && arrayHas(medicinal.body_systems || record.medicinalSystem, filters.medicinalSystem)
    && arrayHas(medicinal.medical_terms || record.medicinalTerms, filters.medicinalTerm);
}

function summaryText(record) {
  return record.overview
    || record.short_reason
    || record.classification_note
    || record.notes
    || record.general_notes
    || record.rare_profile?.reason
    || record.habitat_detail
    || "";
}

export function filterRecords(records, route, filtersOrSearch = "") {
  const filters = normalizeFilters(filtersOrSearch);
  const q = String(filters.search || "").trim().toLowerCase();
  return (records || []).filter(record => {
    if (record.hidden) return false;
    const { isPlant, isMushroom, medicinal, lookalike } = classifyRecord(record);
    if (route === "plants" && !isPlant) return false;
    if (route === "mushrooms-gilled" && !(isMushroom && record.lane === "gilled")) return false;
    if (route === "boletes" && !(isMushroom && record.lane === "bolete")) return false;
    if (route === "mushrooms-other" && !(isMushroom && record.lane === "other")) return false;
    if (route === "medicinal") {
      if (!medicinal) return false;
      if (!matchesMedicinalFilters(record, filters)) return false;
    }
    if (route === "lookalikes" && !lookalike) return false;
    if (route === "review" && record.review_status !== "needs_review") return false;
    if (!q) return true;
    return matchesSearch(record, q);
  });
}

export function renderRecordCards(records, route = "general") {
  if (!records.length) return `<section class="panel empty-state"><h3>No matches</h3></section>`;
  return `<section class="record-list">${records.map(record => `
    <article class="record-card with-image">
      ${renderImageSlot(record, "card")}
      <div class="record-card-body">
        <h3><button class="record-title-button" type="button" data-detail="${esc(record.slug)}">${esc(record.display_name || record.common_name || record.slug || "Untitled")}</button></h3>
        <p class="muted small">${esc(record.scientific_name || "")}</p>
        <div class="record-meta">${makeMeta(record)}</div>
        <p>${esc(summaryText(record)).slice(0, 260)}</p>
        <div class="control-row">
          <button class="primary" type="button" data-detail="${esc(record.slug)}">Open details</button>
          ${record.review_status === "needs_review" ? `<button class="warn" type="button" data-review-action="mark-ok" data-slug="${esc(record.slug)}">Mark OK</button>` : ""}
          ${route !== "review" && record.review_status !== "needs_review" ? `<button class="subtle" type="button" data-review-action="send-review" data-slug="${esc(record.slug)}">Send to Needs Review</button>` : ""}
        </div>
      </div>
    </article>
  `).join("")}</section>`;
}
