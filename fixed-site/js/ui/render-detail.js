import { esc } from "../lib/escape.js";
import { getMedicinalData } from "../lib/merge.js";
import { renderImageSlot } from "../lib/image-slot.js";

function lineIf(label, value) {
  if (value === undefined || value === null || value === "") return "";
  return `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`;
}

function listBlock(title, values) {
  if (!Array.isArray(values) || !values.length) return "";
  return `<section class="detail-block"><h4>${esc(title)}</h4><ul class="list-tight">${values.map(v => `<li>${esc(v)}</li>`).join("")}</ul></section>`;
}

function valuesToText(value) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : String(value || "").trim();
}

function monthsText(record) {
  if (Array.isArray(record.season_months) && record.season_months.length) {
    return record.season_months.join(", ");
  }
  return Array.isArray(record.months_available) ? record.months_available.join(", ") : "";
}

function habitatsText(record) {
  const habitats = Array.isArray(record.habitats) && record.habitats.length ? record.habitats : record.habitat;
  return valuesToText(habitats || record.habitat_detail);
}

function renderLinks(useLinks = [], legacyLinks = []) {
  const links = Array.isArray(useLinks) && useLinks.length ? useLinks : [];
  if (links.length) {
    return `<section class="detail-block"><h4>Links</h4><ul class="list-tight">${links.map(link => `
      <li>
        <a href="${esc(link.url || "")}" target="_blank" rel="noreferrer">${esc(link.label || link.url || "")}</a>
        ${link.link_type ? ` <span class="muted small">(${esc(link.link_type.replaceAll("_", " "))})</span>` : ""}
      </li>
    `).join("")}</ul></section>`;
  }

  const rawLinks = Array.isArray(legacyLinks) ? legacyLinks.filter(Boolean) : [];
  if (!rawLinks.length) return "";
  return `<section class="detail-block"><h4>Links</h4><ul class="list-tight">${rawLinks.map(url => `<li><a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(url)}</a></li>`).join("")}</ul></section>`;
}

export function renderDetail(record) {
  const medicinal = getMedicinalData(record);
  const medicinalUses = medicinal.summary || "";
  const rare = record.rare_profile || null;
  const typeLabel = record.foraging_class || record.category || record.group || "";
  const months = monthsText(record);
  const habitats = habitatsText(record);
  const commonNames = Array.isArray(record.common_names) && record.common_names.length
    ? record.common_names.join(", ")
    : record.common_name;

  return `
    <article class="detail-grid">
      <section class="detail-block detail-hero">
        ${renderImageSlot(record, "detail")}
        <div>
          <h3>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</h3>
          <p class="muted">${esc(record.scientific_name || "")}</p>
          <div class="record-meta">
            ${typeLabel ? `<span class="tag">${esc(typeLabel)}</span>` : ""}
            ${record.lane ? `<span class="tag">${esc(record.lane)}</span>` : ""}
            ${record.commonness ? `<span class="tag">${esc(record.commonness)}</span>` : ""}
            ${rare?.status ? `<span class="tag warn">${esc(rare.status)}</span>` : ""}
            ${rare?.legal_status ? `<span class="tag">${esc(rare.legal_status)}</span>` : ""}
            ${rare?.sensitive_location ? `<span class="tag danger">Sensitive location</span>` : ""}
            ${record.non_edible_severity ? `<span class="tag danger">${esc(record.non_edible_severity)}</span>` : ""}
            ${record.review_status === "needs_review" ? `<span class="tag review">Needs review</span>` : ""}
          </div>
          <div class="quick-actions">
            ${record.review_status === "needs_review"
              ? `<button class="warn" type="button" data-review-action="mark-ok" data-slug="${esc(record.slug)}">Mark OK</button>`
              : `<button class="subtle" type="button" data-review-action="send-review" data-slug="${esc(record.slug)}">Send to Needs Review</button>`}
          </div>
        </div>
      </section>

      <section class="detail-block">
        <h4>Overview</h4>
        <dl class="kv">
          ${lineIf("Common names", commonNames)}
          ${lineIf("Scientific name", record.scientific_name)}
          ${lineIf("Species scope", record.species_scope || record.entry_scope)}
          ${lineIf("Type", record.kingdom_type || record.record_type)}
          ${lineIf("Foraging class", record.foraging_class)}
          ${lineIf("Lane", record.lane)}
          ${lineIf("Season", months)}
          ${lineIf("Habitat", habitats)}
          ${lineIf("Field identification", record.field_identification)}
          ${lineIf("Food quality", record.food_quality)}
          ${lineIf("Commonness", record.commonness)}
          ${lineIf("Host filter tokens", valuesToText(record.host_filter_tokens))}
        </dl>
        ${record.overview ? `<p>${esc(record.overview)}</p>` : ""}
      </section>

      ${rare ? `
        <section class="detail-block">
          <h4>Rare / tracked status</h4>
          <dl class="kv">
            ${lineIf("Status", rare.status)}
            ${lineIf("Legal status", rare.legal_status)}
            ${lineIf("U.P. relevance", rare.up_relevance)}
          </dl>
          ${rare.reason ? `<p><strong>Why tracked:</strong> ${esc(rare.reason)}</p>` : ""}
          ${rare.field_marks ? `<p><strong>Field marks:</strong> ${esc(rare.field_marks)}</p>` : ""}
          ${rare.care_note ? `<p><strong>Care note:</strong> ${esc(rare.care_note)}</p>` : ""}
          ${rare.sensitive_location ? `<p><strong>Location caution:</strong> Keep exact spots vague for sensitive populations.</p>` : ""}
        </section>
      ` : ""}

      ${record.culinary_uses ? `<section class="detail-block"><h4>Culinary uses</h4><p>${esc(record.culinary_uses)}</p></section>` : ""}
      ${medicinalUses ? `<section class="detail-block"><h4>Medicinal uses</h4><p>${esc(medicinalUses)}</p></section>` : ""}
      ${record.other_uses ? `<section class="detail-block"><h4>Other uses</h4><p>${esc(record.other_uses)}</p></section>` : ""}
      ${(record.edibility_notes || record.edibility_detail) ? `<section class="detail-block"><h4>Edibility / caution</h4><p>${esc(record.edibility_notes || record.edibility_detail)}</p></section>` : ""}
      ${record.notes ? `<section class="detail-block"><h4>Notes</h4><p>${esc(record.notes)}</p></section>` : ""}
      ${record.general_notes ? `<section class="detail-block"><h4>General notes</h4><p>${esc(record.general_notes)}</p></section>` : ""}

      ${listBlock("Look-alikes", record.look_alikes || record.lookalikes)}
      ${listBlock("Review reasons", record.reviewReasons || record.review_reasons)}
      ${listBlock("Search aliases", record.search_aliases)}
      ${listBlock("Medicinal actions", medicinal.actions || record.medicinalAction)}
      ${listBlock("Medicinal systems", medicinal.body_systems || record.medicinalSystem)}
      ${listBlock("Medicinal terms", medicinal.medical_terms || record.medicinalTerms)}
      ${rare?.key_features?.length ? listBlock("Key features", rare.key_features) : ""}

      ${renderLinks(record.use_links, record.links)}
    </article>
  `;
}
