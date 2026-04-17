import { TABLE_NAME } from "../constants-mainfix.js?v=2026-04-17-35";
import { escapeHtml } from "../utils.js?v=v2.0";
import { state } from "../state.js?v=v2.1-mainfix21";

function tagList(items, emptyText = "None noted") {
  return items?.length ? items.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join("") : `<span class="tag">${escapeHtml(emptyText)}</span>`;
}
function line(label, value) { if (!value) return ""; return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`; }
function listSection(title, items, emptyText = "Not documented yet") { return `<section class="detail-card section-block"><h3>${escapeHtml(title)}</h3><div class="tag-row">${tagList(items, emptyText)}</div></section>`; }
function canonicalImageKey(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const noQuery = raw.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(noQuery);
  const specialFile = decoded.match(/Special:FilePath\/(.+)$/i);
  const tail = specialFile ? specialFile[1] : decoded.split('/').pop();
  return String(tail || decoded).trim().toLowerCase();
}
function uniqueImages(images) {
  const seen = new Set();
  const out = [];
  for (const image of images || []) {
    const key = canonicalImageKey(image);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(image);
  }
  return out;
}
function resolvedImageUrl(url, width = 1200) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const decoded = decodeURIComponent(raw);
  const specialFile = decoded.match(/https?:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/(.+)$/i);
  if (specialFile?.[1]) {
    return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(specialFile[1])}?width=${width}`;
  }
  return raw;
}
function renderRelatedMushrooms(record) {
  if (record.category !== "Mushroom") return "";
  const related = (state.allRecords || []).filter(item => item.slug !== record.slug && item.mushroom_family && item.mushroom_family === record.mushroom_family);
  if (!related.length) return "";
  return `<section class="detail-card section-block"><h3>Related variants in this family</h3><div class="related-link-list">${related.map(item => `<a class="inline-chip-link" href="#detail/${encodeURIComponent(item.slug)}" data-detail-link="${escapeHtml(item.slug)}">${escapeHtml(item.display_name)}</a>`).join("")}</div></section>`;
}
function renderLookAlikes(record) {
  const raw = (record.look_alikes || []).filter(Boolean);
  if (!raw.length) return '';
  const rendered = raw.map(name => {
    const linked = (state.allRecords || []).find(item => item.display_name === name || item.common_name === name || item.slug === name);
    return linked ? `<a class="inline-chip-link" href="#detail/${encodeURIComponent(linked.slug)}" data-detail-link="${escapeHtml(linked.slug)}">${escapeHtml(linked.display_name)}</a>` : `<span class="tag">${escapeHtml(name)}</span>`;
  }).join('');
  return `<section class="detail-card section-block"><h3>Look-alikes / species to avoid</h3><div class="related-link-list">${rendered}</div></section>`;
}
function renderMushroomResearch(record) {
  const profile = record.mushroom_profile;
  if (!profile) return "";
  const sourceLinks = (record.links || []).map(link => `<li><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a></li>`).join("");
  return `<section class="detail-card section-block"><h3>Mushroom research</h3>${line("Scientific name", record.scientific_name || "")}${line("Family grouping", record.mushroom_family || "")}${line("Entry scope", (profile.entry_scope || "").replaceAll("_", " "))}${line("Edibility", (profile.edibility_status || "").replaceAll("_", " "))}${line("Caution level", (profile.caution_level || "").replaceAll("_", " "))}${line("Ecology", profile.ecology || "")}${line("Summary", profile.summary || "")}${line("Spore print", profile.spore_print || "")}${line("Season note", profile.season_note || "")}</section>${listSection("Substrate and host clues", [...(profile.substrate || []), ...(profile.wood_type || []), ...(profile.host_trees || []), profile.host_certainty ? `Host certainty: ${profile.host_certainty.replaceAll("_", " ")}` : ""].filter(Boolean), "No substrate or host clues added yet")}${listSection("Structure clues", [...(profile.underside ? [profile.underside] : []), ...(profile.ring ? [profile.ring] : []), ...(profile.texture || []), ...(profile.odor ? [profile.odor] : []), ...(profile.staining ? [profile.staining] : []), ...(profile.taste || [])].filter(Boolean), "No structure clues added yet")}${profile.processing_required?.length ? listSection("Processing / handling", profile.processing_required) : ""}<section class="detail-card section-block"><h3>Research notes</h3><ul>${(profile.research_notes || []).map(note => `<li>${escapeHtml(note)}</li>`).join("") || "<li>No extra mushroom notes yet.</li>"}</ul></section><section class="detail-card section-block"><h3>Sources</h3><ul>${sourceLinks || "<li>No source links imported.</li>"}</ul></section>`;
}
function renderImageCredits(record) {
  const credits = state.credits?.[record.slug] || [];
  if (!credits.length) return "";
  return `<section class="detail-card section-block image-credit-block"><h3>Image credits</h3><ul>${credits.map(item => `<li><strong>${escapeHtml(item.creator || 'Unknown creator')}</strong>${item.title ? ` — ${escapeHtml(item.title)}` : ''}${item.license ? ` — ${escapeHtml(item.license)}` : ''}</li>`).join('')}</ul></section>`;
}
function renderEdibilityWarning(record) {
  const detail = String(record.edibility_detail || '').toLowerCase();
  const effects = String(record.effects_on_body || '').toLowerCase();
  const needsCooking = /(must be cooked|not edible raw|cook thoroughly|raw .*irrit|proper boiling|boiled|processed before eating)/.test(detail);
  const toxic = /(poison|toxic|deadly)/.test(String(record.non_edible_severity || '').toLowerCase()) || /(poison|toxic|deadly)/.test(effects);
  if (!needsCooking && !toxic) return '';
  const message = needsCooking ? 'Preparation warning: not for raw eating.' : 'Safety warning: use caution before consumption.';
  return `<section class="detail-card section-block safety-callout ${toxic ? 'danger' : 'warning'}"><h3>${toxic ? 'Safety warning' : 'Preparation warning'}</h3><p>${escapeHtml(message)}</p></section>`;
}
export function renderDetail(record) {
  const images = uniqueImages(record.images || []);
  const gallery = images.length ? images.map(path => `<img src="${encodeURI(resolvedImageUrl(path, 1200))}" alt="${escapeHtml(record.display_name)}">`).join("") : `<div class="thumb placeholder" style="width:100%;height:220px;">No image imported</div>`;
  const genericLinks = !record.mushroom_profile && record.links?.length ? `<section class="detail-card section-block"><h3>Source links</h3><ul>${record.links.map(link => `<li><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a></li>`).join("")}</ul></section>` : "";
  return `<div class="detail-layout"><div class="detail-gallery">${gallery}${renderImageCredits(record)}</div><div class="detail-grid"><section class="detail-card"><span class="category-pill">${escapeHtml(record.category)}</span><h2 style="margin-top:10px;">${escapeHtml(record.display_name)}</h2><p style="margin-top:8px;">${escapeHtml(record.common_name || "No alternate common name imported.")}</p>${record.scientific_name ? `<p class="small-note"><strong>${escapeHtml(record.scientific_name)}</strong></p>` : ""}</section>${renderEdibilityWarning(record)}<section class="detail-card section-block"><h3>Culinary uses</h3><p>${escapeHtml(record.culinary_uses || "Not provided in the imported sheet.")}</p></section><section class="detail-card section-block"><h3>Medicinal uses</h3><p>${escapeHtml(record.medicinal_uses || "Not provided in the imported sheet.")}</p></section>${record.edibility_detail ? `<section class="detail-card section-block"><h3>Edibility detail</h3><p>${escapeHtml(record.edibility_detail)}</p></section>` : ''}${record.other_uses ? `<section class="detail-card section-block"><h3>Other uses</h3><p>${escapeHtml(record.other_uses)}</p></section>` : ''}${record.changes_over_time ? `<section class="detail-card section-block"><h3>Changes over time</h3><p>${escapeHtml(record.changes_over_time)}</p></section>` : ''}${(record.non_edible_severity || record.effects_on_body) ? `<section class="detail-card section-block"><h3>Risk / body effects</h3>${line('Severity', record.non_edible_severity || '')}${line('Affected systems', (record.affected_systems || []).join(', '))}${line('Effects', record.effects_on_body || '')}</section>` : ''}<section class="detail-card section-block"><h3>Field clues</h3><div class="tag-row">${tagList([...(record.habitat||[]), ...(record.observedPart||[]), ...(record.size||[]), ...(record.taste||[])], "No field traits tagged yet")}</div></section><section class="detail-card section-block"><h3>Mushroom clues</h3><div class="tag-row">${tagList([...(record.substrate||[]), ...(record.treeType||[]), ...(record.hostTree||[]), ...(record.ring||[]), ...(record.underside||[]), ...(record.texture||[]), ...(record.smell||[]), ...(record.staining||[])], "No mushroom traits tagged yet")}</div></section><section class="detail-card section-block"><h3>Medicinal tags</h3><div class="tag-row">${tagList([...(record.medicinalAction||[]), ...(record.medicinalSystem||[]), ...(record.medicinalTerms||[])], "No medicinal tags yet")}</div></section><section class="detail-card section-block"><h3>Seasonality</h3><div class="tag-row">${tagList(record.months_available, "No month data")}</div></section><section class="detail-card section-block"><h3>Needs review</h3><div class="tag-row">${tagList(record.reviewReasons, "Nothing flagged")}</div></section><section class="detail-card section-block"><h3>Habitat / where to look</h3><p>${escapeHtml(record.habitat_detail || "No habitat paragraph imported yet.")}</p></section>${record.comparison_notes ? `<section class="detail-card section-block"><h3>How to separate it from look-alikes</h3><p>${escapeHtml(record.comparison_notes)}</p></section>` : ""}${record.commonness ? `<section class="detail-card section-block"><h3>Commonness</h3><p>${escapeHtml(record.commonness)}${record.commonness_basis ? ` — ${escapeHtml(record.commonness_basis)}` : ""}</p></section>` : ""}<section class="detail-card section-block"><h3>Notes</h3><p>${escapeHtml(record.notes || "No extra notes imported.")}</p></section>${renderLookAlikes(record)}${renderRelatedMushrooms(record)}${renderMushroomResearch(record)}${genericLinks}<p class="small-note">Supabase table target: <strong>${TABLE_NAME}</strong></p></div></div>`;
}
