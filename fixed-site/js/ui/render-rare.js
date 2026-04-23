import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

function compactList(values, max = 2) {
  const list = Array.isArray(values) ? values.filter(Boolean) : [];
  if (!list.length) return "";
  return list.slice(0, max).join(" • ");
}

function rareData(record) {
  return record.rare_profile || {
    status: record.status || "",
    legal_status: record.legal_status || "",
    up_relevance: record.up_relevance || "",
    sensitive_location: record.sensitive_location === true,
    reason: record.reason || "",
    field_marks: record.field_marks || "",
    care_note: record.care_note || "",
    key_features: Array.isArray(record.key_features) ? record.key_features : []
  };
}

export function renderRarePage(records, search = "") {
  const q = String(search || "").trim().toLowerCase();
  const filtered = (records || []).filter(record => {
    const rare = rareData(record);
    if (!q) return true;
    return [
      record.common_name, record.display_name, record.scientific_name, record.slug,
      rare.status, rare.legal_status, rare.up_relevance, rare.reason, rare.field_marks,
      rare.care_note, ...(rare.key_features || []), ...(record.look_alikes || [])
    ].join(" ").toLowerCase().includes(q);
  });

  return `
    <section class="panel">
      <h2>Rare species</h2>
      <p class="muted">Rare and watchlist entries should show why they matter, how to recognize them, and when location details should stay vague.</p>
      <div class="control-row">
        <input id="rareSearch" type="search" value="${esc(search)}" placeholder="Search rare species" style="flex:1;min-width:280px">
        <button id="rareSearchBtn" class="primary" type="button">Search</button>
      </div>
    </section>

    ${filtered.length ? `<section class="record-list">${filtered.map(record => {
      const rare = rareData(record);
      const lead = rare.reason || record.short_reason || compactList(rare.key_features, 1) || record.habitat || "";
      const fieldMarks = rare.field_marks || compactList(rare.key_features);
      return `
      <article class="record-card with-image">
        ${renderImageSlot(record, "card")}
        <div class="record-card-body">
          <h3><button class="record-title-button" type="button" data-detail="${esc(record.slug)}">${esc(record.common_name || record.display_name || record.slug)}</button></h3>
          <p class="muted small">${esc(record.scientific_name || "")}</p>
          <div class="record-meta">
            ${record.group ? `<span class="tag">${esc(record.group)}</span>` : ""}
            ${rare.status ? `<span class="tag warn">${esc(rare.status)}</span>` : ""}
            ${rare.legal_status ? `<span class="tag">${esc(rare.legal_status)}</span>` : ""}
            ${rare.up_relevance ? `<span class="tag">${esc(rare.up_relevance)}</span>` : ""}
            ${rare.sensitive_location ? `<span class="tag danger">Sensitive location</span>` : ""}
          </div>
          ${lead ? `<p>${esc(lead)}</p>` : ""}
          ${fieldMarks ? `<p class="muted small"><strong>Field marks:</strong> ${esc(fieldMarks)}</p>` : ""}
          ${rare.care_note ? `<p class="muted small"><strong>Care note:</strong> ${esc(rare.care_note)}</p>` : ""}
          <div class="control-row">
            <button class="primary" type="button" data-detail="${esc(record.slug)}">Open details</button>
          </div>
        </div>
      </article>
    `;}).join("")}</section>` : `<section class="panel empty-state"><h3>No rare species found</h3></section>`}
  `;
}
