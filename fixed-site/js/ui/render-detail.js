import { esc } from "../lib/escape.js";
import { getMedicinalData, isBuildNoteText, cleanUserFacingText } from "../lib/merge.js?v=v4.2.29-r2026-04-24-filter-countfix1";
import { renderImageSlot } from "../lib/image-slot.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function clean(value) {
  return cleanUserFacingText(value);
}

function slugifyLookup(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function lineIf(label, value) {
  const text = clean(value);
  if (!text) return "";
  return `<dt>${esc(label)}</dt><dd>${esc(text)}</dd>`;
}

function listBlock(title, values) {
  if (!Array.isArray(values) || !values.length) return "";
  const cleaned = values.map(clean).filter(Boolean);
  if (!cleaned.length) return "";
  return `<section class="detail-block"><h4>${esc(title)}</h4><ul class="list-tight">${cleaned.map(v => `<li>${esc(v)}</li>`).join("")}</ul></section>`;
}

function lookAlikeBlock(record) {
  const cleaned = Array.isArray(record.look_alikes) ? record.look_alikes.map(clean).filter(Boolean) : [];
  const notes = clean(record.look_alike_notes);
  if (!cleaned.length && !notes) return "";
  const items = cleaned.map((name) => {
    const slug = slugifyLookup(name);
    return `<li><button class="subtle" type="button" data-detail="${esc(slug)}">${esc(name)}</button></li>`;
  }).join("");
  return `
    <section class="detail-block">
      <h4>Look-alikes / easily confused</h4>
      ${notes ? `<p>${esc(notes)}</p>` : ""}
      ${items ? `<ul class="list-tight">${items}</ul>` : ""}
    </section>
  `;
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

function isClearlyNonPoisonous(record, text = "") {
  const ed = String(record.edibility_status || "").trim().toLowerCase();
  const hay = `${record.non_edible_severity || ""} ${record.danger_level || ""} ${record.poisoning_effects || ""} ${record.toxicity_notes || ""} ${text}`.toLowerCase();
  if (ed === "poisonous" || ed === "deadly") return false;
  return /not poisonous|non[- ]poisonous|not treated here as poisonous|bitter[, ]+not poisonous|not toxic/.test(hay);
}

function dangerBlock(record) {
  const ed = String(record.edibility_status || "").trim().toLowerCase();
  const severity = clean(record.non_edible_severity);
  const level = clean(record.danger_level || (ed === "deadly" ? "Deadly" : ed === "poisonous" ? "Poisonous" : severity));
  const effects = clean(record.poisoning_effects || record.toxicity_notes || "");
  const affected = Array.isArray(record.affected_systems) ? record.affected_systems.map(clean).filter(Boolean) : [];
  const notes = clean(record.edibility_notes || record.edibility_detail || "");
  const dangerHay = `${ed} ${severity} ${level} ${effects} ${notes}`;
  const isDanger = ed === "poisonous"
    || ed === "deadly"
    || /poison|deadly|toxic|danger|fatal|liver|kidney|neurolog|gastrointestinal|gi distress|vomit|diarrhea/i.test(dangerHay);

  if (isClearlyNonPoisonous(record, dangerHay) && !/deadly|fatal|liver|kidney|neurolog/i.test(dangerHay)) return "";
  if (!isDanger && !effects && !affected.length) return "";

  const fallbackEffects = effects || (ed === "deadly"
    ? "Potentially life-threatening poisoning. Avoid entirely."
    : "Can cause poisoning or serious illness. Treat as unsafe to eat.");
  const seriousness = clean(record.danger_seriousness) || (ed === "deadly"
    ? "High seriousness: this entry should be treated as potentially life-threatening, not as a beginner mistake."
    : ed === "poisonous"
      ? "Seriousness varies by species and amount eaten, but this is not a casual caution entry. Avoid eating it."
      : "Unsafe or not recommended as food; review the caution notes before handling or comparing with edible species.");

  return `
    <section class="detail-block danger-detail-block">
      <h4>Danger / poisoning</h4>
      <dl class="kv">
        ${lineIf("Danger level", level || (ed === "deadly" ? "Deadly" : "Poisonous / unsafe"))}
        ${lineIf("Expected effects / symptoms", fallbackEffects)}
        ${lineIf("Seriousness", seriousness)}
        ${lineIf("Body systems affected", affected.join(", "))}
        ${lineIf("Notes", notes)}
      </dl>
    </section>
  `;
}

function linkBlock(record) {
  const links = Array.isArray(record.use_links) ? record.use_links : (Array.isArray(record.links) ? record.links.map((url) => ({ label: url, url })) : []);
  if (!links.length) return "";
  const items = links.map((item) => {
    const url = typeof item === "string" ? item : item.url;
    const label = clean(typeof item === "string" ? item : (item.label || item.url));
    if (!url || !label) return "";
    return `<li><a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)}</a></li>`;
  }).filter(Boolean);
  if (!items.length) return "";
  return `<section class="detail-block"><h4>Links</h4><ul class="list-tight">${items.join("")}</ul></section>`;
}

function edibleUseBlock(record) {
  const edibleUse = record.edible_use || null;
  if (!edibleUse?.has_ingestible_use) return "";
  return `
    <section class="detail-block">
      <h4>How it is edible / food-use prepared</h4>
      <dl class="kv">
        ${lineIf("Use form", edibleUse.method || "Food / beverage use")}
        ${lineIf("Preparation required", edibleUse.preparation_required ? "Yes — use the food/beverage preparation described for this species." : "Use the food/beverage form described for this species.")}
        ${lineIf("Use notes", edibleUse.notes)}
      </dl>
    </section>
  `;
}

export function renderDetail(record) {
  const typeLabel = record.foraging_class ? String(record.foraging_class).replaceAll("_", " ") : (record.category || record.group || "");
  const medicinal = getMedicinalData(record);
  const medicinalUses = clean(medicinal.summary || "");
  const medicinalWarnings = clean(medicinal.warnings || "");
  const habitats = Array.isArray(record.habitats) && record.habitats.length ? record.habitats.join(", ") : (Array.isArray(record.habitat) ? record.habitat.join(", ") : (record.habitat_detail || ""));
  const culinaryUses = clean(record.culinary_uses);
  const otherUses = clean(record.other_uses);
  const edibilityNotes = clean(record.edibility_notes || record.edibility_detail);
  const notes = !isBuildNoteText(record.notes) ? clean(record.notes) : "";
  const generalNotes = !isBuildNoteText(record.general_notes) ? clean(record.general_notes) : "";
  const overview = clean(record.overview);
  const fieldIdentification = clean(record.field_identification);
  const edibleUse = record.edible_use || null;

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
            ${record.non_edible_severity && !edibleUse?.has_ingestible_use ? `<span class="tag danger">${esc(record.non_edible_severity)}</span>` : ""}
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
          ${lineIf("Field identification", fieldIdentification)}
          ${lineIf("Commonness", record.commonness)}
          ${lineIf("Season", seasonText(record))}
          ${lineIf("Overview", overview)}
        </dl>
      </section>

      ${edibleUseBlock(record)}
      ${culinaryUses ? `<section class="detail-block"><h4>Culinary uses</h4><p>${esc(culinaryUses)}</p></section>` : ""}
      ${medicinalUses ? `<section class="detail-block"><h4>Medicinal uses</h4><p>${esc(medicinalUses)}</p></section>` : ""}
      ${medicinalWarnings ? `<section class="detail-block"><h4>Medicinal cautions</h4><p>${esc(medicinalWarnings)}</p></section>` : ""}
      ${otherUses ? `<section class="detail-block"><h4>Other uses</h4><p>${esc(otherUses)}</p></section>` : ""}
      ${edibilityNotes ? `<section class="detail-block"><h4>Edibility / caution</h4><p>${esc(edibilityNotes)}</p></section>` : ""}
      ${dangerBlock(record)}
      ${rareBlock(record)}
      ${notes ? `<section class="detail-block"><h4>Notes</h4><p>${esc(notes)}</p></section>` : ""}
      ${generalNotes ? `<section class="detail-block"><h4>General notes</h4><p>${esc(generalNotes)}</p></section>` : ""}

      ${lookAlikeBlock(record)}
      ${listBlock("Medicinal actions", medicinal.actions)}
      ${listBlock("Medicinal systems", medicinal.body_systems)}
      ${listBlock("Medicinal terms", medicinal.medical_terms)}
      ${linkBlock(record)}
    </article>
  `;
}
