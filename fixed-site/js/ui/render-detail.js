import { esc } from "../lib/escape.js";
import { getMedicinalData, isBuildNoteText } from "../lib/merge.js";
import { renderImageSlot } from "../lib/image-slot.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function lineIf(label, value) {
  if (value === undefined || value === null || value === "") return "";
  return `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`;
}

function listBlock(title, values) {
  if (!Array.isArray(values) || !values.length) return "";
  return `<section class="detail-block"><h4>${esc(title)}</h4><ul class="list-tight">${values.map(v => `<li>${esc(v)}</li>`).join("")}</ul></section>`;
}

function seasonText(record) {
  if (Array.isArray(record.months_available) && record.months_available.length) return record.months_available.join(", ");
  if (Array.isArray(record.season_months) && record.season_months.length) {
    return record.season_months.map((n) => MONTHS[n - 1] || String(n)).join(", ");
  }
  return "";
}

function rareBlock(record) {
  const rare = record.rare_profile || {};
  const hasRare = rare.status || rare.legal_status || rare.up_relevance || rare.reason || rare.field_marks || rare.care_note || rare.sensitive_location || (rare.key_features || []).length;
  if (!hasRare) return "";
  return `
    <section class="detail-block">
      <h4>Rare / tracked status</h4>
      <dl class="kv">
        ${lineIf("Status", rare.status)}
        ${lineIf("Legal status", rare.legal_status)}
        ${lineIf("U.P. relevance", rare.up_relevance)}
        ${lineIf("Why tracked", rare.reason)}
        ${lineIf("Field marks", rare.field_marks)}
        ${lineIf("Care note", rare.care_note)}
        ${lineIf("Location caution", rare.sensitive_location ? "Keep exact locations private." : "")}
      </dl>
    </section>
    ${listBlock("Key features", rare.key_features)}
  `;
}

function dangerBlock(record) {
  const ed = String(record.edibility_status || "").trim().toLowerCase();
  const severity = String(record.non_edible_severity || "").trim();
  const level = String(record.danger_level || (ed === "deadly" ? "Deadly" : ed === "poisonous" ? "Poisonous" : severity)).trim();
  const effects = String(record.poisoning_effects || record.toxicity_notes || "").trim();
  const affected = Array.isArray(record.affected_systems) ? record.affected_systems.filter(Boolean) : [];
  const notes = String(record.edibility_notes || record.edibility_detail || "").trim();
  const isDanger = ed === "poisonous" || ed === "deadly" || /poison|deadly|toxic|danger/i.test(`${severity} ${level}`);
  if (!isDanger && !effects && !affected.length) return "";
  const fallback = effects || (ed === "deadly"
    ? "Potentially life-threatening. Avoid entirely."
    : "Can cause illness or poisoning. Treat as unsafe to eat.");
  return `
    <section class="detail-block">
      <h4>Danger / poisoning</h4>
      <dl class="kv">
        ${lineIf("Danger level", level)}
        ${lineIf("Likely effects", fallback)}
        ${lineIf("Severity / notes", notes)}
        ${lineIf("Affected systems", affected.join(", "))}
      </dl>
    </section>
  `;
}

function linkBlock(record) {
  const links = Array.isArray(record.use_links) ? record.use_links : (Array.isArray(record.links) ? record.links.map((url) => ({ label: url, url })) : []);
  if (!links.length) return "";
  return `<section class="detail-block"><h4>Links</h4><ul class="list-tight">${links.map((item) => {
    const url = typeof item === "string" ? item : item.url;
    const label = typeof item === "string" ? item : (item.label || item.url);
    return `<li><a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)}</a></li>`;
  }).join("")}</ul></section>`;
}

export function renderDetail(record) {
  const typeLabel = record.foraging_class ? String(record.foraging_class).replaceAll("_", " ") : (record.category || record.group || "");
  const medicinal = getMedicinalData(record);
  const medicinalUses = String(medicinal.summary || "").trim();
  const habitats = Array.isArray(record.habitats) && record.habitats.length ? record.habitats.join(", ") : (Array.isArray(record.habitat) ? record.habitat.join(", ") : (record.habitat_detail || ""));
  const notes = !isBuildNoteText(record.notes) ? String(record.notes || "").trim() : "";
  const generalNotes = !isBuildNoteText(record.general_notes) ? String(record.general_notes || "").trim() : "";

  return `
    <article class="detail-grid">
      <section class="detail-block detail-hero">
        ${renderImageSlot(record, 'detail')}
        <div>
          <h3>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</h3>
          <p class="muted">${esc(record.scientific_name || "")}</p>
          <div class="record-meta">
            ${typeLabel ? `<span class="tag">${esc(typeLabel)}</span>` : ""}
            ${record.lane ? `<span class="tag">${esc(record.lane)}</span>` : ""}
            ${record.commonness ? `<span class="tag">${esc(record.commonness)}</span>` : ""}
            ${record.non_edible_severity ? `<span class="tag danger">${esc(record.non_edible_severity)}</span>` : ""}
            ${record.review_status === 'needs_review' ? `<span class="tag review">Needs review</span>` : ''}
          </div>
          <div class="quick-actions">
            ${record.review_status === 'needs_review'
              ? `<button class="warn" type="button" data-review-action="mark-ok" data-slug="${esc(record.slug)}">Mark OK</button>`
              : `<button class="subtle" type="button" data-review-action="send-review" data-slug="${esc(record.slug)}">Send to Needs Review</button>`}
          </div>
        </div>
      </section>

      <section class="detail-block">
        <h4>Overview</h4>
        <dl class="kv">
          ${lineIf("Common names", Array.isArray(record.common_names) ? record.common_names.join(", ") : record.common_name)}
          ${lineIf("Scientific name", record.scientific_name)}
          ${lineIf("Species scope", record.species_scope || record.entry_scope)}
          ${lineIf("Type", typeLabel)}
          ${lineIf("Habitat", habitats)}
          ${lineIf("Field identification", record.field_identification)}
          ${lineIf("Commonness", record.commonness)}
          ${lineIf("Season", seasonText(record))}
          ${lineIf("Overview", record.overview)}
        </dl>
      </section>

      ${record.culinary_uses ? `<section class="detail-block"><h4>Culinary uses</h4><p>${esc(record.culinary_uses)}</p></section>` : ""}
      ${medicinalUses ? `<section class="detail-block"><h4>Medicinal uses</h4><p>${esc(medicinalUses)}</p></section>` : ""}
      ${record.other_uses ? `<section class="detail-block"><h4>Other uses</h4><p>${esc(record.other_uses)}</p></section>` : ""}
      ${(record.edibility_notes || record.edibility_detail) ? `<section class="detail-block"><h4>Edibility / caution</h4><p>${esc(record.edibility_notes || record.edibility_detail)}</p></section>` : ""}
      ${dangerBlock(record)}
      ${rareBlock(record)}
      ${notes ? `<section class="detail-block"><h4>Notes</h4><p>${esc(notes)}</p></section>` : ""}
      ${generalNotes ? `<section class="detail-block"><h4>General notes</h4><p>${esc(generalNotes)}</p></section>` : ""}

      ${listBlock("Look alikes", record.look_alikes)}
      ${listBlock("Medicinal actions", medicinal.actions)}
      ${listBlock("Medicinal systems", medicinal.body_systems)}
      ${listBlock("Medicinal terms", medicinal.medical_terms)}
      ${linkBlock(record)}
    </article>
  `;
}
