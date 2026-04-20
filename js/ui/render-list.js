import { classifyRecord } from "../lib/merge.js";
import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

function makeMeta(record) {
  const bits = [];
  if (record.category) bits.push(`<span class="tag">${esc(record.category)}</span>`);
  if (record.lane && record.record_type === 'mushroom') bits.push(`<span class="tag">${esc(record.lane)}</span>`);
  if (record.commonness) bits.push(`<span class="tag">${esc(record.commonness)}</span>`);
  if (record.food_quality) bits.push(`<span class="tag good">${esc(record.food_quality)}</span>`);
  if (record.non_edible_severity) bits.push(`<span class="tag danger">${esc(record.non_edible_severity)}</span>`);
  if (record.review_status === 'needs_review') bits.push(`<span class="tag review">Needs review</span>`);
  return bits.join("");
}

function matchesSearch(record, q) {
  const hay = [
    record.display_name, record.common_name, record.scientific_name, record.slug,
    record.category, record.culinary_uses, record.medicinal_uses,
    record.notes, record.general_notes, record.edibility_detail, record.commonness,
    record.habitat_detail, ...(record.search_aliases || []), ...(record.reviewReasons || []),
    ...(record.look_alikes || []), ...(record.confused_with || [])
  ].join(" ").toLowerCase();
  return hay.includes(q);
}

export function filterRecords(records, route, search = "") {
  const q = String(search || "").trim().toLowerCase();
  return (records || []).filter(record => {
    if (record.hidden) return false;
    const { isPlant, isMushroom, medicinal, lookalike } = classifyRecord(record);
    if (route === "plants" && !isPlant) return false;
    if (route === "mushrooms-gilled" && !(isMushroom && record.lane === 'gilled')) return false;
    if (route === "boletes" && !(isMushroom && record.lane === 'bolete')) return false;
    if (route === "mushrooms-other" && !(isMushroom && record.lane === 'other')) return false;
    if (route === "medicinal" && !medicinal) return false;
    if (route === "lookalikes" && !lookalike) return false;
    if (route === "review" && record.review_status !== 'needs_review') return false;
    if (!q) return true;
    return matchesSearch(record, q);
  });
}

export function renderRecordCards(records, route = 'general') {
  if (!records.length) return `<section class="panel empty-state"><h3>No matches</h3></section>`;
  return `<section class="record-list">${records.map(record => `
    <article class="record-card with-image">
      ${renderImageSlot(record, 'card')}
      <div class="record-card-body">
        <h3><button class="record-title-button" type="button" data-detail="${esc(record.slug)}">${esc(record.display_name || record.common_name || record.slug || "Untitled")}</button></h3>
        <p class="muted small">${esc(record.scientific_name || "")}</p>
        <div class="record-meta">${makeMeta(record)}</div>
        <p>${esc(record.short_reason || record.classification_note || record.notes || record.general_notes || record.habitat_detail || "").slice(0, 260)}</p>
        <div class="control-row">
          <button class="primary" type="button" data-detail="${esc(record.slug)}">Open details</button>
          ${record.review_status === 'needs_review' ? `<button class="warn" type="button" data-review-action="mark-ok" data-slug="${esc(record.slug)}">Mark OK</button>` : ''}
          ${route !== 'review' && record.review_status !== 'needs_review' ? `<button class="subtle" type="button" data-review-action="send-review" data-slug="${esc(record.slug)}">Send to Needs Review</button>` : ''}
        </div>
      </div>
    </article>
  `).join("")}</section>`;
}
