import { esc } from "../lib/escape.js";
import { hasRealMedicinalText } from "../lib/merge.js";
import { renderImageSlot } from "../lib/image-slot.js";

function lineIf(label, value) {
  if (value === undefined || value === null || value === "") return "";
  return `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`;
}

function listBlock(title, values) {
  if (!Array.isArray(values) || !values.length) return "";
  return `<section class="detail-block"><h4>${esc(title)}</h4><ul class="list-tight">${values.map(v => `<li>${esc(v)}</li>`).join("")}</ul></section>`;
}

export function renderDetail(record) {
  const typeLabel = record.category || record.group || "";
  const months = Array.isArray(record.months_available) ? record.months_available.join(", ") : "";
  const links = Array.isArray(record.links) ? record.links : [];
  const medicinalUses = hasRealMedicinalText(record.medicinal_uses) ? record.medicinal_uses : "";

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
          ${lineIf("Common name", record.common_name)}
          ${lineIf("Scientific name", record.scientific_name)}
          ${lineIf("Entry scope", record.entry_scope)}
          ${lineIf("Category", record.category || record.group)}
          ${lineIf("Lane", record.lane)}
          ${lineIf("Season", months)}
          ${lineIf("Primary use", record.primary_use)}
          ${lineIf("Food role", record.food_role)}
          ${lineIf("Food quality", record.food_quality)}
          ${lineIf("Commonness", record.commonness)}
          ${lineIf("Habitat", Array.isArray(record.habitat) ? record.habitat.join(", ") : (record.habitat_detail || record.habitat))}
          ${lineIf("Host filter tokens", Array.isArray(record.host_filter_tokens) ? record.host_filter_tokens.join(", ") : "")}
        </dl>
      </section>

      ${record.culinary_uses ? `<section class="detail-block"><h4>Culinary uses</h4><p>${esc(record.culinary_uses)}</p></section>` : ""}
      ${medicinalUses ? `<section class="detail-block"><h4>Medicinal uses</h4><p>${esc(medicinalUses)}</p></section>` : ""}
      ${record.other_uses ? `<section class="detail-block"><h4>Other uses</h4><p>${esc(record.other_uses)}</p></section>` : ""}
      ${record.edibility_detail ? `<section class="detail-block"><h4>Edibility / caution</h4><p>${esc(record.edibility_detail)}</p></section>` : ""}
      ${record.notes ? `<section class="detail-block"><h4>Notes</h4><p>${esc(record.notes)}</p></section>` : ""}
      ${record.general_notes ? `<section class="detail-block"><h4>General notes</h4><p>${esc(record.general_notes)}</p></section>` : ""}

      ${listBlock("Look-alikes", record.look_alikes || record.lookalikes)}
      ${listBlock("Review reasons", record.reviewReasons)}
      ${listBlock("Search aliases", record.search_aliases)}
      ${listBlock("Medicinal actions", record.medicinalAction)}
      ${listBlock("Medicinal systems", record.medicinalSystem)}
      ${listBlock("Medicinal terms", record.medicinalTerms)}

      ${links.length ? `<section class="detail-block"><h4>Links</h4><ul class="list-tight">${links.map(url => `<li><a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(url)}</a></li>`).join("")}</ul></section>` : ""}
    </article>
  `;
}
